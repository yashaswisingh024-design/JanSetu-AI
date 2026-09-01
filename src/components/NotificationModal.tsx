import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedComplaintId,
    setCurrentView,
    role,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Notifications</h2>
              <p className="text-[11px] text-slate-500">Live grievance status updates & dispatches</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const isStatus = n.type === 'STATUS_UPDATE';
              const isCluster = n.type === 'CLUSTER_CREATED';
              const isHigh = n.type === 'HIGH_PRIORITY_ALERT';

              return (
                <div
                  key={n.id}
                  onClick={async () => {
                    await markNotificationAsRead(n.id);
                    if (n.complaintId) {
                      setSelectedComplaintId(n.complaintId);
                      if (role === 'AUTHORITY') {
                        setCurrentView('authority-complaints');
                      } else {
                        setCurrentView('track');
                      }
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    !n.read
                      ? 'bg-orange-50/60 border-orange-200'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {isStatus && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isCluster && <Layers className="w-3.5 h-3.5 text-indigo-600" />}
                      {isHigh && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                      <span>{n.title}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{n.message}</p>

                  {n.complaintId && (
                    <span className="inline-block text-[10px] font-mono font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded">
                      {n.complaintId}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No notifications right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
