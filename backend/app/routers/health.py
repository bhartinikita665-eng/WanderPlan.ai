from fastapi import APIRouter
from app.services.supabase_service import db_service
from app.config import settings

router = APIRouter(prefix="/health", tags=["health"])

@router.get("")
def health_check():
    """Returns application health, Supabase connection status, and AI service configuration."""
    storage_info = db_service.get_status()
    return {
        "status": "healthy",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "storage": storage_info,
        "ai": {
            "gemini_configured": bool(settings.GEMINI_API_KEY and "your-" not in settings.GEMINI_API_KEY),
            "model": settings.GEMINI_MODEL,
            "fallback": "Local rule-based itinerary generator is used if Gemini is not configured or unavailable."
        }
    }
