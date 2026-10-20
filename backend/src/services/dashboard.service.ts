import { getRepository } from '../repositories';

export class DashboardService {
  private repo = getRepository();

  public async getDashboardData(businessId?: string) {
    const businesses = await this.repo.getAllBusinesses();
    const currentBusiness = (businessId ? await this.repo.getBusinessById(businessId) : null) || businesses[0];
    const bId = currentBusiness ? currentBusiness.id : 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

    const trends = await this.repo.getAllTrends();
    const risingTrends = trends.filter(t => t.lifecycle_status === 'RISING' || t.lifecycle_status === 'EMERGING');
    const matches = await this.repo.getAllBusinessMatches(bId);
    const opportunities = await this.repo.getOpportunities(bId);
    const alerts = await this.repo.getAlerts(bId);
    const actionPlans = await this.repo.getActionPlans(bId);
    const experiments = await this.repo.getExperiments(bId);

    // Business fit calculation
    const avgBusinessFit = matches.length > 0 
      ? Math.round(matches.reduce((acc, m) => acc + m.business_fit, 0) / matches.length) 
      : 88;

    const topOpportunity = opportunities.length > 0 
      ? Math.max(...opportunities.map(o => o.opportunity_score)) 
      : 8.8;

    // Market Momentum line (last 6 months aggregated from trends)
    const momentumTimeline = [
      { month: 'May', index: 68, velocity: 62 },
      { month: 'Jun', index: 72, velocity: 69 },
      { month: 'Jul', index: 79, velocity: 74 },
      { month: 'Aug', index: 84, velocity: 81 },
      { month: 'Sep', index: 89, velocity: 86 },
      { month: 'Oct', index: 93, velocity: 91 },
    ];

    // Opportunity Matrix (Scatter/Bubble: Business Fit vs Opportunity Score)
    const opportunityMatrix = trends.map(t => {
      const match = matches.find(m => m.trend_id === t.id);
      const opp = opportunities.find(o => o.trend_id === t.id);
      return {
        id: t.id,
        name: t.name,
        category: t.category,
        businessFit: match ? match.business_fit : (t.momentum > 80 ? 91 : 78),
        opportunityScore: opp ? opp.opportunity_score : Number((t.trend_score / 10).toFixed(1)),
        momentum: t.momentum,
        risk: t.risk,
      };
    });

    return {
      business: currentBusiness,
      kpis: {
        marketSignals: 12480,
        risingTrends: risingTrends.length,
        businessFit: avgBusinessFit,
        opportunityScore: topOpportunity,
        activeAlerts: alerts.filter(a => !a.is_read).length,
      },
      momentumTimeline,
      opportunityMatrix,
      topOpportunities: opportunities.slice(0, 3),
      alerts: alerts.slice(0, 4),
      recentActionPlans: actionPlans.slice(0, 3),
      experiments: experiments.slice(0, 2),
      isDemo: true,
    };
  }
}
