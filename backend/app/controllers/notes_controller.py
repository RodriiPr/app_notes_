from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user
from app.models import User
from app.services import NoteService
from app.schemas import NoteCreate, NoteUpdate, NoteOut

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/active", response_model=List[NoteOut])
def get_active(category_id: Optional[int] = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).get_active_notes(category_id=category_id)


@router.get("/archived", response_model=List[NoteOut])
def get_archived(category_id: Optional[int] = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).get_archived_notes(category_id=category_id)


@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).get_note(note_id)


@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(data: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).create_note(data)


@router.patch("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).update_note(note_id, data)


@router.patch("/{note_id}/archive", response_model=NoteOut)
def toggle_archive(note_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).toggle_archive(note_id)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    NoteService(db, user.id).delete_note(note_id)


@router.post("/{note_id}/categories/{category_id}", response_model=NoteOut)
def add_category(note_id: int, category_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).add_category(note_id, category_id)


@router.delete("/{note_id}/categories/{category_id}", response_model=NoteOut)
def remove_category(note_id: int, category_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return NoteService(db, user.id).remove_category(note_id, category_id)