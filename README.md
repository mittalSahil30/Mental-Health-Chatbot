# 🧠 Mental Health Chatbot - SereneMind AI

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*A comprehensive full-stack mental health support application with AI-powered chatbot, journaling, assessments, and mindfulness exercises*

</div>

## ✨ Features

### 🤖 AI-Powered Chatbot
- Personalized mental health support using Google Gemini API
- Context-aware responses based on user history, mood, and assessments
- Sentiment analysis and conversation tracking
- Private and secure conversations

### 📝 Personal Journal
- Private diary with mood tracking
- Tag entries with emotions
- Search and filter by mood
- Analytics and mood patterns over time

### 📊 Mental Health Assessments
- **GAD-7**: Generalized Anxiety Disorder assessment
- **PHQ-9**: Depression screening questionnaire
- **PSS-10**: Perceived Stress Scale
- Detailed results with severity levels
- Personalized recommendations
- Track progress over time

### 🧘 Mindfulness Exercises
10+ guided exercises including:
- Deep breathing techniques
- Meditation practices
- Grounding exercises (5-4-3-2-1)
- Progressive muscle relaxation
- Loving-kindness meditation
- And more...

### 🆘 SOS Hotline
- Emergency crisis contacts
- Mental health resources
- Categorized by service type
- Customizable for your region

### 👤 User Management
- Secure signup/login system
- Guest mode for privacy
- Profile customization
- Usage statistics and analytics

### 🔒 Privacy & Security
- JWT-based authentication
- Encrypted passwords
- Guest mode for anonymous chatbot access
- Secure data storage

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### 1️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Run backend server
python run.py
```

Backend will run on `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your API keys

# Run development server
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar)

### 3️⃣ Start Using

1. Open your browser to the frontend URL
2. Create an account or continue as guest
3. Start chatting with Serene, your AI mental health companion!

## 📖 Documentation

- **[Complete Setup Guide](PROJECT_SETUP.md)** - Detailed installation and configuration
- **[Backend API Documentation](backend/README.md)** - API endpoints and usage
- **[Architecture Overview](PROJECT_SETUP.md#-architecture)** - System design and tech stack

## 🏗️ Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **Database**: SQLAlchemy (SQLite/PostgreSQL/MySQL)
- **Authentication**: Flask-JWT-Extended
- **AI**: Google Generative AI (Gemini)
- **CORS**: Flask-CORS

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router v7
- **UI**: Tailwind CSS
- **Icons**: Heroicons
- **Markdown**: React Markdown

## 📁 Project Structure

```
mental-health-chatbot/
├── backend/              # Python Flask backend
│   ├── routes/          # API endpoints
│   ├── models.py        # Database models
│   ├── app.py          # Flask app
│   └── run.py          # Server runner
├── pages/               # React pages
├── components/          # React components
├── contexts/            # State management
├── services/            # API integration
└── PROJECT_SETUP.md    # Detailed guide
```

## 🔐 Environment Variables

### Backend (`.env` in `backend/`)
```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=sqlite:///mental_health.db
```

### Frontend (`.env` in root)
```env
API_KEY=your-gemini-api-key
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Key Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login
- `POST /api/auth/guest` - Guest access
- `POST /api/chat/message` - Send chat message
- `GET /api/chat/history` - Get chat history
- `POST /api/journal/entries` - Create journal entry
- `POST /api/assessment/submit` - Submit assessment
- `GET /api/mindfulness/exercises` - Get exercises
- `GET /api/sos/contacts` - Get emergency contacts

[See full API documentation](backend/README.md)

## 🛠️ Development

### Run Backend Only
```bash
cd backend
source venv/bin/activate
python run.py
```

### Run Frontend Only
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🐛 Troubleshooting

### Backend not connecting?
- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in `.env` matches backend URL

### Chat not working?
- Verify Gemini API key is set in both `.env` files
- Check browser console for errors

### Database errors?
- Delete `backend/mental_health.db` and restart

[More troubleshooting →](PROJECT_SETUP.md#-troubleshooting)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or educational purposes

## ⚠️ Disclaimer

This application is for informational and educational purposes only. It is not a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.

## 🌟 Acknowledgments

- Google Gemini API for AI capabilities
- Mental health assessment scales (GAD-7, PHQ-9, PSS-10)
- Crisis hotline organizations for their vital work

## 📞 Support

- 📧 For issues: Open a GitHub issue
- 📖 Documentation: Check `PROJECT_SETUP.md`
- 🔍 Backend API: See `backend/README.md`

---

<div align="center">

**Built with ❤️ for mental health awareness and support**

*Remember: It's okay to not be okay. You're not alone.* 🌈

</div>
