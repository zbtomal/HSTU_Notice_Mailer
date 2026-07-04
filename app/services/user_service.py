import logging
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password
from app.services.email_services import send_verification_otp

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    existing_user = await get_user_by_email(db, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
        
    hashed_password = get_password_hash(user_in.password)
    
    # Generate OTP and expiry (10 mins)
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        is_active=False,  # Must verify email to activate
        verification_otp=otp,
        otp_expires_at=expires_at
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    # Send verification email asynchronously
    email_sent = await send_verification_otp(db_user.email, otp)
    if not email_sent:
        logger = logging.getLogger("user_service")
        logger.error(f"Failed to send verification OTP to {db_user.email}")
        
    return db_user

async def authenticate_user(
    db: AsyncSession, email: str, password: str
) -> User | None:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def subscribe_user_to_category(
    db: AsyncSession, user: User, category_name: str
) -> User:
    """
    Subscribes a user to a notice category.
    """
    from app.services.notice_service import get_or_create_category
    from app.models.user import user_subscriptions
    from sqlalchemy.orm import selectinload
    
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
        
    # Expire user cache so SQLAlchemy reloads relationship on query
    db.expire(user)
        
    # Reload user with updated subscriptions
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user.id)
    )
    return refreshed_user

async def unsubscribe_user_from_category(
    db: AsyncSession, user: User, category_name: str
) -> User:
    """
    Unsubscribes a user from a notice category.
    """
    from app.services.notice_service import get_or_create_category
    from app.models.user import user_subscriptions
    from sqlalchemy.orm import selectinload
    
    category = await get_or_create_category(db, category_name)
    
    await db.execute(
        user_subscriptions.delete().where(
            user_subscriptions.c.user_id == user.id,
            user_subscriptions.c.category_id == category.id
        )
    )
    await db.commit()
    
    # Expire user cache so SQLAlchemy reloads relationship on query
    db.expire(user)
    
    # Reload user with updated subscriptions
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user.id)
    )
    return refreshed_user

async def verify_user_email(db: AsyncSession, email: str, otp: str) -> bool:
    """
    Verifies user's email using the OTP.
    """
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if user.is_active:
        return True  # Already verified
        
    if not user.verification_otp or user.verification_otp != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code",
        )
        
    # Check expiry
    now = datetime.now(timezone.utc)
    if user.otp_expires_at < now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired",
        )
        
    user.is_active = True
    user.verification_otp = None
    user.otp_expires_at = None
    
    await db.commit()
    return True
