from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException, status
from app.repositories import NoteRepository, CategoryRepository
from app.models import Note
from app.schemas import NoteCreate, NoteUpdate


class NoteService:
    def __init__(self, db: Session, owner_id: int):
        self.note_repo = NoteRepository(db)
        self.category_repo = CategoryRepository(db)
        self.owner_id = owner_id

    def get_active_notes(self, category_id: Optional[int] = None) -> List[Note]:
        return self.note_repo.get_all(self.owner_id, archived=False, category_id=category_id)

    def get_archived_notes(self, category_id: Optional[int] = None) -> List[Note]:
        return self.note_repo.get_all(self.owner_id, archived=True, category_id=category_id)

    def get_note(self, note_id: int) -> Note:
        note = self.note_repo.get_by_id(note_id, self.owner_id)
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        return note

    def create_note(self, data: NoteCreate) -> Note:
        return self.note_repo.create(title=data.title, content=data.content, owner_id=self.owner_id)

    def update_note(self, note_id: int, data: NoteUpdate) -> Note:
        note = self.get_note(note_id)
        return self.note_repo.update(note, title=data.title, content=data.content)

    def toggle_archive(self, note_id: int) -> Note:
        note = self.get_note(note_id)
        return self.note_repo.toggle_archive(note)

    def delete_note(self, note_id: int) -> None:
        note = self.get_note(note_id)
        self.note_repo.delete(note)

    def add_category(self, note_id: int, category_id: int) -> Note:
        note = self.get_note(note_id)
        category = self.category_repo.get_by_id(category_id, self.owner_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return self.note_repo.add_category(note, category)

    def remove_category(self, note_id: int, category_id: int) -> Note:
        note = self.get_note(note_id)
        category = self.category_repo.get_by_id(category_id, self.owner_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return self.note_repo.remove_category(note, category)