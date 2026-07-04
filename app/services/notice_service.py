from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
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

async def process_scraped_notices(db: AsyncSession, notices_data: list[dict]) -> dict:
    # Processes the scraped notices payload. Saves new notices and triggers emails to subscribers.
    new_notices_count = 0
    
    for item in notices_data:
        # Get or create category
        category_name = item.get("category", "General")
        category = await get_or_create_category(db, category_name)
        
        # Check if the notice already exists in database
        notice_id = item.get("notice_id")
        result = await db.execute(select(Notice).where(Notice.notice_id == notice_id))
        existing_notice = result.scalar_one_or_none()
        
        if not existing_notice:
            # Create and save new notice
            db_notice = Notice(
                notice_id=notice_id,
                title=item.get("title"),
                date_str=item.get("date_str"),
                notice_date_parsed=item.get("notice_date_parsed"),
                description=item.get("description"),
                notice_link=item.get("notice_link"),
                download_link=item.get("download_link"),
                category_id=category.id
            )
            db.add(db_notice)
            await db.commit()
            await db.refresh(db_notice)
            new_notices_count += 1
            
            # Fetch all users subscribed to this category
            users_result = await db.execute(
                select(User.email)
                .join(user_subscriptions)
                .where(user_subscriptions.c.category_id == category.id)
            )
            subscribers = users_result.scalars().all()
            
            # Send emails to all subscribers asynchronously
            for email in subscribers:
                await send_notice_email(
                    to_email=email,
                    notice_title=db_notice.title,
                    notice_link=db_notice.notice_link
                )
                
    return {"status": "success", "new_notices_added": new_notices_count}
