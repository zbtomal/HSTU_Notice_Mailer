import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi, authApi } from '../api/client';
import { User, Bell, Check, Lock, ShieldCheck, Loader2, RefreshCw, AlertCircle, Layers } from 'lucide-react';

export default function Dashboard({ openAuthModal }) {
  const { user, isAuthenticated, refreshUser, showToast } = useAuth();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [togglingCategory, setTogglingCategory] = useState(null);

  // Password Change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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
          ? `Unsubscribed from ${categoryName} notices.` 
          : `Subscribed to ${categoryName} notice alerts!`,
        'success'
      );
    } else {
      showToast(res.error || 'Failed to update subscription.', 'error');
    }
    setTogglingCategory(null);
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }

    setPasswordLoading(true);
    const res = await authApi.changePassword(oldPassword, newPassword);
    setPasswordLoading(false);

    if (res.ok) {
      showToast('Password changed successfully!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.error || 'Failed to change password. Check your old password.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-16">

      {/* User Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-glow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xl shadow-glow">
              <User className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-bold text-white">{user.email}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Subscriber
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Subscribed to <span className="text-teal-300 font-bold">{subscribedCategoryNames.size}</span> category notification streams.
              </p>
            </div>
          </div>

          <button
            onClick={refreshUser}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-500/40 text-xs font-medium text-slate-300 hover:text-teal-300 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Account
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category Subscription Controls (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-400" />
                Manage Notice Categories
              </h2>
              <p className="text-xs text-slate-400">
                Toggle categories to receive instant email notifications whenever a notice in that department is published.
              </p>
            </div>
          </div>

          {/* Master Subscription Note */}
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">General Category Rule: </span>
              Subscribing to the <span className="font-bold underline">General</span> category acts as a master feed — you will receive emails for all general notices across the university!
            </div>
          </div>

          {/* Category List */}
          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-slate-400 text-xs">
              No categories found in system database.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const isSubscribed = subscribedCategoryNames.has(cat.name);
                const isBusy = togglingCategory === cat.name;

                return (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      isSubscribed
                        ? 'border-teal-500/40 bg-teal-950/20 text-white shadow-glow'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSubscribed ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-100">{cat.name}</h3>
                        <p className="text-[11px] text-slate-400">
                          {isSubscribed ? 'Subscribed to emails' : 'Not subscribed'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSubscription(cat.name)}
                      disabled={isBusy}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSubscribed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-teal-500/40 hover:text-teal-300'
                      }`}
                    >
                      {isBusy ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isSubscribed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
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

        {/* Change Password Form (1 Col) */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-400" />
              Change Password
            </h2>
            <p className="text-xs text-slate-400">
              Update your account password securely.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4 backdrop-blur-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-glow"
            >
              {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Update Password
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
