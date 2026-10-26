# ✈️ WanderPlan AI — Personalized Travel Itinerary Planner

A full-stack, AI-powered web application that simplifies travel planning through intelligent automation, prompt engineering, and personalized recommendations. Built with **React** frontend, **FastAPI** backend, and **Supabase** cloud database integration (with persistent local fallback).

---

## 🌟 Key Capabilities & Architectural Highlights

- **Smart Trip Builder**: Multi-factor questionnaire capturing destination, travel duration, traveler composition (Solo, Couple, Small Group, Family), budget caps in multiple currencies, pacing preferences, and vibe/interest tags.
- **AI Prompt Engineering & Dual Engine**:
  - Structured generative engine outputting formatted daily timelines, dining, accommodations, and transit tips.
  - Supports Google Gemini API (via `GEMINI_API_KEY` and configurable `GEMINI_MODEL`) with a deterministic local fallback when Gemini is unavailable.
- **Dynamic Day-Level AI Regeneration**: Uses Gemini to revise one day from the user's notes while preserving the other days; a local fallback is used when Gemini is unavailable.
- **Interactive Route & Waypoints Map**: Displays coordinate markers when available and links to Google Maps directions. It does not independently verify route timing or live traffic.
- **Financial & Budget Architecture**: Tracks estimated spend against the target budget cap and breaks costs down by lodging, dining, activities, and local transit. Amounts are estimates, not live quotes.
- **Supabase Cloud + Local Dual Persistence**: Full SQL migration (`supabase_schema.sql`) included. Automatically syncs with Supabase if credentials are provided in `.env`, or operates seamlessly offline with local JSON persistence.
- **Export & Sharing Suite**: 1-click Print/PDF export, Markdown export, and JSON export.

---

## 🎯 Target Scenarios Addressed

### Scenario 1: Solo Traveler Planning a Weekend Getaway
* **Challenge**: Limited time to research attractions and transit loops; desires a smooth weekend escape with affordable dining.
* **Solution**: Optimizes travel time by clustering adjacent landmarks (e.g., sunrise Torii gates at Fushimi Inari before tour buses arrive), pairs solo-friendly counter dining (Kyoto noodle bars & gyoza spots), and selects budget boutique hostels with private pods.
* **Pre-Engineered Preset**: `Solo Weekend: Kyoto Cultural & Culinary Quest`

### Scenario 2: Couple Planning a Personalized Vacation
* **Challenge**: Avoid generic tourist traps; desires relaxed pacing, scenic cliffside spots, romantic stays, and flexibility to adapt individual days.
* **Solution**: Focuses on leisure and atmosphere (sunset bellinis at Franco's Bar, private Apreamare boat charter past Capri's Faraglioni arches, and candlelight dining). Features **Day Regeneration** so couples can swap a hiking morning for a private pasta & tiramisù masterclass.
* **Pre-Engineered Preset**: `Romantic Escape: Amalfi Coast Scenic Cliffs & Boutique Villas`

### Scenario 3: Small Group Coordinating a Multi-Day Trip
* **Challenge**: Coordinating schedules, budgets, and mixed preferences (adventure + relaxation) for 5+ travelers without endless group chat friction.
* **Solution**: Organizes high-impact group excursions (Class III Balsa River whitewater rafting, Mistico canopy hanging bridges), specifies multi-bedroom thermal resort villas, coordinates dedicated group van transit, and computes per-person expense breakdowns.
* **Pre-Engineered Preset**: `Group Expedition: Costa Rica Rainforest, Volcano & Rafting`

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (with `fastapi`, `uvicorn`, `pydantic`)
- **Node.js 18+** & `npm`

### 1-Click Launch (Windows PowerShell)
```powershell
cd path\to\travel-itinerary-planner
.\run_app.ps1
```
This automatically starts:
- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Backend**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Manual Launch (Separate Terminals)

#### Backend
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend
```powershell
cd frontend
npm.cmd run dev
```

---

## 🗄️ Supabase Cloud Database Setup (Optional)

The application works completely out-of-the-box with local storage. To connect your cloud Supabase database:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a project.
2. In the **SQL Editor**, paste and run the contents of `backend/supabase_schema.sql`.
3. Copy your **Project URL** and **anon public key** from *Project Settings -> API*. Use the least-privileged key appropriate for your app; never expose a service-role key in frontend code.
4. Copy `backend/.env.example` to `backend/.env`, then set the credentials in `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-appropriate-supabase-key
   ```
5. Restart the backend. The UI navbar will immediately show `Supabase Synced`.

---

## 🔐 Environment Setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Set `GEMINI_API_KEY` to your own key and leave `GEMINI_MODEL=gemini-3.8-flash` unless you select another model available to your account.
3. Keep `backend/.env` private; it is intentionally excluded from the submission ZIP. Never commit API keys.
4. If no Gemini key is configured, the app uses the local fallback generator. Check `/api/health` to see the configured model and whether Gemini is configured.
5. Gemini-generated attractions, prices, ratings, opening hours, and weather are suggestions unless independently verified with live data sources. Do not treat estimates as booking confirmations.
6. Before deployment, add your deployed frontend origin to the CORS allow-list in `backend/app/main.py`.

## 📦 Project Structure

```
travel-itinerary-planner/
├── backend/
│   ├── app/
│   │   ├── config.py              # Environment configuration (.env loader)
│   │   ├── main.py                # FastAPI entry point & CORS
│   │   ├── models.py              # Pydantic schemas for trips, days & activities
│   │   ├── routers/
│   │   │   ├── trips.py           # CRUD, AI generation, day regenerator
│   │   │   ├── presets.py         # Scenario 1, 2, 3 preset endpoints
│   │   │   └── health.py          # Storage mode & health checks
│   │   └── services/
│   │       ├── ai_generator.py    # Prompt engineering & AI synthesis
│   │       ├── supabase_service.py # Dual-mode Supabase/Local JSON persistence
│   │       └── preset_trips.py    # Curated scenario blueprints
│   ├── supabase_schema.sql        # Supabase SQL table & RLS script
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/client.js          # REST API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header & Supabase sync badge
│   │   │   ├── Dashboard.jsx      # Metrics, scenario starters & search/filter
│   │   │   ├── ScenarioPresets.jsx# Dedicated view for Scenarios 1, 2 & 3
│   │   │   ├── TripWizard.jsx     # AI trip builder with prompt preview
│   │   │   ├── ItineraryView.jsx  # Day schedule, map, budget & export tabs
│   │   │   ├── DaySchedule.jsx    # Timeline, dining & accommodation cards
│   │   │   ├── ActivityCard.jsx   # Activity items with insider tips
│   │   │   ├── BudgetOverview.jsx # Budget meter & cost breakdown
│   │   │   ├── TripMap.jsx        # Route waypoint navigator
│   │   │   ├── RegenerateDayModal.jsx # Single-day AI re-architecting
│   │   │   ├── AddActivityModal.jsx   # Custom activity creation
│   │   │   ├── PackingListModal.jsx   # Dynamic packing checklist
│   │   │   └── SupabaseConfigModal.jsx# Database schema inspector & status
│   │   ├── utils/
│   │   │   ├── formatters.js      # Currency, dates & badge helpers
│   │   │   └── exportUtils.js     # Print, JSON & Markdown export
│   │   ├── App.jsx                # Master application state coordinator
│   │   └── index.css              # Tailwind styling
│   ├── package.json
│   └── vite.config.js
└── run_app.ps1                    # One-click start script
```
