import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';

export function useAuthActions({ isOpen, initialMode = 'login', onClose, onSuccessLogin }) {
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
      await loginToken(res.data.access_token, res.data.user, res.data.refresh_token);
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
    const res = await authApi.verifyEmail(email, otp.trim());
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
    setResendLoading(true);
    const res = await authApi.resendOtp(email);
    setResendLoading(false);

    if (res.ok) {
      showToast('New verification code sent to your email.', 'success');
    } else {
      const errorMsg = res.error || 'Failed to resend verification code.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await authApi.forgotPassword(email);
    setLoading(false);

    if (res.ok) {
      showToast('Password reset code sent to your email.', 'success');
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
    if (newPassword.length < 6) {
      const msg = 'New password must be at least 6 characters.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    const res = await authApi.resetPassword(email, otp.trim(), newPassword);
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

  return {
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
  };
}
