import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  ChevronDown,
  Cpu,
  Layers,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { api } from '../../services/api/client';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, unreadAlertsCount }) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const currentRole = api.getActiveRole();

  const handleRoleChange = async (role: UserRole) => {
    await api.switchRole(role);
    setRoleMenuOpen(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/80 px-8 py-3.5 transition-all duration-200">
      <div className="flex items-center justify-between max-w-[1720px] mx-auto">
        {/* Brand Logo & Slogan */}
        <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setCurrentTab('landing')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primaryblue via-secondaryblue to-growthgreen flex items-center justify-center text-white shadow-md shadow-primaryblue/20">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-2xl tracking-tight text-textmain">
                T<span className="text-primaryblue">→</span><span className="text-growthgreen">G</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lightgreen text-darkgreen border border-growthgreen/20">
                INTELLIGENCE MODE
              </span>
            </div>
            <p className="text-[11px] text-secondary font-medium tracking-wide">
              Soft Glass. Strong Intelligence. Visible Growth.
            </p>
          </div>
        </div>

        {/* Center Desktop Quick Navigation */}
        <div className="flex items-center space-x-1.5 glass-pill px-4 py-1.5">
          <button
            onClick={() => setCurrentTab('trend-finder')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center space-x-1.5 ${
              currentTab === 'trend-finder' 
                ? 'bg-primaryblue text-white shadow-sm' 
                : 'text-secondary hover:text-textmain hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Trend Finder</span>
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              currentTab === 'dashboard' 
                ? 'bg-primaryblue text-white shadow-sm' 
                : 'text-secondary hover:text-textmain hover:bg-white/50'
            }`}
          >
            Executive Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('opportunities')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              currentTab === 'opportunities' 
                ? 'bg-primaryblue text-white shadow-sm' 
                : 'text-secondary hover:text-textmain hover:bg-white/50'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setCurrentTab('ask-tg')}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center space-x-1.5 ${
              currentTab === 'ask-tg' 
                ? 'bg-primaryblue text-white shadow-sm' 
                : 'text-secondary hover:text-textmain hover:bg-white/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-teal" />
            <span>Ask T→G</span>
          </button>
        </div>

        {/* Right Section: Alerts + Business Context + Sign In + Role Switcher */}
        <div className="flex items-center space-x-3.5">
          {/* Smart Alerts Icon */}
          <button
            onClick={() => setCurrentTab('alerts')}
            className="relative p-2.5 rounded-2xl glass-card text-secondary hover:text-textmain transition-all"
            title="Smart Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-warningorange text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Business Profile Context Pill */}
          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl glass-card text-xs font-semibold text-textmain"
          >
            <Building2 className="w-4 h-4 text-primaryblue" />
            <span>FreshBite Café</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-lightblue text-darkblue uppercase">F&B</span>
          </button>

          {/* Sign In Navigation Button - Prominent High-Contrast */}
          <button
            onClick={() => setCurrentTab('login')}
            className="btn-secondary-blue px-4 py-2 text-xs font-bold shadow-soft-glass flex items-center space-x-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-white" />
            <span>Sign In</span>
          </button>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl glass-card text-xs font-bold text-textmain hover:bg-white transition-all shadow-soft-glass"
            >
              {currentRole === 'BUSINESS' && <UserCheck className="w-4 h-4 text-growthgreen" />}
              {currentRole === 'EXPERT' && <ShieldCheck className="w-4 h-4 text-primaryblue" />}
              {currentRole === 'ADMIN' && <Layers className="w-4 h-4 text-warningorange" />}
              <span className="capitalize">{currentRole.toLowerCase()} Persona</span>
              <ChevronDown className="w-3.5 h-3.5 text-secondary" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-3xl glass-panel bg-white/95 p-2.5 shadow-glass-hover border border-white/90 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted border-b border-slate-100 mb-1.5">
                  Select Persona (Demo Mode)
                </div>
                <button
                  onClick={() => handleRoleChange('BUSINESS')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'BUSINESS' ? 'bg-lightgreen text-darkgreen font-bold' : 'hover:bg-slate-50 text-textmain'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <UserCheck className="w-4 h-4 text-growthgreen" />
                    <div>
                      <div className="leading-tight">Gayatri Patil</div>
                      <div className="text-[10px] text-secondary font-normal">Business Owner</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('EXPERT')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'EXPERT' ? 'bg-lightblue text-darkblue font-bold' : 'hover:bg-slate-50 text-textmain'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-primaryblue" />
                    <div>
                      <div className="leading-tight">Rajesh Kulkarni</div>
                      <div className="text-[10px] text-secondary font-normal">Retail Strategist</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('ADMIN')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    currentRole === 'ADMIN' ? 'bg-warningbg text-warningorange font-bold' : 'hover:bg-slate-50 text-textmain'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Layers className="w-4 h-4 text-warningorange" />
                    <div>
                      <div className="leading-tight">Platform Admin</div>
                      <div className="text-[10px] text-secondary font-normal">System Telemetry</div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
