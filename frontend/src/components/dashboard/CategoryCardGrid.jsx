import React from 'react';
import { Building2, Layers, Check, Loader2 } from 'lucide-react';

export default function CategoryCardGrid({
  departmentCategories,
  subscribedCategoryNames,
  togglingCategory,
  handleToggleSubscription,
  categoriesLoading
}) {
  if (categoriesLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse p-4" />
        ))}
      </div>
    );
  }

  if (departmentCategories.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center text-slate-500 dark:text-slate-400 text-xs">
        No specific categories found in system database.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
      {departmentCategories.map((cat) => {
        const isIndividualSubscribed = subscribedCategoryNames.has(cat.name) || subscribedCategoryNames.has('All');
        const isBusy = togglingCategory === cat.name;
        const isOfficeSection = cat.name === 'Office & Section' || cat.name === 'General';

        return (
          <div
            key={cat.id}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 gap-3 min-h-[90px] ${
              isIndividualSubscribed
                ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-950/20 text-slate-900 dark:text-white shadow-md shadow-teal-500/10'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 hover:border-teal-500/30 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                isIndividualSubscribed ? 'bg-teal-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {isOfficeSection ? <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400" /> : <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
              </div>
              <div className="min-w-0 space-y-0.5">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-tight break-words">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {isOfficeSection ? 'Administration & Official Notices' : isIndividualSubscribed ? 'Subscribed to emails' : 'Not subscribed'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggleSubscription(cat.name)}
              disabled={isBusy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                isIndividualSubscribed
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300'
              }`}
            >
              {isBusy ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isIndividualSubscribed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Subscribed
                </>
              ) : (
                '+ Subscribe'
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
