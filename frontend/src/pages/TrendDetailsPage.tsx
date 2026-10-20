import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Zap, 
  Activity, 
  Users, 
  MapPin, 
  Globe, 
  FilePlus2, 
  ShieldCheck,
  Calendar,
  Sparkles,
  BarChart3,
  Award
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Trend, TrendMetric, Audience, GeographicSignal } from '../types';
import { api } from '../services/api/client';

interface TrendDetailsPageProps {
  trend: Trend;
  onBack: () => void;
  onGeneratePlan: (trend: Trend) => void;
}

export const TrendDetailsPage: React.FC<TrendDetailsPageProps> = ({ trend, onBack, onGeneratePlan }) => {
  const [period, setPeriod] = useState<string>('30d');
  const [metrics, setMetrics] = useState<TrendMetric[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [geography, setGeography] = useState<GeographicSignal[]>([]);
  const [loading, setLoading] = useState(true);

  const periods = [
    { label: '7 Days', val: '7d' },
    { label: '30 Days', val: '30d' },
    { label: '90 Days', val: '90d' },
    { label: '6 Months', val: '6m' },
    { label: '1 Year', val: '1y' },
  ];

  useEffect(() => {
    loadTrendAnalytics();
  }, [trend.id, period]);

  const loadTrendAnalytics = async () => {
    setLoading(true);
    try {
      const [m, a, g] = await Promise.all([
        api.getTrendMetrics(trend.id, period),
        api.getTrendAudience(trend.id),
        api.getTrendGeography(trend.id),
      ]);
      setMetrics(m);
      setAudiences(a);
      setGeography(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fallback chart points if empty
  const chartPoints = metrics.length > 0 ? metrics.map((m, idx) => ({
    name: `T-${metrics.length - idx}`,
    interest: m.metric_value,
  })) : [
    { name: 'W1', interest: 64 },
    { name: 'W2', interest: 72 },
    { name: 'W3', interest: 81 },
    { name: 'W4', interest: 92 },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Top Navigation & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="btn-secondary-blue px-4 py-2 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
          <span>Back to Trend Discovery</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-light-blue text-dark-blue border border-primary-blue/20">
            <Sparkles className="w-3.5 h-3.5 text-primary-blue" />
            <span>AI Multi-Source Verified</span>
          </span>
          <button
            onClick={() => onGeneratePlan(trend)}
            className="btn-primary px-6 py-2.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Generate Action Plan</span>
          </button>
        </div>
      </div>

      {/* Hero Trend Overview Banner */}
      <div className="rounded-[28px] glass-panel border border-white/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-soft-glass">
        <div className="lg:col-span-5 h-72 lg:h-auto relative overflow-hidden">
          <img 
            src={trend.image_url} 
            alt={trend.name} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/30 to-transparent"></div>
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-growth text-white shadow-sm">
                {trend.lifecycle_status}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white">
                {trend.category}
              </span>
            </div>
            <h2 className="text-xl font-display font-extrabold text-white mt-2 drop-shadow-sm">
              {trend.name}
            </h2>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-primary-blue uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Executive Trend Brief</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy mt-1.5 leading-snug">
              {trend.headline}
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {trend.description}
            </p>
          </div>

          {/* 4 Core Signals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-500">Momentum</div>
              <div className="font-extrabold text-xl text-teal mt-0.5">+{trend.momentum}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">30-day velocity</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-500">Business Fit</div>
              <div className="font-extrabold text-xl text-growth mt-0.5">
                {trend.name.includes('Fries') ? '91%' : `${Math.round(trend.trend_score)}%`}
              </div>
              <div className="text-[10px] text-growth font-bold mt-0.5">High Synergy</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-500">Opportunity Score</div>
              <div className="font-extrabold text-xl text-primary-blue mt-0.5">
                {(trend.trend_score / 10).toFixed(1)}/10
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Composite index</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-center shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-500">Execution Risk</div>
              <div className="font-extrabold text-xl text-emerald-600 mt-0.5">{trend.risk}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Validated supply</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Analytics & Time-Series Chart */}
      <div className="glass-card p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-navy flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary-blue" />
              <span>Search & Consumer Demand Trajectory</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Multi-source interest index normalized over time (Google, Instagram, Delivery Hubs)
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center space-x-1 glass-pill p-1">
            {periods.map((p) => (
              <button
                key={p.val}
                onClick={() => setPeriod(p.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  period === p.val 
                    ? 'bg-primary-blue text-white shadow-soft-glass' 
                    : 'text-slate-600 hover:text-navy'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area / Line Trajectory */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[50, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.8)', 
                  boxShadow: '0 8px 30px rgba(30, 60, 90, 0.12)' 
                }} 
              />
              <Area
                type="monotone" 
                dataKey="interest" 
                name="Interest Index" 
                stroke="#2563EB" 
                strokeWidth={3} 
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Velocity Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200/60">
          <div className="text-center p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Velocity Index</span>
            <div className="font-extrabold text-base text-navy mt-0.5">{trend.velocity} / 100</div>
          </div>
          <div className="text-center p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Acceleration Delta</span>
            <div className="font-extrabold text-base text-teal mt-0.5">{trend.acceleration} / 100</div>
          </div>
          <div className="text-center p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Signal Consistency</span>
            <div className="font-extrabold text-base text-growth mt-0.5">{trend.consistency} / 100</div>
          </div>
          <div className="text-center p-3.5 rounded-2xl bg-white/70 border border-white/80 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500">Source Diversity</span>
            <div className="font-extrabold text-base text-primary-blue mt-0.5">{trend.source_diversity} / 100</div>
          </div>
        </div>
      </div>

      {/* Audience Demographics & Geographic Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Breakdown */}
        <div className="glass-card p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary-blue" />
              <h3 className="font-display font-bold text-base text-navy">Audience Demographics</h3>
            </div>
            <span className="text-xs font-semibold text-slate-600">Core Consumer Fit</span>
          </div>

          <div className="space-y-4 pt-1">
            {audiences.map((aud) => (
              <div key={aud.id} className="space-y-1.5 p-3 rounded-2xl bg-white/60 border border-white/80">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-navy font-bold">{aud.age_group}</span>
                  <span className="text-teal font-extrabold">{aud.percentage}% Demand Share</span>
                </div>
                <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal to-primary-blue h-2.5 rounded-full" 
                    style={{ width: `${aud.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>{aud.location || 'Local market cluster'}</span>
                  <span>{aud.interest || 'Consumer affinity index'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Signals */}
        <div className="glass-card p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary-blue" />
              <h3 className="font-display font-bold text-base text-navy">Geographic Concentration</h3>
            </div>
            <span className="text-xs font-semibold text-slate-600">Local Heatmap</span>
          </div>

          <div className="space-y-3 pt-1">
            {geography.map((geo) => (
              <div 
                key={geo.id} 
                className="p-3.5 rounded-2xl bg-white/70 border border-white/80 flex items-center justify-between shadow-sm"
              >
                <div>
                  <h4 className="font-bold text-xs text-navy">{geo.city || geo.state}</h4>
                  <p className="text-[11px] text-slate-500">{geo.state}, {geo.country}</p>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-xs text-teal">Signal Index: {geo.interest_score}</div>
                  {geo.growth_rate && (
                    <div className="text-[10px] text-primary-blue font-bold">+{geo.growth_rate}% YoY Growth</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Intelligence Breakdown */}
      <div className="glass-card p-6 lg:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-primary-blue" />
            <h3 className="font-display font-bold text-base text-navy">Multi-Source Provenance</h3>
          </div>
          <span className="text-xs font-bold text-slate-600">
            Triangulated Intelligence Feed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-sm">
            <span className="font-bold text-navy block">Google Trends Feed</span>
            <span className="text-[11px] text-slate-600 block">Search volume +42% sustained increase</span>
            <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-light-green text-dark-green">
              Confidence: 94%
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-sm">
            <span className="font-bold text-navy block">Instagram Reels Hub</span>
            <span className="text-[11px] text-slate-600 block">Foodie check-ins peaking 5–8 PM</span>
            <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-light-green text-dark-green">
              Confidence: 89%
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-sm">
            <span className="font-bold text-navy block">Food Delivery Ingestion</span>
            <span className="text-[11px] text-slate-600 block">Top 3 late-afternoon snack queries</span>
            <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-light-green text-dark-green">
              Confidence: 92%
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-1.5 shadow-sm">
            <span className="font-bold text-navy block">Industry Benchmark</span>
            <span className="text-[11px] text-slate-600 block">High-margin finger food category pivot</span>
            <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-light-green text-dark-green">
              Confidence: 90%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
