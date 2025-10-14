from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date

from database import get_db
from models import User, JournalEntry
from schemas import JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse
from auth_utils import get_current_user

router = APIRouter()

@router.post("/entries", response_model=JournalEntryResponse)
async def create_journal_entry(
    entry_data: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new journal entry."""
    db_entry = JournalEntry(
        user_id=current_user.id,
        title=entry_data.title,
        content=entry_data.content,
        mood_rating=entry_data.mood_rating,
        tags=entry_data.tags
    )
    
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    return JournalEntryResponse.from_orm(db_entry)

@router.get("/entries", response_model=List[JournalEntryResponse])
async def get_journal_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None)
):
    """Get journal entries for the current user with optional filtering."""
    query = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id)
    
    # Apply filters
    if search:
        query = query.filter(
            (JournalEntry.title.contains(search)) |
            (JournalEntry.content.contains(search))
        )
    
    if tag:
        query = query.filter(JournalEntry.tags.contains(tag))
    
    if start_date:
        query = query.filter(JournalEntry.created_at >= start_date)
    
    if end_date:
        query = query.filter(JournalEntry.created_at <= end_date)
    
    # Order by creation date (newest first)
    entries = query.order_by(JournalEntry.created_at.desc()).offset(skip).limit(limit).all()
    
    return [JournalEntryResponse.from_orm(entry) for entry in entries]

@router.get("/entries/{entry_id}", response_model=JournalEntryResponse)
async def get_journal_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific journal entry."""
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    return JournalEntryResponse.from_orm(entry)

@router.put("/entries/{entry_id}", response_model=JournalEntryResponse)
async def update_journal_entry(
    entry_id: int,
    entry_data: JournalEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a journal entry."""
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    # Update fields if provided
    if entry_data.title is not None:
        entry.title = entry_data.title
    if entry_data.content is not None:
        entry.content = entry_data.content
    if entry_data.mood_rating is not None:
        entry.mood_rating = entry_data.mood_rating
    if entry_data.tags is not None:
        entry.tags = entry_data.tags
    
    entry.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(entry)
    
    return JournalEntryResponse.from_orm(entry)

@router.delete("/entries/{entry_id}")
async def delete_journal_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a journal entry."""
    entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    db.delete(entry)
    db.commit()
    
    return {"message": "Journal entry deleted successfully"}

@router.get("/stats")
async def get_journal_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get journal statistics for the current user."""
    # Total entries
    total_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).count()
    
    # Entries with mood ratings
    mood_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.mood_rating.isnot(None)
    ).all()
    
    # Calculate average mood
    avg_mood = None
    if mood_entries:
        total_mood = sum(entry.mood_rating for entry in mood_entries)
        avg_mood = round(total_mood / len(mood_entries), 1)
    
    # Recent mood trend (last 7 entries with mood)
    recent_mood_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.mood_rating.isnot(None)
    ).order_by(JournalEntry.created_at.desc()).limit(7).all()
    
    mood_trend = None
    if len(recent_mood_entries) >= 3:
        recent_moods = [entry.mood_rating for entry in reversed(recent_mood_entries)]
        if len(recent_moods) >= 3:
            # Simple trend calculation
            first_half = sum(recent_moods[:len(recent_moods)//2]) / (len(recent_moods)//2)
            second_half = sum(recent_moods[len(recent_moods)//2:]) / (len(recent_moods) - len(recent_moods)//2)
            
            if second_half > first_half + 0.5:
                mood_trend = "improving"
            elif second_half < first_half - 0.5:
                mood_trend = "declining"
            else:
                mood_trend = "stable"
    
    # Most common tags
    all_tags = []
    for entry in db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).all():
        if entry.tags:
            tags = [tag.strip() for tag in entry.tags.split(',')]
            all_tags.extend(tags)
    
    tag_counts = {}
    for tag in all_tags:
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
    
    common_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_entries": total_entries,
        "entries_with_mood": len(mood_entries),
        "average_mood": avg_mood,
        "mood_trend": mood_trend,
        "common_tags": [{"tag": tag, "count": count} for tag, count in common_tags]
    }