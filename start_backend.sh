#!/bin/bash

echo "Starting Mental Health Chatbot Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file..."
    cp backend/.env.example backend/.env
    echo "Please edit backend/.env and add your GEMINI_API_KEY"
fi

# Start the backend server
echo "Starting FastAPI server..."
cd backend
python main.py