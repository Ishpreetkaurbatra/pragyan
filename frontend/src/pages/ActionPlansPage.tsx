import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  ShieldCheck, 
  FlaskConical, 
  Target, 
  ArrowRight,
  Package,
  Users,
  TestTube,
  BarChart2,
  Maximize2,
  BotMessageSquare
} from 'lucide-react';
import { ActionPlan } from '../types';
import { api } from '../services/api/client';

interface ActionPlansPageProps {
  onLaunchExperiment: (plan: ActionPlan) => void;
  onNavigateTab?: (tab: string) => void;
}

export const ActionPlansPage: React.FC<ActionPlansPageProps> = ({ 
  onLaunchExperiment,
  onNavigateTab 
}) => {
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
        <div className="w-10 h-10 border-4 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-lightblue text-darkblue text-[10px] font-bold uppercase tracking-wider mb-1 border border-primaryblue/20">
            <FileText className="w-3.5 h-3.5 text-primaryblue" />
            <span>Commercial Execution Blueprints</span>
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-navy">
            Action Plans for FreshBite Café
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Custom-formulated commercial rollouts answering product, pilot testing, metrics, and scale-up mechanics.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/70 backdrop-blur-md border border-white/90 text-right shadow-xs">
            <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Formulated Plans</div>
            <div className="font-extrabold text-sm text-primaryblue">{plans.length} Action Plans</div>
          </div>
        </div>
      </div>

      {/* Main Action Plan Content Panel - Goes directly to the 6 sections */}
      {selectedPlan && (
        <div className="w-full glass-panel p-5 sm:p-6 rounded-2xl border border-white/80 shadow-soft-glass space-y-4">
          
          {/* ========================================================
              MANDATORY 6-POINT STRUCTURED ACTION PLAN (Single Horizontal Row)
              ======================================================== */}
          <div className="overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            <div className="grid grid-cols-6 gap-2.5 w-full min-w-[840px] lg:min-w-0">
              
              {/* 1. PRODUCT */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/85 border border-white/90 shadow-xs hover:bg-white transition-all flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-primaryblue font-extrabold uppercase text-[9px] tracking-wider leading-tight">
                    <Package className="w-3.5 h-3.5 text-primaryblue flex-shrink-0" />
                    <span>1. PRODUCT (What to Launch)</span>
                  </div>
                  <p className="font-bold text-navy text-xs leading-snug">
                    {selectedPlan.what_to_launch}
                  </p>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-normal pt-1">
                  Priced aggressively at ₹99 – ₹149. Requires zero specialized appliances; utilizes existing kitchen fryer and drink counter station.
                </p>
              </div>

              {/* 2. TARGET CUSTOMER */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/85 border border-white/90 shadow-xs hover:bg-white transition-all flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-teal font-extrabold uppercase text-[9px] tracking-wider leading-tight">
                    <Users className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                    <span>2. TARGET CUSTOMER</span>
                  </div>
                  <p className="font-bold text-navy text-xs leading-snug">
                    {selectedPlan.target_customer}
                  </p>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-normal pt-1">
                  College students & desk commuters traveling between 4:00 PM and 8:00 PM seeking quick afternoon sustenance before transit.
                </p>
              </div>

              {/* 3. SMALL-SCALE LAUNCH */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/85 border border-white/90 shadow-xs hover:bg-white transition-all flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-warningorange font-extrabold uppercase text-[9px] tracking-wider leading-tight">
                    <Target className="w-3.5 h-3.5 text-warningorange flex-shrink-0" />
                    <span>3. SMALL-SCALE LAUNCH</span>
                  </div>
                  <p className="font-semibold text-navy text-xs leading-snug">
                    Counter Signage Pilot & Limited Batch
                  </p>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-normal pt-1">
                  Prepare ingredients for only 40 portions daily for the first 3 days to test uptake without food waste risk. Pre-print chalkboard promo on the counter.
                </p>
              </div>

              {/* 4. EXPERIMENT (Test Specs) */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white/85 border border-white/90 shadow-xs hover:bg-white transition-all flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-primaryblue font-extrabold uppercase text-[9px] tracking-wider leading-tight">
                    <TestTube className="w-3.5 h-3.5 text-primaryblue flex-shrink-0" />
                    <span>4. EXPERIMENT & HYPOTHESIS</span>
                  </div>
                  <p className="font-semibold text-navy text-xs leading-snug">
                    7-Day Pilot Duration ({selectedPlan.test_duration})
                  </p>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-normal pt-1">
                  Hypothesis: Offering the snack combo will lift 4–8 PM average ticket size by +22% without slowing order turnaround beyond 4 minutes.
                </p>
              </div>

              {/* 5. SUCCESS METRICS */}
              <div className="p-3.5 sm:p-3.5 rounded-xl bg-white/85 border border-white/90 shadow-xs hover:bg-white transition-all flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-growthgreen font-extrabold uppercase text-[9px] tracking-wider leading-tight">
                    <BarChart2 className="w-3.5 h-3.5 text-growthgreen flex-shrink-0" />
                    <span>5. SUCCESS METRICS (KPIs)</span>
                  </div>
                  <div className="space-y-1 pt-1 text-[11px]">
                    <div className="flex justify-between items-baseline font-medium gap-1">
                      <span className="text-slate-500">Daily Unit Target:</span>
                      <span className="font-bold text-navy whitespace-nowrap">&gt; 25 Orders / Day</span>
                    </div>
                    <div className="flex justify-between items-baseline font-medium gap-1">
                      <span className="text-slate-500">Gross Margin Floor:</span>
                      <span className="font-bold text-growthgreen whitespace-nowrap">&gt; 60% Margin</span>
                    </div>
                    <div className="flex justify-between items-baseline font-medium gap-1">
                      <span className="text-slate-500">Customer Repeat:</span>
                      <span className="font-bold text-navy whitespace-nowrap">&gt; 28% Returning</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. SCALE-UP PLAN */}
              <div className="p-3.5 sm:p-3.5 rounded-xl bg-white/85 border border-white/90 shadow-xs hover:bg-white transition-all flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-navy font-extrabold uppercase text-[9px] tracking-wider leading-tight">
                    <Maximize2 className="w-3.5 h-3.5 text-primaryblue flex-shrink-0" />
                    <span>6. SCALE-UP PLAN</span>
                  </div>
                  <p className="font-semibold text-navy text-xs leading-snug">
                    If Positive: Permanent Menu Integration
                  </p>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-normal pt-1">
                  Contract weekly bulk potato and sauce shipments for an extra 8% margin reduction. Launch student loyalty punch card.
                </p>
              </div>

            </div>
          </div>

          {/* Human Expertise / Expert Validation Section */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-lightgreen/30 via-white to-lightblue/30 border border-growthgreen/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-growthgreen shadow-xs border border-growthgreen/20 font-bold text-sm flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-growthgreen" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase text-growthgreen tracking-wider">
                    Human Expertise Validation
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-lightgreen text-darkgreen text-[9px] font-extrabold">
                    Expert Assigned
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs text-navy mt-0.5">
                  Assigned Strategist: Rajesh Kulkarni
                </h4>
                <p className="text-[11px] text-slate-600 truncate">
                  Retail & Hospitality Strategist • Verified kitchen feasibility & student transit alignment.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab ? onNavigateTab('expert-validation') : (window.location.hash = '#expert-validation')}
              className="btn-secondary-blue px-3.5 py-2 text-xs font-bold shadow-soft-glass flex items-center space-x-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto flex-shrink-0"
            >
              <span>View Expert Validation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Execution Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Ready to execute this blueprint in your kitchen?
            </span>

            <div className="flex items-center space-x-2">
              {selectedPlan.status === 'draft' && (
                <button
                  onClick={() => handleSubmitForReview(selectedPlan.id)}
                  disabled={submittingId === selectedPlan.id}
                  className="btn-secondary-blue py-2.5 px-5 text-xs font-bold shadow-soft-glass flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>{submittingId === selectedPlan.id ? 'Submitting...' : 'Submit to Human Expert'}</span>
                </button>
              )}
              {selectedPlan.status === 'approved' && (
                <button
                  onClick={() => onLaunchExperiment(selectedPlan)}
                  className="btn-primary py-2.5 px-5 text-xs font-bold shadow-soft-glass flex items-center space-x-2 cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Launch Live 7-Day Experiment</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          AI CHATBOT CALLOUT BANNER
          ======================================================== */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-primaryblue/30 bg-gradient-to-r from-lightblue/40 via-white/80 to-lightgreen/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft-glass">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primaryblue text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-xs sm:text-sm text-navy">
              Need more clarity on this action plan? Ask T→G AI
            </h4>
            <p className="text-[11px] text-slate-600 font-medium">
              Ask about supplier wholesale pricing in Pune or step-by-step kitchen prep timing.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateTab) onNavigateTab('ask-tg');
          }}
          className="btn-primary py-2 px-4 text-xs font-bold shadow-soft-glass cursor-pointer flex-shrink-0 self-start sm:self-auto"
        >
          <span>Ask AI Chatbot</span>
        </button>
      </div>

    </div>
  );
};
