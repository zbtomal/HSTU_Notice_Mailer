from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.user import User, user_subscriptions
from app.models.category import Category
from app.services.notice_service import get_or_create_category

async def subscribe_user_to_category(
    db: AsyncSession, user: User, category_name: str
) -> User:
    """
    Subscribes a user to a specific notice category.
    """
    category = await get_or_create_category(db, category_name)
    
    # Check if already subscribed
    query = select(user_subscriptions).where(
        user_subscriptions.c.user_id == user.id,
        user_subscriptions.c.category_id == category.id
    )
    result = await db.execute(query)
    if not result.first():
        await db.execute(
            user_subscriptions.insert().values(user_id=user.id, category_id=category.id)
        )
        await db.commit()
        
    user_id = user.id
    db.expire(user)
        
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user_id)
    )
    return refreshed_user

async def unsubscribe_user_from_category(
    db: AsyncSession, user: User, category_name: str
) -> User:
    """
    Unsubscribes a user from a specific notice category.
    """
    category = await get_or_create_category(db, category_name)
    
    await db.execute(
        user_subscriptions.delete().where(
            user_subscriptions.c.user_id == user.id,
            user_subscriptions.c.category_id == category.id
        )
    )
    await db.commit()
    
    user_id = user.id
    db.expire(user)
    
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user_id)
    )
    return refreshed_user

async def subscribe_user_to_all_categories(db: AsyncSession, user: User) -> User:
    """
    Subscribes a user to ALL categories in the database.
    """
    categories_res = await db.execute(select(Category))
    all_cats = categories_res.scalars().all()
    
    # Get user's existing subscription category_ids
    existing_subs_res = await db.execute(
        select(user_subscriptions.c.category_id).where(user_subscriptions.c.user_id == user.id)
    )
    existing_cat_ids = set(existing_subs_res.scalars().all())
    
    new_inserts = [
        {"user_id": user.id, "category_id": cat.id}
        for cat in all_cats if cat.id not in existing_cat_ids
    ]
    if new_inserts:
        await db.execute(user_subscriptions.insert(), new_inserts)
        await db.commit()
        
    user_id = user.id
    db.expire(user)
    
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user_id)
    )
    return refreshed_user

async def unsubscribe_user_from_all_categories(db: AsyncSession, user: User) -> User:
    """
    Unsubscribes a user from ALL categories.
    """
    await db.execute(user_subscriptions.delete().where(user_subscriptions.c.user_id == user.id))
    await db.commit()
    
    user_id = user.id
    db.expire(user)
    
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user_id)
    )
    return refreshed_user
