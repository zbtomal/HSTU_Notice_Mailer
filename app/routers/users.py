from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserRead

router = APIRouter(tags=["users"])


@router.post("/subscribe", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def subscribe(payload: UserCreate, db: Session = Depends(get_db)) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already subscribed")

    user = User(email=payload.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
