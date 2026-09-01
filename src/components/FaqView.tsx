import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Languages,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  MessageSquare,
  LifeBuoy
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'ai' | 'citizen' | 'privacy' | 'tracking';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'ai',
    question: 'How does JanSetu AI know which municipal department handles my issue?',
    answer:
      'JanSetu AI uses Google Gemini 2.5 multimodal models to parse natural language descriptions, voice transcripts, and submitted photos. It matches the civic problem against standard municipal responsibility frameworks (such as PWD for road repairs, Water Supply & Sewerage Board for pipeline leaks, Solid Waste Management for garbage dumps, and Traffic Police for signal failures). You never need to memorize complex municipal hierarchies.'
  },
  {
    id: 'faq-2',
    category: 'citizen',
    question: 'Can I report my problem in my native Indian language or by voice?',
    answer:
      'Yes! JanSetu AI natively supports 10 Indian languages including Hindi, Marathi, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, and Punjabi, alongside English. You can speak into your microphone or write in colloquial language (e.g. Hinglish or local dialects), and the AI automatically translates and standardizes the grievance for municipal engineers.'
  },
  {
    id: 'faq-3',
    category: 'ai',
    question: 'How does the AI determine the priority (Critical / High / Medium / Low)?',
    answer:
      'The AI analyzes contextual safety indicators in your report and photo. If an issue involves imminent hazards—such as open manholes, live dangling electrical wires, dangerous arterial potholes causing accidents, or water contamination near hospitals/schools—the AI automatically tags it as Critical or High with a 6-to-24 hour SLA escalation.'
  },
  {
    id: 'faq-4',
    category: 'ai',
    question: 'What happens if multiple citizens report the same issue in the same area?',
    answer:
      'JanSetu AI runs an automated spatial and semantic clustering engine. When multiple citizens report the same road crater or transformer fault within a 150-meter radius, JanSetu merges them into a single consolidated Work Order. This prevents duplicate technician dispatches while notifying all affected citizens simultaneously upon resolution.'
  },
  {
    id: 'faq-5',
    category: 'privacy',
    question: 'Is my personal information, photo, and geolocation data kept secure?',
    answer:
      'Yes. Your exact contact information is never made public. Photo uploads and location coordinates are utilized strictly for geospatial triage and field technician routing. All telemetry data is stored securely adhering to standard Indian civic data privacy principles.'
  },
  {
    id: 'faq-6',
    category: 'tracking',
    question: 'How can I track my complaint progress after submission?',
    answer:
      'Every submission generates a unique 8-character Complaint ID (e.g., JS-849201). You can paste this ID into the "Track Complaint" page at any time to view real-time stage updates: AI Analysis → Department Assignment → Field Inspection → Resolution & Photographic Proof.'
  },
  {
    id: 'faq-7',
    category: 'citizen',
    question: "What if I don't know the exact street address or ward number?",
    answer:
      'You can simply tap the "Use My Location" button during reporting, which fetches your GPS coordinates, or describe landmarks in your text (e.g., "Opposite Gandhi Park bus stop, near State Bank ATM"). The AI extracts the landmark and pins it onto the GIS civic grid.'
  },
  {
    id: 'faq-8',
    category: 'tracking',
    question: 'What is the expected resolution timeframe (SLA)?',
    answer:
      'Resolution time depends on priority: Critical safety hazards (e.g. open electrical wires, burst main pipelines) have a target SLA of 6–12 hours. High-priority road and sanitation issues aim for 24–48 hours. General civic maintenance requests are scheduled within 3–5 working days with automatic escalation timers.'
  }
];

export const FaqView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'citizen' | 'privacy' | 'tracking'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about JanSetu AI, voice-based grievance filing, automated department triage, and complaint tracking.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions (e.g., language, priority, tracking, duplicates)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'ai', label: '🧠 AI Triage & Clustering' },
            { id: 'citizen', label: '🇮🇳 Languages & Voice' },
            { id: 'tracking', label: '⏱️ Tracking & SLAs' },
            { id: 'privacy', label: '🔒 Security & Privacy' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching questions found</h3>
              <p className="text-xs text-slate-500 mt-1">Try searching with different keywords or browse all categories.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need more help CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 justify-center sm:justify-start">
              <LifeBuoy className="w-5 h-5" />
              Still have questions or facing an issue?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-md">
              Our citizen support desk is available to assist with grievance submissions and department escalations.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('contact-support')}
            className="shrink-0 px-5 py-3 rounded-xl bg-white text-orange-700 font-bold text-xs sm:text-sm shadow hover:bg-orange-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Contact Support Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
