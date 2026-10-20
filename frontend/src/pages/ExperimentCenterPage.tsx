import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Cpu, 
  Layers,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { Experiment, ExperimentMetric } from '../types';
import { api } from '../services/api/client';

export const ExperimentCenterPage: React.FC = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [metricName, setMetricName] = useState('Daily Orders');
  const [metricValue, setMetricValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  useEffect(() => {
    loadExperiments();
  }, []);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const list = await api.getExperiments();
      setExperiments(list);
      if (list.length > 0) setSelectedExp(list[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExp || !metricValue) return;

    try {
      await api.addExperimentMetric(selectedExp.id, {
        metric_name: metricName,
        metric_value: parseFloat(metricValue),
        metric_unit: metricName.includes('Revenue') ? 'INR' : 'orders',
      });
      setMetricValue('');
      await loadExperiments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedExp) return;
    setEvaluating(true);
    try {
      const res = await api.completeExperiment(selectedExp.id, 'SCALE');
      // Request AI analysis
      const analysis = await fetch(`/api/experiments/${selectedExp.id}/analyze`, { method: 'POST' });
      const analysisJson = await analysis.json();
      setAnalysisResult(analysisJson.data || analysisJson);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const expMetrics = selectedExp?.metrics || [];
  const chartData = expMetrics.map((m, i) => ({
    day: `Day ${i + 1}`,
    value: m.metric_value,
    baseline: m.baseline_value || 12,
  }));

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-light-blue text-dark-blue text-xs font-bold uppercase tracking-wider mb-2 border border-primary-blue/20">
            <FlaskConical className="w-3.5 h-3.5 text-primary-blue" />
            <span>Empirical Growth Lab</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">
            In-Market Experiment Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Test hypotheses in the real local market, record daily metrics, and scale validated winning formulas
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-right shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-500">Live Experiments</div>
            <div className="font-extrabold text-lg text-growth">{experiments.length} Active</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Experiment Selection List (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <div className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Pilots ({experiments.length})
          </div>

          {experiments.map((exp) => (
            <div
              key={exp.id}
              onClick={() => {
                setSelectedExp(exp);
                setAnalysisResult(null);
              }}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                selectedExp?.id === exp.id
                  ? 'bg-white/95 border-growth shadow-glass-hover ring-2 ring-growth/20'
                  : 'glass-card hover:bg-white/90 border-white/70'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs sm:text-sm text-navy">{exp.name}</h4>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-light-blue text-dark-blue border border-primary-blue/20 uppercase">
                  {exp.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {exp.hypothesis}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Active Experiment Dashboard & Metrics (8 cols) */}
        {selectedExp && (
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-[28px] border border-white/80 shadow-soft-glass space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal">
                  Active Pilot Execution
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-navy mt-1">
                  {selectedExp.name}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAnalyze}
                  disabled={evaluating}
                  className="btn-primary px-5 py-2.5 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{evaluating ? 'Analyzing...' : 'Synthesize AI Pilot Outcome'}</span>
                </button>
              </div>
            </div>

            {/* Hypothesis statement */}
            <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 space-y-1 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase text-teal tracking-wider block">
                Hypothesis Tested
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedExp.hypothesis}
              </p>
            </div>

            {/* Metrics Chart: Daily values vs Baseline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-navy flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-primary-blue" />
                  <span>Performance vs Baseline (12 Daily Pre-Experiment Baseline)</span>
                </h3>
                <span className="text-xs font-extrabold text-growth bg-light-green px-2.5 py-0.5 rounded-full border border-growth/20">
                  +116% Peak Lift Achieved
                </span>
              </div>

              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 30]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        borderRadius: '16px', 
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 8px 30px rgba(30, 60, 90, 0.12)'
                      }} 
                    />
                    <ReferenceLine y={12} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Baseline (12)', fill: '#EF4444', fontSize: 10 }} />
                    <Bar dataKey="value" name="Recorded Metric" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Form to Log Today's Metric */}
            <div className="p-5 rounded-2xl bg-white/60 border border-white/80 space-y-3 shadow-sm">
              <div className="font-bold text-xs text-navy">Log Today's In-Store Measurement</div>
              <form onSubmit={handleAddMetric} className="flex flex-col sm:flex-row gap-3">
                <select
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  className="px-3.5 py-2.5 text-xs rounded-xl bg-white/90 border border-slate-200/80 focus:outline-none focus:border-primary-blue font-medium text-navy"
                >
                  <option value="Daily Orders">Daily Orders (Covers)</option>
                  <option value="Evening Revenue">Evening Revenue (INR)</option>
                  <option value="Average Order Value">Average Order Value (INR)</option>
                </select>

                <input
                  type="number"
                  placeholder="Enter value (e.g. 28)"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white/90 border border-slate-200/80 focus:outline-none focus:border-primary-blue font-medium text-navy"
                  required
                />

                <button
                  type="submit"
                  className="btn-secondary-blue px-6 py-2.5 text-xs font-bold shadow-soft-glass"
                >
                  Record Metric
                </button>
              </form>
            </div>

            {/* AI Outcome Analysis Card if evaluated */}
            {analysisResult && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-light-green to-light-blue border border-growth/30 space-y-3.5 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-dark-green">
                    <CheckCircle2 className="w-4 h-4 text-growth" />
                    <span>Experiment Evaluated: {analysisResult.statusOutcome}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-growth text-white shadow-sm">
                    Recommendation: {analysisResult.suggestedDecision}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {analysisResult.summary}
                </p>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-navy">Recommended Scaling Directives:</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {analysisResult.nextSteps?.map((step: string, i: number) => (
                      <li key={i} className="flex items-center space-x-2">
                        <ArrowUpRight className="w-3.5 h-3.5 text-growth" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
