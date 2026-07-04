import hashlib
import logging
import re
import os
from datetime import datetime
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup, Tag
from dateutil import parser as date_parser

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("scraper")

NOTICE_URL = "https://hstu.ac.bd/page/notice_all"
DATE_PATTERN = re.compile(
    r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4})",
    re.IGNORECASE,
)

def _extract_notice_id(notice_link: str, title: str, date: str | None) -> str:
    match = re.search(r"(\d+)(?!.*\d)", notice_link)
    if match:
        return match.group(1)

    fallback_text = f"{notice_link}|{title}|{date or ''}"
    return hashlib.md5(fallback_text.encode("utf-8")).hexdigest()[:24]

def _safe_text(tag: Tag | None) -> str:
    if not tag:
        return ""
    return " ".join(tag.get_text(" ", strip=True).split())

def _extract_date(container: Tag) -> str | None:
    date_tag = container.select_one(".date, .date-wrapper, .time")
    if date_tag:
        text = _safe_text(date_tag)
        match = DATE_PATTERN.search(text)
        if match:
            return match.group(1)

    match = DATE_PATTERN.search(_safe_text(container))
    return match.group(1) if match else None

def _parse_date_safe(date_str: str | None) -> datetime:
    if not date_str:
        return datetime.min
    try:
        return date_parser.parse(date_str)
    except Exception:
        return datetime.min

def _extract_download_link(container: Tag, notice_link: str) -> str | None:
    keywords = ("download", "pdf", "attachment", "file")
    for link in container.select("a[href]"):
        href = link.get("href", "").strip()
        if not href:
            continue
        lower_href = href.lower()
        lower_text = _safe_text(link).lower()
        if any(key in lower_href or key in lower_text for key in keywords):
            return urljoin(notice_link, href)
    return None

def _row_candidates(soup: BeautifulSoup) -> list:
    rows = soup.select("table tbody tr")
    if rows:
        return rows
    cards = soup.select(".notice-item, .single_notice, .card, article, li")
    return cards

def scrape_latest_notices() -> list[dict]:
    logger.info("Scraping notices from %s", NOTICE_URL)
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; HSTUNoticeMailer/1.0; +https://hstu.ac.bd)",
    }

    try:
        with requests.Session() as session:
            session.trust_env = False
            response = session.get(NOTICE_URL, headers=headers, timeout=20)
            response.raise_for_status()
    except requests.RequestException as exc:
        logger.exception("Failed to fetch notice page: %s", exc)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    notices: list[dict] = []
    seen_notice_ids: set[str] = set()

    for container in _row_candidates(soup):
        title_tag = container.select_one(".note, .title, h5, h4, h3")
        title = _safe_text(title_tag)

        anchor = (title_tag.select_one("a[href]") if title_tag else None) or container.select_one("a[href]")
        if not anchor:
            continue

        href = anchor.get("href", "").strip()
        if not href or href.startswith("#"):
            continue

        if not title:
            title = _safe_text(anchor)

        if not title or title.lower() == "download":
            container_text = _safe_text(container)
            if container_text:
                temp_text = container_text.lower().replace("download", "").strip()
                if temp_text:
                    title = container_text[:200]

        if not title:
            continue

        notice_link = urljoin(NOTICE_URL, href)
        date_str = _extract_date(container)
        date_parsed = _parse_date_safe(date_str)

        container_text = _safe_text(container)
        description = container_text
        if title in description:
            description = description.replace(title, "", 1).strip(" -:\n\t")

        notice_id = _extract_notice_id(notice_link, title, date_str)
        if notice_id in seen_notice_ids:
            continue

        seen_notice_ids.add(notice_id)
        
        # Determine category from title keywords
        category = "General"
        title_lower = title.lower()
        if "cse" in title_lower or "computer" in title_lower:
            category = "CSE"
        elif "admission" in title_lower:
            category = "Admission"
        elif "exam" in title_lower or "routine" in title_lower:
            category = "Exam"
            
        notices.append({
            "notice_id": notice_id,
            "title": title,
            "date_str": date_str,
            "notice_date_parsed": date_parsed.date().isoformat() if date_parsed != datetime.min else None,
            "description": description[:1200] if description else None,
            "notice_link": notice_link,
            "download_link": _extract_download_link(container, notice_link),
            "category": category
        })

    if not notices:
        logger.warning("Scraper did not find any notice entries.")
        return []

    notices.sort(key=lambda x: _parse_date_safe(x["date_str"]), reverse=True)
    logger.info("Scraper found and sorted %d notice candidates.", len(notices))
    return notices

def main():
    api_base_url = os.getenv("API_BASE_URL")
    if not api_base_url:
        logger.error("API_BASE_URL environment variable is not set!")
        exit(1)
        
    api_url = f"{api_base_url.rstrip('/')}/api/v1/scraper/webhook"
    
    notices = scrape_latest_notices()
    if not notices:
        logger.info("No notices scraped. Exiting.")
        return
        
    logger.info("Sending %d notices to webhook at %s...", len(notices), api_url)
    try:
        headers = {}
        scraper_token = os.getenv("SCRAPER_API_KEY")
        if scraper_token:
            headers["Authorization"] = f"Bearer {scraper_token}"
            
        response = requests.post(api_url, json=notices, headers=headers, timeout=30)
        response.raise_for_status()
        logger.info("Webhook success response: %s", response.json())
    except requests.RequestException as e:
        logger.error("Failed to send notices to webhook: %s", e)
        exit(1)

if __name__ == "__main__":
    main()
