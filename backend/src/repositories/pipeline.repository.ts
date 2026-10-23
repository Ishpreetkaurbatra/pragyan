import {
  TrendSignal,
  TrendCluster,
  StructuredAiAnalysis,
  Opportunity,
  ActionPlan,
  PipelineStats,
  RawSourceRecord,
} from '../models/intelligence-pipeline.types';
import { v4 as uuidv4 } from 'uuid';

export interface PipelineRunRecord {
  runId: string;
  id: string; // compatibility alias
  startedAt: string;
  completedAt?: string;
  mode: string;
  requestedCity: string;
  city: string;
  state?: string;
  country: string;
  sourcesAttempted: string[];
  sourcesSucceeded: string[];
  sourcesFailed: string[];
  rawRecords: number;
  validRecords: number;
  duplicatesRemoved: number;
  signalsCreated: number;
  clustersCreated: number;
  trendsScored: number;
  aiAnalyses: number;
  errors: string[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  stats: PipelineStats;
  errorMessage?: string;
}

export class PipelineRepository {
  private static instance: PipelineRepository;

  private runs = new Map<string, PipelineRunRecord>();
  private rawRecords = new Map<string, RawSourceRecord>(); // key: source::sourceRecordId
  private normalizedSignals = new Map<string, TrendSignal>(); // key: id
  private clusters = new Map<string, TrendCluster>(); // key: clusterKey::city
  private aiAnalyses = new Map<string, any>(); // key: trendId::city
  private opportunities = new Map<string, Opportunity>();
  private actionPlans = new Map<string, ActionPlan>();

  public static getInstance(): PipelineRepository {
    if (!PipelineRepository.instance) {
      PipelineRepository.instance = new PipelineRepository();
    }
    return PipelineRepository.instance;
  }

  // --- Pipeline Runs ---
  public createRun(city: string, state?: string, country: string = 'India', mode: string = 'DEMO'): PipelineRunRecord {
    const runId = uuidv4();
    const now = new Date().toISOString();
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
      sourcesAttempted: [],
      sourcesSucceeded: [],
      sourcesFailed: [],
    };

    const run: PipelineRunRecord = {
      runId,
      id: runId,
      requestedCity: city,
      city,
      state,
      country,
      mode,
      status: 'IN_PROGRESS',
      startedAt: now,
      sourcesAttempted: [],
      sourcesSucceeded: [],
      sourcesFailed: [],
      rawRecords: 0,
      validRecords: 0,
      duplicatesRemoved: 0,
      signalsCreated: 0,
      clustersCreated: 0,
      trendsScored: 0,
      aiAnalyses: 0,
      errors: [],
      stats,
    };
    this.runs.set(runId, run);
    return run;
  }

  public updateRun(id: string, updates: Partial<PipelineRunRecord>): PipelineRunRecord | null {
    const existing = this.runs.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.runs.set(id, updated);
    return updated;
  }

  public getRun(id: string): PipelineRunRecord | null {
    return this.runs.get(id) || null;
  }

  public getAllRuns(): PipelineRunRecord[] {
    return Array.from(this.runs.values()).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  // --- Raw Source Records (Idempotent upsert by source + sourceRecordId) ---
  public upsertRawRecord(signal: TrendSignal, runId?: string): { isNew: boolean } {
    const key = `${signal.source}::${signal.sourceRecordId}`;
    const exists = this.rawRecords.has(key);
    const contentHash = this.computeHash(`${signal.title}::${signal.text || ''}`);

    const record: RawSourceRecord = {
      id: signal.id || uuidv4(),
      pipelineRunId: runId,
      source: signal.source,
      sourceRecordId: signal.sourceRecordId,
      title: signal.title,
      rawContent: signal.text,
      url: signal.url,
      city: signal.location?.city,
      state: signal.location?.state,
      country: signal.location?.country,
      sourceTimestamp: signal.timestamp,
      collectedAt: signal.collectedAt || new Date().toISOString(),
      status: signal.status || 'RAW',
      rejectionReason: signal.rejectionReason,
      contentHash,
      rawPayload: (signal.sourceMetadata || {}) as Record<string, unknown>,
    };

    this.rawRecords.set(key, record);
    return { isNew: !exists };
  }

  public getRawRecords(runId?: string): RawSourceRecord[] {
    const all = Array.from(this.rawRecords.values());
    if (runId) {
      return all.filter(r => r.pipelineRunId === runId);
    }
    return all;
  }

  // --- Normalized Signals ---
  public upsertNormalizedSignal(signal: TrendSignal): void {
    this.normalizedSignals.set(signal.id, signal);
  }

  public getNormalizedSignalsByCity(city: string): TrendSignal[] {
    const normalizedCity = city.toLowerCase().trim();
    return Array.from(this.normalizedSignals.values()).filter(
      s => s.location?.city?.toLowerCase()?.trim() === normalizedCity
    );
  }

  // --- Trend Clusters ---
  public upsertCluster(cluster: TrendCluster, city: string): void {
    const key = `${cluster.slug}::${city.toLowerCase()}`;
    this.clusters.set(key, cluster);
  }

  public getClustersByCity(city: string): TrendCluster[] {
    const normalizedCity = city.toLowerCase().trim();
    const results: TrendCluster[] = [];
    for (const [key, cluster] of this.clusters.entries()) {
      if (key.endsWith(`::${normalizedCity}`)) {
        results.push(cluster);
      }
    }
    return results;
  }

  public getCluster(idOrSlug: string): TrendCluster | null {
    for (const cluster of this.clusters.values()) {
      if (cluster.id === idOrSlug || cluster.slug === idOrSlug) {
        return cluster;
      }
    }
    return null;
  }

  public getClusterSignals(clusterIdOrSlug: string): TrendSignal[] {
    for (const cluster of this.clusters.values()) {
      if (cluster.id === clusterIdOrSlug || cluster.slug === clusterIdOrSlug) {
        return cluster.signals;
      }
    }
    return [];
  }

  // --- AI Analyses ---
  public saveAiAnalysis(trendId: string, city: string, analysis: StructuredAiAnalysis, status: string): void {
    const key = `${trendId}::${city.toLowerCase()}`;
    this.aiAnalyses.set(key, {
      trendId,
      city,
      analysis,
      status,
      savedAt: new Date().toISOString(),
    });
  }

  public getAiAnalysis(trendId: string, city: string): any {
    return this.aiAnalyses.get(`${trendId}::${city.toLowerCase()}`) || null;
  }

  // --- Opportunities & Action Plans ---
  public saveOpportunity(opp: Opportunity): void {
    this.opportunities.set(opp.trendId, opp);
  }

  public saveActionPlan(trendId: string, plan: ActionPlan): void {
    this.actionPlans.set(trendId, plan);
  }

  private computeHash(text: string): string {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}
