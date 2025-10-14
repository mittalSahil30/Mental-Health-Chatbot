from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from database import get_db
from models import User, ChatSession, ChatMessage, JournalEntry, MentalHealthTestResult
from schemas import ChatMessageRequest, ChatMessageResponse, ChatSessionResponse
from auth_utils import get_current_user_optional
from gemini_service import GeminiChatbot

router = APIRouter()
chatbot = GeminiChatbot()

@router.post("/message", response_model=ChatMessageResponse)
async def send_message(
    message_data: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Send a message to the chatbot and get a response."""
    
    # Get or create chat session
    session = None
    if message_data.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.session_id == message_data.session_id
        ).first()
    
    if not session:
        # Create new session
        session_id = str(uuid.uuid4())
        session = ChatSession(
            user_id=current_user.id if current_user else None,
            session_id=session_id
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    # Save user message
    user_message = ChatMessage(
        session_id=session.id,
        message=message_data.message,
        is_user=True
    )
    db.add(user_message)
    
    # Get chat history for context
    chat_history = db.query(ChatMessage).filter(
        ChatMessage.session_id == session.id
    ).order_by(ChatMessage.timestamp).all()
    
    # Build user context
    user_context = {}
    if current_user:
        user_context['age'] = current_user.age
        
        # Get recent test results
        recent_test = db.query(MentalHealthTestResult).filter(
            MentalHealthTestResult.user_id == current_user.id
        ).order_by(MentalHealthTestResult.created_at.desc()).first()
        
        if recent_test:
            user_context['recent_test_results'] = f"{recent_test.test_type}: {recent_test.severity_level}"
        
        # Get recent mood trend from journal
        recent_entries = db.query(JournalEntry).filter(
            JournalEntry.user_id == current_user.id,
            JournalEntry.mood_rating.isnot(None)
        ).order_by(JournalEntry.created_at.desc()).limit(5).all()
        
        if recent_entries:
            avg_mood = sum(entry.mood_rating for entry in recent_entries) / len(recent_entries)
            if avg_mood < 4:
                user_context['journal_mood_trend'] = "low mood pattern"
            elif avg_mood > 7:
                user_context['journal_mood_trend'] = "positive mood pattern"
            else:
                user_context['journal_mood_trend'] = "stable mood pattern"
    
    # Convert chat history to dict format
    history_dict = [
        {
            'message': msg.message,
            'is_user': msg.is_user,
            'timestamp': msg.timestamp
        }
        for msg in chat_history
    ]
    
    # Generate bot response
    bot_response_text = chatbot.get_personalized_response(
        message_data.message,
        user_context,
        history_dict
    )
    
    # Analyze sentiment
    sentiment_score = chatbot.analyze_sentiment(message_data.message)
    user_message.sentiment_score = sentiment_score
    
    # Save bot response
    bot_message = ChatMessage(
        session_id=session.id,
        message=bot_response_text,
        is_user=False
    )
    db.add(bot_message)
    
    db.commit()
    db.refresh(bot_message)
    
    return ChatMessageResponse.from_orm(bot_message)

@router.get("/sessions", response_model=List[ChatSessionResponse])
async def get_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all chat sessions for the current user."""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.updated_at.desc()).all()
    
    return [ChatSessionResponse.from_orm(session) for session in sessions]

@router.get("/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Get a specific chat session with all messages."""
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Check if user has access to this session
    if current_user and session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this chat session"
        )
    
    return ChatSessionResponse.from_orm(session)

@router.delete("/sessions/{session_id}")
async def delete_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a chat session and all its messages."""
    session = db.query(ChatSession).filter(
        ChatSession.session_id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    
    # Delete all messages in the session
    db.query(ChatMessage).filter(ChatMessage.session_id == session.id).delete()
    
    # Delete the session
    db.delete(session)
    db.commit()
    
    return {"message": "Chat session deleted successfully"}