from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Any, List

from app.schemas.category import CategoryRead
from app.models.category import Category
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services import user_service, subscription_service
from app.api.dependencies import get_current_active_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/subscribe", response_model=UserRead)
async def subscribe_to_category(
    category_name: str = "All",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Subscribe the current user to a notice category."""
    return await subscription_service.subscribe_user_to_category(db, current_user, category_name)

@router.post("/unsubscribe", response_model=UserRead)
async def unsubscribe_from_category(
    category_name: str = "All",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Unsubscribe the current user from a notice category."""
    return await subscription_service.unsubscribe_user_from_category(db, current_user, category_name)

@router.post("/subscribe-all", response_model=UserRead)
async def subscribe_to_all_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Subscribe current user to ALL categories in the system."""
    return await subscription_service.subscribe_user_to_all_categories(db, current_user)

@router.post("/unsubscribe-all", response_model=UserRead)
async def unsubscribe_from_all_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Unsubscribe current user from ALL categories."""
    return await subscription_service.unsubscribe_user_from_all_categories(db, current_user)

@router.get("/categories", response_model=List[CategoryRead])
async def list_categories(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """List all available notice categories."""
    result = await db.execute(select(Category).order_by(Category.name.asc()))
    return result.scalars().all()

@router.patch("/me", response_model=UserRead)
async def update_profile(
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Update profile details (e.g. full_name, is_email_paused) of the logged-in user."""
    return await user_service.update_user_profile(
        db, current_user, full_name=user_update.full_name, is_email_paused=user_update.is_email_paused
    )
