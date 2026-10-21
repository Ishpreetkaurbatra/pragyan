import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
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
    navigateTo('experiments');
  };

  return (
    <div className="min-h-screen ambient-bg flex flex-col selection:bg-growth-100 selection:text-growth-800">
      {/* Top Navbar for authenticated workspace and classic landing */}
      {currentTab !== 'welcome' && currentTab !== 'login' && (
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={navigateTo} 
          unreadAlertsCount={unreadAlertsCount} 
        />
      )}

      {/* Main Workspace Layout */}
      {currentTab === 'welcome' ? (
        <WelcomePage onStart={() => navigateTo('login')} />
      ) : currentTab === 'login' ? (
        <LoginPage 
          onLoginSuccess={(role) => navigateTo('dashboard')} 
          onNavigateHome={() => navigateTo('welcome')} 
        />
      ) : (
        <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
          {/* Persistent Sidebar for authenticated workspace sections */}
          {currentTab !== 'landing' && (
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={navigateTo}
              unreadAlertsCount={unreadAlertsCount}
              pendingReviewsCount={pendingReviewsCount}
            />
          )}

          {/* Dynamic Main Page Content */}
          <main className={`flex-1 p-6 lg:p-8 transition-all duration-150 ${currentTab === 'landing' ? 'w-full' : ''}`}>
            {currentTab === 'landing' && (
              <LandingPage 
                onGetStarted={() => navigateTo('dashboard')} 
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
              />
            )}

            {currentTab === 'explore-trends' && (
              <ExploreTrendsPage 
                onSelectTrend={handleSelectTrend} 
                onGeneratePlan={handleGeneratePlan} 
              />
            )}

            {currentTab === 'rising-trends' && (
              <ExploreTrendsPage 
                initialFilter="All"
                onSelectTrend={handleSelectTrend} 
                onGeneratePlan={handleGeneratePlan} 
              />
            )}

            {currentTab === 'trend-details' && selectedTrend && (
              <TrendDetailsPage 
                trend={selectedTrend} 
                onBack={() => navigateTo('trend-finder')} 
                onGeneratePlan={handleGeneratePlan} 
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
              />
            )}

            {currentTab === 'expert-validation' && (
              <ExpertValidationPage />
            )}

            {currentTab === 'experiments' && (
              <ExperimentCenterPage />
            )}

            {currentTab === 'alerts' && (
              <AlertsPage />
            )}

            {currentTab === 'ask-tg' && (
              <AskTGPage />
            )}

            {currentTab === 'profile' && (
              <BusinessProfilePage />
            )}

            {currentTab === 'admin' && (
              <AdminDashboardPage />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
