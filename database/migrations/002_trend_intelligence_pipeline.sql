-- T→G TREND INTELLIGENCE ENGINE MIGRATION
-- Migration: 002_trend_intelligence_pipeline.sql
-- Enables robust storage for multi-source trend ingestion, time-series metrics, AI packages, and execution plans

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PIPELINE RUNS (Provenance & execution audit)
CREATE TABLE IF NOT EXISTS pipeline_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  state text,
  country text DEFAULT 'India',
  mode text NOT NULL DEFAULT 'DEMO',
  status text NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED', 'FAILED'
  raw_records_count integer DEFAULT 0,
  valid_records_count integer DEFAULT 0,
  rejected_records_count integer DEFAULT 0,
  duplicates_count integer DEFAULT 0,
  signals_count integer DEFAULT 0,
  clusters_count integer DEFAULT 0,
  high_value_count integer DEFAULT 0,
  ai_analyses_count integer DEFAULT 0,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_runs_city ON pipeline_runs(city);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);

-- 2. RAW SOURCE RECORDS (Original untouched ingested payloads)
CREATE TABLE IF NOT EXISTS raw_source_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_run_id uuid REFERENCES pipeline_runs(id) ON DELETE SET NULL,
  source text NOT NULL, -- 'youtube', 'reddit', 'news_rss', 'google_trends', 'demo'
  source_record_id text NOT NULL,
  title text NOT NULL,
  raw_content text,
  url text,
  city text,
  state text,
  country text,
  source_timestamp timestamptz NOT NULL,
  collected_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'RAW', -- 'RAW', 'VALID', 'REJECTED', 'DUPLICATE'
  rejection_reason text,
  content_hash text NOT NULL,
  raw_payload jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_source_record UNIQUE (source, source_record_id)
);

CREATE INDEX IF NOT EXISTS idx_raw_source_records_source ON raw_source_records(source);
CREATE INDEX IF NOT EXISTS idx_raw_source_records_city ON raw_source_records(city);
CREATE INDEX IF NOT EXISTS idx_raw_source_records_timestamp ON raw_source_records(source_timestamp);
CREATE INDEX IF NOT EXISTS idx_raw_source_records_content_hash ON raw_source_records(content_hash);

-- 3. NORMALIZED SIGNALS (Cleaned, validated, structured signals)
CREATE TABLE IF NOT EXISTS normalized_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_record_id uuid REFERENCES raw_source_records(id) ON DELETE SET NULL,
  source text NOT NULL,
  source_record_id text NOT NULL,
  title text NOT NULL,
  normalized_text text,
  url text,
  city text,
  state text,
  country text DEFAULT 'India',
  category text,
  keywords jsonb DEFAULT '[]',
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  engagement_score numeric DEFAULT 0,
  raw_metrics jsonb DEFAULT '{}',
  source_metadata jsonb DEFAULT '{}',
  cluster_id uuid, -- Linked after clustering
  duplicate_of uuid REFERENCES normalized_signals(id) ON DELETE SET NULL,
  signal_timestamp timestamptz NOT NULL,
  collected_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_normalized_signals_source ON normalized_signals(source);
CREATE INDEX IF NOT EXISTS idx_normalized_signals_city ON normalized_signals(city);
CREATE INDEX IF NOT EXISTS idx_normalized_signals_category ON normalized_signals(category);
CREATE INDEX IF NOT EXISTS idx_normalized_signals_timestamp ON normalized_signals(signal_timestamp);
CREATE INDEX IF NOT EXISTS idx_normalized_signals_cluster_id ON normalized_signals(cluster_id);

-- 4. TREND CLUSTERS (Aggregated trend concepts)
CREATE TABLE IF NOT EXISTS trend_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  description text,
  primary_keywords jsonb DEFAULT '[]',
  lifecycle_status text NOT NULL DEFAULT 'SIGNAL_DETECTED', -- SIGNAL_DETECTED, EMERGING, VALIDATING, VALIDATED, RISING, PEAKING, COOLING, DECLINING
  growth_score numeric NOT NULL DEFAULT 0,
  acceleration_score numeric NOT NULL DEFAULT 0,
  cross_source_score numeric NOT NULL DEFAULT 0,
  persistence_score numeric NOT NULL DEFAULT 0,
  recency_score numeric NOT NULL DEFAULT 0,
  geographic_spread_score numeric NOT NULL DEFAULT 0,
  source_quality_score numeric NOT NULL DEFAULT 0,
  total_score numeric NOT NULL DEFAULT 0,
  current_volume numeric NOT NULL DEFAULT 0,
  previous_volume numeric NOT NULL DEFAULT 0,
  growth_rate numeric NOT NULL DEFAULT 0,
  velocity numeric NOT NULL DEFAULT 0,
  acceleration numeric NOT NULL DEFAULT 0,
  persistence numeric NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT true,
  first_detected_at timestamptz NOT NULL DEFAULT now(),
  last_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trend_clusters_category ON trend_clusters(category);
CREATE INDEX IF NOT EXISTS idx_trend_clusters_lifecycle ON trend_clusters(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_trend_clusters_total_score ON trend_clusters(total_score DESC);

-- 5. TREND SOURCE EVIDENCE (Cross-source confirmation records)
CREATE TABLE IF NOT EXISTS trend_source_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_cluster_id uuid NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  source text NOT NULL,
  signal_summary text NOT NULL,
  signal_count integer DEFAULT 1,
  total_engagement numeric DEFAULT 0,
  sample_url text,
  observed_period text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trend_source_evidence_trend ON trend_source_evidence(trend_cluster_id);
CREATE INDEX IF NOT EXISTS idx_trend_source_evidence_source ON trend_source_evidence(source);

-- 6. TREND PREDICTIONS & BUSINESS MATCHES
CREATE TABLE IF NOT EXISTS trend_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_cluster_id uuid NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  city text NOT NULL,
  predicted_direction text NOT NULL DEFAULT 'RISING',
  confidence_score numeric NOT NULL DEFAULT 0,
  projected_growth numeric,
  category_fit numeric NOT NULL DEFAULT 0,
  customer_fit numeric NOT NULL DEFAULT 0,
  location_fit numeric NOT NULL DEFAULT 0,
  product_fit numeric NOT NULL DEFAULT 0,
  goal_fit numeric NOT NULL DEFAULT 0,
  timing_fit numeric NOT NULL DEFAULT 0,
  total_business_fit numeric NOT NULL DEFAULT 0,
  fit_reasons jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trend_predictions_cluster ON trend_predictions(trend_cluster_id);
CREATE INDEX IF NOT EXISTS idx_trend_predictions_city ON trend_predictions(city);
CREATE INDEX IF NOT EXISTS idx_trend_predictions_business ON trend_predictions(business_id);

-- 7. AI ANALYSES (Structured Gemini Outputs Grounded Strictly in Evidence)
CREATE TABLE IF NOT EXISTS ai_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_cluster_id uuid NOT NULL REFERENCES trend_clusters(id) ON DELETE CASCADE,
  business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
  pipeline_run_id uuid REFERENCES pipeline_runs(id) ON DELETE SET NULL,
  model text NOT NULL,
  prompt_package jsonb NOT NULL,
  response_payload jsonb NOT NULL,
  confidence text NOT NULL DEFAULT 'MEDIUM',
  why_it_matters text,
  opportunity_summary text,
  status text NOT NULL DEFAULT 'COMPLETED', -- 'COMPLETED', 'FAILED', 'FALLBACK'
  latency_ms integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_analyses_cluster ON ai_analyses(trend_cluster_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_business ON ai_analyses(business_id);

-- 8. SYSTEM LOGS
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
