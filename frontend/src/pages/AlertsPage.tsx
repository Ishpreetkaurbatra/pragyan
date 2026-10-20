import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  UserCheck, 
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { Alert } from '../types';
import { api } from '../services/api/client';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts(filter === 'unread');
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markAlertRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const alertIcon = (type: string) => {
    switch (type) {
      case 'Trend Acceleration':
        return <TrendingUp className="w-5 h-5 text-growth" />;
      case 'Emerging Demand':
        return <Target className="w-5 h-5 text-primary-blue" />;
      case 'Expert Review Required':
        return <UserCheck className="w-5 h-5 text-warning-orange" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 lg:p-8 rounded-[28px] glass-panel border border-white/80 shadow-soft-glass">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-light-blue text-dark-blue text-xs font-bold uppercase tracking-wider mb-2 border border-primary-blue/20">
            <Bell className="w-3.5 h-3.5 text-primary-blue" />
            <span>Autonomous Intelligence Signals</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-navy">
            Smart Alerts & Market Movements
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Proactive background detections of local demand spikes, trend acceleration, and human expert authorization updates
          </p>
        </div>

        <div className="flex items-center space-x-2 glass-pill p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all' 
                ? 'bg-primary-blue text-white shadow-soft-glass' 
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'unread' 
                ? 'bg-primary-blue text-white shadow-soft-glass' 
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-[28px] space-y-2">
          <p className="font-bold text-navy text-sm">No alerts currently active.</p>
          <p className="text-xs text-slate-500">All local market movements have been reviewed and acknowledged.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={`p-6 rounded-[24px] transition-all duration-200 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                al.is_read
                  ? 'bg-white/60 border-white/70 opacity-80'
                  : 'glass-card border-white/90 shadow-glass-hover'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3.5 rounded-2xl bg-white/90 shadow-sm border border-white/90 flex-shrink-0 mt-0.5">
                  {alertIcon(al.alert_type)}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      al.severity === 'high' 
                        ? 'bg-warning-bg text-amber-800 border border-warning-orange/30' 
                        : 'bg-light-green text-dark-green border border-growth/20'
                    }`}>
                      {al.alert_type}
                    </span>
                    {!al.is_read && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-primary-blue text-white rounded-full shadow-sm">
                        NEW SIGNAL
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-base text-navy">
                    {al.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal max-w-3xl">
                    {al.message}
                  </p>
                </div>
              </div>

              {!al.is_read && (
                <button
                  onClick={() => handleMarkRead(al.id)}
                  className="btn-secondary-green px-4 py-2 text-xs font-bold shadow-soft-glass flex items-center space-x-2 flex-shrink-0"
                  title="Mark as read"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Acknowledge</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
