import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Layers,
  Flame,
  CheckCircle2,
  Building,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { IssueCluster } from '../types';

export const AiClustersView: React.FC = () => {
  const {
    t,
    clusters,
    complaints,
    selectedClusterId,
    setSelectedClusterId,
    setSelectedComplaintId,
    setCurrentView,
    role,
  } = useApp();

  const [expandedClusterId, setExpandedClusterId] = useState<string | null>(
    selectedClusterId || (clusters[0]?.id || null)
  );

  const toggleExpand = (id: string) => {
    setExpandedClusterId(expandedClusterId === id ? null : id);
    setSelectedClusterId(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Semantic Duplicate & Grouping Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          AI-Generated Civic Issue Clusters
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Instead of dispatching 50 different crews for 50 separate citizen complaints on the same road, JanSetu AI groups semantic duplicates and location clusters into unified municipal work orders.
        </p>
      </div>

      {/* Cluster Cards Grid */}
      <div className="space-y-4">
        {clusters.map((cluster) => {
          const isExpanded = expandedClusterId === cluster.id;
          const clusterComplaints = complaints.filter(
            (c) => c.clusterId === cluster.id || cluster.complaintIds.includes(c.id)
          );

          const isCritical = cluster.priority === 'CRITICAL';
          const isHigh = cluster.priority === 'HIGH';

          return (
            <div
              key={cluster.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Cluster Card Header */}
              <div
                onClick={() => toggleExpand(cluster.id)}
                className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {cluster.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-red-100 text-red-700'
                            : isHigh
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {cluster.priority} ({cluster.priorityScore}/100)
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {cluster.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-slate-900">
                      {cluster.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cluster.location.address}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-orange-700">
                        <Building className="w-3.5 h-3.5" />
                        <span>{cluster.department}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right side stats & toggle */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl font-bold text-xs">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>{cluster.totalComplaints} Reports Grouped</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Status: <strong className="text-slate-700">{cluster.status}</strong>
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Breakdown of Cluster */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 animate-in fade-in duration-150">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      Cluster Overview & Impact
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {cluster.description}
                    </p>
                  </div>

                  {/* Grouped Individual Citizen Grievances */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Linked Citizen Grievances ({clusterComplaints.length} loaded):
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {clusterComplaints.map((comp) => (
                        <div
                          key={comp.id}
                          className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-slate-600">
                              {comp.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {comp.language}
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 italic">“{comp.grievance}”</p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                            <span className="text-slate-400">By {comp.citizenName}</span>
                            <button
                              onClick={() => {
                                setSelectedComplaintId(comp.id);
                                if (role === 'AUTHORITY') {
                                  setCurrentView('authority-complaints');
                                } else {
                                  setCurrentView('track');
                                }
                              }}
                              className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
                            >
                              <span>Inspect →</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
