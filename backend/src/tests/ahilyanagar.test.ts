import assert from 'assert';
import { LocationFilter } from '../pipeline/location/location-filter';
import { NewsRSSConnector } from '../connectors/news/news-rss.connector';
import { YouTubeConnector } from '../connectors/youtube/youtube.connector';
import { RedditConnector } from '../connectors/reddit/reddit.connector';
import { GoogleTrendsConnector } from '../connectors/google-trends/google-trends.connector';
import { PipelineService } from '../pipeline/pipeline.service';
import { TrendSignal, BusinessContext } from '../models/intelligence-pipeline.types';

async function runAhilyanagarTestSuite() {
  console.log('\n=============================================================');
  console.log('  T→G Trend Intelligence Engine — Ahilyanagar Test Suite');
  console.log('  Target: Ahilyanagar (Ahmednagar), Maharashtra, India');
  console.log('=============================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    totalTests++;
    return (async () => {
      try {
        await fn();
        console.log(`  [PASS] Test ${totalTests}: ${name}`);
        passedTests++;
      } catch (err) {
        console.error(`  [FAIL] Test ${totalTests}: ${name}`);
        console.error('         Error:', err instanceof Error ? err.message : err);
        throw err;
      }
    })();
  }

  // --- 1. LOCATION RELEVANCE & METROPOLITAN FILTERING ---
  console.log('--- Suite 1: Location Relevance & Non-Ahilyanagar Filtering ---');

  await test('Direct Ahilyanagar city and locality matches receive highest relevance (100 / 1.0)', () => {
    const filter = new LocationFilter();
    const ahilyanagarSignal: TrendSignal = {
      id: 'sig-loc-1',
      source: 'news-rss',
      sourceRecordId: 'news-1',
      title: 'Artisan cafe opens on Pipeline Road in Savedi, Ahilyanagar',
      timestamp: new Date().toISOString(),
      location: { city: 'Ahilyanagar', state: 'Maharashtra', country: 'India' },
      keywords: ['cafe', 'savedi', 'pipeline road'],
    };

    const res = filter.evaluateRelevance(ahilyanagarSignal, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.locationRelevance, 1.0);
    assert.strictEqual(res.matchType, 'CITY_MATCH');
    assert.strictEqual(res.locationReason, 'Ahilyanagar-specific signal');
  });

  await test('Historical alias "Ahmednagar" receives highest relevance (100 / 1.0)', () => {
    const filter = new LocationFilter();
    const ahmednagarSignal: TrendSignal = {
      id: 'sig-loc-2',
      source: 'news-rss',
      sourceRecordId: 'news-2',
      title: 'Ahmednagar wholesale market reports spike in organic jowar sales',
      timestamp: new Date().toISOString(),
      location: { city: 'Ahmednagar', state: 'Maharashtra', country: 'India' },
      keywords: ['wholesale market', 'organic', 'jowar'],
    };

    const res = filter.evaluateRelevance(ahmednagarSignal, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(res.score, 100);
    assert.strictEqual(res.locationRelevance, 1.0);
    assert.strictEqual(res.matchType, 'CITY_MATCH');
    assert.strictEqual(res.locationReason, 'Ahilyanagar-specific signal');
  });

  await test('Ahilyanagar district talukas (Shirdi, Sangamner, Shrirampur) receive high relevance (85 / 0.85)', () => {
    const filter = new LocationFilter();
    const shirdiSignal: TrendSignal = {
      id: 'sig-loc-3',
      source: 'youtube',
      sourceRecordId: 'yt-1',
      title: 'Eco-friendly pilgrimage packaging trends in Shirdi tourism corridor',
      timestamp: new Date().toISOString(),
      location: { city: 'Shirdi', state: 'Maharashtra', country: 'India' },
      keywords: ['shirdi', 'pilgrimage', 'packaging'],
    };

    const res = filter.evaluateRelevance(shirdiSignal, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(res.score, 85);
    assert.strictEqual(res.locationRelevance, 0.85);
    assert.strictEqual(res.matchType, 'DISTRICT_MATCH');
    assert.strictEqual(res.locationReason, 'Ahilyanagar district signal');
  });

  await test('Competing metros (Pune, Mumbai, Bengaluru) are flagged as OTHER_CITY (10 / 0.10) and filtered out', () => {
    const filter = new LocationFilter();
    const puneSignal: TrendSignal = {
      id: 'sig-loc-4',
      source: 'news-rss',
      sourceRecordId: 'news-pune',
      title: 'Specialty cold brew coffee trend takes over FC Road Pune',
      timestamp: new Date().toISOString(),
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      keywords: ['pune', 'cold brew'],
    };

    const res = filter.evaluateRelevance(puneSignal, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(res.score, 10);
    assert.strictEqual(res.locationRelevance, 0.10);
    assert.strictEqual(res.matchType, 'OTHER_CITY');

    // Test filterAndRank strictly drops OTHER_CITY signals for Ahilyanagar
    const signals: TrendSignal[] = [
      puneSignal,
      {
        id: 'sig-loc-5',
        source: 'news-rss',
        sourceRecordId: 'news-5',
        title: 'Local dairy producers expand in Kedgaon, Ahilyanagar',
        timestamp: new Date().toISOString(),
        location: { city: 'Ahilyanagar', state: 'Maharashtra', country: 'India' },
        keywords: ['dairy', 'kedgaon'],
      },
    ];

    const filtered = filter.filterAndRank(signals, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(filtered.length, 1);
    assert.strictEqual(filtered[0].signal.id, 'sig-loc-5');
    assert.strictEqual(filtered[0].matchType, 'CITY_MATCH');
  });

  await test('State and national signals receive appropriately lower calibrated relevance (55 and 25)', () => {
    const filter = new LocationFilter();
    const stateSignal: TrendSignal = {
      id: 'sig-loc-6',
      source: 'news-rss',
      sourceRecordId: 'news-6',
      title: 'Maharashtra government announces new incentive for agro-processing units',
      timestamp: new Date().toISOString(),
      location: { city: '', state: 'Maharashtra', country: 'India' },
      keywords: ['maharashtra', 'agro-processing'],
    };

    const resState = filter.evaluateRelevance(stateSignal, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(resState.score, 55);
    assert.strictEqual(resState.locationRelevance, 0.55);
    assert.strictEqual(resState.matchType, 'STATE_MATCH');

    const nationalSignal: TrendSignal = {
      id: 'sig-loc-7',
      source: 'news-rss',
      sourceRecordId: 'news-7',
      title: 'All-India retail consumer trends show shift to millet snacks',
      timestamp: new Date().toISOString(),
      location: { city: '', state: '', country: 'India' },
      keywords: ['india', 'millet snacks'],
    };

    const resNat = filter.evaluateRelevance(nationalSignal, 'Ahilyanagar', 'Maharashtra', 'India');
    assert.strictEqual(resNat.score, 25);
    assert.strictEqual(resNat.locationRelevance, 0.25);
    assert.strictEqual(resNat.matchType, 'COUNTRY_MATCH');
  });

  // --- 2. REAL DATA CONNECTORS & UNCONFIGURED HANDLING ---
  console.log('\n--- Suite 2: Real Data Connectors & Compliance ---');

  await test('NewsRSSConnector connects to live permitted RSS feed for Ahilyanagar and normalizes signals', async () => {
    const connector = new NewsRSSConnector();
    assert.strictEqual(connector.isConfigured(), true);

    const health = await connector.healthCheck();
    assert.strictEqual(health.healthy, true);

    const records = await connector.fetchSignals({
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      country: 'India',
      limit: 10,
    });

    assert.ok(Array.isArray(records));
    assert.ok(records.length > 0, 'Expected live news records for Ahilyanagar/Ahmednagar');
    const first = records[0];
    assert.ok(first.title);
    assert.ok(first.url);
    assert.ok(first.source === 'news_rss' || first.source === 'news-rss');
    assert.strictEqual(first.location?.city, 'Ahilyanagar');
  });

  await test('YouTubeConnector reports NOT_CONFIGURED when YOUTUBE_API_KEY is not set', async () => {
    const connector = new YouTubeConnector();
    const hasKey = Boolean(process.env.YOUTUBE_API_KEY);
    assert.strictEqual(connector.isConfigured(), hasKey);

    const health = await connector.healthCheck();
    if (!hasKey) {
      assert.strictEqual(health.healthy, false);
      assert.strictEqual(health.status, 'NOT_CONFIGURED');
    }
  });

  await test('RedditConnector reports NOT_CONFIGURED when client credentials are not set', async () => {
    const connector = new RedditConnector();
    const hasCreds = Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
    assert.strictEqual(connector.isConfigured(), hasCreds);

    const health = await connector.healthCheck();
    if (!hasCreds) {
      assert.strictEqual(health.healthy, false);
      assert.strictEqual(health.status, 'NOT_CONFIGURED');
    }
  });

  await test('GoogleTrendsConnector reports NOT_CONFIGURED when GOOGLE_TRENDS_API_KEY is not set', async () => {
    const connector = new GoogleTrendsConnector();
    const hasKey = Boolean(process.env.GOOGLE_TRENDS_API_KEY);
    assert.strictEqual(connector.isConfigured(), hasKey);

    const health = await connector.healthCheck();
    if (!hasKey) {
      assert.strictEqual(health.healthy, false);
      assert.strictEqual(health.status, 'NOT_CONFIGURED');
    }
  });

  // --- 3. END-TO-END DEMO MODE WITH AHILYANAGAR PROFILES ---
  console.log('\n--- Suite 3: End-to-End DEMO Mode Pipeline Execution ---');

  await test('Pipeline executes end-to-end in DEMO mode strictly for Ahilyanagar with explainable metrics', async () => {
    const service = PipelineService.getInstance();
    const businessContext: BusinessContext = {
      businessName: 'Nagar Cafe & Roastery',
      businessType: 'Beverages & Casual Dining',
      industry: 'Food & Beverage',
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      country: 'India',
      targetCustomers: ['College students', 'Young professionals', 'Families'],
      products: ['Coffee', 'Cold drinks', 'Quick bites'],
      preferredCategories: ['Food & Beverage', 'Retail Trends'],
    };

    const res = await service.runPipeline({
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      country: 'India',
      business: businessContext,
      mode: 'demo',
    });

    assert.strictEqual(res.city, 'Ahilyanagar');
    assert.strictEqual(res.state, 'Maharashtra');
    assert.strictEqual(res.dataMode, 'DEMO');
    assert.strictEqual(res.notice, 'DEMO DATA — NOT LIVE');
    assert.ok((res.stats.signalsCreated ?? 0) > 0);
    assert.ok(res.clusters.length > 0);
    assert.ok(res.analyzedTrends.length > 0);

    const top = res.topTrend;
    assert.ok(top);
    assert.ok(top.locationRelevance >= 0.80);
    assert.ok(top.locationReason);
    assert.ok(top.evidence && top.evidence.length > 0);
    assert.ok(top.evidence[0].locationRelevance !== undefined);
    assert.ok(top.evidence[0].locationReason);
    assert.ok(top.opportunity);
    assert.ok(top.actionPlan);
  });

  // --- 4. END-TO-END LIVE MODE PIPELINE EXECUTION ---
  console.log('\n--- Suite 4: End-to-End LIVE Mode Pipeline Execution ---');

  await test('Pipeline executes in LIVE mode for Ahilyanagar pulling real news and maintaining source audit', async () => {
    const service = PipelineService.getInstance();
    const businessContext: BusinessContext = {
      businessName: 'Shree Agro-Retail Ahilyanagar',
      businessType: 'Agro Retail & Food Processing',
      industry: 'Agribusiness',
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      country: 'India',
      targetCustomers: ['Local consumers', 'Farmers', 'Hospitality'],
      preferredCategories: ['Business & Retail', 'Agriculture'],
    };

    const res = await service.runPipeline({
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      country: 'India',
      business: businessContext,
      mode: 'live',
    });

    assert.strictEqual(res.city, 'Ahilyanagar');
    assert.strictEqual(res.dataMode, 'LIVE');
    assert.strictEqual(res.notice, 'LIVE MARKET DATA');

    // Sources verification: news-rss succeeded, unconfigured reported NOT_CONFIGURED
    const newsStatus = res.sources.find(s => s.sourceId.includes('news-rss'));
    assert.ok(newsStatus);
    assert.strictEqual(newsStatus.status, 'SUCCESS');
    assert.ok(newsStatus.recordsFetched > 0);

    const ytStatus = res.sources.find(s => s.sourceId.includes('youtube'));
    assert.ok(ytStatus);
    if (!process.env.YOUTUBE_API_KEY) {
      assert.strictEqual(ytStatus.status, 'NOT_CONFIGURED');
    }

    // Check stats & repository record
    assert.ok(res.stats.rawRecords > 0);
    assert.ok(res.stats.validRecords > 0);
    assert.ok(res.clusters.length > 0);
    assert.ok(res.analyzedTrends.length > 0);

    // Verify top trend evidence
    const top = res.topTrend;
    assert.ok(top);
    assert.ok(top.cluster.timeSeries.growthRate !== undefined);
    assert.ok(top.cluster.trendScore.totalScore > 0);
    assert.ok(top.opportunity);
    assert.ok(top.actionPlan);
  });

  // --- 5. PREDICTION LANGUAGE SANITY CHECK ---
  console.log('\n--- Suite 5: Probabilistic Prediction Language Checks ---');

  await test('Prediction outputs use probabilistic terms and avoid deterministic claims', async () => {
    const service = PipelineService.getInstance();
    const res = await service.runPipeline({
      city: 'Ahilyanagar',
      state: 'Maharashtra',
      country: 'India',
      mode: 'demo',
    });

    for (const t of res.analyzedTrends) {
      const summary = t.aiAnalysis?.trendSummary || '';
      const whyItMatters = t.aiAnalysis?.whyItMatters || '';
      const text = `${summary} ${whyItMatters}`.toLowerCase();

      assert.ok(!text.includes('will definitely become viral'), 'Found forbidden deterministic claim');
      assert.ok(!text.includes('guaranteed 100% success'), 'Found forbidden deterministic claim');
    }
  });

  console.log('\n=============================================================');
  console.log(`  Ahilyanagar Test Suite Completed: ${passedTests}/${totalTests} Tests Passed`);
  console.log('=============================================================\n');
}

runAhilyanagarTestSuite().catch(err => {
  console.error('\nFatal test failure:', err);
  process.exit(1);
});
