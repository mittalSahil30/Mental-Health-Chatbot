from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
from dotenv import load_dotenv
import os
from datetime import datetime

from database import get_db, engine, Base
from models import User, Journal, MentalHealthTest, MindfulnessExercise, SOSContact, ChatMessage
from auth import get_current_user, create_access_token, verify_password, get_password_hash
from schemas import (
    UserCreate, UserLogin, UserResponse, JournalCreate, JournalResponse,
    MentalHealthTestCreate, MentalHealthTestResponse, MindfulnessExerciseResponse,
    SOSContactCreate, SOSContactResponse, ChatMessageCreate, ChatMessageResponse
)
from chatbot import get_chatbot_response
from mental_health_test import calculate_mental_health_score

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mental Health Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        is_guest=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        is_guest=db_user.is_guest
    )

@app.post("/auth/login", response_model=dict)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        is_guest=db_user.is_guest
    )}

@app.post("/auth/guest", response_model=UserResponse)
async def create_guest_user(db: Session = Depends(get_db)):
    # Create a guest user
    db_user = User(
        email=f"guest_{db.query(User).count() + 1}@guest.com",
        username=f"Guest_{db.query(User).count() + 1}",
        hashed_password="",
        is_guest=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        is_guest=db_user.is_guest
    )

# User profile endpoints
@app.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        is_guest=current_user.is_guest
    )

@app.put("/profile", response_model=UserResponse)
async def update_profile(
    username: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.username = username
    db.commit()
    db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        is_guest=current_user.is_guest
    )

# Journal endpoints
@app.post("/journal", response_model=JournalResponse)
async def create_journal_entry(
    journal: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_journal = Journal(
        title=journal.title,
        content=journal.content,
        mood=journal.mood,
        user_id=current_user.id
    )
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    
    return JournalResponse(
        id=db_journal.id,
        title=db_journal.title,
        content=db_journal.content,
        mood=db_journal.mood,
        created_at=db_journal.created_at
    )

@app.get("/journal", response_model=list[JournalResponse])
async def get_journal_entries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entries = db.query(Journal).filter(Journal.user_id == current_user.id).order_by(Journal.created_at.desc()).all()
    return [JournalResponse(
        id=entry.id,
        title=entry.title,
        content=entry.content,
        mood=entry.mood,
        created_at=entry.created_at
    ) for entry in entries]

# Mental Health Test endpoints
@app.post("/mental-health-test", response_model=MentalHealthTestResponse)
async def submit_mental_health_test(
    test_data: MentalHealthTestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    score = calculate_mental_health_score(test_data.responses)
    
    db_test = MentalHealthTest(
        responses=test_data.responses,
        score=score,
        user_id=current_user.id
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    
    return MentalHealthTestResponse(
        id=db_test.id,
        responses=db_test.responses,
        score=db_test.score,
        created_at=db_test.created_at
    )

@app.get("/mental-health-test", response_model=list[MentalHealthTestResponse])
async def get_mental_health_tests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tests = db.query(MentalHealthTest).filter(MentalHealthTest.user_id == current_user.id).order_by(MentalHealthTest.created_at.desc()).all()
    return [MentalHealthTestResponse(
        id=test.id,
        responses=test.responses,
        score=test.score,
        created_at=test.created_at
    ) for test in tests]

# Mindfulness Exercises endpoints
@app.get("/mindfulness-exercises", response_model=list[MindfulnessExerciseResponse])
async def get_mindfulness_exercises():
    exercises = [
        {
            "id": 1,
            "title": "Deep Breathing",
            "description": "Focus on your breath and take slow, deep breaths",
            "duration": 5,
            "instructions": "Sit comfortably, close your eyes, and breathe in for 4 counts, hold for 4 counts, and breathe out for 6 counts. Repeat for 5 minutes."
        },
        {
            "id": 2,
            "title": "Body Scan",
            "description": "Progressive relaxation technique focusing on different body parts",
            "duration": 10,
            "instructions": "Lie down comfortably and slowly focus on each part of your body from head to toe, releasing tension as you go."
        },
        {
            "id": 3,
            "title": "Mindful Walking",
            "description": "Walking meditation to ground yourself in the present moment",
            "duration": 15,
            "instructions": "Walk slowly and deliberately, focusing on each step and the sensations in your feet and legs."
        },
        {
            "id": 4,
            "title": "Gratitude Practice",
            "description": "Reflect on things you're grateful for",
            "duration": 5,
            "instructions": "Think of three things you're grateful for today and why they matter to you."
        }
    ]
    return exercises

# SOS Contacts endpoints
@app.post("/sos-contacts", response_model=SOSContactResponse)
async def create_sos_contact(
    contact: SOSContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_contact = SOSContact(
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        type=contact.type,
        user_id=current_user.id
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    return SOSContactResponse(
        id=db_contact.id,
        name=db_contact.name,
        phone=db_contact.phone,
        email=db_contact.email,
        type=db_contact.type
    )

@app.get("/sos-contacts", response_model=list[SOSContactResponse])
async def get_sos_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contacts = db.query(SOSContact).filter(SOSContact.user_id == current_user.id).all()
    return [SOSContactResponse(
        id=contact.id,
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        type=contact.type
    ) for contact in contacts]

# Chatbot endpoints
@app.post("/chat", response_model=ChatMessageResponse)
async def chat_with_bot(
    message: ChatMessageCreate,
    db: Session = Depends(get_db)
):
    # Handle both authenticated and guest users
    if message.user_id:
        current_user = db.query(User).filter(User.id == message.user_id).first()
        if not current_user:
            raise HTTPException(status_code=404, detail="User not found")
    else:
        # Create a temporary user object for guests
        current_user = type('User', (), {
            'id': None,
            'username': 'Guest',
            'is_guest': True
        })()
    
    # Get user's previous messages for context (only for registered users)
    previous_messages = []
    journal_entries = []
    mental_health_tests = []
    
    if current_user.id:
        previous_messages = db.query(ChatMessage).filter(
            ChatMessage.user_id == current_user.id
        ).order_by(ChatMessage.created_at.desc()).limit(10).all()
        
        # Get user's journal entries for personalization
        journal_entries = db.query(Journal).filter(
            Journal.user_id == current_user.id
        ).order_by(Journal.created_at.desc()).limit(5).all()
        
        # Get user's mental health test results
        mental_health_tests = db.query(MentalHealthTest).filter(
            MentalHealthTest.user_id == current_user.id
        ).order_by(MentalHealthTest.created_at.desc()).limit(3).all()
    
    # Generate personalized response
    try:
        response = get_chatbot_response(
            message.message,
            current_user,
            previous_messages,
            journal_entries,
            mental_health_tests
        )
    except Exception as e:
        print(f"Error generating chatbot response: {e}")
        response = "I'm sorry, I'm having trouble processing your message right now. Please try again in a moment."
    
    # Save messages only for registered users
    if current_user.id:
        # Save user message
        db_user_message = ChatMessage(
            message=message.message,
            is_user=True,
            user_id=current_user.id
        )
        db.add(db_user_message)
        
        # Save bot response
        db_bot_message = ChatMessage(
            message=response,
            is_user=False,
            user_id=current_user.id
        )
        db.add(db_bot_message)
        
        db.commit()
        db.refresh(db_bot_message)
        
        return ChatMessageResponse(
            id=db_bot_message.id,
            message=db_bot_message.message,
            is_user=db_bot_message.is_user,
            created_at=db_bot_message.created_at
        )
    else:
        # For guest users, return response without saving to database
        return ChatMessageResponse(
            id=0,
            message=response,
            is_user=False,
            created_at=datetime.utcnow()
        )

@app.get("/chat/history", response_model=list[ChatMessageResponse])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    return [ChatMessageResponse(
        id=msg.id,
        message=msg.message,
        is_user=msg.is_user,
        created_at=msg.created_at
    ) for msg in messages]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)