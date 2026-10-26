import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory or root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Personalized Travel Itinerary Planner"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # AI Keys
    GEMINI_API_KEY: str = (os.getenv("GEMINI_API_KEY", "") or "").strip()
    GEMINI_MODEL: str = (os.getenv("GEMINI_MODEL", "gemini-3.8-flash") or "gemini-3.8-flash").strip()
    
    # Supabase credentials
    SUPABASE_URL: str = (os.getenv("SUPABASE_URL", "") or "").strip()
    SUPABASE_KEY: str = (os.getenv("SUPABASE_KEY", "") or "").strip()
    
    # Storage directory for local fallback database
    DATA_DIR: Path = Path(__file__).resolve().parent.parent / "data"
    
    # Server settings
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
