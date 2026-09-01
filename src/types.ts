export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintCategory =
  | 'Roads & Infrastructure'
  | 'Garbage & Sanitation'
  | 'Water Supply'
  | 'Drainage'
  | 'Streetlights'
  | 'Traffic'
  | 'Public Health'
  | 'Public Transport'
  | 'Parks & Public Spaces'
  | 'Electricity'
  | 'Other';

export type Department =
  | 'PWD / Municipal Roads'
  | 'Sanitation Department'
  | 'Water Supply & Sewerage Board'
  | 'Stormwater & Drainage Department'
  | 'Electrical & Lighting Department'
  | 'Traffic Police & Transport'
  | 'Public Health & Sanitation'
  | 'Parks & Horticulture Department'
  | 'Power Distribution Corporation'
  | 'General Municipal Administration';

export type ComplaintStatus =
  | 'Submitted'
  | 'AI Analyzed'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export type UserRole = 'CITIZEN' | 'AUTHORITY';

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'mr'
  | 'bn'
  | 'te'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa';

export interface LocationData {
  address: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude: number;
  longitude: number;
}

export interface StatusHistoryItem {
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  grievance: string;
  summary: string;
  category: ComplaintCategory;
  department: Department;
  priority: Priority;
  priorityScore: number; // 0-100
  priorityReason: string;
  language: string;
  languageCode: LanguageCode;
  location: LocationData;
  photoUrl?: string;
  clusterId?: string;
  clusterTitle?: string;
  isDuplicate?: boolean;
  duplicateOfId?: string;
  similarityScore?: number; // 0-100
  status: ComplaintStatus;
  assignedOfficer?: string;
  internalNotes?: string[];
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IssueCluster {
  id: string;
  title: string;
  category: ComplaintCategory;
  department: Department;
  location: LocationData;
  complaintCount: number;
  averagePriorityScore: number;
  highestPriority: Priority;
  firstReportedAt: string;
  latestReportedAt: string;
  status: ComplaintStatus;
  summary: string;
  complaintIds: string[];
}

export interface Hotspot {
  id: string;
  name: string;
  location: LocationData;
  complaintCount: number;
  criticalCount: number;
  highCount: number;
  mainCategory: ComplaintCategory;
  clusterId: string;
}

export interface AIAnalysisResponse {
  grievance_summary: string;
  category: ComplaintCategory;
  department: Department;
  priority: Priority;
  priority_score: number;
  priority_reason: string;
  language: string;
  language_code: LanguageCode;
  keywords: string[];
  location_context: string;
  similar_complaints_found?: number;
  highest_similarity?: number;
  suggested_cluster_id?: string;
  suggested_cluster_title?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  complaintId?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  preferredLanguage: LanguageCode;
  savedLocation?: LocationData;
  department?: Department;
  badge?: string;
}

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  highPriorityComplaints: number;
  criticalComplaints: number;
  duplicateComplaints: number;
  resolvedComplaints: number;
  resolutionRatePercentage: number;
  avgResolutionHours: number;
  categoryBreakdown: { category: string; count: number; color: string }[];
  departmentBreakdown: { department: string; count: number; resolved: number }[];
  priorityBreakdown: { priority: Priority; count: number; color: string }[];
  weeklyTrends: { day: string; received: number; resolved: number }[];
  aiInsights: string[];
}
