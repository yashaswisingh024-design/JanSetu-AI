import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_CLUSTERS,
  INITIAL_COMPLAINTS,
  INITIAL_HOTSPOTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from './server/seedData';
import {
  analyzeComplaintWithGemini,
  detectDuplicatesAndClusters,
} from './server/geminiService';
import {
  Complaint,
  DashboardStats,
  IssueCluster,
  NotificationItem,
  User,
} from './src/types';

// In-memory persistent database store
let complaints: Complaint[] = [...INITIAL_COMPLAINTS];
let clusters: IssueCluster[] = [...INITIAL_CLUSTERS];
let hotspots = [...INITIAL_HOTSPOTS];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let currentUser: User = INITIAL_USERS[0];

let nextComplaintNumber = 1024;

function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const idStr = `JS-${year}-${String(nextComplaintNumber++).padStart(6, '0')}`;
  return idStr;
}

function calculateDashboardStats(): DashboardStats {
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Submitted' || c.status === 'AI Analyzed' || c.status === 'Assigned').length;
  const high = complaints.filter((c) => c.priority === 'HIGH').length;
  const critical = complaints.filter((c) => c.priority === 'CRITICAL').length;
  const duplicates = complaints.filter((c) => c.isDuplicate).length;
  const resolved = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  for (const c of complaints) {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  }
  const categoryColors: Record<string, string> = {
    'Roads & Infrastructure': '#f97316',
    'Garbage & Sanitation': '#10b981',
    'Water Supply': '#0ea5e9',
    'Drainage': '#8b5cf6',
    'Streetlights': '#eab308',
    'Traffic': '#ec4899',
    'Electricity': '#ef4444',
    'Parks & Public Spaces': '#14b8a6',
    'Public Health': '#06b6d4',
  };

  const categoryBreakdown = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat,
    count,
    color: categoryColors[cat] || '#64748b',
  }));

  // Department breakdown
  const deptCounts: Record<string, { total: number; resolved: number }> = {};
  for (const c of complaints) {
    if (!deptCounts[c.department]) {
      deptCounts[c.department] = { total: 0, resolved: 0 };
    }
    deptCounts[c.department].total += 1;
    if (c.status === 'Resolved' || c.status === 'Closed') {
      deptCounts[c.department].resolved += 1;
    }
  }

  const departmentBreakdown = Object.entries(deptCounts).map(([dept, data]) => ({
    department: dept.replace(' Department', '').replace(' / Municipal Roads', ''),
    count: data.total,
    resolved: data.resolved,
  }));

  // Priority breakdown
  const priorityBreakdown = [
    { priority: 'CRITICAL' as const, count: critical, color: '#ef4444' },
    { priority: 'HIGH' as const, count: high, color: '#f97316' },
    {
      priority: 'MEDIUM' as const,
      count: complaints.filter((c) => c.priority === 'MEDIUM').length,
      color: '#eab308',
    },
    {
      priority: 'LOW' as const,
      count: complaints.filter((c) => c.priority === 'LOW').length,
      color: '#10b981',
    },
  ];

  // Weekly trends
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyTrends = days.map((day, idx) => ({
    day,
    received: Math.max(3, Math.round(total * (0.1 + (idx % 3) * 0.05))),
    resolved: Math.max(2, Math.round(resolved * (0.08 + ((idx + 1) % 3) * 0.05))),
  }));

  // AI Insights
  const roadCount = complaints.filter((c) => c.category === 'Roads & Infrastructure').length;
  const collegeCluster = clusters.find((c) => c.id === 'CLUSTER-PUNE-001');
  const marketCluster = clusters.find((c) => c.id === 'CLUSTER-PUNE-002');

  const aiInsights = [
    `Road & Infrastructure complaints surged 23% this week across university corridors.`,
    `ABC College Road hotspot has ${collegeCluster ? collegeCluster.complaintCount : 17} reports with ${critical} critical hazard flags.`,
    `Garbage overflow complaints are heavily concentrated around Central Market (Lane 4).`,
    `${duplicates} complaints automatically merged into unified issue clusters, saving ~14 hours of redundant inspection.`,
  ];

  return {
    totalComplaints: total,
    pendingComplaints: pending,
    highPriorityComplaints: high,
    criticalComplaints: critical,
    duplicateComplaints: duplicates,
    resolvedComplaints: resolved,
    resolutionRatePercentage: resolutionRate,
    avgResolutionHours: 28,
    categoryBreakdown,
    departmentBreakdown,
    priorityBreakdown,
    weeklyTrends,
    aiInsights,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Current session user & auth
  app.get('/api/auth/me', (req, res) => {
    res.json({ user: currentUser });
  });

  app.post('/api/auth/switch-role', (req, res) => {
    const { role } = req.body;
    if (role === 'AUTHORITY') {
      currentUser = INITIAL_USERS[1];
    } else {
      currentUser = INITIAL_USERS[0];
    }
    res.json({ user: currentUser });
  });

  app.post('/api/auth/profile', (req, res) => {
    const { name, preferredLanguage, phone, savedLocation } = req.body;
    currentUser = {
      ...currentUser,
      name: name || currentUser.name,
      preferredLanguage: preferredLanguage || currentUser.preferredLanguage,
      phone: phone || currentUser.phone,
      savedLocation: savedLocation || currentUser.savedLocation,
    };
    res.json({ user: currentUser });
  });

  // Analyze complaint with Gemini AI
  app.post('/api/complaints/analyze', async (req, res) => {
    try {
      const { grievance, imageBase64, imageMimeType } = req.body;

      if (!grievance || typeof grievance !== 'string' || grievance.trim().length === 0) {
        return res.status(400).json({ error: 'Grievance description is required' });
      }

      // Run Gemini analysis
      const analysis = await analyzeComplaintWithGemini(
        grievance,
        imageBase64,
        imageMimeType
      );

      // Run duplicate & cluster detection
      const dupCheck = detectDuplicatesAndClusters(
        grievance,
        analysis.grievance_summary,
        analysis.category,
        complaints,
        clusters
      );

      res.json({
        ...analysis,
        is_duplicate: dupCheck.isDuplicate,
        duplicate_of_id: dupCheck.duplicateOfId,
        similarity_score: dupCheck.similarityScore,
        similar_complaints_found: dupCheck.similarCount,
        suggested_cluster_id: dupCheck.matchingClusterId,
        suggested_cluster_title: dupCheck.matchingClusterTitle,
      });
    } catch (err: any) {
      console.error('Error analyzing complaint:', err);
      res.status(500).json({ error: err?.message || 'Failed to analyze complaint' });
    }
  });

  // Submit new complaint
  app.post('/api/complaints', async (req, res) => {
    try {
      const {
        grievance,
        summary,
        category,
        department,
        priority,
        priorityScore,
        priorityReason,
        language,
        languageCode,
        location,
        photoUrl,
        clusterId,
        clusterTitle,
        isDuplicate,
        duplicateOfId,
        similarityScore,
      } = req.body;

      const newId = generateComplaintId();
      const now = new Date().toISOString();

      let assignedClusterId = clusterId;
      let assignedClusterTitle = clusterTitle;

      // If user complaint matched or initiated a cluster, update the cluster
      if (assignedClusterId) {
        const existingCluster = clusters.find((c) => c.id === assignedClusterId);
        if (existingCluster) {
          existingCluster.complaintCount += 1;
          existingCluster.latestReportedAt = now;
          if (!existingCluster.complaintIds.includes(newId)) {
            existingCluster.complaintIds.push(newId);
          }
        }
      } else {
        // Create new cluster if severe or unique
        const newCluster: IssueCluster = {
          id: `CLUSTER-${category.replace(/[^A-Z]/g, '').slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`,
          title: summary || `${category} Issue at ${location?.landmark || location?.address || 'Civic Area'}`,
          category,
          department,
          location: location || {
            address: 'Pune Municipal Area',
            latitude: 18.5204,
            longitude: 73.8567,
          },
          complaintCount: 1,
          averagePriorityScore: priorityScore || 75,
          highestPriority: priority || 'MEDIUM',
          firstReportedAt: now,
          latestReportedAt: now,
          status: 'Submitted',
          summary: grievance,
          complaintIds: [newId],
        };
        clusters.unshift(newCluster);
        assignedClusterId = newCluster.id;
        assignedClusterTitle = newCluster.title;
      }

      const newComplaint: Complaint = {
        id: newId,
        citizenId: currentUser.id,
        citizenName: currentUser.name,
        citizenPhone: currentUser.phone,
        grievance,
        summary: summary || grievance.slice(0, 100),
        category: category || 'Roads & Infrastructure',
        department: department || 'PWD / Municipal Roads',
        priority: priority || 'MEDIUM',
        priorityScore: Number(priorityScore) || 75,
        priorityReason: priorityReason || 'AI automated priority assessment',
        language: language || 'English',
        languageCode: languageCode || 'en',
        location: location || {
          address: 'Pune Municipal Area',
          latitude: 18.5204,
          longitude: 73.8567,
        },
        photoUrl,
        clusterId: assignedClusterId,
        clusterTitle: assignedClusterTitle,
        isDuplicate: Boolean(isDuplicate),
        duplicateOfId,
        similarityScore,
        status: 'Submitted',
        statusHistory: [
          {
            status: 'Submitted',
            timestamp: now,
            updatedBy: `Citizen (${currentUser.name})`,
          },
          {
            status: 'AI Analyzed',
            timestamp: new Date(Date.now() + 2000).toISOString(),
            updatedBy: 'JanSetu AI Engine',
            note: `Identified department: ${department}. Priority: ${priority}.`,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      complaints.unshift(newComplaint);

      // Create notification for citizen
      notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        userId: currentUser.id,
        complaintId: newId,
        title: `Complaint ${newId} Submitted`,
        message: `Your grievance regarding "${newComplaint.summary.slice(0, 50)}..." has been routed to ${newComplaint.department}.`,
        type: priority === 'CRITICAL' ? 'critical' : 'success',
        read: false,
        createdAt: now,
      });

      res.status(201).json(newComplaint);
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      res.status(500).json({ error: err?.message || 'Failed to submit complaint' });
    }
  });

  // Get all complaints with filters
  app.get('/api/complaints', (req, res) => {
    let list = [...complaints];
    const { category, department, priority, status, search, citizenOnly, duplicateOnly } = req.query;

    if (citizenOnly === 'true') {
      list = list.filter((c) => c.citizenId === currentUser.id);
    }

    if (category && category !== 'ALL') {
      list = list.filter((c) => c.category === category);
    }

    if (department && department !== 'ALL') {
      list = list.filter((c) => c.department === department);
    }

    if (priority && priority !== 'ALL') {
      list = list.filter((c) => c.priority === priority);
    }

    if (status && status !== 'ALL') {
      list = list.filter((c) => c.status === status);
    }

    if (duplicateOnly === 'true') {
      list = list.filter((c) => c.isDuplicate);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.grievance.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.location.address.toLowerCase().includes(q) ||
          (c.location.landmark && c.location.landmark.toLowerCase().includes(q)) ||
          c.citizenName.toLowerCase().includes(q)
      );
    }

    res.json({
      total: list.length,
      complaints: list,
    });
  });

  // Get single complaint
  app.get('/api/complaints/:id', (req, res) => {
    const { id } = req.params;
    const complaint = complaints.find((c) => c.id.toLowerCase() === id.toLowerCase());

    if (!complaint) {
      return res.status(404).json({ error: `Complaint with ID "${id}" not found.` });
    }

    // Find similar complaints in same cluster or category
    const similar = complaints.filter(
      (c) => c.id !== complaint.id && (c.clusterId === complaint.clusterId || (c.category === complaint.category && c.isDuplicate))
    );

    res.json({
      complaint,
      similarComplaints: similar,
    });
  });

  // Update complaint (Authority actions)
  app.patch('/api/complaints/:id', (req, res) => {
    const { id } = req.params;
    const index = complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ error: `Complaint with ID "${id}" not found.` });
    }

    const { status, assignedOfficer, department, priority, internalNote, clusterId } = req.body;
    const current = complaints[index];
    const now = new Date().toISOString();

    const updated: Complaint = {
      ...current,
      status: status || current.status,
      assignedOfficer: assignedOfficer !== undefined ? assignedOfficer : current.assignedOfficer,
      department: department || current.department,
      priority: priority || current.priority,
      clusterId: clusterId !== undefined ? clusterId : current.clusterId,
      updatedAt: now,
    };

    if (internalNote) {
      updated.internalNotes = [...(current.internalNotes || []), internalNote];
    }

    if (status && status !== current.status) {
      updated.statusHistory.push({
        status,
        timestamp: now,
        updatedBy: currentUser.role === 'AUTHORITY' ? `${currentUser.name} (${currentUser.badge || 'Officer'})` : currentUser.name,
        note: internalNote,
      });

      // Notify citizen
      notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        userId: current.citizenId,
        complaintId: current.id,
        title: `Status Updated: ${status}`,
        message: `Your complaint ${current.id} status changed to "${status}" by ${updated.department}.`,
        type: status === 'Resolved' ? 'success' : 'info',
        read: false,
        createdAt: now,
      });
    }

    complaints[index] = updated;
    res.json(updated);
  });

  // Clusters list
  app.get('/api/clusters', (req, res) => {
    res.json(clusters);
  });

  // Single cluster with linked complaints
  app.get('/api/clusters/:id', (req, res) => {
    const cluster = clusters.find((c) => c.id === req.params.id);
    if (!cluster) {
      return res.status(404).json({ error: 'Cluster not found' });
    }
    const linked = complaints.filter((c) => c.clusterId === cluster.id || cluster.complaintIds.includes(c.id));
    res.json({ cluster, complaints: linked });
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', (req, res) => {
    res.json(calculateDashboardStats());
  });

  // GIS Hotspots
  app.get('/api/dashboard/hotspots', (req, res) => {
    res.json(hotspots);
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const userNotifs = notifications.filter(
      (n) => n.userId === currentUser.id || currentUser.role === 'AUTHORITY'
    );
    res.json(userNotifs);
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const notif = notifications.find((n) => n.id === req.params.id);
    if (notif) {
      notif.read = true;
    }
    res.json({ success: true });
  });

  app.post('/api/notifications/mark-all-read', (req, res) => {
    notifications.forEach((n) => {
      if (n.userId === currentUser.id || currentUser.role === 'AUTHORITY') {
        n.read = true;
      }
    });
    res.json({ success: true });
  });

  // --- Vite & Static Asset Handling ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🇮🇳 JanSetu AI Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
