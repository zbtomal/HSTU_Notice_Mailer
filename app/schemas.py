from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr


class UserRead(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NoticeRead(BaseModel):
    id: int
    notice_id: str
    title: str
    date: Optional[str] = None
    description: Optional[str] = None
    notice_link: str
    download_link: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NoticeScraped(BaseModel):
    notice_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    date: Optional[str] = None
    description: Optional[str] = None
    notice_link: str = Field(min_length=1)
    download_link: Optional[str] = None
