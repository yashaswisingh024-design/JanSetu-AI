import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  Building,
  User,
  Layers,
  X,
  Check,
  ChevronDown,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus, Department, Priority } from '../types';

export const AuthorityComplaintTable: React.FC = () => {
  const {
    complaints,
    clusters,
    selectedComplaintId,
    setSelectedComplaintId,
    updateComplaint,
    setCurrentView,
    setSelectedClusterId,
  } = useApp();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal / Drawer state for complaint editing
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(
    selectedComplaintId
      ? complaints.find((c) => c.id === selectedComplaintId) || null
      : null
  );

  // Edit form state
  const [editStatus, setEditStatus] = useState<ComplaintStatus>('Submitted');
  const [editDepartment, setEditDepartment] = useState<Department>('Public Works Department (PWD)');
  const [editPriority, setEditPriority] = useState<Priority>('HIGH');
  const [editOfficer, setEditOfficer] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editClusterId, setEditClusterId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openEditDrawer = (comp: Complaint) => {
    setEditingComplaint(comp);
    setEditStatus(comp.status);
    setEditDepartment(comp.department);
    setEditPriority(comp.priority);
    setEditOfficer(comp.assignedOfficer || '');
    setEditClusterId(comp.clusterId || '');
    setEditNote('');
  };

  const handleSaveUpdates = async () => {
    if (!editingComplaint) return;
    setIsSaving(true);
    try {
      await updateComplaint(editingComplaint.id, {
        status: editStatus,
        department: editDepartment,
        priority: editPriority,
        assignedOfficer: editOfficer,
        internalNote: editNote || undefined,
        clusterId: editClusterId || undefined,
      });
      setEditingComplaint(null);
    } catch (err: any) {
      alert(err?.message || 'Failed to save updates');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter application
  const filtered = complaints.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (selectedDepartment !== 'ALL' && c.department !== selectedDepartment) return false;
    if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && c.status !== selectedStatus) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.grievance.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Municipal Grievance Triage Database
          </h1>
          <p className="text-xs text-slate-500">
            Manage, assign, update, and resolve civic complaints across all city departments.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          Showing {filtered.length} of {complaints.length} complaints
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, keyword, address, citizen name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Priority */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="AI Analyzed">AI Analyzed</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none truncate"
            >
              <option value="ALL">All Categories</option>
              <option value="Roads & Infrastructure">Roads & Infrastructure</option>
              <option value="Garbage & Sanitation">Garbage & Sanitation</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Streetlights & Electricity">Streetlights & Electricity</option>
              <option value="Drainage & Sewage">Drainage & Sewage</option>
              <option value="Traffic & Encroachment">Traffic & Encroachment</option>
              <option value="Public Health">Public Health</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none truncate"
            >
              <option value="ALL">All Departments</option>
              <option value="Public Works Department (PWD)">PWD (Roads)</option>
              <option value="Municipal Solid Waste & Sanitation">Sanitation</option>
              <option value="Water Supply & Sewerage Board">Water Board</option>
              <option value="Electrical & Streetlight Division">Electrical</option>
              <option value="Stormwater Drainage Department">Drainage</option>
              <option value="Traffic Police & Transport Division">Traffic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Ref ID</th>
                <th className="py-3.5 px-4">Priority & Score</th>
                <th className="py-3.5 px-4">Grievance Summary</th>
                <th className="py-3.5 px-4">Category & Department</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Cluster</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((comp) => {
                const isCritical = comp.priority === 'CRITICAL';
                const isHigh = comp.priority === 'HIGH';

                return (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {comp.id}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        {new Date(comp.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          isCritical
                            ? 'bg-red-100 text-red-700'
                            : isHigh
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comp.priority} ({comp.priorityScore})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate">{comp.summary}</span>
                      <span className="text-[11px] text-slate-500 italic block truncate">
                        “{comp.grievance}”
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{comp.category}</span>
                      <span className="text-orange-700 font-semibold block text-[11px]">
                        {comp.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-[180px] text-slate-600">
                      <span className="truncate block">{comp.location.address}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          comp.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : comp.status === 'In Progress'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {comp.clusterTitle ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 truncate max-w-[130px]">
                          <Layers className="w-3 h-3" />
                          <span className="truncate">{comp.clusterTitle}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openEditDrawer(comp)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-orange-600 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Edit / Dispatch
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Dispatch Action Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-orange-600 tracking-wider">
                  Authority Management Console
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Manage Complaint: {editingComplaint.id}
                </h2>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Grievance Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">
                Reported by {editingComplaint.citizenName} ({editingComplaint.language})
              </span>
              <p className="font-bold text-slate-900 text-sm">{editingComplaint.summary}</p>
              <p className="text-slate-600 italic">“{editingComplaint.grievance}”</p>
              <p className="text-[11px] text-slate-400 pt-1">
                📍 {editingComplaint.location.address}
              </p>
            </div>

            {/* Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Status */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Update Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ComplaintStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="AI Analyzed">AI Analyzed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress (Field Work)</option>
                  <option value="Resolved">Resolved & Verified</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Severity / Priority</label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                >
                  <option value="CRITICAL">🔴 CRITICAL</option>
                  <option value="HIGH">🟠 HIGH</option>
                  <option value="MEDIUM">🟡 MEDIUM</option>
                  <option value="LOW">🟢 LOW</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Responsible Department</label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value as Department)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-orange-500 truncate"
                >
                  <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                  <option value="Municipal Solid Waste & Sanitation">
                    Municipal Solid Waste & Sanitation
                  </option>
                  <option value="Water Supply & Sewerage Board">
                    Water Supply & Sewerage Board
                  </option>
                  <option value="Electrical & Streetlight Division">
                    Electrical & Streetlight Division
                  </option>
                  <option value="Stormwater Drainage Department">
                    Stormwater Drainage Department
                  </option>
                  <option value="Traffic Police & Transport Division">
                    Traffic Police & Transport Division
                  </option>
                  <option value="Public Health & Vector Control">
                    Public Health & Vector Control
                  </option>
                </select>
              </div>

              {/* Assigned Officer */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Assign Field Engineer / Officer</label>
                <input
                  type="text"
                  value={editOfficer}
                  onChange={(e) => setEditOfficer(e.target.value)}
                  placeholder="e.g. Er. Rajesh Patil, Ward 4"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Issue Cluster Link */}
            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1.5">
                Associate with Issue Cluster
              </label>
              <select
                value={editClusterId}
                onChange={(e) => setEditClusterId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500"
              >
                <option value="">No Cluster (Standalone Complaint)</option>
                {clusters.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.title} ({cl.totalComplaints} reports)
                  </option>
                ))}
              </select>
            </div>

            {/* Official Update Note */}
            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1.5">
                Official Resolution Note / Citizen Notification
              </label>
              <textarea
                rows={3}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="e.g. PWD inspection crew dispatched; pothole cold-mix patching scheduled for 3:00 PM."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingComplaint(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveUpdates}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save & Notify Citizen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
