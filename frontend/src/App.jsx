import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ScenarioPresets from './components/ScenarioPresets';
import TripWizard from './components/TripWizard';
import ItineraryView from './components/ItineraryView';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import { 
  fetchTrips, fetchPresets, fetchHealth, generateTrip, 
  deleteTrip, clonePreset, regenerateDay, addActivity, deleteActivity 
} from './api/client';
import { CheckCircle2, AlertCircle, Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'wizard' | 'scenarios' | 'itinerary'
  const [trips, setTrips] = useState([]);
  const [presets, setPresets] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [healthInfo, setHealthInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [tripsData, presetsData, healthData] = await Promise.all([
          fetchTrips().catch(() => []),
          fetchPresets().catch(() => []),
          fetchHealth().catch(() => null),
        ]);
        setTrips(tripsData);
        setPresets(presetsData);
        setHealthInfo(healthData);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Handler: Generate Trip
  const handleGenerateTrip = async (preferences) => {
    try {
      setIsGenerating(true);
      const newTrip = await generateTrip(preferences);
      setTrips([newTrip, ...trips]);
      setSelectedTrip(newTrip);
      setActiveTab('itinerary');
      showToast(`Personalized itinerary for ${newTrip.destination} created!`);
    } catch (err) {
      showToast(err.message || 'Error generating trip', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Select Trip for view
  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    setActiveTab('itinerary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Delete Trip
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await deleteTrip(tripId);
      setTrips(trips.filter((t) => t.id !== tripId));
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null);
        setActiveTab('dashboard');
      }
      showToast('Trip itinerary deleted.');
    } catch (err) {
      showToast('Failed to delete trip.', 'error');
    }
  };

  // Handler: Clone Preset
  const handleClonePreset = async (presetId) => {
    try {
      const cloned = await clonePreset(presetId);
      setTrips([cloned, ...trips]);
      setSelectedTrip(cloned);
      setActiveTab('itinerary');
      showToast(`Loaded ${cloned.title} for customized editing!`);
    } catch (err) {
      showToast('Failed to clone preset scenario.', 'error');
    }
  };

  // Handler: Regenerate Single Day
  const handleRegenerateDay = async (payload) => {
    if (!selectedTrip) return;
    try {
      setIsRegenerating(true);
      const updated = await regenerateDay(selectedTrip.id, payload);
      setSelectedTrip(updated);
      setTrips(trips.map((t) => (t.id === updated.id ? updated : t)));
      showToast(`Day ${payload.day_number} successfully regenerated with AI!`);
    } catch (err) {
      showToast('Failed to regenerate day schedule.', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Handler: Add Activity
  const handleAddActivity = async (payload) => {
    if (!selectedTrip) return;
    try {
      const updated = await addActivity(selectedTrip.id, payload);
      setSelectedTrip(updated);
      setTrips(trips.map((t) => (t.id === updated.id ? updated : t)));
      showToast(`Activity added to Day ${payload.day_number}!`);
    } catch (err) {
      showToast('Failed to add activity.', 'error');
    }
  };

  // Handler: Delete Activity
  const handleDeleteActivity = async (dayNumber, activityId) => {
    if (!selectedTrip) return;
    try {
      const updated = await deleteActivity(selectedTrip.id, dayNumber, activityId);
      setSelectedTrip(updated);
      setTrips(trips.map((t) => (t.id === updated.id ? updated : t)));
      showToast('Activity removed.');
    } catch (err) {
      showToast('Failed to remove activity.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewTrip={() => setActiveTab('wizard')}
        healthInfo={healthInfo}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white ${
            toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-900 border border-slate-700'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center animate-bounce shadow-md">
              <Compass className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-700">Connecting to WanderPlan AI Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                trips={trips}
                onSelectTrip={handleSelectTrip}
                onNewTrip={() => setActiveTab('wizard')}
                onClonePreset={handleClonePreset}
                onDeleteTrip={handleDeleteTrip}
                onOpenScenarios={() => setActiveTab('scenarios')}
              />
            )}

            {activeTab === 'wizard' && (
              <TripWizard
                onGenerate={handleGenerateTrip}
                isGenerating={isGenerating}
              />
            )}

            {activeTab === 'scenarios' && (
              <ScenarioPresets
                presets={presets}
                onClonePreset={handleClonePreset}
                onSelectTrip={handleSelectTrip}
              />
            )}

            {activeTab === 'itinerary' && selectedTrip && (
              <ItineraryView
                trip={selectedTrip}
                onBack={() => setActiveTab('dashboard')}
                onRegenerateDay={handleRegenerateDay}
                onAddActivity={handleAddActivity}
                onDeleteActivity={handleDeleteActivity}
                isRegenerating={isRegenerating}
              />
            )}
          </>
        )}
      </main>

      {/* Supabase Configuration & Schema Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        healthInfo={healthInfo}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-700">
            Personalized Travel Itinerary Planner • Full-Stack React + FastAPI + Supabase
          </p>
          <p>
            Scenario 1 (Solo Weekend) • Scenario 2 (Couple Romantic) • Scenario 3 (Group Multi-Day)
          </p>
        </div>
      </footer>

    </div>
  );
}
