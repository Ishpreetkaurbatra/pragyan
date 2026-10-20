# T→G (Trend to Growth)
### Full-Stack Business Intelligence Platform with a Replaceable AI Intelligence Layer

> **"T→G finds the trends that matter to your business — and tells you what to consider doing next."**

---

## 🌟 The Core Loop
```
DETECT → ANALYZE → MATCH → OPPORTUNITY → ACTION PLAN → EXPERT VALIDATE → EXPERIMENT → MEASURED GROWTH
```

T→G turns scattered market signals into validated commercial action without lock-in to any proprietary AI model.

---

## 🎨 Visual Identity — Soft Glassmorphism
> **“Soft Glass. Strong Intelligence. Visible Growth.”**

- **Theme**: Premium Soft Glassmorphism + Business Intelligence dashboard.
- **Glassmorphism**: Translucent panels (`backdrop-filter: blur(18px)`), rounded cards (24px), soft ambient icy blue-grey gradients (`#E9F0F8`).
- **Brand Palette**:
  - Main Background: `#E9F0F8` | Secondary Background: `#F3F7FB` | Base Card: `#FFFFFF`
  - Typography: Dark Navy `#0F172A`, Slate `#64748B`, Muted `#94A3B8`
  - Intelligence Blue: `#2563EB`, `#3B82F6`, `#1D4ED8`, `#DBEAFE`
  - Growth Green & Teal: `#10B981`, `#14B8A6`, `#047857`, `#D1FAE5`
  - Warning Orange: `#F59E0B`, `#FEF3C7`
- **Button System**: Bold, high-contrast primary CTA buttons with blue-to-green gradient (`linear-gradient(135deg, #2563EB, #10B981)`).
- **Signature Feature**: Trend Finder vertical discovery feed with CSS Scroll Snap (inspired by Reels/Shorts using realistic photography, zero video clutter).

---

## 🏗️ Architecture & Strict Separation

```
pragyan/
├── frontend/               # React + TypeScript + Vite + Tailwind CSS + Lucide + Recharts
│   ├── src/
│   │   ├── components/     # Layout, Navbar, Sidebar
│   │   ├── pages/          # Landing, Dashboard, Trend Finder, Analytics, Opportunities,
│   │   │                   # Action Plans, Expert Validation, Experiments, Alerts, Ask T→G, Admin
│   │   ├── services/api/   # Central typed API client
│   │   ├── styles/         # Glassmorphism tokens & scroll-snap
│   │   └── types/          # Domain contracts
│   └── package.json
│
├── backend/                # Node.js + Express + TypeScript modular architecture
│   ├── src/
│   │   ├── controllers/    # Express route handlers
│   │   ├── intelligence/   # IntelligenceProvider interface, MockProvider, LocalOpenModelProvider, TGoModelProvider
│   │   ├── middleware/     # Request ID, Auth & Role verification, Error handlers
│   │   ├── models/         # TypeScript entities
│   │   ├── repositories/   # In-Memory seeded repository + PostgreSQL repository interface
│   │   ├── routes/         # Standard REST endpoints matching master contract
│   │   ├── services/       # Domain business logic
│   │   └── server.ts       # Express server entry point
│   └── package.json
│
├── database/               # PostgreSQL + pgvector Schema & Seeds
│   ├── extensions.sql      # uuid-ossp, pgvector
│   ├── migrations/         # 001_initial_schema.sql
│   └── seeds/              # 001_demo_seed.sql (FreshBite Café, 7 signature trends, metrics, signals)
│
├── docs/                   # ARCHITECTURE.md, API_REFERENCE.md
├── docker-compose.yml      # Multi-container startup for PostgreSQL (pgvector), backend, frontend
├── .env.example
└── README.md
```

---

## 🚀 Quick Start (Zero-Config Demo Mode)

No paid API keys, external databases, or AI models are required to run the full application.

### 1. Run the Backend API (Port 4000)
```bash
cd backend
npm install
npm run dev
```

### 2. Run the Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 🧪 Verification Tests
Run automated backend verification tests (validating `analyzeTrend`, `matchBusiness`, `generateActionPlan`, and `answerBusinessQuestion`):

```bash
cd backend
npm test
```

---

## 🤖 Replaceable Intelligence Layer
T→G communicates through the `IntelligenceProvider` interface:

1. **`INTELLIGENCE_MODE=mock` (Default)**:
   Deterministic rule-based calculations, seeded multi-source signals, and immediate response times.
2. **`INTELLIGENCE_MODE=local`**:
   Connects to an open-weight ~8B model running locally via Ollama / vLLM (`http://localhost:11434`), with automatic graceful fallback.
3. **`INTELLIGENCE_MODE=tgo`**:
   Plugs into the future dedicated T→G trained model API without changing any frontend code.

---

## 👥 Personas Supported
Use the role-switcher in the top navigation bar to switch between:
- **Business Owner**: Explore trends, view business fit %, generate action plans, view experiments.
- **Human Expert (Rajesh Kulkarni)**: Review queued action plans, approve, request changes, or reject with notes.
- **Platform Admin**: View system telemetry, data connector health, AI latency, and audit logs.
