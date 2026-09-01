import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  Flame,
  Layers,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const CitizenComplaintHistory: React.FC = () => {
  const {
    t,
    complaints,
    currentUser,
    setCurrentView,
    setSelectedComplaintId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter complaints
  const filtered = complaints.filter((c) => {
    // Tab filter
    if (activeTab === 'PENDING' && c.status !== 'Submitted' && c.status !== 'AI Analyzed' && c.status !== 'Assigned') return false;
    if (activeTab === 'IN_PROGRESS' && c.status !== 'In Progress') return false;
    if (activeTab === 'RESOLVED' && c.status !== 'Resolved' && c.status !== 'Closed') return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.grievance.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t.myComplaintsTitle}</h1>
          <p className="text-xs text-slate-500">
            View all logged civic grievances, live status, and resolution timelines.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('report')}
          className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-transform transform hover:scale-[1.02] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.reportProblem}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab
                  ? 'bg-white text-orange-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL'
                ? 'All Reports'
                : tab === 'PENDING'
                ? 'Pending'
                : tab === 'IN_PROGRESS'
                ? 'In Progress'
                : 'Resolved'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by keyword or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Grievances Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((comp) => {
            const isCritical = comp.priority === 'CRITICAL';
            const isHigh = comp.priority === 'HIGH';

            return (
              <div
                key={comp.id}
                onClick={() => {
                  setSelectedComplaintId(comp.id);
                  setCurrentView('track');
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-orange-600 transition-colors">
                      {comp.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          isCritical
                            ? 'bg-red-100 text-red-700'
                            : isHigh
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comp.priority}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                        {comp.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-1">
                      {comp.summary}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 italic">
                      “{comp.grievance}”
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="text-slate-500">
                      <span className="font-bold text-slate-700 block">Category</span>
                      <span className="truncate block">{comp.category}</span>
                    </div>
                    <div className="text-slate-500">
                      <span className="font-bold text-orange-700 block">Department</span>
                      <span className="truncate block">{comp.department}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate max-w-[200px]">{comp.location.address}</span>
                  </div>
                  <span className="font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Track →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No grievances found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No complaints matched your active filter or search query.
          </p>
        </div>
      )}
    </div>
  );
};
