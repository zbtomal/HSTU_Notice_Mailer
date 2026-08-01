import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NoticeFeed from './components/NoticeFeed';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import Toast from './components/Toast';
import { ExternalLink, ShieldCheck } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync /login and /register URL paths with AuthModal
  useEffect(() => {
    if (location.pathname === '/login') {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
      }
    } else if (location.pathname === '/register') {
      if (isAuthenticated) {
        navigate('/dashboard', { replace: true });
      } else {
        setAuthModalMode('register');
        setIsAuthModalOpen(true);
      }
    }
  }, [location.pathname, isAuthenticated, navigate]);

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    if (location.pathname === '/login' || location.pathname === '/register') {
      navigate('/', { replace: true });
    }
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 bg-radial-glow bg-no-repeat bg-top overflow-x-hidden w-full">
      
      {/* Toast Notification Container */}
      <Toast />

      {/* Navigation Header */}
      <Navbar 
        openAuthModal={openAuthModal} 
        openProfileModal={openProfileModal}
      />

      {/* Main Container with React Router Routes */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-12 overflow-x-hidden">
        <Routes>
          <Route 
            path="/" 
            element={<NoticeFeed openAuthModal={openAuthModal} />} 
          />
          <Route 
            path="/login" 
            element={<NoticeFeed openAuthModal={openAuthModal} />} 
          />
          <Route 
            path="/register" 
            element={<NoticeFeed openAuthModal={openAuthModal} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                openAuthModal={openAuthModal} 
                openProfileModal={openProfileModal}
              />
            } 
          />
          <Route 
            path="/privacy" 
            element={<PrivacyPolicy />} 
          />
          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Auth Modal Container */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onSuccessLogin={() => navigate('/dashboard', { replace: true })}
      />

      {/* Profile & Account Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950/90 backdrop-blur-md py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-heading font-bold text-slate-900 dark:text-slate-200">HSTU Notice Mailer</span>
              <span className="hidden sm:inline">•</span>
              <span>Hajee Mohammad Danesh Science & Technology University</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <Link
                to="/privacy"
                className="hover:text-teal-600 dark:hover:text-teal-300 flex items-center gap-1 transition-colors font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
              </Link>
              <span>•</span>
              <a 
                href="https://hstu.ac.bd/page/notice_all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-600 dark:hover:text-teal-300 flex items-center gap-1 transition-colors font-medium"
              >
                HSTU Official Notices <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-900 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <span>Built with ❤️ for the HSTU Community by</span>
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              Jannatul Ferdaous, Ashikur Rahman & Zikrul Bari Tomal
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
