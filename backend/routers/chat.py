from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional

from ..deps import get_db, get_current_user
from ..models import User, JournalEntry, TestResult
from ..services.chat import get_chat_stream, build_system_instruction

router = APIRouter(prefix="/chat", tags=["chat"])


@router.get("/stream")
def chat_stream(q: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    latest_journal: Optional[JournalEntry] = (
        db.query(JournalEntry)
        .filter(JournalEntry.user_id == current_user.id)
        .order_by(JournalEntry.updated_at.desc())
        .first()
    )
    latest_test: Optional[TestResult] = (
        db.query(TestResult)
        .filter(TestResult.user_id == current_user.id)
        .order_by(TestResult.id.desc())
        .first()
    )

    journal_summary = None
    if latest_journal:
        journal_summary = (latest_journal.title + ": " + latest_journal.content[:200]).strip()

    test_summary = None
    if latest_test:
        test_summary = latest_test.interpretation

    system_instruction = build_system_instruction(
        user_name=current_user.name,
        is_guest=current_user.email is None,
        test_summary=test_summary,
        journal_summary=journal_summary,
    )

    async def event_generator():
        async for token in get_chat_stream(q, system_instruction):
            yield token

    return StreamingResponse(event_generator(), media_type="text/plain")
