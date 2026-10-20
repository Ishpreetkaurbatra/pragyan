import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  Building2, 
  TrendingUp, 
  Target, 
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { ExpertReview } from '../types';
import { api } from '../services/api/client';

export const ExpertValidationPage: React.FC = () => {
  const [reviews, setReviews] = useState<ExpertReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<ExpertReview | null>(null);
  const [comments, setComments] = useState('');
  const [suggestedChanges, setSuggestedChanges] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.getExpertReviews();
      setReviews(data);
      if (data.length > 0) {
        setSelectedReview(data[0]);
        setComments(data[0].comments || '');
        setSuggestedChanges(data[0].suggested_changes || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReview) return;
    setActionLoading(true);
    try {
      await api.approveReview(selectedReview.id, comments, suggestedChanges);
      await loadReviews();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!selectedReview) return;
    setActionLoading(true);
    try {
      await api.requestChangesReview(selectedReview.id, comments || 'Changes requested by expert.', suggestedChanges);
      await loadReviews();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReview) return;
    setActionLoading(true);
    try {
      await api.rejectReview(selectedReview.id, comments || 'Rejected by expert.', 'Risk exceeds return.');
      await loadReviews();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Header with human-in-the-loop guarantee banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-light-blue text-dark-blue border border-primary-blue/20">
              Human-in-the-Loop Quality Gate
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-medium">Domain Strategist Validation Queue</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy mt-1.5">
            Expert Review & Launch Authorization
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            AI synthesizes market intelligence and draft playbooks. Domain experts provide operational sanity checks before live testing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 text-navy shadow-sm flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-primary-blue" />
            <span>Assigned: Rajesh Kulkarni (Retail & F&B Strategist)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Queue list (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Pending Authorization Queue ({reviews.length})
          </div>

          {reviews.map((rev) => (
            <div
              key={rev.id}
              onClick={() => {
                setSelectedReview(rev);
                setComments(rev.comments || '');
                setSuggestedChanges(rev.suggested_changes || '');
              }}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                selectedReview?.id === rev.id
                  ? 'bg-white/95 border-primary-blue shadow-glass-hover ring-2 ring-primary-blue/20'
                  : 'glass-card hover:bg-white/90 border-white/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-navy leading-snug">
                  {rev.actionPlan?.title || 'Action Plan Evaluation'}
                </h4>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  rev.status === 'approved' ? 'bg-light-green text-dark-green border border-growth/20' :
                  rev.status === 'pending' ? 'bg-warning-bg text-amber-800 border border-warning-orange/30' : 
                  'bg-rose-100 text-rose-700 border border-rose-200'
                }`}>
                  {rev.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                Business: <span className="text-navy font-semibold">{rev.business?.business_name || 'FreshBite Café'}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Right: Review Details & Decision Panel (8 cols) */}
        {selectedReview && (
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-6">
            <div className="border-b border-slate-200/60 pb-5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal">
                Validation Dossier #{selectedReview.id.substring(0, 8)}
              </span>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-navy mt-1">
                {selectedReview.actionPlan?.title}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Target Business: <strong className="text-navy font-semibold">{selectedReview.business?.business_name}</strong> • Location: <strong className="text-navy font-semibold">{selectedReview.business?.location}</strong>
              </p>
            </div>

            {/* Strategic Summary Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500">Business Fit Score</span>
                <div className="font-extrabold text-lg text-growth mt-0.5">91% High Alignment</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500">Risk Assessment</span>
                <div className="font-extrabold text-lg text-dark-green mt-0.5">LOW Operational Risk</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-500">Pilot Duration</span>
                <div className="font-extrabold text-lg text-primary-blue mt-0.5">{selectedReview.actionPlan?.test_duration || '7 Days'}</div>
              </div>
            </div>

            {/* Action plan summary */}
            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 space-y-2 text-xs shadow-sm">
              <div className="font-bold text-navy text-xs sm:text-sm">Plan Implementation Summary:</div>
              <p className="text-slate-600 leading-relaxed font-normal">
                {selectedReview.actionPlan?.what_to_launch}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-500">
                <span>Target: <strong className="text-navy">{selectedReview.actionPlan?.target_customer}</strong></span>
                <span>Price: <strong className="text-dark-green font-bold">{selectedReview.actionPlan?.suggested_price}</strong></span>
                <span>Timing: <strong className="text-navy">{selectedReview.actionPlan?.test_timing}</strong></span>
              </div>
            </div>

            {/* Expert Input Form */}
            <div className="space-y-4 pt-2">
              <h3 className="font-display font-bold text-sm text-navy flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-primary-blue" />
                <span>Expert Validation Assessment & Directives</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Operational Commentary & Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter your expert assessment, kitchen operational suggestions, or risk mitigations..."
                    className="w-full p-3.5 text-xs rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all font-normal text-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Suggested Changes (Optional)
                  </label>
                  <input
                    type="text"
                    value={suggestedChanges}
                    onChange={(e) => setSuggestedChanges(e.target.value)}
                    placeholder="e.g. Pre-portion spice mixes in morning prep to protect 4-minute rush SLA"
                    className="w-full p-3.5 text-xs rounded-2xl border border-slate-200/80 bg-white/90 focus:outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition-all font-normal text-navy"
                  />
                </div>
              </div>

              {/* Decision Action Buttons - Bold High-Contrast */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/60">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="btn-secondary-green px-6 py-2.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Authorize Live Pilot</span>
                </button>

                <button
                  onClick={handleRequestChanges}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-soft-glass transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Request Modifications</span>
                </button>

                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-soft-glass transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Blueprint</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
