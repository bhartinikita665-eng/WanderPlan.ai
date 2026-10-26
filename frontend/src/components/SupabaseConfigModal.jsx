import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, Terminal, Server } from 'lucide-react';

export default function SupabaseConfigModal({ isOpen, onClose, healthInfo }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isConnected = healthInfo?.storage?.mode === 'supabase';

  const schemaSQL = `-- Supabase Schema for Personalized Travel Itinerary Planner
CREATE TABLE IF NOT EXISTS public.itineraries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    scenario_badge TEXT,
    data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON public.itineraries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON public.itineraries (destination);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to itineraries"
    ON public.itineraries FOR SELECT USING (true);

CREATE POLICY "Allow public insert to itineraries"
    ON public.itineraries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to itineraries"
    ON public.itineraries FOR UPDATE USING (true);

CREATE POLICY "Allow public delete to itineraries"
    ON public.itineraries FOR DELETE USING (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Database & Cloud Sync
          </span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-1">
          Supabase Integration Architecture
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          The planner supports seamless dual-mode persistence. When Supabase cloud credentials are provided, trips sync directly to your Postgres database with Row Level Security. Otherwise, it uses a high-performance local persistent store.
        </p>

        {/* Status card */}
        <div className={`p-4 rounded-2xl border mb-6 flex items-center justify-between ${
          isConnected 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-slate-50 border-slate-300 text-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Current Storage Mode: <strong>{healthInfo?.storage?.mode?.toUpperCase() || 'LOCAL'}</strong>
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {healthInfo?.storage?.message || 'Ready for Supabase cloud sync.'}
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step Setup instructions */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold uppercase text-slate-600 tracking-wider">
            Quick 2-Step Supabase Connection:
          </h4>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900">Step 1:</strong> In your Supabase Dashboard SQL Editor, run the table migration below:
            </div>
          </div>

          {/* Code block with copy button */}
          <div className="relative rounded-2xl bg-slate-900 text-slate-200 p-4 font-mono text-xs overflow-x-auto">
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
            <pre className="text-[11px] leading-relaxed pr-24 whitespace-pre-wrap">{schemaSQL}</pre>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <strong className="text-slate-900">Step 2:</strong> Set your project keys in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">backend/.env</code>:
            <pre className="bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-teal-800 mt-1">
              SUPABASE_URL=https://your-project-id.supabase.co{'\n'}
              SUPABASE_KEY=your-supabase-anon-or-service-role-key
            </pre>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
          >
            <span>Open Supabase Cloud Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
