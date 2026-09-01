import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calendar,
  Download,
  Filter,
  Sparkles,
  Building,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const AuthorityAnalyticsView: React.FC = () => {
  const { complaints, clusters, setCurrentView } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Compute live stats from complaints
  const total = complaints.length || 24;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length || 14;
  const pending = complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'IN_PROGRESS' || c.status === 'AI_ANALYZED').length || 10;
  const critical = complaints.filter((c) => c.priority === 'CRITICAL' || c.priority === 'HIGH').length || 8;
  const resolvedPercent = Math.round((resolved / total) * 100);

  // Department Performance Data
  const departmentData = [
    { name: 'PWD Roads', total: 42, resolved: 36, avgHours: 28 },
    { name: 'Water Supply', total: 35, resolved: 31, avgHours: 14 },
    { name: 'Electricity Board', total: 28, resolved: 26, avgHours: 8 },
    { name: 'Sanitation (SWM)', total: 39, resolved: 35, avgHours: 19 },
    { name: 'Traffic Police', total: 18, resolved: 16, avgHours: 12 },
    { name: 'Parks & Drainage', total: 15, resolved: 12, avgHours: 34 }
  ];

  // Inflow vs Resolution Trend
  const trendData = [
    { day: 'Mon', reported: 18, resolved: 14 },
    { day: 'Tue', reported: 24, resolved: 20 },
    { day: 'Wed', reported: 28, resolved: 25 },
    { day: 'Thu', reported: 22, resolved: 24 },
    { day: 'Fri', reported: 31, resolved: 28 },
    { day: 'Sat', reported: 15, resolved: 19 },
    { day: 'Sun', reported: 12, resolved: 16 }
  ];

  // Priority Distribution Data
  const priorityData = [
    { name: 'Critical', value: 12, color: '#ef4444' },
    { name: 'High', value: 24, color: '#f97316' },
    { name: 'Medium', value: 38, color: '#eab308' },
    { name: 'Low', value: 26, color: '#10b981' }
  ];

  // AI Clustering Savings Data
  const clusterSavings = {
    duplicateCount: 34,
    dispatchesSaved: 28,
    fuelSavedKm: 420,
    responseTimeImprovement: '41%'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Municipal Grievance Intelligence & SLAs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Civic Resolution & Department Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Real-time monitoring of civic resolution velocity, officer SLAs, and AI duplicate clustering efficiency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1 text-xs font-bold">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    timeRange === r
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'Quarterly'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('authority-complaints')}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              View Grievance Queue
            </button>
          </div>
        </div>

        {/* Top KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Overall Resolution Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{resolvedPercent}%</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +6.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Target SLA threshold: 85%</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Avg Turnaround Time</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">18.4 hrs</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> -4.2 hrs
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Down from 22.6 hrs last cycle</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>AI Merged Clusters</span>
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{clusters.length || 7}</span>
              <span className="text-xs font-bold text-orange-600 flex items-center">
                34 Duplicates
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Prevented 28 redundant team trips</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Active High Severity</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-red-600">{critical}</span>
              <span className="text-xs font-bold text-amber-500">Under 12h SLA</span>
            </div>
            <p className="text-[11px] text-slate-400">Auto-escalated to Executive Engineer</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Inflow vs Outflow Trend Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Grievance Inflow vs. Resolution Velocity
                </h3>
                <p className="text-xs text-slate-500">
                  Weekly comparison of citizen submissions against verified municipal closures.
                </p>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="reported"
                    name="Reported Grievances"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Resolved / Closed"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution Donut (1 Col) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Grievances by Priority
              </h3>
              <p className="text-xs text-slate-500">
                AI automated safety severity breakdown.
              </p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '10px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}:</span>
                  <strong className="text-slate-900 dark:text-white">{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department SLA Scorecard Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Department Performance Scorecard
              </h3>
              <p className="text-xs text-slate-500">
                Comparative breakdown of department volume, resolution rates, and average resolution speed.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Department</th>
                  <th className="pb-3">Total Assigned</th>
                  <th className="pb-3">Resolved</th>
                  <th className="pb-3">Success Rate</th>
                  <th className="pb-3">Avg Resolution Time</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {departmentData.map((dept) => {
                  const rate = Math.round((dept.resolved / dept.total) * 100);
                  const isTop = rate >= 85;
                  return (
                    <tr key={dept.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-orange-500" />
                        <span>{dept.name}</span>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">{dept.total}</td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">{dept.resolved}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isTop ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="font-bold">{rate}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-600 dark:text-slate-300">{dept.avgHours} hours</td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isTop
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {isTop ? 'SLA Met' : 'Attention Needed'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
