-- ====================================================================
-- Supabase Schema for Personalized Travel Itinerary Planner
-- ====================================================================
-- Execute this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql

-- 1. Create table for storing itineraries
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

-- 2. Create indexes for fast lookup and sorting
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON public.itineraries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_itineraries_destination ON public.itineraries (destination);
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON public.itineraries (user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- 4. Policies:
-- Allow public access for demo / anonymous travel planning
CREATE POLICY "Allow public read access to itineraries"
    ON public.itineraries FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to itineraries"
    ON public.itineraries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update to itineraries"
    ON public.itineraries FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete to itineraries"
    ON public.itineraries FOR DELETE
    USING (true);

-- 5. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_itineraries_updated_at ON public.itineraries;
CREATE TRIGGER trigger_itineraries_updated_at
    BEFORE UPDATE ON public.itineraries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
