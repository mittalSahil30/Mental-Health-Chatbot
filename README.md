# Mental Health Chatbot - MindCare

A comprehensive mental health support application with AI-powered chatbot, journaling, health assessments, mindfulness exercises, and emergency contacts.

## Features

### 🤖 AI Chatbot
- Powered by Google Gemini API
- Personalized responses based on user data
- Guest mode available for privacy
- Emotional support and mental health guidance

### 📝 Personal Journal
- Private diary for thoughts and feelings
- Mood tracking and tagging
- Secure data storage
- Easy-to-use interface

### 🧠 Mental Health Tests
- Comprehensive assessments
- Personalized scoring and interpretation
- Progress tracking
- Evidence-based questions

### 🧘 Mindfulness Exercises
- Guided meditation sessions
- Breathing exercises
- Mindful walking practices
- Timer-based sessions

### 🆘 Emergency Contacts
- Crisis support resources
- Customizable contact list
- Quick access to help
- Emergency hotline integration

### 👤 Profile Management
- Personal information management
- Activity statistics
- Privacy controls
- Account customization

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL/SQLite** - Database
- **JWT** - Authentication
- **Google Gemini API** - AI chatbot
- **Pydantic** - Data validation

### Frontend
- **React** - User interface library
- **Styled Components** - CSS-in-JS styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Framer Motion** - Animations

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works by default)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the backend:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=sqlite:///./mental_health.db
# For PostgreSQL: postgresql://user:password@localhost/mental_health

# Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# JWT Secret (change in production)
SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## Usage

### Guest Mode
- Access the chatbot without creating an account
- Limited features for privacy
- No data storage

### Registered User
- Full access to all features
- Personalized chatbot responses
- Data persistence and tracking
- Profile management

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Journal
- `POST /journal` - Create journal entry
- `GET /journal` - Get user journals
- `PUT /journal/{id}` - Update journal entry
- `DELETE /journal/{id}` - Delete journal entry

### Mental Health Tests
- `POST /test` - Create test
- `GET /test` - Get user tests
- `POST /test/{id}/response` - Submit test response

### Mindfulness Exercises
- `GET /exercises` - Get available exercises

### SOS Contacts
- `POST /sos` - Add emergency contact
- `GET /sos` - Get user contacts
- `PUT /sos/{id}` - Update contact
- `DELETE /sos/{id}` - Delete contact

### Chatbot
- `POST /chat` - Chat with AI (authenticated)
- `POST /chat/guest` - Chat with AI (guest)

### Profile
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## Privacy

- Guest mode for anonymous usage
- Encrypted data storage
- No tracking without consent
- GDPR compliant design
- Secure API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@mindcare.app
- Emergency: 988 (National Suicide Prevention Lifeline)

## Disclaimer

This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about mental health conditions.