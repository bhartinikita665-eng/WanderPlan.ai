import React, { useState } from 'react';
import { X, CheckSquare, Square, Plus, Sparkles, Luggage } from 'lucide-react';

export default function PackingListModal({ isOpen, onClose, trip }) {
  const [items, setItems] = useState(
    (trip?.packing_suggestions || []).map((text, id) => ({ id, text, checked: false }))
  );
  const [newItem, setNewItem] = useState('');

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setItems(items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([...items, { id: Date.now(), text: newItem.trim(), checked: false }]);
    setNewItem('');
  };

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Luggage className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Intelligent Checklist
          </span>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-1">
          Packing List for {trip.destination}
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Tailored to the weather, walking routes, and specific activities on this trip.
        </p>

        {/* Progress bar */}
        <div className="mb-4 bg-slate-100 rounded-full p-1 flex items-center justify-between text-xs font-bold text-slate-700 px-3">
          <span>Packed: {checkedCount} / {items.length} items</span>
          <span>{Math.round((checkedCount / (items.length || 1)) * 100)}%</span>
        </div>

        {/* Checklist */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-4">
          {items.map((it) => (
            <div
              key={it.id}
              onClick={() => toggleCheck(it.id)}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                it.checked
                  ? 'bg-slate-50 border-slate-200 text-slate-600 line-through'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-teal-400'
              }`}
            >
              {it.checked ? (
                <CheckSquare className="w-4 h-4 text-teal-600 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-medium">{it.text}</span>
            </div>
          ))}
        </div>

        {/* Add custom item */}
        <form onSubmit={handleAddItem} className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add personalized item..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/30"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </form>

      </div>
    </div>
  );
}
