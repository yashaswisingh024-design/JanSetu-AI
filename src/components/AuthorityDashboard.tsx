import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Layers,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building,
  RefreshCw,
  Users,
  ExternalLink,
} from 'lucide-react';
import { Complaint, Priority } from '../types';

export const AuthorityDashboard: React.FC = () => {
  const {
    t,
    complaints,
    clusters,
    hotspots,
    dashboardStats,
    setCurrentView,
    setSelectedComplaintId,
    setSelectedClusterId,
    updateComplaint,
    refreshData,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // KPI Calculations
  const total = complaints.length;
  const criticalCount = complaints.filter((c) => c.priority === 'CRITICAL').length;
  const highCount = complaints.filter((c) => c.priority === 'HIGH').length;
  const pendingCount = complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const duplicateMergedCount = complaints.filter((c) => c.isDuplicate || c.clusterId).length;

  // Chart 1: Categories
  const categoryCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
    name: name.split(' ')[0], // short name
    fullName: name,
    count,
  }));

  // Chart 2: Priority Pie
  const priorityData = [
    { name: 'Critical', value: complaints.filter((c) => c.priority === 'CRITICAL').length, color: '#dc2626' },
    { name: 'High', value: complaints.filter((c) => c.priority === 'HIGH').length, color: '#ea580c' },
    { name: 'Medium', value: complaints.filter((c) => c.priority === 'MEDIUM').length, color: '#eab308' },
    { name: 'Low', value: complaints.filter((c) => c.priority === 'LOW').length, color: '#10b981' },
  ];

  // Chart 3: Department Workload
  const deptData = [
    { dept: 'Roads/PWD', total: 6, resolved: 3 },
    { dept: 'Sanitation', total: 5, resolved: 2 },
    { dept: 'Water Board', total: 4, resolved: 2 },
    { dept: 'Lighting', total: 3, resolved: 2 },
    { dept: 'Drainage', total: 3, resolved: 1 },
    { dept: 'Health', total: 2, resolved: 1 },
  ];

  // Chart 4: 7-Day Inflow vs Resolution
  const trendData = [
    { day: 'Mon', reported: 12, resolved: 9 },
    { day: 'Tue', reported: 18, resolved: 14 },
    { day: 'Wed', reported: 15, resolved: 12 },
    { day: 'Thu', reported: 24, resolved: 19 },
    { day: 'Fri', reported: 21, resolved: 18 },
    { day: 'Sat', reported: 16, resolved: 15 },
    { day: 'Sun', reported: 14, resolved: 13 },
  ];

  // AI Stream Insights
  const aiInsights = [
    {
      title: 'Road Hazard Cluster: ABC College Route',
      desc: '17 citizen reports in 72 hours flagging severe potholes causing 2 minor two-wheeler accidents. PWD work order advised urgently.',
      type: 'critical',
    },
    {
      title: 'Monsoon Overflow Risk: Swargate Subway',
      desc: 'Repeated drainage choke reports near Swargate bus depot indicate high flooding vulnerability during upcoming heavy rains.',
      type: 'warning',
    },
    {
      title: 'Duplicate Triage Efficiency',
      desc: 'JanSetu AI semantic grouping eliminated 38 redundant field trips across Ward 4, saving ~42 engineering hours.',
      type: 'success',
    },
    {
      title: 'Water Supply Contamination Spike',
      desc: 'Contaminated tap water reports clustered in Kothrud Ward 9; early warning shared with Municipal Water Health testing lab.',
      type: 'alert',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-extrabold tracking-tight">
              {t.navAuthorityDashboard} • Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Pune Municipal Corporation • Multi-Department Live Triage & GIS Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <button
            onClick={() => setCurrentView('authority-complaints')}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage All Complaints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Complaints
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{total}</div>
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Active / Pending
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Under action</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-2xs bg-red-50/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block flex items-center gap-1">
            <Flame className="w-3 h-3 text-red-500" /> Critical Severity
          </span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">{criticalCount}</div>
          <span className="text-[10px] text-red-500 font-bold mt-1 block animate-pulse">
            Needs immediate dispatch
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            High Priority
          </span>
          <div className="text-2xl font-extrabold text-orange-600 mt-1">{highCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Target: 24hr fix</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Duplicates Merged
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{duplicateMergedCount}</div>
          <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">
            94% auto-match rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Resolved & Closed
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            {Math.round((resolvedCount / (total || 1)) * 100)}% resolution rate
          </span>
        </div>
      </div>

      {/* AI Intelligence Stream & Hotspots Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900">
              JanSetu AI Predictive Insights & Hotspots
            </h3>
          </div>
          <button
            onClick={() => setCurrentView('gis-map')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Open Interactive GIS Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                insight.type === 'critical'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : insight.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : insight.type === 'alert'
                  ? 'bg-orange-50 border-orange-200 text-orange-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <h4 className="font-bold text-xs">{insight.title}</h4>
              <p className="text-[11px] leading-relaxed opacity-90">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Analytics Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Category Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Complaints by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ea580c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Priority Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Priority Severity Split</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Workload */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">
            Department Workload & Resolution Ratio
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Total Inflow" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: 7-Day Velocity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">
            7-Day Inflow vs Resolution Velocity
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="reported"
                  name="Grievances Raised"
                  stroke="#ea580c"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Remediated"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Urgent Grievances Quick Triage Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Priority Grievances Requiring Action
            </h3>
            <p className="text-xs text-slate-400">
              Sorted by AI severity score. Click any row to assign officer or update status.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('authority-complaints')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700"
          >
            View Full Table ({complaints.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">ID & Priority</th>
                <th className="pb-3">Grievance Summary</th>
                <th className="pb-3">Category / Dept</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.slice(0, 5).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-3.5 pr-3">
                    <span className="font-mono font-bold text-slate-900 block">{c.id}</span>
                    <span
                      className={`inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        c.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : c.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {c.priority} ({c.priorityScore})
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 max-w-xs">
                    <span className="font-bold text-slate-900 block truncate">{c.summary}</span>
                    <span className="text-[11px] text-slate-500 truncate block">“{c.grievance}”</span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="font-bold text-slate-800 block">{c.category}</span>
                    <span className="text-orange-700 font-semibold block text-[11px]">
                      {c.department}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 max-w-[160px] truncate text-slate-600">
                    <span className="truncate block">{c.location.address}</span>
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedComplaintId(c.id);
                        setCurrentView('authority-complaints');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[10px] hover:bg-orange-600 transition-colors"
                    >
                      Inspect / Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
