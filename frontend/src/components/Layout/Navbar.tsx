import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Bell, 
  Building2, 
  User, 
  SlidersHorizontal, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X, 
  Clock, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api/client';
import { UserRole, Alert } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, unreadAlertsCount }) => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [alertsMenuOpen, setAlertsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  const accountRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);

  const currentRole = api.getActiveRole();

  const roleNameMap: Record<UserRole, { name: string; title: string; initials: string; email: string }> = {
    BUSINESS: {
      name: 'Gayatri Patil',
      title: 'Business Owner • FreshBite Café',
      initials: 'GP',
      email: 'gayatri@freshbite.cafe'
    },
    EXPERT: {
      name: 'Rajesh Kulkarni',
      title: 'Retail & Hospitality Strategist',
      initials: 'RK',
      email: 'rajesh@stratgrowth.in'
    },
    ADMIN: {
      name: 'Platform Admin',
      title: 'System Telemetry & Platform Ops',
      initials: 'PA',
      email: 'admin@t-to-g.intelligence'
    }
  };

  const activeUser = roleNameMap[currentRole] || roleNameMap.BUSINESS;

  useEffect(() => {
    // Load top alerts for dropdown
    api.getAlerts(true)
      .then(data => setRecentAlerts(data.slice(0, 4)))
      .catch(() => {});
  }, [unreadAlertsCount]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountMenuOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(target)) {
        setAlertsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    api.setActiveRole('BUSINESS');
    setCurrentTab('welcome');
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel !border-t-0 !rounded-t-none border-b border-white/80 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-200">
      <div className="flex items-center justify-between max-w-[1720px] mx-auto">
        
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setCurrentTab('trend-finder')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primaryblue via-secondaryblue to-growthgreen flex items-center justify-center text-white shadow-md shadow-primaryblue/20 flex-shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-textmain">
                T<span className="text-primaryblue">→</span><span className="text-growthgreen">G</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lightgreen text-darkgreen border border-growthgreen/20">
                TREND INTELLIGENCE
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-secondary font-medium tracking-wide">
              Market Signals • Commercial Action Plans • Growth
            </p>
          </div>
        </div>

        {/* Center: Fast Access Link to Trend Finder */}
        <div className="hidden lg:flex items-center space-x-2">
          <button
            onClick={() => setCurrentTab('trend-finder')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center space-x-2 cursor-pointer ${
              currentTab === 'trend-finder'
                ? 'bg-primaryblue text-white shadow-sm'
                : 'text-secondary hover:text-navy hover:bg-white/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trend Finder Reels</span>
          </button>
        </div>

        {/* Right Section: Smart Alerts + Business Context + Account Avatar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          
          {/* Smart Alerts Dropdown Button */}
          <div className="relative" ref={alertsRef}>
            <button
              onClick={() => {
                setAlertsMenuOpen(prev => !prev);
                setAccountMenuOpen(false);
              }}
              className="relative p-2.5 rounded-2xl glass-card text-secondary hover:text-textmain transition-all cursor-pointer"
              title="Smart Alerts"
              aria-label="Smart Alerts"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-warningorange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Compact Smart Alerts Popover */}
            {alertsMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl glass-panel bg-white/95 backdrop-blur-2xl p-4 shadow-glass-hover border border-white/90 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Bell className="w-4 h-4 text-warningorange" />
                    <span className="font-display font-extrabold text-xs text-navy uppercase tracking-wider">
                      Smart Alerts
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-warningbg text-warningorange">
                    {unreadAlertsCount} New
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        onClick={() => {
                          setCurrentTab('trend-finder');
                          setAlertsMenuOpen(false);
                        }}
                        className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-white/80 transition-all cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                          <span className="text-warningorange">{alert.severity}</span>
                          <span className="text-slate-400">Just now</span>
                        </div>
                        <p className="text-xs font-bold text-navy leading-snug">
                          {alert.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {alert.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No unread alerts at this moment.
                    </div>
                  )}
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primaryblue">
                  <button
                    onClick={() => {
                      setCurrentTab('alerts');
                      setAlertsMenuOpen(false);
                    }}
                    className="hover:underline flex items-center space-x-1"
                  >
                    <span>View All Alerts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Business Context Pill (Desktop only) */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-2xl glass-card text-xs font-semibold text-textmain cursor-pointer hover:bg-white"
            title="Business Context"
          >
            <Building2 className="w-4 h-4 text-primaryblue" />
            <span>FreshBite Café</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-lightblue text-darkblue uppercase">F&B</span>
          </button>

          {/* Compact Top-Right Profile / Account Avatar */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => {
                setAccountMenuOpen(prev => !prev);
                setAlertsMenuOpen(false);
              }}
              aria-label="Account Menu"
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm text-white bg-gradient-to-tr from-primaryblue via-secondaryblue to-growthgreen shadow-sm ring-2 transition-all cursor-pointer relative flex-shrink-0 select-none ${
                accountMenuOpen
                  ? 'ring-primaryblue ring-offset-2 ring-offset-white shadow-md scale-105'
                  : 'ring-white/90 hover:ring-primaryblue/60'
              }`}
            >
              <span>{activeUser.initials}</span>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-growthgreen border-2 border-white rounded-full"></span>
            </button>

            {/* Compact Account Menu (ONLY My Profile, Settings, Logout) */}
            {accountMenuOpen && (
              <div 
                role="menu"
                className="absolute right-0 mt-2.5 w-64 rounded-3xl glass-panel bg-white/95 backdrop-blur-2xl p-2.5 shadow-glass-hover border border-white/90 z-50 animate-in fade-in slide-in-from-top-2"
              >
                {/* User Header */}
                <div className="p-3 mb-1.5 rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-white/90 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primaryblue to-growthgreen flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {activeUser.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-extrabold text-xs text-navy truncate">
                      {activeUser.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      {activeUser.title}
                    </p>
                  </div>
                </div>

                {/* Only 3 Actions: My Profile, Settings, Logout */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setAccountMenuOpen(false);
                    }}
                    role="menuitem"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-lightblue text-primaryblue">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span>My Profile</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('settings');
                      setAccountMenuOpen(false);
                    }}
                    role="menuitem"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </div>
                      <span>Settings</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  </button>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
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
            )}
          </div>

          {/* Mobile Menu Trigger Button (Visible on md:hidden) */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-2xl glass-card text-secondary hover:text-textmain transition-all cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Visible when mobileMenuOpen is true) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xs h-full glass-panel bg-white/98 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-white/90 animate-in slide-in-from-right duration-250 p-5 space-y-4">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-display font-extrabold text-sm text-navy">
                Trend Intelligence
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl glass-card text-slate-500 hover:text-navy cursor-pointer"
                aria-label="Close Navigation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primaryblue to-growthgreen flex items-center justify-center text-white font-bold text-sm">
                {activeUser.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-xs text-navy truncate">{activeUser.name}</h4>
                <p className="text-[10px] text-slate-500 truncate">{activeUser.title}</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto space-y-1 text-xs font-semibold">
              <div className="text-[10px] font-extrabold uppercase text-muted px-2 pt-2">
                Trend Intelligence
              </div>
              <button
                onClick={() => { setCurrentTab('trend-finder'); setMobileMenuOpen(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-2 ${currentTab === 'trend-finder' ? 'bg-primaryblue text-white font-bold' : 'hover:bg-slate-50'}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Trend Finder</span>
              </button>
              <button
                onClick={() => { setCurrentTab('explore-trends'); setMobileMenuOpen(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-2 ${currentTab === 'explore-trends' ? 'bg-primaryblue text-white font-bold' : 'hover:bg-slate-50'}`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Explore Trends</span>
              </button>

              <div className="text-[10px] font-extrabold uppercase text-muted px-2 pt-3">
                Business Action
              </div>
              <button
                onClick={() => { setCurrentTab('action-plans'); setMobileMenuOpen(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-2 ${currentTab === 'action-plans' ? 'bg-primaryblue text-white font-bold' : 'hover:bg-slate-50'}`}
              >
                <Building2 className="w-4 h-4" />
                <span>Action Plans</span>
              </button>
              <button
                onClick={() => { setCurrentTab('expert-validation'); setMobileMenuOpen(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-2 ${currentTab === 'expert-validation' ? 'bg-primaryblue text-white font-bold' : 'hover:bg-slate-50'}`}
              >
                <Building2 className="w-4 h-4" />
                <span>Expert Validation</span>
              </button>
              <button
                onClick={() => { setCurrentTab('growth-tracking'); setMobileMenuOpen(false); }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-2 ${currentTab === 'growth-tracking' ? 'bg-primaryblue text-white font-bold' : 'hover:bg-slate-50'}`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Growth Tracking</span>
              </button>

              <div className="text-[10px] font-extrabold uppercase text-muted px-2 pt-3">
                Support
              </div>
              <button
                onClick={() => { setCurrentTab('help-support'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-xl flex items-center space-x-2 hover:bg-slate-50"
              >
                <span>Help & Support</span>
              </button>
              <button
                onClick={() => { setCurrentTab('ask-tg'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-xl flex items-center space-x-2 hover:bg-slate-50"
              >
                <span>AI Chatbot</span>
              </button>

              <div className="text-[10px] font-extrabold uppercase text-muted px-2 pt-3">
                Account
              </div>
              <button
                onClick={() => { setCurrentTab('profile'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-xl flex items-center space-x-2 hover:bg-slate-50"
              >
                <span>My Profile</span>
              </button>
              <button
                onClick={() => { setCurrentTab('settings'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-xl flex items-center space-x-2 hover:bg-slate-50"
              >
                <span>Settings</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full p-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
