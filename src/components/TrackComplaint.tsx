import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  UserCheck,
  Flame,
  Layers,
  Copy,
  Check,
  AlertCircle,
  FileText,
  MessageSquare,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { ComplaintStatus } from '../types';

export const TrackComplaint: React.FC = () => {
  const {
    t,
    complaints,
    selectedComplaintId,
    setSelectedComplaintId,
    setSelectedClusterId,
    setCurrentView,
  } = useApp();

  const [searchInput, setSearchInput] = useState(selectedComplaintId || 'JS-2026-001001');
  const [activeComplaint, setActiveComplaint] = useState(
    complaints.find((c) => c.id === (selectedComplaintId || 'JS-2026-001001')) || complaints[0]
  );
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (selectedComplaintId) {
      setSearchInput(selectedComplaintId);
      const found = complaints.find((c) => c.id.toLowerCase() === selectedComplaintId.toLowerCase());
      if (found) setActiveComplaint(found);
    }
  }, [selectedComplaintId, complaints]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    const found = complaints.find(
      (c) => c.id.toUpperCase() === query || c.id.toUpperCase().includes(query)
    );
    if (found) {
      setActiveComplaint(found);
      setSelectedComplaintId(found.id);
    } else {
      alert(`No complaint found with ID: ${query}`);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Stepper logic
  const getStepStatus = (stepIndex: number, currentStatus: ComplaintStatus) => {
    const order: ComplaintStatus[] = [
      'Submitted',
      'AI Analyzed',
      'Assigned',
      'In Progress',
      'Resolved',
    ];

    const currentIdx = order.indexOf(currentStatus);
    if (currentIdx >= stepIndex) return 'completed';
    if (currentIdx === stepIndex - 1) return 'current';
    return 'upcoming';
  };

  const isCritical = activeComplaint?.priority === 'CRITICAL';
  const isHigh = activeComplaint?.priority === 'HIGH';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">{t.trackComplaint}</h1>
          <p className="text-xs text-slate-500">
            Real-time status tracking, department jurisdiction, and officer activity timeline.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Complaint Reference ID (e.g. JS-2026-001001)"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search Status</span>
          </button>
        </form>

        {/* Quick Sample Selector Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold">Quick Test IDs:</span>
          {complaints.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSearchInput(c.id);
                setActiveComplaint(c);
                setSelectedComplaintId(c.id);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                activeComplaint?.id === c.id
                  ? 'bg-orange-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {activeComplaint ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Complaint Details & AI Diagnosis */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Header Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold font-mono text-slate-900">
                    {activeComplaint.id}
                  </span>
                  <button
                    onClick={() => handleCopy(activeComplaint.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Copy ID"
                  >
                    {copiedId ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : isHigh
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {activeComplaint.priority} ({activeComplaint.priorityScore}/100)
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
                    {activeComplaint.status}
                  </span>
                </div>
              </div>

              {/* Summary & Grievance text */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {activeComplaint.summary}
                </h2>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                  “{activeComplaint.grievance}”
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Language: {activeComplaint.language}</span>
                  <span>Reported by: {activeComplaint.citizenName}</span>
                </div>
              </div>

              {/* Structured Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
                  <span className="font-bold text-slate-900">{activeComplaint.category}</span>
                </div>
                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block">
                    Responsible Department
                  </span>
                  <span className="font-bold text-orange-950">{activeComplaint.department}</span>
                </div>
              </div>

              {/* AI Severity Justification */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  isCritical
                    ? 'bg-red-50/70 border-red-200 text-red-900'
                    : isHigh
                    ? 'bg-orange-50/70 border-orange-200 text-orange-900'
                    : 'bg-yellow-50/70 border-yellow-200 text-yellow-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>AI Priority Assessment Reason:</span>
                </div>
                <p className="font-medium">{activeComplaint.priorityReason}</p>
              </div>

              {/* Location & Photo */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{activeComplaint.location.address}</span>
                    {activeComplaint.location.landmark && (
                      <p className="text-slate-400 text-[11px]">
                        Landmark: {activeComplaint.location.landmark}
                      </p>
                    )}
                  </div>
                </div>

                {activeComplaint.photoUrl && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                      Citizen Evidence Photo
                    </span>
                    <img
                      src={activeComplaint.photoUrl}
                      alt="Grievance evidence"
                      className="h-44 w-full object-cover rounded-2xl border border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* Issue Cluster Link */}
              {activeComplaint.clusterTitle && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-900">
                        Linked Issue Cluster: {activeComplaint.clusterTitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-amber-800">
                    This grievance is grouped into a broader municipal cluster, ensuring collective priority and avoiding duplicate roadwork inspections.
                  </p>
                  <button
                    onClick={() => {
                      if (activeComplaint.clusterId) {
                        setSelectedClusterId(activeComplaint.clusterId);
                      }
                      setCurrentView('clusters');
                    }}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1"
                  >
                    <span>View Full Cluster ({activeComplaint.clusterId})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Timeline Stepper & Officer Notes */}
          <div className="lg:col-span-5 space-y-6">
            {/* Timeline Stepper Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900">
                  Resolution Progress
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Live Updates
                </span>
              </div>

              {/* Stepper items */}
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[9px] font-bold">
                    ✓
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">1. Complaint Submitted</h4>
                  <p className="text-[11px] text-slate-500">
                    {new Date(activeComplaint.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[9px] font-bold">
                    ✓
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">2. AI Analyzed & Scored</h4>
                  <p className="text-[11px] text-slate-500">
                    Category, department, and priority evaluated by Gemini.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                      getStepStatus(2, activeComplaint.status) === 'completed'
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : 'bg-amber-500 ring-4 ring-amber-100'
                    }`}
                  >
                    {getStepStatus(2, activeComplaint.status) === 'completed' ? '✓' : '•'}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">3. Assigned to Department</h4>
                  <p className="text-[11px] text-slate-500">
                    Routed to {activeComplaint.department}
                    {activeComplaint.assignedOfficer && (
                      <span className="block font-semibold text-slate-700">
                        Officer: {activeComplaint.assignedOfficer}
                      </span>
                    )}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                      activeComplaint.status === 'In Progress' || activeComplaint.status === 'Resolved'
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : 'bg-slate-300 ring-4 ring-slate-100'
                    }`}
                  >
                    {activeComplaint.status === 'In Progress' || activeComplaint.status === 'Resolved'
                      ? '✓'
                      : '•'}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">4. Field Action In Progress</h4>
                  <p className="text-[11px] text-slate-500">
                    Work crews deployed or material dispatched to site.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div
                    className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                      activeComplaint.status === 'Resolved'
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : 'bg-slate-300 ring-4 ring-slate-100'
                    }`}
                  >
                    {activeComplaint.status === 'Resolved' ? '✓' : '•'}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">5. Remediation Verified & Resolved</h4>
                  <p className="text-[11px] text-slate-500">
                    {activeComplaint.status === 'Resolved'
                      ? 'Field work completed and verified by civic authorities.'
                      : 'Awaiting final verification from inspecting officer.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Officer Activity History */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Official Logs & Notes</h3>
              </div>

              {activeComplaint.updates && activeComplaint.updates.length > 0 ? (
                <div className="space-y-3">
                  {activeComplaint.updates.map((update, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700">{update.author}</span>
                        <span>{new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{update.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No notes logged yet for this grievance.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
