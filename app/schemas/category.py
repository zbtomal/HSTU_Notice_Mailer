from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
