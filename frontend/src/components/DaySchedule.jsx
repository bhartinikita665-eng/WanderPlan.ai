import React from 'react';
import { 
  Calendar, CloudSun, Compass, Utensils, Bed, 
  Sparkles, Plus, Navigation, DollarSign
} from 'lucide-react';
import ActivityCard from './ActivityCard';
import { formatCurrency } from '../utils/formatters';

export default function DaySchedule({ 
  day, 
  currency = 'USD', 
  onRegenerateDay, 
  onAddActivity, 
  onDeleteActivity 
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
      
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-teal-600 text-white shadow-2xs">
              DAY {day.day_number}
            </span>
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              {day.date}
            </span>
            {day.weather_forecast_hint && (
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1 hidden sm:flex">
                <CloudSun className="w-3 h-3 text-amber-600" />
                {day.weather_forecast_hint}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {day.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {day.summary}
          </p>
        </div>

        {/* Action Buttons & Day Cost */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-right">
            <p className="text-[10px] text-slate-600 uppercase font-bold">Est. Day Cost</p>
            <p className="text-sm font-black text-teal-700">
              ~{formatCurrency(day.estimated_day_cost, currency)}
            </p>
          </div>

          <button
            onClick={() => onRegenerateDay(day.day_number)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Regenerate Day</span>
          </button>

          <button
            onClick={() => onAddActivity(day.day_number)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Transit Logistics Advisory */}
      {day.transportation_advice && (
        <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3">
          <Navigation className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950 leading-relaxed">
            <strong className="font-extrabold text-teal-900 uppercase tracking-wider text-[11px] block mb-0.5">
              Day Logistics & Transit Tip:
            </strong>
            {day.transportation_advice}
          </div>
        </div>
      )}

      {/* Activities Timeline */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2">
          <span>Scheduled Activities</span>
          <span className="w-full h-px bg-slate-100" />
        </h4>

        {day.activities.length === 0 ? (
          <p className="text-xs text-slate-600 italic py-4 text-center">
            No activities scheduled for this day yet. Click "Add Activity" or "Regenerate Day".
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {day.activities.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                currency={currency}
                onDeleteActivity={() => onDeleteActivity(day.day_number, act.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dining Section */}
      {day.dining && day.dining.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Dining Recommendations</span>
            <span className="w-full h-px bg-slate-100" />
          </h4>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {day.dining.map((d, idx) => (
              <div 
                key={idx}
                className="bg-amber-50/40 border border-amber-200/70 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
                      {d.meal}
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      {d.price_tier} • ~{formatCurrency(d.estimated_cost_per_person, currency)}/person
                    </span>
                  </div>

                  <h5 className="font-extrabold text-sm text-slate-900 mb-1">
                    {d.name}
                  </h5>

                  <p className="text-xs text-slate-600 mb-2">
                    {d.cuisine} ({d.neighborhood})
                  </p>

                  <p className="text-xs text-slate-700 leading-snug mb-2">
                    {d.recommendation_reason}
                  </p>
                </div>

                {d.signature_dish && (
                  <div className="pt-2 border-t border-amber-200/50 text-[11px] text-amber-950 font-medium">
                    <span className="font-bold">Must-order:</span> {d.signature_dish}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stay Section */}
      {day.accommodation && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2">
            <Bed className="w-3.5 h-3.5 text-teal-600" />
            <span>Accommodation Suggestion</span>
            <span className="w-full h-px bg-slate-100" />
          </h4>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {day.accommodation.type}
                </span>
                <span className="text-xs text-slate-600">
                  {day.accommodation.neighborhood}
                </span>
              </div>
              <h5 className="text-base font-extrabold text-slate-900">
                {day.accommodation.name}
              </h5>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {day.accommodation.suitability_reason}
              </p>
              
              {day.accommodation.highlight_features && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {day.accommodation.highlight_features.map((feat, fi) => (
                    <span key={fi} className="text-[10px] font-medium px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-left sm:text-right shrink-0">
              <p className="text-[11px] text-slate-600 font-semibold">Nightly Rate</p>
              <p className="text-lg font-black text-slate-900">
                ~{formatCurrency(day.accommodation.estimated_cost_per_night, currency)}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
