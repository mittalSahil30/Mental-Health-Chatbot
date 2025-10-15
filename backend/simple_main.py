from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
import sqlite3
from datetime import datetime
import hashlib
import secrets

app = FastAPI(title="Mental Health Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage
users = {}
sessions = {}
journals = {}
mental_health_tests = {}
sos_contacts = {}
chat_messages = {}

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "Mental Health Chatbot API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working properly"}

# Authentication endpoints
@app.post("/auth/register")
async def register(user_data: dict):
    email = user_data.get("email")
    username = user_data.get("username")
    password = user_data.get("password")
    
    if not email or not username or not password:
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    if email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Simple password hash
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    user_id = len(users) + 1
    users[email] = {
        "id": user_id,
        "email": email,
        "username": username,
        "password_hash": password_hash,
        "is_guest": False
    }
    
    return {
        "id": user_id,
        "email": email,
        "username": username,
        "is_guest": False
    }

@app.post("/auth/login")
async def login(user_data: dict):
    email = user_data.get("email")
    password = user_data.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password")
    
    if email not in users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = users[email]
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    if user["password_hash"] != password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session token
    token = secrets.token_urlsafe(32)
    sessions[token] = user["id"]
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "is_guest": user["is_guest"]
        }
    }

@app.post("/auth/guest")
async def create_guest_user():
    user_id = len(users) + 1
    email = f"guest_{user_id}@guest.com"
    username = f"Guest_{user_id}"
    
    users[email] = {
        "id": user_id,
        "email": email,
        "username": username,
        "password_hash": "",
        "is_guest": True
    }
    
    return {
        "id": user_id,
        "email": email,
        "username": username,
        "is_guest": True
    }

# Helper function to get current user
def get_current_user(token: str = None):
    if not token:
        return None
    user_id = sessions.get(token)
    if not user_id:
        return None
    
    for user in users.values():
        if user["id"] == user_id:
            return user
    return None

# Journal endpoints
@app.post("/journal")
async def create_journal_entry(entry_data: dict, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    entry_id = len(journals) + 1
    journal_entry = {
        "id": entry_id,
        "title": entry_data.get("title", ""),
        "content": entry_data.get("content", ""),
        "mood": entry_data.get("mood", "neutral"),
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    journals[entry_id] = journal_entry
    
    return {
        "id": entry_id,
        "title": journal_entry["title"],
        "content": journal_entry["content"],
        "mood": journal_entry["mood"],
        "created_at": journal_entry["created_at"]
    }

@app.get("/journal")
async def get_journal_entries(token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user_entries = [
        entry for entry in journals.values() 
        if entry["user_id"] == user["id"]
    ]
    user_entries.sort(key=lambda x: x["created_at"], reverse=True)
    
    return user_entries

@app.put("/journal/{entry_id}")
async def update_journal_entry(entry_id: int, entry_data: dict, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if entry_id not in journals:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry = journals[entry_id]
    if entry["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    entry["title"] = entry_data.get("title", entry["title"])
    entry["content"] = entry_data.get("content", entry["content"])
    entry["mood"] = entry_data.get("mood", entry["mood"])
    
    return {
        "id": entry["id"],
        "title": entry["title"],
        "content": entry["content"],
        "mood": entry["mood"],
        "created_at": entry["created_at"]
    }

@app.delete("/journal/{entry_id}")
async def delete_journal_entry(entry_id: int, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if entry_id not in journals:
        raise HTTPException(status_code=404, detail="Entry not found")
    
    entry = journals[entry_id]
    if entry["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    del journals[entry_id]
    return {"message": "Entry deleted successfully"}

# Mental Health Test endpoints
@app.get("/mental-health-test/questions")
async def get_mental_health_questions():
    questions = [
        {"id": "q1", "question": "How often do you feel overwhelmed by daily tasks?", "category": "stress"},
        {"id": "q2", "question": "How often do you feel sad or down?", "category": "mood"},
        {"id": "q3", "question": "How often do you have trouble sleeping?", "category": "sleep"},
        {"id": "q4", "question": "How often do you feel anxious or worried?", "category": "anxiety"},
        {"id": "q5", "question": "How often do you feel isolated or lonely?", "category": "social"},
        {"id": "q6", "question": "How often do you have trouble concentrating?", "category": "focus"},
        {"id": "q7", "question": "How often do you feel hopeless about the future?", "category": "hope"},
        {"id": "q8", "question": "How often do you feel irritable or angry?", "category": "mood"},
        {"id": "q9", "question": "How often do you avoid social situations?", "category": "social"},
        {"id": "q10", "question": "How often do you feel like you have no energy?", "category": "energy"}
    ]
    return questions

@app.post("/mental-health-test/submit")
async def submit_mental_health_test(answers: dict, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Calculate score (simple average)
    total_score = sum(answers.values())
    average_score = total_score / len(answers) if answers else 0
    
    test_id = len(mental_health_tests) + 1
    test_entry = {
        "id": test_id,
        "responses": answers,
        "score": average_score,
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    mental_health_tests[test_id] = test_entry
    
    return {
        "id": test_id,
        "score": average_score,
        "created_at": test_entry["created_at"]
    }

@app.get("/mental-health-test/history")
async def get_mental_health_tests(token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user_tests = [
        test for test in mental_health_tests.values() 
        if test["user_id"] == user["id"]
    ]
    user_tests.sort(key=lambda x: x["created_at"], reverse=True)
    
    return user_tests

# Mindfulness Exercises endpoints
@app.get("/mindfulness/exercises")
async def get_mindfulness_exercises():
    exercises = [
        {
            "id": 1,
            "title": "Breathing Exercise",
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
@app.post("/sos-contacts")
async def create_sos_contact(contact_data: dict, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    contact_id = len(sos_contacts) + 1
    contact = {
        "id": contact_id,
        "name": contact_data.get("name", ""),
        "phone": contact_data.get("phone", ""),
        "email": contact_data.get("email", ""),
        "relationship": contact_data.get("relationship", ""),
        "notes": contact_data.get("notes", ""),
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    sos_contacts[contact_id] = contact
    
    return {
        "id": contact_id,
        "name": contact["name"],
        "phone": contact["phone"],
        "email": contact["email"],
        "relationship": contact["relationship"],
        "notes": contact["notes"]
    }

@app.get("/sos-contacts")
async def get_sos_contacts(token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user_contacts = [
        contact for contact in sos_contacts.values() 
        if contact["user_id"] == user["id"]
    ]
    
    return user_contacts

@app.put("/sos-contacts/{contact_id}")
async def update_sos_contact(contact_id: int, contact_data: dict, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if contact_id not in sos_contacts:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact = sos_contacts[contact_id]
    if contact["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    contact["name"] = contact_data.get("name", contact["name"])
    contact["phone"] = contact_data.get("phone", contact["phone"])
    contact["email"] = contact_data.get("email", contact["email"])
    contact["relationship"] = contact_data.get("relationship", contact["relationship"])
    contact["notes"] = contact_data.get("notes", contact["notes"])
    
    return {
        "id": contact["id"],
        "name": contact["name"],
        "phone": contact["phone"],
        "email": contact["email"],
        "relationship": contact["relationship"],
        "notes": contact["notes"]
    }

@app.delete("/sos-contacts/{contact_id}")
async def delete_sos_contact(contact_id: int, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if contact_id not in sos_contacts:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact = sos_contacts[contact_id]
    if contact["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    del sos_contacts[contact_id]
    return {"message": "Contact deleted successfully"}

# Chatbot endpoints
@app.post("/chat")
async def chat_with_bot(message_data: dict):
    message = message_data.get("message", "")
    user_id = message_data.get("user_id")
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Simple chatbot responses
    responses = [
        "I understand you're going through a difficult time. It's important to remember that your feelings are valid.",
        "Thank you for sharing that with me. It takes courage to open up about your struggles.",
        "I'm here to listen and support you. Remember that seeking help is a sign of strength, not weakness.",
        "It sounds like you're dealing with a lot right now. Have you considered talking to a mental health professional?",
        "Your mental health matters. Please don't hesitate to reach out to someone you trust or a professional.",
        "I appreciate you sharing your thoughts with me. Remember, you're not alone in this journey.",
        "It's okay to not be okay sometimes. What matters is that you're taking steps to care for yourself.",
        "Thank you for trusting me with your feelings. Consider keeping a journal to track your thoughts and emotions.",
        "I hear you, and I want you to know that your feelings are important. Have you tried any mindfulness exercises?",
        "It's brave of you to reach out. Remember that there are people who care about you and want to help."
    ]
    
    import random
    response = random.choice(responses)
    
    # Save message for registered users
    if user_id:
        message_id = len(chat_messages) + 1
        chat_messages[message_id] = {
            "id": message_id,
            "message": response,
            "is_user": False,
            "user_id": user_id,
            "created_at": datetime.now().isoformat()
        }
    
    return {
        "id": 1,
        "message": response,
        "is_user": False,
        "created_at": datetime.now().isoformat()
    }

# Profile endpoints
@app.get("/profile")
async def get_profile(token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    return {
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "is_guest": user["is_guest"]
    }

@app.put("/profile")
async def update_profile(profile_data: dict, token: str = None):
    user = get_current_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if "username" in profile_data:
        user["username"] = profile_data["username"]
    if "email" in profile_data:
        user["email"] = profile_data["email"]
    
    return {
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "is_guest": user["is_guest"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)