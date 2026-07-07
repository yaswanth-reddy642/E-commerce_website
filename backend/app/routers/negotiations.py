from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.db_models import Negotiation, CropListing, User
from app.schemas.api_schemas import NegotiationCreate, NegotiationUpdate, NegotiationResponse
from app.utils.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/api/negotiations", tags=["Bulk Negotiations"])

@router.post("", response_model=NegotiationResponse)
def create_negotiation(
    neg_in: NegotiationCreate,
    current_user: User = Depends(RoleChecker(["retailer"])),
    db: Session = Depends(get_db)
):
    # Fetch crop
    crop = db.query(CropListing).filter(CropListing.id == neg_in.crop_id).first()
    if not crop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")
        
    # Check minimum order quantity requirement
    if neg_in.proposed_quantity < crop.min_bulk_order:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Proposed quantity ({neg_in.proposed_quantity} kg) is below the crop minimum bulk order size ({crop.min_bulk_order} kg)."
        )

    # Check if stock exists
    if neg_in.proposed_quantity > crop.quantity_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Requested quantity ({neg_in.proposed_quantity} kg) exceeds available stock ({crop.quantity_available} kg)."
        )

    new_neg = Negotiation(
        retailer_id=current_user.id,
        retailer_name=current_user.username,
        farmer_id=crop.farmer_id,
        crop_id=crop.id,
        crop_title=crop.title,
        proposed_price=neg_in.proposed_price,
        proposed_quantity=neg_in.proposed_quantity,
        status="pending",
        message=neg_in.message
    )

    db.add(new_neg)
    db.commit()
    db.refresh(new_neg)
    return new_neg

@router.get("/retailer", response_model=List[NegotiationResponse])
def get_retailer_negotiations(
    current_user: User = Depends(RoleChecker(["retailer"])),
    db: Session = Depends(get_db)
):
    negs = db.query(Negotiation).filter(Negotiation.retailer_id == current_user.id).order_by(Negotiation.created_at.desc()).all()
    return negs

@router.get("/farmer", response_model=List[NegotiationResponse])
def get_farmer_negotiations(
    current_user: User = Depends(RoleChecker(["farmer"])),
    db: Session = Depends(get_db)
):
    negs = db.query(Negotiation).filter(Negotiation.farmer_id == current_user.id).order_by(Negotiation.created_at.desc()).all()
    return negs

@router.put("/{neg_id}", response_model=NegotiationResponse)
def update_negotiation(
    neg_id: int,
    neg_in: NegotiationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    neg = db.query(Negotiation).filter(Negotiation.id == neg_id).first()
    if not neg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Negotiation record not found")
        
    # Check roles and edit state
    # If farmer updating: can set status to accepted, rejected, or countered
    if current_user.role == "farmer":
        if neg.farmer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the target farmer for this offer.")
            
        if neg_in.status not in ["accepted", "rejected", "countered"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Farmers can only set status to: accepted, rejected, or countered.")
            
        neg.status = neg_in.status
        if neg_in.status == "countered":
            if not neg_in.counter_price or not neg_in.counter_quantity:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Counter-offer requires price and quantity inputs.")
            neg.proposed_price = neg_in.counter_price
            neg.proposed_quantity = neg_in.counter_quantity
            
        if neg_in.message:
            neg.message = neg_in.message

    # If retailer updating: can accept or reject farmer's countered status
    elif current_user.role == "retailer":
        if neg.retailer_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You did not initiate this negotiation.")
            
        if neg.status != "countered":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can only update status if the farmer has countered your offer.")
            
        if neg_in.status not in ["accepted", "rejected"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Retailers can only accept or reject a countered offer.")
            
        neg.status = neg_in.status
        if neg_in.message:
            neg.message = neg_in.message
            
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized role.")

    db.commit()
    db.refresh(neg)
    return neg
