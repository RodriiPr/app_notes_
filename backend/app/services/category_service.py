from sqlalchemy.orm import Session
from typing import List
from fastapi import HTTPException, status
from app.repositories import CategoryRepository
from app.models import Category
from app.schemas import CategoryCreate


class CategoryService:
    def __init__(self, db: Session, owner_id: int):
        self.category_repo = CategoryRepository(db)
        self.owner_id = owner_id

    def get_all(self) -> List[Category]:
        return self.category_repo.get_all(self.owner_id)

    def create_category(self, data: CategoryCreate) -> Category:
        existing = self.category_repo.get_by_name(data.name, self.owner_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category already exists")
        return self.category_repo.create(name=data.name, color=data.color or "#6ee7b7", owner_id=self.owner_id)

    def delete_category(self, category_id: int) -> None:
        category = self.category_repo.get_by_id(category_id, self.owner_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        self.category_repo.delete(category)