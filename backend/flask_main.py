from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import secrets
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Simple in-memory storage
users = {}
sessions = {}
journals = {}
mental_health_tests = {}
sos_contacts = {}
chat_messages = {}

# Helper function to get current user
def get_current_user():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    user_id = sessions.get(token)
    if not user_id:
        return None
    
    for user in users.values():
        if user["id"] == user_id:
            return user
    return None

# Health check endpoints
@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Mental Health Chatbot API is running!"})

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "API is working properly"})

# Authentication endpoints
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    
    if not email or not username or not password:
        return jsonify({"detail": "Missing required fields"}), 400
    
    if email in users:
        return jsonify({"detail": "Email already registered"}), 400
    
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
    
    return jsonify({
        "id": user_id,
        "email": email,
        "username": username,
        "is_guest": False
    })

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"detail": "Missing email or password"}), 400
    
    if email not in users:
        return jsonify({"detail": "Invalid credentials"}), 401
    
    user = users[email]
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    if user["password_hash"] != password_hash:
        return jsonify({"detail": "Invalid credentials"}), 401
    
    # Create session token
    token = secrets.token_urlsafe(32)
    sessions[token] = user["id"]
    
    return jsonify({
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "username": user["username"],
            "is_guest": user["is_guest"]
        }
    })

@app.route("/auth/guest", methods=["POST"])
def create_guest_user():
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
    
    return jsonify({
        "id": user_id,
        "email": email,
        "username": username,
        "is_guest": True
    })

# Journal endpoints
@app.route("/journal", methods=["POST"])
def create_journal_entry():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    data = request.get_json()
    entry_id = len(journals) + 1
    journal_entry = {
        "id": entry_id,
        "title": data.get("title", ""),
        "content": data.get("content", ""),
        "mood": data.get("mood", "neutral"),
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    journals[entry_id] = journal_entry
    
    return jsonify({
        "id": entry_id,
        "title": journal_entry["title"],
        "content": journal_entry["content"],
        "mood": journal_entry["mood"],
        "created_at": journal_entry["created_at"]
    })

@app.route("/journal", methods=["GET"])
def get_journal_entries():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    user_entries = [
        entry for entry in journals.values() 
        if entry["user_id"] == user["id"]
    ]
    user_entries.sort(key=lambda x: x["created_at"], reverse=True)
    
    return jsonify(user_entries)

@app.route("/journal/<int:entry_id>", methods=["PUT"])
def update_journal_entry(entry_id):
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    if entry_id not in journals:
        return jsonify({"detail": "Entry not found"}), 404
    
    entry = journals[entry_id]
    if entry["user_id"] != user["id"]:
        return jsonify({"detail": "Access denied"}), 403
    
    data = request.get_json()
    entry["title"] = data.get("title", entry["title"])
    entry["content"] = data.get("content", entry["content"])
    entry["mood"] = data.get("mood", entry["mood"])
    
    return jsonify({
        "id": entry["id"],
        "title": entry["title"],
        "content": entry["content"],
        "mood": entry["mood"],
        "created_at": entry["created_at"]
    })

@app.route("/journal/<int:entry_id>", methods=["DELETE"])
def delete_journal_entry(entry_id):
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    if entry_id not in journals:
        return jsonify({"detail": "Entry not found"}), 404
    
    entry = journals[entry_id]
    if entry["user_id"] != user["id"]:
        return jsonify({"detail": "Access denied"}), 403
    
    del journals[entry_id]
    return jsonify({"message": "Entry deleted successfully"})

# Mental Health Test endpoints
@app.route("/mental-health-test/questions", methods=["GET"])
def get_mental_health_questions():
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
    return jsonify(questions)

@app.route("/mental-health-test/submit", methods=["POST"])
def submit_mental_health_test():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    answers = request.get_json()
    
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
    
    return jsonify({
        "id": test_id,
        "score": average_score,
        "created_at": test_entry["created_at"]
    })

@app.route("/mental-health-test/history", methods=["GET"])
def get_mental_health_tests():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    user_tests = [
        test for test in mental_health_tests.values() 
        if test["user_id"] == user["id"]
    ]
    user_tests.sort(key=lambda x: x["created_at"], reverse=True)
    
    return jsonify(user_tests)

# Mindfulness Exercises endpoints
@app.route("/mindfulness/exercises", methods=["GET"])
def get_mindfulness_exercises():
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
    return jsonify(exercises)

# SOS Contacts endpoints
@app.route("/sos-contacts", methods=["POST"])
def create_sos_contact():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    data = request.get_json()
    contact_id = len(sos_contacts) + 1
    contact = {
        "id": contact_id,
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "email": data.get("email", ""),
        "relationship": data.get("relationship", ""),
        "notes": data.get("notes", ""),
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    sos_contacts[contact_id] = contact
    
    return jsonify({
        "id": contact_id,
        "name": contact["name"],
        "phone": contact["phone"],
        "email": contact["email"],
        "relationship": contact["relationship"],
        "notes": contact["notes"]
    })

@app.route("/sos-contacts", methods=["GET"])
def get_sos_contacts():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    user_contacts = [
        contact for contact in sos_contacts.values() 
        if contact["user_id"] == user["id"]
    ]
    
    return jsonify(user_contacts)

@app.route("/sos-contacts/<int:contact_id>", methods=["PUT"])
def update_sos_contact(contact_id):
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    if contact_id not in sos_contacts:
        return jsonify({"detail": "Contact not found"}), 404
    
    contact = sos_contacts[contact_id]
    if contact["user_id"] != user["id"]:
        return jsonify({"detail": "Access denied"}), 403
    
    data = request.get_json()
    contact["name"] = data.get("name", contact["name"])
    contact["phone"] = data.get("phone", contact["phone"])
    contact["email"] = data.get("email", contact["email"])
    contact["relationship"] = data.get("relationship", contact["relationship"])
    contact["notes"] = data.get("notes", contact["notes"])
    
    return jsonify({
        "id": contact["id"],
        "name": contact["name"],
        "phone": contact["phone"],
        "email": contact["email"],
        "relationship": contact["relationship"],
        "notes": contact["notes"]
    })

@app.route("/sos-contacts/<int:contact_id>", methods=["DELETE"])
def delete_sos_contact(contact_id):
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    if contact_id not in sos_contacts:
        return jsonify({"detail": "Contact not found"}), 404
    
    contact = sos_contacts[contact_id]
    if contact["user_id"] != user["id"]:
        return jsonify({"detail": "Access denied"}), 403
    
    del sos_contacts[contact_id]
    return jsonify({"message": "Contact deleted successfully"})

# Chatbot endpoints
@app.route("/chat", methods=["POST"])
def chat_with_bot():
    data = request.get_json()
    message = data.get("message", "")
    user_id = data.get("user_id")
    
    if not message:
        return jsonify({"detail": "Message is required"}), 400
    
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
    
    return jsonify({
        "id": 1,
        "message": response,
        "is_user": False,
        "created_at": datetime.now().isoformat()
    })

# Profile endpoints
@app.route("/profile", methods=["GET"])
def get_profile():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    return jsonify({
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "is_guest": user["is_guest"]
    })

@app.route("/profile", methods=["PUT"])
def update_profile():
    user = get_current_user()
    if not user:
        return jsonify({"detail": "Authentication required"}), 401
    
    data = request.get_json()
    if "username" in data:
        user["username"] = data["username"]
    if "email" in data:
        user["email"] = data["email"]
    
    return jsonify({
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "is_guest": user["is_guest"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000, debug=True)