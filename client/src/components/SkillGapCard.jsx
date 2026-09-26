import React, { useState } from 'react';
import { BookOpen, Code, ExternalLink, ChevronRight, Check } from 'lucide-react';

const SkillGapCard = ({ breakdownItem, index }) => {
  const [expanded, setExpanded] = useState(index === 0);

  if (!breakdownItem) return null;

  const { skill, importance, whyItMatters, learningPath = {}, recommendedResources = [], practiceProject } = breakdownItem;

  const getImportanceBadge = (imp) => {
    if (imp === 'High') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header Bar */}
      <button 
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-600"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs" aria-hidden="true">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{skill}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getImportanceBadge(importance)}`}>
                {importance || 'Standard'} Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {whyItMatters || 'Requirement for target technical roles.'}
            </p>
          </div>
        </div>

        <div className="p-1 rounded text-slate-400">
          <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`} aria-hidden="true" />
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-100">
          
          {/* Why It Matters */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-1">Why this skill matters</h4>
            <p className="text-slate-600 leading-relaxed">{whyItMatters}</p>
          </div>

          {/* 3-Step Guided Learning Path */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Recommended Steps</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="font-semibold text-slate-900 block mb-1">1. Foundations</span>
                <p className="text-slate-500 text-[11px]">{learningPath.step1 || 'Understand syntax and paradigms.'}</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="font-semibold text-slate-900 block mb-1">2. Practice</span>
                <p className="text-slate-500 text-[11px]">{learningPath.step2 || 'Build small isolated proof of concepts.'}</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-white">
                <span className="font-semibold text-slate-900 block mb-1">3. Project Integration</span>
                <p className="text-slate-500 text-[11px]">{learningPath.step3 || 'Integrate into your portfolio projects.'}</p>
              </div>
            </div>
          </div>

          {/* Recommended Resources */}
          {recommendedResources.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-800 mb-2">Documentation & Guides</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendedResources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {res.type || 'Doc'}
                      </span>
                      <span className="font-medium text-slate-800 truncate">{res.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Portfolio Project */}
          {practiceProject && (
            <div className="p-4 rounded-lg bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-slate-200">Practice Project Idea</h4>
                <span className="text-[10px] text-slate-400">Portfolio Add-on</span>
              </div>
              <h5 className="font-semibold text-white">{practiceProject.title}</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">{practiceProject.description}</p>
              {practiceProject.deliverable && (
                <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Deliverable:</span> {practiceProject.deliverable}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SkillGapCard;
