@echo off
echo 🧠 Starting Mental Health Chatbot Application
echo =============================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup backend
echo.
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install backend dependencies
echo 📥 Installing backend dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating backend .env file...
    copy .env.example .env
    echo 📝 Please edit backend\.env with your configuration (especially GEMINI_API_KEY)
)

REM Start backend server
echo 🚀 Starting backend server...
start /B python main.py

REM Setup frontend
echo.
echo 🔧 Setting up frontend...
cd ..

REM Install frontend dependencies
echo 📥 Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating frontend .env file...
    copy .env.example .env
)

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend
echo 🚀 Starting frontend...
start /B npm run dev

echo.
echo ✨ Application started successfully!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause >nul

REM Cleanup (this won't work perfectly in batch, but it's better than nothing)
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
echo 👋 Services stopped. Goodbye!