from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Authentication & User Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str = Field(..., description="Role must be 'farmer', 'customer', 'retailer', or 'admin'")
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    kyc_status: str
    kyc_docs: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None

class KYCSubmit(BaseModel):
    aadhaar_number: str = Field(..., min_length=12, max_length=12)
    pan_number: str = Field(..., min_length=10, max_length=10)
    land_records_link: Optional[str] = None

# --- Crop Listing Schemas ---
class CropCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str  # "grains", "fruits", "vegetables", "pulses", "spices"
    price_per_kg: float = Field(..., gt=0)
    min_bulk_order: float = Field(default=10.0, gt=0)
    quantity_available: float = Field(..., ge=0)
    image_url: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None

class CropUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price_per_kg: Optional[float] = None
    min_bulk_order: Optional[float] = None
    quantity_available: Optional[float] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    crop_id: int
    buyer_id: int
    buyer_name: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CropResponse(BaseModel):
    id: int
    farmer_id: int
    title: str
    description: Optional[str] = None
    category: str
    price_per_kg: float
    min_bulk_order: float
    quantity_available: float
    image_url: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    created_at: datetime
    farmer_username: Optional[str] = None
    reviews: List[ReviewResponse] = []

    class Config:
        from_attributes = True

# --- Review Creation ---
class ReviewCreate(BaseModel):
    crop_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

# --- Order Schemas ---
class OrderItem(BaseModel):
    crop_id: int
    crop_title: str
    quantity: float
    price_per_kg: float

class OrderCreate(BaseModel):
    seller_id: int
    items: List[OrderItem]
    total_price: float
    delivery_address: str
    razorpay_payment_id: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    buyer_id: int
    seller_id: int
    items: List[Dict[str, Any]]
    total_price: float
    payment_status: str
    shipping_status: str
    delivery_address: str
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Negotiation Schemas ---
class NegotiationCreate(BaseModel):
    crop_id: int
    proposed_price: float
    proposed_quantity: float
    message: Optional[str] = None

class NegotiationUpdate(BaseModel):
    status: str  # "accepted", "rejected", "countered"
    counter_price: Optional[float] = None
    counter_quantity: Optional[float] = None
    message: Optional[str] = None

class NegotiationResponse(BaseModel):
    id: int
    retailer_id: int
    retailer_name: str
    farmer_id: int
    crop_id: int
    crop_title: str
    proposed_price: float
    proposed_quantity: float
    status: str
    message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Complaint Schemas ---
class ComplaintCreate(BaseModel):
    type: str  # "order", "payment", "delivery", "general"
    title: str
    description: str

class ComplaintResolve(BaseModel):
    resolution: str

class ComplaintResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    user_role: str
    type: str
    title: str
    description: str
    status: str
    resolution: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Feature Schemas ---
class AICropRecommendRequest(BaseModel):
    location: str
    soil_type: str  # "Alluvial", "Black", "Red", "Laterite", "Sandy", "Clayey"
    nitrogen: float
    phosphorous: float
    potassium: float
    ph_level: float
    rainfall: float
    temperature: float

class RecommendedCropItem(BaseModel):
    crop_name: str
    confidence: float
    estimated_yield: str  # e.g., "3.5 - 4.2 Tons/Hectare"
    suitable_seasons: List[str]
    market_demand: str  # "High", "Medium", "Low"
    reasoning: str

class AICropRecommendResponse(BaseModel):
    recommended_crops: List[RecommendedCropItem]
    soil_analysis: str
    general_tips: List[str]

class AIDiseaseDiagnoseResponse(BaseModel):
    disease_name: str
    confidence: float
    treatment_suggestions: List[str]
    preventative_measures: List[str]
    severity: str  # "Low", "Medium", "High"

class AIPendingPriceForecast(BaseModel):
    crop_name: str
    forecast: List[Dict[str, Any]]  # List of month & expected price per kg
    demand_index: float  # 0.0 to 10.0
    profit_margin_pct: float
    recommendation: str

class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"  # "en", "te", "hi"

class AIChatResponse(BaseModel):
    response: str
    suggestions: List[str]
