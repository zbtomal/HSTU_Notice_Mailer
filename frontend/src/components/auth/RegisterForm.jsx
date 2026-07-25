import React from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function RegisterForm({
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  handleRegister, loading,
  switchMode
}) {
  return (
    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
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

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
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
        Create Account
      </button>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => switchMode('login')}
          className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Sign in here
        </button>
      </div>
    </form>
  );
}
