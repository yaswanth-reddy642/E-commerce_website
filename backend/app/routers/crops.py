from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.db_models import CropListing, User, Review
from app.schemas.api_schemas import CropCreate, CropUpdate, CropResponse, ReviewCreate, ReviewResponse
from app.utils.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/api/crops", tags=["Crop Inventory"])

@router.get("", response_model=List[CropResponse])
def get_crops(
    category: Optional[str] = None,
    state: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CropListing)
    if category:
        query = query.filter(CropListing.category == category)
    if state:
        query = query.filter(CropListing.state == state)
    if search:
        query = query.filter(CropListing.title.ilike(f"%{search}%"))
        
    crops = query.all()
    results = []
    
    for c in crops:
        farmer = db.query(User).filter(User.id == c.farmer_id).first()
        farmer_username = farmer.username if farmer else "Unknown"
        
        # Map reviews
        reviews_db = db.query(Review).filter(Review.crop_id == c.id).all()
        reviews = [
            ReviewResponse(
                id=r.id,
                crop_id=r.crop_id,
                buyer_id=r.buyer_id,
                buyer_name=r.buyer_name,
                rating=r.rating,
                comment=r.comment,
                created_at=r.created_at
            ) for r in reviews_db
        ]
        
        results.append({
            "id": c.id,
            "farmer_id": c.farmer_id,
            "title": c.title,
            "description": c.description,
            "category": c.category,
            "price_per_kg": c.price_per_kg,
            "min_bulk_order": c.min_bulk_order,
            "quantity_available": c.quantity_available,
            "image_url": c.image_url,
            "location": c.location,
            "state": c.state,
            "created_at": c.created_at,
            "farmer_username": farmer_username,
            "reviews": reviews
        })
    return results

@router.get("/{crop_id}", response_model=CropResponse)
def get_crop(crop_id: int, db: Session = Depends(get_db)):
    c = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")
        
    farmer = db.query(User).filter(User.id == c.farmer_id).first()
    farmer_username = farmer.username if farmer else "Unknown"
    
    reviews_db = db.query(Review).filter(Review.crop_id == c.id).all()
    reviews = [
        ReviewResponse(
            id=r.id,
            crop_id=r.crop_id,
            buyer_id=r.buyer_id,
            buyer_name=r.buyer_name,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at
        ) for r in reviews_db
    ]
    
    return {
        "id": c.id,
        "farmer_id": c.farmer_id,
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "price_per_kg": c.price_per_kg,
        "min_bulk_order": c.min_bulk_order,
        "quantity_available": c.quantity_available,
        "image_url": c.image_url,
        "location": c.location,
        "state": c.state,
        "created_at": c.created_at,
        "farmer_username": farmer_username,
        "reviews": reviews
    }

@router.post("", response_model=CropResponse)
def create_crop(
    crop_in: CropCreate,
    current_user: User = Depends(RoleChecker(["farmer"])),
    db: Session = Depends(get_db)
):
    # Check if farmer is KYC verified
    if current_user.kyc_status != "verified":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your KYC status is 'pending' or 'rejected'. You must have a verified profile to list crops for sale."
        )
        
    new_crop = CropListing(
        farmer_id=current_user.id,
        title=crop_in.title,
        description=crop_in.description,
        category=crop_in.category,
        price_per_kg=crop_in.price_per_kg,
        min_bulk_order=crop_in.min_bulk_order,
        quantity_available=crop_in.quantity_available,
        image_url=crop_in.image_url,
        location=crop_in.location or current_user.district,
        state=crop_in.state or current_user.state
    )
    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)
    
    return {
        "id": new_crop.id,
        "farmer_id": new_crop.farmer_id,
        "title": new_crop.title,
        "description": new_crop.description,
        "category": new_crop.category,
        "price_per_kg": new_crop.price_per_kg,
        "min_bulk_order": new_crop.min_bulk_order,
        "quantity_available": new_crop.quantity_available,
        "image_url": new_crop.image_url,
        "location": new_crop.location,
        "state": new_crop.state,
        "created_at": new_crop.created_at,
        "farmer_username": current_user.username,
        "reviews": []
    }

@router.put("/{crop_id}", response_model=CropResponse)
def update_crop(
    crop_id: int,
    crop_in: CropUpdate,
    current_user: User = Depends(RoleChecker(["farmer"])),
    db: Session = Depends(get_db)
):
    c = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")
    if c.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this listing")
        
    # Update fields
    for field, value in crop_in.dict(exclude_unset=True).items():
        setattr(c, field, value)
        
    db.commit()
    db.refresh(c)
    
    reviews_db = db.query(Review).filter(Review.crop_id == c.id).all()
    reviews = [
        ReviewResponse(
            id=r.id,
            crop_id=r.crop_id,
            buyer_id=r.buyer_id,
            buyer_name=r.buyer_name,
            rating=r.rating,
            comment=r.comment,
            created_at=r.created_at
        ) for r in reviews_db
    ]
    
    return {
        "id": c.id,
        "farmer_id": c.farmer_id,
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "price_per_kg": c.price_per_kg,
        "min_bulk_order": c.min_bulk_order,
        "quantity_available": c.quantity_available,
        "image_url": c.image_url,
        "location": c.location,
        "state": c.state,
        "created_at": c.created_at,
        "farmer_username": current_user.username,
        "reviews": reviews
    }

@router.delete("/{crop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_crop(
    crop_id: int,
    current_user: User = Depends(RoleChecker(["farmer"])),
    db: Session = Depends(get_db)
):
    c = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")
    if c.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not own this listing")
        
    db.delete(c)
    db.commit()
    return None

# --- Review Submission ---
@router.post("/{crop_id}/reviews", response_model=ReviewResponse)
def create_review(
    crop_id: int,
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(CropListing).filter(CropListing.id == crop_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")
        
    new_review = Review(
        crop_id=crop_id,
        buyer_id=current_user.id,
        buyer_name=current_user.username,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review
