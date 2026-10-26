const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api`;
export async function fetchTrips() {
  const res = await fetch(`${API_BASE}/trips`);
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}

export async function fetchTrip(tripId) {
  const res = await fetch(`${API_BASE}/trips/${tripId}`);
  if (!res.ok) throw new Error(`Failed to fetch trip ${tripId}`);
  return res.json();
}

export async function generateTrip(preferences) {
  const res = await fetch(`${API_BASE}/trips/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to generate itinerary' }));
    throw new Error(err.detail || 'Failed to generate itinerary');
  }
  return res.json();
}

export async function updateTrip(tripId, trip) {
  const res = await fetch(`${API_BASE}/trips/${tripId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip),
  });
  if (!res.ok) throw new Error('Failed to update trip');
  return res.json();
}

export async function deleteTrip(tripId) {
  const res = await fetch(`${API_BASE}/trips/${tripId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete trip');
  return res.json();
}

export async function regenerateDay(tripId, { day_number, refinement_notes, change_pace, focus_interests }) {
  const res = await fetch(`${API_BASE}/trips/${tripId}/regenerate-day`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day_number, refinement_notes, change_pace, focus_interests }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to regenerate day' }));
    throw new Error(err.detail || 'Failed to regenerate day');
  }
  return res.json();
}

export async function addActivity(tripId, { day_number, activity }) {
  const res = await fetch(`${API_BASE}/trips/${tripId}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ day_number, activity }),
  });
  if (!res.ok) throw new Error('Failed to add activity');
  return res.json();
}

export async function deleteActivity(tripId, dayNumber, activityId) {
  const res = await fetch(`${API_BASE}/trips/${tripId}/days/${dayNumber}/activities/${activityId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete activity');
  return res.json();
}

export async function fetchPresets() {
  const res = await fetch(`${API_BASE}/presets`);
  if (!res.ok) throw new Error('Failed to fetch presets');
  return res.json();
}

export async function clonePreset(presetId) {
  const res = await fetch(`${API_BASE}/presets/clone/${presetId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to clone preset');
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health status');
  return res.json();
}
