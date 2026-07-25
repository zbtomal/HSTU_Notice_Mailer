from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import BackgroundTasks
from app.models.notice import Notice
from app.models.category import Category
from app.models.user import User, user_subscriptions
from app.services.email_services import send_notice_email

async def get_or_create_category(db: AsyncSession, name: str) -> Category:
    # Retrieves a category by name, or creates a new one if it doesn't exist.
    result = await db.execute(select(Category).where(Category.name == name))
    category = result.scalar_one_or_none()
    
    if not category:
        category = Category(name=name)
        db.add(category)
        await db.commit()
        await db.refresh(category)
        
    return category

async def process_scraped_notices(db: AsyncSession, notices_data: list[dict], background_tasks: BackgroundTasks = None) -> dict:
    # Processes the scraped notices payload. Saves new notices and triggers emails to subscribers.
    new_notices_count = 0
    
    # 1. Check if Notice table is empty (first run). If so, we skip email sending to avoid SMTP limits.
    count_result = await db.execute(select(func.count(Notice.id)))
    is_first_run = count_result.scalar() == 0
    
    # 2. Fetch all existing notice IDs to prevent N+1 select queries
    existing_notices_result = await db.execute(select(Notice.notice_id))
    existing_ids = set(existing_notices_result.scalars().all())
    
    # 3. Fetch all categories to cache them
    categories_result = await db.execute(select(Category))
    categories_map = {c.name: c for c in categories_result.scalars().all()}
    
    # Safety Check: If Notice table is empty (first run), we skip email sending to avoid SMTP limits.
    should_send_emails = not is_first_run
    
    # Process in reverse order (oldest first) so that DB IDs are sequential chronologically
    for item in reversed(notices_data):
        notice_id = item.get("notice_id")
        if notice_id in existing_ids:
            continue
            
        category_name = item.get("category", "General")
        
        # Get category from cache or database
        if category_name not in categories_map:
            category = await get_or_create_category(db, category_name)
            categories_map[category_name] = category
        else:
            category = categories_map[category_name]
            
        # Parse ISO date string to datetime.date object for DB driver compatibility
        parsed_date = None
        parsed_date_str = item.get("notice_date_parsed")
        if parsed_date_str:
            from datetime import date
            try:
                parsed_date = date.fromisoformat(parsed_date_str)
            except ValueError:
                pass
                
        # Create notice object and add to session (with field truncation to prevent DB overflow)
        db_notice = Notice(
            notice_id=notice_id[:128],
            title=item.get("title", "")[:500],
            date_str=item.get("date_str")[:100] if item.get("date_str") else None,
            notice_date_parsed=parsed_date,
            description=item.get("description"),
            notice_link=item.get("notice_link", "")[:1000],
            download_link=item.get("download_link")[:1000] if item.get("download_link") else None,
            category_id=category.id
        )
        db.add(db_notice)
        new_notices_count += 1
        
        # 4. Trigger emails to subscribers only if safety checks allow
        if should_send_emails:
            # Fetch all users subscribed to this specific category OR the master "All" category
            all_category = categories_map.get("All")
            query = select(User.email).distinct().join(user_subscriptions)
            if all_category:
                query = query.where(
                    ((user_subscriptions.c.category_id == category.id) | 
                     (user_subscriptions.c.category_id == all_category.id)),
                    User.is_active == True
                )
            else:
                query = query.where(
                    user_subscriptions.c.category_id == category.id,
                    User.is_active == True
                )
            users_result = await db.execute(query)
            subscribers = users_result.scalars().all()
            
            # Send emails to all subscribers asynchronously (delegated to background tasks if available)
            for email in subscribers:
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
                
    # Commit all new notices in a single transaction
    if new_notices_count > 0:
        await db.commit()
                 
    return {"status": "success", "new_notices_added": new_notices_count}
