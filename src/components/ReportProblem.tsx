import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../translations';
import {
  Mic,
  MicOff,
  Camera,
  MapPin,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Building,
  Flame,
  Layers,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AIAnalysisResponse, Complaint, LanguageCode } from '../types';

interface ReportProblemProps {
  initialGrievance?: string;
  onClearInitialGrievance?: () => void;
}

export const ReportProblem: React.FC<ReportProblemProps> = ({
  initialGrievance = '',
  onClearInitialGrievance,
}) => {
  const {
    t,
    language,
    setLanguage,
    analyzeGrievance,
    submitComplaint,
    setCurrentView,
    setSelectedComplaintId,
  } = useApp();

  // Form State
  const [grievanceText, setGrievanceText] = useState(initialGrievance);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [photoMime, setPhotoMime] = useState<string>('image/jpeg');
  const [locationAddress, setLocationAddress] = useState('ABC College Road, Gate 2, Pune');
  const [landmark, setLandmark] = useState('Near ABC College Canteen');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 18.5314,
    lng: 73.8446,
  });
  const [locationDetecting, setLocationDetecting] = useState(false);
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);

  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Workflow Stage: 'input' | 'analyzing' | 'confirm' | 'success'
  const [stage, setStage] = useState<'input' | 'analyzing' | 'confirm' | 'success'>('input');
  const [analysisStep, setAnalysisStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState<
    (AIAnalysisResponse & {
      is_duplicate?: boolean;
      duplicate_of_id?: string;
      similarity_score?: number;
      similar_complaints_found?: number;
      suggested_cluster_id?: string;
      suggested_cluster_title?: string;
    }) | null
  >(null);

  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialGrievance) {
      setGrievanceText(initialGrievance);
    }
  }, [initialGrievance]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Find language speech code
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      recognition.lang = langObj?.speechCode || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setGrievanceText((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Please enable microphone access.');
        } else if (event.error !== 'no-speech') {
          setVoiceError(`Voice recognition: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setSpeechSupported(false);
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser. Please type your grievance.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);
        if (recognitionRef.current) {
          recognitionRef.current.lang = langObj?.speechCode || 'en-IN';
          recognitionRef.current.start();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB');
        return;
      }
      setPhotoMime(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Geolocation Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationAddress(`Near Latitude ${pos.coords.latitude.toFixed(4)}, Longitude ${pos.coords.longitude.toFixed(4)}`);
        setLandmark('Current GPS Detected Location');
        setLocationDetecting(false);
      },
      (err) => {
        console.warn(err);
        setLocationDetecting(false);
        // Fallback default
        setLocationAddress('ABC College Road, Ward 4, Pune');
        setLandmark('Near University Circle');
      },
      { timeout: 8000 }
    );
  };

  // Handle Analyze & Triage
  const handleAnalyzeClick = async () => {
    if (!grievanceText.trim()) {
      setErrorMsg('Please describe your civic issue before proceeding.');
      return;
    }

    setErrorMsg(null);
    setStage('analyzing');
    setAnalysisStep(1);

    // Multi-step animated progress simulation
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      const result = await analyzeGrievance(
        grievanceText,
        selectedPhoto || undefined,
        photoMime
      );

      clearInterval(stepInterval);
      setAnalysisStep(5);
      setAnalysisResult(result);

      setTimeout(() => {
        setStage('confirm');
      }, 400);
    } catch (err: any) {
      clearInterval(stepInterval);
      setStage('input');
      setErrorMsg(err?.message || 'Failed to analyze grievance. Please try again.');
    }
  };

  // Handle Final Submit
  const handleConfirmSubmit = async () => {
    if (!analysisResult) return;

    try {
      const created = await submitComplaint({
        grievance: grievanceText,
        summary: analysisResult.grievance_summary,
        category: analysisResult.category,
        department: analysisResult.department,
        priority: analysisResult.priority,
        priorityScore: analysisResult.priority_score,
        priorityReason: analysisResult.priority_reason,
        language: analysisResult.language,
        languageCode: analysisResult.language_code,
        location: {
          address: locationAddress,
          landmark,
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411007',
          latitude: coords.lat,
          longitude: coords.lng,
        },
        photoUrl: selectedPhoto || undefined,
        clusterId: analysisResult.suggested_cluster_id,
        clusterTitle: analysisResult.suggested_cluster_title,
        isDuplicate: analysisResult.is_duplicate,
        duplicateOfId: analysisResult.duplicate_of_id,
        similarityScore: analysisResult.similarity_score,
      });

      setSubmittedComplaint(created);
      setStage('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to finalize complaint.');
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // -------------------------------------------------------------
  // RENDER: STAGE SUCCESS
  // -------------------------------------------------------------
  if (stage === 'success' && submittedComplaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t.submittedSuccessTitle}
            </h1>
            <p className="text-slate-500 text-sm">
              Your grievance is registered with the Municipal Corporation and active on JanSetu AI.
            </p>
          </div>

          {/* Reference ID Pill */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md mx-auto w-full">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                {t.complaintIdLabel}
              </span>
              <span className="text-xl font-extrabold font-mono text-slate-900 tracking-wider">
                {submittedComplaint.id}
              </span>
            </div>
            <button
              onClick={() => handleCopyId(submittedComplaint.id)}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              {copiedId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">{t.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyId}</span>
                </>
              )}
            </button>
          </div>

          {/* AI Metadata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
              <span className="font-bold text-slate-800">{submittedComplaint.category}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
              <span className="font-bold text-orange-700">{submittedComplaint.department}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Priority</span>
              <span className="font-bold text-red-600">
                {submittedComplaint.priority} ({submittedComplaint.priorityScore}/100)
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
              <span className="font-bold text-emerald-700">{submittedComplaint.status}</span>
            </div>
          </div>

          {/* Live Progress Timeline Stepper */}
          <div className="text-left space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Grievance Action Stepper
            </h3>
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-900">Complaint Submitted & Logged</h4>
                <p className="text-[11px] text-slate-500">
                  Citizen grievance received via JanSetu AI portal.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-900">AI Analyzed & Priority Assigned</h4>
                <p className="text-[11px] text-slate-500">
                  Gemini scored severity at {submittedComplaint.priorityScore}/100 (
                  {submittedComplaint.priorityReason}).
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[9px] font-bold">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-900">Department Identified</h4>
                <p className="text-[11px] text-slate-500">
                  Assigned directly to {submittedComplaint.department}.
                </p>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <h4 className="text-xs font-bold text-slate-700">Assigned to Field Officer</h4>
                <p className="text-[11px] text-slate-400">Ward engineer inspection dispatch pending.</p>
              </div>

              <div className="relative opacity-60">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100" />
                <h4 className="text-xs font-bold text-slate-700">In Progress & Resolved</h4>
                <p className="text-[11px] text-slate-400">On-site physical remediation and citizen notification.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setSelectedComplaintId(submittedComplaint.id);
                setCurrentView('track');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.trackComplaint}
            </button>

            <button
              onClick={() => {
                setStage('input');
                setGrievanceText('');
                setSelectedPhoto(null);
                setSubmittedComplaint(null);
                setAnalysisResult(null);
                if (onClearInitialGrievance) onClearInitialGrievance();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {t.reportAnother}
            </button>

            <button
              onClick={() => setCurrentView('citizen-home')}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              {t.goHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: STAGE CONFIRM ("Here's what we understood")
  // -------------------------------------------------------------
  if (stage === 'confirm' && analysisResult) {
    const isCritical = analysisResult.priority === 'CRITICAL';
    const isHigh = analysisResult.priority === 'HIGH';

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider">
                AI Grievance Triage
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {t.hereIsWhatWeUnderstood}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Verified</span>
            </div>
          </div>

          {/* Original Complaint vs AI Summary */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.problemSummary}
            </span>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-900 leading-relaxed">
              {analysisResult.grievance_summary}
            </div>
            <p className="text-xs text-slate-400 italic">
              Original ({analysisResult.language}): “{grievanceText}”
            </p>
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                {t.categoryLabel}
              </span>
              <div className="font-extrabold text-slate-900 text-base">
                {analysisResult.category}
              </div>
              <p className="text-[11px] text-slate-500">Automatically categorized</p>
            </div>

            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-orange-600">
                {t.departmentLabel}
              </span>
              <div className="font-extrabold text-orange-950 text-base">
                {analysisResult.department}
              </div>
              <p className="text-[11px] text-orange-700">Direct municipal routing</p>
            </div>
          </div>

          {/* Priority & AI Reasoning */}
          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isCritical
                ? 'bg-red-50/80 border-red-200'
                : isHigh
                ? 'bg-orange-50/80 border-orange-200'
                : 'bg-yellow-50/80 border-yellow-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-md text-white ${
                    isCritical ? 'bg-red-600' : isHigh ? 'bg-orange-600' : 'bg-yellow-600'
                  }`}
                >
                  {analysisResult.priority} PRIORITY
                </span>
                <span className="font-bold text-xs text-slate-700">
                  Score: {analysisResult.priority_score}/100
                </span>
              </div>

              <span className="text-xs font-bold flex items-center gap-1 text-slate-600">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Severity Rating</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                {t.priorityReasonLabel}:
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                {analysisResult.priority_reason}
              </p>
            </div>
          </div>

          {/* Location Context */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                {t.locationLabel}
              </span>
              <p className="text-xs font-bold text-slate-900">{locationAddress}</p>
              {landmark && <p className="text-[11px] text-slate-500">Landmark: {landmark}</p>}
            </div>
          </div>

          {/* Similar Complaints / Duplicate Cluster Notification */}
          {analysisResult.similar_complaints_found && analysisResult.similar_complaints_found > 0 ? (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
              <Layers className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900">
                    ⚠️ {analysisResult.similar_complaints_found} Similar Complaints Detected in this Area
                  </span>
                  {analysisResult.similarity_score && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded">
                      {analysisResult.similarity_score}% Match
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-800">
                  JanSetu AI will automatically associate your report with the active cluster{' '}
                  <strong>"{analysisResult.suggested_cluster_title || 'Civic Issue Cluster'}"</strong>.
                  Your complaint will still be logged and tracked individually.
                </p>
              </div>
            </div>
          ) : null}

          {/* Buttons: Confirm vs Edit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setStage('input')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {t.editComplaint}
            </button>

            <button
              onClick={handleConfirmSubmit}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 transition-transform transform hover:scale-[1.02] cursor-pointer"
            >
              {t.confirmAndSubmit}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: STAGE ANALYZING (Progress Modal)
  // -------------------------------------------------------------
  if (stage === 'analyzing') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6 animate-in zoom-in-95 duration-150">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-orange-100 border-t-orange-600 animate-spin" />
            <Sparkles className="w-8 h-8 text-orange-600 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">JanSetu AI Triage</h2>
            <p className="text-xs text-slate-500">
              Processing natural language grievance with Gemini AI...
            </p>
          </div>

          {/* Stepper list */}
          <div className="space-y-3 text-left max-w-sm mx-auto text-xs font-semibold">
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  analysisStep >= 1 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                {analysisStep > 1 ? '✓' : '1'}
              </div>
              <span className={analysisStep >= 1 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                {t.analyzingStep1}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  analysisStep >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                {analysisStep > 2 ? '✓' : '2'}
              </div>
              <span className={analysisStep >= 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                {t.analyzingStep2}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  analysisStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                {analysisStep > 3 ? '✓' : '3'}
              </div>
              <span className={analysisStep >= 3 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                {t.analyzingStep3}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  analysisStep >= 4 ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                {analysisStep > 4 ? '✓' : '4'}
              </div>
              <span className={analysisStep >= 4 ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                {t.analyzingStep4}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: STAGE INPUT (The Main Report Form)
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.tellUsWhatHappened}
        </h1>
        <p className="text-sm text-slate-500">{t.reportSubtext}</p>
      </div>

      {/* Language Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider">
          Language:
        </span>
        <div className="flex flex-wrap gap-1">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                language === lang.code
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grievance Input Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
        {/* Textarea Container */}
        <div className="relative">
          <textarea
            id="grievance-textarea"
            rows={5}
            value={grievanceText}
            onChange={(e) => {
              setGrievanceText(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={t.describePlaceholder}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-y"
          />

          {/* Listening Pulsing Banner */}
          {isListening && (
            <div className="absolute bottom-3 left-4 right-4 p-2 bg-orange-600 text-white rounded-xl flex items-center justify-between text-xs font-bold animate-pulse shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                <span>Listening in {SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName}... Speak clearly.</span>
              </div>
              <button
                onClick={toggleVoiceInput}
                className="px-2 py-0.5 bg-white/20 rounded-md text-[10px] hover:bg-white/30"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {voiceError && (
          <p className="text-xs text-red-600 font-medium">{voiceError}</p>
        )}
        {errorMsg && (
          <p className="text-xs text-red-600 font-bold">{errorMsg}</p>
        )}

        {/* Action Controls Toolbar (Voice, Photo, Location) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Speak Button */}
            <button
              id="voice-input-btn"
              type="button"
              onClick={toggleVoiceInput}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-xs'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/80'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-orange-600" />}
              <span>{isListening ? 'Stop Listening' : t.speakButton}</span>
            </button>

            {/* Photo Button */}
            <button
              id="add-photo-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedPhoto
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <Camera className="w-4 h-4 text-slate-600" />
              <span>{selectedPhoto ? 'Photo Attached' : t.addPhotoButton}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Location Button */}
            <button
              id="add-location-btn"
              type="button"
              onClick={() => setShowLocationDrawer(!showLocationDrawer)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{locationAddress ? 'Location Set' : t.addLocationButton}</span>
            </button>
          </div>

          {/* Analyze & Submit Primary Button */}
          <button
            id="analyze-submit-btn"
            type="button"
            onClick={handleAnalyzeClick}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-transform transform hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.analyzeAndSubmit}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Preview Thumbnail */}
        {selectedPhoto && (
          <div className="relative inline-block mt-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
            <img
              src={selectedPhoto}
              alt="Grievance evidence"
              className="h-28 w-44 object-cover rounded-xl"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
              title="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-slate-500 block mt-1 text-center">
              Photo attached for AI vision
            </span>
          </div>
        )}

        {/* Location Drawer / Configurator */}
        {showLocationDrawer && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-slate-700">
                Grievance Location Setup
              </span>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locationDetecting}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{locationDetecting ? 'Detecting GPS...' : t.useMyLocation}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">
                  Street Address / Area
                </label>
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Coordinates: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} (Pune Civic Zone)
            </p>
          </div>
        )}
      </div>

      {/* Helpful Pre-Fill Samples */}
      <div className="bg-slate-100/70 p-5 rounded-2xl border border-slate-200 space-y-2">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
          Need inspiration? Click a sample below:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setGrievanceText(
                'There is a huge pothole near ABC College and two people have already fallen from their bikes.'
              );
              setLanguage('en');
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            🚧 ABC College Pothole (English)
          </button>
          <button
            type="button"
            onClick={() => {
              setGrievanceText(
                'आमच्या भागात पाच दिवसांपासून कचरा उचललेला नाही. सेंट्रल मार्केट जवळ दुर्गंधी पसरली आहे.'
              );
              setLanguage('mr');
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            🗑️ कचरा उचललेला नाही (मराठी)
          </button>
          <button
            type="button"
            onClick={() => {
              setGrievanceText(
                'हमारे इलाके में नलों से बहुत गंदा और बदबूदार पानी आ रहा है। कई बच्चे बीमार पड़ चुके हैं।'
              );
              setLanguage('hi');
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            💧 गंदा और बदबूदार पानी (हिंदी)
          </button>
          <button
            type="button"
            onClick={() => {
              setGrievanceText(
                'The entire railway station underpass is completely dark because all streetlights have failed.'
              );
              setLanguage('en');
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 hover:text-orange-700 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            💡 Station Subway Blackout (English)
          </button>
        </div>
      </div>
    </div>
  );
};
