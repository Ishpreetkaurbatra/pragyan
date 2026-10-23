import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Compass, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles, 
  History, 
  FilePlus2, 
  BotMessageSquare,
  Flame,
  CheckCircle2,
  RotateCcw,
  MousePointer
} from 'lucide-react';
import { Trend } from '../types';
import { api } from '../services/api/client';

export interface ExploredRecord {
  trendId: string;
  preference: 'interested' | 'not_interested';
  status: 'interested' | 'not_interested';
  timestamp: string;
  trend: Trend;
}

interface ExploreTrendsPageProps {
  onSelectTrend: (trend: Trend) => void;
  onGeneratePlan: (trend: Trend) => void;
  onNavigateTab?: (tab: string) => void;
  initialFilter?: string;
}

const SWIPE_THRESHOLD = 100; // Drag threshold in px before triggering a decision

// Reusable trend card content for pixel-identical alignment between active and underlying cards
const TrendCardContent: React.FC<{
  trend: Trend;
  index: number;
  total: number;
  onSelectTrend: (trend: Trend) => void;
  onGeneratePlan: (trend: Trend) => void;
}> = ({ trend, index, total, onSelectTrend, onGeneratePlan }) => (
  <>
    {/* Trend Image & Badges */}
    <div className="h-80 sm:h-96 w-full relative overflow-hidden bg-slate-900">
      <img 
        src={trend.image_url} 
        alt={trend.name} 
        className="w-full h-full object-cover object-center pointer-events-none"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

      {/* Status Badges */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-growthgreen text-white shadow-md">
          {trend.lifecycle_status}
        </span>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
          {trend.category}
        </span>
      </div>

      {/* Progress Counter (e.g. 1 of 7, 2 of 7) */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-900/85 text-white text-xs font-bold backdrop-blur-md border border-white/25 z-10 shadow-sm">
        {index + 1} of {total}
      </div>

      {/* Bottom Overlay Info on Card */}
      <div className="absolute bottom-5 left-5 right-5 text-white space-y-1 z-10">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-warningorange block">
          COMMERCIAL SIGNAL
        </span>
        <h3 className="font-display font-extrabold text-xl sm:text-2xl drop-shadow-md">
          {trend.headline}
        </h3>
      </div>
    </div>

    {/* Card Body Details */}
    <div className="p-6 sm:p-7 space-y-5 bg-white/95">
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium line-clamp-3 min-h-[3.75rem]">
        {trend.description}
      </p>

      {/* Core Fit Summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-bold uppercase text-slate-400">Relevance</div>
          <div className="font-extrabold text-base text-primaryblue mt-0.5">
            {Math.round(trend.trend_score)}%
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-bold uppercase text-slate-400">Momentum</div>
          <div className="font-extrabold text-base text-growthgreen mt-0.5">
            {Math.round(trend.momentum)}%
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-bold uppercase text-slate-400">Risk</div>
          <div className="font-extrabold text-base text-slate-700 mt-0.5">
            {trend.risk}
          </div>
        </div>
      </div>

      {/* Quick Jump Buttons inside Card */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTrend(trend);
          }}
          className="font-bold text-primaryblue hover:underline flex items-center space-x-1 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-lightblue/30 transition-all"
        >
          <span>Explore Full Intelligence</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGeneratePlan(trend);
          }}
          className="font-bold text-teal hover:underline flex items-center space-x-1 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-emerald-50 transition-all"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>Actionable Plan</span>
        </button>
      </div>
    </div>
  </>
);

export const ExploreTrendsPage: React.FC<ExploreTrendsPageProps> = ({ 
  onSelectTrend, 
  onGeneratePlan,
  onNavigateTab,
  initialFilter
}) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'swipe' | 'explored'>('swipe');
  const [history, setHistory] = useState<ExploredRecord[]>([]);

  // Dragging and animation states
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isRebounding, setIsRebounding] = useState<boolean>(false);
  const [animatingExit, setAnimatingExit] = useState<'left' | 'right' | null>(null);

  // Mutable refs for rock-solid event handling without closure staleness
  const trendsRef = useRef<Trend[]>([]);
  trendsRef.current = trends;
  const currentIndexRef = useRef<number>(0);
  currentIndexRef.current = currentIndex;
  const historyRef = useRef<ExploredRecord[]>([]);
  historyRef.current = history;
  const animatingExitRef = useRef<'left' | 'right' | null>(null);
  animatingExitRef.current = animatingExit;

  // Pointer drag tracking refs
  const isPointerDownRef = useRef<boolean>(false);
  const startClientXRef = useRef<number>(0);
  const startClientYRef = useRef<number>(0);
  const currentDragXRef = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);

  useEffect(() => {
    loadTrends();
    loadHistoryFromStorage();
  }, [initialFilter]);

  const loadHistoryFromStorage = () => {
    try {
      const saved = localStorage.getItem('tg_explored_trends');
      if (saved) {
        const parsed = JSON.parse(saved);
        const normalized: ExploredRecord[] = parsed.map((item: any) => {
          const pref = item.preference || (item.status === 'passed' ? 'not_interested' : item.status) || 'interested';
          return {
            ...item,
            preference: pref === 'passed' ? 'not_interested' : pref,
            status: pref === 'passed' ? 'not_interested' : pref
          };
        });
        setHistory(normalized);
      }
    } catch (e) {
      console.error('Failed to load explored trends from storage', e);
    }
  };

  const saveHistoryToStorage = (newHistory: ExploredRecord[]) => {
    try {
      localStorage.setItem('tg_explored_trends', JSON.stringify(newHistory));
      const prefMap: Record<string, 'interested' | 'not_interested'> = {};
      newHistory.forEach(h => {
        prefMap[h.trendId] = h.preference;
      });
      localStorage.setItem('tg_trend_preferences', JSON.stringify(prefMap));
    } catch (e) {
      console.error('Failed to save explored trends to storage', e);
    }
  };

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await api.getTrends(initialFilter ? { category: initialFilter } : undefined);
      setTrends(data);
    } catch (err) {
      console.error('Failed to fetch trends', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger swipe decision with complete animation lifecycle
  const triggerSwipeDecision = useCallback((preference: 'interested' | 'not_interested', direction: 'left' | 'right') => {
    if (animatingExitRef.current) return;
    const currentTrend = trendsRef.current[currentIndexRef.current];
    if (!currentTrend) return;

    // 1. Lock swipe during animation
    animatingExitRef.current = direction;
    setAnimatingExit(direction);
    setIsDragging(false);
    setIsRebounding(false);

    // 2. Save decision immediately
    const record: ExploredRecord = {
      trendId: currentTrend.id,
      preference,
      status: preference,
      timestamp: new Date().toISOString(),
      trend: currentTrend
    };

    const updated = [record, ...historyRef.current.filter(h => h.trendId !== currentTrend.id)];
    setHistory(updated);
    saveHistoryToStorage(updated);

    // 3. Wait until current card completes its exit animation completely (350ms)
    setTimeout(() => {
      // 4. Advance index and reset all drag/animation states together
      setCurrentIndex(prev => prev + 1);
      setDragX(0);
      currentDragXRef.current = 0;
      setIsDragging(false);
      setIsRebounding(false);
      setAnimatingExit(null);
      animatingExitRef.current = null;
    }, 350);
  }, []);

  // Shared release handler for mouse and touch
  const handleRelease = useCallback(() => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (animatingExitRef.current) return;

    const finalDeltaX = currentDragXRef.current;
    if (finalDeltaX >= SWIPE_THRESHOLD) {
      triggerSwipeDecision('interested', 'right');
    } else if (finalDeltaX <= -SWIPE_THRESHOLD) {
      triggerSwipeDecision('not_interested', 'left');
    } else if (Math.abs(finalDeltaX) > 0) {
      // Rebound back to center smoothly if below threshold
      setIsRebounding(true);
      setDragX(0);
      currentDragXRef.current = 0;
      setTimeout(() => {
        setIsRebounding(false);
      }, 260);
    }
  }, [triggerSwipeDecision]);

  // Desktop Mouse Drag Event Listeners
  const handleMouseDown = (e: React.MouseEvent) => {
    if (animatingExitRef.current) return;
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    if (e.button !== 0) return; // Left click only

    isPointerDownRef.current = true;
    startClientXRef.current = e.clientX;
    currentDragXRef.current = 0;
    hasMovedRef.current = false;
    setIsRebounding(false);
  };

  // Window mouse listener for smooth uninterrupted desktop dragging
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isPointerDownRef.current || animatingExitRef.current) return;
      const deltaX = e.clientX - startClientXRef.current;
      
      if (Math.abs(deltaX) > 4) {
        hasMovedRef.current = true;
        setIsDragging(true);
      }
      currentDragXRef.current = deltaX;
      setDragX(deltaX);
    };

    const handleWindowMouseUp = () => {
      handleRelease();
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [handleRelease]);

  // Mobile / Tablet Touch Gestures (Horizontal only)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (animatingExitRef.current) return;
    if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;

    isPointerDownRef.current = true;
    startClientXRef.current = e.touches[0].clientX;
    startClientYRef.current = e.touches[0].clientY;
    currentDragXRef.current = 0;
    hasMovedRef.current = false;
    setIsRebounding(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPointerDownRef.current || animatingExitRef.current) return;
    const deltaX = e.touches[0].clientX - startClientXRef.current;
    const deltaY = e.touches[0].clientY - startClientYRef.current;

    // Horizontal swiping: only track if horizontal movement is dominant
    if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
      hasMovedRef.current = true;
      setIsDragging(true);
      currentDragXRef.current = deltaX;
      setDragX(deltaX);
    } else if (isDragging) {
      currentDragXRef.current = deltaX;
      setDragX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    handleRelease();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
        <div className="w-10 h-10 border-3 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-secondary">Loading market signals...</p>
      </div>
    );
  }

  const currentTrend = trends[currentIndex];
  const nextTrend = currentIndex + 1 < trends.length ? trends[currentIndex + 1] : null;
  const isCompleted = currentIndex >= trends.length;
  const interestedHistory = history.filter(h => h.preference === 'interested' || h.status === 'interested');
  const notInterestedHistory = history.filter(h => h.preference === 'not_interested' || h.status === 'not_interested');

  // Dynamic visual calculations for drag tracking and overlay stamps
  const rotation = Math.max(-18, Math.min(18, dragX * 0.045));
  
  const rightOpacity = animatingExit === 'right' 
    ? 1 
    : dragX > 20 
    ? Math.min(1, (dragX - 20) / (SWIPE_THRESHOLD - 20)) 
    : 0;

  const leftOpacity = animatingExit === 'left' 
    ? 1 
    : dragX < -20 
    ? Math.min(1, (Math.abs(dragX) - 20) / (SWIPE_THRESHOLD - 20)) 
    : 0;

  // Compute card style transform based strictly on interaction phase
  let cardTransform = 'translate3d(0, 0, 0) rotate(0deg)';
  let cardTransition = 'none';
  let cardOpacity = 1;

  if (animatingExit === 'right') {
    cardTransform = 'translate3d(140%, 0, 0) rotate(24deg)';
    cardTransition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease';
    cardOpacity = 0;
  } else if (animatingExit === 'left') {
    cardTransform = 'translate3d(-140%, 0, 0) rotate(-24deg)';
    cardTransition = 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease';
    cardOpacity = 0;
  } else if (isDragging) {
    cardTransform = `translate3d(${dragX}px, 0, 0) rotate(${rotation}deg)`;
    cardTransition = 'none';
    cardOpacity = 1;
  } else if (isRebounding) {
    cardTransform = 'translate3d(0, 0, 0) rotate(0deg)';
    cardTransition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cardOpacity = 1;
  } else {
    // Normal centered state: strictly static with no transition
    cardTransform = 'translate3d(0, 0, 0) rotate(0deg)';
    cardTransition = 'none';
    cardOpacity = 1;
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primaryblue">
            <Compass className="w-4 h-4" />
            <span>Fast Signal Discovery & Preference Engine</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-navy">
            Explore Market Trends
          </h1>
          <p className="text-xs sm:text-sm text-secondary font-medium">
            Swipe right on trends relevant to your business to train your intelligence recommendations
          </p>
        </div>

        {/* Tab Toggle: Swipe Mode vs Explored History */}
        <div className="flex items-center space-x-1.5 glass-pill p-1.5 w-fit">
          <button
            onClick={() => setActiveTab('swipe')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'swipe'
                ? 'bg-primaryblue text-white shadow-soft-glass'
                : 'text-secondary hover:text-navy hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Swipe Discovery</span>
          </button>

          <button
            onClick={() => setActiveTab('explored')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'explored'
                ? 'bg-primaryblue text-white shadow-soft-glass'
                : 'text-secondary hover:text-navy hover:bg-white/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Explored History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: HORIZONTAL SWIPE DISCOVERY CARD
          ======================================================== */}
      {activeTab === 'swipe' && (
        <div className="max-w-2xl mx-auto space-y-6 pt-2">
          
          {!isCompleted && currentTrend ? (
            <div className="relative w-full overflow-visible min-h-[580px] sm:min-h-[620px]">

              {/* Underlying Card in Stack (Already Centered & Ready in Stack) */}
              {nextTrend && (
                <div 
                  key={`underlying-${nextTrend.id}`}
                  className="absolute inset-0 rounded-[32px] overflow-hidden glass-panel border border-white/90 shadow-glass-panel pointer-events-none select-none z-10"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    opacity: 1
                  }}
                >
                  <TrendCardContent 
                    trend={nextTrend}
                    index={currentIndex + 1}
                    total={trends.length}
                    onSelectTrend={onSelectTrend}
                    onGeneratePlan={onGeneratePlan}
                  />
                </div>
              )}

              {/* Active Swipeable Trend Card with Stable Key */}
              <div 
                key={currentTrend.id}
                id="active-trend-card"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`relative rounded-[32px] overflow-hidden glass-panel border border-white/90 shadow-glass-panel select-none touch-pan-y z-20 ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                style={{
                  transform: cardTransform,
                  transition: cardTransition,
                  opacity: cardOpacity,
                }}
              >
                {/* Subtle Green Overlay Stamp (Swipe Right -> Interested) */}
                <div 
                  className="absolute top-7 left-7 z-30 pointer-events-none transition-opacity duration-150"
                  style={{ opacity: rightOpacity }}
                >
                  <div className="px-5 py-2.5 rounded-2xl border-[3.5px] border-growthgreen bg-growthgreen/25 backdrop-blur-md shadow-lg transform -rotate-12 flex items-center space-x-2 text-growthgreen font-black tracking-widest text-base sm:text-lg uppercase select-none">
                    <Check className="w-5 h-5 stroke-[3.5]" />
                    <span>INTERESTED</span>
                  </div>
                </div>

                {/* Subtle Red Overlay Stamp (Swipe Left -> Not Interested) */}
                <div 
                  className="absolute top-7 right-7 z-30 pointer-events-none transition-opacity duration-150"
                  style={{ opacity: leftOpacity }}
                >
                  <div className="px-5 py-2.5 rounded-2xl border-[3.5px] border-red-500 bg-red-500/25 backdrop-blur-md shadow-lg transform rotate-12 flex items-center space-x-2 text-red-500 font-black tracking-widest text-base sm:text-lg uppercase select-none">
                    <X className="w-5 h-5 stroke-[3.5]" />
                    <span>NOT INTERESTED</span>
                  </div>
                </div>

                {/* Subtle Ambient Color Tints while Dragging */}
                <div 
                  className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-growthgreen/10 to-growthgreen/20 rounded-[32px] transition-opacity duration-150"
                  style={{ opacity: rightOpacity }}
                />
                <div 
                  className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-l from-transparent via-red-500/10 to-red-500/20 rounded-[32px] transition-opacity duration-150"
                  style={{ opacity: leftOpacity }}
                />

                <TrendCardContent 
                  trend={currentTrend}
                  index={currentIndex}
                  total={trends.length}
                  onSelectTrend={onSelectTrend}
                  onGeneratePlan={onGeneratePlan}
                />
              </div>

            </div>
          ) : (
            /* ========================================================
               CLEAN COMPLETION STATE: ALL TRENDS REVIEWED
               ======================================================== */
            <div className="py-12 px-6 sm:px-10 text-center space-y-6 glass-panel rounded-[32px] border border-white/90 shadow-glass-panel max-w-xl mx-auto animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-growthgreen/15 border border-growthgreen/30 flex items-center justify-center text-growthgreen shadow-soft-glass">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              
              <div className="space-y-2">
                <h2 className="font-display font-black text-2xl sm:text-3xl text-navy">
                  You're all caught up
                </h2>
                <p className="text-sm text-secondary font-medium max-w-md mx-auto leading-relaxed">
                  We've learned what trends matter to you. Your preferences have been saved and will shape future trend recommendations.
                </p>
              </div>

              {/* Review Summary Breakdown */}
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-100 flex items-center justify-around text-center max-w-sm mx-auto shadow-sm">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Interested</div>
                  <div className="text-2xl font-black text-growthgreen mt-0.5">
                    {interestedHistory.length}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Not Interested</div>
                  <div className="text-2xl font-black text-slate-600 mt-0.5">
                    {notInterestedHistory.length}
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Reviewed</div>
                  <div className="text-2xl font-black text-navy mt-0.5">
                    {history.length}
                  </div>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(0);
                    setDragX(0);
                    setAnimatingExit(null);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl glass-card border border-slate-200 text-navy font-bold text-xs sm:text-sm hover:bg-white transition-all cursor-pointer shadow-soft-glass flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4 text-primaryblue" />
                  <span>Review Trends Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('explored')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-primary text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-soft-glass flex items-center justify-center space-x-2"
                >
                  <History className="w-4 h-4" />
                  <span>View Explored History</span>
                </button>
              </div>
            </div>
          )}

          {/* Swipe Action Buttons (Always Available on Desktop/Mobile) */}
          {!isCompleted && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <button
                  id="swipe-left-btn"
                  type="button"
                  onClick={() => triggerSwipeDecision('not_interested', 'left')}
                  disabled={animatingExit !== null}
                  className="flex-1 py-4 px-6 rounded-2xl glass-card border border-slate-200/90 text-slate-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50/70 font-extrabold text-sm flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-soft-glass active:scale-95 disabled:opacity-50"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <X className="w-4 h-4 text-red-500 stroke-[2.5]" />
                  </div>
                  <span>← Not Interested</span>
                </button>

                <button
                  id="swipe-right-btn"
                  type="button"
                  onClick={() => triggerSwipeDecision('interested', 'right')}
                  disabled={animatingExit !== null}
                  className="flex-1 py-4 px-6 rounded-2xl btn-primary text-white font-extrabold text-sm flex items-center justify-center space-x-2.5 transition-all cursor-pointer shadow-soft-glass active:scale-95 disabled:opacity-50"
                >
                  <span>Interested →</span>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  </div>
                </button>
              </div>

              {/* Intuitive Gesture Tip */}
              <div className="flex items-center justify-center space-x-2 text-center text-xs text-secondary font-medium">
                <MousePointer className="w-3.5 h-3.5 text-primaryblue" />
                <span>
                  Drag card left or right, or click the buttons above.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODE 2: EXPLORED TRENDS & HISTORY
          ======================================================== */}
      {activeTab === 'explored' && (
        <div className="space-y-8">
          
          {/* Section 1: Interested Trends (Priority Playbooks) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-lg text-navy flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-growthgreen" />
                  <span>Interested Trends ({interestedHistory.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Trends you flagged as relevant for FreshBite Café. Ready for commercial rollout.
                </p>
              </div>
            </div>

            {interestedHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {interestedHistory.map(item => (
                  <div 
                    key={item.trendId}
                    className="glass-panel p-5 rounded-3xl border border-white/90 shadow-soft-glass flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="h-40 rounded-2xl overflow-hidden relative">
                        <img 
                          src={item.trend.image_url} 
                          alt={item.trend.name} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-growthgreen text-white shadow-sm">
                          Interested
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-base text-navy leading-snug">
                          {item.trend.headline}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {item.trend.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onGeneratePlan(item.trend)}
                        className="btn-primary py-2.5 px-4 text-xs font-bold flex-1 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <FilePlus2 className="w-3.5 h-3.5" />
                        <span>Actionable Plan</span>
                      </button>

                      <button
                        onClick={() => onSelectTrend(item.trend)}
                        className="btn-secondary-blue py-2.5 px-3 text-xs font-bold cursor-pointer"
                        title="Explore Full Intelligence"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl glass-panel text-center space-y-3">
                <p className="text-sm text-slate-500 font-medium">
                  You haven't marked any trends as interested yet.
                </p>
                <button
                  onClick={() => setActiveTab('swipe')}
                  className="btn-primary py-2.5 px-5 text-xs font-bold cursor-pointer"
                >
                  Start Swiping Trends
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Complete Exploration History Timeline */}
          <div className="glass-panel p-6 sm:p-7 rounded-[28px] border border-white/85 shadow-soft-glass space-y-4">
            <h3 className="font-display font-bold text-base text-navy flex items-center space-x-2">
              <History className="w-4 h-4 text-primaryblue" />
              <span>Full Trend Exploration History ({history.length})</span>
            </h3>

            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((record, index) => {
                  const isInterested = record.preference === 'interested' || record.status === 'interested';
                  return (
                    <div 
                      key={`${record.trendId}-${index}`}
                      className="p-3.5 rounded-2xl bg-white/70 hover:bg-white border border-white/90 flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs ${
                          isInterested ? 'bg-growthgreen shadow-sm' : 'bg-slate-400'
                        }`}>
                          {isInterested ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-navy truncate">
                            {record.trend.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(record.timestamp).toLocaleDateString()} • {isInterested ? 'Marked Interested' : 'Marked Not Interested'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => onSelectTrend(record.trend)}
                          className="text-xs font-bold text-primaryblue hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center font-medium">
                No trends explored yet. Switch to Swipe Discovery to review signals.
              </p>
            )}
          </div>

        </div>
      )}

      {/* ========================================================
          AI CHATBOT CALLOUT BANNER
          ======================================================== */}
      <div className="glass-panel p-6 rounded-[28px] border border-primaryblue/30 bg-gradient-to-r from-lightblue/40 via-white/80 to-lightgreen/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-soft-glass">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primaryblue text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-sm sm:text-base text-navy">
              Need more clarity on market trends? Ask T→G AI
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Ask about consumer willingness to pay, vendor sourcing, or competitors in Maharashtra.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateTab) onNavigateTab('ask-tg');
          }}
          className="btn-primary py-2.5 px-5 text-xs font-bold shadow-soft-glass cursor-pointer flex-shrink-0"
        >
          <span>Ask AI Chatbot</span>
        </button>
      </div>

    </div>
  );
};
