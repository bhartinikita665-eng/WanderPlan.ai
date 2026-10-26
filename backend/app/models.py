from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class TripPreferences(BaseModel):
    destination: str = Field(..., description="Destination city, region, or country")
    origin: Optional[str] = Field(None, description="Starting city/airport")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD")
    end_date: str = Field(..., description="End date in YYYY-MM-DD")
    traveler_type: str = Field("solo", description="solo, couple, group, family")
    group_size: int = Field(1, ge=1, description="Number of travelers")
    budget_level: str = Field("moderate", description="budget, moderate, luxury")
    budget_total: Optional[float] = Field(None, description="User's stated max budget in specified currency")
    currency: str = Field("USD", description="Currency code (USD, EUR, GBP, INR, etc.)")
    pace: str = Field("balanced", description="relaxed, balanced, packed")
    interests: List[str] = Field(default_factory=lambda: ["sightseeing", "food"], description="Selected travel interests")
    accommodation_type: str = Field("boutique", description="hostel, boutique, resort, hotel_3star, luxury_5star, airbnb")
    dietary_requirements: Optional[str] = Field(None, description="e.g. Vegetarian, Halal, Gluten-Free, None")
    accessibility_notes: Optional[str] = Field(None, description="Mobility, elevator requirements, etc.")
    additional_notes: Optional[str] = Field(None, description="Special requests or romantic/group notes")

class Activity(BaseModel):
    id: str
    time_slot: str = Field(..., description="morning, afternoon, evening, night")
    time_label: str = Field(..., description="e.g. 09:30 AM - 11:30 AM")
    title: str
    category: str = Field(..., description="sightseeing, dining, culture, nature, transport, leisure, nightlife")
    description: str
    insider_tip: Optional[str] = None
    estimated_duration: str = "2 hours"
    estimated_cost: float = 0.0
    location_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating: Optional[float] = 4.8
    booking_required: bool = False

class DiningSpot(BaseModel):
    meal: str = Field(..., description="breakfast, lunch, dinner, snack")
    name: str
    cuisine: str
    price_tier: str = "$$"
    estimated_cost_per_person: float = 25.0
    recommendation_reason: str
    signature_dish: Optional[str] = None
    neighborhood: str

class Accommodation(BaseModel):
    name: str
    type: str
    neighborhood: str
    estimated_cost_per_night: float = 120.0
    highlight_features: List[str] = Field(default_factory=list)
    suitability_reason: str

class DailyItinerary(BaseModel):
    day_number: int
    date: str
    title: str
    summary: str
    activities: List[Activity]
    dining: List[DiningSpot]
    accommodation: Optional[Accommodation] = None
    transportation_advice: str
    estimated_day_cost: float
    weather_forecast_hint: Optional[str] = None

class TripCostBreakdown(BaseModel):
    total_estimated_cost: float
    accommodation_total: float
    dining_total: float
    activities_total: float
    local_transit_total: float
    currency: str = "USD"
    per_person_cost: float
    budget_status: str = "on_target" # "under_budget", "on_target", "over_budget"

class TripItinerary(BaseModel):
    id: str
    title: str
    destination: str
    created_at: str
    updated_at: str
    preferences: TripPreferences
    days: List[DailyItinerary]
    cost_breakdown: TripCostBreakdown
    packing_suggestions: List[str] = Field(default_factory=list)
    travel_advisory: Optional[str] = None
    scenario_badge: Optional[str] = None # e.g. "Solo Weekend", "Couple Romantic", "Small Group Multi-Day"

class RegenerateDayRequest(BaseModel):
    day_number: int
    refinement_notes: str
    change_pace: Optional[str] = None
    focus_interests: Optional[List[str]] = None

class AddActivityRequest(BaseModel):
    day_number: int
    activity: Activity

class UpdateActivityRequest(BaseModel):
    day_number: int
    activity_id: str
    activity: Activity

class SupabaseConfigTest(BaseModel):
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
