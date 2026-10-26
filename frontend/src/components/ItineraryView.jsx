import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Users, DollarSign, MapPin, 
  Sparkles, Printer, Download, Share2, Compass, 
  Luggage, Layers, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import DaySchedule from './DaySchedule';
import BudgetOverview from './BudgetOverview';
import TripMap from './TripMap';
import RegenerateDayModal from './RegenerateDayModal';
import AddActivityModal from './AddActivityModal';
import PackingListModal from './PackingListModal';
import { formatCurrency, formatDateRange } from '../utils/formatters';
import { exportToJSON, exportToMarkdown, printItinerary } from '../utils/exportUtils';

export default function ItineraryView({ 
  trip, 
  onBack, 
  onRegenerateDay, 
  onAddActivity, 
  onDeleteActivity, 
  isRegenerating 
}) {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'map' | 'budget'
  const [selectedDayTab, setSelectedDayTab] = useState('all'); // 'all' | number
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [targetRegenDay, setTargetRegenDay] = useState(1);
  const [isAddActModalOpen, setIsAddActModalOpen] = useState(false);
  const [targetAddDay, setTargetAddDay] = useState(1);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const currency = trip.cost_breakdown?.currency || 'USD';
  const totalCost = trip.cost_breakdown?.total_estimated_cost || 0;
  const perPerson = trip.cost_breakdown?.per_person_cost || totalCost;
  const days = trip.days || [];

  const handleOpenRegenerate = (dayNum) => {
    setTargetRegenDay(dayNum);
    setIsRegenModalOpen(true);
  };

  const handleOpenAddActivity = (dayNum) => {
    setTargetAddDay(dayNum);
    setIsAddActModalOpen(true);
  };

  const handleConfirmRegen = (payload) => {
    onRegenerateDay(payload);
    setIsRegenModalOpen(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const filteredDays = selectedDayTab === 'all' 
    ? days 
    : days.filter((d) => d.day_number === selectedDayTab);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Top Bar with Back and Export actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPackingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all"
          >
            <Luggage className="w-3.5 h-3.5 text-teal-600" />
            <span>Packing List</span>
          </button>

          <button
            onClick={printItinerary}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => exportToMarkdown(trip)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-purple-600" />
            <span>Export Markdown</span>
          </button>

          <button
            onClick={() => exportToJSON(trip)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareCopied ? 'Link Copied!' : 'Share Trip'}</span>
          </button>
        </div>
      </div>

      {/* Hero Trip Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/90">
              {trip.scenario_badge || `${trip.preferences?.traveler_type || 'Trip'} Plan`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/90 capitalize">
              {trip.preferences?.pace || 'Balanced'} Pace
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {trip.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-400" />
              {formatDateRange(trip.preferences?.start_date, trip.preferences?.end_date)} ({days.length} Days)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-400" />
              {trip.preferences?.group_size || 1} {trip.preferences?.group_size > 1 ? 'Travelers' : 'Solo'}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Est. Total: <strong className="text-white font-black">{formatCurrency(totalCost, currency)}</strong>
              {trip.preferences?.group_size > 1 && (
                <span className="text-slate-400">({formatCurrency(perPerson, currency)}/person)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Travel Advisory Alert if present */}
      {trip.travel_advisory && (
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/90 text-teal-950 flex items-start gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-extrabold text-teal-900 block mb-0.5">
              Curated Destination Logistics Advisory:
            </strong>
            {trip.travel_advisory}
          </div>
        </div>
      )}

      {/* Sub-navigation Tabs (Schedule / Map / Budget) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          {[
            { id: 'schedule', label: 'Day-by-Day Schedule', icon: Calendar },
            { id: 'map', label: 'Route & Waypoints Map', icon: Compass },
            { id: 'budget', label: 'Financial & Budget Tracker', icon: DollarSign },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Day Selector Pills when viewing Schedule */}
        {activeTab === 'schedule' && days.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl">
            <button
              onClick={() => setSelectedDayTab('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedDayTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Days
            </button>
            {days.map((d) => (
              <button
                key={d.day_number}
                onClick={() => setSelectedDayTab(d.day_number)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedDayTab === d.day_number
                    ? 'bg-white text-teal-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day {d.day_number}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {filteredDays.map((day) => (
            <DaySchedule
              key={day.day_number}
              day={day}
              currency={currency}
              onRegenerateDay={handleOpenRegenerate}
              onAddActivity={handleOpenAddActivity}
              onDeleteActivity={onDeleteActivity}
            />
          ))}
        </div>
      )}

      {activeTab === 'map' && (
        <TripMap trip={trip} />
      )}

      {activeTab === 'budget' && (
        <BudgetOverview trip={trip} />
      )}

      {/* Modals */}
      <RegenerateDayModal
        isOpen={isRegenModalOpen}
        onClose={() => setIsRegenModalOpen(false)}
        dayNumber={targetRegenDay}
        onConfirm={handleConfirmRegen}
        isRegenerating={isRegenerating}
      />

      <AddActivityModal
        isOpen={isAddActModalOpen}
        onClose={() => setIsAddActModalOpen(false)}
        dayNumber={targetAddDay}
        onAdd={onAddActivity}
      />

      <PackingListModal
        isOpen={isPackingModalOpen}
        onClose={() => setIsPackingModalOpen(false)}
        trip={trip}
      />

    </div>
  );
}
