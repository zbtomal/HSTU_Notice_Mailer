from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    notice_id = Column(String(128), unique=True, nullable=False, index=True)
    title = Column(String(500), nullable=False)
    date = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    notice_link = Column(String(1000), nullable=False)
    download_link = Column(String(1000), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
