import React from 'react';
import { Sparkles, CheckCheck, Loader2 } from 'lucide-react';

export default function MasterFeedBanner({
  isAllSubscribed,
  handleSubscribeAll,
  handleUnsubscribeAll,
  isTogglingAll
}) {
  return (
    <div className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${
      isAllSubscribed
        ? 'border-teal-500/60 bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 dark:from-teal-950/40 dark:via-cyan-950/30 dark:to-slate-900/80 text-slate-900 dark:text-white shadow-lg shadow-teal-500/10 dark:shadow-glow'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 text-slate-800 dark:text-slate-300 shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
            isAllSubscribed 
              ? 'bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 shadow-md' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">All Notices (Master Feed)</h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30">
                Master Stream
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Receive email alerts for every single notice published across all faculties, departments, exams, and administration.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isAllSubscribed ? (
            <button
              onClick={handleUnsubscribeAll}
              disabled={isTogglingAll}
              aria-label="Unsubscribe from all notices"
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 bg-emerald-600 dark:bg-emerald-500/20 text-white dark:text-emerald-300 border border-emerald-700 dark:border-emerald-500/40 hover:bg-rose-600 dark:hover:bg-rose-950/40 hover:text-white dark:hover:text-rose-300 shadow-md transition-all cursor-pointer"
            >
              {isTogglingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCheck className="w-4 h-4" />
                  <span>Subscribed to All</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSubscribeAll}
              disabled={isTogglingAll}
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-md transition-all cursor-pointer"
            >
              {isTogglingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>+ Subscribe to All Notices</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
