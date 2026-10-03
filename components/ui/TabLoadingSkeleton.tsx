import React from "react";

export function TabLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 bg-slate-200 dark:bg-slate-800/60 rounded-3xl w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-800/60 rounded-2xl" />
        ))}
      </div>
      <div className="h-72 bg-slate-200 dark:bg-slate-800/60 rounded-3xl w-full" />
    </div>
  );
}
