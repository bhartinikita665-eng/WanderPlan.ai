from datetime import date, timedelta

from app.models import TripPreferences, RegenerateDayRequest, TripItinerary
from app.services.ai_generator import AIGeneratorService


def _preferences():
    start = date.today() + timedelta(days=30)
    end = start + timedelta(days=1)
    return TripPreferences(
        destination="Kyoto", start_date=start.isoformat(), end_date=end.isoformat(),
        traveler_type="solo", group_size=1, budget_level="moderate", budget_total=500,
        currency="USD", pace="balanced", interests=["culture", "food"],
    )

def _day(day_number, date_text):
    return {
        "day_number": day_number, "date": date_text, "title": f"Day {day_number}",
        "summary": "Existing summary", "transportation_advice": "Use local transit",
        "weather_forecast_hint": "Check forecast before travel",
        "accommodation": {"name": "Suggested stay", "type": "hotel", "neighborhood": "Central",
            "estimated_cost_per_night": 100, "highlight_features": [], "suitability_reason": "Central"},
        "activities": [{"id": f"act-{day_number}", "time_slot": "morning", "time_label": "09:00 AM - 11:00 AM",
            "title": "Temple visit", "category": "culture", "description": "Visit a temple",
            "estimated_duration": "2 hours", "estimated_cost": 10, "location_name": "Kyoto",
            "latitude": None, "longitude": None, "rating": None}],
        "dining": [{"meal": "lunch", "name": "Local cafe", "cuisine": "Japanese", "price_tier": "$",
            "estimated_cost_per_person": 15, "recommendation_reason": "Casual option", "neighborhood": "Central"}],
    }

def test_gemini_itinerary_parser_builds_valid_trip(monkeypatch):
    service = AIGeneratorService()
    prefs = _preferences()
    service._gemini_generate_json = lambda prompt: {
        "title": "Kyoto test trip", "travel_advisory": "Verify details before travel",
        "packing_suggestions": ["Walking shoes"],
        "days": [_day(1, prefs.start_date), _day(2, (date.fromisoformat(prefs.start_date) + timedelta(days=1)).isoformat())],
    }
    trip = service._generate_with_gemini(prefs, 2, "trip-test")
    assert isinstance(trip, TripItinerary)
    assert len(trip.days) == 2
    assert trip.days[0].activities[0].latitude is None
    assert trip.cost_breakdown.total_estimated_cost > 0

def test_gemini_day_regeneration_changes_only_target_day():
    service = AIGeneratorService()
    prefs = _preferences()
    first = _day(1, prefs.start_date)
    second_date = (date.fromisoformat(prefs.start_date) + timedelta(days=1)).isoformat()
    second = _day(2, second_date)
    trip = service._generate_synthesized(prefs, 2, "trip-test")
    before_day_two = trip.days[1].model_dump()
    service._gemini_generate_json = lambda prompt: {
        "title": "A slower day", "summary": "A relaxed culture day",
        "transportation_advice": "Walk between nearby places",
        "activities": [{"id": "new-act", "time_slot": "morning", "time_label": "10:00 AM - 12:00 PM",
            "title": "Garden visit", "category": "nature", "description": "Quiet garden walk",
            "estimated_duration": "2 hours", "estimated_cost": 5, "location_name": "Kyoto garden"}],
        "dining": [],
    }
    req = RegenerateDayRequest(day_number=1, refinement_notes="Make it relaxed", change_pace="relaxed")
    service._regenerate_day_with_gemini(trip, req, trip.days[0])
    assert trip.days[0].title == "A slower day"
    assert trip.days[0].activities[0].title == "Garden visit"
    assert trip.days[1].model_dump() == before_day_two
