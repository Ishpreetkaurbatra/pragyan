import { Business, Trend, TrendMetric, Audience, GeographicSignal, Experiment, ActionPlan } from '../models/types';

export interface BusinessContext {
  businessId?: string;
  businessName: string;
  industry: string;
  businessType: string;
  location: string;
  targetMarket?: string;
  businessGoal: string;
  products: string[];
  targetCustomers?: string;
  budget?: string;
  platforms?: string[];
}

export interface TrendContext {
  trendId: string;
  name: string;
  category: string;
  momentum?: number | string;
  lifecycleStatus?: string;
  headline?: string;
  description?: string;
  signals?: any[];
  audience?: Audience[];
  geography?: GeographicSignal[];
  metrics?: TrendMetric[];
  evidence?: any[];
}

export interface TrendAnalysisInput {
  trendContext: TrendContext;
  businessContext?: BusinessContext;
}

export interface TrendAnalysisOutput {
  momentum: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  confidence: number;
  reasoning: string;
  lifecycle: string;
  growthIndicators: string[];
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  evidenceIds: string[];
}

export interface ClassificationInput {
  trendName: string;
  signals: string[];
}

export interface ClassificationOutput {
  category: string;
  subCategory?: string;
  tags: string[];
  relevanceConfidence: number;
}

export interface SignalSummaryInput {
  trendName: string;
  signals: { text: string; source: string; date?: string }[];
}

export interface SignalSummaryOutput {
  summary: string;
  keyDrivers: string[];
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'MIXED' | 'NEGATIVE';
  sourceDistribution: Record<string, number>;
}

export interface BusinessMatchInput {
  businessContext: BusinessContext;
  trendContext: TrendContext;
  pastExperiments?: Experiment[];
}

export interface BusinessMatchOutput {
  customerFit: number;
  productFit: number;
  locationFit: number;
  goalAlignment: number;
  budgetFit: number;
  businessFit: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  reasoning: string;
  synergies: string[];
  potentialBottlenecks: string[];
  evidenceIds: string[];
}

export interface OpportunityInput {
  businessContext: BusinessContext;
  trendContext: TrendContext;
  businessMatch?: BusinessMatchOutput;
  pastExperiments?: Experiment[];
}

export interface OpportunityOutput {
  title: string;
  description: string;
  score: number;
  businessFit: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  potentialAction: string;
  estimatedTimeframe: string;
  targetCustomerSegment: string;
  revenuePotential: 'MODEST' | 'MODERATE' | 'HIGH' | 'SIGNIFICANT';
}

export interface ActionPlanInput {
  businessContext: BusinessContext;
  trendContext: TrendContext;
  opportunityTitle?: string;
  opportunityDescription?: string;
}

export interface ActionPlanOutput {
  title: string;
  whyNow: string;
  whyThisBusiness: string;
  targetCustomer: string;
  whatToLaunch: string;
  suggestedPrice: string;
  promotionStrategy: string;
  testTiming: string;
  testDuration: string;
  successMetrics: string[];
  risks: string[];
  stopCriteria: string[];
  continueCriteria: string[];
  expectedLearning: string;
}

export interface ExperimentAnalysisInput {
  experimentName: string;
  hypothesis: string;
  baseline: Record<string, any>;
  recordedMetrics: { name: string; value: number; unit?: string }[];
  durationDays: number;
}

export interface ExperimentAnalysisOutput {
  statusOutcome: 'SUCCESS' | 'INCONCLUSIVE' | 'FAILED';
  summary: string;
  keyInsights: string[];
  suggestedDecision: 'CONTINUE' | 'SCALE' | 'ADAPT' | 'STOP';
  nextSteps: string[];
  learnedImpactScore: number;
}

export interface AskTGoInput {
  question: string;
  businessContext: BusinessContext;
  relevantTrends?: TrendContext[];
  activeOpportunities?: OpportunityOutput[];
  pastExperiments?: Experiment[];
}

export interface AskTGoOutput {
  answer: string;
  actionableRecommendations: string[];
  citedTrends: { trendId: string; name: string }[];
  suggestedFollowUps: string[];
}

export interface IntelligenceResponseContract<T> {
  success: boolean;
  intelligenceVersion: string;
  provider: 'mock' | 'local-open-model' | 'tgo' | 'external';
  model: string;
  modelVersion: string;
  generatedAt: string;
  data: T;
  meta?: {
    latencyMs?: number;
    fallbackUsed?: boolean;
    requestId?: string;
  };
}

export interface IntelligenceProvider {
  name: string;
  analyzeTrend(input: TrendAnalysisInput): Promise<TrendAnalysisOutput>;
  classifyTrend(input: ClassificationInput): Promise<ClassificationOutput>;
  summarizeSignals(input: SignalSummaryInput): Promise<SignalSummaryOutput>;
  matchBusiness(input: BusinessMatchInput): Promise<BusinessMatchOutput>;
  generateOpportunity(input: OpportunityInput): Promise<OpportunityOutput>;
  generateActionPlan(input: ActionPlanInput): Promise<ActionPlanOutput>;
  analyzeExperiment(input: ExperimentAnalysisInput): Promise<ExperimentAnalysisOutput>;
  answerBusinessQuestion(input: AskTGoInput): Promise<AskTGoOutput>;
}
