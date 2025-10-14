#!/usr/bin/env python
"""
Run script for Mental Health Chatbot Backend
"""
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Import app after loading environment variables
from app import app, db

if __name__ == '__main__':
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
        print("✓ Database tables created successfully!")
        
        # Initialize default SOS contacts
        from routes.sos import init_default_contacts
        init_default_contacts()
        print("✓ Default SOS contacts initialized!")
    
    print("\n" + "="*50)
    print("Mental Health Chatbot Backend Server")
    print("="*50)
    print(f"Server running at: http://localhost:5000")
    print(f"API Documentation: http://localhost:5000")
    print("="*50 + "\n")
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
