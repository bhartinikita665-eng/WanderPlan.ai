import json
import logging
import uuid
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from app.models import TripPreferences, TripItinerary, DailyItinerary, Activity, DiningSpot, Accommodation, TripCostBreakdown, RegenerateDayRequest
from app.config import settings

logger = logging.getLogger("ai_generator")

# Popular destination knowledge base for high-fidelity fallback generation
DESTINATION_KNOWLEDGE = {
    "paris": {
        "country": "France",
        "currency": "EUR",
        "advisory": "Get the Navigo Easy pass for metro trips and book Louvre / Eiffel Tower tickets at least 3 weeks ahead.",
        "neighborhoods": ["Le Marais", "Montmartre", "Saint-Germain-des-Prés", "Latin Quarter"],
        "attractions": [
            {"title": "Musée d'Orsay & Impressionist Masterpieces", "cat": "culture", "cost": 16, "dur": "2.5 hours", "tip": "Enter via Porte C with advance tickets to bypass the queue.", "lat": 48.8600, "lng": 2.3266},
            {"title": "Le Marais Secret Courtyards & Vintage Boutiques", "cat": "leisure", "cost": 0, "dur": "2 hours", "tip": "Check out Place des Vosges and the hidden garden behind Hôtel de Sully.", "lat": 48.8550, "lng": 2.3600},
            {"title": "Seine Sunset Cruise & Pont Alexandre III", "cat": "sightseeing", "cost": 18, "dur": "1.5 hours", "tip": "Time the departure for 30 minutes before dusk to see the golden hour light up the bridges.", "lat": 48.8638, "lng": 2.3134},
            {"title": "Montmartre Alleys & Sacré-Cœur Viewpoint", "cat": "sightseeing", "cost": 0, "dur": "2.5 hours", "tip": "Walk up through Rue de l'Abreuvoir to avoid the tourist crowd at the funicular.", "lat": 48.8867, "lng": 2.3431},
            {"title": "Sainte-Chapelle Stained Glass Wonder", "cat": "culture", "cost": 13, "dur": "1.5 hours", "tip": "Visit on a bright sunny morning when light floods through the 13th-century rose window.", "lat": 48.8554, "lng": 2.3450},
        ],
        "dining": [
            {"meal": "lunch", "name": "Breizh Café Le Marais", "cuisine": "Artisan Galettes & Crêpes", "tier": "$$", "cost": 22, "reason": "Crispy organic buckwheat galettes with farm-pressed Breton cider.", "dish": "Galette Complète with smoked ham and Gruyère", "hood": "Le Marais"},
            {"meal": "dinner", "name": "Bistrot Paul Bert", "cuisine": "Quintessential Parisian Bistro", "tier": "$$$", "cost": 55, "reason": "Classic chalk-board menu with dry-aged steak frites and legendary soufflé.", "dish": "Steak au Poivre with frites", "hood": "11th Arrondissement"},
            {"meal": "lunch", "name": "Bouillon Chartier Grands Boulevards", "cuisine": "Historic Grand Bouillon", "tier": "$", "cost": 16, "reason": "Centuries-old Belle Époque dining hall with fast, friendly, affordable classics.", "dish": "Duck confit with crushed baby potatoes", "hood": "Montmartre"}
        ],
        "hotel": {"name": "Hôtel Caron de Beaumarchais", "type": "Boutique Literary Hotel", "hood": "Le Marais", "cost": 190, "features": ["Antique French decor", "Fresh croissants to bed", "Central walkability"], "reason": "Charming period elegance in the heart of Paris' most vibrant walking quarter."}
    },
    "tokyo": {
        "country": "Japan",
        "currency": "USD",
        "advisory": "Charge your digital Suica card in your phone wallet; trains are clean, punctual, and cover every corner.",
        "neighborhoods": ["Shinjuku", "Shibuya", "Asakusa", "Ginza", "Shimokitazawa"],
        "attractions": [
            {"title": "Senso-ji Temple & Asakusa Old Town", "cat": "culture", "cost": 0, "dur": "2 hours", "tip": "Visit early morning before souvenir shops open for serene photos under the giant red lantern.", "lat": 35.7148, "lng": 139.7967},
            {"title": "Shibuya Crossing & Shibuya Sky Observation Deck", "cat": "sightseeing", "cost": 20, "dur": "2 hours", "tip": "Pre-book a sunset timeslot at Shibuya Sky for a 360-degree glass view over Mount Fuji.", "lat": 35.6595, "lng": 139.7005},
            {"title": "Meiji Jingu Shrine & Harajuku Forest", "cat": "nature", "cost": 0, "dur": "2 hours", "tip": "Notice the massive cypress torii gates made from 1,500-year-old Taiwanese trees.", "lat": 35.6764, "lng": 139.6993},
            {"title": "Shimokitazawa Vintage Alleys & Vinyl Record Cafes", "cat": "leisure", "cost": 10, "dur": "3 hours", "tip": "Check out underground jazz kissaten cafes for hand-drip pour-overs and vinyl music.", "lat": 35.6617, "lng": 139.6672},
        ],
        "dining": [
            {"meal": "lunch", "name": "Afuri Harajuku", "cuisine": "Yuzu Shio Ramen", "tier": "$", "cost": 14, "reason": "Refreshing citrus yuzu infused broth with charcoal-grilled chashu pork.", "dish": "Yuzu Ratan Ramen", "hood": "Harajuku"},
            {"meal": "dinner", "name": "Omoide Yokocho Yakitori Alleys", "cuisine": "Charcoal Skewer Alley", "tier": "$$", "cost": 28, "reason": "Atmospheric post-war alleyways with counter stalls serving skewers and highballs.", "dish": "Negima chicken scallion skewers", "hood": "Shinjuku"}
        ],
        "hotel": {"name": "Hotel Gracery Shinjuku", "type": "Modern City Hotel", "hood": "Shinjuku", "cost": 145, "features": ["Direct airport limousine bus", "Godzilla terrace view", "Steps from JR line"], "reason": "Superb connectivity and walking distance to dining."}
    },
    "rome": {
        "country": "Italy",
        "currency": "EUR",
        "advisory": "Carry a refillable water bottle; Rome has over 2,500 ancient drinking fountains (nasoni) with ice-cold mountain water.",
        "neighborhoods": ["Trastevere", "Centro Storico", "Monti", "Prati"],
        "attractions": [
            {"title": "Colosseum & Roman Forum Archaeological Walk", "cat": "culture", "cost": 18, "dur": "3 hours", "tip": "Enter via the Forum entrance near Via dei Fori Imperiali for shorter security queues.", "lat": 41.8902, "lng": 12.4922},
            {"title": "Pantheon & Piazza Navona Fountains", "cat": "sightseeing", "cost": 5, "dur": "1.5 hours", "tip": "Look straight up at the 9-meter oculus open to the sky in the ancient dome.", "lat": 41.8986, "lng": 12.4769},
            {"title": "Trastevere Cobblestone Walk & Gianicolo Hill Sunset", "cat": "leisure", "cost": 0, "dur": "2.5 hours", "tip": "Climb up to Piazzale Giuseppe Garibaldi for Rome's premier sunset panorama.", "lat": 41.8895, "lng": 12.4660},
        ],
        "dining": [
            {"meal": "lunch", "name": "Roscioli Salumeria con Cucina", "cuisine": "Roman Cured Meats & Pasta", "tier": "$$", "cost": 32, "reason": "Renowned for the crispiest guanciale and richest carbonara in Rome.", "dish": "Spaghetti alla Carbonara", "hood": "Campo de' Fiori"},
            {"meal": "dinner", "name": "Da Enzo al 29", "cuisine": "Rustic Trastevere Trattoria", "tier": "$$", "cost": 30, "reason": "Quintessential red-checkered table dining with fried artichokes and amatriciana.", "dish": "Carciofo alla Giudia & Rigatoni con la Pajata", "hood": "Trastevere"}
        ],
        "hotel": {"name": "The Hoxton Rome", "type": "Design Boutique Hotel", "hood": "Parioli / Salario", "cost": 160, "features": ["Mid-century retro decor", "Sunlit garden terrace", "Craft cocktail lobby"], "reason": "Stylish oasis with easy bus routes into the historic center."}
    }
}

class AIGeneratorService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.gemini_model = settings.GEMINI_MODEL

    def _calculate_costs(self, days: List[DailyItinerary], prefs: TripPreferences) -> TripCostBreakdown:
        acc_total = 0.0
        dining_total = 0.0
        act_total = 0.0
        transit_total = 0.0

        for day in days:
            # accommodation
            if day.accommodation:
                acc_total += day.accommodation.estimated_cost_per_night
            # dining
            for d in day.dining:
                dining_total += d.estimated_cost_per_person * prefs.group_size
            # activities
            for a in day.activities:
                act_total += a.estimated_cost * prefs.group_size
            # transit estimate per day
            transit_total += (15.0 * prefs.group_size)

        total_cost = acc_total + dining_total + act_total + transit_total
        per_person = total_cost / max(1, prefs.group_size)

        budget_status = "on_target"
        if prefs.budget_total and prefs.budget_total > 0:
            if total_cost < prefs.budget_total * 0.9:
                budget_status = "under_budget"
            elif total_cost > prefs.budget_total * 1.1:
                budget_status = "over_budget"

        return TripCostBreakdown(
            total_estimated_cost=round(total_cost, 2),
            accommodation_total=round(acc_total, 2),
            dining_total=round(dining_total, 2),
            activities_total=round(act_total, 2),
            local_transit_total=round(transit_total, 2),
            currency=prefs.currency,
            per_person_cost=round(per_person, 2),
            budget_status=budget_status
        )

    def _compute_num_days(self, start_date: str, end_date: str) -> int:
        try:
            d1 = datetime.strptime(start_date, "%Y-%m-%d")
            d2 = datetime.strptime(end_date, "%Y-%m-%d")
            delta = (d2 - d1).days + 1
            return max(1, min(delta, 10)) # clamp between 1 and 10 days for fast responsiveness
        except Exception:
            return 3

    def generate_itinerary(self, prefs: TripPreferences) -> TripItinerary:
        """
        Uses prompt engineering to generate day-by-day customized travel itinerary.
        Calls Gemini when configured; otherwise uses the deterministic local fallback.
        """
        num_days = self._compute_num_days(prefs.start_date, prefs.end_date)
        trip_id = f"trip-{uuid.uuid4().hex[:8]}"

        # Attempt Gemini LLM generation if configured
        if self.gemini_key and "your-" not in self.gemini_key:
            try:
                llm_result = self._generate_with_gemini(prefs, num_days, trip_id)
                if llm_result:
                    return llm_result
            except Exception as e:
                print(
    f"Gemini generation error: {type(e).__name__}: {e}",
    flush=True
)
                logger.exception(
    "Gemini itinerary generation failed. Using local fallback."
)

        # Generative algorithmic synthesis
        return self._generate_synthesized(prefs, num_days, trip_id)

    def regenerate_single_day(self, current_trip: TripItinerary, req: RegenerateDayRequest) -> TripItinerary:
        """
        Regenerates a single day based on user refinement instructions (Scenario 2 & 3 dynamic refinement).
        """
        day_num = req.day_number
        target_day = next((d for d in current_trip.days if d.day_number == day_num), None)
        if not target_day:
            return current_trip

        # Prefer Gemini for genuine AI-powered day regeneration when configured.
        if self.gemini_key and "your-" not in self.gemini_key:
            try:
                ai_refined = self._regenerate_day_with_gemini(current_trip, req, target_day)
                if ai_refined:
                    return ai_refined
            except Exception as exc:
                logger.exception(
    "Gemini day regeneration failed. Using local fallback."
)

        # Local fallback remains available when Gemini is not configured or unavailable.
        pace = req.change_pace or current_trip.preferences.pace
        focus_interests = req.focus_interests or current_trip.preferences.interests

        # Create updated activities tailored to the refinement
        new_activities = []
        if "coastal" in req.refinement_notes.lower() or "nature" in req.refinement_notes.lower() or "relax" in req.refinement_notes.lower():
            new_activities.append(
                Activity(
                    id=f"act-regen-{uuid.uuid4().hex[:6]}",
                    time_slot="morning",
                    time_label="10:00 AM - 01:00 PM",
                    title=f"Scenic Coastal Panorama & Leisure Walk ({current_trip.destination})",
                    category="nature",
                    description=f"Leisurely exploration responding to your preference: {req.refinement_notes}",
                    insider_tip="Take time to soak in the tranquil views away from crowded spots.",
                    estimated_duration="3 hours",
                    estimated_cost=25.0,
                    location_name=f"{current_trip.destination} Coastal Lookout",
                    rating=4.9
                )
            )
            new_activities.append(
                Activity(
                    id=f"act-regen-{uuid.uuid4().hex[:6]}",
                    time_slot="afternoon",
                    time_label="02:30 PM - 05:00 PM",
                    title="Artisan Tasting & Vineyard Terrace",
                    category="dining",
                    description="Private regional tasting session featuring organic local produce and wines.",
                    insider_tip="Confirm reservation requirements and availability directly with the venue.",
                    estimated_duration="2.5 hours",
                    estimated_cost=45.0,
                    location_name=f"{current_trip.destination} Hills",
                    rating=4.8
                )
            )
        else:
            new_activities.append(
                Activity(
                    id=f"act-regen-{uuid.uuid4().hex[:6]}",
                    time_slot="morning",
                    time_label="09:30 AM - 12:30 PM",
                    title=f"Curated Discovery: {req.refinement_notes.capitalize()}",
                    category="culture",
                    description=f"Custom-selected morning exploration focusing on {', '.join(focus_interests)}.",
                    insider_tip="Arrive early and check current ticketing rules to reduce waiting.",
                    estimated_duration="3 hours",
                    estimated_cost=20.0,
                    location_name=f"{current_trip.destination} Historic Center",
                    rating=4.9
                )
            )
            new_activities.append(
                Activity(
                    id=f"act-regen-{uuid.uuid4().hex[:6]}",
                    time_slot="afternoon",
                    time_label="02:00 PM - 05:00 PM",
                    title="Experiential Workshop & Local Heritage Walk",
                    category="leisure",
                    description=f"Hands-on interactive session tailored for {current_trip.preferences.traveler_type}.",
                    insider_tip="Ask your local host for their favorite secret sunset spot.",
                    estimated_duration="3 hours",
                    estimated_cost=35.0,
                    location_name=f"{current_trip.destination} Quarter",
                    rating=4.8
                )
            )

        if pace != "relaxed":
            new_activities.append(
                Activity(
                    id=f"act-regen-{uuid.uuid4().hex[:6]}",
                    time_slot="evening",
                    time_label="06:30 PM - 08:30 PM",
                    title="Sunset Aperitivo & Live Acoustics",
                    category="nightlife",
                    description="Golden hour relaxation with handcrafted beverages and local musicians.",
                    insider_tip="Arrive 20 minutes before sunset for frontline seats.",
                    estimated_duration="2 hours",
                    estimated_cost=30.0,
                    location_name=f"{current_trip.destination} Terrace",
                    rating=4.9
                )
            )

        # Update target day
        target_day.title = f"Regenerated Day {day_num}: {req.refinement_notes[:35]}..."
        target_day.summary = f"Custom regenerated plan based on your guidance: '{req.refinement_notes}'."
        target_day.activities = new_activities
        target_day.estimated_day_cost = sum(a.estimated_cost for a in new_activities) + (target_day.accommodation.estimated_cost_per_night if target_day.accommodation else 0)

        # Recalculate trip breakdown
        current_trip.cost_breakdown = self._calculate_costs(current_trip.days, current_trip.preferences)
        current_trip.updated_at = datetime.utcnow().isoformat() + "Z"
        return current_trip

    def _generate_synthesized(self, prefs: TripPreferences, num_days: int, trip_id: str) -> TripItinerary:
        dest_clean = prefs.destination.lower()
        key_match = next((k for k in DESTINATION_KNOWLEDGE if k in dest_clean), None)
        dest_info = DESTINATION_KNOWLEDGE.get(key_match) if key_match else None

        # Build scenario badge
        badge = "Custom Trip"
        if prefs.traveler_type == "solo":
            badge = "Solo Getaway"
        elif prefs.traveler_type == "couple":
            badge = "Couple Romantic Vacation"
        elif prefs.traveler_type == "group":
            badge = f"Group Expedition ({prefs.group_size} travelers)"

        # Determine budget rates
        rate_multipliers = {"budget": 0.7, "moderate": 1.0, "luxury": 2.2}
        mult = rate_multipliers.get(prefs.budget_level, 1.0)

        start_dt = datetime.strptime(prefs.start_date, "%Y-%m-%d")

        days_list: List[DailyItinerary] = []
        for i in range(num_days):
            day_num = i + 1
            cur_date = (start_dt + timedelta(days=i)).strftime("%Y-%m-%d")
            
            # Curate 2 to 3 activities based on pace
            activities = []
            if dest_info and i < len(dest_info["attractions"]):
                base_attr = dest_info["attractions"][i]
                activities.append(
                    Activity(
                        id=f"act-{trip_id}-{day_num}-1",
                        time_slot="morning",
                        time_label="09:30 AM - 12:00 PM",
                        title=base_attr["title"],
                        category=base_attr["cat"],
                        description=f"Curated visit to {base_attr['title']} tailored for your {prefs.pace} pace.",
                        insider_tip=base_attr["tip"],
                        estimated_duration=base_attr["dur"],
                        estimated_cost=round(base_attr["cost"] * mult, 2),
                        location_name=f"{prefs.destination} Landmark",
                        latitude=base_attr.get("lat"),
                        longitude=base_attr.get("lng"),
                        rating=4.9
                    )
                )
            else:
                activities.append(
                    Activity(
                        id=f"act-{trip_id}-{day_num}-1",
                        time_slot="morning",
                        time_label="09:30 AM - 12:00 PM",
                        title=f"{prefs.destination} Historic Center & Highlights",
                        category="sightseeing",
                        description=f"Explore the iconic landmarks and vibrant morning streets of {prefs.destination}.",
                        insider_tip="Begin early to enjoy photography before tour buses arrive.",
                        estimated_duration="2.5 hours",
                        estimated_cost=round(15.0 * mult, 2),
                        location_name=f"{prefs.destination} Center",
                        rating=4.8
                    )
                )

            # Afternoon activity
            activities.append(
                Activity(
                    id=f"act-{trip_id}-{day_num}-2",
                    time_slot="afternoon",
                    time_label="02:00 PM - 04:30 PM",
                    title=f"Local Artisan Crafts & Neighborhood Walk",
                    category="culture" if "culture" in prefs.interests else "leisure",
                    description=f"Wander charming alleys, browse independent boutiques, and taste local specialties.",
                    insider_tip="Look for small family-run workshops in the side lanes.",
                    estimated_duration="2.5 hours",
                    estimated_cost=round(10.0 * mult, 2),
                    location_name=f"{prefs.destination} Old Quarter",
                    rating=4.7
                )
            )

            # Evening activity (if not relaxed or on alternate days)
            if prefs.pace != "relaxed" or day_num == 1 or day_num == num_days:
                activities.append(
                    Activity(
                        id=f"act-{trip_id}-{day_num}-3",
                        time_slot="evening",
                        time_label="06:30 PM - 09:00 PM",
                        title=f"Sunset Viewpoint & Vibrant Night Promenade",
                        category="leisure" if prefs.traveler_type != "group" else "nightlife",
                        description=f"Enjoy panoramic sunset vistas over {prefs.destination} followed by evening refreshments.",
                        insider_tip="Great spot for couple and group photos in golden hour glow.",
                        estimated_duration="2.5 hours",
                        estimated_cost=round(20.0 * mult, 2),
                        location_name=f"{prefs.destination} Promenade",
                        rating=4.9
                    )
                )

            # Dining
            dining = [
                DiningSpot(
                    meal="lunch",
                    name=f"{prefs.destination} Trattoria & Cafe",
                    cuisine=f"Authentic Regional {prefs.destination} Cuisine",
                    price_tier="$$" if mult > 1 else "$",
                    estimated_cost_per_person=round(18.0 * mult, 2),
                    recommendation_reason="Beloved by locals for scratch-made seasonal dishes and warm hospitality.",
                    signature_dish="Chef's seasonal market special",
                    neighborhood="Historic District"
                ),
                DiningSpot(
                    meal="dinner",
                    name=f"La Terrace {prefs.destination}",
                    cuisine="Contemporary Farm-to-Table",
                    price_tier="$$$" if mult >= 2 else "$$",
                    estimated_cost_per_person=round(35.0 * mult, 2),
                    recommendation_reason="Ambient setting with panoramic views, perfect for discussing the day's memories.",
                    signature_dish="Grilled regional specialty with artisanal sides",
                    neighborhood="Waterfront / Viewpoint"
                )
            ]

            # Accommodation
            nightly_cost = round((90.0 if prefs.budget_level == "budget" else 180.0 if prefs.budget_level == "moderate" else 360.0) * (1.2 if prefs.group_size > 2 else 1.0), 2)
            acc = Accommodation(
                name=f"The Grand {prefs.destination} Suites" if prefs.budget_level == "luxury" else f"Boutique Haven {prefs.destination}",
                type=prefs.accommodation_type.replace("_", " ").title(),
                neighborhood="Central District",
                estimated_cost_per_night=nightly_cost,
                highlight_features=["Complimentary artisan breakfast", "High-speed Wi-Fi & workspace", "Walk to main transit"],
                suitability_reason=f"Selected for comfort, location, and optimal value for {prefs.traveler_type} travelers."
            ) if day_num < num_days else None

            days_list.append(
                DailyItinerary(
                    day_number=day_num,
                    date=cur_date,
                    title=f"Day {day_num}: Discovering {prefs.destination}'s Wonders",
                    summary=f"A thoughtfully balanced day combining {', '.join(prefs.interests[:3])} with scenic downtime.",
                    activities=activities,
                    dining=dining,
                    accommodation=acc,
                    transportation_advice=f"Use the city metro pass or walking paths; {prefs.destination} is very pedestrian-friendly.",
                    estimated_day_cost=round(sum(a.estimated_cost for a in activities) + sum(d.estimated_cost_per_person for d in dining) + (nightly_cost if acc else 0), 2),
                    weather_forecast_hint="Mild, mostly sunny, 21°C (70°F)"
                )
            )

        costs = self._calculate_costs(days_list, prefs)

        # Smart packing list
        packing = [
            f"Weather-appropriate clothing for {prefs.destination} (breathable layers)",
            "Comfortable, broken-in walking shoes or sneakers",
            "Universal power plug adapter & high-capacity portable charger",
            "Compact daypack for daily excursions and water bottle",
            "Copies of travel documents, reservations, and offline maps"
        ]
        if "wellness" in prefs.interests or "nature" in prefs.interests:
            packing.append("Swimwear, quick-dry towel, and eco-friendly sunscreen")

        advisory = (
            dest_info.get("advisory") if dest_info else
            f"Reserve tickets in advance for top museums and transit passes in {prefs.destination} to skip ticket queues."
        )

        return TripItinerary(
            id=trip_id,
            title=f"{prefs.destination} {num_days}-Day {badge}",
            destination=prefs.destination,
            created_at=datetime.utcnow().isoformat() + "Z",
            updated_at=datetime.utcnow().isoformat() + "Z",
            scenario_badge=badge,
            preferences=prefs,
            days=days_list,
            cost_breakdown=costs,
            packing_suggestions=packing,
            travel_advisory=advisory
        )


    def _gemini_generate_json(self, prompt: str) -> Dict[str, Any]:
        """Call Gemini's REST API and parse its JSON response safely."""
        import requests
        import time

        if not self.gemini_key:
            raise RuntimeError("GEMINI_API_KEY is not configured")

        model = self.gemini_model or "gemini-3.8-flash"
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/"
            f"models/{model}:generateContent"
        )
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self.gemini_key,
        }
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.3,
                "maxOutputTokens": 8192,
            },
        }

        # Retry temporary Gemini API errors before using the local fallback.
        response = None
        max_attempts = 3

        for attempt in range(max_attempts):
            try:
                response = requests.post(
                    url,
                    headers=headers,
                    json=payload,
                    timeout=(5.0, 45.0),
                )

                if response.status_code not in (
                    408, 429, 500, 502, 503, 504
                ):
                    break

                if attempt < max_attempts - 1:
                    wait_seconds = 2 ** (attempt + 2)
                    logger.warning(
                        "Gemini returned HTTP %s. Retrying in %s seconds "
                        "(attempt %s/%s).",
                        response.status_code,
                        wait_seconds,
                        attempt + 1,
                        max_attempts,
                    )
                    time.sleep(wait_seconds)

            except requests.RequestException:
                if attempt == max_attempts - 1:
                    raise

                wait_seconds = 2 ** (attempt + 2)
                logger.warning(
                    "Gemini request failed. Retrying in %s seconds "
                    "(attempt %s/%s).",
                    wait_seconds,
                    attempt + 1,
                    max_attempts,
                )
                time.sleep(wait_seconds)

        if response is None or response.status_code != 200:
            status = (
                response.status_code
                if response is not None
                else "unknown"
            )
            detail = (
                " ".join(response.text.split())[:300]
                if response is not None
                else "No response received"
            )
            raise RuntimeError(
                f"Gemini API returned HTTP {status}: {detail}"
            )

        body = response.json()
        candidates = body.get("candidates") or []

        if not candidates:
            raise ValueError("Gemini returned no candidates")

        parts = candidates[0].get("content", {}).get("parts", [])
        text = "".join(
            part.get("text", "") for part in parts
        ).strip()

        if not text:
            raise ValueError("Gemini returned an empty response")

        if text.startswith("```"):
            text = (
                text.removeprefix("```json")
                .removeprefix("```")
                .removesuffix("```")
                .strip()
            )

        parsed = json.loads(text)

        if not isinstance(parsed, dict):
            raise ValueError("Gemini response must be a JSON object")

        return parsed

    def _generate_with_gemini(self, prefs: TripPreferences, num_days: int, trip_id: str) -> Optional[TripItinerary]:
        """Generate a structured itinerary with Gemini and validate it with Pydantic."""
        prompt = f'''You are a careful travel-planning assistant. Create a practical {num_days}-day itinerary for {prefs.destination}.
Trip dates: {prefs.start_date} through {prefs.end_date}. Origin: {prefs.origin or "not specified"}.
Traveler type: {prefs.traveler_type}; group size: {prefs.group_size}.
Budget: {prefs.budget_total if prefs.budget_total is not None else "flexible"} {prefs.currency}; budget level: {prefs.budget_level}.
Pace: {prefs.pace}. Interests: {", ".join(prefs.interests)}.
Accommodation preference: {prefs.accommodation_type}.
Dietary requirements: {prefs.dietary_requirements or "none specified"}.
Accessibility requirements: {prefs.accessibility_notes or "none specified"}.
Additional requests: {prefs.additional_notes or "none specified"}.

Return ONLY valid JSON with this structure:
{{
  "title": "Trip title", "travel_advisory": "General advice; do not claim bookings are made", "packing_suggestions": ["item"],
  "days": [{{
    "day_number": 1, "date": "YYYY-MM-DD", "title": "Day theme", "summary": "Short summary",
    "transportation_advice": "Suggested transport; avoid invented exact travel times",
    "weather_forecast_hint": "Check a current forecast before travel; no live weather data is provided",
    "accommodation": {{"name":"Suggested accommodation or type","type":"{prefs.accommodation_type}","neighborhood":"Area","estimated_cost_per_night":100,"highlight_features":["feature"],"suitability_reason":"Why it suits the preferences"}},
    "activities": [{{"id":"act-1","time_slot":"morning","time_label":"09:00 AM - 11:00 AM","title":"Activity","category":"sightseeing","description":"Description","insider_tip":"Tip if known","estimated_duration":"2 hours","estimated_cost":10,"location_name":"Place or area","latitude":null,"longitude":null,"rating":null,"booking_required":false}}],
    "dining": [{{"meal":"lunch","name":"Suggested restaurant or dining area","cuisine":"Cuisine","price_tier":"$$","estimated_cost_per_person":15,"recommendation_reason":"Why it suits the user","signature_dish":"Optional dish","neighborhood":"Area"}}]
  }}]
}}
Rules: produce exactly {num_days} days numbered 1..{num_days}, dates in order starting {prefs.start_date}; costs must be non-negative estimates in {prefs.currency}; do not claim bookings, ratings, opening hours, weather, availability, or routes are verified; use null for unknown coordinates/ratings; no markdown fences or text outside JSON.
'''
        parsed = self._gemini_generate_json(prompt)
        raw_days = parsed.get("days")
        if not isinstance(raw_days, list) or len(raw_days) != num_days:
            raise ValueError(f"Gemini returned {len(raw_days) if isinstance(raw_days, list) else 0} days; expected {num_days}")

        days: List[DailyItinerary] = []
        for index, raw_day in enumerate(raw_days, start=1):
            if not isinstance(raw_day, dict):
                raise ValueError("Gemini returned an invalid day object")
            acts = []
            for j, raw_activity in enumerate(raw_day.get("activities") or [], start=1):
                item = dict(raw_activity)
                item.setdefault("id", f"act-{index}-{j}-{uuid.uuid4().hex[:5]}")
                item.setdefault("time_slot", "afternoon")
                item.setdefault("time_label", "Time to be confirmed")
                item.setdefault("title", "Suggested activity")
                item.setdefault("category", "sightseeing")
                item.setdefault("description", "Suggested activity; verify details before travel.")
                item.setdefault("location_name", prefs.destination)
                item.setdefault("estimated_duration", "2 hours")
                item.setdefault("estimated_cost", 0.0)
                item.setdefault("rating", None)
                acts.append(Activity(**item))
            dining = []
            for raw_dining in (raw_day.get("dining") or []):
                item = dict(raw_dining)
                item.setdefault("meal", "lunch")
                item.setdefault("name", "Local dining option")
                item.setdefault("cuisine", "Local cuisine")
                item.setdefault("price_tier", "$$")
                item.setdefault("estimated_cost_per_person", 0.0)
                item.setdefault("recommendation_reason", "Suggested option; verify current details.")
                item.setdefault("neighborhood", prefs.destination)
                dining.append(DiningSpot(**item))
            acc_data = raw_day.get("accommodation")
            accommodation = Accommodation(**acc_data) if isinstance(acc_data, dict) else None
            day_date = (datetime.strptime(prefs.start_date, "%Y-%m-%d") + timedelta(days=index - 1)).strftime("%Y-%m-%d")
            days.append(DailyItinerary(
                day_number=index, date=day_date, title=str(raw_day.get("title") or f"Day {index}"),
                summary=str(raw_day.get("summary") or "Personalized day plan"), activities=acts, dining=dining,
                accommodation=accommodation,
                transportation_advice=str(raw_day.get("transportation_advice") or "Check local transit options before departure."),
                estimated_day_cost=0.0, weather_forecast_hint=raw_day.get("weather_forecast_hint"),
            ))

        costs = self._calculate_costs(days, prefs)
        for day in days:
            day.estimated_day_cost = round(
                sum(a.estimated_cost * prefs.group_size for a in day.activities)
                + sum(d.estimated_cost_per_person * prefs.group_size for d in day.dining)
                + (day.accommodation.estimated_cost_per_night if day.accommodation else 0)
                + 15.0 * prefs.group_size, 2,
            )
        return TripItinerary(
            id=trip_id, title=str(parsed.get("title") or f"{prefs.destination} Trip"), destination=prefs.destination,
            created_at=datetime.utcnow().isoformat() + "Z", updated_at=datetime.utcnow().isoformat() + "Z",
            scenario_badge=f"{prefs.traveler_type.capitalize()} Plan", preferences=prefs, days=days,
            cost_breakdown=costs,
            packing_suggestions=[str(x) for x in (parsed.get("packing_suggestions") or []) if isinstance(x, str)],
            travel_advisory=str(parsed.get("travel_advisory") or "Confirm opening hours, prices, and booking requirements before travel."),
        )

    def _regenerate_day_with_gemini(self, current_trip: TripItinerary, req: RegenerateDayRequest, target_day: DailyItinerary) -> TripItinerary:
        """Regenerate one day with Gemini while leaving all other days untouched."""
        prefs = current_trip.preferences
        focus = req.focus_interests or prefs.interests
        pace = req.change_pace or prefs.pace
        prompt = f'''Revise ONE day of a travel itinerary. Return ONLY valid JSON.
Destination: {current_trip.destination}. Date: {target_day.date}. Day number: {target_day.day_number}.
Traveler type: {prefs.traveler_type}; group size: {prefs.group_size}; currency: {prefs.currency}; budget level: {prefs.budget_level}; pace: {pace}.
Interests: {", ".join(focus)}. Dietary requirements: {prefs.dietary_requirements or "none"}.
Accessibility notes: {prefs.accessibility_notes or "none"}.
User requested changes: {req.refinement_notes}
Current day summary: {target_day.summary}
Current activities: {json.dumps([a.model_dump() for a in target_day.activities], ensure_ascii=False)}
Current dining: {json.dumps([d.model_dump() for d in target_day.dining], ensure_ascii=False)}

Return schema: {{"title":"Day title","summary":"Day summary","transportation_advice":"Advice","weather_forecast_hint":"Forecast caveat if no live data","activities":[{{"id":"act-1","time_slot":"morning","time_label":"09:00 AM - 11:00 AM","title":"Activity","category":"sightseeing","description":"Description","insider_tip":"Tip","estimated_duration":"2 hours","estimated_cost":10,"location_name":"Place or area","latitude":null,"longitude":null,"rating":null,"booking_required":false}}],"dining":[{{"meal":"lunch","name":"Dining option","cuisine":"Cuisine","price_tier":"$$","estimated_cost_per_person":15,"recommendation_reason":"Reason","signature_dish":"Optional dish","neighborhood":"Area"}}]}}
Rules: suggestions must be plausible; do not claim bookings or live facts are verified; costs are estimates in {prefs.currency}; use null for unknown coordinates/ratings; fit the requested pace and interests.
'''
        parsed = self._gemini_generate_json(prompt)
        activities = []
        for raw in (parsed.get("activities") or []):
            item = dict(raw)
            item.setdefault("id", f"act-regen-{uuid.uuid4().hex[:6]}")
            item.setdefault("time_slot", "afternoon")
            item.setdefault("time_label", "Time to be confirmed")
            item.setdefault("title", "Suggested activity")
            item.setdefault("category", "sightseeing")
            item.setdefault("description", "Suggested activity; verify details before travel.")
            item.setdefault("location_name", current_trip.destination)
            item.setdefault("estimated_duration", "2 hours")
            item.setdefault("estimated_cost", 0.0)
            item.setdefault("rating", None)
            activities.append(Activity(**item))
        dining = []
        for raw in (parsed.get("dining") or []):
            item = dict(raw)
            item.setdefault("meal", "lunch")
            item.setdefault("name", "Local dining option")
            item.setdefault("cuisine", "Local cuisine")
            item.setdefault("price_tier", "$$")
            item.setdefault("estimated_cost_per_person", 0.0)
            item.setdefault("recommendation_reason", "Suggested option; verify current details.")
            item.setdefault("neighborhood", current_trip.destination)
            dining.append(DiningSpot(**item))
        target_day.title = str(parsed.get("title") or f"Day {target_day.day_number}")
        target_day.summary = str(parsed.get("summary") or "Updated personalized day plan")
        target_day.activities = activities
        target_day.dining = dining
        target_day.transportation_advice = str(parsed.get("transportation_advice") or target_day.transportation_advice)
        target_day.weather_forecast_hint = parsed.get("weather_forecast_hint") or target_day.weather_forecast_hint
        target_day.estimated_day_cost = round(
            sum(a.estimated_cost * prefs.group_size for a in activities)
            + sum(d.estimated_cost_per_person * prefs.group_size for d in dining)
            + (target_day.accommodation.estimated_cost_per_night if target_day.accommodation else 0)
            + 15.0 * prefs.group_size, 2,
        )
        current_trip.cost_breakdown = self._calculate_costs(current_trip.days, prefs)
        current_trip.updated_at = datetime.utcnow().isoformat() + "Z"
        return current_trip


ai_service = AIGeneratorService()
