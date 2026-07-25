import React from 'react';
import { Mail, Lock, KeyRound, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordForm({
  mode,
  email, setEmail,
  otp, setOtp,
  newPassword, setNewPassword,
  handleForgotPassword, handleResetPassword,
  loading, switchMode
}) {
  if (mode === 'forgot') {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4 animate-fade-in">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@gmail.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Send Reset Code
        </button>

        <div className="pt-2 text-center text-xs">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">6-Digit Reset Code</label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 font-mono tracking-widest text-center font-bold"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Reset Password
      </button>

      <div className="pt-2 text-center text-xs">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </button>
      </div>
    </form>
  );
}
