import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Target, 
  Zap, 
  Bell, 
  ArrowRight, 
  FileText, 
  FlaskConical, 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell 
} from 'recharts';
import { DashboardData, Trend } from '../types';
import { api } from '../services/api/client';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onSelectTrend: (trend: Trend) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectTrend }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] space-y-3">
        <div className="w-10 h-10 border-3 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-secondary">Loading Growth Intelligence Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-[1600px] mx-auto">
      {/* Top Banner with Business Context & Slogan */}
      <div className="flex flex-row items-center justify-between gap-6 p-8 rounded-4xl glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-lightblue text-darkblue border border-primaryblue/20">
              Live Business Context
            </span>
            <span className="text-xs text-muted font-medium">•</span>
            <span className="text-xs text-secondary font-semibold">Sangamner & Pune Suburban Corridor</span>
            <span className="text-xs text-muted font-medium">•</span>
            <span className="text-xs font-semibold text-teal">Soft Glass. Strong Intelligence. Visible Growth.</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-textmain mt-1.5">
            {data.business.business_name} Intelligence Command Center
          </h1>
          <p className="text-sm text-secondary font-medium mt-1">
            Active Strategic Goal: <strong className="font-semibold text-textmain">{data.business.business_goal}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3.5 flex-shrink-0">
          <button
            onClick={() => onNavigate('trend-finder')}
            className="btn-primary px-6 py-3.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Launch Trend Finder</span>
          </button>
          <button
            onClick={() => onNavigate('ask-tg')}
            className="btn-secondary-blue px-5 py-3.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
          >
            <Zap className="w-4 h-4 text-white" />
            <span>Ask T→G Advisor</span>
          </button>
        </div>
      </div>

      {/* 5 Glass KPI Cards (Desktop Spacious Grid) */}
      <div className="grid grid-cols-5 gap-5">
        {/* Market Signals */}
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Market Signals</span>
            <div className="w-8 h-8 rounded-xl bg-lightblue flex items-center justify-center">
              <Activity className="w-4 h-4 text-primaryblue" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-textmain">
            {data.kpis.marketSignals.toLocaleString()}
          </div>
          <div className="text-xs text-growthgreen font-bold flex items-center space-x-1">
            <span>+18.4%</span>
            <span className="text-secondary font-medium">vs last month</span>
          </div>
        </div>

        {/* Rising Trends */}
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Rising Trends</span>
            <div className="w-8 h-8 rounded-xl bg-lightgreen flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-growthgreen" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-textmain">
            {data.kpis.risingTrends} Verified
          </div>
          <div className="text-xs text-teal font-bold flex items-center space-x-1">
            <span>High velocity in F&B</span>
          </div>
        </div>

        {/* Business Fit */}
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Business Fit Score</span>
            <div className="w-8 h-8 rounded-xl bg-lightgreen flex items-center justify-center">
              <Target className="w-4 h-4 text-growthgreen" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-growthgreen">
            {data.kpis.businessFit}%
          </div>
          <div className="text-xs text-secondary font-medium">
            Evening Student match
          </div>
        </div>

        {/* Top Opportunity Score */}
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Opportunity Score</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-warningorange" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-textmain">
            {data.kpis.opportunityScore}<span className="text-lg text-muted font-normal">/10</span>
          </div>
          <div className="text-xs text-secondary font-medium truncate">
            Loaded Fries Student Combo
          </div>
        </div>

        {/* Active Smart Alerts */}
        <div className="glass-card p-6 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">Active Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-warningbg flex items-center justify-center">
              <Bell className="w-4 h-4 text-warningorange" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-textmain">
            {data.kpis.activeAlerts} Priority
          </div>
          <div className="text-xs text-warningorange font-bold">
            Demand surge detected
          </div>
        </div>
      </div>

      {/* Middle Row: Wide Market Momentum Chart & Opportunity Matrix */}
      <div className="grid grid-cols-12 gap-8">
        {/* Market Momentum Trendline */}
        <div className="col-span-7 glass-card p-8 rounded-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-textmain">
                Regional Market Momentum & Velocity
              </h3>
              <p className="text-xs text-secondary font-medium">
                Aggregated search and transaction velocity across Pune/Sangamner youth corridor
              </p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-lightgreen text-darkgreen border border-growthgreen/20">
              +36.8% Trajectory Lift
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.momentumTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255, 255, 255, 0.9)', 
                    boxShadow: '0 8px 30px rgba(30, 60, 90, 0.1)' 
                  }} 
                />
                <Area type="monotone" dataKey="index" name="Momentum Index" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
                <Area type="monotone" dataKey="velocity" name="Search Velocity" stroke="#14B8A6" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#tealGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Opportunity Matrix */}
        <div className="col-span-5 glass-card p-8 rounded-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-textmain">
                Trend Opportunity Matrix
              </h3>
              <p className="text-xs text-secondary font-medium">
                Business Fit (%) vs Opportunity Score (10)
              </p>
            </div>
            <span className="text-[11px] font-bold text-primaryblue bg-lightblue px-2.5 py-0.5 rounded-full">
              High Impact Zone ↗
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
                <XAxis type="number" dataKey="businessFit" name="Business Fit %" domain={[70, 100]} stroke="#94A3B8" fontSize={11} unit="%" />
                <YAxis type="number" dataKey="opportunityScore" name="Opportunity Score" domain={[6.5, 10]} stroke="#94A3B8" fontSize={11} />
                <ZAxis type="number" dataKey="momentum" range={[100, 260]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="glass-panel p-4 rounded-2xl border border-white text-xs space-y-1 shadow-glass-hover">
                          <p className="font-bold text-textmain text-sm">{item.name}</p>
                          <p className="text-primaryblue font-semibold">Business Fit: {item.businessFit}%</p>
                          <p className="text-teal font-semibold">Opportunity: {item.opportunityScore}/10</p>
                          <p className="text-secondary text-[11px]">Risk: {item.risk}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={data.opportunityMatrix}>
                  {data.opportunityMatrix.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name.includes('Fries') ? '#2563EB' : entry.opportunityScore > 8.5 ? '#14B8A6' : '#64748B'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 3-Column Desktop Grid: Top Opportunities & Active Experiment & Smart Alerts */}
      <div className="grid grid-cols-3 gap-8">
        {/* Column 1: Top Opportunities */}
        <div className="glass-card p-7 rounded-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Target className="w-5 h-5 text-primaryblue" />
              <h3 className="font-display font-bold text-base text-textmain">Top Opportunities</h3>
            </div>
            <button 
              onClick={() => onNavigate('opportunities')}
              className="text-xs font-bold text-primaryblue hover:underline flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {data.topOpportunities.map((opp) => (
              <div 
                key={opp.id} 
                className="p-4 rounded-2xl bg-white/70 border border-white/80 hover:bg-white transition-all space-y-2.5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-xs text-textmain">{opp.name}</h4>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-lightblue text-darkblue">
                    {opp.opportunity_score}/10
                  </span>
                </div>
                <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                  {opp.potential_action}
                </p>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-secondary font-medium">Business Fit: <strong className="text-growthgreen font-bold">{opp.business_fit}%</strong></span>
                  <button 
                    onClick={() => onNavigate('action-plans')}
                    className="text-primaryblue font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Playbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Active Experiment */}
        <div className="glass-card p-7 rounded-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <FlaskConical className="w-5 h-5 text-teal" />
              <h3 className="font-display font-bold text-base text-textmain">Active Experiment</h3>
            </div>
            <button 
              onClick={() => onNavigate('experiments')}
              className="text-xs font-bold text-teal hover:underline flex items-center space-x-1"
            >
              <span>Telemetry</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {data.experiments.length > 0 ? (
            <div className="p-5 rounded-2xl bg-white/70 border border-white/80 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-lightblue text-darkblue">
                  {data.experiments[0].status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-xs text-secondary font-semibold">Day 4 of 7 Pilot</span>
              </div>
              <h4 className="font-bold text-sm text-textmain">{data.experiments[0].name}</h4>
              <p className="text-xs text-secondary leading-relaxed font-normal">
                {data.experiments[0].hypothesis}
              </p>
              
              <div className="p-3 rounded-2xl bg-lightgreen/70 border border-growthgreen/20 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-darkgreen uppercase font-bold">Daily Orders</div>
                  <div className="font-extrabold text-base text-darkgreen">26 Covers (+116% lift)</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-darkgreen uppercase font-bold">Evening Revenue</div>
                  <div className="font-extrabold text-base text-darkgreen">₹2,350/day</div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('experiments')}
                className="btn-primary w-full py-2.5 text-xs font-bold shadow-soft-glass"
              >
                Log Today's Measurement
              </button>
            </div>
          ) : (
            <p className="text-xs text-secondary">No active experiment.</p>
          )}
        </div>

        {/* Column 3: Smart Alerts */}
        <div className="glass-card p-7 rounded-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Bell className="w-5 h-5 text-warningorange" />
              <h3 className="font-display font-bold text-base text-textmain">Smart Alerts</h3>
            </div>
            <button 
              onClick={() => onNavigate('alerts')}
              className="text-xs font-bold text-primaryblue hover:underline flex items-center space-x-1"
            >
              <span>All alerts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {data.alerts.map((al) => (
              <div 
                key={al.id}
                className={`p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                  al.is_read ? 'bg-white/50 border-white/60 opacity-80' : 'bg-white/90 border-warningorange/30 shadow-soft-glass'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                    al.severity === 'high' ? 'bg-warningbg text-warningorange font-extrabold' : 'bg-lightblue text-primaryblue font-extrabold'
                  }`}>
                    {al.alert_type}
                  </span>
                  {!al.is_read && (
                    <span className="w-2 h-2 rounded-full bg-warningorange animate-pulse"></span>
                  )}
                </div>
                <h5 className="font-bold text-xs text-textmain">{al.title}</h5>
                <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">{al.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
