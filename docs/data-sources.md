# T→G Phase 2 — Permitted Data Sources & Real-World Connectors

This document defines the real-world permitted external data sources, connector architecture, credentials, rate limiting, and failure handling policies for the T→G (Trend to Growth) backend.

---

## 1. Connector Architecture Overview

Every external data provider plugs into a unified common interface (`DataSourceConnector`):

```ts
interface DataSourceConnector {
  name: string;
  isConfigured(): boolean;
  healthCheck(): Promise<ConnectorHealth>;
  fetchSignals(params: FetchSignalParams): Promise<TrendSignal[]>;
  normalize(data: unknown[], params?: FetchSignalParams): Promise<TrendSignal[]>;
  getSourceMetadata(): SourceMetadata;
  respectRateLimit(): Promise<void>;
  handleErrors(error: unknown): ConnectorError;
}
```

All connectors normalize diverse incoming payloads into the standardized, strongly-typed `TrendSignal` model before feeding into the single 14-stage trend intelligence pipeline.

---

## 2. Supported Connectors

### A. YouTube Data API v3 (`YouTubeConnector`)
- **Official API Endpoint**: `https://www.googleapis.com/youtube/v3/search` & `/videos`
- **Purpose**: Ingests video titles, descriptions, view counts, comment counts, and like counts to measure consumer engagement.
- **Required Environment Variable**:
  ```env
  YOUTUBE_API_KEY=your_google_cloud_youtube_api_key
  ```
- **Rate Limits**: 10,000 units/day quota default on Google Cloud Platform. Search queries cost 100 quota units; video statistics cost 1 quota unit.
- **Rate Limit & Cost Control**: In-memory 3-minute TTL cache per `(city, category)` tuple prevents rapid quota depletion.
- **Scraping Policy**: Strict zero-scraping. Direct official Google API v3 calls with `AbortSignal.timeout(6000)` only.

### B. Reddit OAuth API (`RedditConnector`)
- **Official API Endpoint**: `https://oauth.reddit.com/r/{subreddit}/search` & `https://www.reddit.com/api/v1/access_token`
- **Purpose**: Ingests community discussions, upvote scores, comment velocity, and consumer questions.
- **Required Configuration**:
  ```env
  REDDIT_CLIENT_ID=your_reddit_app_client_id
  REDDIT_CLIENT_SECRET=your_reddit_app_client_secret
  REDDIT_USER_AGENT=TrendToGrowthBot/1.0
  ```
- **City Mapping**: Checks city subreddits (e.g., `r/pune`, `r/nashik`, `r/mumbai`, `r/bangalore`) or searches with explicit city token queries on `r/india` / `r/all`.
- **Rate Limits**: Official Reddit OAuth client credentials allows up to 60 requests per minute with OAuth Bearer tokens.
- **Scraping Policy**: Strict zero-scraping. Only official JSON/OAuth API endpoints are used.

### C. News & RSS Feeds (`NewsRSSConnector`)
- **Feeds**: Google News RSS feeds with localized Indian geocoding:
  `https://news.google.com/rss/search?q={city}+market+OR+trend+OR+business&hl=en-IN&gl=IN&ceid=IN:en`
- **Parsing**: High-performance streaming XML parsing with `fast-xml-parser`.
- **Extraction**: Title, clean HTML-stripped description, GUID, pubDate, and source attribution.
- **Rate Limits**: Respects feed interval minimums (500ms delay between consecutive feed queries).

### D. Google Trends / Search Provider (`GoogleTrendsConnector`)
- **Provider Interface**:
  ```ts
  interface TrendSearchProvider {
    name: string;
    isConfigured(): boolean;
    search(params: TrendSearchProviderParams): Promise<TrendSignal[]>;
  }
  ```
- **Configuration**:
  ```env
  GOOGLE_TRENDS_PROVIDER=provider_adapter_name
  GOOGLE_TRENDS_API_KEY=your_provider_api_key
  ```
- **File Import Adapter**: Supports importing legitimate exported search trend data (CSV/JSON) via `data/trends-export/` or designated adapter.
- **Scraping Policy**: Never scrapes Google Trends web pages. If no legitimate provider or import is present, reports `NOT_CONFIGURED`.

---

## 3. LIVE vs DEMO Mode Behavior

| Dimension | `DEMO_MODE=true` (or `mode: 'demo'`) | `DEMO_MODE=false` (or `mode: 'live'`) |
|---|---|---|
| **Primary Ingestion** | Synthetic multi-week signal generator (`DemoConnector`) | Active, configured real connectors (`YouTube`, `Reddit`, `NewsRSS`, `GoogleTrends`) |
| **Response Tag** | `"dataMode": "DEMO"`, `"notice": "DEMO DATA — NOT LIVE"` | `"dataMode": "LIVE"`, `"notice": "LIVE MARKET DATA"` |
| **Unconfigured Sources** | Marked `DISABLED` / `NOT_CONFIGURED` | Marked `NOT_CONFIGURED` (never fabricated) |
| **No Records Found** | N/A (generates demo signals) | Returns 0 trends with explicit notice; does NOT substitute fake data |

---

## 4. Multi-Source Confirmation & Resilience

- **Cross-Source Confirmation**: When multiple distinct platforms (e.g. YouTube + Reddit + News) detect signals for the same topic, `TimeSeriesEngine` assigns a high `crossSourceConfirmation` score (up to 1.0) and boosts `crossSourceScore` in `TrendScorer`.
- **Resilience**: Connectors run under independent `try / catch` blocks with request timeouts (`AbortSignal.timeout(6000)`). If one connector fails (e.g. network timeout or invalid key), it is marked `FAILED` with an error message, while the remaining sources process without interruption.
