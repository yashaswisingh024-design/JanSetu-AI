import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Layers,
  Flame,
  Filter,
  Eye,
  Building,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Complaint, Priority } from '../types';
import L from 'leaflet';

export const GisMap: React.FC = () => {
  const {
    complaints,
    hotspots,
    clusters,
    role,
    setSelectedComplaintId,
    setCurrentView,
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [showHotspots, setShowHotspots] = useState(true);
  const [focusedComplaint, setFocusedComplaint] = useState<Complaint | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center at Pune (18.5204, 73.8567)
      const map = L.map(mapContainerRef.current, {
        center: [18.525, 73.85],
        zoom: 13,
        zoomControl: true,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | JanSetu AI',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      hotspotsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup if unmounting
    };
  }, []);

  // Update Markers and Hotspots whenever filters or complaints change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !hotspotsLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    hotspotsLayerRef.current.clearLayers();

    // Filter complaints
    const visibleComplaints = complaints.filter((c) => {
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
      if (selectedPriority !== 'ALL' && c.priority !== selectedPriority) return false;
      return true;
    });

    // Add complaint markers
    visibleComplaints.forEach((comp) => {
      const lat = comp.location.latitude || 18.5204;
      const lng = comp.location.longitude || 73.8567;

      const color =
        comp.priority === 'CRITICAL'
          ? '#dc2626'
          : comp.priority === 'HIGH'
          ? '#ea580c'
          : comp.priority === 'MEDIUM'
          ? '#eab308'
          : '#10b981';

      // Custom SVG Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-gis-pin',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; max-width: 220px; line-height: 1.4;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-family: monospace; font-weight: bold; color: #1e293b;">${comp.id}</span>
            <span style="background: ${color}20; color: ${color}; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px;">${comp.priority}</span>
          </div>
          <strong style="display: block; color: #0f172a; margin-bottom: 4px;">${comp.summary}</strong>
          <span style="color: #64748b; font-size: 11px; display: block; margin-bottom: 4px;">📍 ${comp.location.address}</span>
          <span style="color: #c2410c; font-size: 11px; font-weight: 600; display: block; margin-bottom: 8px;">🏛️ ${comp.department}</span>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setFocusedComplaint(comp);
      });

      marker.addTo(markersLayerRef.current!);
    });

    // Add Hotspots Circles
    if (showHotspots) {
      hotspots.forEach((hs) => {
        const circle = L.circle([hs.latitude, hs.longitude], {
          radius: hs.radiusMeters || 600,
          color: hs.severity === 'CRITICAL' ? '#dc2626' : hs.severity === 'HIGH' ? '#ea580c' : '#eab308',
          fillColor: hs.severity === 'CRITICAL' ? '#dc2626' : hs.severity === 'HIGH' ? '#ea580c' : '#eab308',
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '4, 4',
        });

        circle.bindTooltip(
          `<strong>${hs.title}</strong><br/>${hs.complaintCount} Grievances Clustered`,
          { sticky: true, direction: 'top' }
        );

        circle.addTo(hotspotsLayerRef.current!);
      });
    }
  }, [complaints, hotspots, selectedCategory, selectedPriority, showHotspots]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">
              City-Wide Civic GIS Telemetry Map
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time geospatial visualization of complaints, severity markers, and municipal clusters.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs text-xs">
          <div className="flex items-center gap-1.5 font-bold text-red-600">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-orange-600">
            <div className="w-3 h-3 rounded-full bg-orange-600" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-yellow-600">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-600">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="ALL">All Categories</option>
              <option value="Roads & Infrastructure">Roads & Infrastructure</option>
              <option value="Garbage & Sanitation">Garbage & Sanitation</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Streetlights & Electricity">Streetlights</option>
              <option value="Drainage & Sewage">Drainage</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">🔴 Critical Only</option>
              <option value="HIGH">🟠 High Only</option>
              <option value="MEDIUM">🟡 Medium Only</option>
              <option value="LOW">🟢 Low Only</option>
            </select>
          </div>
        </div>

        {/* Hotspots toggle */}
        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
          <input
            type="checkbox"
            checked={showHotspots}
            onChange={(e) => setShowHotspots(e.target.checked)}
            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
          />
          <span>Show Municipal Hotspot Zones</span>
        </label>
      </div>

      {/* Map & Side Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Canvas */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[540px] relative z-10">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Right Side: Selected Complaint / Hotspots Drawer */}
        <div className="lg:col-span-4 space-y-4">
          {focusedComplaint ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold text-slate-600">
                  {focusedComplaint.id}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    focusedComplaint.priority === 'CRITICAL'
                      ? 'bg-red-100 text-red-700'
                      : focusedComplaint.priority === 'HIGH'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {focusedComplaint.priority} ({focusedComplaint.priorityScore}/100)
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{focusedComplaint.summary}</h3>
                <p className="text-xs text-slate-500 italic">“{focusedComplaint.grievance}”</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Location</span>
                <p className="font-bold text-slate-800">{focusedComplaint.location.address}</p>
                {focusedComplaint.location.landmark && (
                  <p className="text-slate-500 text-[11px]">
                    Landmark: {focusedComplaint.location.landmark}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 block">Category</span>
                  <span className="font-bold text-slate-800">{focusedComplaint.category}</span>
                </div>
                <div className="p-2.5 bg-orange-50/60 rounded-xl">
                  <span className="text-[10px] font-bold text-orange-600 block">Department</span>
                  <span className="font-bold text-orange-950 truncate block">
                    {focusedComplaint.department}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedComplaintId(focusedComplaint.id);
                  if (role === 'AUTHORITY') {
                    setCurrentView('authority-complaints');
                  } else {
                    setCurrentView('track');
                  }
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{role === 'AUTHORITY' ? 'Dispatch / Edit Complaint' : 'Track Timeline'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Active High-Density Hotspots</h3>
              <p className="text-xs text-slate-400">
                Click any marker on the map or select a hotspot below to inspect.
              </p>

              <div className="space-y-3">
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([hs.latitude, hs.longitude], 15, {
                          duration: 1.2,
                        });
                      }
                    }}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-orange-50/50 hover:border-orange-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs group-hover:text-orange-700">
                        {hs.title}
                      </h4>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-700">
                        {hs.complaintCount} Reports
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{hs.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
