import React from 'react';
import { X, Lock, KeyRound, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthActions } from '../hooks/useAuthActions';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import VerifyOtpForm from './auth/VerifyOtpForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccessLogin }) {
  const {
    mode,
    loading,
    resendLoading,
    error,
    setError,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    otp, setOtp,
    newPassword, setNewPassword,
    switchMode,
    handleLogin,
    handleRegister,
    handleVerify,
    handleResendOtp,
    handleForgotPassword,
    handleResetPassword,
  } = useAuthActions({ isOpen, initialMode, onClose, onSuccessLogin });

  if (!isOpen) return null;

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
          <div className="mb-5 p-3.5 rounded-2xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs flex items-start justify-between gap-3 animate-fade-in shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-800 dark:text-rose-300 mb-0.5">Authentication Error</p>
                <p className="text-rose-700 dark:text-rose-200/90 leading-relaxed">{error}</p>
                {error.toLowerCase().includes('inactive') && (
                  <button
                    type="button"
                    onClick={() => switchMode('verify')}
                    className="mt-2 inline-flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Enter 6-Digit Verification OTP →
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Render Sub-Form Component depending on mode */}
        {mode === 'login' && (
          <LoginForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            handleLogin={handleLogin} loading={loading}
            switchMode={switchMode}
          />
        )}

        {mode === 'register' && (
          <RegisterForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            handleRegister={handleRegister} loading={loading}
            switchMode={switchMode}
          />
        )}

        {mode === 'verify' && (
          <VerifyOtpForm
            otp={otp} setOtp={setOtp}
            handleVerify={handleVerify} loading={loading}
            handleResendOtp={handleResendOtp} resendLoading={resendLoading}
            switchMode={switchMode}
          />
        )}

        {(mode === 'forgot' || mode === 'reset') && (
          <ForgotPasswordForm
            mode={mode}
            email={email} setEmail={setEmail}
            otp={otp} setOtp={setOtp}
            newPassword={newPassword} setNewPassword={setNewPassword}
            handleForgotPassword={handleForgotPassword}
            handleResetPassword={handleResetPassword}
            loading={loading}
            switchMode={switchMode}
          />
        )}

      </div>
    </div>
  );
}
