import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../translations';
import {
  Globe,
  Bell,
  User as UserIcon,
  ShieldCheck,
  Building2,
  FileText,
  MapPin,
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  Search,
  PlusCircle,
  Sun,
  Moon,
  Sliders,
  HelpCircle,
  Info,
  BarChart3,
  Check
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenProfile,
}) => {
  const {
    t,
    role,
    setRole,
    language,
    setLanguage,
    currentView,
    setCurrentView,
    activeNotificationCount,
    currentUser,
    isDarkMode,
    toggleTheme,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
      {/* Indian Civic Tricolor Accent Line */}
      <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-white dark:via-slate-700 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Emblem */}
          <div
            id="nav-logo"
            onClick={() => setCurrentView(role === 'CITIZEN' ? 'citizen-home' : 'authority-dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 p-0.5 shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                {/* Bridge (Setu) Civic Icon */}
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  className="w-6 h-6 text-orange-600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 22C9 14 23 14 28 22"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 18V25M16 15V25M24 18V25"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="9" r="2.5" fill="#f97316" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
                  JanSetu
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide hidden sm:block">
                Citizen Grievance Triage Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {role === 'CITIZEN' ? (
              <>
                <button
                  id="nav-citizen-home-btn"
                  onClick={() => setCurrentView('citizen-home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'citizen-home'
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.navHome}
                </button>
                <button
                  id="nav-report-btn"
                  onClick={() => setCurrentView('report')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'report'
                      ? 'bg-orange-600 text-white shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-orange-600 hover:bg-orange-50/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
                  {t.reportProblem}
                </button>
                <button
                  id="nav-track-btn"
                  onClick={() => setCurrentView('track')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'track'
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.navTrack}
                </button>
                <button
                  id="nav-my-complaints-btn"
                  onClick={() => setCurrentView('my-complaints')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'my-complaints'
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.navMyComplaints}
                </button>
                <button
                  id="nav-gis-map-btn"
                  onClick={() => setCurrentView('gis-map')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'gis-map'
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {t.navGisMap}
                </button>
                <button
                  id="nav-faq-btn"
                  onClick={() => setCurrentView('faq-help')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'faq-help'
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  FAQs
                </button>
                <button
                  id="nav-about-btn"
                  onClick={() => setCurrentView('landing')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'landing'
                      ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  How It Works
                </button>
              </>
            ) : (
              <>
                <button
                  id="nav-auth-dashboard-btn"
                  onClick={() => setCurrentView('authority-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'authority-dashboard'
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
                  {t.navAuthorityDashboard}
                </button>
                <button
                  id="nav-auth-complaints-btn"
                  onClick={() => setCurrentView('authority-complaints')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'authority-complaints'
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  Complaints Table
                </button>
                <button
                  id="nav-auth-clusters-btn"
                  onClick={() => setCurrentView('clusters')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'clusters'
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {t.navAiClusters}
                </button>
                <button
                  id="nav-auth-map-btn"
                  onClick={() => setCurrentView('gis-map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'gis-map'
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  {t.navGisMap}
                </button>
                <button
                  id="nav-auth-analytics-btn"
                  onClick={() => setCurrentView('authority-analytics')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'authority-analytics'
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                  Analytics
                </button>
                <button
                  id="nav-auth-settings-btn"
                  onClick={() => setCurrentView('settings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentView === 'settings'
                      ? 'bg-slate-900 text-white dark:bg-orange-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Role Switcher, Dark Mode, Accessibility, Language, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Role Switcher Pill */}
            <div className="hidden lg:flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                id="role-citizen-toggle"
                onClick={() => setRole('CITIZEN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  role === 'CITIZEN'
                    ? 'bg-white dark:bg-slate-900 text-orange-700 dark:text-orange-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserIcon className="w-3 h-3" />
                Citizen
              </button>
              <button
                id="role-authority-toggle"
                onClick={() => setRole('AUTHORITY')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  role === 'AUTHORITY'
                    ? 'bg-slate-900 dark:bg-orange-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Officer
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Accessibility & Settings Icon */}
            <button
              id="settings-nav-btn"
              onClick={() => setCurrentView('settings')}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                currentView === 'settings'
                  ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-600'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              title="Display & Accessibility Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="language-dropdown-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
                title="Change Indian Language"
              >
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
                <span className="sm:hidden uppercase font-mono">{currentLangObj.code}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>10 Indian Languages</span>
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                          language === lang.code
                            ? 'text-orange-600 dark:text-orange-400 bg-orange-50/70 dark:bg-slate-800 font-bold'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div>
                          <span className="text-sm block">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400">{lang.name}</span>
                        </div>
                        {language === lang.code && <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              id="notifications-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {activeNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {activeNotificationCount}
                </span>
              )}
            </button>

            {/* Profile Menu Button */}
            <button
              id="profile-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="My Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name?.slice(0, 1) || (role === 'AUTHORITY' ? 'O' : 'C')}
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 xl:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="py-2 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 mb-2">Switch Active Portal:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setRole('CITIZEN');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'CITIZEN'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                Citizen Portal
              </button>
              <button
                onClick={() => {
                  setRole('AUTHORITY');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'AUTHORITY'
                    ? 'bg-slate-900 text-white dark:bg-orange-600 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Authority Hub
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {role === 'CITIZEN' ? (
              <>
                <button
                  onClick={() => { setCurrentView('citizen-home'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'citizen-home' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  🏠 Home
                </button>
                <button
                  onClick={() => { setCurrentView('report'); setMobileMenuOpen(false); }}
                  className="p-2.5 rounded-xl text-left bg-orange-600 text-white font-bold"
                >
                  ➕ Report Issue
                </button>
                <button
                  onClick={() => { setCurrentView('track'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'track' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  🔎 Track Complaint
                </button>
                <button
                  onClick={() => { setCurrentView('my-complaints'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'my-complaints' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  📋 My Complaints
                </button>
                <button
                  onClick={() => { setCurrentView('gis-map'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'gis-map' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  🗺️ GIS Map
                </button>
                <button
                  onClick={() => { setCurrentView('faq-help'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'faq-help' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  ❓ FAQs & Help
                </button>
                <button
                  onClick={() => { setCurrentView('contact-support'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'contact-support' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  📞 Contact Support
                </button>
                <button
                  onClick={() => { setCurrentView('settings'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'settings' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  ⚙️ Settings & Text
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setCurrentView('authority-dashboard'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'authority-dashboard' ? 'bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  🏠 Dashboard
                </button>
                <button
                  onClick={() => { setCurrentView('authority-complaints'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'authority-complaints' ? 'bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  📋 Complaints Table
                </button>
                <button
                  onClick={() => { setCurrentView('clusters'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'clusters' ? 'bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  🧠 AI Clusters
                </button>
                <button
                  onClick={() => { setCurrentView('gis-map'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'gis-map' ? 'bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  🗺️ GIS Map
                </button>
                <button
                  onClick={() => { setCurrentView('authority-analytics'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'authority-analytics' ? 'bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  📊 SLA Analytics
                </button>
                <button
                  onClick={() => { setCurrentView('settings'); setMobileMenuOpen(false); }}
                  className={`p-2.5 rounded-xl text-left ${currentView === 'settings' ? 'bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  ⚙️ Settings
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
