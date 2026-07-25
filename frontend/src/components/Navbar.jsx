import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, BellRing, LogOut, User as UserIcon, LayoutDashboard, Sparkles, Settings, Sun, Moon } from 'lucide-react';

export default function Navbar({ openAuthModal, openProfileModal }) {
  const { user, isAuthenticated, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand / Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-glow group-hover:scale-105 transition-all duration-300 shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm xs:text-base sm:text-xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 dark:from-white dark:via-slate-100 dark:to-teal-200 bg-clip-text text-transparent whitespace-nowrap">
                  HSTU Notice Mailer
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  <Sparkles className="w-2.5 h-2.5" /> Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">Instant university alerts in your inbox</p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isFeed
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/50'
              }`}
            >
              <BellRing className="w-4 h-4" />
              Public Notices
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/dashboard');
                } else {
                  openAuthModal('login');
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isDashboard
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Subscriber Dashboard
            </button>
          </nav>

          {/* Auth Controls & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Theme Toggle Button (Sun / Moon) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-sm hover:scale-105"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-teal-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-3">
                
                {/* Clickable User Badge -> Opens Profile Modal */}
                <button
                  onClick={openProfileModal}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 text-xs text-slate-800 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-all cursor-pointer group shadow-sm"
                  title="Click to open Profile Settings & Change Password"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[120px] sm:max-w-[160px] truncate font-semibold group-hover:underline">{user.full_name || user.email}</span>
                  <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 group-hover:rotate-45 transition-transform" />
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/30 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-glow transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Get Alerts</span>
                  <span className="xs:hidden">Alerts</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden justify-around py-2 border-t border-slate-200 dark:border-slate-800/60">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isFeed 
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/30' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            Notices
          </button>
          <button
            onClick={() => {
              if (isAuthenticated) navigate('/dashboard');
              else navigate('/login');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDashboard 
                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/30' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>

      </div>
    </header>
  );
}
