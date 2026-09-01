import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../translations';
import {
  Sparkles,
  ArrowRight,
  Mic,
  ShieldCheck,
  Zap,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  Users,
  ChevronDown,
  HelpCircle,
  Clock,
  Flame,
  Camera,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, setCurrentView, language, setLanguage } = useApp();

  const [activeTab, setActiveTab] = useState<'mr' | 'hi' | 'en' | 'bn'>('mr');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const demoSimulations = {
    mr: {
      input: 'आमच्या भागात पाच दिवसांपासून कचरा उचललेला नाही. सेंट्रल मार्केट जवळ दुर्गंधी पसरली आहे.',
      lang: 'मराठी (Marathi)',
      category: 'Garbage & Sanitation',
      dept: 'Sanitation Department',
      priority: 'HIGH',
      priorityScore: 86,
      reason: 'Prolonged decomposing waste posing public health & mosquito hazard.',
      duplicates: 14,
      cluster: 'Central Market Dumpster Overflow',
    },
    hi: {
      input: 'कॉलेज के पास सड़क पर बहुत बड़ा गड्ढा है और आज सुबह दो लोग बाइक से गिर चुके हैं।',
      lang: 'हिंदी (Hindi)',
      category: 'Roads & Infrastructure',
      dept: 'PWD / Municipal Roads',
      priority: 'CRITICAL',
      priorityScore: 94,
      reason: 'Active physical injury hazard near educational institution.',
      duplicates: 17,
      cluster: 'ABC College Road Severe Potholes',
    },
    en: {
      input: 'The railway station subway is completely pitch black because all streetlights have failed.',
      lang: 'English',
      category: 'Streetlights',
      dept: 'Electrical & Lighting Department',
      priority: 'HIGH',
      priorityScore: 88,
      reason: 'Safety risk for late-night commuters in transit corridor.',
      duplicates: 9,
      cluster: 'Station Subway Streetlight Blackout',
    },
    bn: {
      input: 'আমাদের এলাকায় নর্দমার ঢাকনা ভাঙা, পথচারীদের জন্য অত্যন্ত বিপদজনক।',
      lang: 'বাংলা (Bengali)',
      category: 'Drainage',
      dept: 'Stormwater & Drainage Department',
      priority: 'HIGH',
      priorityScore: 84,
      reason: 'Open drain cavity on active pedestrian walkway.',
      duplicates: 7,
      cluster: 'Open Stormwater Drain Collapse',
    },
  };

  const currentSim = demoSimulations[activeTab];

  const faqs = [
    {
      q: 'Do I need to know which municipal department handles my issue?',
      a: 'Not at all! Traditional grievance forms require you to select department, sub-department, ward number, and category codes. With JanSetu AI, you simply speak or type what happened in everyday words — our AI automatically maps the grievance to the exact responsible department and officer.',
    },
    {
      q: 'Can I report complaints in Hindi, Marathi, Bengali, or other Indian languages?',
      a: 'Yes. JanSetu AI natively supports 10 Indian languages including Hindi, Marathi, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, Punjabi, and English. You can even use voice dictation in your mother tongue.',
    },
    {
      q: 'What happens if multiple people report the same pothole or broken pipe?',
      a: 'JanSetu AI runs real-time semantic duplicate detection. Instead of creating 50 separate redundant files, all related complaints are automatically grouped into a single "Issue Cluster". This increases the priority score for authorities and prevents duplicate inspections.',
    },
    {
      q: 'How does the AI determine complaint priority?',
      a: 'Our priority engine evaluates safety hazards, reported accidents, vulnerable locations (like schools, hospitals, transit hubs), duration of the issue, and volume of affected citizens to compute an objective 0-100 severity score with full transparent reasoning.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Banner / Ticker */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
          Digital India Civic Tech
        </span>
        <span>A simpler, AI-powered way to raise citizen civic complaints across India 🇮🇳</span>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>AI-Driven Citizen Grievance Portal</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Report a civic problem. <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent">
              Let AI handle the complexity.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.heroSubheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="hero-report-btn"
              onClick={() => setCurrentView('report')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-base shadow-md shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
              <span>{t.reportProblem}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-track-btn"
              onClick={() => setCurrentView('track')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-base border border-slate-200 shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.trackComplaint}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            ⚡ Takes under 30 seconds • No bureaucratic dropdowns • 10 Indian Languages
          </p>
        </div>

        {/* Interactive AI Simulation Preview */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Header bar of simulation */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-semibold text-slate-300 font-mono">
                  LIVE AI GRIEVANCE DECOMPOSITION DEMO
                </span>
              </div>
              {/* Language switcher tabs */}
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('mr')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    activeTab === 'mr' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setActiveTab('hi')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    activeTab === 'hi' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  onClick={() => setActiveTab('en')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    activeTab === 'en' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setActiveTab('bn')}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    activeTab === 'bn' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            {/* Simulation Body */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
              {/* Left: Citizen Input */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    1. Citizen Voice / Text Input:
                  </span>
                  <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                    {currentSim.lang}
                  </span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm italic relative shadow-xs leading-relaxed">
                  “{currentSim.input}”
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Gemini 3.7 Flash analyzes severity, location, and duplicate records...</span>
                </div>
              </div>

              {/* Right: AI Structured Output */}
              <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    2. AI Automated Categorization & Routing:
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Zero Bureaucracy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">Category</span>
                    <span className="font-bold text-slate-900 text-sm">{currentSim.category}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block">Department</span>
                    <span className="font-bold text-orange-700 text-sm">{currentSim.dept}</span>
                  </div>
                </div>

                <div className="p-3 bg-red-50/70 rounded-lg border border-red-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider">
                        Priority: {currentSim.priority}
                      </span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">
                        {currentSim.priorityScore}/100
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" /> High Risk
                    </span>
                  </div>
                  <p className="text-xs text-red-900 font-medium">{currentSim.reason}</p>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900 block">
                      🔗 Associated Issue Cluster: {currentSim.cluster}
                    </span>
                    <span className="text-amber-700 text-[11px]">
                      {currentSim.duplicates} citizens have already reported this underlying issue.
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-800 bg-amber-200/80 px-2 py-1 rounded">
                    Auto-Merged
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiator Banner: The "Why JanSetu" */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              A Radical Shift from Traditional Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              “Citizens describe the problem. AI handles the bureaucracy.”
            </h2>
            <p className="text-slate-400 text-base">
              Say goodbye to dense 8-step government dropdown forms and administrative jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Don't know which department?</h3>
              <p className="text-sm text-slate-300">
                You don't need to know if it's PWD, MSEDCL, or Ward Health. AI automatically matches the jurisdiction.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Don't know the category code?</h3>
              <p className="text-sm text-slate-300">
                AI extracts the category, problem summary, and key nouns automatically from natural speech or text.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Don't know how urgent it is?</h3>
              <p className="text-sm text-slate-300">
                AI calculates a transparent 0-100 severity rating based on injuries, flood risk, and child safety.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Already reported by others?</h3>
              <p className="text-sm text-slate-300">
                AI detects semantic duplicates and links your vote to existing issue clusters for faster mass action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-orange-600 text-xs font-extrabold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How JanSetu AI Works
          </h2>
          <p className="text-slate-600 text-base">
            From reporting to on-ground resolution in hours, not months.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Speak or Type</h3>
            <p className="text-sm text-slate-600">
              Explain the civic grievance in your native language. Optional photo or map location.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Triage & Routing</h3>
            <p className="text-sm text-slate-600">
              Gemini calculates priority, maps responsible department, and flags duplicate reports.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Officer Dispatched</h3>
            <p className="text-sm text-slate-600">
              Assigned to designated field engineer with on-site tracking and status timeline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-extrabold text-lg flex items-center justify-center mx-auto">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900">Resolved & Notified</h3>
            <p className="text-sm text-slate-600">
              Work completed, verified by authority notes, with direct in-app notification.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Languages Showcase */}
      <section className="bg-orange-50/60 py-16 px-4 sm:px-6 lg:px-8 border-y border-orange-100">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
              Accessible to 1.4 Billion Citizens
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Speak or Type in 10 Indian Languages
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Automatic speech-to-text recognition and multilingual text comprehension powered by modern AI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-xl border text-center transition-all bg-white hover:border-orange-400 hover:shadow-xs ${
                  language === lang.code
                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                    : 'border-slate-200'
                }`}
              >
                <div className="font-extrabold text-base text-slate-900">{lang.nativeName}</div>
                <div className="text-xs text-slate-600 font-medium">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Authority & Citizen Dual Benefit Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
            Transforming Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Built for Both Citizens & Authorities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Citizen Card */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">For Citizens</h3>
                <p className="text-xs text-slate-500">Effortless grievance reporting</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero technical or administrative jargon required.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Multilingual voice-first reporting with instant speech transcription.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Transparent live tracking timeline with designated officer notes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Confidence that your issue is combined into active clusters.</span>
              </li>
            </ul>
          </div>

          {/* Authority Card */}
          <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">For Municipal Authorities</h3>
                <p className="text-xs text-slate-400">Data-driven command center</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated issue clustering reduces redundant inspections by up to 80%.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>GIS Hotspot heatmaps highlight critical road and sanitation emergencies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant re-assignment, officer delegation, and resolution audits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>AI predictive analytics highlight recurring infrastructure bottlenecks.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="bg-gradient-to-tr from-orange-600 via-amber-600 to-emerald-700 py-16 px-4 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to make your neighborhood better?
          </h2>
          <p className="text-orange-50 text-base font-medium">
            Join thousands of active citizens building cleaner, safer Indian cities with JanSetu AI.
          </p>
          <button
            onClick={() => setCurrentView('report')}
            className="px-8 py-4 bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-base rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Mic className="w-5 h-5" />
            <span>Report a Civic Problem Now</span>
          </button>
        </div>
      </section>
    </div>
  );
};

