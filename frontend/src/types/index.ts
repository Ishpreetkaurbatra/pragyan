export type UserRole = 'BUSINESS' | 'EXPERT' | 'ADMIN';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Business {
  id: string;
  owner_id: string;
  business_name: string;
  industry: string;
  business_type: string;
  location: string;
  target_market?: string;
  business_goal: string;
  description?: string;
  products_services: string[];
  target_customers?: string;
  budget?: string;
  platforms: string[];
  status: 'active' | 'inactive';
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

export interface Trend {
  id: string;
  name: string;
  slug: string;
  category: string;
  headline: string;
  description: string;
  image_url: string;
  lifecycle_status: TrendLifecycleStatus;
  momentum: number;
  velocity: number;
  acceleration: number;
  consistency: number;
  source_diversity: number;
  geographic_spread: number;
  persistence: number;
  trend_score: number;
  trend_probability: number;
  confidence: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  is_demo: boolean;
  business_fit?: number;
  created_at: string;
}

export interface TrendMetric {
  id: string;
  trend_id: string;
  metric_name: string;
  metric_value: number;
  metric_period?: string;
  observed_at: string;
}

export interface Audience {
  id: string;
  age_group: string;
  location?: string;
  interest?: string;
  percentage: number;
  activity_signal?: string;
}

export interface GeographicSignal {
  id: string;
  country: string;
  state?: string;
  city?: string;
  interest_score: number;
  growth_rate?: number;
}

export interface Opportunity {
  id: string;
  business_id: string;
  trend_id: string;
  name: string;
  description: string;
  opportunity_score: number;
  business_fit: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  potential_action: string;
  status: string;
}

export interface ActionPlan {
  id: string;
  business_id: string;
  trend_id?: string;
  opportunity_id?: string;
  title: string;
  why_now?: string;
  why_this_business?: string;
  target_customer?: string;
  what_to_launch: string;
  suggested_price?: string;
  promotion_strategy?: string;
  test_timing?: string;
  test_duration: string;
  success_metrics: string[];
  risks: string[];
  stop_criteria: string[];
  continue_criteria: string[];
  expected_learning?: string;
  status: 'draft' | 'pending_review' | 'approved' | 'changes_requested' | 'rejected' | 'in_experiment';
  created_at: string;
}

export interface ExpertReview {
  id: string;
  action_plan_id: string;
  expert_id: string;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence?: number;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected';
  comments?: string;
  suggested_changes?: string;
  decision_reason?: string;
  reviewed_at?: string;
  actionPlan?: ActionPlan;
  business?: Business;
  trend?: Trend;
}

export interface ExperimentMetric {
  id: string;
  experiment_id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  metric_date: string;
  baseline_value?: number;
  target_value?: number;
}

export interface Experiment {
  id: string;
  business_id: string;
  opportunity_id?: string;
  action_plan_id?: string;
  name: string;
  hypothesis: string;
  baseline: Record<string, any>;
  start_date?: string;
  end_date?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'abandoned';
  decision?: string;
  metrics?: ExperimentMetric[];
  actionPlan?: ActionPlan;
}

export interface Alert {
  id: string;
  business_id: string;
  trend_id?: string;
  alert_type: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'info';
  confidence?: number;
  is_read: boolean;
  created_at: string;
}

export interface DashboardData {
  business: Business;
  kpis: {
    marketSignals: number;
    risingTrends: number;
    businessFit: number;
    opportunityScore: number;
    activeAlerts: number;
  };
  momentumTimeline: { month: string; index: number; velocity: number }[];
  opportunityMatrix: {
    id: string;
    name: string;
    category: string;
    businessFit: number;
    opportunityScore: number;
    momentum: number;
    risk: string;
  }[];
  topOpportunities: Opportunity[];
  alerts: Alert[];
  recentActionPlans: ActionPlan[];
  experiments: Experiment[];
  isDemo: boolean;
}

export interface AskTGoResponse {
  answer: string;
  actionableRecommendations: string[];
  citedTrends: { trendId: string; name: string }[];
  suggestedFollowUps: string[];
}
