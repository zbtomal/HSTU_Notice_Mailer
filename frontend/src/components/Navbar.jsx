import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, BellRing, LogOut, User as UserIcon, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, openAuthModal }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand / Logo */}
          <div 
            onClick={() => setActiveTab('feed')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-bold shadow-glow group-hover:scale-105 transition-all duration-300">
              <Bell className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                  HSTU Notice Mailer
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Sparkles className="w-2.5 h-2.5" /> Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Instant university alerts in your inbox</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BellRing className="w-4 h-4" />
              Public Notices
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveTab('dashboard');
                } else {
                  openAuthModal('login');
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Subscriber Dashboard
            </button>
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-xs text-slate-300 hover:text-teal-300 transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="max-w-[140px] truncate font-medium">{user.email}</span>
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold text-slate-300 hover:text-rose-300 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-glow transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Get Alerts</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden justify-around py-2 border-t border-slate-800/60">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'feed' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            Notices
          </button>
          <button
            onClick={() => {
              if (isAuthenticated) setActiveTab('dashboard');
              else openAuthModal('login');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              activeTab === 'dashboard' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400'
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
