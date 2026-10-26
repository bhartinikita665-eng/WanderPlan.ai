from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# 1. Health
h = client.get('/api/health')
assert h.status_code == 200, f'Health failed: {h.text}'
print('Health OK:', h.json()['status'])

# 2. Presets
presets = client.get('/api/presets').json()
assert len(presets) == 3, f'Expected 3 presets, got {len(presets)}'
print('Presets count:', len(presets))
for p in presets:
    print(f" - {p['title']} | Badge: {p.get('scenario_badge')}")

# 3. Clone Preset
preset_id = presets[0]["id"]
clone_res = client.post(f'/api/presets/clone/{preset_id}')
assert clone_res.status_code == 200, f'Clone failed: {clone_res.text}'
cloned_trip = clone_res.json()
print('Cloned trip:', cloned_trip['title'], 'ID:', cloned_trip['id'])

# 4. List Trips
trips = client.get('/api/trips').json()
assert len(trips) >= 1, 'Expected at least 1 trip'
print('Trips in DB:', len(trips))

# 5. Regenerate Day
regen_res = client.post(f"/api/trips/{cloned_trip['id']}/regenerate-day", json={
    'day_number': 1,
    'refinement_notes': 'Focus on quiet morning tea ceremonies and scenic garden photography',
    'change_pace': 'relaxed'
})
assert regen_res.status_code == 200, f'Regenerate failed: {regen_res.text}'
print('Regenerated day 1 title:', regen_res.json()['days'][0]['title'])

# 6. Add Custom Activity
add_res = client.post(f"/api/trips/{cloned_trip['id']}/activities", json={
    'day_number': 1,
    'activity': {
        'id': 'test-act-1',
        'time_slot': 'afternoon',
        'time_label': '03:00 PM - 04:30 PM',
        'title': 'Matcha Tasting Experience',
        'category': 'culture',
        'description': 'Enjoy authentic stone-ground ceremonial matcha',
        'location_name': 'Kyoto Gion'
    }
})
assert add_res.status_code == 200, f'Add activity failed: {add_res.text}'
print('Activities in day 1 after add:', len(add_res.json()['days'][0]['activities']))

# 7. Delete Trip
del_res = client.delete(f"/api/trips/{cloned_trip['id']}")
assert del_res.status_code == 200, f'Delete failed: {del_res.text}'
print('Deleted test cloned trip OK')

print('\nALL FASTAPI ENDPOINTS VERIFIED SUCCESSFULLY!')
