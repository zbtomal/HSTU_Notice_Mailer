from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import List, Optional
from app.schemas.category import CategoryRead

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    profile_picture_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None

class UserRead(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    subscriptions: List[CategoryRead] = []
    oauth_provider: Optional[str] = None
    oauth_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)



