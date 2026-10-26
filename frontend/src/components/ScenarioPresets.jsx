import React from 'react';
import { 
  Plane, Heart, Users, CheckCircle2, ArrowRight, 
  Sparkles, Clock, Compass, DollarSign, ShieldAlert, Layers
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ScenarioPresets({ presets, onClonePreset, onSelectTrip }) {
  const scenarioMetadata = [
    {
      id: 'preset-solo-weekend-kyoto',
      scenarioNum: 'Scenario 1',
      title: 'Solo Traveler Planning a Weekend Getaway',
      highlightBadge: 'Fast Research & Budget Optimization',
      icon: Plane,
      color: 'teal',
      accentBg: 'bg-teal-50',
      accentText: 'text-teal-700',
      accentBorder: 'border-teal-200',
      gradient: 'from-teal-600 to-emerald-600',
      narrative: 'A solo traveler wanting to maximize a 2-3 day weekend break without spending hours scrolling travel forums. The system organizes transit passes, quiet early morning photo spots, and solo-friendly counter dining.',
      keyFeatures: [
        'Optimized transit loops (Fushimi Inari morning sunrise to beat crowds)',
        'Budget-conscious authentic dining (slurping udon and crispy gyoza bars)',
        'Boutique social design hostels with pod privacy and cafe lounges',
        'Minimal transit friction with 1-day bus & metro pass tips'
      ]
    },
    {
      id: 'preset-couple-romantic-amalfi',
      scenarioNum: 'Scenario 2',
      title: 'Couple Planning a Personalized Vacation',
      highlightBadge: 'Relaxed Pacing & Single-Day AI Regeneration',
      icon: Heart,
      color: 'rose',
      accentBg: 'bg-rose-50',
      accentText: 'text-rose-700',
      accentBorder: 'border-rose-200',
      gradient: 'from-rose-600 to-pink-600',
      narrative: 'A couple seeking authentic romance over generic tourist itineraries. Highlights relaxed pacing, panoramic clifftop aperitivos, private wooden boat charters to Capri, and flexible day regeneration to tailor special occasions.',
      keyFeatures: [
        'Boutique 5-star cliffside villas with sea-view terraces',
        'Private Apreamare boat charter through the Faraglioni arches',
        'Curated candlelight dining and vertical vineyard wine tastings',
        'One-click Day Regeneration to swap activities for private masterclasses'
      ]
    },
    {
      id: 'preset-group-adventure-costarica',
      scenarioNum: 'Scenario 3',
      title: 'Small Group Coordinating a Multi-Day Trip',
      highlightBadge: 'Coordinated Logistics & Shared Group Budgeting',
      icon: Users,
      color: 'amber',
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-700',
      accentBorder: 'border-amber-200',
      gradient: 'from-amber-600 to-orange-600',
      narrative: 'A party of friends tackling the complexity of coordinating 5+ adults with varied preferences. Structures exhilarating adventures (whitewater rafting, canopy hanging bridges), multi-bedroom resort suites, and per-person cost breakdowns.',
      keyFeatures: [
        'Dedicated private Sprinter van logistics eliminating shuttle delays',
        'Class III Balsa River rafting and natural geothermal hot spring pools',
        'Balanced adrenaline with downtime and social group dining',
        'Real-time cost-per-person breakdown preventing group budgeting disputes'
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-3">
          <Layers className="w-3.5 h-3.5" />
          Real-World Planning Personas
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Target Travel Scenarios & AI Blueprints
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Explore how the AI planner personalizes logistics, budget controls, and pacing according to traveler party size, duration, and style.
        </p>
      </div>

      {/* 3 Detailed Scenario Cards */}
      <div className="space-y-6">
        {scenarioMetadata.map((sc) => {
          const matchingPreset = presets.find((p) => p.id === sc.id);
          const IconComp = sc.icon;

          return (
            <div 
              key={sc.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid lg:grid-cols-12 transition-all hover:shadow-md"
            >
              {/* Left Column: Persona Overview */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sc.accentBg} ${sc.accentText} border ${sc.accentBorder}`}>
                      <IconComp className="w-3.5 h-3.5" />
                      {sc.scenarioNum}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {sc.highlightBadge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
                    {sc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {sc.narrative}
                  </p>

                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Architectural Solutions:
                    </p>
                    {sc.keyFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button
                    onClick={() => onClonePreset(sc.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Clone & Customize This Trip</span>
                  </button>
                  {matchingPreset && (
                    <button
                      onClick={() => onSelectTrip(matchingPreset)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Inspect Blueprint
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Live Plan Preview */}
              <div className="lg:col-span-7 bg-slate-50/60 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Destination</p>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {matchingPreset?.destination || 'Destination'}
                      </h4>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-600 font-semibold uppercase">Cost Breakdown</p>
                      <p className="text-sm font-black text-teal-700">
                        {formatCurrency(matchingPreset?.cost_breakdown?.total_estimated_cost, matchingPreset?.cost_breakdown?.currency)}
                        {matchingPreset?.preferences?.group_size > 1 && (
                          <span className="text-xs font-normal text-slate-600 ml-1">
                            ({formatCurrency(matchingPreset?.cost_breakdown?.per_person_cost, matchingPreset?.cost_breakdown?.currency)} / person)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Day Highlights Timeline */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Day-by-Day Schedule Preview:
                    </p>
                    {(matchingPreset?.days || []).map((day) => (
                      <div 
                        key={day.day_number}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-slate-800">
                            Day {day.day_number}: {day.title}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            ~{formatCurrency(day.estimated_day_cost, matchingPreset?.cost_breakdown?.currency)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                          {day.summary}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {day.activities.map((a, ai) => (
                            <span 
                              key={ai}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                            >
                              {a.time_slot.toUpperCase()}: {a.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Pacing: <strong className="capitalize text-slate-700">{matchingPreset?.preferences?.pace}</strong></span>
                  <span>Travelers: <strong className="text-slate-700">{matchingPreset?.preferences?.group_size}</strong></span>
                  <span>Budget Tier: <strong className="capitalize text-slate-700">{matchingPreset?.preferences?.budget_level}</strong></span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
