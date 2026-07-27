import asyncio
import os
import sys
import logging
from datetime import date

# Ensure project root is in python path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from sqlalchemy import select, desc, func
from app.database import AsyncSessionLocal
from app.models.notice import Notice
from app.models.category import Category
from app.models.user import User, user_subscriptions
from app.services.email_services import send_notice_email
from scraper import scrape_latest_notices

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("cron_worker")

async def get_or_create_category(db, name: str) -> Category:
    result = await db.execute(select(Category).where(Category.name == name))
    category = result.scalar_one_or_none()
    if not category:
        category = Category(name=name)
        db.add(category)
        await db.commit()
        await db.refresh(category)
    return category

async def run_cron():
    logger.info("Starting automated cron scrape and email task...")
    
    # Ensure database URL is loaded correctly
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL environment variable is not set!")
        return
        
    async with AsyncSessionLocal() as db:
        # 1. Fetch latest notice ID from DB
        result = await db.execute(
            select(Notice.notice_id)
            .order_by(desc(Notice.notice_date_parsed), desc(Notice.id))
            .limit(1)
        )
        last_notice_id = result.scalar_one_or_none()
        logger.info("Last notice ID in DB: %s", last_notice_id)
        
        # 2. Scrape live website
        notices = scrape_latest_notices()
        if not notices:
            logger.info("No notices found on live site.")
            return
            
        # 3. Filter new notices
        new_notices = []
        if last_notice_id:
            for notice in notices:
                if notice["notice_id"] == last_notice_id:
                    break
                new_notices.append(notice)
        else:
            new_notices = notices
            
        if not new_notices:
            logger.info("No new notices to process.")
            return
            
        logger.info("Found %d new notices to process.", len(new_notices))
        
        # 4. Fetch all active subscribers
        subscribers_result = await db.execute(
            select(user_subscriptions.c.category_id, User.email)
            .join(User, User.id == user_subscriptions.c.user_id)
            .where(User.is_active == True, User.is_email_paused == False)
        )
        category_subscribers = {}
        for cat_id, email in subscribers_result.all():
            if cat_id not in category_subscribers:
                category_subscribers[cat_id] = set()
            category_subscribers[cat_id].add(email)
            
        # Get 'All' category
        all_cat_res = await db.execute(select(Category).where(Category.name == "All"))
        all_cat = all_cat_res.scalar_one_or_none()
        all_subscribers = category_subscribers.get(all_cat.id, set()) if all_cat else set()
        
        # Cache categories map
        categories_result = await db.execute(select(Category))
        categories_map = {c.name: c for c in categories_result.scalars().all()}
        
        # Process in reverse (oldest new notice first)
        # We check if this is the first run (initial seeding) to avoid spamming
        count_result = await db.execute(select(func.count(Notice.id)))
        is_first_run = count_result.scalar() == 0
        should_send_emails = not is_first_run
        
        for item in reversed(new_notices):
            category_name = item.get("category", "Office & Section")
            if category_name not in categories_map:
                category = await get_or_create_category(db, category_name)
                categories_map[category_name] = category
            else:
                category = categories_map[category_name]
                
            parsed_date = None
            parsed_date_str = item.get("notice_date_parsed")
            if parsed_date_str:
                try:
                    parsed_date = date.fromisoformat(parsed_date_str)
                except ValueError:
                    pass
                    
            db_notice = Notice(
                notice_id=item["notice_id"],
                title=item.get("title", "")[:500],
                date_str=item.get("date_str")[:100] if item.get("date_str") else None,
                notice_date_parsed=parsed_date,
                description=item.get("description"),
                notice_link=item.get("notice_link", "")[:1000],
                download_link=item.get("download_link")[:1000] if item.get("download_link") else None,
                category_id=category.id
            )
            
            # Safe insert notice
            try:
                async with db.begin_nested():
                    db.add(db_notice)
                    await db.flush()
                logger.info("Saved notice: %s", db_notice.title)
                
                # Send emails
                if should_send_emails:
                    cat_subs = category_subscribers.get(category.id, set())
                    target_emails = cat_subs.union(all_subscribers)
                    for email in target_emails:
                        logger.info("Sending email to %s for notice: %s", email, db_notice.title)
                        # Send emails sequentially/synchronously since this runs in a cron worker process
                        sent = await send_notice_email(
                            to_email=email,
                            notice_title=db_notice.title,
                            notice_link=db_notice.notice_link
                        )
                        if sent:
                            logger.info("Successfully sent email to %s", email)
                        else:
                            logger.error("Failed to send email to %s", email)
            except Exception as e:
                logger.error("Failed to insert notice or send email: %s", e)
                
        await db.commit()
        logger.info("Cron worker finished successfully.")

if __name__ == "__main__":
    asyncio.run(run_cron())
