# Mental Health Chatbot - Complete End-to-End Setup Guide

A comprehensive full-stack Mental Health Chatbot application with AI-powered support, journal features, mental health assessments, mindfulness exercises, and more.

## 🌟 Features

### Core Features
- **User Authentication**: Signup, login, and guest mode for privacy
- **AI Chatbot**: Personalized mental health support using Google's Gemini API
- **Journal/Diary**: Private note-taking with mood tracking
- **Mental Health Assessments**: 
  - GAD-7 (Generalized Anxiety Disorder)
  - PHQ-9 (Depression)
  - PSS-10 (Perceived Stress Scale)
- **Mindfulness Exercises**: 10+ guided exercises including:
  - Breathing exercises
  - Meditation practices
  - Grounding techniques
  - Relaxation methods
- **SOS Hotline**: Emergency contacts and crisis resources
- **User Profile Management**: Customizable profiles with preferences
- **Analytics**: Track mood patterns, chat sentiment, and assessment trends

### Personalization
- Chatbot provides personalized responses based on:
  - User's assessment results
  - Recent journal entries and moods
  - Chat history and sentiment
  - User profile information

## 🏗️ Architecture

### Backend (Python/Flask)
- **Framework**: Flask 3.0.0
- **Database**: SQLAlchemy with SQLite (upgradable to PostgreSQL/MySQL)
- **Authentication**: JWT tokens
- **AI Integration**: Google Gemini API
- **Features**: RESTful API, CORS support, comprehensive error handling

### Frontend (React/TypeScript)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Markdown**: React Markdown for chat formatting

## 📋 Prerequisites

### Required Software
- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: 7 or higher
- **Git**: For version control

### API Keys
- **Google Gemini API Key**: Required for AI chatbot functionality
  - Get it from: https://makersuite.google.com/app/apikey
  - Free tier available

## 🚀 Installation & Setup

### Step 1: Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create Python virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add:
   - `SECRET_KEY`: Generate a secure random key
   - `JWT_SECRET_KEY`: Generate another secure random key
   - `GEMINI_API_KEY`: Your Google Gemini API key

   **Generate secure keys** (Python):
   ```python
   import secrets
   print(secrets.token_hex(32))
   ```

6. **Initialize the database**:
   ```bash
   python run.py
   ```
   This will:
   - Create all database tables
   - Initialize default SOS contacts
   - Start the backend server on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Open a new terminal** and navigate to project root:
   ```bash
   cd /path/to/project
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   - `API_KEY`: Your Google Gemini API key (same as backend)
   - `VITE_API_URL`: Backend API URL (default: `http://localhost:5000/api`)

4. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or similar)

### Step 3: Access the Application

1. **Open your browser** and go to the frontend URL (shown in terminal)
2. **Create an account** or **continue as guest**
3. **Start using the application!**

## 📁 Project Structure

```
mental-health-chatbot/
├── backend/                    # Python Flask backend
│   ├── routes/                 # API route handlers
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── chat.py            # Chatbot endpoints
│   │   ├── journal.py         # Journal endpoints
│   │   ├── assessment.py      # Assessment endpoints
│   │   ├── mindfulness.py     # Mindfulness endpoints
│   │   ├── profile.py         # Profile endpoints
│   │   └── sos.py             # SOS contacts endpoints
│   ├── app.py                 # Flask application
│   ├── models.py              # Database models
│   ├── run.py                 # Run script
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── README.md             # Backend documentation
│
├── src/                       # Frontend source (if using src/)
│   ├── components/           # React components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Page components
│   ├── services/             # API services
│   └── types.ts              # TypeScript types
│
├── pages/                     # Frontend pages (current structure)
├── services/                  # API service layer
├── components/                # Reusable components
├── contexts/                  # State management
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Frontend environment template
└── PROJECT_SETUP.md          # This file
```

## 🔧 Configuration

### Backend Configuration

**Database Options**:
- **SQLite** (default): Good for development
- **PostgreSQL**: Recommended for production
- **MySQL**: Also supported

To switch databases, update `DATABASE_URL` in `backend/.env`:
```bash
# PostgreSQL
DATABASE_URL=postgresql://username:password@localhost/mental_health

# MySQL
DATABASE_URL=mysql://username:password@localhost/mental_health
```

### Frontend Configuration

**API URL**: Update `VITE_API_URL` in `.env` if your backend runs on a different port or domain.

### SOS Contacts Customization

The backend includes template SOS contacts. To customize:

1. **Via API**: Use the SOS endpoints to update contacts
2. **Directly in code**: Edit `backend/routes/sos.py` > `DEFAULT_CONTACTS`

Update phone numbers and emails for:
- Local mental health crisis center
- Personal emergency contacts
- Any other relevant contacts for your region

## 🎯 Usage Guide

### For Users

1. **Sign Up/Login**: Create an account or use guest mode
2. **Chat**: Talk to Serene, your AI mental health companion
3. **Journal**: Keep a private diary with mood tracking
4. **Take Assessments**: Complete mental health questionnaires
5. **Practice Mindfulness**: Try guided exercises
6. **Emergency**: Access SOS contacts when needed
7. **Profile**: Customize your profile and preferences

### For Developers

**Running Backend Only**:
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Running Frontend Only**:
```bash
npm run dev
```

**Building for Production**:
```bash
# Frontend
npm run build

# Backend - use a production WSGI server like Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🔒 Security Notes

### Important Security Measures

1. **Never commit `.env` files** - they contain sensitive information
2. **Use strong SECRET_KEY and JWT_SECRET_KEY** in production
3. **Enable HTTPS** in production (use SSL/TLS)
4. **Implement rate limiting** on API endpoints
5. **Validate all user inputs** (already implemented)
6. **Use environment variables** for all sensitive data
7. **Keep dependencies updated** regularly

### Production Checklist

- [ ] Change all default secret keys
- [ ] Use a production database (PostgreSQL/MySQL)
- [ ] Enable HTTPS
- [ ] Set up proper logging
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Set up automated backups
- [ ] Configure CORS properly (restrict origins)
- [ ] Use environment-specific configs
- [ ] Set up monitoring and alerts

## 🧪 Testing

### Testing Backend

```bash
cd backend
pytest  # After setting up tests
```

### Testing Frontend

```bash
npm test
```

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Import errors
- **Solution**: Ensure virtual environment is activated and dependencies are installed

**Problem**: Database errors
- **Solution**: Delete the database file and restart the application

**Problem**: Gemini API errors
- **Solution**: Check your API key is valid and billing is enabled

### Frontend Issues

**Problem**: Connection refused to backend
- **Solution**: Ensure backend server is running on the correct port

**Problem**: CORS errors
- **Solution**: Check VITE_API_URL in `.env` matches backend URL

**Problem**: Blank page
- **Solution**: Check browser console for errors, ensure all dependencies are installed

### Common Issues

**Problem**: "authToken not found" errors
- **Solution**: Clear browser localStorage and login again

**Problem**: Chat responses not working
- **Solution**: Verify Gemini API key is set in both frontend and backend `.env` files

## 📚 API Documentation

Full API documentation is available in the backend README at `backend/README.md`.

Quick reference:
- **Auth**: `/api/auth/*`
- **Chat**: `/api/chat/*`
- **Journal**: `/api/journal/*`
- **Assessment**: `/api/assessment/*`
- **Mindfulness**: `/api/mindfulness/*`
- **Profile**: `/api/profile/*`
- **SOS**: `/api/sos/*`

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is provided as-is for educational and personal use.

## 🆘 Support

For issues or questions:
- Check the troubleshooting section above
- Review the backend and frontend README files
- Open an issue on the repository

## 🎨 Customization

### Branding
- Update app name in `package.json` and `backend/app.py`
- Modify colors in Tailwind config
- Update logo and icons

### Features
- Add new assessment types in `backend/routes/assessment.py`
- Add new mindfulness exercises in `backend/routes/mindfulness.py`
- Customize chatbot prompts in `backend/routes/chat.py`

## 🔄 Updates

To update the application:

```bash
# Update backend dependencies
cd backend
pip install -r requirements.txt --upgrade

# Update frontend dependencies
npm update
```

## 🌐 Deployment

### Backend Deployment Options
- **Heroku**: Easy deployment with PostgreSQL
- **AWS**: EC2 or Elastic Beanstalk
- **Google Cloud**: App Engine or Cloud Run
- **DigitalOcean**: Droplets or App Platform
- **Railway**: Modern deployment platform

### Frontend Deployment Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: Easy static hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **GitHub Pages**: Free static hosting

---

**Built with ❤️ for mental health awareness and support**
