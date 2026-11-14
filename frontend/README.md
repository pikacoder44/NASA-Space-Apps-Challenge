# AAHMS Frontend — Autonomous Astronaut Health Monitoring System
## NASA Space Apps Challenge 2026: “Create Health Monitoring Software for Astronauts on Space Missions”

The **Autonomous Astronaut Health Monitoring System (AAHMS)** frontend is a production-grade, responsive aerospace web application built with **React 19**, **Next.js 16 (App Router with Turbopack)**, **TypeScript 5**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 1. Quick Start & Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (hot-reload at http://localhost:3000)
npm run dev

# 3. Run production linter (ESLint 9, zero errors required)
npm run lint

# 4. Compile optimized production build (typechecks & prerenders static routes)
npm run build

# 5. Start production server
npm run start
```

---

## 2. Environment Variables & Modes

The frontend operates in two distinct modes configured via `.env.local`:

| Variable | Default Value | Description |
|---|---|---|
| `NEXT_PUBLIC_USE_API` | `false` | When `false`, the app runs in **Demo Mode**, using the browser Web Crypto and client simulation repository (`DemoHealthRepository`). When `true`, it connects to the FastAPI backend. |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000/api/v1` | Base URL for FastAPI backend endpoints *(proposed, to be confirmed with backend team)*. |

Refer to [`.env.example`](.env.example) for placeholder configuration.

---

## 3. Demo Login Accounts

Pre-configured astronaut accounts for judges and evaluators (stored with SHA-256 Web Crypto salted hashing in browser localStorage):

| Role | Email | Password | Mission Context |
|---|---|---|---|
| **Mission Commander** | `commander@aahms.nasa.gov` | `Apollo-2026!` | Lead commander with active Sol 90 sleep-debt advisory. |
| **Flight Surgeon** | `doctor@aahms.nasa.gov` | `Apollo-2026!` | Medical officer with clinical audit and telemetry downlink privileges. |
| **One-Click Demo** | *Quick button on `/login`* | *Auto-filled* | Instant evaluator session bypassing manual form entry. |
| **Google Demo** | *Continue with Google (Demo)* | *None* | Honest modal stating Google OAuth is not connected in demo mode; initiates simulated session. |

---

## 4. Complete Application Pages

### Public Routes
- **`/`** — Home Landing Page: Hero, 10 supported measures stat strip, personal baseline interactive slider, architecture overview, feature tabs, Sol 90 Mars timeline, FAQ, and footer.
- **`/about`** — Science & Hazards: Cupola banner (`iss034e010734`), 3-tier architecture breakdown (Next.js, FastAPI, Gemini via backend), academic citations, and research disclaimer.
- **`/demo`** — 7-Step Guided Walkthrough: Day 90 mission scenario narrative with interactive flight scenario switcher (`HealthContext.setScenario`).
- **`/login`** — Terminal Sign-In: 45% visual split, demo prefill chips, honest Google demo dialog, and redirect logic.
- **`/signup`** — Crew Registration: Mission role selection, prototype research terms acknowledgment, and salted SHA-256 password storage.
- **`/reset-password`** — Passcode Calibration: Token-based credential recovery with live 4-level strength meter.

### Protected Astronaut Console Routes (`/app/*`)
- **`/app`** — Mission Cockpit / Overview: Single status triage banner (worst-condition rule), 8/4 grid, 7d/30d/mission Recharts trend chart, and dosimeter widget.
- **`/app/check-in`** — Rapid Daily Health Log: Under-60-second 4-step wizard, numerical validation, and *"Saved on this device · pending sync"* offline confirmation.
- **`/app/indicators`** — Physiological Telemetry Catalog: 10 supported measures with real-time text search and organ category filtering.
- **`/app/indicators/[indicator]`** — Indicator Deep-Dive: Dedicated telemetry view with longitudinal baseline envelopes and active medical advisory links.
- **`/app/body-map`** — Interactive Anatomical Map: 3-layer toggle (Organ Systems, Countermeasures, Dosimetry), NASA EVA imagery (`iss034e035879`), and hotspot selection.
- **`/app/trends`** — Longitudinal Trend Analysis: Multi-horizon envelope tracking (7d, 30d, Full Mission), drift detection, and data completeness metric.
- **`/app/alerts`** — Explainable Advisories: Transparent non-blackbox variance reasoning, crew acknowledgment toggles, and flight surgeon escalation criteria.
- **`/app/alerts/[id]`** — Alert Detail View: Interactive operational countermeasure checklist and contributing vital telemetry breakdown.
- **`/app/guides`** — Standard Operating Procedures: 6 flight hardware measurement manuals with execution times and category tags.
- **`/app/guides/[slug]`** — SOP Step-by-Step Manual: Phase 1 prep, Phase 2 execution, spaceflight pitfalls, and flight hardware troubleshooting.
- **`/app/ai-explanation`** — Autonomous AI Synthesis Lab: 3 simulated states (Pre-written Demo response, API-ready contract dispatch, and deterministic offline fallback).
- **`/app/radiation`** — Cosmic Dosimetry: Van Allen Probes imagery (`PIA26047`), career limit progress bar (600 mSv), and solar storm shelter guidance.
- **`/app/exercise`** — Countermeasure Adherence: NASA ARED banner (`iss038e022180`), weekly target adherence ribbon, and workout logging form.
- **`/app/records`** — Diagnostic Lab Records: Storage and visualization for glucometer, SANS near-vision acuity cards, and refractometers.
- **`/app/consistency`** — Protocol Consistency & Gamification: Ethical non-punitive streak tracking, protocol points, and unlocked achievement badges.
- **`/app/reaction-test`** — Psychomotor Vigilance Test (PVT): 5-round reaction speed test measuring millisecond response latency and fatigue risk index.
- **`/app/log`** — Telemetry Retention & Ground Sync: Chronological audit of Sol 85–90, pending queue status, and JSON telemetry export.
- **`/app/settings`** — Mission Preferences: Demonstration scenario switcher, units toggle (Celsius/Fahrenheit), reduced motion toggle, and local JSON export.
- **`/_not-found`** — Trajectory Lost (404): Custom aerospace orbital recovery screen.
- **`/error`** — Diagnostic Error Boundary: Safe recovery with retry action.

---

## 5. Backend Integration Points & Proposed API Contracts

All endpoints below are **proposed and to be confirmed with the backend engineering team**. Endpoints are centralized in [`src/services/apiClient.ts`](src/services/apiClient.ts):

| Integration Domain | Proposed HTTP Method & Path | Description |
|---|---|---|
| **Mission Overview** | `GET /api/v1/mission/overview` | Returns aggregate astronaut status, active alerts, key indicator snapshots, and sync state. |
| **Indicator Detail** | `GET /api/v1/indicators/{id}` | Fetches detailed snapshot and reference bounds for a single physiological metric. |
| **Indicator History** | `GET /api/v1/indicators/{id}/history?range=30d` | Returns historical data points, rolling baseline envelope, and trend trajectory. |
| **Daily Check-In** | `POST /api/v1/check-in` | Submits self-reported vitals and subjective scores. Returns `SaveResult` and gamification points. |
| **Alerts Catalog** | `GET /api/v1/alerts` | Fetches active Yellow/Red health advisories with contributing indicators. |
| **Radiation Summary** | `GET /api/v1/radiation/summary` | Retrieves dosimeter readings, daily rate, and career reference limit status. |
| **Exercise Logging** | `GET /api/v1/exercise/entries`<br>`POST /api/v1/exercise` | Logs and retrieves countermeasure workouts (ARED, CEVIS, T2). |
| **Manual Lab Records** | `GET /api/v1/records/manual`<br>`POST /api/v1/records/manual` | Ingests diagnostic lab readings (glucometer, refractometer, SANS vision). |
| **Telemetry Downlink** | `GET /api/v1/sync/status`<br>`POST /api/v1/sync/downlink` | Checks Deep Space Network queue status and submits queued telemetry packets. |
| **AI Synthesis** | `POST /api/v1/health/ai-explanation` | Dispatches telemetry snapshots to FastAPI backend, which prompts Gemini and returns structured clinical explanation. |
| **Auth Session** | `POST /api/v1/auth/login`<br>`POST /api/v1/auth/register`<br>`GET /api/v1/auth/session` | Handles crew credential verification and session token issuance. |

---

## 6. Open Questions for the Engineering Team

1. **Database & Timeseries Architecture**:
   - What database will the FastAPI backend utilize for timeseries physiological telemetry (e.g., PostgreSQL with TimescaleDB, DuckDB, or SQLite for local edge testing)?
2. **Authentication Ownership & Session Mechanism**:
   - Will the production backend issue httpOnly JWT session cookies or bearer tokens in an `Authorization` header?
3. **Telemetry Downlink Conflict Resolution**:
   - During long communications blackouts where an astronaut logs multiple check-ins offline, what timestamp precedence rule will the backend apply during batch synchronization?
4. **AI Explanation Payload Semantics**:
   - For `POST /api/v1/health/ai-explanation`, will the Gemini response be streamed via Server-Sent Events (SSE) or returned as a single JSON object?
   - How should the AI `confidence` percentage be mathematically defined (e.g., pattern match vector similarity vs model logprobs)?
