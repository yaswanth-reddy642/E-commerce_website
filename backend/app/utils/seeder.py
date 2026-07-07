from sqlalchemy.orm import Session
from app.models.db_models import User, CropListing, Order, Review, Negotiation, Complaint
from app.utils.auth import get_password_hash
from datetime import datetime, timedelta

def seed_db(db: Session):
    # Check if database is already seeded
    if db.query(User).first() is not None:
        return

    print("Seeding database with demo data...")

    # 1. Seed Users (Roles: admin, farmer, customer, retailer)
    users = [
        User(
            username="admin",
            email="admin@krishiconnect.ai",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            phone="9999999999",
            state="Delhi",
            district="New Delhi",
            kyc_status="verified"
        ),
        User(
            username="ramesh",
            email="ramesh@gmail.com",
            hashed_password=get_password_hash("farmer123"),
            role="farmer",
            phone="9876543210",
            state="Andhra Pradesh",
            district="Guntur",
            kyc_status="verified",
            kyc_docs={"aadhaar": "123456789012", "pan": "ABCDE1234F", "land_records": "http://landrecords.ap.gov.in/ramesh"}
        ),
        User(
            username="anil",
            email="anil@gmail.com",
            hashed_password=get_password_hash("farmer123"),
            role="farmer",
            phone="9812345678",
            state="Punjab",
            district="Ludhiana",
            kyc_status="verified",
            kyc_docs={"aadhaar": "987654321098", "pan": "XYZWY9876Q", "land_records": "http://landrecords.pb.gov.in/anil"}
        ),
        User(
            username="baldev",
            email="baldev@gmail.com",
            hashed_password=get_password_hash("farmer123"),
            role="farmer",
            phone="9123456780",
            state="Maharashtra",
            district="Nashik",
            kyc_status="pending",  # Showcase pending KYC verification in admin panel
            kyc_docs={"aadhaar": "444455556666", "pan": "KDKDK8827S"}
        ),
        User(
            username="suresh",
            email="suresh@gmail.com",
            hashed_password=get_password_hash("buyer123"),
            role="customer",
            phone="9440123456",
            state="Karnataka",
            district="Bengaluru",
            kyc_status="verified"
        ),
        User(
            username="harish",
            email="harish@wholesale.com",
            hashed_password=get_password_hash("retailer123"),
            role="retailer",
            phone="9393123456",
            state="Telangana",
            district="Hyderabad",
            kyc_status="verified",
            kyc_docs={"aadhaar": "555566667777", "pan": "WHOLE8899D"}
        )
    ]
    
    for u in users:
        db.add(u)
    db.commit()

    # Refresh users to fetch generated IDs
    ramesh_id = db.query(User).filter(User.username == "ramesh").first().id
    anil_id = db.query(User).filter(User.username == "anil").first().id
    suresh_id = db.query(User).filter(User.username == "suresh").first().id
    harish_id = db.query(User).filter(User.username == "harish").first().id

    # 2. Seed Crop Listings
    crops = [
        CropListing(
            farmer_id=ramesh_id,
            title="Guntur Teja Red Chili (Premium Quality)",
            description="Sun-dried red chilies from Guntur, famous for their rich color and fiery heat. Cleaned and packed in jute bags. Moister content strictly under 10%.",
            category="spices",
            price_per_kg=185.00,
            min_bulk_order=50.0,
            quantity_available=4500.0,
            image_url="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
            location="Guntur Rural",
            state="Andhra Pradesh"
        ),
        CropListing(
            farmer_id=ramesh_id,
            title="Organic Vine Tomatoes",
            description="Freshly harvested juicy red tomatoes grown with organic fertilizers. Perfect for retail markets, hotels, and direct household consumption.",
            category="vegetables",
            price_per_kg=22.00,
            min_bulk_order=10.0,
            quantity_available=800.0,
            image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
            location="Guntur",
            state="Andhra Pradesh"
        ),
        CropListing(
            farmer_id=anil_id,
            title="Premium Basmati Paddy (Pusa 1121)",
            description="Long-grain aromatic basmati paddy harvested this season. Excellent grain length with minimum broken percentage. Stored in climate-controlled warehouses.",
            category="grains",
            price_per_kg=35.50,
            min_bulk_order=100.0,
            quantity_available=12000.0,
            image_url="https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=800&q=80",
            location="Ludhiana",
            state="Punjab"
        ),
        CropListing(
            farmer_id=anil_id,
            title="A grade Sonalika Wheat Grains",
            description="High-gluten wheat grains rich in protein, perfect for milling premium flour (Chakki Atta). Certified organic cultivation without synthetic pesticide use.",
            category="grains",
            price_per_kg=26.80,
            min_bulk_order=200.0,
            quantity_available=8500.0,
            image_url="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
            location="Khanna Market",
            state="Punjab"
        ),
        CropListing(
            farmer_id=anil_id,
            title="Yellow Moong Dal (Split)",
            description="Cleaned and polished yellow split moong dal from local co-operative processing units. Premium grade high-protein grain.",
            category="pulses",
            price_per_kg=115.00,
            min_bulk_order=50.0,
            quantity_available=2500.0,
            image_url="https://images.unsplash.com/photo-1585996388914-998a44b80c35?auto=format&fit=crop&w=800&q=80",
            location="Ludhiana",
            state="Punjab"
        ),
        CropListing(
            farmer_id=ramesh_id,
            title="Nagpur Sweet Oranges",
            description="Sweet, juicy, freshly plucked oranges with thin skin. Highly demanded by juice manufacturers and wholesalers. Direct from farm orchard.",
            category="fruits",
            price_per_kg=45.00,
            min_bulk_order=100.0,
            quantity_available=3000.0,
            image_url="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
            location="Amravati Belt",
            state="Maharashtra"
        )
    ]
    
    for c in crops:
        db.add(c)
    db.commit()

    # Fetch crop IDs
    chili_id = db.query(CropListing).filter(CropListing.title.like("%Chili%")).first().id
    tomato_id = db.query(CropListing).filter(CropListing.title.like("%Tomato%")).first().id
    paddy_id = db.query(CropListing).filter(CropListing.title.like("%Basmati%")).first().id

    # 3. Seed Reviews
    reviews = [
        Review(crop_id=chili_id, buyer_id=suresh_id, buyer_name="suresh", rating=5, comment="Exceptional quality red chili! The spice level and aroma are perfect. Will purchase in bulk for my restaurant chain soon."),
        Review(crop_id=chili_id, buyer_id=harish_id, buyer_name="harish", rating=4, comment="Standard Guntur Teja chili. Good packing. Ramesh accommodated our custom weight bags requests."),
        Review(crop_id=tomato_id, buyer_id=suresh_id, buyer_name="suresh", rating=4, comment="Fresh tomatoes. Delivered in crates. A few were slightly squashed but overall very fresh and sweet."),
        Review(crop_id=paddy_id, buyer_id=harish_id, buyer_name="harish", rating=5, comment="Finest basmati grains. High elongation ratio upon testing. Extremely satisfied with the crop batch.")
    ]
    for r in reviews:
        db.add(r)

    # 4. Seed Negotiations (For Retailer Harish with Farmers Ramesh and Anil)
    negs = [
        Negotiation(
            retailer_id=harish_id,
            retailer_name="harish",
            farmer_id=ramesh_id,
            crop_id=chili_id,
            crop_title="Guntur Teja Red Chili (Premium Quality)",
            proposed_price=172.00,
            proposed_quantity=800.0,
            status="pending",
            message="We require 800 kg for export shipments. Can you give a bulk discount to ₹172/kg? Looking forward to building a long-term supply contract."
        ),
        Negotiation(
            retailer_id=harish_id,
            retailer_name="harish",
            farmer_id=anil_id,
            crop_id=paddy_id,
            crop_title="Premium Basmati Paddy (Pusa 1121)",
            proposed_price=33.00,
            proposed_quantity=3000.0,
            status="countered",
            message="Farmer Counter Offer: I cannot sell at ₹33, but I can offer ₹34.50/kg for a minimum of 3000 kg. High quality Pusa 1121 seed."
        )
    ]
    for n in negs:
        db.add(n)

    # 5. Seed Orders (Orders completed/pending payment)
    orders = [
        Order(
            buyer_id=suresh_id,
            seller_id=ramesh_id,
            items=[{"crop_id": tomato_id, "crop_title": "Organic Vine Tomatoes", "quantity": 100.0, "price_per_kg": 22.00}],
            total_price=2200.00,
            payment_status="paid",
            shipping_status="delivered",
            delivery_address="Suresh Organic Store, Indira Nagar, Bengaluru, Karnataka - 560038",
            razorpay_order_id="order_rzp_mock_1",
            razorpay_payment_id="pay_rzp_mock_11",
            created_at=datetime.utcnow() - timedelta(days=5)
        ),
        Order(
            buyer_id=harish_id,
            seller_id=anil_id,
            items=[
                {"crop_id": paddy_id, "crop_title": "Premium Basmati Paddy (Pusa 1121)", "quantity": 1000.0, "price_per_kg": 35.50},
                {"crop_id": chili_id, "crop_title": "Guntur Teja Red Chili", "quantity": 200.0, "price_per_kg": 185.00}
            ],
            total_price=72500.00,
            payment_status="paid",
            shipping_status="shipped",
            delivery_address="Harish Wholesalers, Gaddi Annaram Fruit Market, Hyderabad, Telangana - 500035",
            razorpay_order_id="order_rzp_mock_2",
            razorpay_payment_id="pay_rzp_mock_22",
            created_at=datetime.utcnow() - timedelta(days=2)
        )
    ]
    for o in orders:
        db.add(o)

    # 6. Seed Complaints (For platform ticketing system)
    complaints = [
        Complaint(
            user_id=suresh_id,
            user_name="suresh",
            user_role="customer",
            type="order",
            title="Damaged Produce Received",
            description="In order #1, about 5 kg of tomatoes were squished and unusable. Requesting a partial refund or adjustment on next bill.",
            status="open"
        ),
        Complaint(
            user_id=harish_id,
            user_name="harish",
            user_role="retailer",
            type="delivery",
            title="Logistic Truck Delay",
            description="Order #2 truck driver has delayed transit by 24 hours. Requesting admin team to coordinate with logistics vendor.",
            status="resolved",
            resolution="Admin contacted logistic driver. Delay occurred due to state border check-posts. Truck has cleared check-post and is now arriving within 2 hours."
        )
    ]
    for cp in complaints:
        db.add(cp)

    db.commit()
    print("Database seeding completed successfully!")
