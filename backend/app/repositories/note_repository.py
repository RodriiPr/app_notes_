from sqlalchemy.orm import Session
from typing import List, Optional
from app.models import Note, Category


class NoteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, owner_id: int, archived: bool, category_id: Optional[int] = None) -> List[Note]:
        query = self.db.query(Note).filter(Note.archived == archived, Note.owner_id == owner_id)
        if category_id:
            query = query.filter(Note.categories.any(Category.id == category_id))
        return query.order_by(Note.updated_at.desc()).all()

    def get_by_id(self, note_id: int, owner_id: int) -> Optional[Note]:
        return self.db.query(Note).filter(Note.id == note_id, Note.owner_id == owner_id).first()

    def create(self, title: str, content: Optional[str], owner_id: int) -> Note:
        note = Note(title=title, content=content, owner_id=owner_id)
        self.db.add(note)
        self.db.commit()
        self.db.refresh(note)
        return note

    def update(self, note: Note, title: Optional[str], content: Optional[str]) -> Note:
        if title is not None:
            note.title = title
        if content is not None:
            note.content = content
        self.db.commit()
        self.db.refresh(note)
        return note

    def toggle_archive(self, note: Note) -> Note:
        note.archived = not note.archived
        self.db.commit()
        self.db.refresh(note)
        return note

    def delete(self, note: Note) -> None:
        self.db.delete(note)
        self.db.commit()

    def add_category(self, note: Note, category: Category) -> Note:
        if category not in note.categories:
            note.categories.append(category)
            self.db.commit()
            self.db.refresh(note)
        return note

    def remove_category(self, note: Note, category: Category) -> Note:
        if category in note.categories:
            note.categories.remove(category)
            self.db.commit()
            self.db.refresh(note)
        return note