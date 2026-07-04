from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import List
from app.schemas.category import CategoryRead

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    subscriptions: List[CategoryRead] = []

    model_config = ConfigDict(from_attributes=True)

# Auth related schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
