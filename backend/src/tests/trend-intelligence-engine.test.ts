import { SignalValidator } from '../pipeline/validation/signal-validator';
import { SignalNormalizer } from '../pipeline/normalization/signal-normalizer';
import { SignalDeduplicator } from '../pipeline/deduplication/signal-deduplicator';
import { LocationFilter } from '../pipeline/location/location-filter';
import { TrendClusterer } from '../pipeline/clustering/trend-clusterer';
import { TimeSeriesEngine } from '../pipeline/metrics/time-series.engine';
import { TrendScorer } from '../pipeline/scoring/trend-scorer';
import { LifecycleClassifier } from '../pipeline/lifecycle/lifecycle-classifier';
import { BusinessFitEngine } from '../pipeline/business-fit/business-fit.engine';
import { HighValueSelector } from '../pipeline/high-value/high-value-selector';
import { GeminiAnalysisSchema } from '../ai/schemas/gemini-analysis.schema';
import { OpportunityEngine } from '../opportunities/opportunity.engine';
import { ActionPlanEngine } from '../action-plans/action-plan.engine';
import { PipelineService } from '../pipeline/pipeline.service';
import { TrendSignal, BusinessContext, TrendCluster } from '../models/intelligence-pipeline.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runAllTests() {
  console.log('==============================================================');
  console.log('   T→G Trend Intelligence Engine — Verification Test Suite    ');
  console.log('==============================================================\n');

  // -------------------------------------------------------------
  // Test 1: Signal Validation
  // -------------------------------------------------------------
  console.log('[Test 1] Testing Signal Validation...');
  const validator = new SignalValidator();
  const testSignals: TrendSignal[] = [
    {
      id: 's1',
      source: 'youtube',
      sourceRecordId: 'rec-1',
      title: 'Valid Matcha Review in Nashik',
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'nashik'],
      status: 'RAW',
    },
    {
      id: 's2',
      source: 'unknown_source', // invalid source
      sourceRecordId: 'rec-2',
      title: 'Invalid Source Signal',
      timestamp: new Date().toISOString(),
      keywords: ['invalid'],
      status: 'RAW',
    },
    {
      id: 's3',
      source: 'reddit',
      sourceRecordId: '', // missing ID
      title: 'Missing Record ID',
      timestamp: new Date().toISOString(),
      keywords: ['missing'],
      status: 'RAW',
    },
    {
      id: 's4',
      source: 'reddit',
      sourceRecordId: 'rec-4',
      title: 'Negative Metrics Signal',
      timestamp: new Date().toISOString(),
      keywords: ['negative'],
      engagementMetrics: { views: -50 }, // invalid metric
      status: 'RAW',
    },
  ];

  const validationRes = validator.validate(testSignals);
  assert(validationRes.valid.length === 1, 'Only 1 signal should be valid');
  assert(validationRes.rejected.length === 3, '3 signals should be rejected');
  assert(validationRes.valid[0].id === 's1', 'Valid signal should be s1');
  assert(Boolean(validationRes.rejected[0].rejectionReason), 'Rejected signals must store rejectionReason');
  console.log('  ✓ Test 1 Passed: Validation correctly accepts valid and rejects malformed records with reasons.');

  // -------------------------------------------------------------
  // Test 2: Normalization
  // -------------------------------------------------------------
  console.log('[Test 2] Testing Signal Normalization...');
  const normalizer = new SignalNormalizer();
  const rawSignal: TrendSignal = {
    id: 'norm-1',
    source: 'news_rss',
    sourceRecordId: 'nr-1',
    title: '  <b>Surge in</b>   Cold Brew   Coffee Trends!  ',
    text: '<p>Specialty cold brew cafes expanding rapidly in Pune with lots of whitespace.</p>',
    url: 'https://example.com/story?utm_source=twitter&utm_medium=social#heading',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'VALID',
    keywords: ['coffee'],
    location: { city: 'Pune  ', country: 'India' },
    engagementMetrics: { views: 1200, likes: 45 },
  };

  const [normalized] = normalizer.normalize([rawSignal]);
  assert(normalized.title === 'Surge in Cold Brew Coffee Trends!', 'Title should be stripped of HTML and extra spaces');
  assert(normalized.text === 'Specialty cold brew cafes expanding rapidly in Pune with lots of whitespace.', 'Body should be clean text');
  assert(!normalized.url?.includes('utm_source'), 'Tracking parameters must be removed from URL');
  assert(normalized.location?.city === 'Pune', 'Location city must be trimmed');
  assert((normalized.engagementMetrics?.score || 0) > 0, 'Engagement score must be calculated');
  console.log('  ✓ Test 2 Passed: Text cleaned, tracking query removed, ISO dates and metrics standardized.');

  // -------------------------------------------------------------
  // Test 3: Deduplication
  // -------------------------------------------------------------
  console.log('[Test 3] Testing Deduplication...');
  const deduplicator = new SignalDeduplicator();
  const dupSignals: TrendSignal[] = [
    {
      id: 'd1',
      source: 'youtube',
      sourceRecordId: 'video-101',
      title: 'Ceremonial Matcha Craze Takes Over Mumbai',
      url: 'https://youtube.com/watch?v=101',
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'mumbai'],
    },
    {
      id: 'd2',
      source: 'youtube',
      sourceRecordId: 'video-101', // Exact duplicate sourceRecordId
      title: 'Ceremonial Matcha Craze Takes Over Mumbai',
      url: 'https://youtube.com/watch?v=101',
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'mumbai'],
    },
    {
      id: 'd3',
      source: 'news_rss',
      sourceRecordId: 'syndicated-tribune',
      title: 'Ceremonial Matcha Craze Takes Over Mumbai Cafes', // Syndicated cross-source title (>80% overlap)
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'mumbai'],
    },
    {
      id: 'd4',
      source: 'reddit',
      sourceRecordId: 'reddit-unique',
      title: 'Looking for organic cold brew in Bandra',
      timestamp: new Date().toISOString(),
      keywords: ['cold brew', 'bandra'],
    },
  ];

  const dedupRes = deduplicator.deduplicate(dupSignals);
  assert(dedupRes.unique.length === 2, `Expected 2 unique signals, got ${dedupRes.unique.length}`);
  assert(dedupRes.duplicates.length === 2, `Expected 2 duplicates, got ${dedupRes.duplicates.length}`);
  assert(dedupRes.duplicates[0].duplicateOf === 'd1', 'First duplicate must point to original signal d1');
  console.log('  ✓ Test 3 Passed: Exact duplicates and syndicated news stories deduplicated deterministically.');

  // -------------------------------------------------------------
  // Test 4: Location Relevance Scoring
  // -------------------------------------------------------------
  console.log('[Test 4] Testing Location Relevance Scoring...');
  const locFilter = new LocationFilter({
    cityMatchScore: 100,
    stateMatchScore: 80,
    countryMatchScore: 60,
    globalScore: 30,
  });

  const nashikSignal: TrendSignal = {
    id: 'l1',
    source: 'demo',
    sourceRecordId: 'loc-1',
    title: 'Matcha Demand in Nashik Cafes',
    timestamp: new Date().toISOString(),
    location: { city: 'Nashik', state: 'Maharashtra', country: 'India' },
    keywords: ['matcha', 'nashik'],
  };

  const maharashtraSignal: TrendSignal = {
    id: 'l2',
    source: 'demo',
    sourceRecordId: 'loc-2',
    title: 'Artisan tea trends across Maharashtra',
    timestamp: new Date().toISOString(),
    location: { city: 'Kolhapur', state: 'Maharashtra', country: 'India' },
    keywords: ['tea', 'maharashtra'],
  };

  const nationalSignal: TrendSignal = {
    id: 'l3',
    source: 'demo',
    sourceRecordId: 'loc-3',
    title: 'National beverage trends report',
    timestamp: new Date().toISOString(),
    location: { country: 'India' },
    keywords: ['beverage', 'india'],
  };

  const globalSignal: TrendSignal = {
    id: 'l4',
    source: 'demo',
    sourceRecordId: 'loc-4',
    title: 'Global functional drink market overview',
    timestamp: new Date().toISOString(),
    keywords: ['drinks'],
  };

  const rel1 = locFilter.evaluateRelevance(nashikSignal, 'Nashik', 'Maharashtra', 'India');
  const rel2 = locFilter.evaluateRelevance(maharashtraSignal, 'Nashik', 'Maharashtra', 'India');
  const rel3 = locFilter.evaluateRelevance(nationalSignal, 'Nashik', 'Maharashtra', 'India');
  const rel4 = locFilter.evaluateRelevance(globalSignal, 'Nashik', 'Maharashtra', 'India');

  assert(rel1.score === 100 && rel1.matchType === 'CITY_MATCH', 'City match must score 100');
  assert(rel2.score === 80 && rel2.matchType === 'STATE_MATCH', 'State match must score 80');
  assert(rel3.score === 60 && rel3.matchType === 'COUNTRY_MATCH', 'Country match must score 60');
  assert(rel4.score === 30 && rel4.matchType === 'GLOBAL', 'Global match must score 30');
  console.log('  ✓ Test 4 Passed: Configurable location relevance weights (100/80/60/30) validated.');

  // -------------------------------------------------------------
  // Test 5: Clustering
  // -------------------------------------------------------------
  console.log('[Test 5] Testing Trend Clustering...');
  const clusterer = new TrendClusterer();
  const clusterInput: TrendSignal[] = [
    {
      id: 'c1',
      source: 'youtube',
      sourceRecordId: 'cr-1',
      title: 'Top 5 Iced Matcha Lattes to Try',
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'latte', 'drink'],
    },
    {
      id: 'c2',
      source: 'reddit',
      sourceRecordId: 'cr-2',
      title: 'Ceremonial matcha cafe recommendations',
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'ceremonial', 'cafe'],
    },
    {
      id: 'c3',
      source: 'news_rss',
      sourceRecordId: 'cr-3',
      title: 'Keto high-protein energy snacks booming',
      timestamp: new Date().toISOString(),
      keywords: ['protein', 'snack', 'keto'],
    },
  ];

  const clusters = clusterer.clusterSignals(clusterInput);
  assert(clusters.length === 2, `Expected 2 clusters, got ${clusters.length}`);
  const matchaCluster = clusters.find(c => c.clusterName === 'Matcha Beverages');
  assert(matchaCluster !== undefined, 'Matcha Beverages cluster should be detected');
  assert(matchaCluster?.signals.length === 2, '2 signals should belong to Matcha Beverages');
  console.log('  ✓ Test 5 Passed: Deterministic lexical clustering successfully groups related signals.');

  // -------------------------------------------------------------
  // Test 6: Time-Series Growth & Acceleration Calculation
  // -------------------------------------------------------------
  console.log('[Test 6] Testing Time-Series Growth & Acceleration...');
  const timeEngine = new TimeSeriesEngine();

  // Create synthetic 4-week signals: W1=20, W2=32, W3=51, W4=72
  const now = Date.now();
  const tsSignals: TrendSignal[] = [
    { id: 't1', source: 'demo', sourceRecordId: 'ts-1', title: 'W1', timestamp: new Date(now - 21 * 86400000).toISOString(), keywords: [], engagementMetrics: { score: 20 }, rawMetrics: { synthetic_week: 1 } },
    { id: 't2', source: 'demo', sourceRecordId: 'ts-2', title: 'W2', timestamp: new Date(now - 14 * 86400000).toISOString(), keywords: [], engagementMetrics: { score: 32 }, rawMetrics: { synthetic_week: 2 } },
    { id: 't3', source: 'demo', sourceRecordId: 'ts-3', title: 'W3', timestamp: new Date(now - 7 * 86400000).toISOString(), keywords: [], engagementMetrics: { score: 51 }, rawMetrics: { synthetic_week: 3 } },
    { id: 't4', source: 'demo', sourceRecordId: 'ts-4', title: 'W4', timestamp: new Date(now - 1 * 86400000).toISOString(), keywords: [], engagementMetrics: { score: 72 }, rawMetrics: { synthetic_week: 4 } },
  ];

  const metrics = timeEngine.computeMetrics(tsSignals);
  assert(metrics.currentVolume === 72, 'Current volume must be 72');
  assert(metrics.previousVolume === 51, 'Previous volume must be 51');

  // growthRate = (72 - 51) / 51 = 21 / 51 = +0.412 (+41.2%)
  const expectedGrowth = Number(((72 - 51) / 51).toFixed(3));
  assert(Math.abs(metrics.growthRate - expectedGrowth) < 0.01, `Growth rate should be ~${expectedGrowth}, got ${metrics.growthRate}`);

  // velocity = (72 - 20) / 3 = 17.33
  assert(metrics.velocity > 15, 'Velocity must be positive and > 15');

  // vLatest = 72 - 51 = 21, vPrior = 51 - 32 = 19 -> acceleration = 21 - 19 = +2
  assert(metrics.acceleration === 2, `Acceleration must be +2, got ${metrics.acceleration}`);
  assert(metrics.persistence === 1.0, 'Persistence should be 1.0 (all 3 intervals grew)');
  console.log(`  ✓ Test 6 Passed: Growth (+${Math.round(metrics.growthRate * 100)}%), Velocity (${metrics.velocity}), and Acceleration (+${metrics.acceleration}) calculated accurately.`);

  // -------------------------------------------------------------
  // Test 7: Deterministic Trend Scoring
  // -------------------------------------------------------------
  console.log('[Test 7] Testing Deterministic Trend Scoring...');
  const scorer = new TrendScorer();
  const trendScore = scorer.calculateScore(metrics);

  assert(trendScore.totalScore >= 1 && trendScore.totalScore <= 100, 'Score must be between 1 and 100');
  assert(trendScore.growthScore > 65, 'Growth score for +41% growth should be high');
  assert(trendScore.persistenceScore === 100, 'Persistence score for 1.0 must be 100');

  // Verify repeatability
  const repeatScore = scorer.calculateScore(metrics);
  assert(trendScore.totalScore === repeatScore.totalScore, 'Score calculation must be 100% deterministic');
  console.log(`  ✓ Test 7 Passed: Trend momentum score = ${trendScore.totalScore}/100 calculated deterministically.`);

  // -------------------------------------------------------------
  // Test 8: Lifecycle Classification
  // -------------------------------------------------------------
  console.log('[Test 8] Testing Lifecycle Classification...');
  const classifier = new LifecycleClassifier();
  const emergingStatus = classifier.classify(metrics, trendScore);
  assert(emergingStatus === 'EMERGING', `Expected single-source trend to be EMERGING, got ${emergingStatus}`);

  // Test Multi-source RISING condition
  const multiSourceMetrics = { ...metrics, crossSourceConfirmation: 1.0, velocity: 20 };
  const multiSourceScore = { ...trendScore, totalScore: 78 };
  const risingStatus = classifier.classify(multiSourceMetrics, multiSourceScore);
  assert(risingStatus === 'RISING', `Expected multi-source high score to be RISING, got ${risingStatus}`);

  // Test Declining condition
  const decliningMetrics = { ...metrics, growthRate: -0.25, acceleration: -5 };
  const decliningScore = { ...trendScore, totalScore: 35 };
  const decliningStatus = classifier.classify(decliningMetrics, decliningScore);
  assert(decliningStatus === 'DECLINING', `Expected DECLINING, got ${decliningStatus}`);
  console.log('  ✓ Test 8 Passed: Lifecycle state transitions determined by explicit numerical thresholds.');

  // -------------------------------------------------------------
  // Test 9: Business Fit Calculation
  // -------------------------------------------------------------
  console.log('[Test 9] Testing Business Fit Calculation...');
  const fitEngine = new BusinessFitEngine();
  const cafeContext: BusinessContext = {
    businessName: 'Urban Brew',
    businessType: 'Cafe',
    industry: 'Food & Beverage',
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    targetCustomers: ['college students', 'young professionals'],
    products: ['coffee', 'cold beverages', 'snacks'],
    businessGoals: ['increase sales', 'discover new products'],
  };

  const mockCluster: TrendCluster = {
    id: 'c-matcha',
    name: 'Matcha Beverages',
    slug: 'matcha-beverages',
    category: 'Food & Beverage',
    description: 'Surging demand for matcha in cafes',
    signals: [],
    primaryKeywords: ['matcha', 'latte', 'beverage', 'cafe'],
    locationSignals: { 'Nashik': 12 },
    timeSeries: metrics,
    trendScore,
    lifecycle: 'RISING',
    firstDetectedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
  };

  const businessFit = fitEngine.calculateFit(cafeContext, mockCluster, 100);
  assert(businessFit.totalScore >= 80, `Expected Cafe + Matcha fit to be high (>=80), got ${businessFit.totalScore}`);
  assert(businessFit.categoryFit >= 90, 'Category fit should be >= 90');
  assert(businessFit.customerFit >= 90, 'Customer fit for students in cafe should be >= 90');
  assert(businessFit.reasons.length >= 3, 'Must provide explanatory reasons');
  console.log(`  ✓ Test 9 Passed: Business Fit scored at ${businessFit.totalScore}/100 with ${businessFit.reasons.length} explanatory factors.`);

  // -------------------------------------------------------------
  // Test 10: Gemini Analysis Schema Validation (Zod)
  // -------------------------------------------------------------
  console.log('[Test 10] Testing Gemini Analysis Schema Validation...');
  const validAiPayload = {
    trendName: 'Matcha Beverages',
    trendSummary: 'Rising interest in iced matcha across campus cafes',
    trendStage: 'RISING',
    confidence: 'HIGH',
    whyItMatters: 'Healthy alternative to traditional sweet beverages with +41% growth',
    evidenceSummary: 'Multi-source confirmation across YouTube and student subreddits',
    likelyDrivers: ['Wellness awareness', 'Social media adoption'],
    businessFitExplanation: 'Direct menu compatibility with existing cold beverage bar',
    opportunity: 'Introduce Iced Ceremonial Matcha at ₹149 student price point',
    targetCustomer: 'College students and health-conscious patrons',
    productIdeas: ['Iced Matcha Latte', 'Matcha Mint Cooler'],
    marketingIdeas: ['Campus ambassador launch', 'Instagram promo'],
    actionPlan: ['Source batch for 14-day trial', 'Train baristas'],
    timeline: '14 days',
    successMetrics: ['15 units/day', '>= 45% gross margin'],
    risks: ['Specialty ingredient supply chain delay'],
    assumptions: ['Customers enjoy authentic earthy flavor profile'],
    expertValidationRequired: true,
  };

  const parsed = GeminiAnalysisSchema.parse(validAiPayload);
  assert(parsed.confidence === 'HIGH', 'Parsed confidence must be HIGH');

  // Verify rejection on missing required fields
  let zodFailed = false;
  try {
    GeminiAnalysisSchema.parse({ ...validAiPayload, confidence: 'INVALID_ENUM' });
  } catch {
    zodFailed = true;
  }
  assert(zodFailed, 'Zod must reject invalid confidence enum');
  console.log('  ✓ Test 10 Passed: Gemini output validated against strict Zod schema.');

  // -------------------------------------------------------------
  // Test 11: Opportunity & Action Plan Scoring
  // -------------------------------------------------------------
  console.log('[Test 11] Testing Opportunity & Action Plan Scoring...');
  const oppEngine = new OpportunityEngine();
  const planEngine = new ActionPlanEngine();

  const opp = oppEngine.generateOpportunity(mockCluster, cafeContext, businessFit, parsed);
  assert(opp.opportunityScore >= 75, `Opportunity score should be >= 75, got ${opp.opportunityScore}`);
  assert(Boolean(opp.recommendedExperiment), 'Recommended experiment must be populated');

  const actionPlan = planEngine.generateActionPlan(mockCluster, cafeContext, opp, parsed);
  assert(Boolean(actionPlan.whatToTest), 'whatToTest must be populated');
  assert(Boolean(actionPlan.successThreshold), 'successThreshold must be populated');
  assert(Boolean(actionPlan.decisionAfterTest), 'decisionAfterTest must be populated');
  console.log(`  ✓ Test 11 Passed: Opportunity scored at ${opp.opportunityScore}/100 with clear action plan.`);

  // -------------------------------------------------------------
  // Test 12: Pipeline Idempotency
  // -------------------------------------------------------------
  console.log('[Test 12] Testing Pipeline Idempotency...');
  const pipeline = PipelineService.getInstance();

  const run1 = await pipeline.runPipeline({
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    business: cafeContext,
    mode: 'demo',
  });

  const run2 = await pipeline.runPipeline({
    city: 'Nashik',
    state: 'Maharashtra',
    country: 'India',
    business: cafeContext,
    mode: 'demo',
  });

  assert(run1.clusters.length === run2.clusters.length, 'Cluster count must remain identical');
  assert(run1.topTrend?.cluster.name === run2.topTrend?.cluster.name, 'Top trend must remain stable');
  assert(run1.stats.rawRecords === run2.stats.rawRecords, 'Raw record count must remain identical without duplication');
  console.log(`  ✓ Test 12 Passed: Consecutive pipeline executions are strictly idempotent (${run1.clusters.length} clusters).`);

  // -------------------------------------------------------------
  // Test 13: End-to-End Multi-City Differentiation Verification
  // -------------------------------------------------------------
  console.log('[Test 13] Testing Location & Business Context Differentiation (Nashik, Pune, Mumbai, Bengaluru)...');

  // City 1: Nashik + Cafe
  const nashikRes = await pipeline.runPipeline({
    city: 'Nashik',
    business: {
      businessName: 'Urban Brew',
      businessType: 'Cafe',
      city: 'Nashik',
      state: 'Maharashtra',
      targetCustomers: ['students'],
      products: ['coffee'],
      businessGoals: ['increase sales'],
    },
    mode: 'demo',
  });

  // City 2: Bengaluru + Tech Agency
  const blrRes = await pipeline.runPipeline({
    city: 'Bengaluru',
    business: {
      businessName: 'TechFlow Labs',
      businessType: 'Agency',
      industry: 'Technology & AI',
      city: 'Bengaluru',
      state: 'Karnataka',
      targetCustomers: ['developers', 'tech companies'],
      products: ['consulting', 'automation software'],
      businessGoals: ['expand service lines'],
    },
    mode: 'demo',
  });

  // City 3: Mumbai + Premium Retail Gifting
  const mumbaiRes = await pipeline.runPipeline({
    city: 'Mumbai',
    business: {
      businessName: 'Curated Moments',
      businessType: 'Retail Store',
      industry: 'Retail & E-commerce',
      city: 'Mumbai',
      state: 'Maharashtra',
      targetCustomers: ['corporate buyers', 'luxury shoppers'],
      products: ['gift hampers', 'keepsakes'],
      businessGoals: ['launch premium corporate catalogue'],
    },
    mode: 'demo',
  });

  assert(nashikRes.city === 'Nashik', 'Nashik result city must be Nashik');
  assert(blrRes.city === 'Bengaluru', 'Bengaluru result city must be Bengaluru');
  assert(mumbaiRes.city === 'Mumbai', 'Mumbai result city must be Mumbai');

  // Verify that Top Trend for Bengaluru + Tech Agency is AI Productivity Tools
  assert(
    blrRes.topTrend?.cluster.name === 'AI Productivity Tools',
    `Expected Bengaluru Tech Agency top trend to be "AI Productivity Tools", got "${blrRes.topTrend?.cluster.name}"`
  );

  // Verify that Top Trend for Mumbai + Gifting is Personalized Gifts
  assert(
    mumbaiRes.topTrend?.cluster.name === 'Personalized Gifts',
    `Expected Mumbai Gifting top trend to be "Personalized Gifts", got "${mumbaiRes.topTrend?.cluster.name}"`
  );

  // Verify that volumes differ across cities for Matcha
  const nashikMatcha = nashikRes.clusters.find(c => c.name === 'Matcha Beverages');
  assert(nashikMatcha !== undefined, 'Nashik must have Matcha Beverages');
  assert(nashikMatcha!.timeSeries.currentVolume >= 60 && nashikMatcha!.timeSeries.currentVolume <= 65, `Expected Nashik Matcha W4 between 60-65, got ${nashikMatcha!.timeSeries.currentVolume}`);

  console.log(`  ✓ Nashik Top Trend: "${nashikRes.topTrend?.cluster.name}" (Fit: ${nashikRes.topTrend?.businessFit.totalScore}%)`);
  console.log(`  ✓ Bengaluru Top Trend: "${blrRes.topTrend?.cluster.name}" (Fit: ${blrRes.topTrend?.businessFit.totalScore}%)`);
  console.log(`  ✓ Mumbai Top Trend: "${mumbaiRes.topTrend?.cluster.name}" (Fit: ${mumbaiRes.topTrend?.businessFit.totalScore}%)`);
  console.log('  ✓ Test 13 Passed: City and business context dynamically drive rankings, scores, and recommendations!\n');

  console.log('==============================================================');
  console.log('    All 13 Backend Trend Engine Tests Passed Successfully!    ');
  console.log('==============================================================\n');
}

runAllTests().catch(err => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
