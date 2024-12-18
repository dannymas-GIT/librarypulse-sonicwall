from fastapi import APIRouter, HTTPException, status
from typing import List
from app.services.openai_service import OpenAIService

router = APIRouter()
openai_service = OpenAIService()

@router.post("/analyze-logs", response_model=List[str])
async def analyze_logs(logs: List[dict]):
    try:
        analysis_results = openai_service.analyze_logs(logs)
        return analysis_results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 