import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LandingPage } from './components/LandingPage';
import { CitizenHome } from './components/CitizenHome';
import { ReportProblem } from './components/ReportProblem';
import { CitizenComplaintHistory } from './components/CitizenComplaintHistory';
import { TrackComplaint } from './components/TrackComplaint';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { AuthorityComplaintTable } from './components/AuthorityComplaintTable';
import { GisMap } from './components/GisMap';
import { AiClustersView } from './components/AiClustersView';
import { AuthorityAnalyticsView } from './components/AuthorityAnalyticsView';
import { FaqView } from './components/FaqView';
import { ContactHelpView } from './components/ContactHelpView';
import { PoliciesView } from './components/PoliciesView';
import { SettingsView } from './components/SettingsView';
import { NotificationModal } from './components/NotificationModal';
import { ProfileModal } from './components/ProfileModal';

const AppContent: React.FC = () => {
  const { currentView, role } = useApp();

  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [initialGrievanceText, setInitialGrievanceText] = useState('');

  const handleSelectQuickScenario = (text: string) => {
    setInitialGrievanceText(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white pb-16 md:pb-0 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenNotifications={() => setNotificationModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}

        {currentView === 'citizen-home' && (
          <CitizenHome onSelectQuickScenario={handleSelectQuickScenario} />
        )}

        {currentView === 'report' && (
          <ReportProblem
            initialGrievance={initialGrievanceText}
            onClearInitialGrievance={() => setInitialGrievanceText('')}
          />
        )}

        {currentView === 'my-complaints' && <CitizenComplaintHistory />}

        {currentView === 'track' && <TrackComplaint />}

        {currentView === 'authority-dashboard' && <AuthorityDashboard />}

        {currentView === 'authority-complaints' && <AuthorityComplaintTable />}

        {currentView === 'gis-map' && <GisMap />}

        {currentView === 'clusters' && <AiClustersView />}

        {currentView === 'authority-analytics' && <AuthorityAnalyticsView />}

        {currentView === 'faq-help' && <FaqView />}

        {currentView === 'contact-support' && <ContactHelpView />}

        {currentView === 'policies' && <PoliciesView />}

        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Modern JanSetu Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        onOpenNotifications={() => setNotificationModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Modals & Overlays */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

