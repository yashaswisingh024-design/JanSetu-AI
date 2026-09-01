import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LifeBuoy,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  Building,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const ContactHelpView: React.FC = () => {
  const { setCurrentView } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: 'general',
    complaintId: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email address is required';
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `JS-HELP-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(ticketId);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      topic: 'general',
      complaintId: '',
      subject: '',
      message: ''
    });
    setSubmittedTicket(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Citizen Helpdesk & Grievance Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Contact Support & Inquiry Desk
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Need help with an existing complaint, department escalation, or technical issue? Our civic support team is here to help.
          </p>
        </div>

        {/* Emergency Helplines Cards */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-400" />
              <h2 className="text-base font-bold">National Civic Emergency Helplines (24x7)</h2>
            </div>
            <span className="text-xs text-slate-400">Toll-Free &bull; Direct Government Lines</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
              <span className="text-xl font-extrabold text-red-400 block font-mono">112</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">National Emergency</span>
              <span className="text-[10px] text-slate-400">Police / Fire / Medical</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
              <span className="text-xl font-extrabold text-blue-400 block font-mono">1916</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">Water Supply</span>
              <span className="text-[10px] text-slate-400">Burst Pipes / Sewage</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
              <span className="text-xl font-extrabold text-amber-400 block font-mono">1912</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">Electricity Board</span>
              <span className="text-[10px] text-slate-400">Hazardous Sparks / Outages</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center">
              <span className="text-xl font-extrabold text-emerald-400 block font-mono">1033</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">NHAI Highways</span>
              <span className="text-[10px] text-slate-400">Highway Obstructions</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center col-span-2 sm:col-span-1">
              <span className="text-xl font-extrabold text-purple-400 block font-mono">1950</span>
              <span className="text-[11px] font-semibold text-slate-300 block mt-0.5">Civic Helpline</span>
              <span className="text-[10px] text-slate-400">Voter & Municipal Info</span>
            </div>
          </div>
        </div>

        {/* Form and Side Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            {submittedTicket ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Support Ticket Created!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    We have received your message and assigned reference number:
                  </p>
                  <div className="inline-block bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-lg font-mono font-bold text-orange-600 dark:text-orange-400 mt-2">
                    {submittedTicket}
                  </div>
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  A confirmation email with updates has been sent to <strong className="text-slate-700 dark:text-slate-300">{formData.email}</strong>. Our support officer typically responds within 4 business hours.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                  <button
                    onClick={() => setCurrentView('track')}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow cursor-pointer"
                  >
                    Track Complaints
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Send a Message to Support
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill out the details below and we will route your inquiry to the appropriate municipal coordinator.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      } text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                        errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                      } text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value="general">General Question</option>
                      <option value="complaint_followup">Follow-up on Existing Complaint</option>
                      <option value="escalation">SLA Escalation Request</option>
                      <option value="technical">App / Technical Bug Report</option>
                      <option value="feedback">Citizen Feedback / Suggestion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Related Complaint ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JS-849201"
                    value={formData.complaintId}
                    onChange={(e) => setFormData({ ...formData, complaintId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of your inquiry..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.subject ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    } text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                  />
                  {errors.subject && <p className="text-[11px] text-red-500 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Please provide specific details regarding your question or issue..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                    } text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50`}
                  />
                  {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Support Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Support Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Side Info Cards */}
          <div className="space-y-6">
            {/* Quick Resolution SLA */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Standard Support Timelines
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our automated routing system forwards priority escalations directly to ward engineers within 30 minutes of ticket verification.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Critical Safety Issues:</span>
                  <strong className="text-red-500">&lt; 2 Hours</strong>
                </div>
                <div className="flex justify-between">
                  <span>Standard Inquiries:</span>
                  <strong className="text-slate-700 dark:text-slate-300">4 Hours</strong>
                </div>
              </div>
            </div>

            {/* FAQs Shortcut */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Check Instant Answers
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Most common questions regarding Indian languages, photo triage, and duplicate detection are answered in our FAQ base.
              </p>
              <button
                onClick={() => setCurrentView('faq-help')}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Browse FAQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
