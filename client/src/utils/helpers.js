export function formatSalary(min = 0, max = 0, currency = 'INR', period = 'per annum') {
  const formatNum = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} LPA`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (!min && !max) return 'Competitive / Disclosed on Interview';
  if (min && !max) return `${formatNum(min)}+ ${period}`;
  if (!min && max) return `Up to ${formatNum(max)} ${period}`;
  return `${formatNum(min)} - ${formatNum(max)} ${period}`;
}

export function formatDate(dateString) {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getMatchColor(score = 0) {
  if (score >= 80) return {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    bar: 'bg-emerald-500',
    text: 'text-emerald-700',
    label: 'High Match',
    gradient: 'from-emerald-500 to-teal-600',
  };
  if (score >= 65) return {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
    bar: 'bg-indigo-500',
    text: 'text-indigo-700',
    label: 'Good Match',
    gradient: 'from-indigo-500 to-blue-600',
  };
  if (score >= 45) return {
    badge: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    bar: 'bg-amber-500',
    text: 'text-amber-700',
    label: 'Moderate Match',
    gradient: 'from-amber-500 to-orange-500',
  };
  return {
    badge: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20',
    bar: 'bg-slate-400',
    text: 'text-slate-700',
    label: 'Growth Match',
    gradient: 'from-slate-500 to-zinc-600',
  };
}

export function getStatusBadge(status) {
  switch (status) {
    case 'Applied':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', step: 1 };
    case 'Under Review':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', step: 2 };
    case 'Shortlisted':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', step: 3 };
    case 'Interview':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', step: 4 };
    case 'Selected':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', step: 5 };
    case 'Rejected':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', step: 0 };
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', step: 1 };
  }
}
