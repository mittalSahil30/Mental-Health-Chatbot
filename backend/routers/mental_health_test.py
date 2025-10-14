from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import User, MentalHealthTestResult
from schemas import TestQuestion, MentalHealthTestRequest, MentalHealthTestResultResponse
from auth_utils import get_current_user
from mental_health_tests import MentalHealthTests

router = APIRouter()

@router.get("/types")
async def get_available_tests():
    """Get list of available mental health tests."""
    return {
        "tests": [
            {
                "type": "depression",
                "name": "Depression Screening",
                "description": "Assess symptoms related to depression (PHQ-9 style)",
                "duration": "5-10 minutes"
            },
            {
                "type": "anxiety", 
                "name": "Anxiety Screening",
                "description": "Assess symptoms related to anxiety (GAD-7 style)",
                "duration": "3-5 minutes"
            },
            {
                "type": "stress",
                "name": "Stress Assessment", 
                "description": "Evaluate your current stress levels and coping",
                "duration": "5-8 minutes"
            }
        ]
    }

@router.get("/questions/{test_type}")
async def get_test_questions(test_type: str):
    """Get questions for a specific mental health test."""
    if test_type == "depression":
        return MentalHealthTests.get_depression_test()
    elif test_type == "anxiety":
        return MentalHealthTests.get_anxiety_test()
    elif test_type == "stress":
        return MentalHealthTests.get_stress_test()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid test type. Available types: depression, anxiety, stress"
        )

@router.post("/submit", response_model=MentalHealthTestResultResponse)
async def submit_test(
    test_data: MentalHealthTestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a completed mental health test and get results."""
    
    # Validate test type
    valid_types = ["depression", "anxiety", "stress"]
    if test_data.test_type not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid test type. Available types: {', '.join(valid_types)}"
        )
    
    # Convert responses to the format expected by the scoring function
    response_data = [{"answer": response.answer} for response in test_data.responses]
    
    # Calculate score
    try:
        score, max_score, severity_level, recommendations = MentalHealthTests.calculate_score(
            test_data.test_type, 
            response_data
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error calculating test score: {str(e)}"
        )
    
    # Store result in database
    db_result = MentalHealthTestResult(
        user_id=current_user.id,
        test_type=test_data.test_type,
        score=score,
        max_score=max_score,
        severity_level=severity_level,
        responses=[{"question_id": r.question_id, "answer": r.answer} for r in test_data.responses],
        recommendations=recommendations
    )
    
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    
    return MentalHealthTestResultResponse.from_orm(db_result)

@router.get("/results", response_model=List[MentalHealthTestResultResponse])
async def get_test_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all test results for the current user."""
    results = db.query(MentalHealthTestResult).filter(
        MentalHealthTestResult.user_id == current_user.id
    ).order_by(MentalHealthTestResult.created_at.desc()).all()
    
    return [MentalHealthTestResultResponse.from_orm(result) for result in results]

@router.get("/results/{result_id}", response_model=MentalHealthTestResultResponse)
async def get_test_result(
    result_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific test result."""
    result = db.query(MentalHealthTestResult).filter(
        MentalHealthTestResult.id == result_id,
        MentalHealthTestResult.user_id == current_user.id
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test result not found"
        )
    
    return MentalHealthTestResultResponse.from_orm(result)

@router.get("/stats")
async def get_test_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get test statistics and trends for the current user."""
    results = db.query(MentalHealthTestResult).filter(
        MentalHealthTestResult.user_id == current_user.id
    ).order_by(MentalHealthTestResult.created_at.desc()).all()
    
    if not results:
        return {
            "total_tests": 0,
            "tests_by_type": {},
            "recent_trends": {},
            "recommendations": "Take your first mental health assessment to track your wellbeing over time."
        }
    
    # Group by test type
    tests_by_type = {}
    for result in results:
        if result.test_type not in tests_by_type:
            tests_by_type[result.test_type] = []
        tests_by_type[result.test_type].append(result)
    
    # Calculate trends (last 3 results for each test type)
    recent_trends = {}
    for test_type, type_results in tests_by_type.items():
        if len(type_results) >= 2:
            recent = type_results[:3]  # Last 3 results
            scores = [r.score for r in reversed(recent)]  # Chronological order
            
            if len(scores) >= 2:
                if scores[-1] > scores[0]:
                    trend = "increasing"
                elif scores[-1] < scores[0]:
                    trend = "decreasing"
                else:
                    trend = "stable"
                
                recent_trends[test_type] = {
                    "trend": trend,
                    "latest_score": scores[-1],
                    "latest_severity": recent[0].severity_level,
                    "change": scores[-1] - scores[0]
                }
    
    # Generate summary recommendations
    latest_results = {}
    for test_type, type_results in tests_by_type.items():
        latest_results[test_type] = type_results[0]  # Most recent
    
    summary_recommendations = []
    for test_type, result in latest_results.items():
        if result.severity_level in ["moderate", "moderately_severe", "severe", "high"]:
            summary_recommendations.append(f"Consider following up on your {test_type} assessment results with a mental health professional.")
    
    if not summary_recommendations:
        summary_recommendations.append("Your recent assessments look good! Continue with regular self-care and monitoring.")
    
    return {
        "total_tests": len(results),
        "tests_by_type": {k: len(v) for k, v in tests_by_type.items()},
        "recent_trends": recent_trends,
        "latest_results": {k: {"severity": v.severity_level, "score": v.score} for k, v in latest_results.items()},
        "recommendations": " ".join(summary_recommendations)
    }