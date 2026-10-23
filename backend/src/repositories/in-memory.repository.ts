import { v4 as uuidv4 } from 'uuid';
import { IRepository } from './repository.interface';
import { PipelineRepository } from './pipeline.repository';
import {
  Profile,
  Business,
  Trend,
  TrendMetric,
  Audience,
  GeographicSignal,
  DataSource,
  RawSignal,
  BusinessMatch,
  Opportunity,
  ActionPlan,
  ExpertReview,
  Experiment,
  ExperimentMetric,
  LearningRecord,
  Alert,
  SavedTrend,
  SystemLog,
} from '../models/types';

export class InMemoryRepository implements IRepository {
  private profiles: Profile[] = [];
  private businesses: Business[] = [];
  private trends: Trend[] = [];
  private trendMetrics: TrendMetric[] = [];
  private audiences: Audience[] = [];
  private geographicSignals: GeographicSignal[] = [];
  private dataSources: DataSource[] = [];
  private rawSignals: RawSignal[] = [];
  private businessMatches: BusinessMatch[] = [];
  private opportunities: Opportunity[] = [];
  private actionPlans: ActionPlan[] = [];
  private expertReviews: ExpertReview[] = [];
  private experiments: Experiment[] = [];
  private experimentMetrics: ExperimentMetric[] = [];
  private learningRecords: LearningRecord[] = [];
  private alerts: Alert[] = [];
  private savedTrends: SavedTrend[] = [];
  private systemLogs: SystemLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData(): void {
    const now = new Date().toISOString();

    // Profiles
    this.profiles = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        auth_user_id: 'auth-freshbite-owner',
        full_name: 'Gayatri Patil',
        email: 'gayatri@freshbite.cafe',
        role: 'BUSINESS',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        created_at: now,
        updated_at: now,
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        auth_user_id: 'auth-expert-rajesh',
        full_name: 'Rajesh Kulkarni (Retail & F&B Strategist)',
        email: 'rajesh@growthworks.in',
        role: 'EXPERT',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        created_at: now,
        updated_at: now,
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        auth_user_id: 'auth-admin-growth',
        full_name: 'T→G Platform Admin',
        email: 'admin@trendtogrowth.com',
        role: 'ADMIN',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        created_at: now,
        updated_at: now,
      },
    ];

    // FreshBite Café Business Profile
    this.businesses = [
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        owner_id: '11111111-1111-1111-1111-111111111111',
        business_name: 'FreshBite Café',
        industry: 'Food & Beverage',
        business_type: 'Cafe / Restaurant',
        location: 'Sangamner & Pune Suburban',
        target_market: 'Local college campuses & tech commuters',
        business_goal: 'Increase evening sales & average order value',
        description: 'Casual modern cafe offering artisan finger food, handcrafted coffees, and student-friendly quick bites.',
        products_services: ['Pizza', 'Sandwiches', 'Coffee', 'Mocktails', 'Loaded Fries'],
        target_customers: 'College students, engineering interns, evening transit commuters',
        budget: '₹5,000–₹20,000',
        platforms: ['Instagram', 'YouTube', 'WhatsApp Business', 'Zomato'],
        status: 'active',
        created_at: now,
        updated_at: now,
      },
    ];

    // Data Sources
    this.dataSources = [
      {
        id: 's1',
        source_type: 'search',
        source_name: 'Google Trends & Search Intelligence',
        base_url: 'https://trends.google.com',
        status: 'active',
        baseline_trust: 0.94,
        dynamic_trust: 0.96,
        last_collected_at: now,
        last_success_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 's2',
        source_type: 'social',
        source_name: 'Instagram Culinary Graph',
        base_url: 'https://instagram.com',
        status: 'active',
        baseline_trust: 0.86,
        dynamic_trust: 0.89,
        last_collected_at: now,
        last_success_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 's3',
        source_type: 'ecommerce',
        source_name: 'Swiggy & Zomato Market Intelligence',
        base_url: 'https://zomato.com',
        status: 'active',
        baseline_trust: 0.91,
        dynamic_trust: 0.93,
        last_collected_at: now,
        last_success_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 's4',
        source_type: 'news',
        source_name: 'Economic Times Retail & Hospitality RSS',
        base_url: 'https://economictimes.indiatimes.com',
        status: 'active',
        baseline_trust: 0.88,
        dynamic_trust: 0.90,
        last_collected_at: now,
        last_success_at: now,
        created_at: now,
        updated_at: now,
      },
    ];

    // 7 Trends
    this.trends = [
      {
        id: 't1111111-1111-1111-1111-111111111111',
        name: 'Loaded Fries',
        slug: 'loaded-fries',
        category: 'Food & Beverage',
        headline: 'Loaded Fries Are Gaining Attention Among 18-24 Evening Diners',
        description: 'Sustained surge in localized demand for sauced gourmet fries topped with melted cheddar, tandoori sauces, and jalapeños. Orders heavily cluster between 4:00 PM and 8:30 PM.',
        image_url: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'RISING',
        momentum: 88.5,
        velocity: 92.4,
        acceleration: 78.0,
        consistency: 89.2,
        source_diversity: 85.0,
        geographic_spread: 76.5,
        persistence: 84.0,
        trend_score: 91.2,
        trend_probability: 0.94,
        confidence: 0.88,
        risk: 'LOW',
        is_demo: true,
        first_detected_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        last_updated_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        id: 't2222222-2222-2222-2222-222222222222',
        name: 'Matcha Drinks & Coolers',
        slug: 'matcha-drinks',
        category: 'Beverages',
        headline: 'Matcha Coolers & Lattes Spark High-Margin Wellness Wave',
        description: 'Japanese ceremonial green tea drinks transitioning from niche metro cafes into Tier 2 student towns as clean-energy aesthetic alternatives to sugary sodas.',
        image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'EMERGING',
        momentum: 74.2,
        velocity: 81.0,
        acceleration: 84.5,
        consistency: 72.0,
        source_diversity: 78.0,
        geographic_spread: 68.0,
        persistence: 75.0,
        trend_score: 78.5,
        trend_probability: 0.82,
        confidence: 0.81,
        risk: 'MEDIUM',
        is_demo: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 't3333333-3333-3333-3333-333333333333',
        name: 'Protein Snacks & Energy Bites',
        slug: 'protein-snacks',
        category: 'Health & Fitness',
        headline: 'Grab-and-Go 15g+ Protein Snacks Show Steady Ascendance',
        description: 'Consumers prioritizing 15g+ protein per snack. High crossover between gym commuters and student desk workers seeking filling 4 PM alternatives.',
        image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'VALIDATING',
        momentum: 82.0,
        velocity: 85.0,
        acceleration: 72.0,
        consistency: 91.0,
        source_diversity: 88.0,
        geographic_spread: 82.0,
        persistence: 87.0,
        trend_score: 85.4,
        trend_probability: 0.89,
        confidence: 0.86,
        risk: 'LOW',
        is_demo: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 't4444444-4444-4444-4444-444444444444',
        name: 'Affordable Combos',
        slug: 'affordable-combos',
        category: 'Marketing & Pricing',
        headline: 'Fixed-Price ₹99 & ₹149 Value Combos Drive Footfall Habit',
        description: 'Price-anchored combo meals dominating student decision-making over single a la carte items. Accelerates trial and builds habitual footfall.',
        image_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'PEAKING',
        momentum: 94.0,
        velocity: 88.0,
        acceleration: 62.0,
        consistency: 95.0,
        source_diversity: 92.0,
        geographic_spread: 91.0,
        persistence: 90.0,
        trend_score: 93.0,
        trend_probability: 0.96,
        confidence: 0.92,
        risk: 'LOW',
        is_demo: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 't5555555-5555-5555-5555-555555555555',
        name: 'Cold Coffee Innovations',
        slug: 'cold-coffee-innovations',
        category: 'Beverages',
        headline: 'Vietnamese Sweet Cream & Flavored Cold Foams Spike in Youth Hubs',
        description: 'Cold brew with flavored cold foam, Lotus Biscoff drizzle, and hazelnut infusions showing 3x year-on-year social buzz during warm afternoons.',
        image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'RISING',
        momentum: 86.0,
        velocity: 89.0,
        acceleration: 79.0,
        consistency: 87.0,
        source_diversity: 84.0,
        geographic_spread: 79.0,
        persistence: 81.0,
        trend_score: 88.0,
        trend_probability: 0.91,
        confidence: 0.87,
        risk: 'LOW',
        is_demo: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 't6666666-6666-6666-6666-666666666666',
        name: 'Healthy Salad & Grain Bowls',
        slug: 'healthy-bowls',
        category: 'Food & Beverage',
        headline: 'Custom Grain Bowls Replacing Heavy Lunches Among Campus Staff',
        description: 'Millets, quinoa, and paneer/tofu warm bowls showing steady uptake across health-conscious consumers seeking quick, non-sluggish meals.',
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'VALIDATING',
        momentum: 69.0,
        velocity: 71.0,
        acceleration: 65.0,
        consistency: 83.0,
        source_diversity: 76.0,
        geographic_spread: 64.0,
        persistence: 79.0,
        trend_score: 73.0,
        trend_probability: 0.76,
        confidence: 0.79,
        risk: 'MEDIUM',
        is_demo: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 't7777777-7777-7777-7777-777777777777',
        name: 'Artisan Pizza Combos',
        slug: 'pizza-combos',
        category: 'Food & Beverage',
        headline: 'Single-Serve Pan Pizza & Mocktail Pairings Surge for Group Hangouts',
        description: 'Mini 7-inch sourdough pizzas paired with refreshing coolers priced for shared peer dining between 5 PM and 9 PM.',
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        lifecycle_status: 'RISING',
        momentum: 83.0,
        velocity: 84.0,
        acceleration: 76.0,
        consistency: 88.0,
        source_diversity: 82.0,
        geographic_spread: 75.0,
        persistence: 83.0,
        trend_score: 84.5,
        trend_probability: 0.88,
        confidence: 0.85,
        risk: 'LOW',
        is_demo: true,
        created_at: now,
        updated_at: now,
      },
    ];

    // Seed Metrics for Loaded Fries (Multi-period)
    const periods = ['7d', '30d', '90d', '6m', '1y'];
    const baseVal = 70;
    periods.forEach(period => {
      for (let i = 1; i <= 6; i++) {
        this.trendMetrics.push({
          id: uuidv4(),
          trend_id: 't1111111-1111-1111-1111-111111111111',
          metric_name: 'Search Interest Index',
          metric_value: Math.min(100, Math.round(baseVal + i * 4.5 + Math.random() * 5)),
          metric_period: period,
          region: 'Maharashtra & Tier 2',
          source: 'Google Search API',
          observed_at: new Date(Date.now() - (6 - i) * 86400000 * 5).toISOString(),
          created_at: now,
        });
      }
    });

    // Audiences for Loaded Fries
    this.audiences = [
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        age_group: '18–24',
        location: 'College Campuses & Tech Hubs',
        interest: 'Fast Casual, Street Food, Instagram aesthetics',
        percentage: 58,
        activity_signal: 'Peak social check-ins between 4:30 PM – 8:00 PM',
        created_at: now,
      },
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        age_group: '25–34',
        location: 'Suburban Commuter Corridors',
        interest: 'Quick dinners, Evening takeaway',
        percentage: 28,
        activity_signal: 'High food delivery app cart additions',
        created_at: now,
      },
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        age_group: '35–44',
        location: 'Residential Neighborhoods',
        interest: 'Weekend family treats',
        percentage: 10,
        activity_signal: 'Sunday afternoon orders',
        created_at: now,
      },
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        age_group: '45+',
        location: 'General Population',
        interest: 'Occasional novelty dining',
        percentage: 4,
        activity_signal: 'Low direct engagement',
        created_at: now,
      },
    ];

    // Geography for Loaded Fries
    this.geographicSignals = [
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        country: 'India',
        state: 'Maharashtra',
        city: 'Pune Suburban Corridor',
        interest_score: 94,
        growth_rate: 34.5,
        observed_at: now,
        created_at: now,
      },
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        country: 'India',
        state: 'Maharashtra',
        city: 'Sangamner Regional Hub',
        interest_score: 88,
        growth_rate: 42.0,
        observed_at: now,
        created_at: now,
      },
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        country: 'India',
        state: 'Maharashtra',
        city: 'Nashik Central',
        interest_score: 82,
        growth_rate: 29.0,
        observed_at: now,
        created_at: now,
      },
      {
        id: uuidv4(),
        trend_id: 't1111111-1111-1111-1111-111111111111',
        country: 'India',
        state: 'Karnataka',
        city: 'Bengaluru South',
        interest_score: 96,
        growth_rate: 38.0,
        observed_at: now,
        created_at: now,
      },
    ];

    // Business Match (FreshBite x Loaded Fries)
    this.businessMatches = [
      {
        id: uuidv4(),
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't1111111-1111-1111-1111-111111111111',
        customer_fit: 94,
        product_fit: 89,
        location_fit: 87,
        budget_fit: 88,
        goal_alignment: 95,
        business_fit: 91,
        risk: 'LOW',
        confidence: 0.88,
        reasoning: 'Loaded Fries perfectly overlaps with FreshBite’s student demographic, evening traffic lulls, existing fryer inventory, and under ₹10,000 launch budget.',
        evidence_ids: ['sig-search-01', 'sig-social-02'],
        intelligence_version: 'tgo-v1',
        created_at: now,
        updated_at: now,
      },
    ];

    // Opportunities
    this.opportunities = [
      {
        id: 'o1111111-1111-1111-1111-111111111111',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't1111111-1111-1111-1111-111111111111',
        name: 'Loaded Fries Student Evening Combo',
        description: 'Introduce signature Cheesy Masala & Peri-Peri Loaded Fries paired with mini iced coolers targeting college students between 4 PM and 8 PM.',
        opportunity_score: 8.8,
        business_fit: 91,
        risk: 'LOW',
        confidence: 0.88,
        potential_action: 'Launch a ₹99 student combo between 4–8 PM and test demand for 7 days.',
        status: 'active',
        score_version: 'v1.2',
        intelligence_version: 'tgo-v1',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'o2222222-2222-2222-2222-222222222222',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't5555555-5555-5555-5555-555555555555',
        name: 'Sweet Cream Cold Brew Afternoon Booster',
        description: 'Layered Vietnamese cold coffee with thick milk foam priced at ₹119 to boost post-lunch beverage orders.',
        opportunity_score: 8.4,
        business_fit: 89,
        risk: 'LOW',
        confidence: 0.85,
        potential_action: 'Feature as Beverage of the Week with stamped loyalty cards.',
        status: 'new',
        score_version: 'v1.2',
        intelligence_version: 'tgo-v1',
        created_at: now,
        updated_at: now,
      },
    ];

    // Action Plans
    this.actionPlans = [
      {
        id: 'a1111111-1111-1111-1111-111111111111',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't1111111-1111-1111-1111-111111111111',
        opportunity_id: 'o1111111-1111-1111-1111-111111111111',
        title: 'Launch ₹99 Student Evening Loaded Fries Combo',
        why_now: 'Local searches for loaded fries are up 42% this quarter while evening cafe footfall is currently running at 45% capacity.',
        why_this_business: 'FreshBite already maintains standard fries in stock and is situated right beside high-density student transit routes.',
        target_customer: 'College students, young engineers, and evening transit commuters (18–26)',
        what_to_launch: 'Double-fried crispy French fries topped with warm cheddar sauce, spicy mayo drizzle, and crushed jalapenos in branded paper boat packaging.',
        suggested_price: '₹99 introductory price point (estimated food cost: ₹34)',
        promotion_strategy: 'Table-talker tent cards, entrance chalkboard display, 3 Instagram story reels highlighting cheese-pull, and WhatsApp student voucher.',
        test_timing: '4:00 PM – 8:00 PM, Monday through Sunday',
        test_duration: '7 days',
        success_metrics: [
          '15+ combo orders per evening during pilot',
          '40% customer repeat or peer recommendation',
          '₹1,500+ daily incremental evening revenue',
        ],
        risks: [
          'Kitchen fryer bottleneck during peak 6 PM rush',
          'Cheese sauce quality and consistency during high volume',
        ],
        stop_criteria: [
          'Under 5 orders daily after day 3 of active promotion',
          'Wastage exceeding 20% of prepared batch',
        ],
        continue_criteria: [
          '12+ orders daily with positive verbal customer ratings',
          'Gross margin maintained above 60%',
        ],
        expected_learning: 'Validates whether price-anchored finger food attracts habitual college footfall and sparks beverage cross-sales.',
        status: 'approved',
        intelligence_version: 'tgo-v1',
        created_at: now,
        updated_at: now,
      },
    ];

    // Expert Review
    this.expertReviews = [
      {
        id: 'e1111111-1111-1111-1111-111111111111',
        action_plan_id: 'a1111111-1111-1111-1111-111111111111',
        expert_id: '22222222-2222-2222-2222-222222222222',
        risk: 'LOW',
        confidence: 0.90,
        status: 'approved',
        comments: 'Solid low-risk execution plan. Food cost is tightly bounded and equipment already exists. Pre-portion cheese bags in morning prep to avoid ticket delay during peak rush.',
        suggested_changes: 'Pre-portion sauce toppings in squeeze bottles before 4 PM shift.',
        decision_reason: 'Low capex, immediate alignment with college demographics, and explicit stop/continue thresholds.',
        reviewed_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: now,
      },
    ];

    // Experiments
    this.experiments = [
      {
        id: 'x1111111-1111-1111-1111-111111111111',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        opportunity_id: 'o1111111-1111-1111-1111-111111111111',
        action_plan_id: 'a1111111-1111-1111-1111-111111111111',
        name: '7-Day ₹99 Loaded Fries Pilot',
        hypothesis: 'Offering an introductory ₹99 Loaded Fries combo during 4-8 PM will increase total evening covers by 25% and drive drink cross-sells.',
        baseline: { avg_evening_orders: 12, avg_evening_revenue: 1450, drink_attach_rate: 0.22 },
        start_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        end_date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        status: 'in_progress',
        decision: 'pending_evaluation',
        created_at: now,
        updated_at: now,
      },
    ];

    // Experiment Metrics
    this.experimentMetrics = [
      {
        id: uuidv4(),
        experiment_id: 'x1111111-1111-1111-1111-111111111111',
        metric_name: 'Daily Combo Orders',
        metric_value: 18,
        metric_unit: 'orders',
        metric_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        baseline_value: 12,
        target_value: 15,
        created_at: now,
      },
      {
        id: uuidv4(),
        experiment_id: 'x1111111-1111-1111-1111-111111111111',
        metric_name: 'Daily Combo Orders',
        metric_value: 22,
        metric_unit: 'orders',
        metric_date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        baseline_value: 12,
        target_value: 15,
        created_at: now,
      },
      {
        id: uuidv4(),
        experiment_id: 'x1111111-1111-1111-1111-111111111111',
        metric_name: 'Daily Combo Orders',
        metric_value: 26,
        metric_unit: 'orders',
        metric_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        baseline_value: 12,
        target_value: 15,
        created_at: now,
      },
      {
        id: uuidv4(),
        experiment_id: 'x1111111-1111-1111-1111-111111111111',
        metric_name: 'Evening Revenue',
        metric_value: 2350,
        metric_unit: 'INR',
        metric_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        baseline_value: 1450,
        target_value: 2000,
        created_at: now,
      },
    ];

    // Smart Alerts
    this.alerts = [
      {
        id: 'al-1',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't1111111-1111-1111-1111-111111111111',
        alert_type: 'Trend Acceleration',
        title: 'Loaded Fries Search Velocity Spiked +42%',
        message: 'Evening demand in your local college zone has surged over the past 72 hours. Your active experiment is well-timed.',
        severity: 'high',
        confidence: 0.92,
        is_read: false,
        created_at: now,
      },
      {
        id: 'al-2',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't5555555-5555-5555-5555-555555555555',
        alert_type: 'Emerging Demand',
        title: 'Cold Brew Flavors Showing High Youth Fit',
        message: 'New search clusters around flavored cold foams and iced coffee in Sangamner / Pune regional hub.',
        severity: 'medium',
        confidence: 0.85,
        is_read: false,
        created_at: now,
      },
      {
        id: 'al-3',
        business_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        trend_id: 't4444444-4444-4444-4444-444444444444',
        alert_type: 'Expert Review Required',
        title: 'Affordable Combo Action Plan Awaiting Sign-off',
        message: 'Expert Rajesh Kulkarni reviewed the combo launch plan and added preparation suggestions.',
        severity: 'info',
        confidence: 0.95,
        is_read: true,
        created_at: now,
      },
    ];
  }

  // --- Profiles ---
  public async getProfileById(id: string): Promise<Profile | null> {
    return this.profiles.find(p => p.id === id) || null;
  }

  public async getProfileByEmail(email: string): Promise<Profile | null> {
    return this.profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public async createProfile(profile: Partial<Profile>): Promise<Profile> {
    const newProfile: Profile = {
      id: profile.id || uuidv4(),
      auth_user_id: profile.auth_user_id || `auth-${uuidv4()}`,
      full_name: profile.full_name || 'New User',
      email: profile.email || 'user@example.com',
      role: profile.role || 'BUSINESS',
      avatar_url: profile.avatar_url,
      language: profile.language || 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.push(newProfile);
    return newProfile;
  }

  public async getAllProfiles(): Promise<Profile[]> {
    return this.profiles;
  }

  // --- Businesses ---
  public async getBusinessById(id: string): Promise<Business | null> {
    return this.businesses.find(b => b.id === id) || null;
  }

  public async getBusinessByOwnerId(ownerId: string): Promise<Business | null> {
    return this.businesses.find(b => b.owner_id === ownerId) || this.businesses[0] || null;
  }

  public async createBusiness(business: Partial<Business>): Promise<Business> {
    const newBusiness: Business = {
      id: business.id || uuidv4(),
      owner_id: business.owner_id || this.profiles[0].id,
      business_name: business.business_name || 'My Business',
      industry: business.industry || 'Food & Beverage',
      business_type: business.business_type || 'Retail',
      location: business.location || 'Local',
      target_market: business.target_market,
      business_goal: business.business_goal || 'Growth',
      description: business.description,
      products_services: business.products_services || [],
      target_customers: business.target_customers,
      budget: business.budget,
      platforms: business.platforms || [],
      status: business.status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.businesses.push(newBusiness);
    return newBusiness;
  }

  public async updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null> {
    const index = this.businesses.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.businesses[index] = {
      ...this.businesses[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.businesses[index];
  }

  public async getAllBusinesses(): Promise<Business[]> {
    return this.businesses;
  }

  // --- Trends ---
  public async getAllTrends(filter?: { category?: string; search?: string; status?: string }): Promise<Trend[]> {
    let result = [...this.trends];
    if (filter) {
      if (filter.category && filter.category !== 'All' && filter.category !== 'For You') {
        result = result.filter(t => t.category.toLowerCase() === filter.category!.toLowerCase());
      }
      if (filter.status && filter.status !== 'All') {
        result = result.filter(t => t.lifecycle_status.toLowerCase() === filter.status!.toLowerCase());
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
      }
    }
    return result;
  }

  public async getTrendById(id: string): Promise<Trend | null> {
    return this.trends.find(t => t.id === id) || null;
  }

  public async getTrendBySlug(slug: string): Promise<Trend | null> {
    return this.trends.find(t => t.slug === slug) || null;
  }

  public async createTrend(trend: Partial<Trend>): Promise<Trend> {
    const newTrend: Trend = {
      id: trend.id || uuidv4(),
      name: trend.name || 'New Trend',
      slug: trend.slug || (trend.name ? trend.name.toLowerCase().replace(/\s+/g, '-') : `trend-${Date.now()}`),
      category: trend.category || 'General',
      headline: trend.headline || '',
      description: trend.description || '',
      image_url: trend.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      lifecycle_status: trend.lifecycle_status || 'SIGNAL_DETECTED',
      momentum: trend.momentum || 75,
      velocity: trend.velocity || 70,
      acceleration: trend.acceleration || 65,
      consistency: trend.consistency || 80,
      source_diversity: trend.source_diversity || 75,
      geographic_spread: trend.geographic_spread || 70,
      persistence: trend.persistence || 75,
      trend_score: trend.trend_score || 80,
      trend_probability: trend.trend_probability || 0.85,
      confidence: trend.confidence || 0.85,
      risk: trend.risk || 'LOW',
      is_demo: trend.is_demo ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.trends.push(newTrend);
    return newTrend;
  }

  public async updateTrend(id: string, updates: Partial<Trend>): Promise<Trend | null> {
    const idx = this.trends.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.trends[idx] = { ...this.trends[idx], ...updates, updated_at: new Date().toISOString() };
    return this.trends[idx];
  }

  // --- Trend Details ---
  public async getTrendMetrics(trendId: string, period?: string): Promise<TrendMetric[]> {
    let list = this.trendMetrics.filter(m => m.trend_id === trendId);
    if (period) {
      list = list.filter(m => m.metric_period === period);
    }
    return list;
  }

  public async getTrendAudiences(trendId: string): Promise<Audience[]> {
    return this.audiences.filter(a => a.trend_id === trendId);
  }

  public async getTrendGeography(trendId: string): Promise<GeographicSignal[]> {
    return this.geographicSignals.filter(g => g.trend_id === trendId);
  }

  public async getTrendSignals(trendId: string): Promise<RawSignal[]> {
    const memorySignals = this.rawSignals.filter(s => s.metadata?.trend_id === trendId);
    if (memorySignals.length > 0) return memorySignals;

    // Check PipelineRepository for cluster signals from pipeline runs
    const pipelineSignals = PipelineRepository.getInstance().getClusterSignals(trendId);
    if (pipelineSignals.length > 0) {
      return pipelineSignals.map(sig => ({
        id: sig.id,
        source_id: sig.source,
        external_id: sig.sourceRecordId,
        title: sig.title,
        original_text: sig.text || sig.title,
        url: sig.url,
        published_at: sig.timestamp,
        collected_at: sig.collectedAt || sig.timestamp,
        metadata: {
          trend_id: trendId,
          metrics: sig.rawMetrics || sig.engagementMetrics,
          source: sig.source,
          location: sig.location?.city || '',
        },
      }));
    }

    return [];
  }

  public async getDataSources(): Promise<DataSource[]> {
    return this.dataSources;
  }

  // --- Saved Trends ---
  public async getSavedTrends(userId: string): Promise<Trend[]> {
    const savedIds = this.savedTrends.filter(st => st.user_id === userId).map(st => st.trend_id);
    return this.trends.filter(t => savedIds.includes(t.id));
  }

  public async saveTrend(userId: string, trendId: string): Promise<boolean> {
    const exists = this.savedTrends.some(st => st.user_id === userId && st.trend_id === trendId);
    if (!exists) {
      this.savedTrends.push({ id: uuidv4(), user_id: userId, trend_id: trendId, created_at: new Date().toISOString() });
    }
    return true;
  }

  public async unsaveTrend(userId: string, trendId: string): Promise<boolean> {
    this.savedTrends = this.savedTrends.filter(st => !(st.user_id === userId && st.trend_id === trendId));
    return true;
  }

  // --- Business Matches ---
  public async getBusinessMatch(businessId: string, trendId: string): Promise<BusinessMatch | null> {
    return this.businessMatches.find(m => m.business_id === businessId && m.trend_id === trendId) || null;
  }

  public async upsertBusinessMatch(match: Partial<BusinessMatch>): Promise<BusinessMatch> {
    const idx = this.businessMatches.findIndex(m => m.business_id === match.business_id && m.trend_id === match.trend_id);
    const updated: BusinessMatch = {
      id: match.id || (idx >= 0 ? this.businessMatches[idx].id : uuidv4()),
      business_id: match.business_id!,
      trend_id: match.trend_id!,
      customer_fit: match.customer_fit || 85,
      product_fit: match.product_fit || 85,
      location_fit: match.location_fit || 85,
      goal_alignment: match.goal_alignment || 85,
      budget_fit: match.budget_fit || 85,
      business_fit: match.business_fit || 85,
      risk: match.risk || 'LOW',
      confidence: match.confidence || 0.85,
      reasoning: match.reasoning || 'Deterministic rule-based fit match.',
      evidence_ids: match.evidence_ids || [],
      intelligence_version: match.intelligence_version || 'tgo-v1',
      created_at: idx >= 0 ? this.businessMatches[idx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) this.businessMatches[idx] = updated;
    else this.businessMatches.push(updated);
    return updated;
  }

  public async getAllBusinessMatches(businessId: string): Promise<BusinessMatch[]> {
    return this.businessMatches.filter(m => m.business_id === businessId);
  }

  // --- Opportunities ---
  public async getOpportunities(businessId?: string): Promise<Opportunity[]> {
    if (businessId) {
      return this.opportunities.filter(o => o.business_id === businessId);
    }
    return this.opportunities;
  }

  public async getOpportunityById(id: string): Promise<Opportunity | null> {
    return this.opportunities.find(o => o.id === id) || null;
  }

  public async createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity> {
    const newOpp: Opportunity = {
      id: opportunity.id || uuidv4(),
      business_id: opportunity.business_id || this.businesses[0].id,
      trend_id: opportunity.trend_id || this.trends[0].id,
      name: opportunity.name || 'New Opportunity',
      description: opportunity.description || '',
      opportunity_score: opportunity.opportunity_score || 8.0,
      business_fit: opportunity.business_fit || 85,
      risk: opportunity.risk || 'LOW',
      confidence: opportunity.confidence || 0.85,
      potential_action: opportunity.potential_action || '',
      status: opportunity.status || 'new',
      score_version: opportunity.score_version || 'v1.0',
      intelligence_version: opportunity.intelligence_version || 'tgo-v1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.opportunities.push(newOpp);
    return newOpp;
  }

  public async updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity | null> {
    const idx = this.opportunities.findIndex(o => o.id === id);
    if (idx === -1) return null;
    this.opportunities[idx] = { ...this.opportunities[idx], ...updates, updated_at: new Date().toISOString() };
    return this.opportunities[idx];
  }

  // --- Action Plans ---
  public async getActionPlans(businessId?: string): Promise<ActionPlan[]> {
    if (businessId) {
      return this.actionPlans.filter(a => a.business_id === businessId);
    }
    return this.actionPlans;
  }

  public async getActionPlanById(id: string): Promise<ActionPlan | null> {
    return this.actionPlans.find(a => a.id === id) || null;
  }

  public async createActionPlan(plan: Partial<ActionPlan>): Promise<ActionPlan> {
    const newPlan: ActionPlan = {
      id: plan.id || uuidv4(),
      business_id: plan.business_id || this.businesses[0].id,
      trend_id: plan.trend_id,
      opportunity_id: plan.opportunity_id,
      title: plan.title || 'New Action Plan',
      why_now: plan.why_now,
      why_this_business: plan.why_this_business,
      target_customer: plan.target_customer,
      what_to_launch: plan.what_to_launch || '',
      suggested_price: plan.suggested_price,
      promotion_strategy: plan.promotion_strategy,
      test_timing: plan.test_timing,
      test_duration: plan.test_duration || '7 days',
      success_metrics: plan.success_metrics || [],
      risks: plan.risks || [],
      stop_criteria: plan.stop_criteria || [],
      continue_criteria: plan.continue_criteria || [],
      expected_learning: plan.expected_learning,
      status: plan.status || 'draft',
      intelligence_version: plan.intelligence_version || 'tgo-v1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.actionPlans.push(newPlan);
    return newPlan;
  }

  public async updateActionPlan(id: string, updates: Partial<ActionPlan>): Promise<ActionPlan | null> {
    const idx = this.actionPlans.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.actionPlans[idx] = { ...this.actionPlans[idx], ...updates, updated_at: new Date().toISOString() };
    return this.actionPlans[idx];
  }

  // --- Expert Reviews ---
  public async getExpertReviews(status?: string): Promise<ExpertReview[]> {
    if (status) {
      return this.expertReviews.filter(e => e.status === status);
    }
    return this.expertReviews;
  }

  public async getExpertReviewByPlanId(planId: string): Promise<ExpertReview | null> {
    return this.expertReviews.find(e => e.action_plan_id === planId) || null;
  }

  public async createOrUpdateExpertReview(review: Partial<ExpertReview>): Promise<ExpertReview> {
    const idx = this.expertReviews.findIndex(e => e.action_plan_id === review.action_plan_id);
    const updated: ExpertReview = {
      id: review.id || (idx >= 0 ? this.expertReviews[idx].id : uuidv4()),
      action_plan_id: review.action_plan_id!,
      expert_id: review.expert_id || this.profiles[1].id,
      risk: review.risk || 'LOW',
      confidence: review.confidence || 0.9,
      status: review.status || 'pending',
      comments: review.comments,
      suggested_changes: review.suggested_changes,
      decision_reason: review.decision_reason,
      reviewed_at: new Date().toISOString(),
      created_at: idx >= 0 ? this.expertReviews[idx].created_at : new Date().toISOString(),
    };
    if (idx >= 0) this.expertReviews[idx] = updated;
    else this.expertReviews.push(updated);
    return updated;
  }

  // --- Experiments ---
  public async getExperiments(businessId?: string): Promise<Experiment[]> {
    if (businessId) {
      return this.experiments.filter(e => e.business_id === businessId);
    }
    return this.experiments;
  }

  public async getExperimentById(id: string): Promise<Experiment | null> {
    return this.experiments.find(e => e.id === id) || null;
  }

  public async createExperiment(experiment: Partial<Experiment>): Promise<Experiment> {
    const newExp: Experiment = {
      id: experiment.id || uuidv4(),
      business_id: experiment.business_id || this.businesses[0].id,
      opportunity_id: experiment.opportunity_id,
      action_plan_id: experiment.action_plan_id,
      name: experiment.name || 'New Experiment',
      hypothesis: experiment.hypothesis || '',
      baseline: experiment.baseline || {},
      start_date: experiment.start_date || new Date().toISOString().split('T')[0],
      end_date: experiment.end_date,
      status: experiment.status || 'planned',
      decision: experiment.decision,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.experiments.push(newExp);
    return newExp;
  }

  public async updateExperiment(id: string, updates: Partial<Experiment>): Promise<Experiment | null> {
    const idx = this.experiments.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.experiments[idx] = { ...this.experiments[idx], ...updates, updated_at: new Date().toISOString() };
    return this.experiments[idx];
  }

  public async getExperimentMetrics(experimentId: string): Promise<ExperimentMetric[]> {
    return this.experimentMetrics.filter(m => m.experiment_id === experimentId);
  }

  public async addExperimentMetric(metric: Partial<ExperimentMetric>): Promise<ExperimentMetric> {
    const newMetric: ExperimentMetric = {
      id: metric.id || uuidv4(),
      experiment_id: metric.experiment_id!,
      metric_name: metric.metric_name || 'Metric',
      metric_value: metric.metric_value || 0,
      metric_unit: metric.metric_unit,
      metric_date: metric.metric_date || new Date().toISOString().split('T')[0],
      baseline_value: metric.baseline_value,
      target_value: metric.target_value,
      created_at: new Date().toISOString(),
    };
    this.experimentMetrics.push(newMetric);
    return newMetric;
  }

  // --- Learning Records ---
  public async getLearningRecords(businessId?: string): Promise<LearningRecord[]> {
    if (businessId) {
      return this.learningRecords.filter(l => l.business_id === businessId);
    }
    return this.learningRecords;
  }

  public async createLearningRecord(record: Partial<LearningRecord>): Promise<LearningRecord> {
    const newRecord: LearningRecord = {
      id: record.id || uuidv4(),
      business_id: record.business_id || this.businesses[0].id,
      trend_id: record.trend_id,
      experiment_id: record.experiment_id,
      outcome: record.outcome || {},
      evidence_strength: record.evidence_strength || 0.9,
      impact: record.impact || 85,
      learning_type: record.learning_type || 'experiment_validation',
      created_at: new Date().toISOString(),
    };
    this.learningRecords.push(newRecord);
    return newRecord;
  }

  // --- Alerts ---
  public async getAlerts(businessId: string, unreadOnly?: boolean): Promise<Alert[]> {
    let list = this.alerts.filter(a => a.business_id === businessId);
    if (unreadOnly) {
      list = list.filter(a => !a.is_read);
    }
    return list;
  }

  public async markAlertRead(alertId: string): Promise<boolean> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.is_read = true;
      return true;
    }
    return false;
  }

  public async createAlert(alert: Partial<Alert>): Promise<Alert> {
    const newAlert: Alert = {
      id: alert.id || uuidv4(),
      business_id: alert.business_id || this.businesses[0].id,
      trend_id: alert.trend_id,
      alert_type: alert.alert_type || 'Emerging Demand',
      title: alert.title || 'Market Update',
      message: alert.message || '',
      severity: alert.severity || 'info',
      confidence: alert.confidence || 0.85,
      evidence_ids: alert.evidence_ids || [],
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  // --- System Logs ---
  public async logSystemAction(log: Partial<SystemLog>): Promise<void> {
    this.systemLogs.unshift({
      id: uuidv4(),
      user_id: log.user_id,
      action: log.action || 'ACTION',
      resource: log.resource,
      resource_id: log.resource_id,
      metadata: log.metadata,
      created_at: new Date().toISOString(),
    });
    if (this.systemLogs.length > 500) this.systemLogs.pop();
  }

  public async getSystemLogs(limit: number = 50): Promise<SystemLog[]> {
    return this.systemLogs.slice(0, limit);
  }
}
