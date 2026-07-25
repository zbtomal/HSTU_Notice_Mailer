import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/client';
import { 
  Bell, Check, RefreshCw, Layers, ShieldCheck, 
  Settings, Loader2, Sparkles, Building2, Mail, 
  Pause, Play, Trash2, CheckCheck 
} from 'lucide-react';

export default function Dashboard({ openAuthModal, openProfileModal }) {
  const { user, isAuthenticated, refreshUser, showToast } = useAuth();
  const [togglingCategory, setTogglingCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);

  // Fetch all available categories
  React.useEffect(() => {
    async function loadCategories() {
      if (!isAuthenticated) return;
      setCategoriesLoading(true);
      const res = await userApi.getCategories();
      if (res.ok && Array.isArray(res.data)) {
        setCategories(res.data);
      }
      setCategoriesLoading(false);
    }
    loadCategories();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-teal-400 mx-auto" />
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please sign in to access your subscriber dashboard and manage notice alerts.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 transition-all shadow-glow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Get active subscription names set
  const subscribedCategoryNames = new Set(
    (user.subscriptions || []).map(sub => typeof sub === 'string' ? sub : sub.name)
  );

  // Exclude 'All' from department category list
  const departmentCategories = categories
    .filter(c => c.name !== 'All')
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalDeptCount = departmentCategories.length;
  const subscribedDeptCount = departmentCategories.filter(c => subscribedCategoryNames.has(c.name)).length;

  // Master "All" is active if 'All' is in subscriptions OR if all individual department categories are subscribed
  const isAllSubscribed = subscribedCategoryNames.has('All') || (totalDeptCount > 0 && subscribedDeptCount === totalDeptCount);

  // Handler: Subscribe to All
  const handleSubscribeAll = async () => {
    setIsTogglingAll(true);
    const res = await userApi.subscribeAll();
    setIsTogglingAll(false);

    if (res.ok) {
      await refreshUser();
      showToast('Subscribed to ALL notice categories!', 'success');
    } else {
      showToast(res.error || 'Failed to subscribe to all categories.', 'error');
    }
  };

  // Handler: Unsubscribe from All
  const handleUnsubscribeAll = async () => {
    setIsTogglingAll(true);
    const res = await userApi.unsubscribeAll();
    setIsTogglingAll(false);

    if (res.ok) {
      await refreshUser();
      showToast('Unsubscribed from all notice categories.', 'info');
    } else {
      showToast(res.error || 'Failed to unsubscribe from all categories.', 'error');
    }
  };

  // Handler: Toggle Individual Category
  const handleToggleSubscription = async (categoryName) => {
    setTogglingCategory(categoryName);
    const isCurrentlySubscribed = subscribedCategoryNames.has(categoryName);

    let res;
    if (isCurrentlySubscribed) {
      // If user was subscribed to 'All', we also remove 'All' master flag when unticking a single category
      if (subscribedCategoryNames.has('All')) {
        await userApi.unsubscribe('All');
      }
      res = await userApi.unsubscribe(categoryName);
    } else {
      res = await userApi.subscribe(categoryName);
    }

    if (res.ok) {
      await refreshUser();
      showToast(
        isCurrentlySubscribed 
          ? `Unsubscribed from ${categoryName}.` 
          : `Subscribed to ${categoryName} alerts!`,
        'success'
      );
    } else {
      showToast(res.error || 'Failed to update subscription.', 'error');
    }
    setTogglingCategory(null);
  };

  // Handler: Toggle Email Notification Pause Status
  const handleToggleEmailPause = async () => {
    setPauseLoading(true);
    const newPauseState = !user.is_email_paused;
    const res = await userApi.updateProfile(undefined, newPauseState);
    setPauseLoading(false);

    if (res.ok) {
      await refreshUser();
      showToast(
        newPauseState 
          ? 'Email notifications paused. You will not receive emails until resumed.' 
          : 'Email notifications resumed! You will receive new notice alerts.',
        'info'
      );
    } else {
      showToast(res.error || 'Failed to update notification status.', 'error');
    }
  };

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  return (
    <div className="space-y-8 pb-16">

      {/* User Header Summary Card */}
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
                <span>Subscribed to <strong className="text-teal-600 dark:text-teal-300">{subscribedCategoryNames.size}</strong> category feeds</span>
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

      {/* Category Subscription Controls */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-500 dark:text-teal-400" />
              Manage Notice Categories
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Toggle categories to receive instant email notifications whenever a notice in that department is published.
            </p>
          </div>

          {/* Quick Action: Unsubscribe All Button */}
          {subscribedCategoryNames.size > 0 && (
            <button
              onClick={handleUnsubscribeAll}
              disabled={isTogglingAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Unsubscribe All
            </button>
          )}
        </div>

        {/* Master "All Notices" Subscription Banner (Light Mode & Dark Mode High Contrast) */}
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

        {/* Section Heading for Specific Categories */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-500" />
              Specific Faculty & Department Categories ({subscribedDeptCount}/{totalDeptCount} Subscribed)
            </h3>
          </div>

          {/* Category Cards Grid */}
          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse p-4" />
              ))}
            </div>
          ) : departmentCategories.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center text-slate-500 dark:text-slate-400 text-xs">
              No specific categories found in system database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {departmentCategories.map((cat) => {
                // Individual card is considered subscribed if user has 'All' OR has this specific category
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
          )}
        </div>
      </div>

    </div>
  );
}
