from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class UserVerify(BaseModel):
    email: EmailStr
    otp: str

class UserResendOTP(BaseModel):
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreateResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime
    message: str = "Registration successful. Please check your email for the verification OTP."
    
    model_config = ConfigDict(from_attributes=True)

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
