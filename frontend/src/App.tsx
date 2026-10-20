import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
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

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(2);
  const [pendingReviewsCount, setPendingReviewsCount] = useState<number>(1);

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
    setCurrentTab('trend-details');
  };

  const handleGeneratePlan = (trend: Trend) => {
    setCurrentTab('action-plans');
  };

  const handleGeneratePlanFromOpp = (opp: Opportunity) => {
    setCurrentTab('action-plans');
  };

  const handleLaunchExperiment = (plan: ActionPlan) => {
    setCurrentTab('experiments');
  };

  return (
    <div className="min-h-screen ambient-bg flex flex-col selection:bg-growth-100 selection:text-growth-800">
      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        unreadAlertsCount={unreadAlertsCount} 
      />

      {/* Main Workspace Layout - Desktop First */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* Persistent Sidebar for authenticated sections */}
        {currentTab !== 'landing' && currentTab !== 'login' && (
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            unreadAlertsCount={unreadAlertsCount}
            pendingReviewsCount={pendingReviewsCount}
          />
        )}

        {/* Dynamic Main Page Content */}
        <main className={`flex-1 p-6 lg:p-8 transition-all duration-150 ${(currentTab === 'landing' || currentTab === 'login') ? 'w-full' : ''}`}>
          {currentTab === 'landing' && (
            <LandingPage 
              onGetStarted={() => setCurrentTab('dashboard')} 
              onSignIn={() => setCurrentTab('login')}
              onExploreTrends={() => setCurrentTab('trend-finder')} 
            />
          )}

          {currentTab === 'login' && (
            <LoginPage 
              onLoginSuccess={(role) => setCurrentTab('dashboard')} 
              onNavigateHome={() => setCurrentTab('landing')} 
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardPage 
              onNavigate={setCurrentTab} 
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
              onBack={() => setCurrentTab('trend-finder')} 
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
    </div>
  );
}

export default App;
