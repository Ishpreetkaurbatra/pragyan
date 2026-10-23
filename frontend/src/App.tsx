import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { NotificationBell } from './components/Layout/NotificationBell';
import { WelcomePage } from './pages/WelcomePage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TrendFinderPage } from './pages/TrendFinderPage';
import { ExploreTrendsPage } from './pages/ExploreTrendsPage';
import { TrendDetailsPage } from './pages/TrendDetailsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ActionPlansPage } from './pages/ActionPlansPage';
import { ExpertValidationPage } from './pages/ExpertValidationPage';
import { ExperimentCenterPage } from './pages/ExperimentCenterPage';
import { AlertsPage } from './pages/AlertsPage';
import { AskTGPage } from './pages/AskTGPage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { LoginPage } from './pages/LoginPage';
import { Trend, Opportunity, ActionPlan } from './types';
import { api } from './services/api/client';

const getInitialTab = (): string => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      return hash;
    }
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      return tabParam;
    }
  }
  return 'welcome';
};

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(2);
  const [pendingReviewsCount, setPendingReviewsCount] = useState<number>(1);

  // Synchronize hash with current tab for persistent URL & refresh support
  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      if (tab === 'welcome') {
        if (window.location.hash && window.location.hash !== '#' && window.location.hash !== '#welcome') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        window.location.hash = `#${tab}`;
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash) {
        setCurrentTab(hash);
      } else {
        setCurrentTab('welcome');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    loadBadgeCounts();
  }, [currentTab]);

  const loadBadgeCounts = async () => {
    try {
      const alerts = await api.getAlerts(true);
      setUnreadAlertsCount(alerts.length);
      const reviews = await api.getExpertReviews('pending');
      setPendingReviewsCount(reviews.length);
    } catch (e) {
      // Ignore background badge errors
    }
  };

  useEffect(() => {
    // If user lands on trend-details directly without a selectedTrend in memory, load a default
    if (currentTab === 'trend-details' && !selectedTrend) {
      api.getTrends().then(trends => {
        if (trends && trends.length > 0) {
          setSelectedTrend(trends[0]);
        } else {
          navigateTo('trend-finder');
        }
      }).catch(() => {
        navigateTo('trend-finder');
      });
    }
  }, [currentTab, selectedTrend]);

  const handleSelectTrend = (trend: Trend) => {
    setSelectedTrend(trend);
    navigateTo('trend-details');
  };

  const handleGeneratePlan = (trend: Trend) => {
    navigateTo('action-plans');
  };

  const handleGeneratePlanFromOpp = (opp: Opportunity) => {
    navigateTo('action-plans');
  };

  const handleLaunchExperiment = (plan: ActionPlan) => {
    navigateTo('growth-tracking');
  };

  const handleLogout = () => {
    api.setActiveRole('BUSINESS');
    navigateTo('welcome');
  };

  return (
    <div className="min-h-screen ambient-bg flex flex-col selection:bg-growth-100 selection:text-growth-800 relative">
      {/* Top-Right Floating Notification Bell (Smart Alerts) */}
      {currentTab !== 'welcome' && currentTab !== 'login' && (
        <NotificationBell
          currentTab={currentTab}
          onNavigate={navigateTo}
          unreadCount={unreadAlertsCount}
          onCountChange={setUnreadAlertsCount}
        />
      )}

      {/* Main Workspace Layout */}
      {currentTab === 'welcome' ? (
        <WelcomePage onStart={() => navigateTo('login')} />
      ) : currentTab === 'login' ? (
        <LoginPage 
          onLoginSuccess={(role) => navigateTo('trend-finder')} 
          onNavigateHome={() => navigateTo('welcome')} 
        />
      ) : (
        <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
          {/* Persistent Profile / Business Context Sidebar on desktop/laptop */}
          {currentTab !== 'landing' && (
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={navigateTo}
              unreadAlertsCount={unreadAlertsCount}
              pendingReviewsCount={pendingReviewsCount}
              onLogout={handleLogout}
            />
          )}

          {/* Dynamic Main Page Content - Expands naturally beside Profile panel */}
          <main className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 transition-all duration-150 ${currentTab === 'landing' ? 'w-full' : ''}`}>
            {currentTab === 'landing' && (
              <LandingPage 
                onGetStarted={() => navigateTo('trend-finder')} 
                onSignIn={() => navigateTo('login')}
                onExploreTrends={() => navigateTo('trend-finder')} 
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardPage 
                onNavigate={navigateTo} 
                onSelectTrend={handleSelectTrend} 
              />
            )}

            {currentTab === 'trend-finder' && (
              <TrendFinderPage 
                onSelectTrend={handleSelectTrend} 
                onGeneratePlan={handleGeneratePlan} 
                onNavigateTab={navigateTo}
              />
            )}

            {currentTab === 'explore-trends' && (
              <ExploreTrendsPage 
                onSelectTrend={handleSelectTrend} 
                onGeneratePlan={handleGeneratePlan} 
                onNavigateTab={navigateTo}
              />
            )}

            {currentTab === 'rising-trends' && (
              <ExploreTrendsPage 
                initialFilter="All"
                onSelectTrend={handleSelectTrend} 
                onGeneratePlan={handleGeneratePlan} 
                onNavigateTab={navigateTo}
              />
            )}

            {currentTab === 'trend-details' && selectedTrend && (
              <TrendDetailsPage 
                trend={selectedTrend} 
                onBack={() => navigateTo('trend-finder')} 
                onGeneratePlan={handleGeneratePlan} 
                onNavigateTab={navigateTo}
              />
            )}

            {currentTab === 'opportunities' && (
              <OpportunitiesPage 
                onGeneratePlanFromOpp={handleGeneratePlanFromOpp} 
              />
            )}

            {currentTab === 'action-plans' && (
              <ActionPlansPage 
                onLaunchExperiment={handleLaunchExperiment} 
                onNavigateTab={navigateTo}
              />
            )}

            {currentTab === 'expert-validation' && (
              <ExpertValidationPage 
                onNavigateTab={navigateTo}
              />
            )}

            {(currentTab === 'experiments' || currentTab === 'growth-tracking') && (
              <ExperimentCenterPage 
                onNavigateTab={navigateTo}
              />
            )}

            {currentTab === 'alerts' && (
              <AlertsPage />
            )}

            {(currentTab === 'ask-tg' || currentTab === 'chatbot') && (
              <AskTGPage />
            )}

            {currentTab === 'profile' && (
              <BusinessProfilePage />
            )}

            {(currentTab === 'admin' || currentTab === 'settings') && (
              <AdminDashboardPage />
            )}

            {(currentTab === 'help-support' || currentTab === 'help') && (
              <HelpSupportPage onNavigate={navigateTo} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
