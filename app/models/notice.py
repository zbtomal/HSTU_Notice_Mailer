from datetime import datetime, date
from sqlalchemy import Integer, String, DateTime, Text, Date, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.category import Category

class Notice(Base):
    __tablename__ = "notices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    notice_id: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    
    # date_str is the raw string date from the website
    date_str: Mapped[str | None] = mapped_column(String(100), nullable=True)
    notice_date_parsed: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    notice_link: Mapped[str] = mapped_column(String(1000), nullable=False)
    download_link: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    category: Mapped["Category"] = relationship(
        "Category", 
        back_populates="notices"
    )
