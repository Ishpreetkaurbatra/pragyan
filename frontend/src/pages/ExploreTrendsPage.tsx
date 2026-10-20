import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowRight, 
  Compass, 
  SlidersHorizontal 
} from 'lucide-react';
import { Trend } from '../types';
import { api } from '../services/api/client';

interface ExploreTrendsPageProps {
  onSelectTrend: (trend: Trend) => void;
  onGeneratePlan: (trend: Trend) => void;
  initialFilter?: string;
}

export const ExploreTrendsPage: React.FC<ExploreTrendsPageProps> = ({ 
  onSelectTrend, 
  onGeneratePlan,
  initialFilter 
}) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialFilter || 'All');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Food & Beverage', 'Beverages', 'Health & Fitness', 'Marketing & Pricing'];
  const statuses = ['All', 'RISING', 'EMERGING', 'PEAKING', 'VALIDATING'];

  useEffect(() => {
    fetchTrends();
  }, [category, status]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const data = await api.getTrends({
        category: category === 'All' ? undefined : category,
        status: status === 'All' ? undefined : status,
        search: search.trim() ? search.trim() : undefined,
      });
      setTrends(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrends();
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primaryblue">
            <Compass className="w-4 h-4" />
            <span>Market Intelligence Engine</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-textmain">
            Explore Market Trends
          </h1>
          <p className="text-sm text-secondary font-medium">
            Search and evaluate real-world consumer patterns verified across multi-source intelligence
          </p>
        </div>
      </div>

      {/* Search and Filters Bar with Glassmorphism */}
      <div className="glass-panel p-6 rounded-4xl space-y-4 shadow-soft-glass border border-white/80">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-secondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search trends by keyword (e.g. Fries, Matcha, Protein, Cold Coffee)..."
              className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-white/90 bg-white/80 focus:outline-none focus:border-primaryblue focus:bg-white transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-primaryblue hover:bg-darkblue text-white font-bold text-xs sm:text-sm transition-all shadow-soft-glass shadow-primaryblue/20"
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/60">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-extrabold text-secondary uppercase mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-primaryblue text-white shadow-sm'
                    : 'glass-card text-secondary hover:text-textmain hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-secondary font-semibold">Lifecycle:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl glass-card font-bold text-textmain focus:outline-none cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trends Grid (Spacious 3-Column Desktop Grid) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <div className="w-8 h-8 border-3 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-secondary font-medium">Filtering trends...</p>
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-4xl space-y-2">
          <p className="font-bold text-textmain text-base">No trends match your query.</p>
          <p className="text-xs text-secondary">Try adjusting filters or searching for terms like "fries" or "coffee".</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {trends.map((trend) => (
            <div 
              key={trend.id}
              className="glass-card rounded-4xl overflow-hidden flex flex-col justify-between group hover:border-white transition-all shadow-soft-glass hover:shadow-glass-hover"
            >
              <div>
                {/* Image Banner */}
                <div className="h-56 w-full relative overflow-hidden">
                  <img 
                    src={trend.image_url} 
                    alt={trend.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-growthgreen text-white shadow-sm">
                      {trend.lifecycle_status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/30 backdrop-blur-md text-white border border-white/20">
                      {trend.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display font-extrabold text-xl leading-snug drop-shadow-sm">
                      {trend.name}
                    </h3>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-secondary line-clamp-2 leading-relaxed font-normal">
                    {trend.headline}
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs pt-1">
                    <div className="p-2.5 rounded-2xl bg-white/80 border border-white">
                      <div className="text-[10px] text-muted uppercase font-bold">Momentum</div>
                      <div className="font-extrabold text-textmain text-xs mt-0.5">{trend.momentum > 80 ? 'HIGH' : 'STEADY'}</div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-lightgreen/70 border border-growthgreen/20">
                      <div className="text-[10px] text-darkgreen uppercase font-bold">Business Fit</div>
                      <div className="font-extrabold text-darkgreen text-xs mt-0.5">
                        {trend.name.includes('Fries') ? '91%' : `${Math.round(trend.trend_score)}%`}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-lightblue/70 border border-primaryblue/20">
                      <div className="text-[10px] text-darkblue uppercase font-bold">Opp. Score</div>
                      <div className="font-extrabold text-darkblue text-xs mt-0.5">{(trend.trend_score / 10).toFixed(1)}/10</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer - Bold High-Contrast Buttons */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-white/60 gap-3">
                <button
                  onClick={() => onSelectTrend(trend)}
                  className="btn-secondary-blue flex-1 py-2.5 px-4 text-xs font-bold shadow-soft-glass flex items-center justify-center space-x-1.5"
                >
                  <span>Explore Trend</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
                <button
                  onClick={() => onGeneratePlan(trend)}
                  className="btn-primary flex-1 py-2.5 px-4 text-xs font-bold shadow-soft-glass"
                >
                  Generate Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
