# AstroTrack — Astronaut Health Monitoring System

> **NASA Space Apps Challenge 2026** · Challenge: *Create Health Monitoring Software for Astronauts on Space Missions*

AstroTrack is a self-service health monitoring dashboard designed for long-duration spaceflight. Because communications between Earth and deep-space missions face significant latency (up to 22 minutes each way to Mars), crews cannot rely on real-time guidance from flight surgeons. AstroTrack provides an autonomous, easy-to-use interface for astronauts to record vital metrics, review automated status evaluations, and follow actionable medical guidance.

---

## Key Features

- **Interactive Body Map:** Click specific body regions to view relevant indicators, status history, and symptoms.
- **Vital Signs & Metric Logging:** Log core metrics including heart rate, blood pressure, body temperature, blood sugar, sleep duration, and self-reported mood.
- **Status Evaluation:** Automatic three-tier status evaluation based on NASA and aerospace medical ranges:
  - 🟢 **Normal** — Within expected baseline for resting spaceflight conditions.
  - 🟡 **Watch** — Borderline or shifting; warrants monitoring and re-measurement.
  - 🔴 **Act Now** — Out of safe range; immediate crew notification and operational countermeasures required.
- **Trend Analysis:** Dynamic charts powered by Recharts with threshold zones to identify gradual physical deconditioning or emerging health issues.
- **Actionable Guidance:** Direct, plain-language guidance explaining what each measurement indicates in a microgravity context and clear next steps.
- **Mission Routines & Checklists:** Gamified daily health check-ins, streaks, and prompts to keep crew compliant with monitoring protocols.

---

## System Architecture & Tech Stack

| Layer | Stack | Details |
|---|---|---|
| **Frontend** | Next.js (React), TypeScript, Tailwind CSS | Responsive dashboard with dark-mode first UI for mission environments |
| **Charts** | Recharts | Multi-interval trend visualization with threshold bands |
| **Backend** | Python 3.11+, FastAPI, Pydantic | REST API with schema validation and automated OpenAPI docs |
| **Database** | PostgreSQL, SQLAlchemy | Stores astronaut profiles, time-series readings, reference ranges, and guidance texts |
| **Authentication** | JWT (JSON Web Tokens) | Secure per-crew profile management |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) | Cloud deployment with local Docker support |

---

## Repository Structure

```text
astrotrack/
├── frontend/             # Next.js application
│   ├── app/              # App router pages (dashboard, body-map, readings)
│   ├── components/       # Reusable UI components
│   └── lib/              # API clients, TypeScript definitions, and theme tokens
├── backend/              # FastAPI application
│   ├── app/              # Routes, models, schemas, and evaluation engine
│   ├── core/             # Database connection, auth, and environment configuration
│   └── tests/            # Pytest test suite
├── database/             # Relational schema management
│   ├── migrations/       # Versioned SQL migration scripts
│   └── seeds/            # NASA-backed reference ranges and guidance entries
├── docs/                 # Team implementation guidelines
│   ├── frontend_guide.md
│   ├── backend_guide.md
│   ├── database_guideline.md
│   └── submission_guide.md
├── docker-compose.yml    # Local multi-container setup
└── README.md
```

---

## Team Guides

Detailed specifications and implementation rules for each component:

- 📘 [Frontend Team Guidelines](docs/frontend_guide.md) — UI design rules, page layouts, TypeScript types, and Recharts setup.
- 📙 [Backend Team Guidelines](docs/backend_guide.md) — API contract, status evaluation logic, and endpoint specifications.
- 🗄️ [Database Guidelines](docs/database_guideline.md) — Schema, indexes, migrations workflow, and seed data.
- 📋 [Submission Guide](docs/submission_guide.md) — Hackathon deliverables checklist, demo video/slides format, and submission steps.

---

## Grounded in NASA Research

AstroTrack's indicators and guidance map directly to **NASA's Five Hazards of Human Spaceflight**:

| Hazard | Spaceflight Impact | Monitored Indicators |
|---|---|---|
| **1. Space Radiation** | Cellular and immune changes | Blood markers, symptoms |
| **2. Isolation & Confinement** | Mood disruption, sleep disturbances | Sleep hours, mood score, cognitive checklist |
| **3. Distance from Earth** | No real-time clinical access | Automated triage and guidance engine |
| **4. Gravity Fields (Microgravity)** | Muscle atrophy, cardiovascular deconditioning, fluid shift | Heart rate, blood pressure, body temperature |
| **5. Hostile Closed Environments** | Nutritional shifts, pathogen load | Blood glucose, physiological vitals |

### Official References
- **[NASA Human Research Program: 5 Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)**
- **[NASA HRP: Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)**
- **[NASA HRP: Ongoing Research in Space](https://www.nasa.gov/hrp/ongoing-hrp-research/)**
- **[CSA: Monitoring Radiation for Astronaut Health](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)**
- **[CSA: Why Do We Conduct Science Experiments in Space?](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)**

---

## Backend: how to run

Python 3.11+. Uses SQLite by default, so no database server is needed.

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # optional, defaults work offline
uvicorn app.main:app --reload --port 8000
```

- On first start the demo astronaut is created and **simulated** mission days 1-90 are loaded (Day 90 = today). Reload by hand: `python -m scripts.seed --up-to-day 90 --force`
- API docs: http://localhost:8000/docs · Health check: http://localhost:8000/health
- Tests (same as CI): `cd backend && python -m pytest -q`
- Postman: import `backend/postman/AstroTrack.postman_collection.json` and run the collection (or `newman run backend/postman/AstroTrack.postman_collection.json`).
- `AUTH_REQUIRED=false` (default): requests without a token use the demo astronaut. Log in with `POST /api/auth/login` and send `Authorization: Bearer <token>` to use your own profile.

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` | Account and JWT token |
| `GET /api/astronauts/me` | Current profile |
| `POST /api/readings`, `GET /api/readings?indicator=&days=` | Log a reading (evaluated on save), trend data |
| `GET /api/dashboard/summary` | Latest status of all 7 indicators from logged readings (`?day=N`: simulated scenario) |
| `GET /api/guidance/{indicator}/{status}` | Plain-language guidance |
| `GET /api/body-map/{part}`, `GET /api/routine/today` | Body map status, today's checklist |
| `GET /api/nasa/inspiration4/glucose`, `GET /api/nasa/sources` | Real NASA data (OSDR OSD-575) and NASA resources used |

**Data sources:** `data/nasa/` holds real NASA OSDR data (SpaceX Inspiration4 blood glucose, OSD-575; see `data/nasa/README.md`). `data/simulator/` is **synthetic** demo data for the other indicators, always labelled `source: "simulator"` in the API.

**Deploy (Render/Railway):** root directory `backend`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health check `/health`. Set `SECRET_KEY` and `FRONTEND_URL` (your Vercel URL). Keep the repository `data/` folder available (the default path is `../data`). Free hosting may reset SQLite; the demo data is re-seeded on startup.

---

## Local Development Setup

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL 15+ (or Docker)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-team/astrotrack.git
cd astrotrack
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Configure DATABASE_URL and SECRET_KEY
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 4. Database Setup
```bash
cd ../database
psql -U postgres -c "CREATE DATABASE astrotrack;"
psql -U postgres -d astrotrack -f migrations/001_initial.sql
psql -U postgres -d astrotrack -f seeds/reference_ranges.sql
psql -U postgres -d astrotrack -f seeds/guidance_texts.sql
psql -U postgres -d astrotrack -f seeds/health_tasks.sql
```

### 5. Docker Setup (Alternative)
To spin up all services concurrently:
```bash
docker-compose up --build
```
