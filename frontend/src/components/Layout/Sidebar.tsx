import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  Target, 
  FileText, 
  UserCheck, 
  FlaskConical, 
  Bell, 
  BotMessageSquare, 
  Building2, 
  Layers
} from 'lucide-react';
import { api } from '../../services/api/client';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadAlertsCount: number;
  pendingReviewsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  unreadAlertsCount,
  pendingReviewsCount,
}) => {
  const navItemClass = (tab: string) => `
    w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all
    ${currentTab === tab 
      ? 'bg-gradient-to-r from-primary-blue to-growth text-white shadow-soft-glass' 
      : 'text-slate-600 hover:text-navy hover:bg-white/80 glass-card border border-transparent hover:border-white/80'}
  `;

  return (
    <aside className="w-72 flex-shrink-0 p-6 space-y-6">
      {/* Overview Group */}
      <div className="space-y-1.5">
        <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">
          Intelligence Overview
        </div>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={navItemClass('dashboard')}
        >
          <div className="flex items-center space-x-3">
            <LayoutDashboard className={`w-4 h-4 ${currentTab === 'dashboard' ? 'text-white' : 'text-primaryblue'}`} />
            <span>Executive Dashboard</span>
          </div>
        </button>
      </div>

      {/* Trend Discovery Group */}
      <div className="space-y-1.5">
        <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">
          Trend Discovery
        </div>
        
        {/* Trend Finder Signature Feature */}
        <button
          onClick={() => setCurrentTab('trend-finder')}
          className={navItemClass('trend-finder')}
        >
          <div className="flex items-center space-x-3">
            <Sparkles className={`w-4 h-4 ${currentTab === 'trend-finder' ? 'text-amber-200' : 'text-warningorange'}`} />
            <span>Trend Finder</span>
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            currentTab === 'trend-finder' ? 'bg-white/20 text-white' : 'bg-warningbg text-warningorange'
          }`}>
            Reels
          </span>
        </button>

        <button
          onClick={() => setCurrentTab('explore-trends')}
          className={navItemClass('explore-trends')}
        >
          <div className="flex items-center space-x-3">
            <Compass className={`w-4 h-4 ${currentTab === 'explore-trends' ? 'text-white' : 'text-teal'}`} />
            <span>Explore Trends</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('rising-trends')}
          className={navItemClass('rising-trends')}
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className={`w-4 h-4 ${currentTab === 'rising-trends' ? 'text-white' : 'text-growthgreen'}`} />
            <span>Rising Signals</span>
          </div>
        </button>
      </div>

      {/* Opportunity & Execution Group */}
      <div className="space-y-1.5">
        <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">
          Commercial Execution
        </div>

        <button
          onClick={() => setCurrentTab('opportunities')}
          className={navItemClass('opportunities')}
        >
          <div className="flex items-center space-x-3">
            <Target className={`w-4 h-4 ${currentTab === 'opportunities' ? 'text-white' : 'text-primaryblue'}`} />
            <span>Opportunity Center</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('action-plans')}
          className={navItemClass('action-plans')}
        >
          <div className="flex items-center space-x-3">
            <FileText className={`w-4 h-4 ${currentTab === 'action-plans' ? 'text-white' : 'text-teal'}`} />
            <span>Action Playbooks</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('expert-validation')}
          className={navItemClass('expert-validation')}
        >
          <div className="flex items-center space-x-3">
            <UserCheck className={`w-4 h-4 ${currentTab === 'expert-validation' ? 'text-white' : 'text-secondaryblue'}`} />
            <span>Expert Validation</span>
          </div>
          {pendingReviewsCount > 0 && (
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              currentTab === 'expert-validation' ? 'bg-white/20 text-white' : 'bg-warningbg text-warningorange'
            }`}>
              {pendingReviewsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('experiments')}
          className={navItemClass('experiments')}
        >
          <div className="flex items-center space-x-3">
            <FlaskConical className={`w-4 h-4 ${currentTab === 'experiments' ? 'text-white' : 'text-cyanaccent'}`} />
            <span>Experiment Center</span>
          </div>
        </button>
      </div>

      {/* AI Intelligence & Alerts */}
      <div className="space-y-1.5">
        <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">
          AI & Telemetry
        </div>

        <button
          onClick={() => setCurrentTab('ask-tg')}
          className={navItemClass('ask-tg')}
        >
          <div className="flex items-center space-x-3">
            <BotMessageSquare className={`w-4 h-4 ${currentTab === 'ask-tg' ? 'text-white' : 'text-primaryblue'}`} />
            <span>Ask T→G Advisor</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            currentTab === 'ask-tg' ? 'bg-white/20 text-white' : 'bg-lightgreen text-darkgreen font-extrabold'
          }`}>
            AI
          </span>
        </button>

        <button
          onClick={() => setCurrentTab('alerts')}
          className={navItemClass('alerts')}
        >
          <div className="flex items-center space-x-3">
            <Bell className={`w-4 h-4 ${currentTab === 'alerts' ? 'text-white' : 'text-warningorange'}`} />
            <span>Smart Alerts</span>
          </div>
          {unreadAlertsCount > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentTab === 'alerts' ? 'bg-white/20 text-white' : 'bg-warningorange text-white'
            }`}>
              {unreadAlertsCount}
            </span>
          )}
        </button>
      </div>

      {/* Business Profile & Admin Settings */}
      <div className="space-y-1.5 pt-3 border-t border-white/60">
        <button
          onClick={() => setCurrentTab('profile')}
          className={navItemClass('profile')}
        >
          <div className="flex items-center space-x-3">
            <Building2 className={`w-4 h-4 ${currentTab === 'profile' ? 'text-white' : 'text-secondary'}`} />
            <span>Business Context</span>
          </div>
        </button>

        <button
          onClick={() => setCurrentTab('admin')}
          className={navItemClass('admin')}
        >
          <div className="flex items-center space-x-3">
            <Layers className={`w-4 h-4 ${currentTab === 'admin' ? 'text-white' : 'text-secondary'}`} />
            <span>Platform Admin</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
