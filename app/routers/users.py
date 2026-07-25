from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Any, List

from app.schemas.category import CategoryRead
from app.models.category import Category

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate
from app.services import user_service
from app.dependencies import get_current_active_user

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
    """
    Subscribe the current user to a notice category (e.g. 'All', 'General', 'CSE').
    """
    return await user_service.subscribe_user_to_category(db, current_user, category_name)

@router.post("/unsubscribe", response_model=UserRead)
async def unsubscribe_from_category(
    category_name: str = "All",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Unsubscribe the current user from a notice category.
    """
    return await user_service.unsubscribe_user_from_category(db, current_user, category_name)

@router.get("/categories", response_model=List[CategoryRead])
async def list_categories(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    List all available notice categories.
    """
    result = await db.execute(select(Category))
    return result.scalars().all()

@router.patch("/me", response_model=UserRead)
async def update_profile(
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update profile details (e.g. full_name) of the logged-in user.
    """
    return await user_service.update_user_profile(db, current_user, user_update.full_name)

