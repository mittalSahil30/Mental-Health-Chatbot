from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
from dotenv import load_dotenv
import os

from database import get_db, engine, Base
from models import User, Journal, MentalHealthTest, TestResponse, MindfulnessExercise, SOSContact
from auth import get_current_user, create_access_token, verify_password, get_password_hash
from schemas import (
    UserCreate, UserLogin, UserResponse, JournalCreate, JournalResponse,
    TestCreate, TestResponse as TestResponseSchema, ExerciseResponse,
    SOSContactCreate, SOSContactResponse, ChatMessage, ChatResponse
)
from chatbot import get_chatbot_response
from services import (
    create_user_service, authenticate_user_service, create_journal_entry,
    get_user_journals, create_mental_health_test, get_user_tests,
    create_test_response, get_mindfulness_exercises, create_sos_contact,
    get_sos_contacts, update_user_profile, get_user_profile
)

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mental Health Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(db, user)

@app.post("/auth/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    return authenticate_user_service(db, user)

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# Journal endpoints
@app.post("/journal", response_model=JournalResponse)
async def create_journal(
    journal: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_journal_entry(db, journal, current_user.id)

@app.get("/journal", response_model=list[JournalResponse])
async def get_journals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_journals(db, current_user.id)

# Mental Health Test endpoints
@app.post("/test", response_model=TestResponseSchema)
async def create_test(
    test: TestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_mental_health_test(db, test, current_user.id)

@app.get("/test", response_model=list[TestResponseSchema])
async def get_tests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_tests(db, current_user.id)

@app.post("/test/{test_id}/response")
async def submit_test_response(
    test_id: int,
    responses: list[dict],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_test_response(db, test_id, responses, current_user.id)

# Mindfulness Exercises endpoints
@app.get("/exercises", response_model=list[ExerciseResponse])
async def get_exercises(db: Session = Depends(get_db)):
    return get_mindfulness_exercises(db)

# SOS Contacts endpoints
@app.post("/sos", response_model=SOSContactResponse)
async def create_sos_contact(
    contact: SOSContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_sos_contact(db, contact, current_user.id)

@app.get("/sos", response_model=list[SOSContactResponse])
async def get_sos_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_sos_contacts(db, current_user.id)

# Profile endpoints
@app.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_user_profile(db, current_user.id, profile_data)

@app.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_profile(db, current_user.id)

# Chatbot endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(
    message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    response = await get_chatbot_response(message.message, current_user, db)
    return ChatResponse(response=response)

# Guest chat endpoint (no authentication required)
@app.post("/chat/guest", response_model=ChatResponse)
async def guest_chat(message: ChatMessage):
    response = await get_chatbot_response(message.message, None, None)
    return ChatResponse(response=response)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)