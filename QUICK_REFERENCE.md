# 🚀 Quick Reference Card

## ⚡ 3-Step Setup

### 1️⃣ Get API Key
Visit: https://makersuite.google.com/app/apikey → Create API Key

### 2️⃣ Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add API key to .env
python run.py
```
✅ Running on http://localhost:5000

### 3️⃣ Start Frontend
```bash
npm install
cp .env.example .env
# Add API key to .env
npm run dev
```
✅ Running on http://localhost:5173

---

## 📋 Environment Variables

### Backend `.env`
```env
SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
JWT_SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
GEMINI_API_KEY=<your-api-key>
DATABASE_URL=sqlite:///mental_health.db
```

### Frontend `.env`
```env
API_KEY=<your-api-key>
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 Features Available

| Feature | Endpoint Pattern | Guest Access |
|---------|-----------------|--------------|
| **Login/Signup** | `/api/auth/*` | ✅ |
| **AI Chatbot** | `/api/chat/*` | ✅ |
| **Journal** | `/api/journal/*` | ❌ (Login required) |
| **Assessments** | `/api/assessment/*` | ❌ (Login required) |
| **Mindfulness** | `/api/mindfulness/*` | ✅ |
| **Profile** | `/api/profile/*` | ❌ (Login required) |
| **SOS Contacts** | `/api/sos/*` | ✅ |

---

## 🔧 Common Commands

### Backend
```bash
# Start server
python run.py

# Install dependencies
pip install -r requirements.txt

# Generate secret key
python -c "import secrets; print(secrets.token_hex(32))"
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Install dependencies
npm install
```

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Main overview |
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Quick setup guide |
| [PROJECT_SETUP.md](PROJECT_SETUP.md) | Detailed guide |
| [backend/README.md](backend/README.md) | API documentation |
| [FEATURES_AND_STRUCTURE.md](FEATURES_AND_STRUCTURE.md) | Feature list |
| [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md) | What's included |

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Start backend: `python run.py` |
| "API key not found" | Add to both `.env` files |
| "Module not found" | Run `pip install -r requirements.txt` |
| "CORS error" | Check `VITE_API_URL` in `.env` |
| "Database error" | Delete `.db` file, restart backend |

---

## 📁 Project Structure (Simplified)

```
├── backend/           # Python Flask API
│   ├── routes/       # 7 route modules
│   ├── app.py        # Main app
│   ├── models.py     # Database
│   └── run.py        # Start script
│
├── pages/            # 7 React pages
├── services/         # API integration
├── contexts/         # State management
└── components/       # UI components
```

---

## 🎯 Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can create an account
- [ ] Can login
- [ ] Guest mode works
- [ ] Chat sends messages
- [ ] Journal saves entries
- [ ] Assessments submit
- [ ] SOS contacts display

---

## 💡 Key Files to Edit

### Add API Key
- `backend/.env` → `GEMINI_API_KEY=`
- `.env` → `API_KEY=`

### Customize SOS Contacts
- `backend/routes/sos.py` → `DEFAULT_CONTACTS`

### Change Chatbot Personality
- `backend/routes/chat.py` → `system_prompt`

---

## 🚀 Ready to Deploy?

### Backend Options
- Heroku (free tier)
- Railway
- AWS / Google Cloud
- DigitalOcean

### Frontend Options
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3

---

## 📞 Need Help?

1. Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)
2. See [PROJECT_SETUP.md](PROJECT_SETUP.md) troubleshooting
3. Review [backend/README.md](backend/README.md) for API docs

---

**Made with ❤️ | Ready in 10 minutes**
