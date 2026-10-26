import json
import logging
from typing import List, Optional, Dict, Any
from pathlib import Path
from app.config import settings

logger = logging.getLogger("supabase_service")

class SupabaseService:
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_KEY
        self.client = None
        self.local_file = settings.DATA_DIR / "itineraries.json"
        self._init_local_db()
        self._init_supabase()

    def _init_local_db(self):
        if not self.local_file.exists():
            with open(self.local_file, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    def _init_supabase(self):
        if self.supabase_url and self.supabase_key and "your-" not in self.supabase_url:
            try:
                from supabase import create_client, Client
                self.client: Optional[Client] = create_client(self.supabase_url, self.supabase_key)
                logger.info("Connected to Supabase client successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize Supabase client: {e}. Falling back to local storage.")
                self.client = None
        else:
            logger.info("Supabase credentials not configured. Operating in local JSON persistence mode.")
            self.client = None

    def get_status(self) -> Dict[str, Any]:
        return {
            "mode": "supabase" if self.client else "local_fallback",
            "supabase_configured": bool(self.client),
            "supabase_url": self.supabase_url if self.supabase_url else None,
            "local_storage_path": str(self.local_file),
            "message": "Connected to Supabase" if self.client else "Using persistent local storage. Provide SUPABASE_URL and SUPABASE_KEY in .env to sync with Supabase cloud."
        }

    def list_itineraries(self) -> List[Dict[str, Any]]:
        if self.client:
            try:
                response = self.client.table("itineraries").select("*").order("created_at", desc=True).execute()
                # Parse JSON fields if stored as text
                results = []
                for item in response.data:
                    data = item.get("data", item)
                    if isinstance(data, str):
                        data = json.loads(data)
                    results.append(data)
                return results
            except Exception as e:
                logger.error(f"Error fetching from Supabase: {e}. Falling back to local.")
        
        # Local fallback
        try:
            with open(self.local_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def get_itinerary(self, itinerary_id: str) -> Optional[Dict[str, Any]]:
        if self.client:
            try:
                response = self.client.table("itineraries").select("*").eq("id", itinerary_id).execute()
                if response.data and len(response.data) > 0:
                    raw = response.data[0]
                    data = raw.get("data", raw)
                    if isinstance(data, str):
                        data = json.loads(data)
                    return data
            except Exception as e:
                logger.error(f"Error getting trip from Supabase: {e}")

        # Local fallback
        items = self.list_itineraries()
        for item in items:
            if item.get("id") == itinerary_id:
                return item
        return None

    def save_itinerary(self, itinerary: Dict[str, Any]) -> Dict[str, Any]:
        itinerary_id = itinerary["id"]
        
        # Save to local storage always for backup & offline speed
        try:
            items = self.list_itineraries()
            existing_idx = next((i for i, x in enumerate(items) if x.get("id") == itinerary_id), None)
            if existing_idx is not None:
                items[existing_idx] = itinerary
            else:
                items.insert(0, itinerary)
            with open(self.local_file, "w", encoding="utf-8") as f:
                json.dump(items, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving to local storage: {e}")

        # Save to Supabase if connected
        if self.client:
            try:
                payload = {
                    "id": itinerary_id,
                    "title": itinerary.get("title", "Trip"),
                    "destination": itinerary.get("destination", ""),
                    "created_at": itinerary.get("created_at"),
                    "data": itinerary
                }
                self.client.table("itineraries").upsert(payload).execute()
            except Exception as e:
                logger.error(f"Error upserting to Supabase: {e}")

        return itinerary

    def delete_itinerary(self, itinerary_id: str) -> bool:
        deleted = False
        # Remove from local
        try:
            items = self.list_itineraries()
            new_items = [x for x in items if x.get("id") != itinerary_id]
            if len(new_items) != len(items):
                with open(self.local_file, "w", encoding="utf-8") as f:
                    json.dump(new_items, f, indent=2)
                deleted = True
        except Exception as e:
            logger.error(f"Error deleting from local: {e}")

        # Remove from Supabase
        if self.client:
            try:
                self.client.table("itineraries").delete().eq("id", itinerary_id).execute()
                deleted = True
            except Exception as e:
                logger.error(f"Error deleting from Supabase: {e}")

        return deleted

db_service = SupabaseService()
