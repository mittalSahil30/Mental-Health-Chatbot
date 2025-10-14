# Mental Health Chatbot

A comprehensive mental health support application with AI-powered chatbot, journaling, mental health assessments, mindfulness exercises, and emergency contacts.

## Features

### 🤖 AI Chatbot
- Personalized mental health support using Gemini AI
- Context-aware responses based on user history
- Available 24/7 for immediate support
- Guest access for privacy

### 📖 Personal Journal
- Private diary for thoughts and feelings
- Mood tracking with emoji indicators
- Searchable entries with timestamps
- Secure and encrypted storage

### 🧠 Mental Health Assessment
- Comprehensive PHQ-9 and GAD-7 inspired test
- Personalized score interpretation
- Progress tracking over time
- Professional recommendations

### 🧘 Mindfulness Exercises
- Guided meditation sessions
- Breathing exercises
- Body scan techniques
- Gratitude practices

### 🆘 SOS Contacts
- Emergency contact management
- Crisis hotline information
- Quick access to support resources
- Categorized contact types

### 👤 Profile Management
- Secure user accounts
- Guest mode for privacy
- Data encryption
- Personalized experience

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL/SQLite** - Database
- **JWT** - Authentication
- **Google Gemini AI** - Chatbot intelligence
- **Pydantic** - Data validation

### Frontend
- **React 18** - User interface
- **React Router** - Navigation
- **Axios** - API communication
- **Lucide React** - Icons
- **Framer Motion** - Animations
- **Recharts** - Data visualization

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works by default)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-chatbot
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env and add your GEMINI_API_KEY
   ```

5. **Start the backend**
   ```bash
   chmod +x start_backend.sh
   ./start_backend.sh
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend**
   ```bash
   cd ..
   chmod +x start_frontend.sh
   ./start_frontend.sh
   ```

### Quick Start (Both Services)

```bash
# Terminal 1 - Backend
chmod +x start_backend.sh
./start_backend.sh

# Terminal 2 - Frontend
chmod +x start_frontend.sh
./start_frontend.sh
```

## Configuration

### Environment Variables

Create `backend/.env` with the following variables:

```env
# Database Configuration
DATABASE_URL=sqlite:///./mental_health_chatbot.db
# For PostgreSQL: DATABASE_URL=postgresql://username:password@localhost/mental_health_chatbot

# JWT Secret Key (change this in production)
SECRET_KEY=your-secret-key-here-change-in-production

# Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your-gemini-api-key-here
```

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

## Usage

### For Users

1. **Access the application** at `http://localhost:3000`
2. **Choose your access method:**
   - **Guest Mode**: Use chatbot immediately without registration
   - **Full Account**: Register for complete features

3. **Available features:**
   - Chat with AI mental health companion
   - Write in personal journal (registered users)
   - Take mental health assessments (registered users)
   - Practice mindfulness exercises (registered users)
   - Manage emergency contacts (registered users)

### For Developers

#### API Endpoints

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/guest` - Create guest user

**Journal:**
- `POST /journal` - Create journal entry
- `GET /journal` - Get user's journal entries
- `PUT /journal/{id}` - Update journal entry
- `DELETE /journal/{id}` - Delete journal entry

**Mental Health Test:**
- `POST /mental-health-test` - Submit test responses
- `GET /mental-health-test` - Get test history

**Chatbot:**
- `POST /chat` - Send message to chatbot
- `GET /chat/history` - Get chat history

**SOS Contacts:**
- `POST /sos-contacts` - Add emergency contact
- `GET /sos-contacts` - Get user's contacts
- `PUT /sos-contacts/{id}` - Update contact
- `DELETE /sos-contacts/{id}` - Delete contact

#### Database Schema

The application uses the following main entities:
- **Users** - User accounts and authentication
- **Journals** - Personal diary entries
- **MentalHealthTests** - Assessment results
- **SOSContacts** - Emergency contacts
- **ChatMessages** - Chatbot conversation history

## Security & Privacy

- **Data Encryption**: All sensitive data is encrypted
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated and sanitized
- **CORS Protection**: Configured for secure cross-origin requests
- **Guest Privacy**: Guest users can use chatbot without data storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Disclaimer

This application is for informational and supportive purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with questions about medical conditions.

## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Chatbot Interface
![Chatbot](screenshots/chatbot.png)

### Journal
![Journal](screenshots/journal.png)

### Mental Health Test
![Mental Health Test](screenshots/mental-health-test.png)

### Mindfulness Exercises
![Mindfulness](screenshots/mindfulness.png)

### SOS Contacts
![SOS Contacts](screenshots/sos-contacts.png)

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Group therapy features
- [ ] Integration with wearable devices
- [ ] Multi-language support
- [ ] Voice chat capabilities
- [ ] Professional therapist matching