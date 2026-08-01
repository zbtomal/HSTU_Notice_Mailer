from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.db.session import get_db
from app.models.user import User
from app.schemas import (
    UserCreate,
    UserRead,
    Token,
    UserVerify,
    UserResendOTP,
    UserLogin,
    UserCreateResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    RefreshTokenRequest
)
from app.services import user_service, auth_service
from app.api.dependencies import get_current_active_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserCreateResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Register a new user in the system."""
    return await user_service.create_user(db, user_in)

@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Standard JSON login, returns access_token, refresh_token, and user profile."""
    return await auth_service.login_user(db, login_data)

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Refresh access token using a valid refresh token."""
    return await auth_service.refresh_access_token(db, request.refresh_token)

@router.get("/me", response_model=UserRead)
async def read_current_user(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get the details of the currently logged-in user."""
    return current_user

@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    verify_data: UserVerify,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Verify a registered user's email using OTP."""
    await user_service.verify_user_email(db, email=verify_data.email, otp=verify_data.otp)
    return {"message": "Email verified successfully"}

@router.post("/resend-otp", status_code=status.HTTP_200_OK)
async def resend_otp(
    resend_data: UserResendOTP,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Resend verification OTP to the user."""
    await user_service.resend_verification_otp(db, email=resend_data.email)
    return {"message": "Verification code resent successfully"}

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Initiate forgot password flow, sends a reset OTP via email."""
    await user_service.request_password_reset(db, email=request.email)
    return {"message": "Password reset verification code sent to your email"}

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Reset password using the reset OTP."""
    await user_service.reset_password(
        db, 
        email=request.email, 
        otp=request.otp, 
        new_password=request.new_password
    )
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.post("/token", response_model=Token)
async def login_for_swagger(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """OAuth2 compatible token login for Swagger UI 'Authorize' button."""
    login_data = UserLogin(email=form_data.username, password=form_data.password)
    return await auth_service.login_user(db, login_data)

@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Change password for a logged-in user."""
    await user_service.change_user_password(
        db,
        user=current_user,
        old_password=request.old_password,
        new_password=request.new_password
    )
    return {"message": "Password changed successfully"}
