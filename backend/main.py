from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .db import Base, engine
from .routers import auth, journal, test, misc, chat

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SereneMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(journal.router)
app.include_router(test.router)
app.include_router(misc.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {"status": "ok"}
