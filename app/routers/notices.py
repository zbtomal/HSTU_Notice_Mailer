from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Notice
from app.schemas import NoticeRead

router = APIRouter(tags=["notices"])


@router.get("/notices", response_model=list[NoticeRead])
def get_notices(
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[Notice]:
    return db.query(Notice).order_by(Notice.created_at.desc()).limit(limit).all()
