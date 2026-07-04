from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from typing import Optional
from app.schemas.category import CategoryRead

class NoticeBase(BaseModel):
    notice_id: str
    title: str
    date_str: Optional[str] = None
    notice_date_parsed: Optional[date] = None
    description: Optional[str] = None
    notice_link: str
    download_link: Optional[str] = None

class NoticeCreate(NoticeBase):
    category_id: int

class NoticeRead(NoticeBase):
    id: int
    category: CategoryRead
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
