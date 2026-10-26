import React, { useState } from 'react';
import { X, Plus, Clock, MapPin, DollarSign, Tag } from 'lucide-react';

export default function AddActivityModal({ isOpen, onClose, dayNumber, onAdd }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [timeSlot, setTimeSlot] = useState('afternoon');
  const [timeLabel, setTimeLabel] = useState('02:00 PM - 04:00 PM');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [cost, setCost] = useState('0');
  const [insiderTip, setInsiderTip] = useState('');
  const [duration, setDuration] = useState('2 hours');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !locationName) return;

    onAdd({
      day_number: dayNumber,
      activity: {
        id: `act-custom-${Date.now()}`,
        title,
        category,
        time_slot: timeSlot,
        time_label: timeLabel,
        description,
        location_name: locationName,
        estimated_cost: parseFloat(cost) || 0,
        insider_tip: insiderTip || undefined,
        estimated_duration: duration,
        rating: 4.8,
        booking_required: false,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-900 mb-1">
          Add Activity to Day {dayNumber}
        </h3>
        <p className="text-xs text-slate-600 mb-5">
          Insert a custom stop, reservation, or excursion into your schedule.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Activity Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunset Kayaking Tour or Wine Cellar Tasting"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="dining">Dining / Food</option>
                <option value="culture">Culture / Museum</option>
                <option value="nature">Nature & Hike</option>
                <option value="adventure">Adventure</option>
                <option value="wellness">Wellness & Spa</option>
                <option value="nightlife">Nightlife</option>
                <option value="leisure">Leisure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Time Window</label>
              <input
                type="text"
                value={timeLabel}
                onChange={(e) => setTimeLabel(e.target.value)}
                placeholder="e.g. 02:00 PM - 04:30 PM"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Est. Cost</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Location Name *</label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Grand Harbor Pier 4"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this activity special?"
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Insider Tip (Optional)</label>
            <input
              type="text"
              value={insiderTip}
              onChange={(e) => setInsiderTip(e.target.value)}
              placeholder="e.g. Reserve 2 days ahead, wear sturdy footwear"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Add to Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
