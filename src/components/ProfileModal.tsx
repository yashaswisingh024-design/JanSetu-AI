import React from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../translations';
import {
  User,
  ShieldCheck,
  Globe,
  MapPin,
  Phone,
  Mail,
  X,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    role,
    setRole,
    language,
    setLanguage,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-extrabold text-slate-900">User Profile & Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            {currentUser?.name?.slice(0, 1) || 'A'}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              {currentUser?.name || 'Aarav Sharma'}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ward 4, Pune Municipal Corporation</span>
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
            </span>
            <span className="font-bold text-slate-800">{currentUser?.phone || '+91 98765 43210'}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
            </span>
            <span className="font-bold text-slate-800">{currentUser?.email || 'citizen@jansetu.in'}</span>
          </div>
        </div>

        {/* Role Toggle in Profile */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
            Switch Portal Role:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setRole('CITIZEN')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'CITIZEN'
                  ? 'border-orange-500 bg-orange-50 text-orange-700 font-extrabold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen Portal</span>
            </button>

            <button
              onClick={() => setRole('AUTHORITY')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                role === 'AUTHORITY'
                  ? 'border-slate-900 bg-slate-900 text-white font-extrabold shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authority Hub</span>
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
            Preferred Indian Language:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors truncate ${
                  language === lang.code
                    ? 'bg-orange-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
