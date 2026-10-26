
import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Trash2,
  ArrowRight,
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  TrendingUp,
  Plane,
  Heart,
  Mountain
} from 'lucide-react';

import { formatCurrency, formatDateRange } from '../utils/formatters';

export default function Dashboard({
  trips,
  onSelectTrip,
  onNewTrip,
  onClonePreset,
  onDeleteTrip,
  onOpenScenarios
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [travelerFilter, setTravelerFilter] = useState('all');

  // Dashboard statistics
  const totalTrips = trips.length;

  const totalDays = trips.reduce(
    (acc, trip) => acc + (trip.days?.length || 0),
    0
  );

  const totalEstimatedCost = trips.reduce(
    (acc, trip) =>
      acc + (trip.cost_breakdown?.total_estimated_cost || 0),
    0
  );

  const totalTravelers = trips.reduce(
    (acc, trip) =>
      acc + (trip.preferences?.group_size || 1),
    0
  );

  // Search and traveler-type filtering
  const filteredTrips = trips.filter((trip) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      trip.destination?.toLowerCase().includes(search) ||
      trip.title?.toLowerCase().includes(search);

    const matchesTraveler =
      travelerFilter === 'all' ||
      trip.preferences?.traveler_type?.toLowerCase() ===
        travelerFilter.toLowerCase();

    return matchesSearch && matchesTraveler;
  });

  const glassPanel =
    'border border-white/55 bg-white/55 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,23,42,0.10)]';

  const stats = [
    {
      label: 'Saved Trips',
      value: totalTrips,
      icon: Plane,
      iconStyle: 'bg-teal-100/90 text-teal-700',
      accent: 'from-teal-400 to-emerald-500'
    },
    {
      label: 'Planned Days',
      value: totalDays,
      icon: Calendar,
      iconStyle: 'bg-sky-100/90 text-sky-700',
      accent: 'from-sky-400 to-blue-500'
    },
    {
      label: 'Estimated Spend',
      value: formatCurrency(totalEstimatedCost, 'USD'),
      icon: DollarSign,
      iconStyle: 'bg-emerald-100/90 text-emerald-700',
      accent: 'from-emerald-400 to-teal-500'
    },
    {
      label: 'Travelers Guided',
      value: totalTravelers,
      icon: Users,
      iconStyle: 'bg-violet-100/90 text-violet-700',
      accent: 'from-violet-400 to-purple-500'
    }
  ];

  return (
    <div className="relative space-y-8 pb-16">

      {/* Dashboard heading */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/20 px-6 py-7 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teal-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Your travel workspace
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your next adventure
              <span className="text-teal-700"> starts here.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-700 sm:text-base">
              Your trips, plans, and possibilities—all in one place.
              Find your next destination and make every journey count.
            </p>
          </div>

          <button
            onClick={onNewTrip}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-teal-700 hover:to-emerald-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Plan a new trip
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
              At a glance
            </p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Your travel overview
            </h2>
          </div>

          <span className="hidden rounded-full border border-white/70 bg-white/45 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-md sm:inline-flex">
            Live trip summary
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`${glassPanel} group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_18px_40px_rgba(15,23,42,0.15)]`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.accent}`}
                />

                <div className="flex items-center justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${stat.iconStyle}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="rounded-full border border-white/70 bg-white/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Overview
                  </div>
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.13em] text-slate-600">
                  {stat.label}
                </p>

                <p className="mt-1 break-words text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scenario presets */}
      <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-slate-950/95 via-teal-950/95 to-slate-900/95 p-6 text-white shadow-[0_20px_55px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-300/10 px-3 py-1.5 text-xs font-bold tracking-wide text-teal-200">
            <Sparkles className="h-4 w-4" />
            Instant Scenario Presets
          </div>

          <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                The perfect trip,
                <span className="text-teal-300"> made easier.</span>
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Start with a ready-made travel blueprint for a solo getaway,
                a couple's escape, or a group adventure.
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              Choose a scenario to get started
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* Solo preset */}
            <button
              onClick={() => onClonePreset('preset-solo-weekend-kyoto')}
              className="group rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal-300/50 hover:bg-white/[0.13] hover:shadow-lg hover:shadow-teal-950/30"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-bold text-teal-200">
                  <Plane className="h-4 w-4" />
                  SCENARIO 01
                </span>

                <span className="rounded-full bg-teal-300/15 px-2.5 py-1 text-[10px] font-bold text-teal-200">
                  Budget Solo
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white transition-colors group-hover:text-teal-200">
                Solo Weekend Getaway
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                Kyoto Food &amp; Sights: Fast research, budget dining &amp; optimized routes.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-teal-200">
                Explore scenario
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Couple preset */}
            <button
              onClick={() => onClonePreset('preset-couple-romantic-amalfi')}
              className="group rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-rose-300/50 hover:bg-white/[0.13] hover:shadow-lg hover:shadow-rose-950/20"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-bold text-rose-200">
                  <Heart className="h-4 w-4" />
                  SCENARIO 02
                </span>

                <span className="rounded-full bg-rose-300/15 px-2.5 py-1 text-[10px] font-bold text-rose-200">
                  Romantic
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white transition-colors group-hover:text-rose-200">
                Couple Romantic Escape
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                Amalfi Coast: Relaxed pacing, clifftop dining &amp; luxury day regeneration.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-rose-200">
                Explore scenario
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            {/* Group preset */}
            <button
              onClick={() => onClonePreset('preset-group-adventure-costarica')}
              className="group rounded-2xl border border-white/15 bg-white/[0.07] p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/50 hover:bg-white/[0.13] hover:shadow-lg hover:shadow-amber-950/20"
            >
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-bold text-amber-200">
                  <Mountain className="h-4 w-4" />
                  SCENARIO 03
                </span>

                <span className="rounded-full bg-amber-300/15 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                  5+ Friends
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white transition-colors group-hover:text-amber-200">
                Small Group Expedition
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                Costa Rica Multi-Day: Coordinated schedules, shared logistics &amp; split budget.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-amber-200">
                Explore scenario
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
            Your collection
          </p>

          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                Your planned journeys
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                Search, filter, and revisit your saved itineraries.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-md">
              {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} found
            </span>
          </div>
        </div>

        <div className={`${glassPanel} rounded-3xl p-4 sm:p-5`}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search destination, trip name, or keyword..."
                aria-label="Search trips"
                className="w-full rounded-2xl border border-white/80 bg-white/65 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-inner shadow-slate-900/[0.02] placeholder:text-slate-500 transition-all focus:border-teal-500 focus:bg-white/90 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Filter className="h-4 w-4" />
                Travel style
              </span>

              {['all', 'solo', 'couple', 'group'].map((style) => {
                const active = travelerFilter === style;

                return (
                  <button
                    key={style}
                    onClick={() => setTravelerFilter(style)}
                    aria-pressed={active}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-900/15'
                        : 'border border-white/65 bg-white/40 text-slate-700 hover:bg-white/80'
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {filteredTrips.length === 0 ? (
        <div className={`${glassPanel} rounded-[2rem] border-dashed p-8 text-center sm:p-14`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-teal-100 bg-teal-50/90 text-teal-700 shadow-sm">
            <Plane className="h-8 w-8" />
          </div>

          <h3 className="mt-5 text-xl font-extrabold text-slate-900">
            {trips.length === 0 ? 'Your next adventure awaits' : 'No matching trips found'}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-700">
            {trips.length === 0
              ? 'Start planning a journey and your saved itineraries will appear here.'
              : 'Try a different destination, trip name, or travel style filter.'}
          </p>

          {trips.length === 0 ? (
            <button
              onClick={onNewTrip}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Build New Itinerary
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchTerm('');
                setTravelerFilter('all');
              }}
              className="mt-6 rounded-xl border border-white/70 bg-white/60 px-4 py-2.5 text-sm font-bold text-teal-800 transition-colors hover:bg-white/90"
            >
              Clear search and filters
            </button>
          )}
        </div>
      ) : (
        /* Trip cards */
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredTrips.map((trip) => {
            const daysCount = trip.days?.length || 0;
            const currency = trip.cost_breakdown?.currency || 'USD';
            const totalCost = trip.cost_breakdown?.total_estimated_cost || 0;
            const perPerson = trip.cost_breakdown?.per_person_cost || totalCost;
            const budgetStatus = trip.cost_breakdown?.budget_status || 'on_target';

            return (
              <article
                key={trip.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/65 border-t-4 border-t-teal-500/90 bg-white/55 shadow-[0_8px_32px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/85 hover:bg-white/70 hover:shadow-[0_20px_48px_rgba(15,23,42,0.17)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/30 to-transparent" />

                <div className="relative">
                  {/* Destination and trip title */}
                  <div className="p-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{trip.destination}</span>
                      </span>

                      <span className="rounded-full border border-white/75 bg-white/55 px-3 py-1 text-[11px] font-semibold capitalize text-slate-700">
                        {trip.scenario_badge || trip.preferences?.traveler_type || 'Travel'}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectTrip(trip)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectTrip(trip);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      {trip.title}
                    </h3>

                    <p className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-teal-700" />
                      {formatDateRange(
                        trip.preferences?.start_date,
                        trip.preferences?.end_date
                      )}

                      <span className="text-slate-400">•</span>

                      <span>
                        {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
                      </span>
                    </p>
                  </div>

                  {/* Trip details */}
                  <div className="border-y border-white/60 bg-white/25 px-5 py-4 text-sm sm:px-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs text-slate-600">
                          <Users className="h-4 w-4 text-teal-700" />
                          Group size
                        </span>

                        <span className="text-right text-xs font-bold text-slate-800">
                          {trip.preferences?.group_size || 1}{' '}
                          {trip.preferences?.group_size > 1 ? 'Travelers' : 'Solo'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs text-slate-600">
                          <TrendingUp className="h-4 w-4 text-teal-700" />
                          Pacing
                        </span>

                        <span className="text-xs font-bold capitalize text-slate-800">
                          {trip.preferences?.pace || 'Balanced'}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="pt-1 text-xs text-slate-600">
                          Interests
                        </span>

                        <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                          {(trip.preferences?.interests || []).slice(0, 3).map((interest, index) => (
                            <span
                              key={`${interest}-${index}`}
                              className="rounded-lg border border-white/80 bg-white/70 px-2 py-1 text-[10px] font-semibold capitalize text-slate-700"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated cost */}
                  <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">
                        Estimated cost
                      </p>

                      <p className="mt-1 break-words text-xl font-black tracking-tight text-slate-900">
                        {formatCurrency(totalCost, currency)}
                      </p>

                      {trip.preferences?.group_size > 1 && (
                        <p className="mt-1 text-xs text-slate-600">
                          {formatCurrency(perPerson, currency)} per person
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold capitalize ${
                          budgetStatus === 'under_budget'
                            ? 'border-emerald-200 bg-emerald-50/95 text-emerald-800'
                            : budgetStatus === 'over_budget'
                            ? 'border-rose-200 bg-rose-50/95 text-rose-800'
                            : 'border-sky-200 bg-sky-50/95 text-sky-800'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {budgetStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="relative flex items-center gap-3 border-t border-white/65 bg-white/30 p-4 sm:px-5">
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    title="Delete Itinerary"
                    aria-label={`Delete itinerary: ${trip.title || trip.destination}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/75 bg-white/55 text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-teal-900/10 transition-all hover:from-teal-700 hover:to-emerald-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  >
                    View Itinerary
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
