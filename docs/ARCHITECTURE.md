# T→G System Architecture — Phase 2 Real-World Data Integration

## 1. Single 14-Stage Trend Intelligence Pipeline

```text
REAL DATA SOURCES (YouTube Data API, Reddit OAuth, News/RSS, Trends Provider, Demo)
      ↓
COMMON CONNECTOR INTERFACE (DataSourceConnector)
      ↓
RAW SOURCE RECORDS (Idempotent upsert & content hashing)
      ↓
STAGE 1: SIGNAL VALIDATION (Schema validation, timestamp & field checks)
      ↓
STAGE 2: NORMALIZATION (Title cleanup, ISO UTC normalization, metric scaling)
      ↓
STAGE 3: DEDUPLICATION (Content hash & 3-day temporal window matching)
      ↓
STAGE 4: LOCATION RELEVANCE (City/State/Country weighting: 100/80/60/30)
      ↓
STAGE 5: TOPIC EXTRACTION & CLUSTERING (Lexical grouping & keyword clustering)
      ↓
STAGE 6: TIME-SERIES METRICS (4 weekly volume bins, growth rate, velocity, acceleration)
      ↓
STAGE 7: DETERMINISTIC TREND SCORING (Composite 100-pt formula without LLM guesswork)
      ↓
STAGE 8: LIFECYCLE CLASSIFICATION (EMERGING, RISING, PEAKING, COOLING)
      ↓
STAGE 9: BUSINESS FIT ENGINE (Category, customer, location, product, budget fit)
      ↓
STAGE 10: HIGH-VALUE TREND SELECTION (Filter & rank top trends for actionability)
      ↓
STAGE 11: GEMINI COMPACT EVIDENCE PACKAGE (Bounded token context, zero raw data dump)
      ↓
STAGE 12: AI REASONING / OFFLINE INTERPRETATION (Validated against strict Zod schema)
      ↓
STAGE 13: OPPORTUNITY GENERATION (High-confidence business opportunity hypothesis)
      ↓
STAGE 14: ACTION PLAN ENGINE (Structured, low-risk experiment recommendation)
```

---

## 2. Source Management & Resilience

- **`SourceManager` Singleton**:
  - Registers, configures, and monitors all active and unconfigured data sources.
  - Maintains `ManagedSourceInfo` records: `sourceId`, `name`, `type`, `enabled`, `status`, `rateLimitPerMinute`, `lastSuccessfulRun`, `lastError`.
  - Exposes health inspection endpoint: `GET /api/trends/sources/status`.
- **Fault Tolerance**:
  - When a single source fails or is missing API keys, it logs `NOT_CONFIGURED` or `FAILED` without interrupting the pipeline.
  - Results are computed from the remaining healthy sources.
- **Traceable Evidence**:
  - Every analyzed trend contains traceable source records (`trendId`, `source`, `sourceRecordId`, `title`, `url`, `timestamp`, `location`, `metrics`).
  - Answer to *"Why did T→G say this trend is growing?"* is directly backed by concrete evidence.

---

## 3. Gemini Downstream Principle

- Gemini **never** calculates growth rates, trend scores, or search volume.
- All numbers and metrics are calculated deterministically by backend services (`TimeSeriesEngine`, `TrendScorer`, `BusinessFitEngine`).
- Gemini receives only a compact, structured evidence package and outputs an actionable interpretation conforming strictly to `StructuredAiAnalysis` schema.
