import React from 'react';
import { Compass, Sparkles, Database, Plus, Layers, MapPin } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onNewTrip, healthInfo, onOpenSupabaseModal }) {
  const isSupabaseConnected = healthInfo?.storage?.mode === 'supabase';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-teal-700 bg-clip-text text-transparent">
                  WanderPlan<span className="text-teal-600">.ai</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                  FastAPI + Supabase
                </span>
              </div>
              <p className="text-xs text-slate-600 hidden sm:block">Personalized AI Travel Itinerary Planner</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              My Trips & Dashboard
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'wizard'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Smart Trip Builder
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'scenarios'
                  ? 'bg-white text-teal-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Scenario Showcase
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <button
              onClick={onOpenSupabaseModal}
              title="Click to view Supabase Database & Cloud Sync Settings"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                isSupabaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConnected ? 'Supabase Synced' : 'Storage: Local Fallback'}</span>
            </button>

            {/* Create Trip CTA */}
            <button
              onClick={onNewTrip}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-600/30 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
