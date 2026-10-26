import React from 'react';
import { 
  DollarSign, TrendingUp, Bed, Utensils, 
  MapPin, Navigation, Users, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function BudgetOverview({ trip }) {
  const { preferences, cost_breakdown } = trip;
  const currency = cost_breakdown.currency || 'USD';
  const totalCost = cost_breakdown.total_estimated_cost;
  const budgetCap = preferences.budget_total;
  const groupSize = preferences.group_size || 1;
  const perPerson = cost_breakdown.per_person_cost;

  // Percentage of budget used
  const percentUsed = budgetCap ? Math.min(100, Math.round((totalCost / budgetCap) * 100)) : 0;
  const isOverBudget = budgetCap && totalCost > budgetCap;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
              Budget Analytics
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
              cost_breakdown.budget_status === 'under_budget'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : cost_breakdown.budget_status === 'over_budget'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {cost_breakdown.budget_status.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Financial & Cost Architecture
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time tracking of estimated expenses vs your target budget cap.
          </p>
        </div>

        {/* Group split card */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-teal-800 font-bold uppercase tracking-wider">
              {groupSize > 1 ? `Per Person (${groupSize} Travelers)` : 'Solo Traveler Total'}
            </p>
            <p className="text-xl font-black text-teal-950">
              {formatCurrency(perPerson, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Progress Meter */}
      {budgetCap && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Estimated Spend: <strong className="text-slate-900 text-sm">{formatCurrency(totalCost, currency)}</strong>
            </span>
            <span className="font-semibold text-slate-600">
              Budget Cap: <strong className="text-slate-900 text-sm">{formatCurrency(budgetCap, currency)}</strong>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (totalCost / budgetCap) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>{percentUsed}% of budget allocated</span>
            <span>
              {isOverBudget ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {formatCurrency(totalCost - budgetCap, currency)} over target
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {formatCurrency(budgetCap - totalCost, currency)} remaining cushion
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* 4 Category Breakdown Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Accommodation */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Stay & Lodging</span>
            <Bed className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-black text-slate-900">
            {formatCurrency(cost_breakdown.accommodation_total, currency)}
          </p>
          <p className="text-[11px] text-slate-600">
            {Math.round((cost_breakdown.accommodation_total / totalCost) * 100 || 0)}% of total trip
          </p>
        </div>

        {/* Dining */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Food & Dining</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-slate-900">
            {formatCurrency(cost_breakdown.dining_total, currency)}
          </p>
          <p className="text-[11px] text-slate-600">
            {Math.round((cost_breakdown.dining_total / totalCost) * 100 || 0)}% of total trip
          </p>
        </div>

        {/* Sightseeing & Activities */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sightseeing / Tours</span>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900">
            {formatCurrency(cost_breakdown.activities_total, currency)}
          </p>
          <p className="text-[11px] text-slate-600">
            {Math.round((cost_breakdown.activities_total / totalCost) * 100 || 0)}% of total trip
          </p>
        </div>

        {/* Local Transit */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Local Transit</span>
            <Navigation className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black text-slate-900">
            {formatCurrency(cost_breakdown.local_transit_total, currency)}
          </p>
          <p className="text-[11px] text-slate-600">
            {Math.round((cost_breakdown.local_transit_total / totalCost) * 100 || 0)}% of total trip
          </p>
        </div>

      </div>

    </div>
  );
}
