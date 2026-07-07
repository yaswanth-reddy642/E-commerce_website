from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "farmer", "customer", "retailer", "admin"
    phone = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    kyc_status = Column(String, default="pending")  # "pending", "verified", "rejected"
    kyc_docs = Column(JSON, nullable=True)  # e.g., {"aadhaar": "...", "pan": "..."}
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    crops = relationship("CropListing", back_populates="farmer", cascade="all, delete-orphan")

class CropListing(Base):
    __tablename__ = "crop_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, index=True, nullable=False)  # "grains", "fruits", "vegetables", "pulses", "spices"
    price_per_kg = Column(Float, nullable=False)
    min_bulk_order = Column(Float, default=10.0)  # in kg
    quantity_available = Column(Float, nullable=False)  # in kg
    image_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    state = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    farmer = relationship("User", back_populates="crops")
    reviews = relationship("Review", back_populates="crop", cascade="all, delete-orphan")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    items = Column(JSON, nullable=False)  # e.g., [{"crop_id": 1, "crop_title": "Paddy", "quantity": 100, "price_per_kg": 25}]
    total_price = Column(Float, nullable=False)
    payment_status = Column(String, default="pending")  # "pending", "paid", "failed"
    shipping_status = Column(String, default="pending")  # "pending", "shipped", "delivered", "cancelled"
    delivery_address = Column(String, nullable=False)
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crop_listings.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_name = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    crop = relationship("CropListing", back_populates="reviews")

class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(Integer, primary_key=True, index=True)
    retailer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    retailer_name = Column(String, nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crop_listings.id"), nullable=False)
    crop_title = Column(String, nullable=False)
    proposed_price = Column(Float, nullable=False)
    proposed_quantity = Column(Float, nullable=False)
    status = Column(String, default="pending")  # "pending", "accepted", "rejected", "countered"
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_name = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    type = Column(String, nullable=False)  # "order", "payment", "delivery", "general"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="open")  # "open", "resolved"
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
