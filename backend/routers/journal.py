from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..deps import get_db, get_current_user
from ..models import JournalEntry, User
from ..schemas.journal import JournalCreate, JournalUpdate, JournalOut

router = APIRouter(prefix="/journal", tags=["journal"])


@router.get("/", response_model=List[JournalOut])
def list_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entries = (
        db.query(JournalEntry)
        .filter(JournalEntry.user_id == current_user.id)
        .order_by(JournalEntry.updated_at.desc())
        .all()
    )
    return entries


@router.post("/", response_model=JournalOut, status_code=status.HTTP_201_CREATED)
def create_entry(payload: JournalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    now = datetime.utcnow()
    entry = JournalEntry(
        user_id=current_user.id,
        title=payload.title,
        content=payload.content,
        created_at=now,
        updated_at=now,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.put("/{entry_id}", response_model=JournalOut)
def update_entry(entry_id: int, payload: JournalUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.get(JournalEntry, entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    if payload.title is not None:
        entry.title = payload.title
    if payload.content is not None:
        entry.content = payload.content
    entry.updated_at = datetime.utcnow()
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.get(JournalEntry, entry_id)
    if not entry or entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return None
