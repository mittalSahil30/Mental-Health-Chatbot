from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..deps import get_db, get_current_user
from ..models import TestResult, User
from ..schemas.test import TestResultCreate, TestResultOut

router = APIRouter(prefix="/test", tags=["test"])


@router.get("/results", response_model=List[TestResultOut])
def list_results(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(TestResult)
        .filter(TestResult.user_id == current_user.id)
        .order_by(TestResult.id.desc())
        .all()
    )
    return results


@router.post("/results", response_model=TestResultOut)
def create_result(payload: TestResultCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = TestResult(
        user_id=current_user.id,
        score=payload.score,
        interpretation=payload.interpretation,
        date=payload.date,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result
