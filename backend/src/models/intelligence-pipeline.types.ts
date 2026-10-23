export interface BusinessContext {
  businessName?: string;
  businessType: string;
  industry?: string;
  city: string;
  state?: string;
  country?: string;
  targetCustomers?: string[];
  customerAgeRange?: string;
  products?: string[];
  priceRange?: string;
  businessGoals?: string[];
  marketingChannels?: string[];
  preferredCategories?: string[];
  excludedCategories?: string[];
}

export interface TrendSignal {
  id: string;
  source: string;
  sourceRecordId: string;

  title: string;
  text?: string;
  url?: string;

  timestamp: string;
  collectedAt?: string;

  location?: {
    city?: string;
    state?: string;
    country?: string;
  };

  category?: string;

  keywords: string[];

  engagementMetrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    score?: number;
  };

  rawMetrics?: Record<string, number>;

  sourceMetadata?: Record<string, unknown>;

  status?: 'RAW' | 'VALID' | 'REJECTED' | 'DUPLICATE';
  rejectionReason?: string;
  duplicateOf?: string;
  clusterId?: string;
}

export type TrendLifecycleStatus =
  | 'SIGNAL_DETECTED'
  | 'EMERGING'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'RISING'
  | 'PEAKING'
  | 'COOLING'
  | 'DECLINING';

export interface TrendScore {
  growthScore: number;
  accelerationScore: number;
  crossSourceScore: number;
  persistenceScore: number;
  recencyScore: number;
  geographicSpreadScore: number;
  sourceQualityScore: number;
  totalScore: number;
}

export interface BusinessFit {
  categoryFit: number;
  customerFit: number;
  locationFit: number;
  productFit: number;
  goalFit: number;
  timingFit: number;
  totalScore: number;
  reasons: string[];
}

export interface TimeSeriesMetrics {
  currentVolume: number;
  previousVolume: number;
  growthRate: number; // e.g. 0.45 = +45%
  velocity: number;
  acceleration: number;
  persistence: number; // 0 to 1
  sourceDiversity: number; // 0 to 1
  crossSourceConfirmation: number; // 0 to 1
  geographicSpread: number; // 0 to 1
  recencyDays: number;
  weeklyVolumes: number[];
}

export interface TrendCluster {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  signals: TrendSignal[];
  primaryKeywords: string[];
  locationSignals: Record<string, number>; // city/state -> count
  timeSeries: TimeSeriesMetrics;
  trendScore: TrendScore;
  lifecycle: TrendLifecycleStatus;
  firstDetectedAt: string;
  lastUpdatedAt: string;
}

export interface TrendIntelligencePackage {
  trendId: string;
  trendName: string;
  location: {
    city: string;
    state?: string;
    country?: string;
  };
  stage: string;
  metrics: {
    growth: number;
    acceleration: number;
    persistence: number;
    crossSource: number;
    totalScore: number;
  };
  sources: Array<{
    source: string;
    signal: string;
    value?: number;
  }>;
  geography: string[];
  business: BusinessContext;
  businessFit: {
    score: number;
    reasons: string[];
  };
}

export interface StructuredAiAnalysis {
  trendName: string;
  trendSummary: string;
  trendStage: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  whyItMatters: string;
  evidenceSummary: string;
  likelyDrivers: string[];
  businessFitExplanation: string;
  opportunity: string;
  targetCustomer: string;
  productIdeas: string[];
  marketingIdeas: string[];
  actionPlan: string[];
  timeline: string;
  successMetrics: string[];
  risks: string[];
  assumptions: string[];
  expertValidationRequired: boolean;
}

export interface Opportunity {
  opportunityTitle: string;
  trendId: string;
  businessId?: string;
  opportunityScore: number;
  customerSegment: string;
  expectedBenefit: string;
  requiredInvestmentLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  implementationDifficulty: 'EASY' | 'MODERATE' | 'COMPLEX';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendedExperiment: string;
  expectedLearning: string;
  successMetrics: string[];
}

export interface ActionPlan {
  whatToTest: string;
  targetCustomer: string;
  productOrService: string;
  marketingChannel: string;
  testDuration: string;
  budgetLevel: string;
  kpi: string;
  successThreshold: string;
  decisionAfterTest: string;
}

export interface RawSourceRecord {
  id: string;
  pipelineRunId?: string;
  source: string;
  sourceRecordId: string;
  title: string;
  rawContent?: string;
  url?: string;
  city?: string;
  state?: string;
  country?: string;
  sourceTimestamp: string;
  collectedAt: string;
  status: 'RAW' | 'VALID' | 'REJECTED' | 'DUPLICATE';
  rejectionReason?: string;
  contentHash: string;
  rawPayload: Record<string, unknown>;
}

export interface SourceExecutionStatus {
  sourceId: string;
  name: string;
  type: string;
  status: 'SUCCESS' | 'NOT_CONFIGURED' | 'FAILED' | 'DEMO' | 'DISABLED';
  recordsFetched: number;
  message?: string;
  latencyMs?: number;
}

export interface PipelineStats {
  rawRecords: number;
  validRecords: number;
  rejectedRecords: number;
  duplicates: number;
  duplicatesRemoved?: number;
  signals: number;
  signalsCreated?: number;
  clusters: number;
  clustersCreated?: number;
  highValueTrends: number;
  trendsScored?: number;
  aiAnalyses: number;
  sourcesAttempted?: string[];
  sourcesSucceeded?: string[];
  sourcesFailed?: string[];
}

export interface TraceableEvidenceRecord {
  trendId: string;
  source: string;
  sourceRecordId: string;
  title: string;
  url?: string;
  timestamp: string;
  location?: string;
  metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    score?: number;
    [key: string]: unknown;
  };
}

export interface AnalyzedTrendResult {
  cluster: TrendCluster;
  locationRelevance: number;
  businessFit: BusinessFit;
  intelligencePackage: TrendIntelligencePackage;
  aiAnalysis?: StructuredAiAnalysis;
  aiStatus: 'AI_SUCCESS' | 'AI_PENDING' | 'AI_FAILED' | 'AI_OFFLINE_INTERPRETED';
  opportunity?: Opportunity;
  actionPlan?: ActionPlan;
  evidence?: TraceableEvidenceRecord[];
}
