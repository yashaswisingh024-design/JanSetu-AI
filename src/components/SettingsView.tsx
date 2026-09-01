import React from 'react';
import { useApp, TextSizeMode, ThemeMode } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../translations';
import {
  Sliders,
  Sun,
  Moon,
  Monitor,
  Type,
  Eye,
  Zap,
  Globe,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { LanguageCode } from '../types';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    textSize,
    setTextSize,
    highContrast,
    setHighContrast,
    reduceAnimations,
    setReduceAnimations,
    language,
    setLanguage
  } = useApp();

  const handleResetDefaults = () => {
    setTheme('light');
    setTextSize('normal');
    setHighContrast(false);
    setReduceAnimations(false);
    setLanguage('en');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>Accessibility & Personalization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Display & Accessibility Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize text size, contrast, animations, and color scheme for maximum comfort. All settings persist automatically.
            </p>
          </div>

          <button
            onClick={handleResetDefaults}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Appearance Preview
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Profile
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                JanSetu AI Civic Grievance Portal
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Pothole on MG Road near Metro Station reported with priority <span className="font-bold text-red-500">High</span>.
              </p>
            </div>
            <button className="shrink-0 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow hover:bg-orange-700 transition-all">
              Sample Action
            </button>
          </div>
        </div>

        {/* Settings Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Mode */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Color Theme</h2>
            </div>
            <p className="text-xs text-slate-500">
              Choose your preferred interface theme. Dark mode provides low-glare comfort in dim environments.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as ThemeMode)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Size Multiplier */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Text Size Scaling</h2>
            </div>
            <p className="text-xs text-slate-500">
              Increase base font size across the entire portal for enhanced readability.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { id: 'normal', label: 'Normal (100%)', sample: 'A' },
                { id: 'large', label: 'Large (112%)', sample: 'A+' },
                { id: 'extralarge', label: 'XL (125%)', sample: 'A++' }
              ].map((item) => {
                const isSelected = textSize === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTextSize(item.id as TextSizeMode)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base font-mono">{item.sample}</span>
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">High Contrast</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Increases border thickness, text contrast, and button outlines for citizens with visual sensitivities.
            </p>
          </div>

          {/* Reduce Animations */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Reduce Animations</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceAnimations}
                  onChange={(e) => setReduceAnimations(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Disables sliding, pulsing, and background motion effects to prevent motion discomfort.
            </p>
          </div>
        </div>

        {/* Language Selection Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Language (10 Indian Languages)
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Select your preferred regional language. Voice input and AI audio feedback will automatically align with this selection.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="block text-sm font-semibold">{lang.nativeName}</span>
                  <span className="block text-[11px] text-slate-400">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
