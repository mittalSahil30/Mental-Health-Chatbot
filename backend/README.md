# Mental Health Chatbot Backend

A comprehensive FastAPI backend for a mental health support platform with chatbot, journal, assessments, and more.

## Features

- **Authentication**: JWT-based auth with signup/login and guest access for chatbot
- **AI Chatbot**: Gemini AI integration for personalized mental health support
- **Journal System**: Full CRUD operations for personal diary entries with mood tracking
- **Mental Health Tests**: PHQ-9 style depression, GAD-7 style anxiety, and stress assessments
- **Mindfulness Exercises**: Guided exercises with progress tracking
- **SOS Contacts**: Crisis hotlines and emergency contact management
- **User Profiles**: Complete user management with statistics

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   The app will automatically create SQLite database tables on startup.
   For production, configure PostgreSQL in the .env file.

4. **Run the Server**
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once running, visit:
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

- `DATABASE_URL`: Database connection string (default: SQLite)
- `SECRET_KEY`: JWT secret key (change in production!)
- `GEMINI_API_KEY`: Your Google Gemini API key

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Chatbot
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/sessions` - Get user's chat sessions
- `GET /api/chat/sessions/{session_id}` - Get specific session
- `DELETE /api/chat/sessions/{session_id}` - Delete session

### Journal
- `POST /api/journal/entries` - Create journal entry
- `GET /api/journal/entries` - Get entries (with filtering)
- `GET /api/journal/entries/{id}` - Get specific entry
- `PUT /api/journal/entries/{id}` - Update entry
- `DELETE /api/journal/entries/{id}` - Delete entry
- `GET /api/journal/stats` - Get journal statistics

### Mental Health Tests
- `GET /api/test/types` - Get available tests
- `GET /api/test/questions/{type}` - Get test questions
- `POST /api/test/submit` - Submit completed test
- `GET /api/test/results` - Get user's test results
- `GET /api/test/stats` - Get test statistics

### Mindfulness
- `GET /api/mindfulness/exercises` - Get exercises (with filtering)
- `GET /api/mindfulness/exercises/{id}` - Get specific exercise
- `POST /api/mindfulness/exercises/{id}/complete` - Mark exercise complete
- `GET /api/mindfulness/progress` - Get user progress
- `GET /api/mindfulness/categories` - Get exercise categories

### SOS Contacts
- `GET /api/sos/contacts` - Get emergency contacts
- `GET /api/sos/contacts/{id}` - Get specific contact
- `GET /api/sos/categories` - Get contact categories
- `GET /api/sos/emergency-info` - Get emergency guidance

### Profile
- `GET /api/profile/me` - Get profile
- `PUT /api/profile/me` - Update profile
- `DELETE /api/profile/me` - Deactivate account
- `GET /api/profile/stats` - Get user statistics

## Database Models

- **User**: User accounts and profiles
- **JournalEntry**: Personal diary entries with mood tracking
- **ChatSession/ChatMessage**: Chat conversations with AI
- **MentalHealthTestResult**: Assessment results and history
- **MindfulnessExercise**: Available exercises
- **UserExerciseProgress**: User's exercise completion tracking
- **SOSContact**: Emergency and crisis contact information

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- Optional guest access for chatbot (privacy-focused)

## AI Integration

The chatbot uses Google's Gemini AI with:
- Personalized responses based on user context
- Sentiment analysis of messages
- Crisis detection and appropriate responses
- Fallback responses when API is unavailable

## Production Deployment

1. Set strong SECRET_KEY
2. Configure PostgreSQL database
3. Set up proper CORS origins
4. Use environment variables for all secrets
5. Consider rate limiting and additional security measures