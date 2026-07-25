import React from 'react';
import { Bell } from 'lucide-react';

export default function FeedHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 dark:border-teal-500/30 bg-gradient-to-br from-amber-500/5 via-white to-cyan-500/10 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/30 p-6 sm:p-10 shadow-xl shadow-teal-500/5 dark:shadow-glow transition-all">
      
      {/* Background Ambient Light Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-teal-700 dark:text-emerald-300 border border-teal-200 dark:border-teal-500/30 text-xs font-semibold shadow-sm">
          <Bell className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>HSTU Official Announcement Portal</span>
        </div>
        
        {/* Heading matching user reference image */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Stay Ahead with Instant{' '}
          <span className="text-teal-600 dark:text-teal-400 font-extrabold">Notice</span>
          <br />
          <span className="text-teal-600 dark:text-cyan-400 font-extrabold">Aler</span>
          <span className="text-amber-500 dark:text-amber-300 font-extrabold">ts</span>
        </h1>
        
        {/* Subtitle Description */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-2xl">
          Automated scraping and direct email notifications for Hajee Mohammad Danesh Science and Technology University notices, filtered by your exact department and section.
        </p>
      </div>

    </section>
  );
}
