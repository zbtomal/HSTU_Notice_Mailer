import asyncio
import logging
import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USER)
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() in {"1", "true", "yes", "on"}


def build_notice_email_body(title: str, date: str | None, link: str) -> str:
    date_text = date or "Not specified"
    return (
        "A new notice has been published on the HSTU website.\n\n"
        f"Title: {title}\n"
        f"Date: {date_text}\n"
        f"Notice Link: {link}\n"
    )


def send_email_sync(to_email: str, subject: str, body: str) -> None:
    if not SMTP_HOST or not SMTP_FROM_EMAIL:
        logger.warning("SMTP configuration is incomplete. Skipping email to %s", to_email)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM_EMAIL
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
            if SMTP_USE_TLS:
                server.starttls()
            if SMTP_USER and SMTP_PASSWORD:
                server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        logger.info("Email sent to %s", to_email)
    except Exception as exc:  # pragma: no cover
        logger.exception("Failed to send email to %s: %s", to_email, exc)


async def send_notice_to_many(recipients: list[str], title: str, date: str | None, link: str) -> None:
    if not recipients:
        return

    subject = "New Notice Published on HSTU Website"
    body = build_notice_email_body(title=title, date=date, link=link)

    tasks = [asyncio.to_thread(send_email_sync, recipient, subject, body) for recipient in recipients]
    await asyncio.gather(*tasks, return_exceptions=True)
