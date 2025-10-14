# Mental Health Chatbot - Backend

A comprehensive Python Flask backend for a Mental Health Chatbot application with personalized AI support, journal features, mental health assessments, and more.

## Features

- **User Authentication**: Signup, login, guest mode, and JWT-based authentication
- **AI Chatbot**: Personalized mental health support using Google's Gemini API
- **Journal/Diary**: Private note-taking with mood tracking
- **Mental Health Assessments**: GAD-7 (anxiety), PHQ-9 (depression), PSS-10 (stress)
- **Mindfulness Exercises**: 10+ guided exercises for breathing, meditation, and relaxation
- **SOS Hotline**: Emergency contacts and crisis resources
- **User Profile Management**: Customizable profiles with preferences
- **Analytics**: Track mood patterns, chat sentiment, and assessment trends

## Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: SQLAlchemy with SQLite (easily upgradable to PostgreSQL/MySQL)
- **Authentication**: Flask-JWT-Extended
- **AI Model**: Google Gemini API
- **CORS**: Flask-CORS for frontend integration

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup Steps

1. **Clone or navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your configuration:
     - Generate secure SECRET_KEY and JWT_SECRET_KEY
     - Add your Google Gemini API key

6. **Initialize the database**:
   ```bash
   python app.py
   ```
   This will create all necessary database tables automatically.

## Running the Application

1. **Start the Flask server**:
   ```bash
   python app.py
   ```

2. The server will run on `http://localhost:5000`

3. You can test the API by visiting `http://localhost:5000` in your browser

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/guest` - Create a guest session
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change user password

### Chatbot (`/api/chat`)
- `POST /api/chat/message` - Send a message to the chatbot
- `GET /api/chat/history` - Get chat history (paginated)
- `DELETE /api/chat/clear-history` - Clear all chat history
- `GET /api/chat/analytics` - Get sentiment analytics

### Journal (`/api/journal`)
- `GET /api/journal/entries` - Get all journal entries (paginated)
- `POST /api/journal/entries` - Create a new journal entry
- `GET /api/journal/entries/<id>` - Get a specific entry
- `PUT /api/journal/entries/<id>` - Update an entry
- `DELETE /api/journal/entries/<id>` - Delete an entry
- `GET /api/journal/moods` - Get mood analytics

### Assessment (`/api/assessment`)
- `GET /api/assessment/types` - Get all assessment types
- `POST /api/assessment/submit` - Submit an assessment
- `GET /api/assessment/results` - Get all assessment results
- `GET /api/assessment/results/<id>` - Get a specific result
- `GET /api/assessment/analytics` - Get assessment trends

### Mindfulness (`/api/mindfulness`)
- `GET /api/mindfulness/exercises` - Get all exercises
- `GET /api/mindfulness/exercises/<id>` - Get a specific exercise
- `GET /api/mindfulness/exercises/category/<category>` - Filter by category
- `GET /api/mindfulness/exercises/difficulty/<difficulty>` - Filter by difficulty
- `GET /api/mindfulness/categories` - Get all categories

### Profile (`/api/profile`)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/stats` - Get user statistics
- `DELETE /api/profile/delete` - Delete account

### SOS (`/api/sos`)
- `GET /api/sos/contacts` - Get all SOS contacts
- `GET /api/sos/contacts/<id>` - Get a specific contact
- `POST /api/sos/contacts` - Create a new contact
- `PUT /api/sos/contacts/<id>` - Update a contact
- `DELETE /api/sos/contacts/<id>` - Delete a contact
- `GET /api/sos/categories` - Get contact categories

## Database Models

### User
- Stores user credentials and basic information
- Relationships to chat history, journal entries, assessments, and profile

### ChatHistory
- Stores all chat conversations with sentiment analysis
- Linked to users for personalization

### JournalEntry
- Private diary entries with mood tracking
- Supports pagination and filtering

### AssessmentResult
- Mental health assessment results
- Includes scoring, severity levels, and recommendations

### UserProfile
- Extended user information
- Preferences, bio, profile picture

### SOSContact
- Emergency and crisis contact information
- Categorized for easy access

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## Customizing SOS Contacts

The backend includes template SOS contacts that can be customized:

1. The contacts are initialized automatically on first run
2. Edit contact information through the API endpoints
3. Update phone numbers and email addresses in the database
4. Categories: crisis, mental_health, suicide_prevention, emergency, personal, etc.

## Security Notes

- **Never commit your `.env` file** - it contains sensitive information
- Change the default SECRET_KEY and JWT_SECRET_KEY in production
- Use HTTPS in production
- Consider adding rate limiting for API endpoints
- Implement proper user role management for admin features

## Database Migration

To upgrade from SQLite to PostgreSQL or MySQL:

1. Update `DATABASE_URL` in `.env`:
   ```
   # PostgreSQL
   DATABASE_URL=postgresql://username:password@localhost/mental_health
   
   # MySQL
   DATABASE_URL=mysql://username:password@localhost/mental_health
   ```

2. Install the appropriate database driver:
   ```bash
   # PostgreSQL
   pip install psycopg2-binary
   
   # MySQL
   pip install mysqlclient
   ```

3. Run the app to create tables:
   ```bash
   python app.py
   ```

## Troubleshooting

### Import Errors
If you get import errors, make sure the virtual environment is activated and all dependencies are installed.

### Database Errors
Delete the `mental_health.db` file and restart the application to recreate the database.

### Gemini API Errors
Ensure your API key is valid and you have billing enabled on your Google Cloud account.

## License

This project is provided as-is for educational and personal use.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
