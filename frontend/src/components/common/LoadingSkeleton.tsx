import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full bg-slate-100 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
        <div className="h-4 w-28 bg-slate-200 rounded"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-4 flex items-center justify-between space-x-4">
            <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/6 bg-slate-200 rounded"></div>
            <div className="h-4 w-1/6 bg-slate-200 rounded"></div>
            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-8 w-16 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm animate-pulse space-y-6">
      <div className="space-y-3">
        <div className="h-7 w-2/3 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-16 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
        <div className="h-3 w-full bg-slate-100 rounded"></div>
        <div className="h-3 w-full bg-slate-100 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
      </div>
    </div>
  );
};
