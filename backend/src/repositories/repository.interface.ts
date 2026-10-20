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

export interface IRepository {
  // Profiles
  getProfileById(id: string): Promise<Profile | null>;
  getProfileByEmail(email: string): Promise<Profile | null>;
  createProfile(profile: Partial<Profile>): Promise<Profile>;
  getAllProfiles(): Promise<Profile[]>;

  // Businesses
  getBusinessById(id: string): Promise<Business | null>;
  getBusinessByOwnerId(ownerId: string): Promise<Business | null>;
  createBusiness(business: Partial<Business>): Promise<Business>;
  updateBusiness(id: string, updates: Partial<Business>): Promise<Business | null>;
  getAllBusinesses(): Promise<Business[]>;

  // Trends
  getAllTrends(filter?: { category?: string; search?: string; status?: string }): Promise<Trend[]>;
  getTrendById(id: string): Promise<Trend | null>;
  getTrendBySlug(slug: string): Promise<Trend | null>;
  createTrend(trend: Partial<Trend>): Promise<Trend>;
  updateTrend(id: string, updates: Partial<Trend>): Promise<Trend | null>;

  // Trend Details
  getTrendMetrics(trendId: string, period?: string): Promise<TrendMetric[]>;
  getTrendAudiences(trendId: string): Promise<Audience[]>;
  getTrendGeography(trendId: string): Promise<GeographicSignal[]>;
  getTrendSignals(trendId: string): Promise<RawSignal[]>;
  getDataSources(): Promise<DataSource[]>;

  // Saved Trends
  getSavedTrends(userId: string): Promise<Trend[]>;
  saveTrend(userId: string, trendId: string): Promise<boolean>;
  unsaveTrend(userId: string, trendId: string): Promise<boolean>;

  // Business Matches
  getBusinessMatch(businessId: string, trendId: string): Promise<BusinessMatch | null>;
  upsertBusinessMatch(match: Partial<BusinessMatch>): Promise<BusinessMatch>;
  getAllBusinessMatches(businessId: string): Promise<BusinessMatch[]>;

  // Opportunities
  getOpportunities(businessId?: string): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | null>;
  createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity>;
  updateOpportunity(id: string, updates: Partial<Opportunity>): Promise<Opportunity | null>;

  // Action Plans
  getActionPlans(businessId?: string): Promise<ActionPlan[]>;
  getActionPlanById(id: string): Promise<ActionPlan | null>;
  createActionPlan(plan: Partial<ActionPlan>): Promise<ActionPlan>;
  updateActionPlan(id: string, updates: Partial<ActionPlan>): Promise<ActionPlan | null>;

  // Expert Reviews
  getExpertReviews(status?: string): Promise<ExpertReview[]>;
  getExpertReviewByPlanId(planId: string): Promise<ExpertReview | null>;
  createOrUpdateExpertReview(review: Partial<ExpertReview>): Promise<ExpertReview>;

  // Experiments
  getExperiments(businessId?: string): Promise<Experiment[]>;
  getExperimentById(id: string): Promise<Experiment | null>;
  createExperiment(experiment: Partial<Experiment>): Promise<Experiment>;
  updateExperiment(id: string, updates: Partial<Experiment>): Promise<Experiment | null>;
  getExperimentMetrics(experimentId: string): Promise<ExperimentMetric[]>;
  addExperimentMetric(metric: Partial<ExperimentMetric>): Promise<ExperimentMetric>;

  // Learning Records
  getLearningRecords(businessId?: string): Promise<LearningRecord[]>;
  createLearningRecord(record: Partial<LearningRecord>): Promise<LearningRecord>;

  // Alerts
  getAlerts(businessId: string, unreadOnly?: boolean): Promise<Alert[]>;
  markAlertRead(alertId: string): Promise<boolean>;
  createAlert(alert: Partial<Alert>): Promise<Alert>;

  // System Logs
  logSystemAction(log: Partial<SystemLog>): Promise<void>;
  getSystemLogs(limit?: number): Promise<SystemLog[]>;
}
