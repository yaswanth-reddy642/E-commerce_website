from fastapi import APIRouter, Depends, UploadFile, File, Query
from app.services.ai_service import AIService
from app.schemas.api_schemas import (
    AICropRecommendRequest, AICropRecommendResponse,
    AIDiseaseDiagnoseResponse, AIPendingPriceForecast,
    AIChatRequest, AIChatResponse
)

router = APIRouter(prefix="/api/ai", tags=["AI Advisory Engine"])

@router.post("/recommend", response_model=AICropRecommendResponse)
def get_crop_recommendation(req: AICropRecommendRequest):
    return AIService.recommend_crops(
        location=req.location,
        soil_type=req.soil_type,
        nitrogen=req.nitrogen,
        phosphorous=req.phosphorous,
        potassium=req.potassium,
        ph_level=req.ph_level,
        rainfall=req.rainfall,
        temperature=req.temperature
    )

@router.post("/diagnose", response_model=AIDiseaseDiagnoseResponse)
def diagnose_crop_health(file: UploadFile = File(...)):
    # Simulates disease analysis on the uploaded leaf image by parsing its name
    return AIService.diagnose_disease(file.filename)

@router.get("/forecast", response_model=AIPendingPriceForecast)
def get_crop_price_forecast(crop_name: str = Query(..., description="Crop name to predict pricing for")):
    return AIService.forecast_price(crop_name)

@router.post("/chat", response_model=AIChatResponse)
def consult_farming_chatbot(req: AIChatRequest):
    return AIService.chat_adviser(message=req.message, language=req.language)
