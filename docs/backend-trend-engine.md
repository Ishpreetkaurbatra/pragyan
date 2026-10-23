# T→G Backend Trend Intelligence Engine
### Architecture, Pipeline Specification & AI Reasoning Layer Reference

> **"T→G finds the trends that matter to your business — and tells you what to consider doing next."**

---

## 1. Architecture

The T→G Backend Trend Intelligence Engine provides a deterministic, multi-source pipeline that collects market signals, filters them for hyper-local relevance, clusters them into market trends, calculates time-series momentum metrics, computes multi-dimensional business fit, and passes a compact, verified evidence package to Google Gemini for structured commercial interpretation.

```
                      ┌──────────────────────────────────────────────┐
                      │          MULTI-SOURCE INGESTION              │
                      │  (Demo, YouTube, Reddit, News, GoogleTrends) │
                      └──────────────────────┬───────────────────────┘
                                             │ Raw Signals
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │              SIGNAL VALIDATOR                │
                      │   (Schema, Source, Age < 1yr, Non-negative)  │
                      └──────────────────────┬───────────────────────┘
                                             │ Valid Signals
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │              SIGNAL NORMALIZER               │
                      │    (Text Clean, Canonical URL, ISO Dates)   │
                      └──────────────────────┬───────────────────────┘
                                             │ Normalized Signals
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │             SIGNAL DEDUPLICATOR              │
                      │ (Exact IDs, URLs, 3-Day Window Jaccard Sim)  │
                      └──────────────────────┬───────────────────────┘
                                             │ Unique Signals
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │               LOCATION FILTER                │
                      │   (City: 100, State: 80, Country: 60, Global)│
                      └──────────────────────┬───────────────────────┘
                                             │ Ranked Located Signals
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │       TOPIC EXTRACTOR & TREND CLUSTERER      │
                      │   (Lightweight NLP, Stopwords, Canonical)   │
                      └──────────────────────┬───────────────────────┘
                                             │ Trend Clusters
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          TIME-SERIES METRICS ENGINE          │
                      │   (W1-W4 Volumes, Growth, Velocity, Accel)   │
                      └──────────────────────┬───────────────────────┘
                                             │ Momentum Metrics
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │       DETERMINISTIC TREND SCORER             │
                      │   (100% Deterministic: Growth 25%, Accel 20%)│
                      └──────────────────────┬───────────────────────┘
                                             │ Trend Score
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │            LIFECYCLE CLASSIFIER              │
                      │  (RISING, EMERGING, VALIDATED, PEAKING, etc) │
                      └──────────────────────┬───────────────────────┘
                                             │ Classified Clusters
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │              BUSINESS FIT ENGINE             │
                      │  (Category, Product, Customer, Location Fit) │
                      └──────────────────────┬───────────────────────┘
                                             │ Evaluated Candidates
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │              HIGH-VALUE SELECTOR             │
                      │ (Ranks Fit 40% + Trend 35% + Location 25%)   │
                      └──────────────────────┬───────────────────────┘
                                             │ Compact Evidence Package
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │             GEMINI REASONING LAYER           │
                      │ (System Prompt, Strict Evidence, Zod Schema) │
                      └──────────────────────┬───────────────────────┘
                                             │ Structured Analysis
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │         OPPORTUNITY & ACTION PLAN ENGINES    │
                      │ (Feasibility, Risk, Test Plan, Pilot Budget) │
                      └──────────────────────────────────────────────┘
```

---

## 2. Data Flow & Provenance

Every incoming trend signal preserves complete audit provenance:
- **`source`**: Data source (`demo`, `youtube`, `reddit`, `news_rss`, `google_trends`).
- **`sourceRecordId`**: Original external identifier (video ID, post ID, article link).
- **`url`**: Canonical URL stripped of tracking UTM and referral parameters.
- **`timestamp`**: ISO-8601 publication or detection timestamp.
- **`collectedAt`**: ISO-8601 ingestion timestamp.
- **`status`**: Provenance lifecycle (`RAW` → `VALID` / `REJECTED` / `DUPLICATE`).
- **`duplicateOf`**: Linked to the master canonical signal ID when deduplicated.

---

## 3. Database Tables

The pipeline maps directly to the PostgreSQL schema defined in `database/migrations/002_trend_intelligence_pipeline.sql` and supported in-memory via `PipelineRepository`:

1. **`pipeline_runs`**: Records each execution run, city, status, execution statistics, and errors.
2. **`raw_source_records`**: Unmodified ingested payloads, keyed by `(source, source_record_id)` with content hash.
3. **`normalized_signals`**: Cleaned, validated signals with engagement metrics and cluster references.
4. **`trend_clusters`**: Aggregated trend concepts, weekly volumes, total score, and lifecycle status.
5. **`trend_source_evidence`**: Cross-source confirmation records linking sources to clusters.
6. **`trend_predictions`**: City-specific business fit scores, timing fit, and projected direction.
7. **`ai_analyses`**: Grounded structured Gemini model responses with Zod validation audit.
8. **`opportunities`**: Numerical opportunity scores, customer segments, and expected outcomes.
9. **`action_plans`**: Single concrete test plan with KPIs, success thresholds, and exit criteria.

---

## 4. Scoring Formulas (100% Deterministic)

Gemini **NEVER** invents momentum scores or business fit scores. All numerical rankings are calculated in backend code.

### 4.1. Trend Momentum Score (100% Total)
```text
Total Score = 
    (Growth Score × 0.25) +
    (Acceleration Score × 0.20) +
    (Cross-Source Score × 0.20) +
    (Persistence Score × 0.15) +
    (Recency Score × 0.10) +
    (Geographic Spread Score × 0.05) +
    (Source Quality Score × 0.05)
```

- **Growth Rate**: `(Volume_W4 - Volume_W3) / Volume_W3` (e.g. +45% growth).
- **Velocity**: Average weekly gain across the 4-week window `(W4 - W1) / 3`.
- **Acceleration**: Change in velocity `(W4 - W3) - (W3 - W2)`.
- **Persistence**: Fraction of observation intervals showing strictly non-negative growth `(0.0 - 1.0)`.
- **Cross-Source Confirmation**: Ratio of distinct sources observing positive interest (≥3 sources = 1.0, 2 sources = 0.8, 1 source = 0.4).

### 4.2. Business Fit Score (100% Total)
```text
Business Fit = 
    (Category Fit × 0.20) +
    (Product Fit × 0.20) +
    (Customer Fit × 0.20) +
    (Location Fit × 0.15) +
    (Goal Fit × 0.15) +
    (Timing Fit × 0.10)
```

### 4.3. Opportunity Score (100% Total)
```text
Opportunity Score = 
    (Business Fit × 0.35) +
    (Trend Momentum Score × 0.30) +
    (Market Timing × 0.15) +
    (Implementation Feasibility × 0.10) +
    (Risk Mitigation × 0.10)
```

---

## 5. Location Matching & Dynamic Cities

City names are **never hardcoded**. The pipeline accepts any city in India or globally (e.g. Nashik, Pune, Mumbai, Ahmedabad, Bengaluru, Delhi, Jaipur, Sangamner).

Configurable Location Relevance weights:
- **`CITY_MATCH`**: `100` (Signal originates in target city or specifically mentions city in text/keywords).
- **`STATE_MATCH`**: `80` (Signal originates within the same state/province).
- **`COUNTRY_MATCH`**: `60` (National-level trend signal).
- **`GLOBAL`**: `30` (Unlocated or global trend signal).

---

## 6. Gemini Evidence Package & System Prompt

### 6.1. The Compact Evidence Package
The raw signal database is **NEVER** transmitted to Gemini. Only a curated, compact evidence package is provided:

```typescript
interface TrendIntelligencePackage {
  trendId: string;
  trendName: string;
  location: { city: string; state?: string; country?: string; };
  stage: string;
  metrics: { growth: number; acceleration: number; persistence: number; crossSource: number; totalScore: number; };
  sources: Array<{ source: string; signal: string; value?: number; }>;
  geography: string[];
  business: BusinessContext;
  businessFit: { score: number; reasons: string[]; };
}
```

### 6.2. Strict Backend System Prompt
The system prompt explicitly commands Gemini to:
1. Ground every conclusion strictly in the provided evidence.
2. Never invent search volumes, engagement numbers, or market statistics.
3. Treat relative search interest as an index (0-100), not absolute volume.
4. Distinguish observed data from commercial inference.
5. Produce strictly validated JSON matching the Zod schema.

---

## 7. API Endpoints

### 7.1. Main Analysis Endpoint: `POST /api/trends/analyze`

**Request:**
```json
{
  "business": {
    "businessName": "Urban Brew",
    "businessType": "Cafe",
    "industry": "Food & Beverage",
    "city": "Nashik",
    "state": "Maharashtra",
    "country": "India",
    "targetCustomers": ["college students", "young professionals"],
    "products": ["coffee", "cold beverages", "snacks"],
    "businessGoals": ["increase sales", "discover new products"]
  },
  "mode": "demo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": { "city": "Nashik", "state": "Maharashtra", "country": "India" },
    "mode": "DEMO",
    "notice": "DEMO DATA — NOT LIVE",
    "trends": [...],
    "topTrend": {
      "cluster": {
        "name": "Matcha Beverages",
        "lifecycle": "RISING",
        "trendScore": { "totalScore": 86, "growthScore": 80 },
        "timeSeries": { "currentVolume": 64, "growthRate": 0.60, "acceleration": 10 }
      },
      "businessFit": { "totalScore": 93, "reasons": [...] },
      "opportunity": {
        "opportunityTitle": "Launch Matcha Beverages Pilot: Introduce a localized, low-risk pilot offering",
        "opportunityScore": 88
      },
      "actionPlan": {
        "whatToTest": "Pilot launch of Signature Matcha Beverages pilot edition",
        "targetCustomer": "college students and young professionals in Nashik",
        "testDuration": "14 days",
        "budgetLevel": "₹2,500 – ₹5,000 (Small batch testing)",
        "kpi": "Daily units sold & repeat order percentage",
        "successThreshold": "Average 15+ units sold daily with >= 20% repeat customer orders within 14 days"
      }
    }
  }
}
```

### 7.2. Pipeline Execution Endpoint: `POST /api/pipeline/run`

**Request:**
```json
{
  "city": "Pune",
  "state": "Maharashtra",
  "country": "India",
  "mode": "demo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "runId": "89911921-89c9-4c5b-ad8c-fc58e6e8d052",
    "city": "Pune",
    "mode": "DEMO",
    "stats": {
      "rawRecords": 64,
      "validRecords": 64,
      "rejectedRecords": 0,
      "duplicates": 0,
      "signals": 64,
      "clusters": 4,
      "highValueTrends": 4,
      "aiAnalyses": 1
    },
    "topTrendName": "Matcha Beverages"
  }
}
```

---

## 8. Zero-Config Demo Mode

The engine is fully functional out-of-the-box in **Zero-Config Demo Mode** without requiring external API keys, database credentials, or third-party accounts.

- Synthetic multi-city dataset includes differentiated profiles for:
  - **Nashik** (Matcha, Protein Snacks, Cold Brew, Sustainable Packaging)
  - **Pune** (Matcha, Cold Brew, Protein Snacks, AI Productivity Tools)
  - **Mumbai** (Matcha, Cold Brew, Functional Beverages, Personalized Gifts)
  - **Ahmedabad** (Sustainable Packaging, Protein Snacks, Cold Brew)
  - **Bengaluru** (AI Productivity Tools, Smart Fitness Accessories, Matcha, Sustainable Packaging)
  - **Delhi** (Functional Beverages, Personalized Gifts, Protein Snacks)
  - **Dynamic Fallback**: Generates deterministic location-aware profiles for ANY other city worldwide.
- Every synthetic output is explicitly labeled with:
  ```text
  DEMO DATA — NOT LIVE
  ```

---

## 9. Environment Variables

| Variable | Description | Default / Mode |
|---|---|---|
| `APP_ENV` | Environment mode (`development`, `production`) | `development` |
| `PORT` | API Server listening port | `4000` |
| `GEMINI_API_KEY` | Google Gemini API key for AI reasoning | Server-side only |
| `GEMINI_MODEL` | Gemini model name | `gemini-1.5-flash` |
| `YOUTUBE_API_KEY` | Official YouTube Data API v3 key | Server-side only |
| `REDDIT_CLIENT_ID` | Reddit OAuth client ID | Server-side only |
| `REDDIT_CLIENT_SECRET` | Reddit OAuth client secret | Server-side only |
| `REDDIT_USER_AGENT` | Reddit API bot user agent | `TrendToGrowthBot/1.0` |
| `GOOGLE_TRENDS_PROVIDER` | Google Trends provider mode | `mock` / `custom` |
| `DATABASE_URL` | PostgreSQL connection string | Optional (in-memory fallback) |
| `DEMO_MODE` | Global demo fallback flag | `true` |

---

## 10. Resilient Error Handling

The pipeline implements graceful degradation across all connector and AI failure modes:
1. **Connector Isolation**: If YouTube, Reddit, or News RSS fails or credentials are not configured, the connector reports `status = DISABLED` or `DEGRADED`, and the pipeline proceeds with all remaining sources without crashing.
2. **AI Fallback**: If Gemini times out, returns malformed JSON, or the API key is not configured, the engine falls back to an offline, deterministic interpretation strictly grounded in the mathematical evidence package, marking status `AI_OFFLINE_INTERPRETED`.
3. **Idempotency**: Running `POST /api/pipeline/run` repeatedly with the same inputs performs deterministic upserts without duplicate records.
