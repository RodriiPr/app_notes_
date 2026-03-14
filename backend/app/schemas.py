from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# Auth schemas
class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


# Category schemas
class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#6ee7b7"

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    class Config:
        from_attributes = True


# Note schemas
class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteOut(NoteBase):
    id: int
    archived: bool
    created_at: datetime
    updated_at: datetime
    categories: List[CategoryOut] = []
    class Config:
        from_attributes = True