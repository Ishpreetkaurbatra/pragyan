import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  TrendingUp, 
  Target, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  FilePlus2,
  MapPin,
  Play
} from 'lucide-react';
import { Trend } from '../types';
import { api } from '../services/api/client';

interface TrendFinderPageProps {
  onSelectTrend: (trend: Trend) => void;
  onGeneratePlan: (trend: Trend) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TrendFinderPage: React.FC<TrendFinderPageProps> = ({ 
  onSelectTrend, 
  onGeneratePlan 
}) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isNavigatingRef = useRef<boolean>(false);
  const lastWheelTimeRef = useRef<number>(0);

  // Simulated creators mapped cyclically across trends
  const creators = [
    { handle: '@pune_foodies', name: 'Pune Foodie Community', platform: 'Instagram Reels' },
    { handle: '@campus_bites', name: 'College Dining Radar', platform: 'Shorts' },
    { handle: '@beverage_lab', name: 'Artisan Drink Lab', platform: 'TikTok / Reels' },
    { handle: '@retail_insights', name: 'QSR Maharashtra Watch', platform: 'Public Signals' },
  ];

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await api.getTrends();
      setTrends(data);
    } catch (err) {
      console.error('Failed to load trends:', err);
    } finally {
      setLoading(false);
    }
  };

  // Preload adjacent reel images/assets for instant, smooth rendering
  useEffect(() => {
    if (trends.length === 0) return;
    const adjacentIndices = [currentIndex - 1, currentIndex + 1];
    adjacentIndices.forEach((idx) => {
      if (idx >= 0 && idx < trends.length) {
        const item = trends[idx];
        if (item?.image_url) {
          const img = new Image();
          img.src = item.image_url;
        }
      }
    });
  }, [currentIndex, trends]);

  // Video autoplay / pause handling when active reel changes
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // Scroll smoothly to specified Reel index
  const scrollToReel = useCallback((index: number) => {
    if (index < 0 || index >= trends.length) return;
    const targetElement = reelRefs.current[index];
    if (targetElement && containerRef.current) {
      isNavigatingRef.current = true;
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentIndex(index);
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 450);
    }
  }, [trends.length]);

  // Track active Reel index using IntersectionObserver as user swipes or scrolls
  useEffect(() => {
    const container = containerRef.current;
    if (!container || trends.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-index');
            if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10);
              if (!isNaN(idx)) {
                setCurrentIndex(idx);
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    reelRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [trends.length]);

  // Controlled Mouse Wheel / Trackpad vertical scroll-snap
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 400) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) > 20) {
        e.preventDefault();
        lastWheelTimeRef.current = now;
        if (e.deltaY > 0) {
          // Scroll DOWN -> Next Reel
          if (currentIndex < trends.length - 1) {
            scrollToReel(currentIndex + 1);
          }
        } else {
          // Scroll UP -> Previous Reel
          if (currentIndex > 0) {
            scrollToReel(currentIndex - 1);
          }
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, trends.length, scrollToReel]);

  // Keyboard navigation support: ArrowDown, ArrowUp, PageDown, PageUp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toUpperCase();
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'j') {
        e.preventDefault();
        if (currentIndex < trends.length - 1) {
          scrollToReel(currentIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'k') {
        e.preventDefault();
        if (currentIndex > 0) {
          scrollToReel(currentIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, trends.length, scrollToReel]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
        <div className="w-10 h-10 border-3 border-primaryblue border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-secondary">Loading business-relevant trending Reels...</p>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 glass-panel rounded-3xl max-w-md mx-auto">
        <p className="text-sm font-bold text-navy">No trending Reels discovered right now.</p>
        <p className="text-xs text-secondary mt-1">Please check back soon or explore other trend categories.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl lg:max-w-3xl mx-auto h-[calc(100vh-2rem)] sm:h-[calc(100vh-2.5rem)] lg:h-[calc(100vh-3rem)] max-h-[820px] min-h-[580px] relative flex items-center justify-center">
      
      {/* ========================================================
          VERTICAL SNAP SCROLL CONTAINER
          Behaves like Instagram Reels / TikTok Web
          ======================================================== */}
      <div 
        ref={containerRef}
        tabIndex={0}
        aria-label="Vertical Trending Reels Feed"
        className="w-full h-full overflow-y-scroll reel-scroll-container no-scrollbar rounded-[32px] border border-white/90 shadow-glass-panel focus:outline-none relative"
      >
        {trends.map((trend, idx) => {
          const creator = creators[idx % creators.length];
          const relevanceScore = trend.name.includes('Fries') ? 94 : Math.round(trend.trend_score || 88);
          const hasVideo = Boolean((trend as any).video_url);

          return (
            <div
              key={trend.id || idx}
              data-index={idx}
              ref={(el) => (reelRefs.current[idx] = el)}
              className="w-full h-full reel-snap-item shrink-0 relative flex flex-col justify-between p-6 sm:p-8 text-white select-none overflow-hidden"
            >
              {/* Media Background (Video if available, else Image) */}
              <div className="absolute inset-0 z-0 bg-slate-950">
                {hasVideo ? (
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={(trend as any).video_url}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <img 
                    src={trend.image_url} 
                    alt={trend.name} 
                    loading={idx <= 1 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover object-center transform transition-transform duration-1000 scale-102 hover:scale-105"
                  />
                )}
                {/* Contrast Gradient Scrim: ensures clean text overlay readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30"></div>
              </div>

              {/* TOP BAR: Creator Identification & Trending Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs border border-white/30 shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-extrabold text-xs text-white tracking-wide">
                        {creator.handle}
                      </span>
                      <span className="text-[10px] text-slate-300">• {creator.platform}</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium">
                      Simulated Public Reel Signal
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-growthgreen text-white shadow-xs backdrop-blur-md">
                    {trend.lifecycle_status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                    {trend.category}
                  </span>
                </div>
              </div>

              {/* BOTTOM / CENTER OVERLAY: Headline, Description, Signals, CTAs */}
              <div className="relative z-10 space-y-3.5 max-w-xl pb-2">
                <div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-warningorange block mb-1">
                    HOT COMMERCIAL SIGNAL
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight drop-shadow-md text-white">
                    {trend.headline}
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed font-normal">
                    {trend.description}
                  </p>
                </div>

                {/* Metadata Signal Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center space-x-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-growthgreen" />
                    <span className="font-bold">Momentum: {Math.round(trend.momentum)}%</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-bold">Business Relevance: {relevanceScore}%</span>
                  </div>

                  <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-lightblue" />
                    <span>Pune / Sangamner Hub</span>
                  </div>
                </div>

                {/* Action CTA Button: ONLY Explore Trend */}
                <div className="pt-1.5">
                  <button
                    onClick={() => onSelectTrend(trend)}
                    className="btn-primary py-3.5 px-6 text-xs sm:text-sm font-bold shadow-soft-glass flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
                  >
                    <span>Explore Trend</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          RIGHT-SIDE FLOATING CONTROLS
          ↑ (Previous Reel) / Dynamic Counter / ↓ (Next Reel)
          ======================================================== */}
      <div 
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-2 z-30 pointer-events-auto"
        aria-label="Reel Navigation Controls"
      >
        {/* Previous Reel Button (disabled/hidden on first Reel) */}
        {currentIndex > 0 ? (
          <button
            onClick={() => scrollToReel(currentIndex - 1)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-md transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            title="Previous Reel (Arrow Up / K)"
            aria-label="Previous Reel"
          >
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 invisible" />
        )}

        {/* Dynamic Reel Counter: updates in real-time as user scrolls */}
        <div className="px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-[11px] font-extrabold text-white text-center border border-white/20 shadow-md min-w-[42px]">
          {currentIndex + 1}/{trends.length}
        </div>

        {/* Next Reel Button (disabled/hidden on last Reel) */}
        {currentIndex < trends.length - 1 ? (
          <button
            onClick={() => scrollToReel(currentIndex + 1)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 shadow-md transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            title="Next Reel (Arrow Down / J)"
            aria-label="Next Reel"
          >
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 invisible" />
        )}
      </div>

    </div>
  );
};
