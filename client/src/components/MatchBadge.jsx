import React, { useState } from 'react';
import { Check, Info, Sparkles } from 'lucide-react';

const MatchBadge = ({ compatibility, size = 'md' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!compatibility) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
        Sign in to view match
      </span>
    );
  }

  const score = compatibility.matchScore !== undefined ? compatibility.matchScore : (compatibility.overall || 50);
  const {
    matchedSkills = [],
    partialSkills = [],
    missingSkills = [],
    explanation,
    matchSummary,
    experienceMatch,
    educationMatch,
    locationMatch
  } = compatibility;

  // Professional calm color styling
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (score >= 75) {
    badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-600';
  } else if (score >= 60) {
    badgeClasses = 'bg-blue-50 text-blue-800 border-blue-200';
    dotColor = 'bg-blue-600';
  } else if (score >= 45) {
    badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-600';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center gap-1.5 rounded-md border transition-colors cursor-pointer ${badgeClasses} ${sizeClasses[size]}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
        <span>{score}% compatibility</span>
      </button>

      {/* Clean Interactive Compatibility Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-80 p-3.5 bg-slate-900 text-white text-xs rounded-xl shadow-2xl border border-slate-800 pointer-events-none">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-200 font-semibold">AI Compatibility Estimate</span>
            </div>
            <span className="font-bold text-white text-sm">{score}%</span>
          </div>

          <p className="text-[11px] text-slate-300 my-2 leading-relaxed">
            {explanation || matchSummary || 'Calculated based on your verified skills, experience, and education.'}
          </p>

          <div className="space-y-1.5 text-[11px] pt-1">
            {matchedSkills.length > 0 && (
              <div className="flex items-start gap-1.5">
                <span className="font-semibold text-emerald-400 shrink-0">✓ Strong:</span>
                <span className="text-slate-200">{matchedSkills.slice(0, 4).join(', ')}{matchedSkills.length > 4 ? ` +${matchedSkills.length - 4}` : ''}</span>
              </div>
            )}
            {partialSkills.length > 0 && (
              <div className="flex items-start gap-1.5">
                <span className="font-semibold text-blue-400 shrink-0">◐ Partial:</span>
                <span className="text-slate-200">{partialSkills.slice(0, 3).join(', ')}</span>
              </div>
            )}
            {missingSkills.length > 0 && (
              <div className="flex items-start gap-1.5">
                <span className="font-semibold text-amber-400 shrink-0">○ Skill gaps:</span>
                <span className="text-slate-200">{missingSkills.slice(0, 3).join(', ')}{missingSkills.length > 3 ? ` +${missingSkills.length - 3}` : ''}</span>
              </div>
            )}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>{experienceMatch?.status ? `Exp: ${experienceMatch.status}` : 'Multi-factor alignment'}</span>
            <span className="italic text-slate-500">Not a hiring guarantee</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchBadge;
