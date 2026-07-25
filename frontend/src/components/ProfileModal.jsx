import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi, authApi } from '../api/client';
import { X, User, Lock, ShieldCheck, Loader2, Save, Mail, KeyRound } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, refreshUser, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'
  
  // Profile state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user?.full_name !== undefined) {
      setFullName(user.full_name || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // Handle Profile Name Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const res = await userApi.updateProfile(fullName.trim());
    setProfileLoading(false);

    if (res.ok) {
      await refreshUser();
      showToast('Profile updated successfully!', 'success');
      onClose();
    } else {
      showToast(res.error || 'Failed to update profile.', 'error');
    }
  };

  // Handle Password Change
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
      onClose();
    } else {
      showToast(res.error || 'Failed to change password. Check your old password.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-glow backdrop-blur-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-2">
            <User className="w-6 h-6" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-white tracking-tight">
            Account Settings
          </h2>

          <p className="text-xs text-slate-400">
            {user.email}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="p-1 mb-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'profile'
                ? 'bg-teal-500 text-slate-950 shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'security'
                ? 'bg-teal-500 text-slate-950 shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Security & Password
          </button>
        </div>

        {/* TAB 1: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jannatul Ferdous"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Displayed across your account notifications.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-sm cursor-not-allowed"
                />
                <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Status</label>
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified & Active Subscriber</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile Changes
            </button>
          </form>
        )}

        {/* TAB 2: Security Form */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
