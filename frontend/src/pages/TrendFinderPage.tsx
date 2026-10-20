import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Target, 
  ShieldAlert, 
  Bookmark, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  Layers, 
  Activity, 
  CheckCircle2, 
  FilePlus2,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { Trend } from '../types';
import { api } from '../services/api/client';

interface TrendFinderPageProps {
  onSelectTrend: (trend: Trend) => void;
  onGeneratePlan: (trend: Trend) => void;
}

export const TrendFinderPage: React.FC<TrendFinderPageProps> = ({ onSelectTrend, onGeneratePlan }) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('For You');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [savedTrendIds, setSavedTrendIds] = useState<Set<string>>(new Set());
  const [generatingPlanId, setGeneratingPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = ['For You', 'Food & Beverage', 'Beverages', 'Health & Fitness', 'Marketing & Pricing', 'All'];

  useEffect(() => {
    loadTrends();
  }, [activeCategory]);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await api.getTrends({
        category: activeCategory === 'For You' ? undefined : activeCategory,
      });
      setTrends(data);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < trends.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      scrollToIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      scrollToIndex(prevIdx);
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const cardHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * cardHeight,
        behavior: 'smooth',
      });
    }
  };

  // Desktop keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, trends.length]);

  const toggleSave = async (trendId: string) => {
    const nextSet = new Set(savedTrendIds);
    if (nextSet.has(trendId)) {
      await api.unsaveTrend(trendId);
      nextSet.delete(trendId);
    } else {
      await api.saveTrend(trendId);
      nextSet.add(trendId);
    }
    setSavedTrendIds(nextSet);
  };

  const handleCreatePlan = async (trend: Trend) => {
    setGeneratingPlanId(trend.id);
    try {
      await api.generateActionPlan('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', trend.id);
      onGeneratePlan(trend);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] space-y-3">
        <div className="w-10 h-10 border-3 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-secondary">Discovering personalized market trends...</p>
      </div>
    );
  }

  const currentTrend = trends[currentIndex] || trends[0];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-16">
      {/* Category Pills Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-lightblue flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primaryblue" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-textmain">
              Discover What's Next
            </h1>
            <p className="text-xs text-secondary font-medium">
              Vertical trend discovery calibrated to FreshBite Café's operating hours and demographics
            </p>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2 glass-pill px-3 py-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                activeCategory === cat
                  ? 'bg-primaryblue text-white shadow-soft-glass'
                  : 'text-secondary hover:text-textmain hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reels-Style Discovery Viewport (Desktop-First Wide Split) */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left/Center: Large Reels Card (Scroll Snap Feed) */}
        <div className="col-span-8 relative">
          <div 
            ref={containerRef}
            className="h-[680px] trend-feed-container rounded-4xl overflow-hidden glass-panel border border-white/90 shadow-glass-panel relative"
          >
            {trends.map((trend) => (
              <div 
                key={trend.id}
                className="trend-card-snap h-full w-full relative flex flex-col justify-between p-10"
              >
                {/* Background Realistic Photography with Dark Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={trend.image_url} 
                    alt={trend.name} 
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-950/25"></div>
                </div>

                {/* Top Overlay: Status badge + save button */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-growthgreen text-white backdrop-blur-md shadow-md">
                      {trend.lifecycle_status} TREND
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                      {trend.category}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSave(trend.id)}
                    className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors border border-white/25 shadow-soft-glass"
                    title="Save Trend"
                  >
                    <Bookmark 
                      className={`w-5 h-5 ${savedTrendIds.has(trend.id) ? 'fill-warningorange text-warningorange' : ''}`} 
                    />
                  </button>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-5 text-white max-w-4xl">
                  <div>
                    <h2 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight drop-shadow-md">
                      {trend.headline}
                    </h2>
                    <p className="mt-2 text-sm text-slate-200 line-clamp-2 leading-relaxed font-normal">
                      {trend.description}
                    </p>
                  </div>

                  {/* 4 Core Signals Grid */}
                  <div className="grid grid-cols-4 gap-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Momentum</div>
                      <div className="font-extrabold text-base text-growthgreen mt-0.5">
                        {trend.momentum > 80 ? 'HIGH' : 'STEADY'}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Business Fit</div>
                      <div className="font-extrabold text-base text-lightgreen mt-0.5">
                        {trend.name.includes('Fries') ? '91%' : `${Math.round(trend.trend_score)}%`}
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Opportunity</div>
                      <div className="font-extrabold text-base text-lightblue mt-0.5">
                        {(trend.trend_score / 10).toFixed(1)}/10
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-300">Risk</div>
                      <div className="font-extrabold text-base text-lightgreen mt-0.5">
                        {trend.risk}
                      </div>
                    </div>
                  </div>

                  {/* Potential Action callout banner */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-growthgreen/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-growthgreen" />
                      </div>
                      <div className="text-xs">
                        <span className="font-extrabold uppercase tracking-wider text-growthgreen block text-[10px]">
                          WHAT COULD YOU DO WITH THIS?
                        </span>
                        <span className="text-slate-100 font-medium text-xs leading-snug">
                          {trend.name.includes('Fries')
                            ? 'Launch a ₹99 student combo between 4–8 PM and test demand for 7 days.'
                            : `Launch a limited 7-day pilot offering ${trend.name} to capture local demand spike.`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar - Bold High-Contrast CTA Buttons */}
                  <div className="flex items-center space-x-3.5 pt-1">
                    <button
                      onClick={() => onSelectTrend(trend)}
                      className="btn-secondary-blue flex-1 py-3.5 px-5 text-xs font-bold shadow-soft-glass flex items-center justify-center space-x-2"
                    >
                      <span>Explore Trend Analytics</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleCreatePlan(trend)}
                      disabled={generatingPlanId === trend.id}
                      className="btn-primary py-3.5 px-6 text-xs font-bold shadow-soft-glass flex items-center space-x-2"
                    >
                      <FilePlus2 className="w-4 h-4" />
                      <span>{generatingPlanId === trend.id ? 'Generating...' : 'Generate Action Plan'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Navigation Controls (Up/Down) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-2.5 z-20">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-all disabled:opacity-30 border border-white/20 shadow-glass-hover"
              title="Previous Trend (Up Arrow / K)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 text-xs font-extrabold text-white text-center backdrop-blur-md border border-white/20">
              {currentIndex + 1}/{trends.length}
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === trends.length - 1}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-all disabled:opacity-30 border border-white/20 shadow-glass-hover"
              title="Next Trend (Down Arrow / J)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Contextual Intelligence Panel (Desktop) */}
        <div className="col-span-4 space-y-6">
          {/* Why you're seeing this box */}
          <div className="glass-card p-7 rounded-4xl space-y-4">
            <div className="flex items-center space-x-2.5 text-xs font-extrabold uppercase tracking-wider text-primaryblue">
              <Info className="w-4 h-4 text-primaryblue" />
              <span>Why you're seeing this</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-medium">
              Calibrated for <strong className="text-textmain">FreshBite Café</strong> in <strong className="text-textmain">Sangamner & Pune Suburban</strong>. High density of college student transit between 4:00 PM and 8:00 PM addresses your specific target to increase evening average order value.
            </p>
            <div className="pt-3 border-t border-white/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Demographic Fit:</span>
                <span className="font-extrabold text-growthgreen">18–24 College (58%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Expected Payback:</span>
                <span className="font-extrabold text-primaryblue">7-Day Test Pilot</span>
              </div>
            </div>
          </div>

          {/* Business Fit Breakdown Card */}
          <div className="glass-card p-7 rounded-4xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
                Business Fit Scoring
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-lightgreen text-darkgreen">
                Rule Engine
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-secondary">Customer Fit</span>
                  <span className="text-textmain font-bold">94%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-primaryblue h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-secondary">Product & Inventory Fit</span>
                  <span className="text-textmain font-bold">89%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal h-2 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-secondary">Location Fit</span>
                  <span className="text-textmain font-bold">87%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-secondaryblue h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-secondary">Goal Alignment</span>
                  <span className="text-textmain font-bold">95%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-growthgreen h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Shortcut Pill */}
          <div className="p-5 rounded-3xl glass-card text-xs text-secondary leading-relaxed font-medium">
            <strong className="text-textmain font-bold block mb-1">Desktop Shortcuts:</strong>
            Use <kbd className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-mono text-[11px] text-textmain font-bold">↓</kbd> or <kbd className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-mono text-[11px] text-textmain font-bold">J</kbd> to discover next trend, <kbd className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-mono text-[11px] text-textmain font-bold">↑</kbd> or <kbd className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-mono text-[11px] text-textmain font-bold">K</kbd> for previous.
          </div>
        </div>
      </div>
    </div>
  );
};
