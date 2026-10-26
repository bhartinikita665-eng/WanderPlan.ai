import React, { useState } from 'react';
import { X, Sparkles, Loader2, ArrowRight, Compass, Clock } from 'lucide-react';

export default function RegenerateDayModal({ 
  isOpen, 
  onClose, 
  dayNumber, 
  onConfirm, 
  isRegenerating 
}) {
  const [refinementNotes, setRefinementNotes] = useState('Add more relaxing scenic spots and a sunset dinner terrace');
  const [changePace, setChangePace] = useState('relaxed');

  if (!isOpen) return null;

  const quickPrompts = [
    'Focus on relaxing coastal viewpoints and sunset aperitivo',
    'Include indoor museums and artisanal cooking workshops',
    'Pack more high-adrenaline outdoor hiking and adventure activities',
    'Curate hidden gem cafes and local street food stalls',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      day_number: dayNumber,
      refinement_notes: refinementNotes,
      change_pace: changePace,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Day-Level AI Re-Engineering
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">
          Regenerate Schedule for Day {dayNumber}
        </h3>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Provide specific instructions to swap out activities, customize the pace, or adjust attractions to fit your mood.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
              Refinement Instructions / Guidance *
            </label>
            <textarea
              required
              rows={3}
              value={refinementNotes}
              onChange={(e) => setRefinementNotes(e.target.value)}
              placeholder="e.g. We want to skip crowded temples and instead visit a secluded tea garden and artisan ceramic shop."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
          </div>

          {/* Quick Guidance Chips */}
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-600 mb-1.5">
              One-Click Suggestions:
            </p>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRefinementNotes(p)}
                  className="text-left px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 transition-colors truncate"
                >
                  ⚡ {p}
                </button>
              ))}
            </div>
          </div>

          {/* Pace Adjustment */}
          <div className="pt-1">
            <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
              Desired Pacing for Day {dayNumber}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['relaxed', 'balanced', 'packed'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setChangePace(p)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                    changePace === p
                      ? 'border-teal-500 bg-teal-50 text-teal-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-75"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Re-architecting Day {dayNumber}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Apply AI Day Regeneration</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
