from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.database import get_db
from app.models.db_models import User
from app.schemas.api_schemas import UserCreate, UserResponse, UserUpdate, Token, KYCSubmit
from app.utils.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == user_in.username) | (User.email == user_in.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is already registered."
        )
        
    # Check valid role
    if user_in.role not in ["farmer", "customer", "retailer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be one of: farmer, customer, retailer, admin"
        )
        
    hashed_pwd = get_password_hash(user_in.password)
    
    # Automatically verify admin or customer, farmers and retailers need kyc/approval
    kyc_status = "verified" if user_in.role in ["customer", "admin"] else "pending"
    
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=user_in.role,
        phone=user_in.phone,
        state=user_in.state,
        district=user_in.district,
        kyc_status=kyc_status
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_me(user_in: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_in.phone is not None:
        current_user.phone = user_in.phone
    if user_in.state is not None:
        current_user.state = user_in.state
    if user_in.district is not None:
        current_user.district = user_in.district
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/kyc", response_model=UserResponse)
def submit_kyc(kyc_in: KYCSubmit, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["farmer", "retailer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only farmers and retailers are required to complete KYC verification."
        )
        
    current_user.kyc_docs = {
        "aadhaar": kyc_in.aadhaar_number,
        "pan": kyc_in.pan_number,
        "land_records": kyc_in.land_records_link
    }
    current_user.kyc_status = "pending" # Send back to pending state for admin approval
    db.commit()
    db.refresh(current_user)
    return current_user
