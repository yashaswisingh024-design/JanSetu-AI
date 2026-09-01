import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  PlusCircle,
  FileText,
  Bell,
  User as UserIcon,
  LayoutDashboard,
  MapPin,
  BarChart3,
  Sliders,
  Sparkles
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenNotifications,
  onOpenProfile
}) => {
  const { role, currentView, setCurrentView, activeNotificationCount } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-2xl transition-colors">
      <div className="flex items-center justify-around">
        {role === 'CITIZEN' ? (
          <>
            <button
              id="mobile-nav-home"
              onClick={() => setCurrentView('citizen-home')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'citizen-home'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Home</span>
            </button>

            <button
              id="mobile-nav-report"
              onClick={() => setCurrentView('report')}
              className="flex flex-col items-center justify-center -mt-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-white dark:ring-slate-900 hover:scale-105 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mt-1">Report</span>
            </button>

            <button
              id="mobile-nav-complaints"
              onClick={() => setCurrentView('my-complaints')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'my-complaints'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Complaints</span>
            </button>

            <button
              id="mobile-nav-notifications"
              onClick={onOpenNotifications}
              className="relative flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {activeNotificationCount > 0 && (
                <span className="absolute top-1 right-3 w-3.5 h-3.5 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {activeNotificationCount}
                </span>
              )}
              <span className="text-[10px] mt-0.5">Alerts</span>
            </button>

            <button
              id="mobile-nav-profile"
              onClick={onOpenProfile}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Profile</span>
            </button>
          </>
        ) : (
          <>
            <button
              id="mobile-nav-dashboard"
              onClick={() => setCurrentView('authority-dashboard')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'authority-dashboard'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Command</span>
            </button>

            <button
              id="mobile-nav-auth-complaints"
              onClick={() => setCurrentView('authority-complaints')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'authority-complaints'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Complaints</span>
            </button>

            <button
              id="mobile-nav-auth-map"
              onClick={() => setCurrentView('gis-map')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'gis-map'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">GIS Map</span>
            </button>

            <button
              id="mobile-nav-auth-analytics"
              onClick={() => setCurrentView('authority-analytics')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'authority-analytics'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Analytics</span>
            </button>

            <button
              id="mobile-nav-auth-settings"
              onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'settings'
                  ? 'text-orange-600 dark:text-orange-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Settings</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
