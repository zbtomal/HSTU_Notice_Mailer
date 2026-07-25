import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { X, Mail, Lock, KeyRound, ShieldCheck, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccessLogin }) {
  const { loginToken, showToast } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'verify' | 'forgot' | 'reset'
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Clear fields and error when switching mode
  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setNewPassword('');
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await authApi.login(email, password);
    setLoading(false);

    if (res.ok && res.data?.access_token) {
      await loginToken(res.data.access_token);
      showToast('Welcome back! Successfully signed in.', 'success');
      onClose();
      if (onSuccessLogin) onSuccessLogin();
    } else {
      const errorMsg = res.error || 'Invalid email or password. Please try again.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    const res = await authApi.register(email, password);
    setLoading(false);

    if (res.ok) {
      showToast('Account created! Please check your email for the 6-digit OTP code.', 'success');
      switchMode('verify');
    } else {
      const errorMsg = res.error || 'Registration failed.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Verify OTP Handler
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    if (!otp || otp.length < 4) {
      const msg = 'Please enter a valid 6-digit OTP code.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    const res = await authApi.verifyEmail(email, otp);
    setLoading(false);

    if (res.ok) {
      showToast('Email verified successfully! You can now log in.', 'success');
      switchMode('login');
    } else {
      const errorMsg = res.error || 'Invalid or expired OTP code.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    setError(null);
    if (!email) {
      const msg = 'Please enter your email.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    setResendLoading(true);
    const res = await authApi.resendOtp(email);
    setResendLoading(false);

    if (res.ok) {
      showToast('A new 6-digit OTP code has been sent to your email.', 'success');
    } else {
      const errorMsg = res.error || 'Failed to resend OTP code.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      const msg = 'Please enter your email address.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    const res = await authApi.forgotPassword(email);
    setLoading(false);

    if (res.ok) {
      showToast('Password reset code sent to your email address.', 'success');
      switchMode('reset');
    } else {
      const errorMsg = res.error || 'Failed to request password reset.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    if (newPassword.length < 6) {
      const msg = 'New password must be at least 6 characters.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    const res = await authApi.resetPassword(email, otp, newPassword);
    setLoading(false);

    if (res.ok) {
      showToast('Password reset successfully. Please log in with your new password.', 'success');
      switchMode('login');
    } else {
      const errorMsg = res.error || 'Failed to reset password.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 mb-2">
            {mode === 'login' && <Lock className="w-6 h-6" />}
            {mode === 'register' && <Sparkles className="w-6 h-6" />}
            {mode === 'verify' && <ShieldCheck className="w-6 h-6" />}
            {(mode === 'forgot' || mode === 'reset') && <KeyRound className="w-6 h-6" />}
          </div>

          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'verify' && 'Verify Your Email'}
            {mode === 'forgot' && 'Forgot Password'}
            {mode === 'reset' && 'Reset Password'}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'login' && 'Sign in to manage your notice subscriptions'}
            {mode === 'register' && 'Register to receive instant email notifications'}
            {mode === 'verify' && `Enter the 6-digit OTP code sent to ${email}`}
            {mode === 'forgot' && 'Enter your email to receive a password reset code'}
            {mode === 'reset' && 'Enter the OTP code and set your new password'}
          </p>
        </div>

        {/* Inline Error Alert Box */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl border border-rose-500/30 bg-rose-950/40 text-rose-200 text-xs flex items-start justify-between gap-3 animate-fade-in shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300 mb-0.5">Authentication Error</p>
                <p className="text-rose-200/90 leading-relaxed">{error}</p>
                {error.toLowerCase().includes('inactive') && (
                  <button
                    type="button"
                    onClick={() => switchMode('verify')}
                    className="mt-2 inline-flex items-center gap-1 font-bold text-teal-400 hover:underline"
                  >
                    Enter 6-Digit Verification OTP →
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="student@hstu.ac.bd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-teal-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-teal-400 font-semibold hover:underline"
              >
                Register
              </button>
            </div>
          </form>
        )}

        {/* Form: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="student@hstu.ac.bd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Account & Get Code
            </button>

            <div className="text-center pt-2 text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-teal-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Form: VERIFY OTP */}
        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Verification OTP</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.trim()); setError(null); }}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-center tracking-widest font-mono text-lg font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Verify Account
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </button>

              <button
                type="button"
                disabled={resendLoading}
                onClick={handleResendOtp}
                className="text-amber-400 hover:underline font-semibold disabled:opacity-50"
              >
                {resendLoading ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        {/* Form: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="student@hstu.ac.bd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Password Reset OTP
            </button>

            <div className="text-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Form: RESET PASSWORD */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Reset OTP Code</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.trim()); setError(null); }}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-center tracking-widest font-mono text-lg font-bold"
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
                  onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
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
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Reset Password
            </button>

            <div className="text-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-slate-400 hover:text-white inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Cancel & Back to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
