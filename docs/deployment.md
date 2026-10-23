# T→G Deployment & Production Runbook

This guide covers building, verifying, running, and deploying the T→G backend and frontend services.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9+
- **TypeScript**: v5.4+

---

## 2. Installation & Build

```bash
# In backend:
cd backend
npm install
npm run build
npm test

# In frontend:
cd ../frontend
npm install
npm run build
```

---

## 3. Local Development Mode

Start backend and frontend in parallel dev servers:

```bash
# Terminal 1 - Backend API Server (Port 4000)
cd backend
npm run dev

# Terminal 2 - Frontend Application (Port 5173)
cd frontend
npm run dev
```

---

## 4. Production Deployment

### Backend Service:
```bash
cd backend
npm run build
NODE_ENV=production node dist/server.js
```
The backend server listens on `PORT` (default: 4000) and exposes health and API endpoints:
- `GET /health` — Service liveness check
- `GET /api/trends/sources/status` — Live data connector health status
- `POST /api/trends/analyze` — 14-stage Trend Intelligence Engine
- `GET /api/trends/runs/:id` — Pipeline run execution audit record

### Frontend Service:
Deploy `frontend/dist/` to any static hosting provider (e.g. Vercel, Cloudflare Pages, Firebase Hosting, Nginx).
On Vercel:
1. Set Root Directory to `frontend` (or keep root with build command `cd frontend && npm run build` and output directory `frontend/dist`).
2. Set Environment Variable:
   - `VITE_API_BASE_URL`: URL of the deployed backend API (e.g. `https://tg-backend.onrender.com` or `https://api.yourdomain.com`).
   *Note: If no deployed backend exists yet, the frontend will informatively display `Backend unavailable. Please check the T→G server connection.` instead of crashing.*

---

## 5. Security & Operational Guardrails

1. **Zero Secret Leakage**:
   - Connector credentials (`YOUTUBE_API_KEY`, `REDDIT_CLIENT_SECRET`, etc.) are only accessed via `process.env`.
   - `SourceManager` sanitizes and strips all secrets before returning status in `GET /api/trends/sources/status`.
2. **Quota Protection**:
   - In-memory 3-minute TTL caching on external queries protects against API quota exhaustion.
   - Connector requests use `AbortSignal.timeout(6000)` to prevent connection pooling deadlocks.
3. **Data Integrity Guarantee**:
   - When running in `LIVE` mode, the system never fabricates signals.
   - If an external connector is missing keys, it reports `NOT_CONFIGURED`.
