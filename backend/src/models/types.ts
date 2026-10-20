export type UserRole = 'BUSINESS' | 'EXPERT' | 'ADMIN';

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  language?: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
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
  first_detected_at?: string;
  last_updated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TrendMetric {
  id: string;
  trend_id: string;
  metric_name: string;
  metric_value: number;
  metric_period?: string;
  region?: string;
  source?: string;
  observed_at: string;
  created_at: string;
}

export interface Audience {
  id: string;
  trend_id: string;
  age_group: string;
  location?: string;
  interest?: string;
  percentage: number;
  activity_signal?: string;
  created_at: string;
}

export interface GeographicSignal {
  id: string;
  trend_id: string;
  country: string;
  state?: string;
  city?: string;
  interest_score: number;
  growth_rate?: number;
  observed_at: string;
  created_at: string;
}

export interface DataSource {
  id: string;
  source_type: string;
  source_name: string;
  base_url?: string;
  access_method?: string;
  status: string;
  baseline_trust: number;
  dynamic_trust: number;
  last_collected_at?: string;
  last_success_at?: string;
  last_error_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RawSignal {
  id: string;
  source_id?: string;
  external_id?: string;
  url?: string;
  title: string;
  original_text: string;
  original_language?: string;
  translated_text?: string;
  published_at?: string;
  collected_at: string;
  content_hash?: string;
  semantic_hash?: string;
  lineage_id?: string;
  temporary_expires_at?: string;
  metadata?: Record<string, any>;
}

export interface BusinessMatch {
  id: string;
  business_id: string;
  trend_id: string;
  customer_fit: number;
  product_fit: number;
  location_fit: number;
  goal_alignment: number;
  budget_fit: number;
  business_fit: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  reasoning: string;
  evidence_ids: string[];
  intelligence_version: string;
  created_at: string;
  updated_at: string;
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
  status: 'new' | 'active' | 'archived';
  score_version?: string;
  intelligence_version?: string;
  created_at: string;
  updated_at: string;
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
  intelligence_version?: string;
  created_at: string;
  updated_at: string;
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
  created_at: string;
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
  created_at: string;
  updated_at: string;
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
  created_at: string;
}

export interface LearningRecord {
  id: string;
  business_id: string;
  trend_id?: string;
  experiment_id?: string;
  outcome: Record<string, any>;
  evidence_strength: number;
  impact: number;
  learning_type: string;
  created_at: string;
}

export interface Alert {
  id: string;
  business_id: string;
  trend_id?: string;
  alert_type: 'Emerging Demand' | 'Trend Acceleration' | 'Market Shift' | 'Opportunity Risk' | 'Expert Review Required';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'info';
  confidence?: number;
  evidence_ids?: string[];
  is_read: boolean;
  created_at: string;
}

export interface SavedTrend {
  id: string;
  user_id: string;
  trend_id: string;
  created_at: string;
}

export interface SystemLog {
  id: string;
  user_id?: string;
  action: string;
  resource?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}
