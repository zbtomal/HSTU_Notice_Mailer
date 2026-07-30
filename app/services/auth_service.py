from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.schemas import Token, UserLogin
from app.services.user_service import authenticate_user
from app.core.security import create_access_token

async def login_user(db: AsyncSession, login_data: UserLogin) -> Token:
    """
    Validates user credentials (JSON) and generates a JWT token.
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
    
    # Reload user with subscriptions populated for single-response login
    from sqlalchemy.orm import selectinload
    from app.models.user import User
    from sqlalchemy import select
    
    user_with_subs = await db.scalar(
        select(User).options(selectinload(User.subscriptions)).where(User.id == user.id)
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_with_subs)
