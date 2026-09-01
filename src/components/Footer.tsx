import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../translations';
import {
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe,
  HelpCircle,
  FileText,
  Lock,
  Layers,
  MapPin,
  Flame,
  CheckCircle2,
  ExternalLink,
  Phone,
  Mail,
  Info,
  Laptop,
} from 'lucide-react';
import { LanguageCode } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentView, setLanguage, language, setRole, role } = useApp();

  // Mobile accordion open states
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleAccordion = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Top Slim Government-Style Civic Information Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-3 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-slate-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <Laptop className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              JanSetu AI is compatible with modern browsers including{' '}
              <strong className="text-slate-200">Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Hackathon Prototype &bull; Designed for Indian Municipal Grievance Triage</span>
          </div>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Desktop & Tablet Grid (Hidden on small mobile accordion) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-1 space-y-4">
            <div
              onClick={() => setCurrentView(role === 'CITIZEN' ? 'citizen-home' : 'authority-dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-emerald-600 p-0.5 shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center">
                  <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-orange-500" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 22C9 14 23 14 28 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 18V25M16 15V25M24 18V25" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="9" r="2.5" fill="#f97316" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-display">
                  JanSetu
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-600 text-white uppercase tracking-wider">
                  AI
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-orange-400 italic">
              “Your problem. Our AI. Faster action.”
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              A citizen-first AI platform for reporting and managing civic problems across municipal departments.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                <Sparkles className="w-3.5 h-3.5" />
                Gemini 2.5 Multi-lingual
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('citizen-home')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('report')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Report a Problem
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Track Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('my-complaints')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  My Complaints
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq-help')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  FAQs / Help
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('landing')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  About JanSetu / How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Citizen Services */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2">
              Citizen Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('report')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Voice & Photo Grievance Filing
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Live Status Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('my-complaints')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Complaint History & Receipts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('gis-map')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  City-wide GIS Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('settings')}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Accessibility & Display Settings
                </button>
              </li>
            </ul>
          </div>

          {/* For Authorities */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2">
              For Authorities
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setRole('AUTHORITY');
                    setCurrentView('authority-dashboard');
                  }}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer font-medium text-amber-300"
                >
                  Authority Command Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('AUTHORITY');
                    setCurrentView('authority-complaints');
                  }}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Grievance Triage Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('AUTHORITY');
                    setCurrentView('clusters');
                  }}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  AI Issue Clusters & Work Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('AUTHORITY');
                    setCurrentView('gis-map');
                  }}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  GIS Hotspot Density Zones
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setRole('AUTHORITY');
                    setCurrentView('authority-analytics');
                  }}
                  className="hover:text-orange-400 transition-colors text-slate-400 hover:underline cursor-pointer"
                >
                  Municipal SLA Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Languages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>10 Indian Languages</span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-left transition-colors truncate cursor-pointer ${
                    language === lang.code
                      ? 'bg-orange-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Stacked Accordion */}
        <div className="md:hidden space-y-3 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-2 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                JS
              </div>
              <span className="font-extrabold text-white text-base">JanSetu AI</span>
            </div>
            <p className="text-xs text-slate-400 italic">
              “Your problem. Our AI. Faster action.”
            </p>
          </div>

          {/* Quick Links Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('quick')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 bg-slate-800/60"
            >
              <span>Quick Links</span>
              {openSection === 'quick' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSection === 'quick' && (
              <div className="p-3 bg-slate-900 space-y-2 text-xs">
                <button onClick={() => setCurrentView('citizen-home')} className="block text-slate-400 hover:text-white">Home</button>
                <button onClick={() => setCurrentView('report')} className="block text-slate-400 hover:text-white">Report a Problem</button>
                <button onClick={() => setCurrentView('track')} className="block text-slate-400 hover:text-white">Track Complaint</button>
                <button onClick={() => setCurrentView('my-complaints')} className="block text-slate-400 hover:text-white">My Complaints</button>
                <button onClick={() => setCurrentView('faq-help')} className="block text-slate-400 hover:text-white">FAQs / Help</button>
                <button onClick={() => setCurrentView('landing')} className="block text-slate-400 hover:text-white">About JanSetu</button>
              </div>
            )}
          </div>

          {/* Citizen Services Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('citizen')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 bg-slate-800/60"
            >
              <span>Citizen Services</span>
              {openSection === 'citizen' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSection === 'citizen' && (
              <div className="p-3 bg-slate-900 space-y-2 text-xs">
                <button onClick={() => setCurrentView('report')} className="block text-slate-400 hover:text-white">Report a Problem</button>
                <button onClick={() => setCurrentView('track')} className="block text-slate-400 hover:text-white">Track Complaint</button>
                <button onClick={() => setCurrentView('my-complaints')} className="block text-slate-400 hover:text-white">Complaint History</button>
                <button onClick={() => setCurrentView('gis-map')} className="block text-slate-400 hover:text-white">GIS Map</button>
                <button onClick={() => setCurrentView('settings')} className="block text-slate-400 hover:text-white">Accessibility & Display</button>
              </div>
            )}
          </div>

          {/* Authority Services Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('auth')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 bg-slate-800/60"
            >
              <span>For Authorities</span>
              {openSection === 'auth' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSection === 'auth' && (
              <div className="p-3 bg-slate-900 space-y-2 text-xs">
                <button onClick={() => { setRole('AUTHORITY'); setCurrentView('authority-dashboard'); }} className="block text-amber-300 font-bold">Authority Login</button>
                <button onClick={() => { setRole('AUTHORITY'); setCurrentView('authority-complaints'); }} className="block text-slate-400 hover:text-white">Complaint Management</button>
                <button onClick={() => { setRole('AUTHORITY'); setCurrentView('clusters'); }} className="block text-slate-400 hover:text-white">AI Issue Clusters</button>
                <button onClick={() => { setRole('AUTHORITY'); setCurrentView('gis-map'); }} className="block text-slate-400 hover:text-white">GIS Hotspots</button>
                <button onClick={() => { setRole('AUTHORITY'); setCurrentView('authority-analytics'); }} className="block text-slate-400 hover:text-white">Analytics</button>
              </div>
            )}
          </div>

          {/* Help & Support Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('help')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 bg-slate-800/60"
            >
              <span>Help & Support</span>
              {openSection === 'help' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSection === 'help' && (
              <div className="p-3 bg-slate-900 space-y-2 text-xs">
                <button onClick={() => setCurrentView('faq-help')} className="block text-slate-400 hover:text-white">FAQs</button>
                <button onClick={() => setCurrentView('landing')} className="block text-slate-400 hover:text-white">How JanSetu Works</button>
                <button onClick={() => setCurrentView('contact-support')} className="block text-slate-400 hover:text-white">Contact Support</button>
                <button onClick={() => setCurrentView('policies')} className="block text-slate-400 hover:text-white">Accessibility & Policies</button>
              </div>
            )}
          </div>

          {/* Languages Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('lang')}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-slate-200 bg-slate-800/60"
            >
              <span>Indian Languages</span>
              {openSection === 'lang' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSection === 'lang' && (
              <div className="p-3 bg-slate-900 grid grid-cols-2 gap-1.5 text-xs">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`p-1.5 rounded text-left ${
                      language === lang.code ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Information & Policy Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-400">
              &copy; 2026 JanSetu AI &bull; Built for smarter, simpler civic grievance management.
            </p>
            <p className="text-[11px] text-slate-500">
              All civic data processed securely. Zero personally identifiable credentials exposed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium">
            <button
              onClick={() => setCurrentView('policies')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">&bull;</span>
            <button
              onClick={() => setCurrentView('policies')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-slate-700">&bull;</span>
            <button
              onClick={() => setCurrentView('policies')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Accessibility
            </button>
            <span className="text-slate-700">&bull;</span>
            <button
              onClick={() => setCurrentView('policies')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Website Policies
            </button>
            <span className="text-slate-700">&bull;</span>
            <button
              onClick={() => setCurrentView('contact-support')}
              className="hover:text-orange-400 text-slate-400 font-semibold transition-colors cursor-pointer"
            >
              Help & Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
