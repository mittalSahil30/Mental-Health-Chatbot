# Mental Health Chatbot - Complete End-to-End Application

A comprehensive mental health support platform featuring an AI-powered chatbot, journal system, mental health assessments, mindfulness exercises, and emergency resources. Built with FastAPI backend and React frontend.

## 🌟 Features

### Core Features
- **🤖 AI Chatbot**: Personalized mental health support using Google Gemini AI
- **📝 Digital Journal**: Private diary with mood tracking and analytics
- **🧠 Mental Health Tests**: PHQ-9 style depression, GAD-7 style anxiety, and stress assessments
- **🧘 Mindfulness Exercises**: Guided breathing, meditation, and relaxation techniques
- **🆘 Emergency Resources**: Crisis hotlines and emergency contact information
- **👤 User Profiles**: Complete account management with progress tracking

### Authentication & Privacy
- **🔐 Secure Authentication**: JWT-based login/signup system
- **👻 Guest Mode**: Anonymous chatbot access for privacy-conscious users
- **🔒 Data Protection**: Secure user data handling and storage

### Personalization
- **📊 Progress Tracking**: Monitor mood trends, test results, and exercise completion
- **🎯 Personalized Responses**: AI adapts based on user history and context
- **📈 Analytics Dashboard**: Comprehensive statistics and insights

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.8+
- **Database**: SQLAlchemy with SQLite (easily configurable for PostgreSQL)
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Google Gemini API for chatbot responses
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: Context API with custom hooks
- **Build Tool**: Vite for fast development and building

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run the backend server**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Database
DATABASE_URL=sqlite:///./mental_health_chatbot.db

# Security
SECRET_KEY=your-secret-key-here-change-in-production

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here
```

### Frontend Configuration (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your backend `.env` file

## 📱 Usage

### For Users

1. **Getting Started**
   - Visit the application
   - Choose to sign up, log in, or continue as guest
   - Guest mode provides chatbot access only

2. **Using the Chatbot**
   - Navigate to the Chat section
   - Start conversing with the AI assistant
   - Receive personalized mental health support

3. **Journal Features**
   - Create daily journal entries
   - Rate your mood (1-10 scale)
   - Add tags for categorization
   - View mood trends and statistics

4. **Mental Health Assessments**
   - Take standardized assessments (depression, anxiety, stress)
   - Receive immediate results and recommendations
   - Track progress over time

5. **Mindfulness Exercises**
   - Browse exercises by category and difficulty
   - Follow guided instructions
   - Rate and track completed exercises

6. **Emergency Resources**
   - Access crisis hotlines and emergency contacts
   - Filter by category (crisis, emergency, support)
   - Get emergency guidance and safety planning tips

### For Developers

#### API Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Chatbot**
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/sessions` - Get chat sessions
- `DELETE /api/chat/sessions/{id}` - Delete session

**Journal**
- `GET /api/journal/entries` - Get journal entries
- `POST /api/journal/entries` - Create entry
- `PUT /api/journal/entries/{id}` - Update entry
- `DELETE /api/journal/entries/{id}` - Delete entry

**Tests**
- `GET /api/test/types` - Get available tests
- `GET /api/test/questions/{type}` - Get test questions
- `POST /api/test/submit` - Submit test responses

**Mindfulness**
- `GET /api/mindfulness/exercises` - Get exercises
- `POST /api/mindfulness/exercises/{id}/complete` - Mark complete

**SOS**
- `GET /api/sos/contacts` - Get emergency contacts
- `GET /api/sos/emergency-info` - Get emergency guidance

## 🛡️ Security Features

- **Password Security**: Bcrypt hashing with salt
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Pydantic models for API validation
- **CORS Protection**: Configurable cross-origin policies
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Rate Limiting**: (Recommended for production)

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
npm test
```

## 📦 Production Deployment

### Backend Deployment

1. **Environment Setup**
   - Set strong `SECRET_KEY`
   - Configure PostgreSQL database
   - Set production `DATABASE_URL`
   - Add your Gemini API key

2. **Database Migration**
   ```bash
   # The app auto-creates tables, but for production consider using Alembic
   alembic upgrade head
   ```

3. **Run with Production Server**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy Static Files**
   - Upload `dist/` folder to your hosting service
   - Configure your web server to serve the SPA
   - Set up proper routing for React Router

### Recommended Hosting

- **Backend**: Railway, Render, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: PostgreSQL on Railway, Supabase, or AWS RDS

## 🔒 Privacy & Compliance

- **Data Minimization**: Only collect necessary information
- **User Control**: Users can delete their accounts and data
- **Guest Mode**: Anonymous access for privacy-conscious users
- **Secure Storage**: Encrypted passwords and secure sessions
- **GDPR Considerations**: Built with privacy in mind

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is designed to provide mental health support and resources, but it is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about medical conditions.

## 🆘 Crisis Resources

If you or someone you know is in crisis:

- **US**: National Suicide Prevention Lifeline: 988
- **US**: Crisis Text Line: Text HOME to 741741
- **Emergency**: Call your local emergency number (911 in US)

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Check the documentation in `/backend/README.md`
- Review API docs at `http://localhost:8000/docs`

---

**Built with ❤️ for mental health awareness and support**