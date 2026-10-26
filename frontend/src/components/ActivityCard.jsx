import React from 'react';
import { 
  Clock, MapPin, DollarSign, Star, Trash2, 
  Sparkles, Compass, Utensils, Mountain, Heart, Coffee
} from 'lucide-react';
import { formatCurrency, getCategoryBadgeClass } from '../utils/formatters';

export default function ActivityCard({ activity, currency = 'USD', onDeleteActivity }) {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'dining':
        return Utensils;
      case 'nature':
      case 'adventure':
        return Mountain;
      case 'culture':
        return Compass;
      case 'wellness':
        return Heart;
      case 'nightlife':
        return Coffee;
      default:
        return MapPin;
    }
  };

  const CatIcon = getCategoryIcon(activity.category);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Header line: Time and Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{activity.time_label}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getCategoryBadgeClass(activity.category)}`}>
              <CatIcon className="w-3 h-3" />
              {activity.category}
            </span>

            {onDeleteActivity && (
              <button
                onClick={() => onDeleteActivity(activity.id)}
                title="Remove activity"
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1.5 group-hover:text-teal-700 transition-colors">
          {activity.title}
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
          {activity.description}
        </p>

        {/* Insider Tip Badge */}
        {activity.insider_tip && (
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 mb-3 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong className="font-bold">Insider Tip:</strong> {activity.insider_tip}
            </span>
          </div>
        )}
      </div>

      {/* Footer: Location, Duration, and Estimated Cost */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1 max-w-[60%] truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="truncate font-medium">{activity.location_name}</span>
        </div>

        <div className="flex items-center gap-3 font-semibold">
          <span>{activity.estimated_duration}</span>
          <span className="text-slate-900 font-extrabold">
            {activity.estimated_cost === 0 
              ? 'Free' 
              : formatCurrency(activity.estimated_cost, currency)}
          </span>
        </div>
      </div>

    </div>
  );
}
