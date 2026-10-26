export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null) return '$0';
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
  };
  const sym = symbols[currency] || currency + ' ';
  return `${sym}${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDateRange(startDate, endDate) {
  if (!startDate) return '';
  const d1 = new Date(startDate);
  const d2 = endDate ? new Date(endDate) : d1;
  const options = { month: 'short', day: 'numeric' };
  const str1 = d1.toLocaleDateString('en-US', options);
  const str2 = d2.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  return `${str1} - ${str2}`;
}

export function getCategoryBadgeClass(category) {
  switch (category?.toLowerCase()) {
    case 'sightseeing':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'dining':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'culture':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'nature':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'adventure':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'wellness':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'nightlife':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
