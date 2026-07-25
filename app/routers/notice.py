from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, nullslast
from sqlalchemy.orm import selectinload
from typing import Any, List, Optional

from app.database import get_db
from app.models.notice import Notice
from app.schemas.notice import NoticeRead

router = APIRouter(
    prefix="/notices",
    tags=["Notices"]
)

@router.get("", response_model=List[NoticeRead])
async def list_notices(
    limit: int = Query(20, ge=1, le=100),
    page: int = Query(1, ge=1),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Retrieve notices with optional pagination, category filtering, and search query.
    """
    offset = (page - 1) * limit
    query = select(Notice).options(selectinload(Notice.category)).order_by(nullslast(desc(Notice.notice_date_parsed)), desc(Notice.id))
    
    if category_id is not None:
        query = query.where(Notice.category_id == category_id)
        
    if search:
        query = query.where(
            Notice.title.ilike(f"%{search}%") | 
            Notice.description.ilike(f"%{search}%")
        )
        
    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
