import React, { useState, useEffect } from 'react';
import { 
  getAdminSettings, 
  getSubmissions, 
  getCurrentUser, 
  setCurrentUser,
  saveAdminSettings 
} from './lib/storage';
import { AdminSettings, Submission, UserAccount } from './types';
import { Navbar } from './components/Navbar';
import { AnnouncementTicker } from './components/AnnouncementTicker';
import { PriceBanner } from './components/PriceBanner';
import { SubmissionForm } from './components/SubmissionForm';
import { PublicHistory } from './components/PublicHistory';
import { ChannelsSection } from './components/ChannelsSection';
import { Footer } from './components/Footer';
import { ShareWebModal } from './components/ShareWebModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AdminModal } from './components/AdminModal';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { TrackingModal } from './components/TrackingModal';

export default function App() {
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [submissions, setSubmissions] = useState<Submission[]>(getSubmissions());
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(getCurrentUser());

  // Modals state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Sync state on storage events
  useEffect(() => {
    const handleSync = () => {
      setSettings(getAdminSettings());
      setSubmissions(getSubmissions());
      setCurrentUserState(getCurrentUser());
    };

    window.addEventListener('storgmail888_sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('storgmail888_sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById('submission-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChannels = () => {
    const el = document.getElementById('saluran-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmissionSuccess = (newSub: Submission) => {
    setSelectedSubmission(newSub);
    setSubmissions(getSubmissions());
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar */}
      <Navbar
        settings={settings}
        currentUser={currentUser}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
        onOpenChannelsModal={handleOpenChannels}
        onLogoutUser={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Ticker & Prominent Announcement */}
        <AnnouncementTicker settings={settings} />

        {/* Pricing Tiers & Interactive Calculator */}
        <PriceBanner
          settings={settings}
          onScrollToForm={handleScrollToForm}
        />

        {/* Central Gmail Submission Form */}
        <SubmissionForm
          settings={settings}
          currentUser={currentUser}
          onSubmissionSuccess={handleSubmissionSuccess}
          onOpenChannelsModal={handleOpenChannels}
        />

        {/* Public Submission History & Payouts */}
        <PublicHistory
          submissions={submissions}
          onSelectSubmission={(sub) => setSelectedSubmission(sub)}
        />

        {/* Saluran & Community Links */}
        <ChannelsSection settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenChannelsModal={handleOpenChannels}
      />

      {/* MODALS */}
      {/* Share Web Link Modal */}
      <ShareWebModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        settings={settings}
      />

      {/* User Auth Modal (Buat Akun / Masuk) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Seller Dashboard Modal */}
      <UserDashboardModal
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
        user={currentUser}
        submissions={submissions}
        onSelectSubmission={(sub) => setSelectedSubmission(sub)}
        onUpdateUser={(updated) => setCurrentUserState(updated)}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        settings={settings}
        submissions={submissions}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        onSelectSubmission={(sub) => setSelectedSubmission(sub)}
      />

      {/* Invoice Detail / Receipt Modal */}
      <InvoiceDetailModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        submissions={submissions}
        onFoundSubmission={(sub) => setSelectedSubmission(sub)}
      />
    </div>
  );
}
