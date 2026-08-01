import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Theme State: 'dark' | 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.setAttribute('data-theme', 'hstu');
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  // Helper to trigger toast messages
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch current user details when token changes or mounts
  const fetchUser = useCallback(async (authToken) => {
    const currentToken = authToken || token;
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const res = await authApi.getMe(currentToken);
    if (res.ok) {
      setUser(res.data);
    } else {
      console.warn('Token validation failed:', res.error);
      localStorage.removeItem('access_token');
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login handler with single-response user data & refresh token support
  const loginToken = async (access_token, userData = null, refresh_token = null) => {
    localStorage.setItem('access_token', access_token);
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token);
    }
    setToken(access_token);
    if (userData) {
      setUser(userData);
      setLoading(false);
    } else {
      await fetchUser(access_token);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    showToast('Successfully logged out.', 'info');
  };

  // Refresh user data (e.g. after subscribing/unsubscribing)
  const refreshUser = async () => {
    if (token) {
      const res = await authApi.getMe(token);
      if (res.ok) {
        setUser(res.data);
      }
    }
  };

  // Instant local user state updater for Optimistic UI updates (0ms feedback)
  const updateUserState = useCallback((updater) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return typeof updater === 'function' ? updater(prevUser) : { ...prevUser, ...updater };
    });
  }, []);

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!user && user.is_active,
    loginToken,
    logout,
    refreshUser,
    updateUserState,
    toast,
    showToast,
    hideToast,
    theme,
    toggleTheme,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
