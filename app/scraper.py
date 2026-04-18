import hashlib
import logging
import re
from typing import Iterable
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup, Tag

from app.schemas import NoticeScraped

logger = logging.getLogger(__name__)

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


def _extract_date(text: str) -> str | None:
    match = DATE_PATTERN.search(text)
    return match.group(1) if match else None


def _extract_download_link(container: Tag | None, notice_link: str) -> str | None:
    if not container:
        return None

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


def _row_candidates(soup: BeautifulSoup) -> Iterable[Tag]:
    rows = soup.select("table tbody tr")
    if rows:
        return rows

    cards = soup.select(".notice-item, .single_notice, .card, article, li")
    return cards


def scrape_latest_notices() -> list[NoticeScraped]:
    logger.info("Scraping notices from %s", NOTICE_URL)
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; HSTUNoticeMailer/1.0; +https://hstu.ac.bd)",
    }

    try:
        response = requests.get(NOTICE_URL, headers=headers, timeout=20)
        response.raise_for_status()
    except requests.RequestException as exc:
        logger.exception("Failed to fetch notice page: %s", exc)
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    notices: list[NoticeScraped] = []
    seen_notice_ids: set[str] = set()

    for container in _row_candidates(soup):
        anchor = container.select_one("a[href]")
        if not anchor:
            continue

        href = anchor.get("href", "").strip()
        if not href:
            continue

        notice_link = urljoin(NOTICE_URL, href)
        if "notice" not in notice_link.lower():
            continue

        title = _safe_text(anchor)
        if not title:
            continue

        container_text = _safe_text(container)
        date = _extract_date(container_text)

        description = container_text
        if title in description:
            description = description.replace(title, "", 1).strip(" -:\n\t")

        notice_id = _extract_notice_id(notice_link, title, date)
        if notice_id in seen_notice_ids:
            continue

        seen_notice_ids.add(notice_id)
        notices.append(
            NoticeScraped(
                notice_id=notice_id,
                title=title,
                date=date,
                description=description[:1200] if description else None,
                notice_link=notice_link,
                download_link=_extract_download_link(container, notice_link),
            )
        )

    if not notices:
        logger.warning("Scraper did not find any notice entries.")

    logger.info("Scraper found %d notice candidates.", len(notices))
    return notices
