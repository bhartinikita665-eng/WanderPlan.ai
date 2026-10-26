import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Calendar, Info } from 'lucide-react';
import { getCategoryBadgeClass } from '../utils/formatters';

export default function TripMap({ trip }) {
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [activePin, setActivePin] = useState(null);

  // Collect all points of interest from all days
  const allPoints = [];
  trip.days.forEach((day) => {
    if (selectedDayFilter === 'all' || selectedDayFilter === day.day_number) {
      day.activities.forEach((act) => {
        allPoints.push({
          ...act,
          dayNumber: day.day_number,
          dayDate: day.date,
          dayTitle: day.title
        });
      });
    }
  });

  const selectedPoint = activePin || (allPoints.length > 0 ? allPoints[0] : null);

  const getGoogleMapsDirectionsUrl = (points) => {
    if (!points || points.length === 0) return '#';
    const locs = points.map((p) => encodeURIComponent(`${p.location_name}, ${trip.destination}`));
    return `https://www.google.com/maps/dir/${locs.join('/')}`;
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 mb-1">
            <Compass className="w-3.5 h-3.5" />
            Interactive Route & Coordinates
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Geographic Itinerary & Waypoints
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Optimized travel progression minimizing backtracking and commute fatigue.
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-600 mr-1">Filter Day:</span>
          <button
            onClick={() => { setSelectedDayFilter('all'); setActivePin(null); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedDayFilter === 'all'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Days ({trip.days.length})
          </button>
          {trip.days.map((d) => (
            <button
              key={d.day_number}
              onClick={() => { setSelectedDayFilter(d.day_number); setActivePin(null); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedDayFilter === d.day_number
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Day {d.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Map Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Interactive Waypoints List */}
        <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          <p className="text-xs font-bold uppercase text-slate-600 tracking-wider">
            Sequential Route ({allPoints.length} Waypoints)
          </p>

          {allPoints.map((point, idx) => {
            const isSelected = selectedPoint?.id === point.id;
            return (
              <div
                key={point.id}
                onClick={() => setActivePin(point)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-teal-800">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>Day {point.dayNumber} • {point.time_label}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(point.category)}`}>
                    {point.category}
                  </span>
                </div>

                <h5 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                  {point.title}
                </h5>

                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                  <span>{point.location_name}</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Location Details & Simulated Satellite Visual Map */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-slate-900 text-white p-6 relative overflow-hidden min-h-[420px] shadow-inner">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Status */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {trip.destination} Navigation Radar
            </span>
            <a
              href={getGoogleMapsDirectionsUrl(allPoints)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Directions in Google Maps</span>
            </a>
          </div>

          {/* Interactive Pin Highlight */}
          {selectedPoint ? (
            <div className="relative z-10 my-auto py-6">
              <div className="max-w-md bg-slate-800/90 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider bg-teal-400 text-slate-950">
                    Day {selectedPoint.dayNumber} ({selectedPoint.time_label})
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {selectedPoint.category}
                  </span>
                </div>

                <h4 className="text-lg font-black text-white mb-1.5">
                  {selectedPoint.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {selectedPoint.description}
                </p>

                {selectedPoint.insider_tip && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs mb-3">
                    <strong className="font-bold text-amber-300">Tip:</strong> {selectedPoint.insider_tip}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-700 text-xs text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {selectedPoint.location_name}
                  </span>
                  {selectedPoint.latitude && selectedPoint.longitude && (
                    <span className="font-mono text-[10px] text-slate-400">
                      {selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 text-center py-12 text-slate-400">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-2 animate-spin-slow" />
              <p className="text-sm">Select a waypoint on the left to preview location details.</p>
            </div>
          )}

          {/* Bottom Waypoint Progress Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
            <span>Route Optimization: Efficient linear clustering</span>
            <span>Est. Walking / Transit: ~15 mins per stop</span>
          </div>

        </div>

      </div>

    </div>
  );
}
