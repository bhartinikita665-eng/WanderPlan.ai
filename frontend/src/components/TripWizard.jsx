import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Users, DollarSign, MapPin, 
  Compass, Heart, Mountain, Clock, Utensils, 
  Camera, Coffee, Shield, Check, Info, ArrowRight, Loader2
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { name: 'Kyoto, Japan', type: 'solo', label: 'Cultural & Culinary' },
  { name: 'Amalfi Coast, Italy', type: 'couple', label: 'Romantic & Scenic' },
  { name: 'Arenal, Costa Rica', type: 'group', label: 'Rainforest & Adventure' },
  { name: 'Paris, France', type: 'couple', label: 'Art, Cafes & Architecture' },
  { name: 'Tokyo, Japan', type: 'solo', label: 'Futuristic & Street Food' },
  { name: 'Rome, Italy', type: 'couple', label: 'Ancient History & Trattorias' },
];

const INTEREST_OPTIONS = [
  { id: 'sightseeing', label: 'Iconic Sightseeing', icon: MapPin },
  { id: 'food', label: 'Culinary & Street Food', icon: Utensils },
  { id: 'culture', label: 'Culture & Museums', icon: Compass },
  { id: 'nature', label: 'Nature & Scenic Walks', icon: Mountain },
  { id: 'adventure', label: 'Outdoor Adventure', icon: Mountain },
  { id: 'wellness', label: 'Wellness & Relaxation', icon: Heart },
  { id: 'nightlife', label: 'Nightlife & Aperitivo', icon: Coffee },
  { id: 'photography', label: 'Photography Spots', icon: Camera },
];

export default function TripWizard({ onGenerate, isGenerating }) {
  // Form State
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [origin, setOrigin] = useState('');
  const [startDate, setStartDate] = useState('2026-11-06');
  const [endDate, setEndDate] = useState('2026-11-08');
  const [travelerType, setTravelerType] = useState('solo');
  const [groupSize, setGroupSize] = useState(1);
  const [budgetLevel, setBudgetLevel] = useState('budget');
  const [budgetTotal, setBudgetTotal] = useState('450');
  const [currency, setCurrency] = useState('USD');
  const [pace, setPace] = useState('balanced');
  const [accommodationType, setAccommodationType] = useState('boutique');
  const [selectedInterests, setSelectedInterests] = useState(['food', 'sightseeing', 'photography']);
  const [dietary, setDietary] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Auto calculate duration in days
  const computeDays = () => {
    try {
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return isNaN(diffDays) ? 3 : Math.max(1, diffDays);
    } catch {
      return 3;
    }
  };
  const numDays = computeDays();

  // Toggle interest
  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Quick preset selector handler
  const handleSelectPopular = (dest) => {
    setDestination(dest.name);
    if (dest.type === 'solo') {
      setTravelerType('solo');
      setGroupSize(1);
      setBudgetLevel('budget');
      setBudgetTotal('450');
    } else if (dest.type === 'couple') {
      setTravelerType('couple');
      setGroupSize(2);
      setBudgetLevel('luxury');
      setBudgetTotal('3200');
      setPace('relaxed');
    } else if (dest.type === 'group') {
      setTravelerType('group');
      setGroupSize(5);
      setBudgetLevel('moderate');
      setBudgetTotal('4500');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;

    const payload = {
      destination,
      origin: origin || undefined,
      start_date: startDate,
      end_date: endDate,
      traveler_type: travelerType,
      group_size: Number(groupSize),
      budget_level: budgetLevel,
      budget_total: budgetTotal ? parseFloat(budgetTotal) : undefined,
      currency,
      pace,
      interests: selectedInterests,
      accommodation_type: accommodationType,
      dietary_requirements: dietary || undefined,
      additional_notes: specialNotes || undefined,
    };

    onGenerate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Wizard Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Generative Trip Architecture
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Smart AI Trip Builder
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Input your travel dates, travel style, and budget preferences. Our AI engine generates day-by-day itineraries with attractions, dining, stays, and transit logistics.
        </p>

        {/* Popular Shortcuts */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold uppercase text-slate-600 tracking-wider mb-2.5">
            Quick Incline Suggestions:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DESTINATIONS.map((dest, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPopular(dest)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  destination === dest.name
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{dest.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({dest.label})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Destination & Dates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Where and When?</h3>
              <p className="text-xs text-slate-600">Destination and travel dates</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Destination City / Region *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Origin / Departure City (Optional)
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. New York (JFK) or Tokyo"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Dates & Duration Counter */}
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
              />
            </div>

            <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 flex flex-col justify-center text-center">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Calculated Span</span>
              <span className="text-xl font-black text-teal-900">{numDays} Days</span>
            </div>
          </div>
        </div>

        {/* Step 2: Traveler Profile & Party Size */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Who is Traveling?</h3>
              <p className="text-xs text-slate-600">Select traveler composition</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'solo', label: 'Solo Traveler', desc: 'Scenario 1: Fast, flexible', icon: Users },
              { id: 'couple', label: 'Couple', desc: 'Scenario 2: Romance & curated', icon: Heart },
              { id: 'group', label: 'Small Group', desc: 'Scenario 3: Split budget & coordination', icon: Users },
              { id: 'family', label: 'Family', desc: 'Kid-friendly & relaxed', icon: Users },
            ].map((type) => {
              const isSelected = travelerType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setTravelerType(type.id);
                    if (type.id === 'solo') setGroupSize(1);
                    if (type.id === 'couple') setGroupSize(2);
                    if (type.id === 'group' && groupSize < 3) setGroupSize(4);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <type.icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-teal-600' : 'text-slate-600'}`} />
                  <div className="font-extrabold text-sm text-slate-900">{type.label}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{type.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Group size adjuster */}
          {travelerType === 'group' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-amber-900">Group Size</h4>
                <p className="text-xs text-amber-800">Coordinates shared accommodation and group van logistics</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGroupSize(Math.max(3, groupSize - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-amber-300 font-bold text-amber-900 flex items-center justify-center hover:bg-amber-100"
                >
                  -
                </button>
                <span className="font-black text-lg text-amber-950 w-6 text-center">{groupSize}</span>
                <button
                  type="button"
                  onClick={() => setGroupSize(Math.min(12, groupSize + 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-amber-300 font-bold text-amber-900 flex items-center justify-center hover:bg-amber-100"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Budget, Pace & Stay */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Budget, Pace & Accommodation</h3>
              <p className="text-xs text-slate-600">Align spending parameters and daily rhythm</p>
            </div>
          </div>

          {/* Budget row */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Budget Tier
              </label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                <option value="budget">Budget / Backpacker ($)</option>
                <option value="moderate">Moderate / Balanced ($$)</option>
                <option value="luxury">Luxury / Premium ($$$)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Estimated Total Budget Cap
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full pl-3 pr-16 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                  {currency}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>

          {/* Pacing & Stays */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Itinerary Pacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: 'Slow, leisurely' },
                  { id: 'balanced', label: 'Balanced', desc: 'Curated mix' },
                  { id: 'packed', label: 'Packed', desc: 'High energy' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPace(p.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      pace === p.id
                        ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs">{p.label}</div>
                    <div className="text-[10px] opacity-75">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Accommodation Style
              </label>
              <select
                value={accommodationType}
                onChange={(e) => setAccommodationType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              >
                <option value="boutique">Boutique Design Hotel / Machiya</option>
                <option value="hostel">Design Hostel / Social Pods</option>
                <option value="resort">Eco Resort & Spa</option>
                <option value="hotel_3star">3-Star Modern City Hotel</option>
                <option value="luxury_5star">5-Star Luxury Villa</option>
                <option value="airbnb">Vacation Apartment / Airbnb</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 4: Interests & Vibes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Interests & Special Notes</h3>
              <p className="text-xs text-slate-600">Select what excites you most about this trip</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INTEREST_OPTIONS.map((item) => {
              const isChecked = selectedInterests.includes(item.id);
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    isChecked
                      ? 'border-teal-500 bg-teal-50/80 text-teal-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ItemIcon className={`w-4 h-4 ${isChecked ? 'text-teal-600' : 'text-slate-600'}`} />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Dietary Preferences (Optional)
              </label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Vegetarian, Halal, Gluten-Free, Seafood lover"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-2">
                Special Requests & Notes (Optional)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Honeymoon sunset spots, quiet coffee corners, no steep stairs"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>
        </div>

        {/* Prompt Engineering Inspector Accordion */}
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPromptPreview(!showPromptPreview)}
            className="w-full px-5 py-3 text-left flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50/80 hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Prompt Engineering Context (AI Input Preview)
            </span>
            <span className="text-teal-600 font-semibold">{showPromptPreview ? 'Hide' : 'Inspect'}</span>
          </button>
          {showPromptPreview && (
            <div className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] leading-relaxed">
              <p className="text-teal-400 font-bold mb-2">// Engineered Schema Dispatched to FastAPI & Generative Engine:</p>
              <pre className="whitespace-pre-wrap">{JSON.stringify({
                destination,
                origin,
                dates: `${startDate} to ${endDate} (${numDays} days)`,
                persona: travelerType,
                group_size: groupSize,
                budget: `${budgetTotal} ${currency} (${budgetLevel})`,
                pace,
                interests: selectedInterests,
                accommodation: accommodationType,
                dietary: dietary || 'None',
                notes: specialNotes || 'None'
              }, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-teal-700/25 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting Your Day-by-Day Itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Optimized Itinerary with AI</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
