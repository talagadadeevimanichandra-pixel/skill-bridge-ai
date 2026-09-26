import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
              <div className="space-y-2">
                <div className="w-48 h-4 bg-slate-200 rounded"></div>
                <div className="w-28 h-3 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
          </div>
          <div className="w-full h-12 bg-slate-100 rounded"></div>
          <div className="flex gap-2">
            <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
            <div className="w-20 h-5 bg-slate-200 rounded-full"></div>
            <div className="w-24 h-5 bg-slate-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
        <div className="w-32 h-4 bg-slate-200 rounded"></div>
        <div className="w-20 h-4 bg-slate-200 rounded"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200"></div>
              <div className="space-y-1.5">
                <div className="w-36 h-3.5 bg-slate-200 rounded"></div>
                <div className="w-24 h-2.5 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSkeleton;
