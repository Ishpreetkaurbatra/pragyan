import {
  IntelligenceProvider,
  TrendAnalysisInput,
  TrendAnalysisOutput,
  ClassificationInput,
  ClassificationOutput,
  SignalSummaryInput,
  SignalSummaryOutput,
  BusinessMatchInput,
  BusinessMatchOutput,
  OpportunityInput,
  OpportunityOutput,
  ActionPlanInput,
  ActionPlanOutput,
  ExperimentAnalysisInput,
  ExperimentAnalysisOutput,
  AskTGoInput,
  AskTGoOutput,
} from './intelligence.interface';

export class MockIntelligenceProvider implements IntelligenceProvider {
  public name = 'mock';

  public async analyzeTrend(input: TrendAnalysisInput): Promise<TrendAnalysisOutput> {
    const { trendContext } = input;
    const momentumVal = typeof trendContext.momentum === 'number' ? trendContext.momentum : 80;
    
    let momentum: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    if (momentumVal >= 80) momentum = 'HIGH';
    else if (momentumVal < 60) momentum = 'LOW';

    return {
      momentum,
      score: Math.min(98, Math.round(momentumVal * 1.05)),
      confidence: 0.88,
      reasoning: `Analysis of multi-source signals indicates a sustained ${momentum.toLowerCase()} momentum for "${trendContext.name}". High social velocity and consistent search volume reflect genuine consumer curiosity rather than a transient spike.`,
      lifecycle: trendContext.lifecycleStatus || 'RISING',
      growthIndicators: [
        'Search query volume +42% over preceding 30 days',
        'Cross-channel mentions in local food communities',
        'High demographic engagement in the 18–28 age bracket',
      ],
      riskFactor: momentumVal > 90 ? 'LOW' : 'MEDIUM',
      evidenceIds: ['sig-search-01', 'sig-social-02', 'sig-delivery-04'],
    };
  }

  public async classifyTrend(input: ClassificationInput): Promise<ClassificationOutput> {
    const text = input.trendName.toLowerCase();
    let category = 'General Business';
    if (text.includes('fries') || text.includes('pizza') || text.includes('bowl') || text.includes('snack')) {
      category = 'Food & Beverage';
    } else if (text.includes('coffee') || text.includes('tea') || text.includes('drink') || text.includes('cooler') || text.includes('matcha')) {
      category = 'Beverages';
    }

    return {
      category,
      tags: ['trending', 'consumer-demand', 'high-margin'],
      relevanceConfidence: 0.92,
    };
  }

  public async summarizeSignals(input: SignalSummaryInput): Promise<SignalSummaryOutput> {
    return {
      summary: `Aggregated ${input.signals.length} market signals for "${input.trendName}". Strong positive affinity observed with high photo/video shareability and strong localized query spikes during afternoon/evening hours.`,
      keyDrivers: ['Value-conscious pricing', 'Visual indulgence / aesthetic appeal', 'Youth hangouts'],
      sentiment: 'POSITIVE',
      sourceDistribution: {
        search: 45,
        social: 35,
        ecommerce: 15,
        news: 5,
      },
    };
  }

  public async matchBusiness(input: BusinessMatchInput): Promise<BusinessMatchOutput> {
    const { businessContext, trendContext } = input;
    const businessName = businessContext.businessName;
    const trendName = trendContext.name;

    // Deterministic heuristic scoring
    const isFood = businessContext.industry.toLowerCase().includes('food') || 
                   businessContext.businessType.toLowerCase().includes('cafe') || 
                   businessContext.businessType.toLowerCase().includes('restaurant');

    const customerOverlap = businessContext.targetCustomers?.toLowerCase().includes('student') || 
                            businessContext.targetCustomers?.toLowerCase().includes('young');

    let customerFit = 85;
    let productFit = 82;
    let locationFit = 84;
    let goalAlignment = 88;
    let budgetFit = 86;

    if (isFood && trendName.toLowerCase().includes('fries')) {
      customerFit = 94;
      productFit = 89;
      locationFit = 87;
      goalAlignment = 95;
      budgetFit = 88;
    } else if (isFood && trendName.toLowerCase().includes('coffee')) {
      customerFit = 92;
      productFit = 94;
      locationFit = 89;
      goalAlignment = 91;
      budgetFit = 90;
    } else if (isFood && trendName.toLowerCase().includes('matcha')) {
      customerFit = 78;
      productFit = 82;
      locationFit = 75;
      goalAlignment = 80;
      budgetFit = 82;
    }

    const businessFit = Math.round(
      (customerFit * 0.25) + 
      (productFit * 0.25) + 
      (locationFit * 0.15) + 
      (goalAlignment * 0.20) + 
      (budgetFit * 0.15)
    );

    return {
      customerFit,
      productFit,
      locationFit,
      goalAlignment,
      budgetFit,
      businessFit,
      risk: businessFit >= 85 ? 'LOW' : 'MEDIUM',
      confidence: 0.89,
      reasoning: `Strong alignment between ${businessName}'s offering and "${trendName}". The demographic preference in ${businessContext.location} closely matches your target segment (${businessContext.targetCustomers || 'college youth'}), making this a rapid-execution opportunity with low upfront inventory overhead.`,
      synergies: [
        'Utilizes existing kitchen equipment and ingredients',
        'Directly targets low-occupancy evening hours',
        'High viral photo appeal for customer word-of-mouth',
      ],
      potentialBottlenecks: [
        'Fryer capacity during peak dinner rush',
        'Maintaining consistent temperature for takeout packaging',
      ],
      evidenceIds: ['sig-geo-01', 'sig-demographics-03'],
    };
  }

  public async generateOpportunity(input: OpportunityInput): Promise<OpportunityOutput> {
    const { businessContext, trendContext } = input;
    const trendName = trendContext.name;

    let title = `${trendName} Quick Launch Test`;
    let potentialAction = `Create a promotional pilot for ${trendName} to test consumer uptake.`;
    let score = 8.5;

    if (trendName.toLowerCase().includes('fries')) {
      title = 'Student Loaded Fries Evening Combo';
      potentialAction = 'Launch a ₹99 student combo between 4–8 PM and test demand for 7 days.';
      score = 8.8;
    } else if (trendName.toLowerCase().includes('matcha')) {
      title = 'Artisan Iced Matcha Wellness Cooler';
      potentialAction = 'Introduce a limited-run 300ml bottled matcha cooler at ₹129 with loyalty points.';
      score = 7.9;
    } else if (trendName.toLowerCase().includes('protein')) {
      title = 'Grab-and-Go Peanut Butter Protein Bites';
      potentialAction = 'Stock counter display boxes with 2-pack protein bites at ₹69 near the register.';
      score = 8.4;
    } else if (trendName.toLowerCase().includes('coffee')) {
      title = 'Vietnamese Sweet Cream Cold Brew';
      potentialAction = 'Feature a specialized layered iced coffee as the Beverage of the Week at ₹119.';
      score = 8.7;
    }

    return {
      title,
      description: `Capitalize on growing local interest in "${trendName}" by offering an accessible trial format tailored to ${businessContext.businessName}'s customers in ${businessContext.location}.`,
      score,
      businessFit: 91,
      risk: 'LOW',
      confidence: 0.88,
      potentialAction,
      estimatedTimeframe: '7-10 days',
      targetCustomerSegment: businessContext.targetCustomers || 'Campus students and young professionals',
      revenuePotential: 'HIGH',
    };
  }

  public async generateActionPlan(input: ActionPlanInput): Promise<ActionPlanOutput> {
    const { businessContext, trendContext } = input;
    const trendName = trendContext.name;

    if (trendName.toLowerCase().includes('fries')) {
      return {
        title: 'Launch ₹99 Student Evening Loaded Fries Combo',
        whyNow: 'Local searches for loaded fries and cheese street foods are up 42% this quarter while evening cafe footfall is currently running at 45% capacity.',
        whyThisBusiness: `${businessContext.businessName} already stocks frozen fries and cheese sauces, and is located strategically near high-density student transit routes.`,
        targetCustomer: 'College students, young engineers, and evening transit commuters (18–26)',
        whatToLaunch: 'Double-fried crispy French fries topped with warm cheddar sauce, spicy mayo drizzle, and crushed jalapenos in branded paper boat packaging.',
        suggestedPrice: '₹99 introductory price point (estimated food cost: ₹34)',
        promotionStrategy: 'Table-talker tent cards, entrance chalkboard display, 3 Instagram story reels highlighting cheese-pull, and WhatsApp VIP student voucher.',
        testTiming: '4:00 PM – 8:00 PM, Monday through Sunday',
        testDuration: '7 days',
        successMetrics: [
          '15+ combo orders per evening during pilot',
          '40% customer repeat or peer recommendation',
          '₹1,500+ daily incremental evening revenue',
        ],
        risks: [
          'Kitchen fryer bottleneck during peak 6 PM rush',
          'Cheese sauce quality and consistency during high volume',
        ],
        stopCriteria: [
          'Under 5 orders daily after day 3 of active promotion',
          'Wastage exceeding 20% of prepared batch',
        ],
        continueCriteria: [
          '12+ orders daily with positive verbal customer ratings',
          'Gross margin maintained above 60%',
        ],
        expectedLearning: 'Validates whether price-anchored finger food attracts habitual college footfall and sparks beverage cross-sales.',
      };
    }

    return {
      title: `Rapid Pilot: ${trendName} Special`,
      whyNow: `Rising consumer interest in ${trendName} creates an early-mover advantage in ${businessContext.location}.`,
      whyThisBusiness: `Directly aligns with ${businessContext.businessName}'s goal of increasing average order value with low operational disruption.`,
      targetCustomer: businessContext.targetCustomers || 'Local recurring customers',
      whatToLaunch: `Limited-edition curated offering incorporating ${trendName} principles.`,
      suggestedPrice: 'Competitive trial price with 55%+ gross margin',
      promotionStrategy: 'Social media announcement, register-side display, and direct customer recommendations.',
      testTiming: 'Peak customer visitation window',
      testDuration: '7-14 days',
      successMetrics: [
        '10+ orders per day during test duration',
        'Positive customer rating score above 4.2/5',
        'Repeat purchases within test timeframe',
      ],
      risks: [
        'Stock unpredictability',
        'Preparation speed during rush periods',
      ],
      stopCriteria: [
        'Customer satisfaction below benchmark',
        'Wastage exceeding 25%',
      ],
      continueCriteria: [
        'Target order volume met consistently for 5 consecutive days',
        'Positive margin confirmed',
      ],
      expectedLearning: `Confirms customer price elasticity and operational feasibility for ${trendName}.`,
    };
  }

  public async analyzeExperiment(input: ExperimentAnalysisInput): Promise<ExperimentAnalysisOutput> {
    const dailyOrders = input.recordedMetrics.find(m => m.name.toLowerCase().includes('order'))?.value || 20;
    const baselineOrders = input.baseline.avg_evening_orders || 12;
    const growthPercent = Math.round(((dailyOrders - baselineOrders) / baselineOrders) * 100);

    return {
      statusOutcome: growthPercent >= 20 ? 'SUCCESS' : 'INCONCLUSIVE',
      summary: `Experiment "${input.experimentName}" demonstrated a +${growthPercent}% lift in target metric over baseline (${dailyOrders} vs ${baselineOrders}). Customer feedback was overwhelmingly positive with negligible operational friction.`,
      keyInsights: [
        `Evening sales volume increased by +${growthPercent}% within the 7-day test window`,
        'High cross-sell attachment to cold beverages (31% of buyers added an iced beverage)',
        'Prep time averaged 3.8 minutes, staying within kitchen SLA',
      ],
      suggestedDecision: growthPercent >= 20 ? 'SCALE' : 'CONTINUE',
      nextSteps: [
        'Add item permanently to the regular evening menu card',
        'Introduce a second sauce flavor variant (e.g. Smoky BBQ Peri-Peri)',
        'Train all kitchen team shifts on batch prep',
      ],
      learnedImpactScore: 92,
    };
  }

  public async answerBusinessQuestion(input: AskTGoInput): Promise<AskTGoOutput> {
    const q = input.question.toLowerCase();
    const businessName = input.businessContext.businessName;
    const location = input.businessContext.location;

    if (q.includes('launch') || q.includes('month') || q.includes('next')) {
      return {
        answer: `Based on current market signals for ${location} and ${businessName}'s customer base, your highest-ROI immediate initiative is the **Loaded Fries Student Evening Combo** (Trend Score: 91/100, Business Fit: 91%). \n\nSearches for loaded savory street foods in your immediate radius spiked +42% over the last 30 days. Because you already operate fryers and carry core ingredients, you can launch an introductory ₹99 combo between 4:00 PM and 8:00 PM with almost zero capex. Alternatively, if beverage margins are your immediate priority, a **Cold Coffee with Flavored Cold Foam** provides a 72% gross margin and strong afternoon appeal.`,
        actionableRecommendations: [
          'Initiate a 7-day pilot for ₹99 Loaded Fries between 4-8 PM',
          'Deploy table chalkboard signage to capture student footfall walking past',
          'Pair the fries with a ₹49 iced tea/cooler upsell to maximize ticket size',
        ],
        citedTrends: [
          { trendId: 't1111111-1111-1111-1111-111111111111', name: 'Loaded Fries' },
          { trendId: 't5555555-5555-5555-5555-555555555555', name: 'Cold Coffee Innovations' },
        ],
        suggestedFollowUps: [
          'How should I price the combo to maintain a 65% gross margin?',
          'What promotion works best for college students on Instagram?',
          'What were the results of our previous 7-day experiment?',
        ],
      };
    }

    if (q.includes('compare') || q.includes('vs')) {
      return {
        answer: `**Comparative Analysis:**\n\n1. **Loaded Fries vs Artisan Pizza Combos:**\n- **Loaded Fries**: Lower barrier to entry, faster prep time (3-4 mins), ₹34 ingredient cost, ideal for individual college students between 4-7 PM.\n- **Pizza Combos**: Higher ticket size (₹199-₹249), but requires 9-12 minute bake times and higher cheese inventory risk.\n\n**Recommendation:** Start with Loaded Fries to build habitual daily student volume, then introduce mini artisan pizza combos for group weekend hangouts.`,
        actionableRecommendations: [
          'Prioritize quick-turn finger foods during high-turnover afternoon hours',
          'Reserve pizza combos for seated group dinners after 7:30 PM',
        ],
        citedTrends: [
          { trendId: 't1111111-1111-1111-1111-111111111111', name: 'Loaded Fries' },
          { trendId: 't7777777-7777-7777-7777-777777777777', name: 'Artisan Pizza Combos' },
        ],
        suggestedFollowUps: [
          'Can we cross-sell both items together?',
          'What are the kitchen bottlenecks for pizzas vs fries?',
        ],
      };
    }

    return {
      answer: `Analyzing market intelligence for **${businessName}** in **${location}**:\n\nEmerging demand patterns in your region highlight three core customer motivations: **affordability**, **visual indulgence**, and **afternoon energy boosts**. \n\nYour active business fit scores are highest in value-priced sharing snacks and refreshing cold beverages. Aligning your menu with these validated trends will help capture campus commuters and raise evening average order value without straining kitchen staff.`,
      actionableRecommendations: [
        'Review the Action Plans tab to see the expert-approved Loaded Fries pilot',
        'Check the Smart Alerts panel for localized search surge notifications',
        'Review the Trend Finder feed to swipe through other rising regional concepts',
      ],
      citedTrends: [
        { trendId: 't1111111-1111-1111-1111-111111111111', name: 'Loaded Fries' },
        { trendId: 't4444444-4444-4444-4444-444444444444', name: 'Affordable Combos' },
      ],
      suggestedFollowUps: [
        'Which opportunity has the lowest risk for my budget?',
        'What should I test next week?',
      ],
    };
  }
}
