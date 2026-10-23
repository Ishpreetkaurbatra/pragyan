# T→G Environment Configuration Guide

This guide details all environment variables required for running the T→G backend in local development, demo mode, and production live data mode.

---

## 1. Core Service Configuration

```env
APP_ENV=development
PORT=4000
WEB_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

---

## 2. Operating Modes (`DEMO_MODE` & `DATA_MODE`)

| Variable | Values | Description |
|---|---|---|
| `DEMO_MODE` | `true` \| `false` | When `true`, uses synthetic 4-week signals (`DemoConnector`) labeled as DEMO DATA. When `false`, uses configured real-world external connectors. |
| `DATA_MODE` | `demo` \| `live` | Default data mode fallback for API queries. |
| `AUTH_MODE` | `demo` \| `jwt` | When `demo`, accepts `x-demo-role` HTTP header for instant persona switching. |

---

## 3. External Trend Connectors

### A. YouTube Data API v3
```env
YOUTUBE_API_KEY=AIzaSy...
```
- **How to obtain**: Create a Google Cloud Platform project, enable "YouTube Data API v3", and generate an API key in Credentials.
- **If unset**: Connector automatically reports `NOT_CONFIGURED`.

### B. Reddit OAuth API
```env
REDDIT_CLIENT_ID=your_reddit_app_id
REDDIT_CLIENT_SECRET=your_reddit_app_secret
REDDIT_USER_AGENT=TrendToGrowthBot/1.0
```
- **How to obtain**: Go to Reddit App Preferences (`https://www.reddit.com/prefs/apps`), click "create app", choose "script" type, and copy the client ID and secret.
- **If unset**: Connector automatically reports `NOT_CONFIGURED`.

### C. Google Trends / Provider
```env
GOOGLE_TRENDS_PROVIDER=mock
GOOGLE_TRENDS_API_KEY=
```
- **How to obtain**: Specify the provider adapter name or API credentials for licensed trend providers. If unconfigured, reports `NOT_CONFIGURED`.

---

## 4. AI Reasoning Layer (Gemini)

```env
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-1.5-flash
```
- **How to obtain**: Obtain from Google AI Studio (`https://aistudio.google.com/`).
- **Offline Fallback**: If unset, backend switches seamlessly to deterministic calibrated offline interpretation without throwing runtime errors.
