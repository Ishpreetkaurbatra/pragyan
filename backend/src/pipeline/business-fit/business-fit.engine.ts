import { BusinessContext, TrendCluster, BusinessFit } from '../../models/intelligence-pipeline.types';

export class BusinessFitEngine {
  /**
   * Deterministically calculates multidimensional business fit between a business context and a trend.
   * Calculated purely in backend code.
   */
  public calculateFit(business: BusinessContext, cluster: TrendCluster, locationRelevanceScore: number = 80): BusinessFit {
    const reasons: string[] = [];

    // 1. Category Fit (20% weight)
    let categoryFit = 60; // baseline neutral
    const bIndustry = (business.industry || '').toLowerCase();
    const bType = (business.businessType || '').toLowerCase();
    const cCategory = (cluster.category || '').toLowerCase();

    if (bIndustry.includes(cCategory) || cCategory.includes(bIndustry)) {
      categoryFit = 95;
      reasons.push(`Direct industry category alignment with ${cluster.category}`);
    } else if (
      (bType.includes('cafe') || bType.includes('restaurant')) &&
      cCategory.includes('food')
    ) {
      categoryFit = 92;
      reasons.push(`Hospitality and cafe menu match for ${cluster.category}`);
    } else if (
      (bType.includes('retail') || bType.includes('store')) &&
      cCategory.includes('retail')
    ) {
      categoryFit = 90;
      reasons.push(`Retail shelf match for ${cluster.category}`);
    } else if (
      business.preferredCategories?.some(pc => pc.toLowerCase() === cCategory)
    ) {
      categoryFit = 95;
      reasons.push(`Matches business preferred category preference: ${cluster.category}`);
    } else {
      categoryFit = 50;
    }

    // 2. Product Fit (20% weight)
    let productFit = 55;
    const bProducts = (business.products || []).map(p => p.toLowerCase());
    const cTokens = cluster.primaryKeywords.map(k => k.toLowerCase());
    const clusterNameTokens = cluster.name.toLowerCase().split(/\s+/);

    let productMatches = 0;
    for (const prod of bProducts) {
      if (
        clusterNameTokens.some(ct => prod.includes(ct) || ct.includes(prod)) ||
        cTokens.some(tok => prod.includes(tok) || tok.includes(prod))
      ) {
        productMatches++;
      }
    }

    if (productMatches > 0) {
      productFit = Math.min(95, 75 + (productMatches * 10));
      reasons.push(`Strong synergy with existing products (${business.products?.slice(0, 3).join(', ')})`);
    } else if (categoryFit >= 90) {
      productFit = 72; // complementary addition
      reasons.push(`Complementary catalog addition to existing offerings`);
    } else {
      productFit = 45;
    }

    // 3. Customer Fit (20% weight)
    let customerFit = 60;
    const targets = (business.targetCustomers || []).map(t => t.toLowerCase());
    const isYouthOrStudent = targets.some(t => t.includes('student') || t.includes('college') || t.includes('youth') || t.includes('young'));
    const isProfessional = targets.some(t => t.includes('professional') || t.includes('office') || t.includes('corporate') || t.includes('tech'));

    if (cluster.name.includes('Matcha') || cluster.name.includes('Cold Brew')) {
      if (isYouthOrStudent || isProfessional) {
        customerFit = 94;
        reasons.push('High demographic affinity among students and young professionals');
      } else {
        customerFit = 70;
      }
    } else if (cluster.name.includes('Protein') || cluster.name.includes('Fitness')) {
      const isHealth = targets.some(t => t.includes('gym') || t.includes('fitness') || t.includes('health'));
      if (isHealth || isYouthOrStudent || isProfessional) {
        customerFit = 92;
        reasons.push('Matches active lifestyle and fitness-oriented customer base');
      } else {
        customerFit = 68;
      }
    } else if (cluster.name.includes('AI Productivity')) {
      if (isProfessional) {
        customerFit = 96;
        reasons.push('Direct match for professionals and technical teams');
      } else {
        customerFit = 55;
      }
    } else {
      customerFit = 75;
    }

    // 4. Location Fit (15% weight)
    // Directly bound to Location relevance score (100 = city match, 80 = state match, etc.)
    const locationFit = Math.round(locationRelevanceScore);
    if (locationRelevanceScore >= 95) {
      reasons.push(`Verified hyper-local momentum in ${business.city}`);
    } else if (locationRelevanceScore >= 75) {
      reasons.push(`Strong regional adoption across ${business.state || 'nearby hubs'}`);
    } else {
      reasons.push('National trend with opportunity for early local first-mover advantage');
    }

    // 5. Goal Fit (15% weight)
    let goalFit = 70;
    const goals = (business.businessGoals || []).map(g => g.toLowerCase());
    if (goals.some(g => g.includes('increase sales') || g.includes('revenue') || g.includes('grow'))) {
      if (cluster.trendScore.growthScore >= 70) {
        goalFit = 92;
        reasons.push('High velocity supports near-term revenue expansion goals');
      } else {
        goalFit = 80;
      }
    } else if (goals.some(g => g.includes('discover') || g.includes('new product') || g.includes('innovat'))) {
      goalFit = 90;
      reasons.push('Provides high-demand new product innovation');
    }

    // 6. Timing Fit (10% weight)
    let timingFit = 75;
    switch (cluster.lifecycle) {
      case 'RISING':
        timingFit = 96;
        reasons.push('Optimal commercial timing: Trend is rapidly rising before mass saturation');
        break;
      case 'EMERGING':
        timingFit = 88;
        reasons.push('Early timing: Ground floor emergence with low initial competition');
        break;
      case 'VALIDATED':
        timingFit = 90;
        reasons.push('Proven commercial timing: Multi-source validated customer demand');
        break;
      case 'PEAKING':
        timingFit = 65;
        reasons.push('Mature timing: High existing volume, expect heavier competitive pressure');
        break;
      case 'COOLING':
      case 'DECLINING':
        timingFit = 40;
        reasons.push('Late timing: Waning velocity, exercise caution');
        break;
      default:
        timingFit = 75;
    }

    // Total composite business fit score (0 - 100)
    const totalScore = Math.round(
      categoryFit * 0.20 +
      productFit * 0.20 +
      customerFit * 0.20 +
      locationFit * 0.15 +
      goalFit * 0.15 +
      timingFit * 0.10
    );

    return {
      categoryFit,
      customerFit,
      locationFit,
      productFit,
      goalFit,
      timingFit,
      totalScore: Math.max(1, Math.min(100, totalScore)),
      reasons,
    };
  }
}
