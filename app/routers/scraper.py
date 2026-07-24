from fastapi import APIRouter, Depends, status, Header, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.database import get_db
from app.services import notice_service
from app.core.config import settings

router = APIRouter(
    prefix="/scraper",
    tags=["Scraper"]
)

@router.post("/webhook", status_code=status.HTTP_200_OK)
async def scraper_webhook(
    payload: List[Dict[str, Any]],
    background_tasks: BackgroundTasks,
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Verify scraper API key to prevent unauthorized execution
    expected_token = f"Bearer {settings.SCRAPER_API_KEY}"
    if not authorization or authorization != expected_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized scraper request"
        )
        
    # Endpoint for GitHub Actions scraper to submit newly scraped notices.
    return await notice_service.process_scraped_notices(db, payload, background_tasks)