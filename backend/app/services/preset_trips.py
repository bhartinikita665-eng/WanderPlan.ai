import uuid
from typing import List, Dict, Any
from app.models import TripItinerary, DailyItinerary, Activity, DiningSpot, Accommodation, TripCostBreakdown, TripPreferences

PRESET_TRIPS: List[Dict[str, Any]] = [
    {
        "id": "preset-solo-weekend-kyoto",
        "title": "Solo Weekend: Kyoto Cultural & Culinary Quest",
        "destination": "Kyoto, Japan",
        "created_at": "2026-10-18T10:00:00Z",
        "updated_at": "2026-10-18T10:00:00Z",
        "scenario_badge": "Solo Weekend Getaway",
        "preferences": {
            "destination": "Kyoto, Japan",
            "origin": "Tokyo",
            "start_date": "2026-11-06",
            "end_date": "2026-11-08",
            "traveler_type": "solo",
            "group_size": 1,
            "budget_level": "budget",
            "budget_total": 420.0,
            "currency": "USD",
            "pace": "balanced",
            "interests": ["sightseeing", "food", "photography", "culture"],
            "accommodation_type": "boutique",
            "dietary_requirements": "None (Eats local street food & ramen)",
            "accessibility_notes": "Lots of walking; good pedestrian routes",
            "additional_notes": "Solo-friendly noodle bars and quiet morning photography spots"
        },
        "cost_breakdown": {
            "total_estimated_cost": 385.0,
            "accommodation_total": 160.0,
            "dining_total": 125.0,
            "activities_total": 60.0,
            "local_transit_total": 40.0,
            "currency": "USD",
            "per_person_cost": 385.0,
            "budget_status": "under_budget"
        },
        "packing_suggestions": [
            "Comfortable slip-on walking shoes (temples require shoe removal)",
            "Light rain jacket / compact umbrella",
            "Portable power bank for navigation & photography",
            "ICOCA / Suica transit card or cash for local shrines"
        ],
        "travel_advisory": "Kyoto's bus network is comprehensive, but early mornings (before 8 AM) at Fushimi Inari and Arashiyama provide virtually crowd-free photography.",
        "days": [
            {
                "day_number": 1,
                "date": "2026-11-06",
                "title": "Historic Higashiyama & Gion Night Walk",
                "summary": "Arrive in Kyoto, check into your stylish boutique hostel, and explore cobblestone alleys, ancient wooden machiya houses, and lantern-lit dining.",
                "estimated_day_cost": 130.0,
                "transportation_advice": "Purchase a 1-day Subway & Bus Pass ($7.50) from Kyoto Station info center.",
                "weather_forecast_hint": "Clear autumn skies, 18°C (64°F)",
                "accommodation": {
                    "name": "Len Kyoto Kawaramachi Hostel & Cafe",
                    "type": "Boutique Design Hostel",
                    "neighborhood": "Kawaramachi",
                    "estimated_cost_per_night": 80.0,
                    "highlight_features": ["Specialty craft coffee lounge", "Individual pod privacy curtains", "Central walking distance"],
                    "suitability_reason": "Ideal for solo travelers seeking quiet comfort, great espresso, and central transit connections."
                },
                "activities": [
                    {
                        "id": "act-101",
                        "time_slot": "morning",
                        "time_label": "10:30 AM - 12:30 PM",
                        "title": "Kiyomizu-dera Wooden Stage & Otowa Waterfall",
                        "category": "sightseeing",
                        "description": "Climb through historic Sannenzaka alley to Kyoto's iconic hillside temple, offering sweeping views of the city foliage.",
                        "insider_tip": "Drink from one of the three streams of Otowa Waterfall for health, longevity, or success in studies.",
                        "estimated_duration": "2 hours",
                        "estimated_cost": 4.0,
                        "location_name": "Kiyomizu-dera",
                        "latitude": 34.9948,
                        "longitude": 135.7850,
                        "rating": 4.8,
                        "booking_required": False
                    },
                    {
                        "id": "act-102",
                        "time_slot": "afternoon",
                        "time_label": "02:00 PM - 04:30 PM",
                        "title": "Ninenzaka Tea House & Kodai-ji Zen Garden",
                        "category": "culture",
                        "description": "Stroll down preserved cobblestone streets and explore the tranquil rock gardens and bamboo grove at Kodai-ji Temple.",
                        "insider_tip": "Visit the tatami-matted Starbucks in a 100-year-old traditional townhouse along Ninenzaka.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 8.0,
                        "location_name": "Ninenzaka & Kodai-ji",
                        "latitude": 35.0003,
                        "longitude": 135.7806,
                        "rating": 4.7,
                        "booking_required": False
                    },
                    {
                        "id": "act-103",
                        "time_slot": "evening",
                        "time_label": "06:30 PM - 08:30 PM",
                        "title": "Gion Shirakawa Lantern Walk & Solo Dining",
                        "category": "leisure",
                        "description": "Atmospheric evening stroll alongside the canal willows in Gion, observing illuminated tea houses and traditional geiko districts.",
                        "insider_tip": "Solo diners are warmly welcomed at local counter-service noodle spots.",
                        "estimated_duration": "2 hours",
                        "estimated_cost": 0.0,
                        "location_name": "Shirakawa Canal, Gion",
                        "latitude": 35.0055,
                        "longitude": 135.7745,
                        "rating": 4.9,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Omen Kodai-ji Udon",
                        "cuisine": "Traditional Udon & Tempura",
                        "price_tier": "$",
                        "estimated_cost_per_person": 14.0,
                        "recommendation_reason": "Handcrafted thick noodles served with seasonal Kyoto vegetables and fragrant sesame seeds.",
                        "signature_dish": "Cold Udon with Autumn vegetable tempura",
                        "neighborhood": "Higashiyama"
                    },
                    {
                        "meal": "dinner",
                        "name": "Gyoza ChaoChao Sanjo",
                        "cuisine": "Crispy Gyoza Bar",
                        "price_tier": "$",
                        "estimated_cost_per_person": 18.0,
                        "recommendation_reason": "Casual counter seating where solo visitors enjoy crispy sheet gyoza and draft beer.",
                        "signature_dish": "Crispy ChaoChao Gyoza with ginger dip",
                        "neighborhood": "Kawaramachi"
                    }
                ]
            },
            {
                "day_number": 2,
                "date": "2026-11-07",
                "title": "Sunrise Torii Gates & Arashiyama Bamboo Grove",
                "summary": "Beat the morning crowds at Fushimi Inari's thousand red gates, followed by Arashiyama's peaceful bamboo forests and monkey park.",
                "estimated_day_cost": 135.0,
                "transportation_advice": "Take the JR Nara Line from Kyoto Station to Inari (5 mins), then JR San-in line to Saga-Arashiyama.",
                "weather_forecast_hint": "Sunny with light breeze, 19°C (66°F)",
                "accommodation": {
                    "name": "Len Kyoto Kawaramachi Hostel & Cafe",
                    "type": "Boutique Design Hostel",
                    "neighborhood": "Kawaramachi",
                    "estimated_cost_per_night": 80.0,
                    "highlight_features": ["Barista breakfast", "Luggage lockers", "Bicycle rental available"],
                    "suitability_reason": "Seamless base for an active solo weekend."
                },
                "activities": [
                    {
                        "id": "act-201",
                        "time_slot": "morning",
                        "time_label": "07:00 AM - 09:30 AM",
                        "title": "Fushimi Inari Taisha Early Morning Ascent",
                        "category": "sightseeing",
                        "description": "Hike up Mount Inari through mystical corridors of thousands of vivid vermilion torii gates in serene early morning light.",
                        "insider_tip": "Climb past the Yotsutsuji intersection halfway up for the best view of Kyoto basin without crowds.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 0.0,
                        "location_name": "Fushimi Inari Taisha",
                        "latitude": 34.9671,
                        "longitude": 135.7727,
                        "rating": 4.9,
                        "booking_required": False
                    },
                    {
                        "id": "act-202",
                        "time_slot": "afternoon",
                        "time_label": "12:00 PM - 03:00 PM",
                        "title": "Arashiyama Bamboo Grove & Tenryu-ji Zen Temple",
                        "category": "nature",
                        "description": "Walk amidst towering green bamboo stalks and tour the UNESCO world heritage garden reflecting in Sogenchi Pond.",
                        "insider_tip": "Exit the grove into the tranquil gardens of Okochi Sanso Villa for complimentary green tea and wafer.",
                        "estimated_duration": "3 hours",
                        "estimated_cost": 10.0,
                        "location_name": "Arashiyama Bamboo Grove",
                        "latitude": 35.0170,
                        "longitude": 135.6713,
                        "rating": 4.8,
                        "booking_required": False
                    },
                    {
                        "id": "act-203",
                        "time_slot": "evening",
                        "time_label": "06:00 PM - 08:30 PM",
                        "title": "Pontocho Alley Tasting & Kamogawa River Stroll",
                        "category": "dining",
                        "description": "Wander the narrow pedestrian corridor of Pontocho and sit by the Kamogawa River bank like a true local.",
                        "insider_tip": "Look for small red noren curtains indicating intimate counter dining.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 25.0,
                        "location_name": "Pontocho Alley",
                        "latitude": 35.0062,
                        "longitude": 135.7712,
                        "rating": 4.8,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Taisho Hanana",
                        "cuisine": "Sea Bream Chazuke",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 22.0,
                        "recommendation_reason": "Famous 3-step sea bream sashimi dish eaten first with sesame sauce, then with rice, then as green tea broth.",
                        "signature_dish": "Tai Chazuke Set",
                        "neighborhood": "Arashiyama"
                    },
                    {
                        "meal": "dinner",
                        "name": "Katsukura Sanjo Main Store",
                        "cuisine": "Tonkatsu (Crispy Pork Cutlet)",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 20.0,
                        "recommendation_reason": "Fluffy, golden panko cutlet with refillable shredded cabbage and barley rice.",
                        "signature_dish": "Hirekatsu tenderloin set",
                        "neighborhood": "Sanjo"
                    }
                ]
            },
            {
                "day_number": 3,
                "date": "2026-11-08",
                "title": "Nishiki Market Feast & Philosophers Path",
                "summary": "Taste street snacks at 'Kyoto's Kitchen', stroll the scenic canal path of Philosopher's Walk, and pick up unique artisan souvenirs.",
                "estimated_day_cost": 120.0,
                "transportation_advice": "Kyoto city bus #206 or bike rental to ride alongside the canal.",
                "weather_forecast_hint": "Partly cloudy, 17°C (63°F)",
                "accommodation": None,
                "activities": [
                    {
                        "id": "act-301",
                        "time_slot": "morning",
                        "time_label": "09:30 AM - 11:30 AM",
                        "title": "Nishiki Market Culinary Exploration",
                        "category": "dining",
                        "description": "Five-block shopping street bustling with over a hundred food stalls offering skewered seafood, matcha sweets, and pickles.",
                        "insider_tip": "Eat snacks at the stall where purchased, as walking while eating is discouraged.",
                        "estimated_duration": "2 hours",
                        "estimated_cost": 15.0,
                        "location_name": "Nishiki Market",
                        "latitude": 35.0050,
                        "longitude": 135.7649,
                        "rating": 4.6,
                        "booking_required": False
                    },
                    {
                        "id": "act-302",
                        "time_slot": "afternoon",
                        "time_label": "01:00 PM - 03:30 PM",
                        "title": "Philosopher's Path & Ginkaku-ji (Silver Pavilion)",
                        "category": "culture",
                        "description": "Reflective 2-kilometer stone path along a cherry-tree lined canal leading to the minimalist zen gardens of the Silver Pavilion.",
                        "insider_tip": "Stop by charming independent ceramics and pottery shops tucked along the canal side.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 5.0,
                        "location_name": "Philosopher's Path",
                        "latitude": 35.0272,
                        "longitude": 135.7982,
                        "rating": 4.7,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Nishiki Warai",
                        "cuisine": "Kyoto-style Okonomiyaki",
                        "price_tier": "$",
                        "estimated_cost_per_person": 12.0,
                        "recommendation_reason": "Savory cabbage pancake made with fresh Kyoto mountain yam and soft omelet topping.",
                        "signature_dish": "Warai-yaki with pork and scallions",
                        "neighborhood": "Nishiki"
                    }
                ]
            }
        ]
    },
    {
        "id": "preset-couple-romantic-amalfi",
        "title": "Romantic Escape: Amalfi Coast Scenic Cliffs & Boutique Villas",
        "destination": "Amalfi Coast, Italy",
        "created_at": "2026-10-18T11:00:00Z",
        "updated_at": "2026-10-18T11:00:00Z",
        "scenario_badge": "Couple Romantic Vacation",
        "preferences": {
            "destination": "Amalfi Coast, Italy",
            "origin": "Rome Fiumicino",
            "start_date": "2026-05-12",
            "end_date": "2026-05-16",
            "traveler_type": "couple",
            "group_size": 2,
            "budget_level": "luxury",
            "budget_total": 3400.0,
            "currency": "EUR",
            "pace": "relaxed",
            "interests": ["sightseeing", "food", "wellness", "photography", "culture"],
            "accommodation_type": "boutique",
            "dietary_requirements": "Vegetarian friendly options & fine local wines",
            "accessibility_notes": "Private transfers arranged to avoid steep luggage stair climbing",
            "additional_notes": "Romantic sunset dinner reservations, cliffside cocktail terraces, and leisurely pacing."
        },
        "cost_breakdown": {
            "total_estimated_cost": 2980.0,
            "accommodation_total": 1520.0,
            "dining_total": 780.0,
            "activities_total": 430.0,
            "local_transit_total": 250.0,
            "currency": "EUR",
            "per_person_cost": 1490.0,
            "budget_status": "under_budget"
        },
        "packing_suggestions": [
            "Linen shirts and flowing sundresses for evening aperitivos",
            "Comfortable rubber-soled deck shoes for boat charters and stone walkways",
            "High-SPF sunscreen and polarized sunglasses for the Mediterranean glare",
            "Light evening shawl for cliffside sea breezes"
        ],
        "travel_advisory": "Ferries between Positano, Amalfi, and Capri are faster and much more scenic than winding coastal buses.",
        "days": [
            {
                "day_number": 1,
                "date": "2026-05-12",
                "title": "Arrival in Cliffside Positano & Sunset Bellini",
                "summary": "Check into your Mediterranean boutique villa overlooking Positano bay, unwind on your private sea-view balcony, and enjoy sunset spritzes.",
                "estimated_day_cost": 620.0,
                "transportation_advice": "Private Mercedes sedan transfer from Naples Central Station directly to your hotel entrance.",
                "weather_forecast_hint": "Breezy sunshine, 24°C (75°F)",
                "accommodation": {
                    "name": "Hotel Villa Franca Positano",
                    "type": "5-Star Boutique Luxury Hotel",
                    "neighborhood": "Upper Positano Cliffs",
                    "estimated_cost_per_night": 380.0,
                    "highlight_features": ["Rooftop infinity pool with 360° bay view", "Michelin-recommended Li Galli restaurant", "Complimentary town shuttle"],
                    "suitability_reason": "Intimate haven of quiet romance away from the crowded harbor."
                },
                "activities": [
                    {
                        "id": "act-amalfi-101",
                        "time_slot": "afternoon",
                        "time_label": "03:30 PM - 05:30 PM",
                        "title": "Private Villa Balcony Unwind & Limoncello Welcome",
                        "category": "leisure",
                        "description": "Sip chilled house-made limoncello while soaking in the pastel cascade of houses descending into the azure Tyrrhenian Sea.",
                        "insider_tip": "Schedule a couples massage on the rooftop deck before dinner.",
                        "estimated_duration": "2 hours",
                        "estimated_cost": 0.0,
                        "location_name": "Hotel Villa Franca",
                        "latitude": 40.6300,
                        "longitude": 14.4845,
                        "rating": 4.9,
                        "booking_required": False
                    },
                    {
                        "id": "act-amalfi-102",
                        "time_slot": "evening",
                        "time_label": "06:30 PM - 08:00 PM",
                        "title": "Franco's Bar Sunset Aperitivo",
                        "category": "nightlife",
                        "description": "Iconic al fresco champagne and cocktail terrace perched high above the coast with contemporary pop art and sunset vistas.",
                        "insider_tip": "Arrive 30 minutes before opening (5:00 PM) to secure the frontline banquette overlooking the sea.",
                        "estimated_duration": "1.5 hours",
                        "estimated_cost": 70.0,
                        "location_name": "Franco's Bar Positano",
                        "latitude": 40.6288,
                        "longitude": 14.4862,
                        "rating": 4.8,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "dinner",
                        "name": "Ristorante Max Positano",
                        "cuisine": "Art & Candlelight Campania Dining",
                        "price_tier": "$$$",
                        "estimated_cost_per_person": 85.0,
                        "recommendation_reason": "Dine inside an art gallery courtyard surrounded by ancient paintings and lemon trees.",
                        "signature_dish": "Handmade scialatielli with fresh lobster & cherry tomatoes",
                        "neighborhood": "Centro Storico Positano"
                    }
                ]
            },
            {
                "day_number": 2,
                "date": "2026-05-13",
                "title": "Private Wooden Gozzo Boat Charter to Capri",
                "summary": "Cruise along dramatic limestone cliffs, swim into glowing sea grottos, and anchor in secluded coves with prosecco on ice.",
                "estimated_day_cost": 780.0,
                "transportation_advice": "Private skipper aboard a classic 32ft Apreamare boat departing from Positano Marina.",
                "weather_forecast_hint": "Calm crystalline waters, 26°C (79°F)",
                "accommodation": {
                    "name": "Hotel Villa Franca Positano",
                    "type": "5-Star Boutique Luxury Hotel",
                    "neighborhood": "Upper Positano Cliffs",
                    "estimated_cost_per_night": 380.0,
                    "highlight_features": ["Heated infinity pool", "Luxury organic toiletries"],
                    "suitability_reason": "Serene retreat after a sun-soaked day on the water."
                },
                "activities": [
                    {
                        "id": "act-amalfi-201",
                        "time_slot": "morning",
                        "time_label": "10:00 AM - 02:00 PM",
                        "title": "Private Coastal Boat Cruise & Faraglioni Rocks",
                        "category": "nature",
                        "description": "Glide through the natural archway of the legendary Faraglioni rocks and anchor in White and Green Grottos for snorkeling.",
                        "insider_tip": "Tradition says kissing your partner under the Faraglioni arch brings lifelong romance.",
                        "estimated_duration": "4 hours",
                        "estimated_cost": 280.0,
                        "location_name": "Faraglioni Rocks, Capri",
                        "latitude": 40.5422,
                        "longitude": 14.2505,
                        "rating": 5.0,
                        "booking_required": True
                    },
                    {
                        "id": "act-amalfi-202",
                        "time_slot": "afternoon",
                        "time_label": "02:30 PM - 05:00 PM",
                        "title": "Anacapri Gardens & Villa San Michele",
                        "category": "culture",
                        "description": "Ascend to high Anacapri to wander Axel Munthe's dream villa, filled with roman sculptures and panoramic pergola walks.",
                        "insider_tip": "Touch the ancient granite sphinx gazing out across the Mediterranean horizon.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 20.0,
                        "location_name": "Villa San Michele, Anacapri",
                        "latitude": 40.5562,
                        "longitude": 14.2255,
                        "rating": 4.9,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "La Fontelina Capri",
                        "cuisine": "Seafood by the Rocks",
                        "price_tier": "$$$",
                        "estimated_cost_per_person": 95.0,
                        "recommendation_reason": "World-famous beach club restaurant under straw pergolas facing the giant Faraglioni pinnacles.",
                        "signature_dish": "Spaghetti alle Vongole and White Sangria with peaches",
                        "neighborhood": "Faraglioni Bay"
                    },
                    {
                        "meal": "dinner",
                        "name": "Da Vincenzo Positano",
                        "cuisine": "Warm Family Haute Cuisine",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 65.0,
                        "recommendation_reason": "Michelin Bib Gourmand gem carved right into the roadside rock face.",
                        "signature_dish": "Braised beef ragù paccheri pasta",
                        "neighborhood": "Via Pasitea"
                    }
                ]
            },
            {
                "day_number": 3,
                "date": "2026-05-14",
                "title": "Ravello's Clifftop Gardens & Classical Melodies",
                "summary": "Travel up to fairytale Ravello, walk through Villa Cimbrone's Terrace of Infinity, and enjoy a secluded wine tasting overlooking vineyards.",
                "estimated_day_cost": 590.0,
                "transportation_advice": "Private boat to Amalfi town, followed by private chauffeur up the mountain road to Ravello.",
                "weather_forecast_hint": "Pleasant mountain air, 23°C (73°F)",
                "accommodation": {
                    "name": "Hotel Villa Franca Positano",
                    "type": "5-Star Boutique Luxury Hotel",
                    "neighborhood": "Upper Positano Cliffs",
                    "estimated_cost_per_night": 380.0,
                    "highlight_features": ["Unobstructed sunset terrace", "Exceptional concierge"],
                    "suitability_reason": "Consistent luxury base for coastal excursions."
                },
                "activities": [
                    {
                        "id": "act-amalfi-301",
                        "time_slot": "morning",
                        "time_label": "10:30 AM - 01:00 PM",
                        "title": "Villa Cimbrone 'Terrace of Infinity'",
                        "category": "sightseeing",
                        "description": "Stand among Roman marble bust statues overlooking a 1,200-foot drop into the turquoise sea, where sky and water merge.",
                        "insider_tip": "The rose gardens adjacent to the terrace are peak bloom in May.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 15.0,
                        "location_name": "Villa Cimbrone, Ravello",
                        "latitude": 40.6445,
                        "longitude": 14.6117,
                        "rating": 5.0,
                        "booking_required": False
                    },
                    {
                        "id": "act-amalfi-302",
                        "time_slot": "afternoon",
                        "time_label": "03:00 PM - 05:30 PM",
                        "title": "Organic Clifftop Wine Tasting at Marisa Cuomo",
                        "category": "dining",
                        "description": "Tour vertical terraced vineyards clinging to the cliffs of Furore and sample award-winning Fiorduva white wine.",
                        "insider_tip": "Vineyards are harvested solely by hand using traditional stone pulleys.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 90.0,
                        "location_name": "Cantine Marisa Cuomo, Furore",
                        "latitude": 40.6219,
                        "longitude": 14.5492,
                        "rating": 4.9,
                        "booking_required": True
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Cumpa' Cosimo Ravello",
                        "cuisine": "Homestyle Nonna Kitchen",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 45.0,
                        "recommendation_reason": "Run by legendary patron Netta, serving fresh handmade pasta sampler dishes.",
                        "signature_dish": "Five-pasta tasting platter",
                        "neighborhood": "Piazza Duomo Ravello"
                    },
                    {
                        "meal": "dinner",
                        "name": "La Tagliata Montepertuso",
                        "cuisine": "Rustic Mountain Feast Over Sunset",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 55.0,
                        "recommendation_reason": "No printed menu; Mama serves multi-course grilled meats, homemade gnocchi, and endless house wine.",
                        "signature_dish": "Charcoal grilled bistecca with farm vegetables",
                        "neighborhood": "Montepertuso"
                    }
                ]
            },
            {
                "day_number": 4,
                "date": "2026-05-15",
                "title": "Path of the Gods & Candlelight Cooking Class",
                "summary": "Take a scenic gentle section of the Sentiero degli Dei, followed by an intimate couples pasta and tiramisu cooking workshop.",
                "estimated_day_cost": 530.0,
                "transportation_advice": "Chauffeur drop-off at Bomerano trailhead with meeting point in Nocelle.",
                "weather_forecast_hint": "Sunny with light mountain breeze, 22°C (72°F)",
                "accommodation": {
                    "name": "Hotel Villa Franca Positano",
                    "type": "5-Star Boutique Luxury Hotel",
                    "neighborhood": "Upper Positano Cliffs",
                    "estimated_cost_per_night": 380.0,
                    "highlight_features": ["Private jacuzzi suites available", "Champagne breakfast buffet"],
                    "suitability_reason": "Perfect ending to a romantic honeymoon or anniversary."
                },
                "activities": [
                    {
                        "id": "act-amalfi-401",
                        "time_slot": "morning",
                        "time_label": "09:00 AM - 12:00 PM",
                        "title": "Gentle Hike on the 'Path of the Gods'",
                        "category": "nature",
                        "description": "Trail suspended between sky and sea through wild rosemary and thyme groves with unobstructed views across Capri.",
                        "insider_tip": "Stop at the small lemon juice stand run by shepherds midway along the path.",
                        "estimated_duration": "3 hours",
                        "estimated_cost": 0.0,
                        "location_name": "Sentiero degli Dei, Nocelle",
                        "latitude": 40.6335,
                        "longitude": 14.5050,
                        "rating": 4.9,
                        "booking_required": False
                    },
                    {
                        "id": "act-amalfi-402",
                        "time_slot": "afternoon",
                        "time_label": "04:00 PM - 07:00 PM",
                        "title": "Couples Pasta & Tiramisù Masterclass",
                        "category": "culture",
                        "description": "Hand-knead gnocchi, roll fresh tagliatelle, and master authentic Italian espresso tiramisù overlooking lemon orchards.",
                        "insider_tip": "You dine on your handmade creations accompanied by regional DOC wines.",
                        "estimated_duration": "3 hours",
                        "estimated_cost": 150.0,
                        "location_name": "Villa Maria Kitchen, Minori",
                        "latitude": 40.6515,
                        "longitude": 14.6250,
                        "rating": 5.0,
                        "booking_required": True
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Rifugio dei Mele Nocelle",
                        "cuisine": "Gourmet Mountain Terrace",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 40.0,
                        "recommendation_reason": "Secluded panoramic dining terrace right at the trail terminus.",
                        "signature_dish": "Truffle tagliolini & artisanal cheeses",
                        "neighborhood": "Nocelle"
                    }
                ]
            }
        ]
    },
    {
        "id": "preset-group-adventure-costarica",
        "title": "Group Expedition: Costa Rica Rainforest, Volcano & Rafting",
        "destination": "Arenal & Manuel Antonio, Costa Rica",
        "created_at": "2026-10-18T12:00:00Z",
        "updated_at": "2026-10-18T12:00:00Z",
        "scenario_badge": "Small Group Multi-Day Trip",
        "preferences": {
            "destination": "Arenal Volcano & Manuel Antonio, Costa Rica",
            "origin": "San Jose (SJO)",
            "start_date": "2026-07-15",
            "end_date": "2026-07-20",
            "traveler_type": "group",
            "group_size": 5,
            "budget_level": "moderate",
            "budget_total": 4800.0,
            "currency": "USD",
            "pace": "balanced",
            "interests": ["adventure", "nature", "sightseeing", "food", "wellness"],
            "accommodation_type": "resort",
            "dietary_requirements": "Mix of meat lovers, vegetarian, and allergy safe",
            "accessibility_notes": "Active hiking and water rafting capabilities",
            "additional_notes": "Group logistics coordinated with private 12-passenger Mercedes Sprinter van."
        },
        "cost_breakdown": {
            "total_estimated_cost": 4350.0,
            "accommodation_total": 1950.0,
            "dining_total": 1100.0,
            "activities_total": 850.0,
            "local_transit_total": 450.0,
            "currency": "USD",
            "per_person_cost": 870.0,
            "budget_status": "under_budget"
        },
        "packing_suggestions": [
            "Quick-dry moisture-wicking shirts and hiking shorts",
            "Sturdy strapped water sandals (Chacos/Tevas) for rafting and canyoning",
            "Eco-friendly reef-safe bug spray and sunscreen",
            "Dry bag for smartphones during boat tours and waterfalls"
        ],
        "travel_advisory": "Renting a dedicated private group van with driver costs less per person than 5 separate shuttle tickets and eliminates luggage delays.",
        "days": [
            {
                "day_number": 1,
                "date": "2026-07-15",
                "title": "San José to Arenal & Natural Geothermal Hot Springs",
                "summary": "Private van pickup from SJO airport, scenic drive through pineapple plantations to Arenal, settling into private rainforest villas, and relaxing in thermal rivers.",
                "estimated_day_cost": 780.0,
                "transportation_advice": "Private bilingual driver with comfortable AC Sprinter van for all 5 guests.",
                "weather_forecast_hint": "Warm tropical climate with afternoon shower, 28°C (82°F)",
                "accommodation": {
                    "name": "Arenal Springs Resort & Spa Villas",
                    "type": "Eco-Luxury Thermal Resort",
                    "neighborhood": "La Fortuna, Arenal",
                    "estimated_cost_per_night": 390.0,
                    "highlight_features": ["Natural on-site mineral hot spring pools", "Direct view of Arenal Volcano cone", "Interconnected family/group suites"],
                    "suitability_reason": "Space for 5 adults with shared social patio and direct volcano views."
                },
                "activities": [
                    {
                        "id": "act-cr-101",
                        "time_slot": "afternoon",
                        "time_label": "02:30 PM - 05:00 PM",
                        "title": "Check-in & Arenal Volcano Viewpoint Lounge",
                        "category": "leisure",
                        "description": "Unpack into adjoining group villas and spot toucans and howler monkeys right from the open-air pool deck.",
                        "insider_tip": "Keep binoculars handy by the patio; sloths frequently nest in the cecropia trees.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 0.0,
                        "location_name": "Arenal Springs",
                        "latitude": 10.4908,
                        "longitude": -84.6980,
                        "rating": 4.8,
                        "booking_required": False
                    },
                    {
                        "id": "act-cr-102",
                        "time_slot": "evening",
                        "time_label": "06:00 PM - 09:00 PM",
                        "title": "EcoTermales Natural Hot Springs & Group Dinner",
                        "category": "wellness",
                        "description": "Cascading natural mineral pools of varying temperatures surrounded by lush illuminated jungle greenery.",
                        "insider_tip": "EcoTermales limits capacity to ensure a peaceful, uncrowded experience.",
                        "estimated_duration": "3 hours",
                        "estimated_cost": 50.0,
                        "location_name": "EcoTermales Hot Springs",
                        "latitude": 10.4789,
                        "longitude": -84.6733,
                        "rating": 4.9,
                        "booking_required": True
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Soda La Hormiga",
                        "cuisine": "Traditional Costa Rican 'Casados'",
                        "price_tier": "$",
                        "estimated_cost_per_person": 10.0,
                        "recommendation_reason": "Hearty platters of rice, black beans, fried plantains, grilled meats, and fresh passion fruit juice.",
                        "signature_dish": "Casado con Carne en Salsa & Yucca Fries",
                        "neighborhood": "La Fortuna Centro"
                    },
                    {
                        "meal": "dinner",
                        "name": "Don Rufino",
                        "cuisine": "Contemporary Latin Group Grill",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 35.0,
                        "recommendation_reason": "Lively social dining atmosphere with wood-fired steaks, artisanal cocktails, and vegetarian ceviches.",
                        "signature_dish": "Slow-braised coffee pork shank",
                        "neighborhood": "La Fortuna"
                    }
                ]
            },
            {
                "day_number": 2,
                "date": "2026-07-16",
                "title": "Mistico Hanging Bridges & La Fortuna Waterfall",
                "summary": "Walk through the high jungle canopy across suspension bridges with a naturalist guide, followed by a swim in crystalline waterfall pools.",
                "estimated_day_cost": 890.0,
                "transportation_advice": "Private van shuttle for group door-to-door transit.",
                "weather_forecast_hint": "Partly sunny, 27°C (80°F)",
                "accommodation": {
                    "name": "Arenal Springs Resort & Spa Villas",
                    "type": "Eco-Luxury Thermal Resort",
                    "neighborhood": "La Fortuna, Arenal",
                    "estimated_cost_per_night": 390.0,
                    "highlight_features": ["Group cocktail bar", "Swim-up wet bar"],
                    "suitability_reason": "Comfortable place to recharge after hiking."
                },
                "activities": [
                    {
                        "id": "act-cr-201",
                        "time_slot": "morning",
                        "time_label": "08:00 AM - 11:30 AM",
                        "title": "Mistico Hanging Bridges Rainforest Canopy Walk",
                        "category": "nature",
                        "description": "Traverse 16 bridges including 6 suspended 150 feet high over the canopy, spotting poison dart frogs, spider monkeys, and motmots.",
                        "insider_tip": "Booking a certified guide doubles wildlife sightings using their professional spotting scope.",
                        "estimated_duration": "3.5 hours",
                        "estimated_cost": 45.0,
                        "location_name": "Mistico Arenal Hanging Bridges Park",
                        "latitude": 10.5186,
                        "longitude": -84.7525,
                        "rating": 4.8,
                        "booking_required": True
                    },
                    {
                        "id": "act-cr-202",
                        "time_slot": "afternoon",
                        "time_label": "01:30 PM - 04:30 PM",
                        "title": "La Fortuna Waterfall Hike & Emerald Pool Swim",
                        "category": "adventure",
                        "description": "Descend 500 steps through lush canyon foliage to the base of a roaring 230-foot cascade dropping into an emerald swimming lagoon.",
                        "insider_tip": "Swim in the calmer downstream pools if the current right under the cascade is strong.",
                        "estimated_duration": "3 hours",
                        "estimated_cost": 20.0,
                        "location_name": "Catarata La Fortuna",
                        "latitude": 10.4428,
                        "longitude": -84.6738,
                        "rating": 4.9,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Rainforest Cafe La Fortuna",
                        "cuisine": "Artisan Costa Rican Coffee & Smoothies",
                        "price_tier": "$",
                        "estimated_cost_per_person": 15.0,
                        "recommendation_reason": "Great group sharing tables, freshly pressed guanabana juices, and savory empanadas.",
                        "signature_dish": "Gourmet grilled heart-of-palm sandwich",
                        "neighborhood": "La Fortuna"
                    },
                    {
                        "meal": "dinner",
                        "name": "Restaurante Tierra Mía",
                        "cuisine": "Authentic Clay Oven Fare",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 28.0,
                        "recommendation_reason": "Warm hospitality, fresh ceviche sampler bowls, and house sangria pitchers for groups.",
                        "signature_dish": "Seafood casserole in coconut milk",
                        "neighborhood": "La Fortuna"
                    }
                ]
            },
            {
                "day_number": 3,
                "date": "2026-07-17",
                "title": "Balsa River Class III Whitewater Rafting & Transit to Coast",
                "summary": "Exhilarating team-building whitewater rafting down roaring jungle rapids, followed by a scenic transfer to Manuel Antonio Pacific beach resort.",
                "estimated_day_cost": 980.0,
                "transportation_advice": "Rafting company transports group gear while you conquer the rapids; van meets you at takeout point.",
                "weather_forecast_hint": "Warm sunshine, 29°C (85°F)",
                "accommodation": {
                    "name": "Si Como No Resort & Wildlife Refuge",
                    "type": "Ocean-View Eco Resort",
                    "neighborhood": "Manuel Antonio",
                    "estimated_cost_per_night": 390.0,
                    "highlight_features": ["Two ocean-view pools", "Private movie theater for group nights", "Butterfly botanical garden"],
                    "suitability_reason": "Perched on lush hillside with sunset panoramas over the Pacific."
                },
                "activities": [
                    {
                        "id": "act-cr-301",
                        "time_slot": "morning",
                        "time_label": "09:00 AM - 01:30 PM",
                        "title": "Balsa River Whitewater Rafting (Class II-III)",
                        "category": "adventure",
                        "description": "Paddle as a crew through continuous waves and exhilarating drop rapids with riverside tropical fruit buffet at the finish.",
                        "insider_tip": "High-action river photographer captures full-group raft photos included in tour package.",
                        "estimated_duration": "4.5 hours",
                        "estimated_cost": 75.0,
                        "location_name": "Rio Balsa",
                        "latitude": 10.3600,
                        "longitude": -84.5800,
                        "rating": 5.0,
                        "booking_required": True
                    },
                    {
                        "id": "act-cr-302",
                        "time_slot": "evening",
                        "time_label": "06:00 PM - 08:30 PM",
                        "title": "Manuel Antonio Beach Sunset & Group Craft Cocktails",
                        "category": "nightlife",
                        "description": "Watch fiery Pacific sunset from the sand, toast the rafting adventure with local tropical rum cocktails, and relax.",
                        "insider_tip": "Watch for scarlet macaws flying overhead in pairs along the coast at dusk.",
                        "estimated_duration": "2.5 hours",
                        "estimated_cost": 25.0,
                        "location_name": "Playa Espadilla, Manuel Antonio",
                        "latitude": 9.3878,
                        "longitude": -84.1550,
                        "rating": 4.8,
                        "booking_required": False
                    }
                ],
                "dining": [
                    {
                        "meal": "lunch",
                        "name": "Campesino Riverside Buffet",
                        "cuisine": "Riverside Traditional BBQ",
                        "price_tier": "$",
                        "estimated_cost_per_person": 12.0,
                        "recommendation_reason": "Included riverside hot organic lunch cooked on wood stoves right after the rafting run.",
                        "signature_dish": "Arroz con Pollo & grilled sweet plantains",
                        "neighborhood": "San Ramón valley"
                    },
                    {
                        "meal": "dinner",
                        "name": "El Avión Restaurant & Bar",
                        "cuisine": "Coastal Fusion inside Historic Fairchild C-123 Aircraft",
                        "price_tier": "$$",
                        "estimated_cost_per_person": 38.0,
                        "recommendation_reason": "Dine around an authentic converted cargo aircraft with spectacular Pacific cliffside views.",
                        "signature_dish": "Mahi-mahi in passion fruit beurre blanc",
                        "neighborhood": "Manuel Antonio Main Strip"
                    }
                ]
            }
        ]
    }
]

def get_preset_trips() -> List[Dict[str, Any]]:
    return PRESET_TRIPS

def get_preset_by_id(preset_id: str) -> Dict[str, Any]:
    for trip in PRESET_TRIPS:
        if trip["id"] == preset_id:
            return trip
    return None
