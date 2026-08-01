from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.schemas import Token, UserLogin
from app.services.user_service import authenticate_user, get_user_by_email
from app.core.security import create_access_token, create_refresh_token
from app.core.config import settings
from jose import jwt, JWTError

async def login_user(db: AsyncSession, login_data: UserLogin) -> Token:
    """
    Validates user credentials (JSON) and generates JWT access & refresh tokens.
    Raises HTTPException if validation fails.
    """
    user = await authenticate_user(
        db, email=login_data.email, password=login_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
        
    access_token = create_access_token(subject=user.email)
    refresh_token = create_refresh_token(subject=user.email)
    
    # Reload user with subscriptions populated for single-response login
    from sqlalchemy.orm import selectinload
    from app.models.user import User
    from sqlalchemy import select
    
    user_with_subs = await db.scalar(
        select(User).options(selectinload(User.subscriptions)).where(User.id == user.id)
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
        user=user_with_subs
    )

async def refresh_access_token(db: AsyncSession, refresh_token_str: str) -> Token:
    """
    Validates a JWT refresh token and returns a new access token & refresh token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            refresh_token_str, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        is_refresh: bool = payload.get("refresh", False)
        
        if email is None or not is_refresh:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await get_user_by_email(db, email=email)
    if not user or not user.is_active:
        raise credentials_exception

    new_access_token = create_access_token(subject=user.email)
    new_refresh_token = create_refresh_token(subject=user.email)

    from sqlalchemy.orm import selectinload
    from app.models.user import User
    from sqlalchemy import select
    
    user_with_subs = await db.scalar(
        select(User).options(selectinload(User.subscriptions)).where(User.id == user.id)
    )

    return Token(
        access_token=new_access_token,
        token_type="bearer",
        refresh_token=new_refresh_token,
        user=user_with_subs
    )
