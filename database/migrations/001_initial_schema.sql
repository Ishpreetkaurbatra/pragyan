-- T→G DATABASE BOOTSTRAP MIGRATION
-- PostgreSQL + pgvector Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id text NOT NULL UNIQUE,
  full_name text,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('BUSINESS','EXPERT','ADMIN')),
  avatar_url text,
  language text DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- BUSINESSES
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  industry text NOT NULL,
  business_type text NOT NULL,
  location text NOT NULL,
  target_market text,
  business_goal text NOT NULL,
  description text,
  products_services jsonb DEFAULT '[]',
  target_customers text,
  budget text,
  platforms jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- DATA SOURCES
CREATE TABLE IF NOT EXISTS data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL,
  source_name text NOT NULL,
  base_url text,
  access_method text,
  status text DEFAULT 'active',
  baseline_trust numeric DEFAULT 0.5,
  dynamic_trust numeric DEFAULT 0.5,
  last_collected_at timestamptz,
  last_success_at timestamptz,
  last_error_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RAW SIGNALS
CREATE TABLE IF NOT EXISTS raw_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES data_sources(id),
  external_id text,
  url text,
  title text,
  original_text text,
  original_language text,
  translated_text text,
  published_at timestamptz,
  collected_at timestamptz NOT NULL DEFAULT now(),
  content_hash text,
  semantic_hash text,
  lineage_id text,
  temporary_expires_at timestamptz,
  metadata jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS raw_signals_content_hash_idx ON raw_signals(content_hash);
CREATE INDEX IF NOT EXISTS raw_signals_lineage_idx ON raw_signals(lineage_id);

-- TRENDS
CREATE TABLE IF NOT EXISTS trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text,
  headline text,
  description text,
  image_url text,
  lifecycle_status text NOT NULL DEFAULT 'SIGNAL_DETECTED',
  momentum numeric,
  velocity numeric,
  acceleration numeric,
  consistency numeric,
  source_diversity numeric,
  geographic_spread numeric,
  persistence numeric,
  trend_score numeric,
  trend_probability numeric,
  confidence numeric,
  risk text,
  is_demo boolean NOT NULL DEFAULT false,
  first_detected_at timestamptz,
  last_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trends_status_idx ON trends(lifecycle_status);
CREATE INDEX IF NOT EXISTS trends_category_idx ON trends(category);

-- TREND METRICS
CREATE TABLE IF NOT EXISTS trend_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_period text,
  region text,
  source text,
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- AUDIENCES
CREATE TABLE IF NOT EXISTS audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  age_group text NOT NULL,
  location text,
  interest text,
  percentage numeric NOT NULL,
  activity_signal text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- GEOGRAPHIC SIGNALS
CREATE TABLE IF NOT EXISTS geographic_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  country text NOT NULL,
  state text,
  city text,
  interest_score numeric NOT NULL,
  growth_rate numeric,
  observed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- KNOWLEDGE DOCUMENTS & CHUNKS (RAG)
CREATE TABLE IF NOT EXISTS knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES data_sources(id),
  title text,
  content text NOT NULL,
  language text DEFAULT 'en',
  document_type text,
  published_at timestamptz,
  valid_from timestamptz,
  valid_until timestamptz,
  content_hash text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  content text NOT NULL,
  embedding vector(384),
  token_count integer,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- BUSINESS MATCHES
CREATE TABLE IF NOT EXISTS business_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  customer_fit numeric,
  product_fit numeric,
  location_fit numeric,
  goal_alignment numeric,
  budget_fit numeric,
  business_fit numeric,
  risk text,
  confidence numeric,
  reasoning text,
  evidence_ids jsonb DEFAULT '[]',
  intelligence_version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(business_id, trend_id)
);

-- OPPORTUNITIES
CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  opportunity_score numeric,
  business_fit numeric,
  risk text,
  confidence numeric,
  potential_action text,
  status text DEFAULT 'new',
  score_version text,
  intelligence_version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ACTION PLANS
CREATE TABLE IF NOT EXISTS action_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id uuid REFERENCES trends(id),
  opportunity_id uuid REFERENCES opportunities(id),
  title text NOT NULL,
  why_now text,
  why_this_business text,
  target_customer text,
  what_to_launch text,
  suggested_price text,
  promotion_strategy text,
  test_timing text,
  test_duration text,
  success_metrics jsonb DEFAULT '[]',
  risks jsonb DEFAULT '[]',
  stop_criteria jsonb DEFAULT '[]',
  continue_criteria jsonb DEFAULT '[]',
  expected_learning text,
  status text DEFAULT 'draft',
  intelligence_version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- EXPERT REVIEWS
CREATE TABLE IF NOT EXISTS expert_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id uuid NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  expert_id uuid NOT NULL REFERENCES profiles(id),
  risk text,
  confidence numeric,
  status text NOT NULL DEFAULT 'pending',
  comments text,
  suggested_changes text,
  decision_reason text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- EXPERIMENTS
CREATE TABLE IF NOT EXISTS experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id),
  action_plan_id uuid REFERENCES action_plans(id),
  name text NOT NULL,
  hypothesis text,
  baseline jsonb DEFAULT '{}',
  start_date date,
  end_date date,
  status text DEFAULT 'planned',
  decision text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- EXPERIMENT METRICS
CREATE TABLE IF NOT EXISTS experiment_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id uuid NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text,
  metric_date date NOT NULL,
  baseline_value numeric,
  target_value numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- LEARNING RECORDS
CREATE TABLE IF NOT EXISTS learning_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id uuid REFERENCES trends(id),
  experiment_id uuid REFERENCES experiments(id),
  outcome jsonb NOT NULL,
  evidence_strength numeric,
  impact numeric,
  learning_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id uuid REFERENCES trends(id),
  alert_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  severity text,
  confidence numeric,
  evidence_ids jsonb DEFAULT '[]',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- SAVED TRENDS
CREATE TABLE IF NOT EXISTS saved_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trend_id uuid NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, trend_id)
);

-- AI REQUESTS AUDIT
CREATE TABLE IF NOT EXISTS ai_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  business_id uuid REFERENCES businesses(id),
  request_type text NOT NULL,
  provider text,
  runtime text,
  model text,
  model_version text,
  intelligence_version text,
  input_reference jsonb,
  output_reference jsonb,
  status text,
  latency_ms integer,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- SYSTEM LOGS
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  resource text,
  resource_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
