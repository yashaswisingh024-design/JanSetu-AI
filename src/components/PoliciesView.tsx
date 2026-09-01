import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Eye,
  Lock,
  Sparkles,
  Info,
  Scale,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

type PolicyTab = 'prototype' | 'privacy' | 'terms' | 'accessibility' | 'website';

export const PoliciesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyTab>('prototype');
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>Governance & Legal Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Website Policies & Legal Information
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Information regarding platform governance, privacy measures, terms of service, and accessibility compliance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'prototype', label: '⚠️ Prototype Notice', icon: AlertTriangle },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms of Use', icon: FileText },
            { id: 'accessibility', label: 'Accessibility Statement', icon: Eye },
            { id: 'website', label: 'Website Policies', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PolicyTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {activeTab === 'prototype' && (
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <h3 className="font-bold">Hackathon Prototype & Demonstration Notice</h3>
                  <p>
                    JanSetu AI is an innovation technology prototype created for demonstration and hackathon review. It is not an official municipal or government agency website.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Platform Intent & Simulation Scope
              </h2>
              <p>
                JanSetu AI demonstrates the next generation of civic grievance reporting powered by multimodal Gemini AI. It showcases automated voice translation, severity triage, spatial GIS clustering, and department routing.
              </p>
              <p>
                While the AI analysis, language processing, and spatial grouping operate with live, real-time algorithms, complaints logged in this prototype session are handled in sandbox simulation mode and do not automatically dispatch municipal work crews in real life.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2">
                  Emergency Notice
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  For immediate life-safety emergencies, please dial <strong>112</strong> (National Emergency Services) or your local municipal disaster control room immediately.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Privacy Policy & Civic Data Protection
              </h2>
              <p>
                JanSetu AI is committed to protecting citizen privacy. We strictly practice data minimization when handling civic grievances.
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">1. Information We Collect</h3>
                  <p className="text-xs sm:text-sm">
                    We collect citizen grievance descriptions (text/audio), uploaded photographs of civic issues, and approximate geolocation coordinates solely for the purpose of dispatching appropriate municipal repairs.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">2. AI Processing with Google Gemini</h3>
                  <p className="text-xs sm:text-sm">
                    Grievance text and photos are transmitted securely to Google Gemini models to identify the civic department, severity, and potential duplicates. No personal identity records are stored or used to train public models.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">3. Public Transparency vs. Privacy</h3>
                  <p className="text-xs sm:text-sm">
                    While grievance descriptions and location markers appear on municipal GIS maps to inform fellow citizens of road or water hazards, your name, phone number, and personal contact details are completely redacted from public view.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Terms of Use
              </h2>
              <p>
                By using JanSetu AI, you agree to use the platform responsibly for filing authentic civic issues.
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">1. Genuine Civic Reporting</h3>
                  <p className="text-xs sm:text-sm">
                    Users must provide truthful descriptions and accurate photos of civic defects. Submitting false reports or unrelated commercial advertisements is strictly prohibited.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">2. Service Level Expectations</h3>
                  <p className="text-xs sm:text-sm">
                    JanSetu AI provides automated prioritization and routing to municipal departments. Actual resolution time depends on municipal field staff availability, weather conditions, and emergency requirements.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">3. Intellectual Property</h3>
                  <p className="text-xs sm:text-sm">
                    All software design, AI triage workflows, and GIS clustering algorithms are protected under prototype copyright &copy; 2026 JanSetu AI.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Accessibility Statement & Inclusivity
              </h2>
              <p>
                JanSetu AI is engineered according to WCAG 2.1 Level AA accessibility standards, ensuring every Indian citizen can voice their civic concerns regardless of language proficiency or physical ability.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    🎙️ Voice-First Input
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Citizens with limited literacy or motor impairments can speak in any of 10 Indian languages.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    🔍 Text Scaling & High Contrast
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Built-in display controls allow scaling typography up to 125% and enabling high-contrast borders.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    ⚡ Reduced Motion
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Respects system and user preferences for reduced motion, disabling continuous CSS animations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    ♿ Screen-Reader Semantics
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Proper ARIA landmarks, roles, and keyboard navigation tab-stops across all forms and tables.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Website Policies & Technical Guidelines
              </h2>
              <p>
                Guidelines regarding hyperlink policies, copyright, content moderation, and technical compatibility.
              </p>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">1. Hyperlinking Policy</h3>
                  <p className="text-xs sm:text-sm">
                    External links to official government departments or GIS mapping layers are provided for citizen convenience. JanSetu AI is not responsible for external third-party content.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">2. Content Review & Moderation</h3>
                  <p className="text-xs sm:text-sm">
                    Automated safety filters ensure submitted grievance photos do not contain abusive or sensitive non-civic content.
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">3. Browser & Device Compatibility</h3>
                  <p className="text-xs sm:text-sm">
                    JanSetu AI is optimized for all modern browsers (Chrome, Safari, Firefox, Edge) on desktop, tablet, and mobile displays.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
