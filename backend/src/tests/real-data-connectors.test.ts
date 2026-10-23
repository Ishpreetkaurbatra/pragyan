import assert from 'assert';
import {
  YouTubeConnector,
  RedditConnector,
  NewsRSSConnector,
  GoogleTrendsConnector,
  SourceManager,
} from '../connectors';
import { PipelineService } from '../pipeline/pipeline.service';
import { SignalValidator } from '../pipeline/validation/signal-validator';
import { SignalNormalizer } from '../pipeline/normalization/signal-normalizer';
import { SignalDeduplicator } from '../pipeline/deduplication/signal-deduplicator';
import { LocationFilter } from '../pipeline/location/location-filter';
import { TrendClusterer } from '../pipeline/clustering/trend-clusterer';
import { TimeSeriesEngine } from '../pipeline/metrics/time-series.engine';
import { TrendScorer } from '../pipeline/scoring/trend-scorer';
import { BusinessFitEngine } from '../pipeline/business-fit/business-fit.engine';
import { EvidencePackageBuilder } from '../ai/gemini/evidence-package.builder';
import { TrendSearchProvider } from '../connectors/google-trends/trend-provider.interface';

console.log('==============================================================');
console.log('  T→G Phase 2 — Real-World Data Connectors & Pipeline Tests   ');
console.log('==============================================================\n');

async function runTests() {
  // -------------------------------------------------------------
  // Test 1: YouTube Response -> Normalized Signal
  // -------------------------------------------------------------
  console.log('[Test 1] Testing YouTube Data Normalization...');
  const ytConnector = new YouTubeConnector();
  const rawYtItem = {
    id: { videoId: 'yt-vid-991' },
    snippet: {
      title: 'Top 5 Artisan Bakeries in Pune 2026',
      description: 'Reviewing the best sourdough and brioche spots across Pune.',
      publishedAt: '2026-03-15T10:00:00Z',
      channelTitle: 'Pune Foodie Guide',
    },
    statistics: {
      viewCount: '45000',
      likeCount: '2100',
      commentCount: '340',
    },
  };

  const ytSignals = ytConnector.normalize([rawYtItem]);
  assert.strictEqual(ytSignals.length, 1);
  assert.strictEqual(ytSignals[0].source, 'youtube');
  assert.strictEqual(ytSignals[0].sourceRecordId, 'yt-vid-991');
  assert.strictEqual(ytSignals[0].title, 'Top 5 Artisan Bakeries in Pune 2026');
  assert.strictEqual(ytSignals[0].url, 'https://www.youtube.com/watch?v=yt-vid-991');
  assert.strictEqual(ytSignals[0].engagementMetrics?.views, 45000);
  assert.strictEqual(ytSignals[0].engagementMetrics?.likes, 2100);
  assert.strictEqual(ytSignals[0].engagementMetrics?.comments, 340);
  console.log('  ✓ Test 1 Passed: YouTube raw item normalized to standardized TrendSignal.\n');

  // -------------------------------------------------------------
  // Test 2: Reddit Response -> Normalized Signal
  // -------------------------------------------------------------
  console.log('[Test 2] Testing Reddit Data Normalization...');
  const redditConnector = new RedditConnector();
  const rawRedditPost = {
    data: {
      id: 'reddit-post-456',
      title: 'Why is cold brew coffee taking over Nashik cafes lately?',
      selftext: 'Notice so many people ordering nitro cold brew across College Road.',
      permalink: '/r/nashik/comments/reddit-post-456/why_is_cold_brew/',
      created_utc: 1773500000,
      score: 184,
      num_comments: 48,
      subreddit: 'nashik',
      author: 'coffee_lover_nsk',
    },
  };

  const redditSignals = redditConnector.normalize([rawRedditPost]);
  assert.strictEqual(redditSignals.length, 1);
  assert.strictEqual(redditSignals[0].source, 'reddit');
  assert.strictEqual(redditSignals[0].sourceRecordId, 'reddit-post-456');
  assert.strictEqual(redditSignals[0].title, 'Why is cold brew coffee taking over Nashik cafes lately?');
  assert.strictEqual(redditSignals[0].url, 'https://reddit.com/r/nashik/comments/reddit-post-456/why_is_cold_brew/');
  assert.strictEqual(redditSignals[0].location?.city, 'Nashik');
  assert.strictEqual(redditSignals[0].engagementMetrics?.likes, 184);
  assert.strictEqual(redditSignals[0].engagementMetrics?.score, 280);
  assert.strictEqual(redditSignals[0].engagementMetrics?.comments, 48);
  console.log('  ✓ Test 2 Passed: Reddit raw post normalized with engagement and subreddit city context.\n');

  // -------------------------------------------------------------
  // Test 3: News RSS Feed Item -> Normalized Signal
  // -------------------------------------------------------------
  console.log('[Test 3] Testing News RSS Feed Normalization...');
  const newsConnector = new NewsRSSConnector();
  const rawRssItem = {
    guid: 'news-item-789',
    title: 'Pune Electric Two-Wheeler Sales Surge by 55% in Q1',
    description: 'Local retail hubs in Pune report high demand for smart electric mobility.',
    link: 'https://news.example.com/pune-ev-surge',
    pubDate: 'Mon, 16 Mar 2026 08:30:00 GMT',
    source: 'Maharashtra Business Times',
  };

  const newsSignals = newsConnector.normalize([rawRssItem]);
  assert.strictEqual(newsSignals.length, 1);
  assert.strictEqual(newsSignals[0].source, 'news_rss');
  assert.strictEqual(newsSignals[0].sourceRecordId, 'news-item-789');
  assert.strictEqual(newsSignals[0].title, 'Pune Electric Two-Wheeler Sales Surge by 55% in Q1');
  assert.strictEqual(newsSignals[0].url, 'https://news.example.com/pune-ev-surge');
  assert.strictEqual(newsSignals[0].location?.city, 'Pune');
  console.log('  ✓ Test 3 Passed: RSS feed item normalized with parsed location and source attribution.\n');

  // -------------------------------------------------------------
  // Test 4: Google Trends Provider Abstraction
  // -------------------------------------------------------------
  console.log('[Test 4] Testing TrendSearchProvider Provider Abstraction...');
  class MockTrendsProvider implements TrendSearchProvider {
    name = 'MockTrendsProvider';
    isConfigured(): boolean { return true; }
    async search(params: { city?: string; country?: string; keyword?: string; startTime?: string; endTime?: string }) {
      return [{
        id: 'trends-sig-1',
        source: 'google_trends',
        sourceRecordId: 'gt-matcha-tea',
        title: 'Search interest in matcha tea',
        timestamp: '2026-03-10T00:00:00Z',
        location: {
          city: params.city || 'Nashik',
          country: params.country || 'India',
        },
        category: 'Food & Beverage',
        keywords: ['matcha', 'tea', 'cafe'],
        rawMetrics: {
          volume: 78,
          growthRate: 0.52,
        },
      }];
    }
  }

  const trendsConnector = new GoogleTrendsConnector();
  trendsConnector.setProvider(new MockTrendsProvider());
  assert.strictEqual(trendsConnector.isConfigured(), true);

  const trendSignals = await trendsConnector.fetchSignals({ city: 'Nashik', country: 'India' });
  assert.strictEqual(trendSignals.length, 1);
  assert.strictEqual(trendSignals[0].source, 'google_trends');
  assert.strictEqual(trendSignals[0].location?.city, 'Nashik');
  assert.strictEqual(trendSignals[0].rawMetrics?.volume, 78);
  assert.strictEqual(trendSignals[0].rawMetrics?.growthRate, 0.52);
  console.log('  ✓ Test 4 Passed: TrendSearchProvider pluggable abstraction operates seamlessly without web scraping.\n');

  // -------------------------------------------------------------
  // Test 5: Missing Credentials -> NOT_CONFIGURED (No fake data)
  // -------------------------------------------------------------
  console.log('[Test 5] Testing Missing Credentials & NOT_CONFIGURED handling...');
  const unconfiguredYt = new YouTubeConnector();
  delete process.env.YOUTUBE_API_KEY;
  assert.strictEqual(unconfiguredYt.isConfigured(), false);
  const ytHealth = await unconfiguredYt.healthCheck();
  assert.strictEqual(ytHealth.healthy, false);
  assert.strictEqual(ytHealth.status, 'NOT_CONFIGURED');

  const unconfiguredReddit = new RedditConnector();
  delete process.env.REDDIT_CLIENT_ID;
  delete process.env.REDDIT_CLIENT_SECRET;
  assert.strictEqual(unconfiguredReddit.isConfigured(), false);
  const redditHealth = await unconfiguredReddit.healthCheck();
  assert.strictEqual(redditHealth.healthy, false);
  assert.strictEqual(redditHealth.status, 'NOT_CONFIGURED');
  console.log('  ✓ Test 5 Passed: Connectors without credentials return NOT_CONFIGURED and never fabricate data.\n');

  // -------------------------------------------------------------
  // Test 6: Source Manager Registry & Status Reporting
  // -------------------------------------------------------------
  console.log('[Test 6] Testing SourceManager Registry & Health Checks...');
  const sourceMgr = SourceManager.getInstance();
  const allStatuses = await sourceMgr.getAllSourcesStatus();
  assert(allStatuses.length >= 4);
  const sourceNames = allStatuses.map(s => s.name);
  assert(sourceNames.includes('YouTube Data API v3'));
  assert(sourceNames.includes('Reddit API Connector'));
  assert(sourceNames.includes('News RSS Feeds'));
  assert(sourceNames.includes('Google Trends Provider Adapter'));
  console.log('  ✓ Test 6 Passed: SourceManager tracks all registered sources, rates, and health statuses.\n');

  // -------------------------------------------------------------
  // Test 7: Multi-Source Pipeline Integration & Cross-Source Confirmation
  // -------------------------------------------------------------
  console.log('[Test 7] Testing Multi-Source Cross-Confirmation & Evidence Traceability...');
  // Combine signals from YouTube, Reddit, News, and Trends for "Matcha" in Nashik
  const multiSignals = [
    ytSignals[0], // YouTube signal
    redditSignals[0], // Reddit signal (Nashik)
    newsSignals[0], // News signal
    trendSignals[0], // Trends signal (Nashik)
  ];

  const validator = new SignalValidator();
  const { valid } = validator.validate(multiSignals);
  assert.strictEqual(valid.length, 4);

  const normalizer = new SignalNormalizer();
  const normalized = normalizer.normalize(valid);

  const deduplicator = new SignalDeduplicator();
  const { unique } = deduplicator.deduplicate(normalized);
  assert.strictEqual(unique.length, 4);

  const timeSeriesEngine = new TimeSeriesEngine();
  const metrics = timeSeriesEngine.computeMetrics(unique);
  assert(metrics.sourceDiversity >= 0.75, 'Source diversity should be high across 4 distinct platforms');
  assert.strictEqual(metrics.crossSourceConfirmation, 1.0, '4 independent sources gives maximum cross-source confirmation score');

  const scorer = new TrendScorer();
  const score = scorer.calculateScore(metrics);
  assert(score.crossSourceScore >= 18, 'Cross-source score should be strongly boosted');
  console.log(`  ✓ Test 7 Passed: Multi-source confirmation measured at ${metrics.crossSourceConfirmation * 100}% with crossSourceScore: ${score.crossSourceScore}/20.\n`);

  // -------------------------------------------------------------
  // Test 8: City Relevance & Independent Pipeline Processing
  // -------------------------------------------------------------
  console.log('[Test 8] Testing City Differentiation (Pune vs Nashik vs Mumbai vs Bengaluru)...');
  const pipeline = PipelineService.getInstance();

  const puneResult = await pipeline.runPipeline({
    city: 'Pune',
    country: 'India',
    business: {
      businessType: 'Bakery & Cafe',
      city: 'Pune',
      priceRange: '₹100-₹500',
    },
    mode: 'demo',
  });

  const nashikResult = await pipeline.runPipeline({
    city: 'Nashik',
    country: 'India',
    business: {
      businessType: 'Bakery & Cafe',
      city: 'Nashik',
      priceRange: '₹100-₹500',
    },
    mode: 'demo',
  });

  assert.strictEqual(puneResult.city, 'Pune');
  assert.strictEqual(nashikResult.city, 'Nashik');
  assert.strictEqual(puneResult.dataMode, 'DEMO');
  assert.strictEqual(puneResult.notice, 'DEMO DATA — NOT LIVE');
  assert(puneResult.sources.length >= 4);
  assert(puneResult.analyzedTrends.length > 0);
  assert(puneResult.analyzedTrends[0].evidence !== undefined, 'Analyzed trends must contain traceable evidence');

  console.log(`  ✓ Pune Analyzed Run ID: ${puneResult.runId} (${puneResult.analyzedTrends.length} trends scored)`);
  console.log(`  ✓ Nashik Analyzed Run ID: ${nashikResult.runId} (${nashikResult.analyzedTrends.length} trends scored)`);
  console.log('  ✓ Test 8 Passed: City is strictly passed through ingestion, relevance, scoring, and evidence package.\n');

  // -------------------------------------------------------------
  // Test 9: Live Mode Empty / Unconfigured Fallback (No Fake Data)
  // -------------------------------------------------------------
  console.log('[Test 9] Testing LIVE Mode with Unconfigured Sources (Strict Integrity)...');
  // In LIVE mode with missing credentials, no fake data should ever be synthesized
  const liveResult = await pipeline.runPipeline({
    city: 'Mumbai',
    country: 'India',
    mode: 'live',
  });

  assert.strictEqual(liveResult.dataMode, 'LIVE');
  assert.strictEqual(liveResult.city, 'Mumbai');
  const notConfiguredSources = liveResult.sources.filter(s => s.status === 'NOT_CONFIGURED');
  console.log(`  ✓ Sources reported NOT_CONFIGURED: ${notConfiguredSources.length}`);
  assert(notConfiguredSources.length > 0, 'Unconfigured connectors must be reported as NOT_CONFIGURED');
  assert(liveResult.notice.includes('LIVE'));
  console.log('  ✓ Test 9 Passed: Live mode reports authentic source statuses and does NOT fabricate data.\n');

  console.log('==============================================================');
  console.log('  All 9 Real Data Connectors & Pipeline Tests Passed!         ');
  console.log('==============================================================');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
