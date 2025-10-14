# Mental Health Chatbot - Project Structure

## 📁 Complete Project Structure

```
mental-health-chatbot/
├── 📁 backend/                     # FastAPI Backend
│   ├── 📄 main.py                  # FastAPI application entry point
│   ├── 📄 database.py              # Database configuration
│   ├── 📄 models.py                # SQLAlchemy database models
│   ├── 📄 schemas.py               # Pydantic request/response schemas
│   ├── 📄 auth_utils.py            # Authentication utilities
│   ├── 📄 gemini_service.py        # Gemini AI integration
│   ├── 📄 mental_health_tests.py   # Test scoring logic
│   ├── 📁 routers/                 # API route handlers
│   │   ├── 📄 __init__.py
│   │   ├── 📄 auth.py              # Authentication routes
│   │   ├── 📄 chat.py              # Chatbot routes
│   │   ├── 📄 journal.py           # Journal routes
│   │   ├── 📄 mental_health_test.py # Test routes
│   │   ├── 📄 mindfulness.py       # Mindfulness routes
│   │   ├── 📄 sos.py               # Emergency contacts routes
│   │   └── 📄 profile.py           # User profile routes
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 .env.example             # Environment variables template
│   └── 📄 README.md                # Backend documentation
├── 📁 frontend/ (root)             # React Frontend
│   ├── 📁 components/              # Reusable React components
│   │   ├── 📄 Layout.tsx           # Main layout component
│   │   └── 📄 Spinner.tsx          # Loading spinner
│   ├── 📁 contexts/                # React Context providers
│   │   ├── 📄 AuthContext.tsx      # Authentication state
│   │   ├── 📄 JournalContext.tsx   # Journal state (legacy)
│   │   └── 📄 TestContext.tsx      # Test state (legacy)
│   ├── 📁 hooks/                   # Custom React hooks
│   │   └── 📄 useLocalStorage.ts   # Local storage hook
│   ├── 📁 pages/                   # Page components
│   │   ├── 📄 LoginPage.tsx        # Login/Register page
│   │   ├── 📄 ChatbotPage.tsx      # AI chatbot interface
│   │   ├── 📄 JournalPage.tsx      # Journal management
│   │   ├── 📄 TestPage.tsx         # Mental health tests
│   │   ├── 📄 ExercisesPage.tsx    # Mindfulness exercises
│   │   ├── 📄 SosPage.tsx          # Emergency resources
│   │   └── 📄 ProfilePage.tsx      # User profile
│   ├── 📁 services/                # API service layer
│   │   ├── 📄 api.ts               # Main API service
│   │   └── 📄 geminiService.ts     # Gemini AI service (legacy)
│   ├── 📄 App.tsx                  # Main React app component
│   ├── 📄 index.tsx                # React app entry point
│   ├── 📄 types.ts                 # TypeScript type definitions
│   ├── 📄 constants.ts             # App constants and configuration
│   ├── 📄 index.html               # HTML template
│   ├── 📄 package.json             # Node.js dependencies
│   ├── 📄 tsconfig.json            # TypeScript configuration
│   ├── 📄 vite.config.ts           # Vite build configuration
│   └── 📄 .env.example             # Frontend environment template
├── 📄 README.md                    # Main project documentation
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 📄 start.sh                     # Linux/Mac startup script
├── 📄 start.bat                    # Windows startup script
└── 📄 .gitignore                   # Git ignore rules
```

## 🏗️ Architecture Overview

### Backend Architecture (FastAPI)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI        │    │   Database      │
│   (React)       │◄──►│   Backend        │◄──►│   (SQLite/      │
│                 │    │                  │    │   PostgreSQL)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Gemini AI      │
                       │   (Google)       │
                       └──────────────────┘
```

### Database Schema

```sql
-- Core Tables
Users                    # User accounts and profiles
JournalEntries          # Personal diary entries
ChatSessions            # Chat conversation sessions
ChatMessages            # Individual chat messages
MentalHealthTestResults # Assessment results
MindfulnessExercises    # Available exercises
UserExerciseProgress    # User's exercise completion
SOSContacts             # Emergency contact information
```

### API Layer Structure

```
/api/
├── /auth/              # Authentication endpoints
├── /chat/              # Chatbot functionality
├── /journal/           # Journal CRUD operations
├── /test/              # Mental health assessments
├── /mindfulness/       # Mindfulness exercises
├── /sos/               # Emergency resources
└── /profile/           # User profile management
```

## 🔄 Data Flow

### Authentication Flow
1. User registers/logs in → JWT token issued
2. Token stored in localStorage
3. Token included in API requests
4. Backend validates token for protected routes

### Chatbot Flow
1. User sends message → Frontend API call
2. Backend receives message → Context analysis
3. Gemini AI generates response → Personalized output
4. Response stored in database → Sent to frontend

### Journal Flow
1. User creates entry → API call with mood/content
2. Backend validates and stores → Database insertion
3. Analytics calculated → Mood trends updated
4. Statistics returned → Frontend displays insights

## 🛠️ Technology Stack

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **Google Gemini**: AI language model
- **Uvicorn**: ASGI server

### Frontend Technologies
- **React 18**: UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **Heroicons**: Beautiful SVG icons

### Development Tools
- **Git**: Version control
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Hot Reload**: Development server with live updates

## 🔧 Configuration Files

### Backend Configuration
- `requirements.txt`: Python package dependencies
- `.env`: Environment variables (API keys, database URL)
- `main.py`: Application configuration and startup

### Frontend Configuration
- `package.json`: Node.js dependencies and scripts
- `tsconfig.json`: TypeScript compiler options
- `vite.config.ts`: Build tool configuration
- `.env`: Environment variables (API URL)

## 📊 Features Implementation

### ✅ Completed Features
- [x] User authentication (JWT-based)
- [x] Guest mode for privacy
- [x] AI chatbot with Gemini integration
- [x] Personalized responses based on user context
- [x] Journal system with mood tracking
- [x] Mental health assessments (PHQ-9, GAD-7, stress)
- [x] Mindfulness exercises with progress tracking
- [x] Emergency SOS contacts and resources
- [x] User profile management
- [x] Responsive UI with dark mode
- [x] Real-time chat interface
- [x] Data analytics and insights
- [x] Comprehensive API documentation

### 🔒 Security Features
- [x] Password hashing with bcrypt
- [x] JWT token authentication
- [x] Input validation and sanitization
- [x] CORS protection
- [x] SQL injection prevention
- [x] XSS protection through React

### 📱 UI/UX Features
- [x] Responsive design (mobile-friendly)
- [x] Dark/light mode support
- [x] Intuitive navigation
- [x] Loading states and error handling
- [x] Accessibility considerations
- [x] Modern, clean interface

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Set strong SECRET_KEY in production
- [ ] Configure PostgreSQL database
- [ ] Set up proper CORS origins
- [ ] Add rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure SSL/HTTPS
- [ ] Set up backup strategy
- [ ] Add health check endpoints

### Recommended Hosting
- **Backend**: Railway, Render, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: PostgreSQL on Railway/Supabase

## 📈 Scalability Considerations

### Backend Scaling
- Horizontal scaling with load balancers
- Database connection pooling
- Caching layer (Redis)
- Background task processing (Celery)

### Frontend Scaling
- CDN for static assets
- Code splitting and lazy loading
- Service worker for offline functionality
- Performance monitoring

## 🔍 Monitoring & Analytics

### Backend Monitoring
- API response times
- Database query performance
- Error rates and logging
- User activity metrics

### Frontend Monitoring
- Page load times
- User interaction tracking
- Error boundary reporting
- Performance metrics

---

This structure provides a solid foundation for a production-ready mental health support application with room for future enhancements and scaling.