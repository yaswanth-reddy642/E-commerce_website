from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.utils.seeder import seed_db
from app.routers import auth, crops, orders, negotiations, ai, admin

# Create tables in SQLite
Base.metadata.create_all(bind=engine)

# Seed initial data
db = SessionLocal()
try:
    seed_db(db)
finally:
    db.close()

app = FastAPI(
    title="KrishiConnect AI - Smart Agriculture Marketplace Platform API",
    description="Enterprise-grade REST APIs enabling Farmer-to-Consumer direct sales, bulk retailer negotiations, and AI-assisted crop advisory.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins for simplified local development testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router)
app.include_router(crops.router)
app.include_router(orders.router)
app.include_router(negotiations.router)
app.include_router(ai.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "KrishiConnect AI Platform API",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }
