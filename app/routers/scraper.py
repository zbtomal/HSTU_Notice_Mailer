from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.database import get_db
from app.services import notice_service

router = APIRouter(
    prefix="/scraper",
    tags=["Scraper"]
)

@router.post("/webhook", status_code=status.HTTP_200_OK)
async def scraper_webhook(
    payload: List[Dict[str, Any]],
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Endpoint for GitHub Actions scraper to submit newly scraped notices.
    # Simply delegates the business logic to the notice service
    return await notice_service.process_scraped_notices(db, payload)