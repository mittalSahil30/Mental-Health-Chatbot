# 🚀 Quick Setup Instructions

Follow these steps to get your Mental Health Chatbot up and running!

## ⚡ Fast Setup (5 minutes)

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key
5. Keep it safe - you'll need it in the next steps!

### Step 2: Backend Setup

```bash
# 1. Open a terminal and navigate to the backend folder
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create your .env file
cp .env.example .env

# 6. Edit the .env file and add your Gemini API key
# Open backend/.env in a text editor and replace:
# GEMINI_API_KEY=your-gemini-api-key-here
# with your actual API key from Step 1

# 7. Generate secret keys (run in Python)
python -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32)); print('JWT_SECRET_KEY=' + secrets.token_hex(32))"

# 8. Add the generated keys to your .env file
# Copy the output from step 7 and paste into backend/.env

# 9. Start the backend server
python run.py
```

✅ **Backend is running on http://localhost:5000**

Keep this terminal open!

### Step 3: Frontend Setup

```bash
# 1. Open a NEW terminal (keep backend running)
# Navigate to the project root folder

# 2. Install frontend dependencies
npm install

# 3. Create your .env file
cp .env.example .env

# 4. Edit the .env file and add your Gemini API key
# Open .env in a text editor and replace:
# API_KEY=your-gemini-api-key-here
# with your actual API key from Step 1

# 5. Start the frontend
npm run dev
```

✅ **Frontend is running on http://localhost:5173** (or similar)

### Step 4: Open in Browser

1. Click the localhost link shown in your terminal (usually http://localhost:5173)
2. You'll see the login page
3. Click **"Sign Up"** to create an account OR **"Continue as Guest"** for quick access
4. Start chatting with Serene! 🎉

## 📝 What You Need to Fill In

### Backend `.env` file (`backend/.env`)
```env
SECRET_KEY=<paste-generated-key-here>
JWT_SECRET_KEY=<paste-generated-key-here>
GEMINI_API_KEY=<paste-your-gemini-api-key-here>
DATABASE_URL=sqlite:///mental_health.db
```

### Frontend `.env` file (`.env` in root)
```env
API_KEY=<paste-your-gemini-api-key-here>
VITE_API_URL=http://localhost:5000/api
```

## 🆘 Customize SOS Contacts

The app comes with template SOS contacts. To add your local emergency numbers:

### Option 1: Via the App (Coming Soon)
Once logged in as admin, you can edit contacts through the UI.

### Option 2: Edit the Code
1. Open `backend/routes/sos.py`
2. Find the `DEFAULT_CONTACTS` list
3. Update phone numbers and emails with your local contacts:

```python
{
    'name': 'Local Mental Health Crisis Center',
    'phone_number': 'YOUR_LOCAL_NUMBER_HERE',  # <-- Add your number
    'email': 'YOUR_LOCAL_EMAIL_HERE@example.com',  # <-- Add your email
    'description': 'Your local contact description',
    'category': 'local'
}
```

4. Restart the backend server

## ✅ Verify Everything Works

### Test the Backend
Open http://localhost:5000 in your browser - you should see:
```json
{
  "message": "Mental Health Chatbot API",
  "version": "1.0.0",
  ...
}
```

### Test the Frontend
1. Open the frontend URL
2. Sign up or login
3. Try sending a message to the chatbot
4. Check the Journal page
5. Try a mental health assessment
6. Browse mindfulness exercises

## 🐛 Common Issues

### Issue: "GEMINI_API_KEY not configured"
**Solution**: Make sure you added your API key to BOTH `.env` files (backend and frontend)

### Issue: "Cannot connect to backend"
**Solution**: 
- Check if backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env` is set to `http://localhost:5000/api`

### Issue: Backend won't start
**Solution**:
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check if Python 3.8+ is installed: `python --version`

### Issue: Frontend shows blank page
**Solution**:
- Check browser console for errors (F12)
- Make sure you ran `npm install`
- Try clearing browser cache

### Issue: "Module not found" errors
**Solution**:
```bash
# Backend:
cd backend
pip install -r requirements.txt

# Frontend:
npm install
```

## 🎯 Next Steps

Once everything is working:

1. **Explore all features**:
   - Chat with the AI
   - Write journal entries
   - Take mental health assessments
   - Try mindfulness exercises
   - Check SOS contacts

2. **Customize**:
   - Update SOS contacts with local numbers
   - Add your personal emergency contacts
   - Adjust chatbot prompts in `backend/routes/chat.py`

3. **Deploy** (optional):
   - See [PROJECT_SETUP.md](PROJECT_SETUP.md) for deployment guides
   - Deploy backend to Heroku, Railway, or AWS
   - Deploy frontend to Vercel or Netlify

## 📚 Need More Help?

- **Detailed Guide**: See [PROJECT_SETUP.md](PROJECT_SETUP.md)
- **Backend API**: See [backend/README.md](backend/README.md)
- **Main README**: See [README.md](README.md)

## 🎉 You're All Set!

Enjoy using your Mental Health Chatbot! Remember:
- This is a support tool, not a replacement for professional help
- All your data stays on your device/server
- Guest mode provides extra privacy for chatbot conversations

**Need immediate help?** Always contact emergency services (911) or a crisis hotline in case of emergency.

---

**Questions or issues?** Check the troubleshooting sections in the documentation files!
