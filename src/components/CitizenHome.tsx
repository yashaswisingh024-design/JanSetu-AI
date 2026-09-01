import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlusCircle,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MapPin,
  Sparkles,
  Flame,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';

interface CitizenHomeProps {
  onSelectQuickScenario?: (text: string) => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({ onSelectQuickScenario }) => {
  const {
    t,
    currentUser,
    complaints,
    setCurrentView,
    setSelectedComplaintId,
  } = useApp();

  const [trackInput, setTrackInput] = useState('');

  // Filter complaints by current citizen
  const citizenComplaints = complaints.filter(
    (c) => c.citizenId === currentUser?.id || c.citizenName === currentUser?.name
  );

  const pendingCount = citizenComplaints.filter(
    (c) => c.status === 'Submitted' || c.status === 'AI Analyzed' || c.status === 'Assigned' || c.status === 'In Progress'
  ).length;

  const resolvedCount = citizenComplaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      setSelectedComplaintId(trackInput.trim().toUpperCase());
      setCurrentView('track');
    }
  };

  const quickScenarios = [
    {
      title: 'ABC College Pothole (Critical)',
      text: 'There is a huge pothole near ABC College and two people have already fallen from their bikes.',
      tag: 'Accident Hazard',
      lang: 'English',
    },
    {
      title: 'कचरा उचललेला नाही (Garbage)',
      text: 'आमच्या भागात पाच दिवसांपासून कचरा उचललेला नाही. सेंट्रल मार्केट जवळ दुर्गंधी पसरली आहे.',
      tag: 'Sanitation',
      lang: 'मराठी',
    },
    {
      title: 'गंदा पानी / Muddy Water',
      text: 'हमारे इलाके में नलों से बहुत गंदा और बदबूदार पानी आ रहा है। कई बच्चे बीमार पड़ चुके हैं।',
      tag: 'Water Contamination',
      lang: 'हिंदी',
    },
    {
      title: 'Station Subway Dark (Lights)',
      text: 'The entire railway station underpass is completely dark because all streetlights have failed.',
      tag: 'Commuter Safety',
      lang: 'English',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Greeting & Role Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-emerald-950/30 p-6 rounded-3xl border border-orange-200/60 dark:border-orange-800/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.namaste}, {currentUser?.name || 'Aarav'} 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Ward 4 • Pune Municipal Corporation • Citizen Portal
          </p>
        </div>

        <button
          onClick={() => setCurrentView('report')}
          className="self-start sm:self-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02] cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.reportProblem}</span>
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setCurrentView('my-complaints')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-orange-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.myComplaintsStat}
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {citizenComplaints.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total grievances logged</p>
        </div>

        <div
          onClick={() => setCurrentView('my-complaints')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-amber-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.pendingStat} / In Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Under investigation or field action</p>
        </div>

        <div
          onClick={() => setCurrentView('my-complaints')}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.resolvedStat}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">
            {resolvedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Verified on-ground resolution</p>
        </div>
      </div>

      {/* Main Action Banner: What problem are you facing? */}
      <div className="p-8 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Zero Red Tape • AI Handles Departments
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.whatProblemFacing}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t.reportSubtext}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('report')}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-transform transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t.reportProblem} Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute right-4 bottom-0 opacity-10 hidden sm:block pointer-events-none">
          <svg className="w-72 h-72 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
      </div>

      {/* Quick Demo Scenarios (One-Click Testing) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              One-Click Quick Test Scenarios (Hackathon Demo Bar)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click to test instant AI triage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickScenarios.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onSelectQuickScenario) {
                  onSelectQuickScenario(item.text);
                }
                setCurrentView('report');
              }}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.lang}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600">{item.tag}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mb-1.5 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 italic">“{item.text}”</p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-orange-600 pt-2 border-t border-slate-100">
                <span>Test in JanSetu →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Quick Track & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Track Complaint Box */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-base text-slate-900">{t.trackComplaint}</h3>
          </div>
          <p className="text-xs text-slate-500">
            Enter your unique complaint reference ID to check live department assignment and officer notes.
          </p>

          <form onSubmit={handleTrackSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="e.g. JS-2026-001001"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Grievance Status</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Quick samples in database:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['JS-2026-001001', 'JS-2026-001006', 'JS-2026-001009', 'JS-2026-001013'].map(
                (id) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedComplaintId(id);
                      setCurrentView('track');
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 rounded-md text-[11px] font-mono transition-colors"
                  >
                    {id}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Recent Grievances List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">Recent Grievances in Your Area</h3>
            <button
              onClick={() => setCurrentView('my-complaints')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              View All ({complaints.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 3).map((comp) => {
              const isCritical = comp.priority === 'CRITICAL';
              const isHigh = comp.priority === 'HIGH';

              return (
                <div
                  key={comp.id}
                  onClick={() => {
                    setSelectedComplaintId(comp.id);
                    setCurrentView('track');
                  }}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-orange-50/40 hover:border-orange-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600">
                          {comp.id}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isCritical
                              ? 'bg-red-100 text-red-700'
                              : isHigh
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {comp.priority} ({comp.priorityScore})
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
                          {comp.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1 group-hover:text-orange-700 transition-colors">
                        {comp.summary}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{comp.location.address}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-700">
                        {comp.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
