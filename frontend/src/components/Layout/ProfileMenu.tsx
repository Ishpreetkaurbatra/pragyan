import React, { useEffect, useRef } from 'react';
import { 
  User, 
  Sparkles, 
  Compass, 
  FileText, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  BotMessageSquare, 
  SlidersHorizontal, 
  LogOut, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { UserRole } from '../../types';

export interface ProfileMenuUser {
  name: string;
  title: string;
  initials: string;
  email: string;
  businessName?: string;
  category?: string;
}

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
  activeUser: ProfileMenuUser;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

interface MenuItemDef {
  id: string;
  label: string;
  tab: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  isLogout?: boolean;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  currentTab,
  onNavigate,
  onLogout,
  activeUser,
  currentRole,
  onRoleChange,
  triggerRef,
}) => {
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // The Profile menu must contain ONLY these 10 items:
  // 1. My Profile
  // 2. Trend Finder
  // 3. Explore Trends
  // 4. Action Plans
  // 5. Expert Validation
  // 6. Growth Tracking
  // 7. Help & Support
  // 8. AI Chatbot
  // 9. Settings
  // 10. Logout
  const menuItems: MenuItemDef[] = [
    {
      id: 'my-profile',
      label: 'My Profile',
      tab: 'profile',
      icon: User,
    },
    {
      id: 'trend-finder',
      label: 'Trend Finder',
      tab: 'trend-finder',
      icon: Sparkles,
      badge: 'Reels',
      badgeColor: 'bg-warningbg text-warningorange',
    },
    {
      id: 'explore-trends',
      label: 'Explore Trends',
      tab: 'explore-trends',
      icon: Compass,
    },
    {
      id: 'action-plans',
      label: 'Action Plans',
      tab: 'action-plans',
      icon: FileText,
    },
    {
      id: 'expert-validation',
      label: 'Expert Validation',
      tab: 'expert-validation',
      icon: ShieldCheck,
    },
    {
      id: 'growth-tracking',
      label: 'Growth Tracking',
      tab: 'growth-tracking',
      icon: TrendingUp,
    },
    {
      id: 'help-support',
      label: 'Help & Support',
      tab: 'help-support',
      icon: HelpCircle,
    },
    {
      id: 'ai-chatbot',
      label: 'AI Chatbot',
      tab: 'ask-tg',
      icon: BotMessageSquare,
      badge: 'AI',
      badgeColor: 'bg-lightgreen text-darkgreen',
    },
    {
      id: 'settings',
      label: 'Settings',
      tab: 'settings',
      icon: SlidersHorizontal,
    },
    {
      id: 'logout',
      label: 'Logout',
      tab: 'welcome',
      icon: LogOut,
      isLogout: true,
    },
  ];

  // Outside click & Escape key listener for desktop popover & mobile backdrop
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Do not close if clicking the toggle trigger button itself
      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }

      // Check desktop popover
      const isInsideDesktop = desktopMenuRef.current && desktopMenuRef.current.contains(target);
      // Check mobile drawer
      const isInsideMobile = mobileMenuRef.current && mobileMenuRef.current.contains(target);

      if (!isInsideDesktop && !isInsideMobile) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleItemClick = (item: MenuItemDef) => {
    if (item.isLogout) {
      onLogout();
    } else {
      onNavigate(item.tab);
    }
    onClose();
  };

  const isTabActive = (itemTab: string) => {
    if (itemTab === 'growth-tracking') {
      return currentTab === 'growth-tracking' || currentTab === 'experiments';
    }
    if (itemTab === 'settings') {
      return currentTab === 'settings' || currentTab === 'admin';
    }
    if (itemTab === 'ask-tg') {
      return currentTab === 'ask-tg' || currentTab === 'chatbot';
    }
    if (itemTab === 'help-support') {
      return currentTab === 'help-support' || currentTab === 'help';
    }
    return currentTab === itemTab;
  };

  return (
    <>
      {/* ========================================================
          1. LAPTOP / DESKTOP DROPDOWN (Visible on md: and above)
          Appears near the circular profile icon, light-dismissable
          ======================================================== */}
      <div
        ref={desktopMenuRef}
        role="menu"
        aria-label="Profile navigation menu"
        className="hidden md:block absolute right-0 top-full mt-2.5 w-76 sm:w-80 rounded-[26px] glass-panel bg-white/95 backdrop-blur-2xl p-2.5 shadow-glass-hover border border-white/90 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* User Card Header */}
        <div className="p-3 mb-1.5 rounded-2xl bg-gradient-to-br from-white/90 to-slate-50/80 border border-white/90 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primaryblue via-secondaryblue to-growthgreen flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white flex-shrink-0">
            {activeUser.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-extrabold text-xs text-navy truncate">
                {activeUser.name}
              </h4>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-lightblue text-darkblue tracking-wider">
                {currentRole}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {activeUser.title}
            </p>
            <p className="text-[10px] text-slate-400 font-mono truncate">
              {activeUser.email}
            </p>
          </div>
        </div>

        {/* The 10 Profile Navigation Items */}
        <div className="space-y-0.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isTabActive(item.tab);

            if (item.isLogout) {
              return (
                <div key={item.id} className="pt-1.5 mt-1.5 border-t border-slate-100/90">
                  <button
                    onClick={() => handleItemClick(item)}
                    role="menuitem"
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-red-50 text-red-500 group-hover:bg-red-100 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-red-300 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                role="menuitem"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  active
                    ? 'bg-gradient-to-r from-lightblue to-lightgreen text-darkblue font-bold shadow-xs border border-primaryblue/20'
                    : 'text-slate-600 hover:text-navy hover:bg-slate-50/90'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    active 
                      ? 'bg-white text-primaryblue shadow-xs' 
                      : 'bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-primaryblue'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="leading-tight">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    active ? 'text-primaryblue translate-x-0.5' : 'text-slate-300 group-hover:text-primaryblue group-hover:translate-x-0.5'
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. MOBILE PANEL / DRAWER (Visible on md:hidden)
          Mobile-friendly, vertically scrollable, with Back/Close
          ======================================================== */}
      <div 
        className="md:hidden fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-sm animate-in fade-in duration-200"
        aria-modal="true"
        role="dialog"
        aria-label="Profile navigation panel"
      >
        <div
          ref={mobileMenuRef}
          className="w-full max-w-xs sm:max-w-sm h-full glass-panel bg-white/98 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-white/90 animate-in slide-in-from-right duration-250"
        >
          {/* Mobile Header: Back / Close Controls */}
          <div className="p-4 border-b border-slate-100/90 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl glass-card text-xs font-bold text-slate-600 hover:text-navy cursor-pointer"
              aria-label="Back to application"
            >
              <ChevronLeft className="w-4 h-4 text-primaryblue" />
              <span>Back</span>
            </button>

            <span className="font-display font-extrabold text-sm text-navy">
              Profile & Actions
            </span>

            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-card text-slate-500 hover:text-navy cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-4 bg-gradient-to-br from-white to-slate-50/90 border-b border-slate-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primaryblue via-secondaryblue to-growthgreen flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-white flex-shrink-0">
                {activeUser.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-display font-extrabold text-sm text-navy truncate">
                    {activeUser.name}
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-lightblue text-darkblue tracking-wider">
                    {currentRole}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {activeUser.title}
                </p>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  {activeUser.email}
                </p>
              </div>
            </div>

            {/* Persona Switcher Quick Pill inside Mobile Drawer for easy demo role test */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Active Persona:
              </span>
              <div className="flex items-center space-x-1">
                {(['BUSINESS', 'EXPERT', 'ADMIN'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(r)}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all ${
                      currentRole === r
                        ? 'bg-primaryblue text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {r === 'BUSINESS' ? 'Business' : r === 'EXPERT' ? 'Expert' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vertically Scrollable 10 Profile Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
            <div className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Profile Menu
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isTabActive(item.tab);

              if (item.isLogout) {
                return (
                  <div key={item.id} className="pt-3 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleItemClick(item)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-100 transition-all cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-xl bg-red-100/70 text-red-600">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                    active
                      ? 'bg-gradient-to-r from-lightblue to-lightgreen text-darkblue font-bold shadow-soft-glass border border-primaryblue/20'
                      : 'text-slate-700 hover:bg-slate-50/90 glass-card border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      active
                        ? 'bg-white text-primaryblue shadow-xs'
                        : 'bg-white/80 text-slate-500 shadow-xs'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-primaryblue' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Footer Note */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50/50 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              T→G Intelligence Platform • Soft Glass 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
