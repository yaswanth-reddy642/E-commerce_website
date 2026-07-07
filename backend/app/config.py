from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    SECRET_KEY: str = "supersecretkey_krishiconnect_ai_2026_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./krishiconnect.db"
    MONGODB_URL: str = ""
    RAZORPAY_KEY_ID: str = "rzp_test_mockkey123"
    RAZORPAY_KEY_SECRET: str = "mocksecret123"
    
    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        extra = "ignore"

settings = Settings()
