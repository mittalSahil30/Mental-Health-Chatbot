# SereneMind Backend (FastAPI)

## Features
- JWT auth (signup, login, guest token), profile
- Journal CRUD
- Wellness test results (store, latest)
- Mindfulness exercises and SOS templates
- Chat endpoint integrating Google Gemini (or mock when no key)
- SQLite + SQLAlchemy ORM

## Setup

1. Create virtualenv and install deps:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Set environment (copy .env.example to .env and fill values):
```bash
cp backend/.env.example backend/.env
```

3. Run the server:
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The frontend can use `VITE_API_BASE_URL=http://localhost:8000`.
