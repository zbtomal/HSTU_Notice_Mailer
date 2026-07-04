from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, Token, UserVerify
from app.services import user_service, auth_service
from app.dependencies import get_current_active_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Register a new user in the system.
    return await user_service.create_user(db, user_in)

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    # OAuth2 compatible token login, get an access token for future requests.
    return await auth_service.login_user(db, form_data)

@router.get("/me", response_model=UserRead)
async def read_current_user(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # Get the details of the currently logged-in user.
    return current_user

@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    verify_data: UserVerify,
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Verify a registered user's email using the OTP.
    await user_service.verify_user_email(db, email=verify_data.email, otp=verify_data.otp)
    return {"message": "Email verified successfully"}
