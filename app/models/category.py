from datetime import datetime
from sqlalchemy import Integer, String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.notice import Notice
    from app.models.user import User

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        Integer, 
        primary_key=True, 
        index=True
    )
    name: Mapped[str] = mapped_column(
        String(100), 
        unique=True, 
        nullable=False, 
        index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), nullable=False
    )

    # Relationships
    notices: Mapped[list["Notice"]] = relationship(
        "Notice", 
        back_populates="category", 
        cascade="all, delete-orphan"
    )

    subscribers: Mapped[list["User"]] = relationship(
        "User",
        secondary="user_subscriptions",
        back_populates="subscriptions"
    )