from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserResponse, UserUpdate
from auth_utils import get_current_user, get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile information."""
    return UserResponse.from_orm(current_user)

@router.put("/me", response_model=UserResponse)
async def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile information."""
    
    # Update fields if provided
    if profile_data.full_name is not None:
        current_user.full_name = profile_data.full_name
    if profile_data.age is not None:
        current_user.age = profile_data.age
    if profile_data.gender is not None:
        current_user.gender = profile_data.gender
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    if profile_data.emergency_contact is not None:
        current_user.emergency_contact = profile_data.emergency_contact
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.from_orm(current_user)

@router.delete("/me")
async def delete_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete current user's account and all associated data."""
    
    # In a production app, you might want to:
    # 1. Soft delete (mark as inactive) instead of hard delete
    # 2. Anonymize data instead of deleting
    # 3. Add confirmation requirements
    # 4. Send confirmation emails
    
    # For now, we'll just mark the user as inactive
    current_user.is_active = False
    db.commit()
    
    return {"message": "Account deactivated successfully"}

@router.get("/stats")
async def get_profile_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's activity statistics."""
    
    from models import JournalEntry, ChatSession, MentalHealthTestResult, UserExerciseProgress
    
    # Journal stats
    journal_count = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).count()
    
    # Chat stats
    chat_sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).count()
    
    # Test stats
    tests_taken = db.query(MentalHealthTestResult).filter(
        MentalHealthTestResult.user_id == current_user.id
    ).count()
    
    # Exercise stats
    exercises_completed = db.query(UserExerciseProgress).filter(
        UserExerciseProgress.user_id == current_user.id
    ).count()
    
    # Recent mood from journal entries
    recent_mood_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.mood_rating.isnot(None)
    ).order_by(JournalEntry.created_at.desc()).limit(5).all()
    
    avg_recent_mood = None
    if recent_mood_entries:
        total_mood = sum(entry.mood_rating for entry in recent_mood_entries)
        avg_recent_mood = round(total_mood / len(recent_mood_entries), 1)
    
    return {
        "journal_entries": journal_count,
        "chat_sessions": chat_sessions,
        "tests_taken": tests_taken,
        "exercises_completed": exercises_completed,
        "average_recent_mood": avg_recent_mood,
        "member_since": current_user.created_at,
        "profile_completion": _calculate_profile_completion(current_user)
    }

def _calculate_profile_completion(user: User) -> dict:
    """Calculate profile completion percentage."""
    fields = {
        "full_name": user.full_name,
        "age": user.age,
        "gender": user.gender,
        "phone": user.phone,
        "emergency_contact": user.emergency_contact
    }
    
    completed_fields = sum(1 for value in fields.values() if value is not None and value != "")
    total_fields = len(fields)
    percentage = round((completed_fields / total_fields) * 100)
    
    missing_fields = [field for field, value in fields.items() if value is None or value == ""]
    
    return {
        "percentage": percentage,
        "completed_fields": completed_fields,
        "total_fields": total_fields,
        "missing_fields": missing_fields
    }