import {
  BusinessContext,
  TrendSignal,
  TrendCluster,
  AnalyzedTrendResult,
  PipelineStats,
  SourceExecutionStatus,
  TraceableEvidenceRecord,
} from '../models/intelligence-pipeline.types';
import {
  DemoConnector,
  YouTubeConnector,
  RedditConnector,
  NewsRSSConnector,
  GoogleTrendsConnector,
  DataSourceConnector,
  SourceManager,
} from '../connectors';
import { SignalValidator } from './validation/signal-validator';
import { SignalNormalizer } from './normalization/signal-normalizer';
import { SignalDeduplicator } from './deduplication/signal-deduplicator';
import { LocationFilter } from './location/location-filter';
import { TrendClusterer } from './clustering/trend-clusterer';
import { TimeSeriesEngine } from './metrics/time-series.engine';
import { TrendScorer } from './scoring/trend-scorer';
import { LifecycleClassifier } from './lifecycle/lifecycle-classifier';
import { BusinessFitEngine } from './business-fit/business-fit.engine';
import { HighValueSelector } from './high-value/high-value-selector';
import { EvidencePackageBuilder } from '../ai/gemini/evidence-package.builder';
import { GeminiTrendAnalyzer } from '../ai/gemini/gemini-analyzer.service';
import { OpportunityEngine } from '../opportunities/opportunity.engine';
import { ActionPlanEngine } from '../action-plans/action-plan.engine';
import { PipelineRepository } from '../repositories/pipeline.repository';

export interface PipelineExecutionOptions {
  city: string;
  state?: string;
  country?: string;
  business?: BusinessContext;
  mode?: 'demo' | 'live';
  maxTrendsToAnalyze?: number;
}

export interface PipelineRunResult {
  runId: string;
  city: string;
  state?: string;
  country: string;
  mode: string;
  dataMode: 'LIVE' | 'DEMO';
  sources: SourceExecutionStatus[];
  stats: PipelineStats;
  clusters: TrendCluster[];
  analyzedTrends: AnalyzedTrendResult[];
  topTrend?: AnalyzedTrendResult;
  notice: string;
}

export class PipelineService {
  private static instance: PipelineService;

  private demoConnector: DemoConnector;
  private liveConnectors: DataSourceConnector[];
  private signalCache = new Map<string, { timestamp: number; signals: TrendSignal[] }>();

  private validator = new SignalValidator();
  private normalizer = new SignalNormalizer();
  private deduplicator = new SignalDeduplicator();
  private locationFilter = new LocationFilter();
  private clusterer = new TrendClusterer();
  private timeSeriesEngine = new TimeSeriesEngine();
  private scorer = new TrendScorer();
  private lifecycleClassifier = new LifecycleClassifier();
  private businessFitEngine = new BusinessFitEngine();
  private highValueSelector = new HighValueSelector();
  private packageBuilder = new EvidencePackageBuilder();
  private geminiAnalyzer = new GeminiTrendAnalyzer();
  private opportunityEngine = new OpportunityEngine();
  private actionPlanEngine = new ActionPlanEngine();
  private repo = PipelineRepository.getInstance();

  private constructor() {
    this.demoConnector = new DemoConnector();
    this.liveConnectors = [
      new YouTubeConnector(),
      new RedditConnector(),
      new NewsRSSConnector(),
      new GoogleTrendsConnector(),
    ];
  }

  public static getInstance(): PipelineService {
    if (!PipelineService.instance) {
      PipelineService.instance = new PipelineService();
    }
    return PipelineService.instance;
  }

  /**
   * Executes the end-to-end Trend Intelligence Pipeline deterministically.
   */
  public async runPipeline(options: PipelineExecutionOptions): Promise<PipelineRunResult> {
    const city = options.city.trim();
    const state = options.state?.trim();
    const country = options.country?.trim() || 'India';

    // Step 12: LIVE vs DEMO determination
    // If DEMO_MODE env is false and mode is not demo, or mode is explicitly 'live'
    const envDemoMode = process.env.DEMO_MODE === 'true';
    const requestedMode = options.mode?.toLowerCase();
    const isLive = requestedMode === 'live' || (requestedMode !== 'demo' && !envDemoMode);
    const dataMode: 'LIVE' | 'DEMO' = isLive ? 'LIVE' : 'DEMO';
    const mode = dataMode;

    const pipelineRun = this.repo.createRun(city, state, country, mode);

    const sources: SourceExecutionStatus[] = [];
    const sourcesAttempted: string[] = [];
    const sourcesSucceeded: string[] = [];
    const sourcesFailed: string[] = [];
    const errors: string[] = [];
    let rawSignals: TrendSignal[] = [];

    try {
      // 1. DATA INGESTION: Collect signals according to dataMode
      if (!isLive) {
        // DEMO MODE: Run DemoConnector
        sourcesAttempted.push('demo-connector');
        const start = Date.now();
        try {
          const demoSignals = await this.demoConnector.fetchSignals({
            city,
            state,
            country,
            category: options.business?.preferredCategories?.[0],
          });
          rawSignals.push(...demoSignals);
          sourcesSucceeded.push('demo-connector');
          sources.push({
            sourceId: 'demo-connector',
            name: this.demoConnector.name,
            type: 'demo',
            status: 'DEMO',
            recordsFetched: demoSignals.length,
            latencyMs: Date.now() - start,
            message: 'Synthetic multi-week market signals (Demo fallback)',
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          sourcesFailed.push('demo-connector');
          errors.push(`DemoConnector failed: ${errMsg}`);
          sources.push({
            sourceId: 'demo-connector',
            name: this.demoConnector.name,
            type: 'demo',
            status: 'FAILED',
            recordsFetched: 0,
            message: errMsg,
          });
        }

        // Add real connectors as DISABLED/NOT_CONFIGURED in demo mode
        for (const conn of this.liveConnectors) {
          const isConf = conn.isConfigured();
          sources.push({
            sourceId: conn.getSourceMetadata().id,
            name: conn.name,
            type: conn.getSourceMetadata().type,
            status: isConf ? 'DISABLED' : 'NOT_CONFIGURED',
            recordsFetched: 0,
            message: isConf ? 'Real connector disabled in DEMO mode' : 'Missing credentials',
          });
        }
      } else {
        // LIVE MODE: Run all configured real connectors
        for (const conn of this.liveConnectors) {
          const meta = conn.getSourceMetadata();

          if (!conn.isConfigured()) {
            sources.push({
              sourceId: meta.id,
              name: conn.name,
              type: meta.type,
              status: 'NOT_CONFIGURED',
              recordsFetched: 0,
              message: 'Missing credentials or provider configuration',
            });
            continue;
          }

          sourcesAttempted.push(meta.id);
          const cacheKey = `${meta.id}::${city.toLowerCase()}::${options.business?.preferredCategories?.[0] || 'all'}`;
          const cached = this.signalCache.get(cacheKey);
          const now = Date.now();

          // 3-minute TTL cache to preserve rate limits
          if (cached && (now - cached.timestamp < 3 * 60 * 1000)) {
            rawSignals.push(...cached.signals);
            sourcesSucceeded.push(meta.id);
            sources.push({
              sourceId: meta.id,
              name: conn.name,
              type: meta.type,
              status: 'SUCCESS',
              recordsFetched: cached.signals.length,
              message: 'Cached signals within TTL (rate-limit protection)',
              latencyMs: 1,
            });
            SourceManager.getInstance().recordSuccess(meta.id);
            continue;
          }

          const start = Date.now();
          try {
            const signals = await conn.fetchSignals({
              city,
              state,
              country,
              category: options.business?.preferredCategories?.[0],
            });
            rawSignals.push(...signals);
            this.signalCache.set(cacheKey, { timestamp: now, signals });
            sourcesSucceeded.push(meta.id);
            sources.push({
              sourceId: meta.id,
              name: conn.name,
              type: meta.type,
              status: 'SUCCESS',
              recordsFetched: signals.length,
              latencyMs: Date.now() - start,
            });
            SourceManager.getInstance().recordSuccess(meta.id);
          } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.warn(`[Pipeline] Connector ${conn.name} failed gracefully:`, errMsg);
            sourcesFailed.push(meta.id);
            errors.push(`Connector ${conn.name} failed: ${errMsg}`);
            sources.push({
              sourceId: meta.id,
              name: conn.name,
              type: meta.type,
              status: 'FAILED',
              recordsFetched: 0,
              message: errMsg,
              latencyMs: Date.now() - start,
            });
            SourceManager.getInstance().recordFailure(meta.id, errMsg);
          }
        }
      }

      // If in LIVE mode and no records were retrieved:
      // Do NOT silently substitute fake data! Return explicit live empty state.
      if (isLive && rawSignals.length === 0) {
        const stats: PipelineStats = {
          rawRecords: 0,
          validRecords: 0,
          rejectedRecords: 0,
          duplicates: 0,
          duplicatesRemoved: 0,
          signals: 0,
          signalsCreated: 0,
          clusters: 0,
          clustersCreated: 0,
          highValueTrends: 0,
          trendsScored: 0,
          aiAnalyses: 0,
          sourcesAttempted,
          sourcesSucceeded,
          sourcesFailed,
        };

        this.repo.updateRun(pipelineRun.id, {
          status: 'COMPLETED',
          stats,
          completedAt: new Date().toISOString(),
          sourcesAttempted,
          sourcesSucceeded,
          sourcesFailed,
          errors,
        });

        return {
          runId: pipelineRun.id,
          city,
          state,
          country,
          mode: 'LIVE',
          dataMode: 'LIVE',
          sources,
          stats,
          clusters: [],
          analyzedTrends: [],
          notice: 'LIVE MODE: No real-world signals retrieved from configured sources for this location. Real sources may be unconfigured or returned 0 matching records.',
        };
      }

      // Store raw records idempotently
      for (const sig of rawSignals) {
        this.repo.upsertRawRecord(sig, pipelineRun.id);
      }

      const rawRecordsCount = rawSignals.length;

      // 2. VALIDATION
      const { valid, rejected } = this.validator.validate(rawSignals);
      const validRecordsCount = valid.length;
      const rejectedRecordsCount = rejected.length;

      // 3. NORMALIZATION
      const normalized = this.normalizer.normalize(valid);

      // 4. DEDUPLICATION
      const { unique, duplicates } = this.deduplicator.deduplicate(normalized);
      const duplicatesCount = duplicates.length;
      const uniqueSignalsCount = unique.length;

      // Save normalized signals to repo
      for (const sig of unique) {
        this.repo.upsertNormalizedSignal(sig);
      }

      // 5. LOCATION FILTERING & RANKING
      const rankedLocatedSignals = this.locationFilter.filterAndRank(unique, city, state, country);

      // 6. TOPIC EXTRACTION & TREND CLUSTERING
      const rawClusters = this.clusterer.clusterSignals(rankedLocatedSignals.map(r => r.signal));

      // 7. TIME-SERIES ANALYSIS, SCORING & LIFECYCLE CLASSIFICATION
      const fullyProcessedClusters: TrendCluster[] = [];

      for (const rawClust of rawClusters) {
        const timeSeries = this.timeSeriesEngine.computeMetrics(rawClust.signals);
        const trendScore = this.scorer.calculateScore(timeSeries);
        const lifecycle = this.lifecycleClassifier.classify(timeSeries, trendScore);

        const locationSignals: Record<string, number> = {};
        for (const sig of rawClust.signals) {
          const loc = sig.location?.city || city;
          locationSignals[loc] = (locationSignals[loc] || 0) + 1;
        }

        const cluster: TrendCluster = {
          id: `cluster-${city.toLowerCase()}-${rawClust.clusterKey}`,
          name: rawClust.clusterName,
          slug: rawClust.clusterKey,
          category: rawClust.category,
          description: `Measured ${lifecycle.toLowerCase()} trend in ${city} with +${Math.round(timeSeries.growthRate * 100)}% momentum across ${rawClust.signals.length} local signals.`,
          signals: rawClust.signals,
          primaryKeywords: rawClust.primaryKeywords,
          locationSignals,
          timeSeries,
          trendScore,
          lifecycle,
          firstDetectedAt: rawClust.signals[0]?.timestamp || new Date().toISOString(),
          lastUpdatedAt: rawClust.signals[rawClust.signals.length - 1]?.timestamp || new Date().toISOString(),
        };

        this.repo.upsertCluster(cluster, city);
        fullyProcessedClusters.push(cluster);
      }

      // 8. BUSINESS CONTEXT & HIGH-VALUE SELECTION
      const businessContext: BusinessContext = options.business || {
        businessType: 'General Business',
        city,
        state,
        country,
      };

      // Calculate location relevance & business fit for all clusters
      const candidates = fullyProcessedClusters.map(cluster => {
        const relScores = cluster.signals.map(s =>
          this.locationFilter.evaluateRelevance(s, city, state, country).score
        );
        const avgLocationRelevance = relScores.length > 0
          ? Math.round(relScores.reduce((a, b) => a + b, 0) / relScores.length)
          : 80;

        const businessFit = this.businessFitEngine.calculateFit(businessContext, cluster, avgLocationRelevance);

        return {
          cluster,
          locationRelevance: avgLocationRelevance,
          businessFit,
        };
      });

      // Select top high-value trends
      const maxTrends = options.maxTrendsToAnalyze || 4;
      const selectedHighValue = this.highValueSelector.selectHighValueTrends(candidates, maxTrends);

      // 9. AI ANALYSIS, OPPORTUNITY & ACTION PLAN GENERATION
      const analyzedTrends: AnalyzedTrendResult[] = [];
      let aiAnalysesCount = 0;

      for (let i = 0; i < selectedHighValue.length; i++) {
        const item = selectedHighValue[i];
        const intelligencePackage = this.packageBuilder.buildPackage(
          item.cluster,
          businessContext,
          item.businessFit
        );

        // Run Gemini or offline calibrated interpretation for top trend(s)
        const shouldRunAi = i === 0; // AI interpret top high-value trend to optimize latency and token efficiency
        let aiResult;

        if (shouldRunAi) {
          aiResult = await this.geminiAnalyzer.analyze(intelligencePackage);
          aiAnalysesCount++;

          this.repo.saveAiAnalysis(
            item.cluster.id,
            city,
            aiResult.analysis,
            aiResult.status
          );
        } else {
          // Fast deterministic offline interpretation for secondary trends
          const analysis = this.geminiAnalyzer.generateEvidenceInterpretation(intelligencePackage);
          aiResult = {
            analysis,
            status: 'AI_OFFLINE_INTERPRETED' as const,
            latencyMs: 1,
          };
        }

        const opportunity = this.opportunityEngine.generateOpportunity(
          item.cluster,
          businessContext,
          item.businessFit,
          aiResult.analysis
        );
        this.repo.saveOpportunity(opportunity);

        const actionPlan = this.actionPlanEngine.generateActionPlan(
          item.cluster,
          businessContext,
          opportunity,
          aiResult.analysis
        );
        this.repo.saveActionPlan(item.cluster.id, actionPlan);

        // Step 9: Traceable source evidence records
        const evidence: TraceableEvidenceRecord[] = item.cluster.signals.slice(0, 10).map(s => ({
          trendId: item.cluster.id,
          source: s.source,
          sourceRecordId: s.sourceRecordId,
          title: s.title,
          url: s.url,
          timestamp: s.timestamp,
          location: s.location?.city || city,
          metrics: {
            views: s.engagementMetrics?.views,
            likes: s.engagementMetrics?.likes,
            comments: s.engagementMetrics?.comments,
            shares: s.engagementMetrics?.shares,
            score: s.engagementMetrics?.score,
            ...(s.rawMetrics || {}),
          },
        }));

        analyzedTrends.push({
          cluster: item.cluster,
          locationRelevance: item.locationRelevance,
          businessFit: item.businessFit,
          intelligencePackage,
          aiAnalysis: aiResult.analysis,
          aiStatus: aiResult.status,
          opportunity,
          actionPlan,
          evidence,
        });
      }

      const stats: PipelineStats = {
        rawRecords: rawRecordsCount,
        validRecords: validRecordsCount,
        rejectedRecords: rejectedRecordsCount,
        duplicates: duplicatesCount,
        duplicatesRemoved: duplicatesCount,
        signals: uniqueSignalsCount,
        signalsCreated: uniqueSignalsCount,
        clusters: fullyProcessedClusters.length,
        clustersCreated: fullyProcessedClusters.length,
        highValueTrends: selectedHighValue.length,
        trendsScored: fullyProcessedClusters.length,
        aiAnalyses: aiAnalysesCount,
        sourcesAttempted,
        sourcesSucceeded,
        sourcesFailed,
      };

      this.repo.updateRun(pipelineRun.id, {
        status: 'COMPLETED',
        stats,
        completedAt: new Date().toISOString(),
        sourcesAttempted,
        sourcesSucceeded,
        sourcesFailed,
        errors,
        rawRecords: rawRecordsCount,
        validRecords: validRecordsCount,
        duplicatesRemoved: duplicatesCount,
        signalsCreated: uniqueSignalsCount,
        clustersCreated: fullyProcessedClusters.length,
        trendsScored: fullyProcessedClusters.length,
        aiAnalyses: aiAnalysesCount,
      });

      return {
        runId: pipelineRun.id,
        city,
        state,
        country,
        mode,
        dataMode,
        sources,
        stats,
        clusters: fullyProcessedClusters,
        analyzedTrends,
        topTrend: analyzedTrends[0],
        notice: dataMode === 'DEMO' ? 'DEMO DATA — NOT LIVE' : 'LIVE MARKET DATA',
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[PipelineService] Pipeline execution failed:', err);
      this.repo.updateRun(pipelineRun.id, {
        status: 'FAILED',
        errorMessage: errMsg,
        completedAt: new Date().toISOString(),
        errors: [...errors, errMsg],
      });
      throw err;
    }
  }
}
