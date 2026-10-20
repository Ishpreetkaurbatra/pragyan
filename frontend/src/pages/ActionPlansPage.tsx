import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FlaskConical, 
  DollarSign, 
  Calendar,
  Users,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ActionPlan } from '../types';
import { api } from '../services/api/client';

interface ActionPlansPageProps {
  onLaunchExperiment: (plan: ActionPlan) => void;
}

export const ActionPlansPage: React.FC<ActionPlansPageProps> = ({ onLaunchExperiment }) => {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await api.getActionPlans();
      setPlans(data);
      if (data.length > 0) setSelectedPlan(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (planId: string) => {
    setSubmittingId(planId);
    try {
      const updated = await api.submitActionPlanForReview(planId);
      setPlans(plans.map(p => p.id === planId ? updated : p));
      if (selectedPlan?.id === planId) setSelectedPlan(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-light-green text-dark-green border border-growth/20 shadow-sm flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-growth" />
            <span>Validated by Expert</span>
          </span>
        );
      case 'pending_review':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-sm animate-pulse flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Awaiting Expert Validation</span>
          </span>
        );
      case 'in_experiment':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-light-blue text-dark-blue border border-primary-blue/30 shadow-sm flex items-center space-x-1">
            <FlaskConical className="w-3.5 h-3.5 text-primary-blue" />
            <span>Active In-Market Experiment</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Draft Playbook
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-light-blue text-dark-blue text-xs font-bold uppercase tracking-wider mb-2 border border-primary-blue/20">
            <FileText className="w-3.5 h-3.5 text-primary-blue" />
            <span>Actionable Strategic Blueprints</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">
            Action Plans & Execution Playbooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Step-by-step pilot execution blueprints designed for rapid real-world validation without excessive capital risk
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-right shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500">Active Playbooks</div>
            <div className="font-extrabold text-lg text-primary-blue">{plans.length} Blueprints</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List of Plans (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Formulated Blueprints ({plans.length})
          </div>

          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                selectedPlan?.id === plan.id
                  ? 'bg-white/95 border-primary-blue shadow-glass-hover ring-2 ring-primary-blue/20'
                  : 'glass-card hover:bg-white/90 border-white/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-navy leading-snug">
                  {plan.title}
                </h4>
              </div>
              <div className="mt-3 flex items-center justify-between">
                {statusBadge(plan.status)}
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{plan.test_duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Detail View of Selected Plan (8 cols) */}
        {selectedPlan && (
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Execution Playbook
                  </span>
                  <span>•</span>
                  {statusBadge(selectedPlan.status)}
                </div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-navy mt-1.5">
                  {selectedPlan.title}
                </h2>
              </div>

              {/* Action buttons - Bold High-Contrast CTA Buttons */}
              <div className="flex items-center space-x-2.5">
                {selectedPlan.status === 'draft' && (
                  <button
                    onClick={() => handleSubmitForReview(selectedPlan.id)}
                    disabled={submittingId === selectedPlan.id}
                    className="btn-secondary-blue px-5 py-2.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingId === selectedPlan.id ? 'Submitting...' : 'Submit to Human Expert'}</span>
                  </button>
                )}
                {selectedPlan.status === 'approved' && (
                  <button
                    onClick={() => onLaunchExperiment(selectedPlan)}
                    className="btn-primary px-5 py-2.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
                  >
                    <FlaskConical className="w-4 h-4" />
                    <span>Launch 7-Day Live Pilot</span>
                  </button>
                )}
              </div>
            </div>

            {/* Why Now & Why This Business */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-teal tracking-wider block">
                  Why Now? (Trend Trigger)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {selectedPlan.why_now || 'Demand signals indicate an active momentum spike across local student clusters.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-1.5 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-primary-blue tracking-wider block">
                  Why This Business? (Footprint Synergy)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {selectedPlan.why_this_business || 'Zero new equipment needed; re-uses existing fryer setup and target 4-8 PM student traffic.'}
                </p>
              </div>
            </div>

            {/* Structured Launch Parameters */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-navy">Launch Parameters & Test Specs</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-1 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-bold text-[10px] uppercase">
                    <Target className="w-3.5 h-3.5 text-primary-blue" />
                    <span>What to Launch</span>
                  </div>
                  <p className="font-semibold text-navy leading-snug">{selectedPlan.what_to_launch}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-1 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-bold text-[10px] uppercase">
                    <Users className="w-3.5 h-3.5 text-teal" />
                    <span>Target Customer</span>
                  </div>
                  <p className="font-semibold text-navy leading-snug">{selectedPlan.target_customer}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-1 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-bold text-[10px] uppercase">
                    <DollarSign className="w-3.5 h-3.5 text-growth" />
                    <span>Suggested Pilot Price</span>
                  </div>
                  <p className="font-bold text-dark-green text-sm">{selectedPlan.suggested_price || '₹99 Introductory'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 border border-white/80 space-y-1 shadow-sm">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-bold text-[10px] uppercase">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Test Time Window</span>
                  </div>
                  <p className="font-semibold text-navy leading-snug">{selectedPlan.test_timing || '4:00 PM – 8:00 PM Weekdays'}</p>
                </div>
              </div>
            </div>

            {/* Success Metrics & Stop/Continue Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Success Metrics */}
              <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-2.5 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-dark-green tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-growth" />
                  <span>Quantitative Success Metrics</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedPlan.success_metrics.map((m, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-growth font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stop & Continue Criteria */}
              <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-2.5 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Stop / Scale Decision Rules</span>
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-rose-600 text-[11px] block">Kill Pilot If:</span>
                    <span className="text-slate-600">{selectedPlan.stop_criteria.join('; ') || 'Under 5 daily orders or negative prep impact.'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-dark-green text-[11px] block">Scale Full Menu If:</span>
                    <span className="text-slate-600">{selectedPlan.continue_criteria.join('; ') || '12+ orders daily with positive customer feedback.'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Learning */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-light-blue to-light-green border border-white/80 text-xs text-slate-700 leading-relaxed shadow-sm">
              <strong className="text-navy font-bold block mb-1">Empirical Learning Objective:</strong>
              {selectedPlan.expected_learning || 'Will validate student price sensitivity and quantify demand uplift without risking full-menu redesign.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
