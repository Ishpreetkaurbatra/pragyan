import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  BotMessageSquare, 
  SlidersHorizontal, 
  LogOut, 
  User, 
  Building2, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api/client';
import { Business, Profile, UserRole } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadAlertsCount?: number;
  pendingReviewsCount?: number;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onLogout,
}) => {
  const currentRole = api.getActiveRole();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);

  const personaDefaults: Record<UserRole, { name: string; title: string; initials: string; businessName: string; category: string }> = {
    BUSINESS: {
      name: 'Gayatri Patil',
      title: 'Business Owner',
      initials: 'GP',
      businessName: 'FreshBite Café',
      category: 'Food & Beverage'
    },
    EXPERT: {
      name: 'Rajesh Kulkarni',
      title: 'Retail & Hospitality Strategist',
      initials: 'RK',
      businessName: 'FreshBite Advisory',
      category: 'Commercial Strategy'
    },
    ADMIN: {
      name: 'Platform Admin',
      title: 'System Telemetry & Platform Ops',
      initials: 'PA',
      businessName: 'T→G Mission Control',
      category: 'System Telemetry'
    }
  };

  const currentPersona = personaDefaults[currentRole] || personaDefaults.BUSINESS;

  useEffect(() => {
    let isMounted = true;
    api.getBusinessProfile()
      .then(res => {
        if (isMounted) {
          if (res.profile) setProfile(res.profile);
          if (res.business) setBusiness(res.business);
        }
      })
      .catch(() => {
        // graceful offline/demo fallback
      });

    return () => {
      isMounted = false;
    };
  }, [currentRole]);

  const userName = profile?.full_name || currentPersona.name;
  const userTitle = currentRole === 'BUSINESS' ? 'Business Owner' : currentPersona.title;
  const initials = currentPersona.initials;
  const businessName = business?.business_name || currentPersona.businessName;
  const businessCategory = business?.industry || currentPersona.category;
  const location = business?.location || 'Sangamner / Pune Suburban Corridor';

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      api.setActiveRole('BUSINESS');
      setCurrentTab('welcome');
    }
  };

  const isTabActive = (tab: string) => {
    if (tab === 'growth-tracking') return currentTab === 'growth-tracking' || currentTab === 'experiments';
    if (tab === 'ask-tg') return currentTab === 'ask-tg' || currentTab === 'chatbot';
    if (tab === 'settings') return currentTab === 'settings' || currentTab === 'admin';
    if (tab === 'help-support') return currentTab === 'help-support' || currentTab === 'help';
    return currentTab === tab;
  };

  const navButton = (tab: string, label: string, Icon: React.FC<{ className?: string }>, badge?: string) => {
    const active = isTabActive(tab);
    return (
      <button
        onClick={() => setCurrentTab(tab)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          active
            ? 'bg-gradient-to-r from-lightblue to-lightgreen text-darkblue font-bold shadow-xs border border-primaryblue/20'
            : 'text-slate-600 hover:text-navy hover:bg-white/80'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg transition-colors ${
            active ? 'bg-white text-primaryblue shadow-xs' : 'bg-slate-100 text-slate-500'
          }`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span>{label}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          {badge && (
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-warningbg text-warningorange">
              {badge}
            </span>
          )}
          <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-primaryblue' : 'text-slate-300'}`} />
        </div>
      </button>
    );
  };

  return (
    <aside 
      className="hidden md:block w-64 lg:w-72 xl:w-76 flex-shrink-0 p-4 lg:p-5 space-y-4"
      aria-label="Profile and Navigation Panel"
    >
      <div className="glass-panel p-4 lg:p-5 rounded-[26px] border border-white/85 shadow-soft-glass space-y-4 text-textmain">
        
        {/* ========================================================
            PROFILE AREA
            ======================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100/90 pb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              PROFILE
            </span>
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-lightgreen text-darkgreen border border-growthgreen/20">
              {currentRole}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primaryblue via-secondaryblue to-growthgreen flex items-center justify-center text-white font-extrabold text-base shadow-sm border-2 border-white ring-2 ring-primaryblue/15 overflow-hidden">
                {profile?.avatar_url && currentRole === 'BUSINESS' ? (
                  <img src={profile.avatar_url} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-growthgreen border-2 border-white rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display font-extrabold text-sm text-navy truncate">
                {userName}
              </h3>
              <p className="text-[11px] text-secondary font-medium truncate">
                {userTitle}
              </p>
            </div>
          </div>

          {/* Business Context Mini-Card */}
          <div className="p-3 rounded-2xl bg-white/70 border border-white/90 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-navy truncate flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-primaryblue flex-shrink-0" />
                <span className="truncate">{businessName}</span>
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-lightblue text-darkblue uppercase flex-shrink-0">
                {businessCategory === 'Food & Beverage' ? 'F&B' : businessCategory}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-slate-100" />

        {/* ========================================================
            NAVIGATION GROUPS
            ======================================================== */}
        <div className="space-y-3.5">
          {/* Trend Intelligence */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Trend Intelligence
            </div>
            {navButton('trend-finder', 'Trend Finder', Sparkles, 'Reels')}
            {navButton('explore-trends', 'Explore Trends', Compass)}
          </div>

          {/* Business Action */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Business Action
            </div>
            {navButton('action-plans', 'Action Plans', FileText)}
            {navButton('expert-validation', 'Expert Validation', ShieldCheck)}
            {navButton('growth-tracking', 'Growth Tracking', TrendingUp)}
          </div>

          {/* Support */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Support
            </div>
            {navButton('help-support', 'Help & Support', HelpCircle)}
            {navButton('ask-tg', 'AI Chatbot', BotMessageSquare)}
          </div>

          {/* Account */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Account
            </div>
            {navButton('profile', 'My Profile', User)}
            {navButton('settings', 'Settings', SlidersHorizontal)}

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <span>Logout</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-red-300" />
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
