import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/client';
import { User, Bell, Check, ShieldCheck, Loader2, RefreshCw, Layers, Mail, Settings, Sparkles, Building2 } from 'lucide-react';

export default function Dashboard({ openAuthModal, openProfileModal }) {
  const { user, isAuthenticated, refreshUser, showToast } = useAuth();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [togglingCategory, setTogglingCategory] = useState(null);

  // Load all categories on mount
  useEffect(() => {
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
        <h2 className="font-heading text-2xl font-bold text-white">Authentication Required</h2>
        <p className="text-sm text-slate-400">Please sign in to access your subscriber dashboard and manage notice alerts.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 transition-all shadow-glow"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Get active subscription names
  const subscribedCategoryNames = new Set(
    (user.subscriptions || []).map(sub => typeof sub === 'string' ? sub : sub.name)
  );

  const isAllSubscribed = subscribedCategoryNames.has('All');
  const isTogglingAll = togglingCategory === 'All';

  // Toggle Category Subscription
  const handleToggleSubscription = async (categoryName) => {
    setTogglingCategory(categoryName);
    const isCurrentlySubscribed = subscribedCategoryNames.has(categoryName);

    let res;
    if (isCurrentlySubscribed) {
      res = await userApi.unsubscribe(categoryName);
    } else {
      res = await userApi.subscribe(categoryName);
    }

    if (res.ok) {
      await refreshUser();
      showToast(
        isCurrentlySubscribed 
          ? `Unsubscribed from ${categoryName === 'All' ? 'All Notices' : categoryName} notices.` 
          : `Subscribed to ${categoryName === 'All' ? 'All Notices' : categoryName} notice alerts!`,
        'success'
      );
    } else {
      showToast(res.error || 'Failed to update subscription.', 'error');
    }
    setTogglingCategory(null);
  };

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }
    return email ? email[0].toUpperCase() : 'U';
  };

  // Filter categories to exclude 'All' from standard grid and sort alphabetically A-Z
  const departmentCategories = categories
    .filter(c => c.name !== 'All')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 pb-16">

      {/* User Header Summary Card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-glow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              onClick={openProfileModal}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-glow cursor-pointer hover:scale-105 transition-transform"
              title="Edit Profile"
            >
              {getInitials(user.full_name, user.email)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 
                  onClick={openProfileModal} 
                  className="font-heading text-xl sm:text-2xl font-bold text-white hover:text-teal-300 cursor-pointer transition-colors"
                >
                  {user.full_name ? user.full_name : user.email}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified Subscriber
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                {user.full_name && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {user.email}
                  </span>
                )}
                <span>•</span>
                <span>Subscribed to <strong className="text-teal-300">{subscribedCategoryNames.size}</strong> category feeds</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openProfileModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 text-xs font-semibold text-teal-300 transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              Edit Profile & Security
            </button>
            <button
              onClick={refreshUser}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-500/40 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync
            </button>
          </div>
        </div>
      </section>

      {/* Category Subscription Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-400" />
              Manage Notice Categories
            </h2>
            <p className="text-xs text-slate-400">
              Toggle categories to receive instant email notifications whenever a notice in that department is published.
            </p>
          </div>
        </div>

        {/* Master Subscription Banner */}
        <div className={`p-5 rounded-3xl border transition-all duration-300 ${
          isAllSubscribed
            ? 'border-teal-500/50 bg-gradient-to-r from-teal-950/40 via-cyan-950/30 to-slate-900/80 text-white shadow-glow'
            : 'border-slate-800 bg-slate-900/70 text-slate-300'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                isAllSubscribed ? 'bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 shadow-glow' : 'bg-slate-800 text-slate-400'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-white">All Notices (Master Feed)</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/20">Master Stream</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Receive email alerts for every single notice published across all faculties, departments, exams, and administration.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggleSubscription('All')}
              disabled={isTogglingAll}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                isAllSubscribed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/30'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-glow'
              }`}
            >
              {isTogglingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAllSubscribed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Subscribed to All
                </>
              ) : (
                '+ Subscribe to All Notices'
              )}
            </button>
          </div>
        </div>

        {/* Section Heading for Department / Specific Categories */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-400" />
            Specific Faculty & Department Categories
          </h3>

          {/* Category List */}
          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4" />
              ))}
            </div>
          ) : departmentCategories.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-slate-400 text-xs">
              No specific categories found in system database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {departmentCategories.map((cat) => {
                const isSubscribed = subscribedCategoryNames.has(cat.name);
                const isBusy = togglingCategory === cat.name;
                const isOfficeSection = cat.name === 'Office & Section' || cat.name === 'General';

                return (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 gap-3 min-h-[84px] ${
                      isSubscribed
                        ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-950/20 text-slate-900 dark:text-white shadow-md shadow-teal-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 hover:border-teal-500/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSubscribed ? 'bg-teal-500 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {isOfficeSection ? <Building2 className="w-4 h-4 text-amber-500 dark:text-amber-400" /> : <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h3 
                          className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate"
                          title={cat.name}
                        >
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {isOfficeSection ? 'Administration & Official Notices' : isSubscribed ? 'Subscribed to emails' : 'Not subscribed'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSubscription(cat.name)}
                      disabled={isBusy}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                        isSubscribed
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300'
                      }`}
                    >
                      {isBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isSubscribed ? (
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
