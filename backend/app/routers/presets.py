from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import uuid
from datetime import datetime

from app.models import TripItinerary
from app.services.preset_trips import get_preset_trips, get_preset_by_id
from app.services.supabase_service import db_service

router = APIRouter(prefix="/presets", tags=["presets"])

@router.get("", response_model=List[Dict[str, Any]])
def list_presets():
    """Returns the 3 scenario presets (Solo Weekend, Couple Romantic, Small Group Multi-Day)."""
    return get_preset_trips()

@router.post("/clone/{preset_id}", response_model=TripItinerary)
def clone_preset(preset_id: str):
    """Clones a preset scenario into the user's active itineraries for customized editing."""
    preset = get_preset_by_id(preset_id)
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    
    cloned = dict(preset)
    cloned["id"] = f"trip-{uuid.uuid4().hex[:8]}"
    cloned["title"] = f"My {cloned.get('title', 'Trip')}"
    cloned["created_at"] = datetime.utcnow().isoformat() + "Z"
    cloned["updated_at"] = datetime.utcnow().isoformat() + "Z"
    
    saved = db_service.save_itinerary(cloned)
    return saved
