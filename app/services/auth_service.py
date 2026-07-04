from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user import Token
from app.services.user_service import authenticate_user
from app.core.security import create_access_token

async def login_user(db: AsyncSession, form_data: OAuth2PasswordRequestForm) -> Token:
    """
    Validates user credentials and generates a JWT token.
    Raises HTTPException if validation fails.
    """
    user = await authenticate_user(
        db, email=form_data.username, password=form_data.password
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
    
    return Token(access_token=access_token, token_type="bearer")
