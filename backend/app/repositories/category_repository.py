from sqlalchemy.orm import Session
from typing import List, Optional
from app.models import Category


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, owner_id: int) -> List[Category]:
        return self.db.query(Category).filter(Category.owner_id == owner_id).order_by(Category.name).all()

    def get_by_id(self, category_id: int, owner_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id, Category.owner_id == owner_id).first()

    def get_by_name(self, name: str, owner_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.name == name, Category.owner_id == owner_id).first()

    def create(self, name: str, color: str, owner_id: int) -> Category:
        category = Category(name=name, color=color, owner_id=owner_id)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete(self, category: Category) -> None:
        self.db.delete(category)
        self.db.commit()