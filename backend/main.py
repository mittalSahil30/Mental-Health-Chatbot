from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
from contextlib import asynccontextmanager

from database import engine, get_db
from models import Base
from routers import auth, chat, journal, mental_health_test, mindfulness, sos, profile
from auth_utils import verify_token

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Mental Health Chatbot API...")
    yield
    # Shutdown
    print("Shutting down Mental Health Chatbot API...")

app = FastAPI(
    title="Mental Health Chatbot API",
    description="A comprehensive mental health support platform with chatbot, journal, assessments, and more",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chatbot"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
app.include_router(mental_health_test.router, prefix="/api/test", tags=["Mental Health Test"])
app.include_router(mindfulness.router, prefix="/api/mindfulness", tags=["Mindfulness"])
app.include_router(sos.router, prefix="/api/sos", tags=["SOS Contacts"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])

@app.get("/")
async def root():
    return {"message": "Mental Health Chatbot API is running!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)