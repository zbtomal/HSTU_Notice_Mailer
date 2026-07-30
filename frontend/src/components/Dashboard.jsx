import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/client';
import { Bell, ShieldCheck, Trash2, Building2 } from 'lucide-react';
import DashboardHeader from './dashboard/DashboardHeader';
import MasterFeedBanner from './dashboard/MasterFeedBanner';
import CategoryCardGrid from './dashboard/CategoryCardGrid';

export default function Dashboard({ openAuthModal, openProfileModal }) {
  const { user, isAuthenticated, updateUserState, showToast } = useAuth();
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

  // Active subscription names set
  const subscribedCategoryNames = new Set(
    (user.subscriptions || []).map(sub => typeof sub === 'string' ? sub : sub.name)
  );

  // Exclude 'All' from department list
  const departmentCategories = categories
    .filter(c => c.name !== 'All')
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalDeptCount = departmentCategories.length;
  const subscribedDeptCount = departmentCategories.filter(c => subscribedCategoryNames.has(c.name)).length;

  // Master "All" is active if 'All' is in subscriptions OR if all individual department categories are subscribed
  const isAllSubscribed = subscribedCategoryNames.has('All') || (totalDeptCount > 0 && subscribedDeptCount === totalDeptCount);

  // Handlers with Optimistic 0ms UI Updates
  const handleSubscribeAll = async () => {
    const previousSubscriptions = user.subscriptions;
    updateUserState({ subscriptions: categories });
    showToast('Subscribed to ALL notice categories!', 'success');

    setIsTogglingAll(true);
    const res = await userApi.subscribeAll();
    setIsTogglingAll(false);

    if (!res.ok) {
      updateUserState({ subscriptions: previousSubscriptions });
      showToast(res.error || 'Failed to subscribe to all categories.', 'error');
    }
  };

  const handleUnsubscribeAll = async () => {
    const previousSubscriptions = user.subscriptions;
    updateUserState({ subscriptions: [] });
    showToast('Unsubscribed from all notice categories.', 'info');

    setIsTogglingAll(true);
    const res = await userApi.unsubscribeAll();
    setIsTogglingAll(false);

    if (!res.ok) {
      updateUserState({ subscriptions: previousSubscriptions });
      showToast(res.error || 'Failed to unsubscribe from all categories.', 'error');
    }
  };

  const handleToggleSubscription = async (categoryName) => {
    const previousSubscriptions = user.subscriptions || [];
    const isCurrentlySubscribed = subscribedCategoryNames.has(categoryName);
    
    let newSubs;
    if (isCurrentlySubscribed) {
      newSubs = previousSubscriptions.filter(s => (typeof s === 'string' ? s : s.name) !== categoryName && (typeof s === 'string' ? s : s.name) !== 'All');
    } else {
      const catObj = categories.find(c => c.name === categoryName) || { name: categoryName };
      newSubs = [...previousSubscriptions, catObj];
    }

    // Instant 0ms Optimistic UI Update
    updateUserState({ subscriptions: newSubs });
    showToast(
      isCurrentlySubscribed 
        ? `Unsubscribed from ${categoryName}.` 
        : `Subscribed to ${categoryName} alerts!`,
      'success'
    );

    setTogglingCategory(categoryName);
    let res;
    if (isCurrentlySubscribed) {
      if (subscribedCategoryNames.has('All')) {
        await userApi.unsubscribe('All');
      }
      res = await userApi.unsubscribe(categoryName);
    } else {
      res = await userApi.subscribe(categoryName);
    }
    setTogglingCategory(null);

    if (!res.ok) {
      updateUserState({ subscriptions: previousSubscriptions });
      showToast(res.error || 'Failed to update subscription.', 'error');
    }
  };

  const handleToggleEmailPause = async () => {
    const previousPauseState = user.is_email_paused;
    const newPauseState = !previousPauseState;

    // Instant 0ms Optimistic UI Update
    updateUserState({ is_email_paused: newPauseState });
    showToast(
      newPauseState 
        ? 'Email notifications paused. You will not receive emails until resumed.' 
        : 'Email notifications resumed! You will receive new notice alerts.',
      'info'
    );

    setPauseLoading(true);
    const res = await userApi.updateProfile(undefined, newPauseState);
    setPauseLoading(false);

    if (!res.ok) {
      updateUserState({ is_email_paused: previousPauseState });
      showToast(res.error || 'Failed to update notification status.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-16">

      {/* User Header Summary Card Sub-component */}
      <DashboardHeader
        user={user}
        openProfileModal={openProfileModal}
        handleToggleEmailPause={handleToggleEmailPause}
        pauseLoading={pauseLoading}
        subscribedCategoryCount={subscribedCategoryNames.size}
      />

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

        {/* Master "All Notices" Subscription Banner Sub-component */}
        <MasterFeedBanner
          isAllSubscribed={isAllSubscribed}
          handleSubscribeAll={handleSubscribeAll}
          handleUnsubscribeAll={handleUnsubscribeAll}
          isTogglingAll={isTogglingAll}
        />

        {/* Section Heading & Category Cards Grid Sub-component */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-500" />
              Specific Faculty & Department Categories ({subscribedDeptCount}/{totalDeptCount} Subscribed)
            </h3>
          </div>

          <CategoryCardGrid
            departmentCategories={departmentCategories}
            subscribedCategoryNames={subscribedCategoryNames}
            togglingCategory={togglingCategory}
            handleToggleSubscription={handleToggleSubscription}
            categoriesLoading={categoriesLoading}
          />
        </div>
      </div>

    </div>
  );
}
