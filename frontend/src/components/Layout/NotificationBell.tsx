import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Check, 
  Flame,
  Activity
} from 'lucide-react';
import { api } from '../../services/api/client';
import { Alert } from '../../types';

interface NotificationBellProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  unreadCount?: number;
  onCountChange?: (count: number) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  currentTab,
  onNavigate,
  unreadCount = 2,
  onCountChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [localUnreadCount, setLocalUnreadCount] = useState<number>(unreadCount);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAlerts();
  }, [currentTab]);

  useEffect(() => {
    setLocalUnreadCount(unreadCount);
  }, [unreadCount]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts();
      setAlerts(data);
      const unread = data.filter(a => !a.is_read).length;
      setLocalUnreadCount(unread);
      if (onCountChange) onCountChange(unread);
    } catch (err) {
      // Fallback notifications if offline/demo
      const fallbackAlerts: Alert[] = [
        {
          id: 'al-1',
          business_id: 'default',
          trend_id: 't-loaded-fries',
          alert_type: 'Trend Acceleration',
          title: 'New Rising Trend: Loaded Fries Search Spiked +42%',
          message: 'Evening demand in Pune college transit corridor surged 42% over 72h. Match score: 86%.',
          severity: 'high',
          confidence: 0.92,
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 'al-2',
          business_id: 'default',
          trend_id: 't-matcha-boba',
          alert_type: 'Emerging Demand',
          title: 'Trend Relevance Update: Iced Matcha & Boba',
          message: 'Local Gen-Z beverage demand clustered around your café zip code. Profit margin estimated at 64%.',
          severity: 'medium',
          confidence: 0.88,
          is_read: false,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'al-3',
          business_id: 'default',
          alert_type: 'Expert Review Required',
          title: 'Expert Validation Update: Rajesh Kulkarni Approved',
          message: 'Your 7-day combo rollout plan was reviewed. Low kitchen complexity confirmed with high student synergy.',
          severity: 'info',
          confidence: 0.95,
          is_read: true,
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'al-4',
          business_id: 'default',
          alert_type: 'Experiment Center',
          title: 'Growth Tracking Update: +116% Peak Lift Recorded',
          message: 'Day 5 store measurement showed 26 daily orders vs 12 baseline orders. Scale-up criteria met.',
          severity: 'info',
          confidence: 0.94,
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setAlerts(fallbackAlerts);
      setLocalUnreadCount(2);
    }
  };

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await api.markAlertRead(id);
    } catch {}
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    const newCount = Math.max(0, localUnreadCount - 1);
    setLocalUnreadCount(newCount);
    if (onCountChange) onCountChange(newCount);
  };

  const handleAlertClick = (alert: Alert) => {
    handleMarkAsRead(alert.id);
    setIsOpen(false);
    
    // Context-sensitive routing
    if (alert.alert_type === 'Expert Review Required' || alert.title.includes('Expert')) {
      onNavigate('expert-validation');
    } else if (alert.alert_type === 'Experiment Center' || alert.title.includes('Growth')) {
      onNavigate('growth-tracking');
    } else if (alert.title.includes('Plan') || alert.title.includes('Action')) {
      onNavigate('action-plans');
    } else {
      onNavigate('trend-finder');
    }
  };

  const getAlertIcon = (type: string, title: string) => {
    if (title.includes('Growth') || type.includes('Experiment')) {
      return <Activity className="w-3.5 h-3.5 text-growthgreen" />;
    }
    if (title.includes('Expert') || type.includes('Expert')) {
      return <ShieldCheck className="w-3.5 h-3.5 text-primaryblue" />;
    }
    if (title.includes('Plan') || title.includes('Action')) {
      return <FileText className="w-3.5 h-3.5 text-secondaryblue" />;
    }
    if (type.includes('Acceleration') || title.includes('Spiked')) {
      return <Flame className="w-3.5 h-3.5 text-amber-500" />;
    }
    return <TrendingUp className="w-3.5 h-3.5 text-primaryblue" />;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 select-none"
      aria-label="Smart Alerts Container"
    >
      {/* Soft rounded white notification button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-navy border border-white/80 shadow-soft-glass hover:shadow-glass-hover backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primaryblue/30"
        title="Smart Alerts & Notifications"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-12 text-primaryblue' : ''}`} />
        
        {/* Compact notification badge displaying unread count (e.g. 2) */}
        {localUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-warningorange text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
            {localUnreadCount}
          </span>
        )}
      </button>

      {/* Smart Alerts Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl glass-panel bg-white/95 backdrop-blur-2xl p-4 shadow-glass-hover border border-white/90 z-50 animate-in fade-in slide-in-from-top-2">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2.5">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-warningbg text-warningorange">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs text-navy tracking-tight">
                  Smart Alerts
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">
                  Trend signals & business updates
                </p>
              </div>
            </div>

            {localUnreadCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warningbg text-warningorange border border-warningorange/20">
                {localUnreadCount} New
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lightgreen text-darkgreen border border-growthgreen/20">
                All Read
              </span>
            )}
          </div>

          {/* List of Alerts */}
          <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin pr-0.5">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                    !alert.is_read
                      ? 'bg-white border-primaryblue/20 shadow-xs ring-1 ring-primaryblue/10'
                      : 'bg-white/60 hover:bg-white/90 border-white/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="p-1 rounded-md bg-slate-50">
                        {getAlertIcon(alert.alert_type, alert.title)}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        {alert.alert_type}
                      </span>
                    </div>

                    {!alert.is_read && (
                      <span className="w-2 h-2 rounded-full bg-warningorange flex-shrink-0 mt-1" />
                    )}
                  </div>

                  <h5 className="font-bold text-xs text-navy mt-1.5 leading-snug">
                    {alert.title}
                  </h5>

                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-1 mt-1 border-t border-slate-50">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>Recently</span>
                    </span>
                    {!alert.is_read && (
                      <button
                        onClick={(e) => handleMarkAsRead(alert.id, e)}
                        className="text-primaryblue hover:underline font-bold flex items-center space-x-0.5"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark read</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No notifications right now.
              </div>
            )}
          </div>

          {/* Footer View All */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primaryblue">
            <button
              onClick={() => {
                onNavigate('alerts');
                setIsOpen(false);
              }}
              className="hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {localUnreadCount > 0 && (
              <button
                onClick={() => {
                  alerts.forEach(a => api.markAlertRead(a.id).catch(() => {}));
                  setAlerts(alerts.map(a => ({ ...a, is_read: true })));
                  setLocalUnreadCount(0);
                  if (onCountChange) onCountChange(0);
                }}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
