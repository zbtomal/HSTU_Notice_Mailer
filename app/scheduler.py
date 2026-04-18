import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.email_service import send_notice_to_many
from app.models import Notice, User
from app.scraper import scrape_latest_notices

logger = logging.getLogger(__name__)


async def run_scrape_job() -> None:
    logger.info("Running scheduled scrape job.")
    db: Session = SessionLocal()

    try:
        latest_notice = db.query(Notice).order_by(Notice.created_at.desc()).first()
        latest_stored_notice_id = latest_notice.notice_id if latest_notice else None

        scraped_notices = scrape_latest_notices()
        if not scraped_notices:
            return

        new_notices: list[Notice] = []
        for scraped in scraped_notices:
            if latest_stored_notice_id and scraped.notice_id == latest_stored_notice_id:
                break

            exists = db.query(Notice).filter(Notice.notice_id == scraped.notice_id).first()
            if exists:
                continue

            record = Notice(
                notice_id=scraped.notice_id,
                title=scraped.title,
                date=scraped.date,
                description=scraped.description,
                notice_link=scraped.notice_link,
                download_link=scraped.download_link,
            )
            db.add(record)
            new_notices.append(record)

        if not new_notices:
            logger.info("No new notices found in this cycle.")
            db.commit()
            return

        db.commit()
        logger.info("Stored %d new notices.", len(new_notices))

        recipients = [row.email for row in db.query(User.email).all()]
        if not recipients:
            logger.info("No subscribers found; email notification skipped.")
            return

        for notice in reversed(new_notices):
            await send_notice_to_many(
                recipients=recipients,
                title=notice.title,
                date=notice.date,
                link=notice.notice_link,
            )
    except Exception as exc:  # pragma: no cover
        db.rollback()
        logger.exception("Scheduled scrape job failed: %s", exc)
    finally:
        db.close()


def create_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler(timezone="Asia/Dhaka")
    scheduler.add_job(
        run_scrape_job,
        trigger=IntervalTrigger(minutes=10),
        id="hstu_notice_scraper_job",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    return scheduler
