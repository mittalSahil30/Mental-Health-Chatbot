#!/bin/bash

echo "Starting Mental Health Chatbot Frontend..."

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start the React development server
echo "Starting React development server..."
cd frontend
npm start