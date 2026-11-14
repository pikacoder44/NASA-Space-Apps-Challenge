# AstroTrack — Astronaut Adaptive Health Monitoring System (AAHMS)
### NASA Space Apps Challenge 2026 · Challenge: "Create Health Monitoring Software for Astronauts on Space Missions"

Autonomous clinical cockpit and vital sign monitoring software designed for long-duration human spaceflight under deep-space communication delays (up to 22 minutes to Mars).

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 20+ and npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Team FastAPI backend base URL as specified in `docs/frontend_guide.md` |
| `NEXT_PUBLIC_USE_API` | `false` | Set to `true` to route requests to live FastAPI backend; `false` runs offline demo mode |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000/api/v1` | Proposed v1 API prefix for extended modules |

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Lint
```bash
npm run lint
npm run build
```

---

## 🎮 Demo Mode vs. API Mode

### Demo Mode (`NEXT_PUBLIC_USE_API=false`)
- **100% Offline-First:** Fully functional without a backend server or internet connection.
- **Realistic Sol 90 Telemetry:** Evaluates 10 physiological vitals during interplanetary transit to Mars.
- **Salted-Hash Local Auth:** Client-side credentials using PBKDF2 with SHA-256 (100,000 iterations).
- **Preconfigured Astronaut Profiles:**
  - `commander@aahms.nasa.gov` (Password: `Apollo-2026!`)
  - `doctor@aahms.nasa.gov` (Password: `Apollo-2026!`)
  - `specialist@aahms.nasa.gov` (Password: `Apollo-2026!`)
  - `engineer@aahms.nasa.gov` (Password: `Apollo-2026!`)

### API Mode (`NEXT_PUBLIC_USE_API=true`)
- Authenticates against the FastAPI backend using JWT tokens via `POST /api/auth/login`.
- Transmits vital sign telemetry to `POST /api/readings`.
- Retrieves summary state via `GET /api/dashboard/summary`.

### Token Storage Strategy
- As agreed in the team guidelines, the JWT token is stored in client **`localStorage`** under keys `aahms_auth_token` and `token`.
- Automatically rehydrated on application mount and included in the `Authorization: Bearer <token>` header for all authenticated API requests.

---

## 🧭 Complete Application Routes

| Route | View Description | Target Guideline |
| :--- | :--- | :--- |
| `/` | Landing page: Mission context, 5 Hazards of Spaceflight, live metric preview | Public |
| `/about` | Mission narrative: Sol 90 Mars transit scenario and NASA HRP alignment | Public |
| `/demo` | 7-step guided evaluator walkthrough with live scenario preset switcher | Public |
| `/login` | Crew authentication terminal (JWT in API mode, salted demo in demo mode) | Auth |
| `/signup` | Astronaut profile onboarding with role selection | Auth |
| `/reset-password` | Emergency credential reset simulation | Auth |
| `/forgot-password` | Access recovery request | Auth |
| `/dashboard` | **AstroTrack Main Cockpit:** Status summary, sparklines, context text, ⓘ info tooltips | Core Dashboard |
| `/readings/new` | **Data Entry Form:** Inline units, Zod validation, live preview, guidance panel | Core Ingestion |
| `/readings/[indicator]` | **Longitudinal Trends:** Recharts line chart with normal/warning bands & 7d/30d toggles | Core Analytics |
| `/body-map` | **Interactive Body Map:** Anatomical zone selector with targeted physiological vitals | Core Anatomy |
| `/app` | Sol 90 Deep-Space Flight Console (extended cockpit view) | Mission Tool |
| `/app/radiation` | Space Radiation Dosimetry & Solar Particle Event shelter tracking | Mission Tool |
| `/app/exercise` | ARED resistive & T2 treadmill countermeasure compliance log | Mission Tool |
| `/app/reaction-test` | Cognitive vigilance and reaction time psychomotor test | Mission Tool |
| `/app/consistency` | Gamification streak counter, points, and crew badges | Mission Tool |
| `/app/ai-explanation` | Gemini clinical reasoning interface with offline cached fallbacks | Mission Tool |
| `/app/guides` | Measurement protocols for astronaut self-assessment | Mission Tool |

---

## 🔌 API Integration Contract

All backend communication is centralized in [`src/lib/api.ts`](file:///c:/Users/Universal%20Computer/Desktop/2026%20NASA%20Space%20Apps%20Challenge/frontend/src/lib/api.ts).

### Endpoints Confirmed from `docs/backend_guide.md`
| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create astronaut profile |
| `POST` | `/api/auth/login` | Authenticate crew and return JWT access token |
| `GET` | `/api/astronauts/me` | Return authenticated astronaut profile |
| `POST` | `/api/readings` | Ingest new physiological reading and return evaluated status |
| `GET` | `/api/readings?indicator={key}&days={n}` | Return historical time-series readings for trend charts |
| `GET` | `/api/dashboard/summary` | Return aggregated indicators, overall status, and pending tasks |
| `GET` | `/api/guidance/{indicator}/{status}` | Return clinical space medicine guidance & countermeasure text |
| `GET` | `/api/body-map/{body_part}` | Return indicators associated with anatomical zone |
| `GET` | `/api/routine/today` | Return today's scheduled health routines & checklist |

### Proposed Endpoints *(To be confirmed with backend team)*
| Method | Endpoint | Proposed Purpose | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/health/ai-explanation` | Request AI clinical reasoning explanation for vital anomalies | Proposed, to be confirmed |

---

## ⚠️ Important Note on Shared Schemas (`lib/types.ts`)

> **Notice:** The types defined in [`src/lib/types.ts`](file:///c:/Users/Universal%20Computer/Desktop/2026%20NASA%20Space%20Apps%20Challenge/frontend/src/lib/types.ts) (`Status`, `Indicator`, `Reading`, `NewReading`, `DashboardSummary`, `RoutineTask`) were copied from the team's frontend guideline (`docs/frontend_guide.md`). They **must be verified against the backend's real Pydantic schemas** (`backend/app/schemas/`) once the backend repository models are committed to ensure field-level naming alignment.

---

## ❓ Open Questions for the Backend Engineering Team

1. **Database & Migrations:** Are reference ranges seeded into PostgreSQL via SQL scripts or dynamically managed via FastAPI admin endpoints?
2. **Session Lifespan & Refresh:** What is the JWT expiration duration (e.g. 24h vs. 7 days), and is a refresh token endpoint (`POST /api/auth/refresh`) planned?
3. **Offline Sync Queue Protocol:** When reconnecting after link degradation, does `POST /api/readings` accept bulk arrays `NewReading[]`, or should the client dispatch sequential HTTP requests?
4. **AI Explanation Contract:** Should the Gemini clinical explanation endpoint be mounted under `/api/guidance/ai-explain` or `/api/v1/health/ai-explanation`?
