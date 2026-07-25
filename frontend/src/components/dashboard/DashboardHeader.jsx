import React from 'react';
import { Mail, Settings, Pause, Play, Loader2 } from 'lucide-react';

export default function DashboardHeader({
  user,
  openProfileModal,
  handleToggleEmailPause,
  pauseLoading,
  subscribedCategoryCount
}) {
  const getInitials = (name, email) => {
    if (name && name.trim()) {
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-glow transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 min-w-0">
          <div 
            onClick={openProfileModal}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-extrabold text-xl sm:text-2xl flex items-center justify-center shadow-glow shrink-0 cursor-pointer hover:scale-105 transition-transform"
            title="Click to edit profile"
          >
            {getInitials(user.full_name, user.email)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 
                onClick={openProfileModal} 
                className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 cursor-pointer transition-colors truncate"
              >
                {user.full_name ? user.full_name : user.email}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Subscriber
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              {user.full_name && (
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
              )}
              <span className="hidden sm:inline">•</span>
              <span>Subscribed to <strong className="text-teal-600 dark:text-teal-300">{subscribedCategoryCount}</strong> category feeds</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Profile Edit & Email Pause Toggle */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          
          {/* Email Notifications Pause/Resume Toggle Button */}
          <button
            onClick={handleToggleEmailPause}
            disabled={pauseLoading}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              user.is_email_paused
                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                : 'bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/20'
            }`}
            title={user.is_email_paused ? "Click to resume email alerts" : "Click to temporarily pause email alerts"}
          >
            {pauseLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : user.is_email_paused ? (
              <Play className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Pause className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            )}
            <span>{user.is_email_paused ? 'Resume Alerts' : 'Pause Alerts'}</span>
          </button>

          {/* Profile Settings Modal Trigger */}
          <button
            onClick={openProfileModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-teal-500/40 text-xs font-semibold text-slate-800 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </section>
  );
}
