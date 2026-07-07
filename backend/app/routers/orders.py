from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.database import get_db
from app.models.db_models import Order, CropListing, User
from app.schemas.api_schemas import OrderCreate, OrderResponse
from app.utils.auth import get_current_user, RoleChecker

router = APIRouter(prefix="/api/orders", tags=["Order Management"])

@router.post("", response_model=OrderResponse)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify stock availability and decrement quantity
    for item in order_in.items:
        crop = db.query(CropListing).filter(CropListing.id == item.crop_id).first()
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {item.crop_id} not found."
            )
        if crop.quantity_available < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient inventory for {crop.title}. Available: {crop.quantity_available} kg, requested: {item.quantity} kg."
            )
        # Decrement crop inventory
        crop.quantity_available -= item.quantity

    # Generate a mock Razorpay Order ID
    mock_rzp_order_id = f"order_{uuid.uuid4().hex[:12]}"
    
    # Store order items as list of dicts
    items_list = [
        {
            "crop_id": item.crop_id,
            "crop_title": item.crop_title,
            "quantity": item.quantity,
            "price_per_kg": item.price_per_kg
        } for item in order_in.items
    ]

    new_order = Order(
        buyer_id=current_user.id,
        seller_id=order_in.seller_id,
        items=items_list,
        total_price=order_in.total_price,
        payment_status="paid" if order_in.razorpay_payment_id else "pending",
        shipping_status="pending",
        delivery_address=order_in.delivery_address,
        razorpay_order_id=mock_rzp_order_id,
        razorpay_payment_id=order_in.razorpay_payment_id
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/buyer", response_model=List[OrderResponse])
def get_buyer_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(Order.buyer_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/seller", response_model=List[OrderResponse])
def get_seller_orders(
    current_user: User = Depends(RoleChecker(["farmer"])),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(Order.seller_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_details(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
    # Check permissions (either buyer, seller, or admin can view)
    if current_user.role != "admin" and order.buyer_id != current_user.id and order.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this order's details."
        )
    return order

@router.put("/{order_id}/shipping", response_model=OrderResponse)
def update_shipping_status(
    order_id: int,
    status_str: str,  # "pending", "shipped", "delivered", "cancelled"
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
    # Check if user is the seller of the order, or an admin
    if current_user.role != "admin" and order.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the seller (farmer) or an admin can update the shipping status."
        )
        
    if status_str not in ["pending", "shipped", "delivered", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid shipping status. Must be: pending, shipped, delivered, cancelled"
        )
        
    order.shipping_status = status_str
    db.commit()
    db.refresh(order)
    return order

@router.put("/{order_id}/payment", response_model=OrderResponse)
def update_payment_status(
    order_id: int,
    payment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        
    if order.buyer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the buyer can update payment information."
        )
        
    order.payment_status = "paid"
    order.razorpay_payment_id = payment_id
    db.commit()
    db.refresh(order)
    return order
