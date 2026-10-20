import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Users, 
  Building2, 
  TrendingUp, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Clock,
  Terminal,
  Server
} from 'lucide-react';
import { api } from '../services/api/client';

export const AdminDashboardPage: React.FC = () => {
  const [adminData, setAdminData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminOverview();
  }, []);

  const loadAdminOverview = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOverview();
      setAdminData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !adminData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-light-blue text-dark-blue border border-primary-blue/20">
              System Telemetry & Platform Ops
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-medium">Global Health Monitor</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy mt-1.5">
            T→G Mission Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Monitor active users, data ingestion connectors, AI provider latency, and human expert quality gate metrics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-md text-navy text-xs font-bold flex items-center space-x-2 border border-white/90 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-growth animate-pulse"></span>
            <span>API Gateway: Operational</span>
          </span>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Registered</span>
            <Users className="w-5 h-5 text-primary-blue" />
          </div>
          <div className="font-display font-extrabold text-3xl text-navy">
            {adminData.users.total}
          </div>
          <div className="text-xs text-teal font-extrabold">
            {adminData.users.active} Active Online
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Businesses</span>
            <Building2 className="w-5 h-5 text-teal" />
          </div>
          <div className="font-display font-extrabold text-3xl text-navy">
            {adminData.businesses.total}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            3 Connected Pilot Verticals
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Indexed Trends</span>
            <TrendingUp className="w-5 h-5 text-growth" />
          </div>
          <div className="font-display font-extrabold text-3xl text-navy">
            {adminData.trends.total}
          </div>
          <div className="text-xs text-growth font-extrabold">
            {adminData.trends.rising} Rising / {adminData.trends.emerging} Emerging
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">AI Pipeline Latency</span>
            <Cpu className="w-5 h-5 text-primary-blue" />
          </div>
          <div className="font-display font-extrabold text-3xl text-navy">
            {adminData.intelligence.averageLatencyMs}ms
          </div>
          <div className="text-xs text-teal font-extrabold">
            {adminData.intelligence.successRate} Inference Success
          </div>
        </div>
      </div>

      {/* Middle Grid: Data Sources Health & Expert Review Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Data Source Pipeline Health (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary-blue" />
              <h3 className="font-display font-bold text-base text-navy">
                Data Connectors & Ingestion Pipeline Health
              </h3>
            </div>
            <span className="text-xs font-bold text-dark-green bg-light-green px-3 py-1 rounded-full border border-growth/20">
              {adminData.dataSources.statusHealthy} / {adminData.dataSources.total} Healthy
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {adminData.dataSources.list.map((src: any) => (
              <div 
                key={src.id}
                className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-between text-xs shadow-sm"
              >
                <div>
                  <div className="font-bold text-navy flex items-center space-x-2">
                    <span className="text-sm">{src.source_name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {src.source_type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Trust Rating: {(src.baseline_trust * 100).toFixed(0)}% • Error Rate: {src.errorRate}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-teal">
                    {src.recordsCollected.toLocaleString()} signals
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Deduplicated: {src.recordsDeduplicated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Review Gate Stats (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-growth" />
              <h3 className="font-display font-bold text-base text-navy">
                Human-in-the-Loop Review Funnel
              </h3>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-between text-xs shadow-sm">
              <span className="font-semibold text-primary-blue text-xs sm:text-sm">Pending Review Queue</span>
              <span className="font-extrabold text-xl text-primary-blue">{adminData.expertValidation.pending}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-between text-xs shadow-sm">
              <span className="font-semibold text-growth text-xs sm:text-sm">Authorized for Live Pilot</span>
              <span className="font-extrabold text-xl text-growth">{adminData.expertValidation.approved}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-between text-xs shadow-sm">
              <span className="font-semibold text-warning-orange text-xs sm:text-sm">Changes Requested</span>
              <span className="font-extrabold text-xl text-warning-orange">{adminData.expertValidation.changesRequested}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 flex items-center justify-between text-xs shadow-sm">
              <span className="font-semibold text-rose-600 text-xs sm:text-sm">Rejected Blueprints</span>
              <span className="font-extrabold text-xl text-rose-600">{adminData.expertValidation.rejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Audit Logs */}
      <div className="glass-card p-6 lg:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-primary-blue" />
          <span>Real-time System Audit Telemetry</span>
        </div>

        <div className="bg-navy text-slate-200 p-5 rounded-2xl font-mono text-xs space-y-2.5 overflow-x-auto shadow-inner border border-white/10">
          <div className="text-teal font-semibold">✓ [AI Engine] Dispatched inference request via deterministic provider (latency: 142ms)</div>
          <div className="text-slate-300">ℹ [Ingestion] Swiggy & Zomato Market Intelligence connector refreshed (342 new signals)</div>
          <div className="text-slate-300">ℹ [Expert Gate] Action Plan "Loaded Fries Student Combo" validated by expert Rajesh Kulkarni</div>
          <div className="text-primary-blue">ℹ [Experiment] Daily metric recorded for "7-Day ₹99 Loaded Fries Pilot": 26 orders</div>
        </div>
      </div>
    </div>
  );
};
