from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import uuid

from app.models import (
    TripItinerary, TripPreferences, RegenerateDayRequest, 
    AddActivityRequest, UpdateActivityRequest, Activity
)
from app.services.ai_generator import ai_service
from app.services.supabase_service import db_service
from app.services.preset_trips import get_preset_trips

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("", response_model=List[TripItinerary])
def list_trips():
    """List all saved itineraries."""
    trips = db_service.list_itineraries()
    # If database is completely empty on fresh launch, seed presets automatically!
    if not trips:
        presets = get_preset_trips()
        for p in presets:
            db_service.save_itinerary(p)
        return presets
    return trips

@router.post("/generate", response_model=TripItinerary)
def generate_trip(preferences: TripPreferences):
    """Generate a new personalized day-by-day travel itinerary using AI."""
    try:
        new_trip = ai_service.generate_itinerary(preferences)
        saved = db_service.save_itinerary(new_trip.model_dump())
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate trip: {str(e)}")

@router.get("/{trip_id}", response_model=TripItinerary)
def get_trip(trip_id: str):
    """Retrieve an itinerary by its ID."""
    trip = db_service.get_itinerary(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.put("/{trip_id}", response_model=TripItinerary)
def update_trip(trip_id: str, updated_trip: TripItinerary):
    """Update an existing trip itinerary."""
    existing = db_service.get_itinerary(trip_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Trip not found")
    updated_dict = updated_trip.model_dump()
    updated_dict["updated_at"] = datetime.utcnow().isoformat() + "Z"
    return db_service.save_itinerary(updated_dict)

@router.delete("/{trip_id}")
def delete_trip(trip_id: str):
    """Delete an itinerary."""
    success = db_service.delete_itinerary(trip_id)
    if not success:
        raise HTTPException(status_code=404, detail="Trip not found or could not be deleted")
    return {"status": "success", "message": f"Trip {trip_id} deleted"}

@router.post("/{trip_id}/regenerate-day", response_model=TripItinerary)
def regenerate_day(trip_id: str, request: RegenerateDayRequest):
    """
    Regenerate a specific day's schedule based on user refinement instructions.
    Useful for couples or groups adjusting pace or exploring alternative activities.
    """
    raw_trip = db_service.get_itinerary(trip_id)
    if not raw_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    trip_model = TripItinerary(**raw_trip)
    if not any(day.day_number == request.day_number for day in trip_model.days):
        raise HTTPException(status_code=400, detail=f"Day {request.day_number} not found in itinerary")
    if not request.refinement_notes.strip():
        raise HTTPException(status_code=400, detail="Please provide refinement instructions")
    refined_trip = ai_service.regenerate_single_day(trip_model, request)
    db_service.save_itinerary(refined_trip.model_dump())
    return refined_trip

@router.post("/{trip_id}/activities", response_model=TripItinerary)
def add_activity(trip_id: str, request: AddActivityRequest):
    """Add a custom activity to a specific day."""
    raw_trip = db_service.get_itinerary(trip_id)
    if not raw_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    trip = TripItinerary(**raw_trip)
    day = next((d for d in trip.days if d.day_number == request.day_number), None)
    if not day:
        raise HTTPException(status_code=400, detail=f"Day {request.day_number} not found in itinerary")
    
    # Assign activity ID if not provided
    if not request.activity.id:
        request.activity.id = f"act-{uuid.uuid4().hex[:6]}"
        
    day.activities.append(request.activity)
    # Recalculate day cost & trip cost breakdown
    trip.cost_breakdown = ai_service._calculate_costs(trip.days, trip.preferences)
    trip.updated_at = datetime.utcnow().isoformat() + "Z"
    
    db_service.save_itinerary(trip.model_dump())
    return trip

@router.delete("/{trip_id}/days/{day_number}/activities/{activity_id}", response_model=TripItinerary)
def delete_activity(trip_id: str, day_number: int, activity_id: str):
    """Delete an activity from a day."""
    raw_trip = db_service.get_itinerary(trip_id)
    if not raw_trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    trip = TripItinerary(**raw_trip)
    day = next((d for d in trip.days if d.day_number == day_number), None)
    if not day:
        raise HTTPException(status_code=400, detail=f"Day {day_number} not found")
    
    day.activities = [a for a in day.activities if a.id != activity_id]
    trip.cost_breakdown = ai_service._calculate_costs(trip.days, trip.preferences)
    trip.updated_at = datetime.utcnow().isoformat() + "Z"
    
    db_service.save_itinerary(trip.model_dump())
    return trip
