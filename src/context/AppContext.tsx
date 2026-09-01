import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AIAnalysisResponse,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  DashboardStats,
  Department,
  Hotspot,
  IssueCluster,
  LanguageCode,
  NotificationItem,
  Priority,
  User,
  UserRole,
} from '../types';
import { TRANSLATIONS, TranslationStrings } from '../translations';

export type AppView =
  | 'landing'
  | 'citizen-home'
  | 'report'
  | 'my-complaints'
  | 'track'
  | 'authority-dashboard'
  | 'authority-complaints'
  | 'gis-map'
  | 'clusters'
  | 'authority-analytics'
  | 'faq-help'
  | 'contact-support'
  | 'policies'
  | 'settings'
  | 'profile';

export type ThemeMode = 'light' | 'dark' | 'system';
export type TextSizeMode = 'normal' | 'large' | 'extralarge';

interface AppContextType {
  currentUser: User | null;
  role: UserRole;
  language: LanguageCode;
  t: TranslationStrings;
  currentView: AppView;
  complaints: Complaint[];
  clusters: IssueCluster[];
  hotspots: Hotspot[];
  notifications: NotificationItem[];
  dashboardStats: DashboardStats | null;
  selectedComplaintId: string | null;
  selectedClusterId: string | null;
  isLoading: boolean;
  activeNotificationCount: number;
  // Theme & Accessibility
  theme: ThemeMode;
  isDarkMode: boolean;
  textSize: TextSizeMode;
  highContrast: boolean;
  reduceAnimations: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setTextSize: (size: TextSizeMode) => void;
  setHighContrast: (enabled: boolean) => void;
  setReduceAnimations: (enabled: boolean) => void;
  setLanguage: (lang: LanguageCode) => void;
  setRole: (role: UserRole) => void;
  setCurrentView: (view: AppView) => void;
  setSelectedComplaintId: (id: string | null) => void;
  setSelectedClusterId: (id: string | null) => void;
  analyzeGrievance: (
    grievance: string,
    imageBase64?: string,
    imageMimeType?: string
  ) => Promise<AIAnalysisResponse & { is_duplicate?: boolean; duplicate_of_id?: string; similarity_score?: number; similar_complaints_found?: number; suggested_cluster_id?: string; suggested_cluster_title?: string }>;
  submitComplaint: (payload: Partial<Complaint>) => Promise<Complaint>;
  updateComplaint: (
    id: string,
    updates: {
      status?: ComplaintStatus;
      assignedOfficer?: string;
      department?: Department;
      priority?: Priority;
      internalNote?: string;
      clusterId?: string;
    }
  ) => Promise<Complaint>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole>('CITIZEN');
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Theme & Accessibility States
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('jansetu_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'light';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jansetu_theme') as ThemeMode;
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [textSize, setTextSizeState] = useState<TextSizeMode>(() => {
    const saved = localStorage.getItem('jansetu_textsize') as TextSizeMode;
    return saved === 'large' || saved === 'extralarge' ? saved : 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('jansetu_highcontrast') === 'true';
  });

  const [reduceAnimations, setReduceAnimationsState] = useState<boolean>(() => {
    return localStorage.getItem('jansetu_reduceanimations') === 'true';
  });

  // Apply Theme class
  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('jansetu_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply Text Scaling class
  useEffect(() => {
    document.documentElement.classList.remove('text-scale-large', 'text-scale-extralarge');
    if (textSize === 'large') {
      document.documentElement.classList.add('text-scale-large');
    } else if (textSize === 'extralarge') {
      document.documentElement.classList.add('text-scale-extralarge');
    }
    localStorage.setItem('jansetu_textsize', textSize);
  }, [textSize]);

  // Apply High Contrast class
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('jansetu_highcontrast', highContrast ? 'true' : 'false');
  }, [highContrast]);

  // Apply Reduced Motion class
  useEffect(() => {
    if (reduceAnimations) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('jansetu_reduceanimations', reduceAnimations ? 'true' : 'false');
  }, [reduceAnimations]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTextSize = (size: TextSizeMode) => {
    setTextSizeState(size);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
  };

  const setReduceAnimations = (enabled: boolean) => {
    setReduceAnimationsState(enabled);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('jansetu_language', lang);
  };

  const setRole = async (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      setCurrentUser(data.user);
      if (newRole === 'AUTHORITY' && (currentView === 'landing' || currentView === 'citizen-home' || currentView === 'report' || currentView === 'my-complaints')) {
        setCurrentView('authority-dashboard');
      } else if (newRole === 'CITIZEN' && (currentView === 'authority-dashboard' || currentView === 'authority-complaints' || currentView === 'clusters')) {
        setCurrentView('citizen-home');
      }
    } catch (err) {
      console.error('Error switching role:', err);
    }
  };

  const refreshData = async () => {
    try {
      const [userRes, compRes, clusterRes, hotspotRes, notifRes, statsRes] = await Promise.all([
        fetch('/api/auth/me').then((r) => r.json()),
        fetch('/api/complaints').then((r) => r.json()),
        fetch('/api/clusters').then((r) => r.json()),
        fetch('/api/dashboard/hotspots').then((r) => r.json()),
        fetch('/api/notifications').then((r) => r.json()),
        fetch('/api/dashboard/stats').then((r) => r.json()),
      ]);

      if (userRes.user) {
        setCurrentUser(userRes.user);
        setRoleState(userRes.user.role);
      }
      if (compRes.complaints) setComplaints(compRes.complaints);
      if (Array.isArray(clusterRes)) setClusters(clusterRes);
      if (Array.isArray(hotspotRes)) setHotspots(hotspotRes);
      if (Array.isArray(notifRes)) setNotifications(notifRes);
      if (statsRes) setDashboardStats(statsRes);
    } catch (err) {
      console.error('Error loading data from JanSetu server:', err);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('jansetu_language') as LanguageCode;
    if (savedLang && TRANSLATIONS[savedLang]) {
      setLanguageState(savedLang);
    }
    refreshData();
  }, []);

  const analyzeGrievance = async (
    grievance: string,
    imageBase64?: string,
    imageMimeType?: string
  ) => {
    const res = await fetch('/api/complaints/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grievance, imageBase64, imageMimeType }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to analyze grievance');
    }

    return await res.json();
  };

  const submitComplaint = async (payload: Partial<Complaint>) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit complaint');
      }

      const created: Complaint = await res.json();
      await refreshData();
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaint = async (
    id: string,
    updates: {
      status?: ComplaintStatus;
      assignedOfficer?: string;
      department?: Department;
      priority?: Priority;
      internalNote?: string;
      clusterId?: string;
    }
  ) => {
    const res = await fetch(`/api/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update complaint');
    }

    const updated: Complaint = await res.json();
    await refreshData();
    return updated;
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const activeNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        language,
        t,
        currentView,
        complaints,
        clusters,
        hotspots,
        notifications,
        dashboardStats,
        selectedComplaintId,
        selectedClusterId,
        isLoading,
        activeNotificationCount,
        setLanguage,
        setRole,
        setCurrentView,
        setSelectedComplaintId,
        setSelectedClusterId,
        analyzeGrievance,
        submitComplaint,
        updateComplaint,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
