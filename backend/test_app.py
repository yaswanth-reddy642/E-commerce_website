import sys
import os

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.database import SessionLocal, Base, engine
    from app.utils.seeder import seed_db
    from app.services.ai_service import AIService
except Exception as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

def run_tests():
    print("--------------------------------------------------")
    print("KrishiConnect AI Backend Validation Tests")
    print("--------------------------------------------------")

    # 1. Test SQLite and SQLAlchemy Table Creation
    try:
        print("[1/4] Initializing SQLite tables...")
        Base.metadata.create_all(bind=engine)
        print(" -> Table creation successful.")
    except Exception as e:
        print(f" -> Failed table creation: {e}")
        sys.exit(1)

    # 2. Test database seeding
    try:
        print("[2/4] Seeding initial mock data...")
        db = SessionLocal()
        seed_db(db)
        db.close()
        print(" -> Data seeding completed.")
    except Exception as e:
        print(f" -> Failed database seeding: {e}")
        sys.exit(1)

    # 3. Test AI Crop Recommendation
    try:
        print("[3/4] Running Soil Crop Recommender...")
        recom = AIService.recommend_crops(
            location="Guntur",
            soil_type="Black",
            nitrogen=140.0,
            phosphorous=50.0,
            potassium=60.0,
            ph_level=6.8,
            rainfall=850.0,
            temperature=29.0
        )
        print(f" -> Recommender success. Crop: {recom.recommended_crops[0].crop_name} (Match: {recom.recommended_crops[0].confidence*100}%)")
    except Exception as e:
        print(f" -> Failed AI Recommender: {e}")
        sys.exit(1)

    # 4. Test AI Disease Diagnosis
    try:
        print("[4/4] Running Leaf Disease Diagnosis scan...")
        diag = AIService.diagnose_disease("tomato_late_blight.png")
        print(f" -> Diagnostic success. Disease: {diag.disease_name} (Severity: {diag.severity})")
    except Exception as e:
        print(f" -> Failed leaf diagnosis scan: {e}")
        sys.exit(1)

    print("--------------------------------------------------")
    print("Success: All backend services compiled and validated!")
    print("--------------------------------------------------")

if __name__ == "__main__":
    run_tests()
