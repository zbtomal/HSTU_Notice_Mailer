import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import NoticeFeed from './components/NoticeFeed';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import Toast from './components/Toast';
import { ExternalLink } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'dashboard'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 bg-radial-glow bg-no-repeat bg-top">
      
      {/* Toast Notification Container */}
      <Toast />

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAuthModal={openAuthModal} 
        openProfileModal={openProfileModal}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {activeTab === 'feed' && (
          <NoticeFeed openAuthModal={openAuthModal} />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard 
            openAuthModal={openAuthModal} 
            openProfileModal={openProfileModal}
          />
        )}
      </main>

      {/* Auth Modal Container */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onSuccessLogin={() => setActiveTab('dashboard')}
      />

      {/* Profile & Account Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-heading font-bold text-slate-200">HSTU Notice Mailer</span>
              <span>•</span>
              <span>Hajee Mohammad Danesh Science & Technology University</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <a 
                href="https://hstu.ac.bd/page/notice_all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-300 flex items-center gap-1 transition-colors"
              >
                HSTU Official Notices <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-slate-900 text-center text-[11px] text-slate-500">
            Powered by FastAPI Async Scraper & React Tailwind UI
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
