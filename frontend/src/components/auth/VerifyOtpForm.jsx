import React from 'react';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';

export default function VerifyOtpForm({
  otp, setOtp,
  handleVerify, loading,
  handleResendOtp, resendLoading,
  switchMode
}) {
  return (
    <form onSubmit={handleVerify} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">6-Digit Verification Code</label>
        <div className="relative">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 letter-spacing-2 font-mono font-bold tracking-widest text-center"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Verify & Activate Account
      </button>

      <div className="flex items-center justify-between pt-2 text-xs">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </button>

        <button
          type="button"
          disabled={resendLoading}
          onClick={handleResendOtp}
          className="font-bold text-teal-600 dark:text-teal-400 hover:underline disabled:opacity-50"
        >
          {resendLoading ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </form>
  );
}
