import logging
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from sqlalchemy.orm import selectinload

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password
from app.services.email_services import send_verification_otp, send_reset_password_otp
from app.services.subscription_service import (
    subscribe_user_to_category,
    unsubscribe_user_from_category,
    subscribe_user_to_all_categories,
    unsubscribe_user_from_all_categories
)

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Retrieves a user by email address."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    """Registers a new user and dispatches a verification OTP email."""
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
        full_name=user_in.full_name,
        profile_picture_url=user_in.profile_picture_url,
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
        
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == db_user.id)
    )
    return refreshed_user

async def authenticate_user(
    db: AsyncSession, email: str, password: str
) -> User | None:
    """Authenticates user credentials against stored bcrypt password hash."""
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def verify_user_email(db: AsyncSession, email: str, otp: str) -> bool:
    """Verifies user's email address using OTP code."""
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

async def resend_verification_otp(db: AsyncSession, email: str) -> bool:
    """Generates and resends a fresh verification OTP."""
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified",
        )
        
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    user.verification_otp = otp
    user.otp_expires_at = expires_at
    await db.commit()
    
    email_sent = await send_verification_otp(user.email, otp)
    if not email_sent:
        logger = logging.getLogger("user_service")
        logger.error(f"Failed to send verification OTP to {user.email}")
        
    return True

async def request_password_reset(db: AsyncSession, email: str) -> bool:
    """Generates a password reset OTP and sends it via email."""
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User email is not verified. Please verify your email first.",
        )
        
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    user.reset_password_otp = otp
    user.reset_otp_expires_at = expires_at
    await db.commit()
    
    email_sent = await send_reset_password_otp(user.email, otp)
    if not email_sent:
        logger = logging.getLogger("user_service")
        logger.error(f"Failed to send password reset OTP to {user.email}")
        
    return True

async def reset_password(db: AsyncSession, email: str, otp: str, new_password: str) -> bool:
    """Verifies password reset OTP and updates user's password."""
    user = await get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if not user.reset_password_otp or user.reset_password_otp != otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset code",
        )
        
    now = datetime.now(timezone.utc)
    if user.reset_otp_expires_at < now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset code expired",
        )
        
    user.hashed_password = get_password_hash(new_password)
    user.reset_password_otp = None
    user.reset_otp_expires_at = None
    
    await db.commit()
    return True

async def change_user_password(db: AsyncSession, user: User, old_password: str, new_password: str) -> bool:
    """Verifies old password and updates user's password."""
    if not verify_password(old_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password",
        )
    user.hashed_password = get_password_hash(new_password)
    await db.commit()
    return True

async def update_user_profile(
    db: AsyncSession, user: User, full_name: str | None = None, is_email_paused: bool | None = None
) -> User:
    """Updates user profile information (full_name or is_email_paused flag)."""
    if full_name is not None:
        user.full_name = full_name
    if is_email_paused is not None:
        user.is_email_paused = is_email_paused
    await db.commit()
    
    user_id = user.id
    db.expire(user)
    
    refreshed_user = await db.scalar(
        select(User)
        .options(selectinload(User.subscriptions))
        .where(User.id == user_id)
    )
    return refreshed_user
