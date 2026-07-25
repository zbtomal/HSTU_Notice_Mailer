from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import BackgroundTasks
from app.models.notice import Notice
from app.models.category import Category
from app.models.user import User, user_subscriptions
from app.services.email_services import send_notice_email

async def get_or_create_category(db: AsyncSession, name: str) -> Category:
    result = await db.execute(select(Category).where(Category.name == name))
    category = result.scalar_one_or_none()
    if not category:
        category = Category(name=name)
        db.add(category)
        await db.commit()
        await db.refresh(category)
    return category

async def process_scraped_notices(db: AsyncSession, notices_data: list[dict], background_tasks: BackgroundTasks = None) -> dict:
    new_notices_count = 0
    
    # 1. Check if Notice table is empty (first run). If so, we skip email sending on initial seed to avoid SMTP limits.
    count_result = await db.execute(select(func.count(Notice.id)))
    is_first_run = count_result.scalar() == 0
    
    # 2. Fetch all existing notice IDs to prevent duplicate inserts
    existing_notices_result = await db.execute(select(Notice.notice_id))
    existing_ids = set(existing_notices_result.scalars().all())
    
    # 3. Fetch all categories to cache them
    categories_result = await db.execute(select(Category))
    categories_map = {c.name: c for c in categories_result.scalars().all()}
    
    should_send_emails = not is_first_run
    notices_to_insert = []
    
    # Process in reverse order (oldest first) so that DB IDs are sequential chronologically
    for item in reversed(notices_data):
        raw_notice_id = item.get("notice_id")
        if not raw_notice_id:
            continue
            
        clean_notice_id = str(raw_notice_id)[:128]
        if clean_notice_id in existing_ids:
            continue
            
        category_name = item.get("category", "Office & Section")
        
        # Get category from cache or create if missing
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
            notice_id=clean_notice_id,
            title=item.get("title", "")[:500],
            date_str=item.get("date_str")[:100] if item.get("date_str") else None,
            notice_date_parsed=parsed_date,
            description=item.get("description"),
            notice_link=item.get("notice_link", "")[:1000],
            download_link=item.get("download_link")[:1000] if item.get("download_link") else None,
            category_id=category.id
        )
        notices_to_insert.append((db_notice, category.id))
        existing_ids.add(clean_notice_id)
        new_notices_count += 1

    if not notices_to_insert:
        return {"status": "success", "new_notices_added": 0}

    # Safe batch insert with savepoint fallback to handle any potential duplicate key gracefully
    try:
        for notice_obj, _ in notices_to_insert:
            db.add(notice_obj)
        await db.commit()
    except Exception:
        await db.rollback()
        # Fallback: Insert items individually with nested savepoints to skip duplicate collisions safely
        inserted_notices = []
        for notice_obj, cat_id in notices_to_insert:
            try:
                async with db.begin_nested():
                    db.add(notice_obj)
                    await db.flush()
                inserted_notices.append((notice_obj, cat_id))
            except Exception:
                pass
        await db.commit()
        notices_to_insert = inserted_notices
        new_notices_count = len(notices_to_insert)

    # 4. Trigger emails for all newly inserted notices to subscribers
    if should_send_emails and new_notices_count > 0:
        # Pre-fetch subscriber emails grouped by category_id
        subscribers_result = await db.execute(
            select(user_subscriptions.c.category_id, User.email)
            .join(User, User.id == user_subscriptions.c.user_id)
            .where(User.is_active == True)
        )
        category_subscribers = {}
        for cat_id, email in subscribers_result.all():
            if cat_id not in category_subscribers:
                category_subscribers[cat_id] = set()
            category_subscribers[cat_id].add(email)

        all_category = categories_map.get("All")
        all_subscribers = category_subscribers.get(all_category.id, set()) if all_category else set()

        for db_notice, cat_id in notices_to_insert:
            cat_subs = category_subscribers.get(cat_id, set())
            target_emails = cat_subs.union(all_subscribers)

            for email in target_emails:
                if background_tasks:
                    background_tasks.add_task(
                        send_notice_email,
                        to_email=email,
                        notice_title=db_notice.title,
                        notice_link=db_notice.notice_link
                    )
                else:
                    await send_notice_email(
                        to_email=email,
                        notice_title=db_notice.title,
                        notice_link=db_notice.notice_link
                    )

    return {"status": "success", "new_notices_added": new_notices_count}
