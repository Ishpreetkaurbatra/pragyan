import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  FilePlus2,
  TrendingUp,
  BarChart2,
  SlidersHorizontal
} from 'lucide-react';
import { Opportunity } from '../types';
import { api } from '../services/api/client';

interface OpportunitiesPageProps {
  onGeneratePlanFromOpp: (opp: Opportunity) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ onGeneratePlanFromOpp }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      const data = await api.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Header with KPI Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-light-blue text-dark-blue text-xs font-bold uppercase tracking-wider mb-2 border border-primary-blue/20">
            <Target className="w-3.5 h-3.5 text-primary-blue" />
            <span>Commercial Opportunity Matrix</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">
            Identified Business Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            High-confidence commercial initiatives matched against FreshBite Café's footprint and local demand
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-right shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500">Qualified Pipeline</div>
            <div className="font-extrabold text-lg text-teal">{opportunities.length} Initiatives</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-right shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500">Highest Score</div>
            <div className="font-extrabold text-lg text-primary-blue">9.4 / 10</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <div 
              key={opp.id}
              className="glass-card p-6 flex flex-col justify-between space-y-5 hover:border-teal/50 hover:shadow-glass-hover transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Header with Title and Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-light-blue text-primary-blue flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors border border-primary-blue/20">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-navy leading-snug">
                        {opp.name}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">Market Initiative</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-light-green text-dark-green border border-growth/20 shadow-sm flex-shrink-0">
                    {opp.opportunity_score}/10
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {opp.description}
                </p>

                {/* Recommended Action callout */}
                <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-1.5 shadow-sm">
                  <span className="text-[10px] uppercase font-extrabold text-teal tracking-wider block">
                    Recommended Action Step
                  </span>
                  <p className="text-xs font-semibold text-navy leading-relaxed">
                    {opp.potential_action}
                  </p>
                </div>

                {/* Score Pills */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs pt-1">
                  <div className="p-2.5 rounded-2xl bg-white/60 border border-white/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Business Fit</span>
                    <div className="font-extrabold text-growth text-sm mt-0.5">{opp.business_fit}%</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/60 border border-white/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Risk Level</span>
                    <div className="font-extrabold text-dark-green text-sm mt-0.5">{opp.risk}</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white/60 border border-white/80">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Confidence</span>
                    <div className="font-extrabold text-primary-blue text-sm mt-0.5">{Math.round(opp.confidence * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-200/60">
                <button
                  onClick={() => onGeneratePlanFromOpp(opp)}
                  className="btn-primary w-full py-3 px-4 text-xs font-bold shadow-soft-glass flex items-center justify-center space-x-2"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>Formulate Action Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
