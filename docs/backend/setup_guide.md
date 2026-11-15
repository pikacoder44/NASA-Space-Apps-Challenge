# AstroTrack Backend Setup & Operations Guide

**System:** Autonomous Astronaut Health Monitoring System (AAHMS)  
**Technology Stack:** FastAPI, SQLAlchemy 2.0, PostgreSQL 16, Pydantic v2, Uvicorn, Docker Compose  
**Document Path:** `docs/backend/setup_guide.md`  

---

## 1. Prerequisites and Required Software

Before setting up the AstroTrack backend, ensure your workstation has the following tools installed:

* **Docker Engine** (v24.0 or higher) and **Docker Compose** (v2.20 or higher / `docker compose`).
* **Git** (for cloning and version control).
* *(Optional for local host development without Docker)*:
  * **Python 3.11** or higher.
  * **curl** or an API testing client (e.g., Postman / Insomnia / HTTPie).

Verify your installed versions:
```bash
docker --version
docker compose version
git --version
```

---

## 2. Repository Structure

The backend source code is organized under `backend/`, with simulated mission telemetry mounted from `data/`:

```text
├── docker-compose.yml              # Multi-container orchestration (FastAPI + PostgreSQL)
├── .env.example                    # Template for development environment variables
├── data/
│   └── simulator/
│       ├── generate.py             # Deterministic 180-day telemetry generator
│       └── mission_data.json       # 1,260 simulated mission observations (180 days x 7 indicators)
├── backend/
│   ├── Dockerfile.dev              # Development Dockerfile (Python 3.11-slim, hot-reload)
│   ├── .dockerignore               # Build optimization exclusions (.venv, __pycache__)
│   ├── .env.example                # Backend-specific environment template
│   ├── requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, Pytest, etc.)
│   ├── scripts/
│   │   └── seed.py                 # Telemetry & demo astronaut database seed script
│   ├── tests/                      # Automated test suite (70 tests)
│   │   ├── test_api_flow.py        # End-to-end integration lifecycle tests
│   │   ├── test_auth.py            # Registration, login, and JWT tests
│   │   ├── test_baseline.py        # Z-score statistical baseline anomaly detection tests
│   │   ├── test_dashboard.py       # Sparkline trends & Day 90 warning scenario tests
│   │   ├── test_evaluator.py       # Reference medical threshold tests
│   │   ├── test_guidance.py        # Clinical advice, body map, and routine tests
│   │   ├── test_readings.py        # Telemetry ingestion and query tests
│   │   └── test_simulator.py       # Deterministic simulator integrity tests
│   └── app/
│       ├── main.py                 # Application factory, lifespan, CORS, and top-level routes
│       ├── core/
│       │   ├── config.py           # Central Settings loaded from environment variables
│       │   ├── database.py         # SQLAlchemy engine, session maker, Base, and get_db()
│       │   └── security.py         # Bcrypt password hashing & JWT encoding/decoding
│       ├── models/
│       │   ├── astronaut.py        # Astronaut crew member ORM model
│       │   └── reading.py          # Telemetry measurement ORM model
│       ├── schemas/
│       │   ├── auth.py             # Login & register Pydantic schemas
│       │   ├── astronaut.py        # Profile response schemas
│       │   ├── reading.py          # Telemetry ingestion & response schemas
│       │   ├── dashboard.py        # Dashboard summary & indicator card schemas
│       │   ├── guidance.py         # Clinical countermeasure schemas
│       │   ├── routine.py          # Daily task checklist schemas
│       │   ├── body_map.py         # Anatomical region mapping schemas
│       │   └── ai_explanation.py   # AI telemetry analysis schemas
│       ├── routers/
│       │   ├── auth.py             # /api/auth/register, /api/auth/login
│       │   ├── astronauts.py       # /api/astronauts/me
│       │   ├── readings.py         # POST & GET /api/readings
│       │   ├── dashboard.py        # GET /api/dashboard/summary
│       │   ├── guidance.py         # GET /api/guidance/{indicator}/{status}
│       │   ├── routine.py          # GET /api/routine/today
│       │   ├── body_map.py         # GET /api/body-map/{body_part}
│       │   └── ai_explanation.py   # POST /api/v1/health/ai-explanation & /api/health/ai-explanation
│       └── services/
│           ├── evaluator.py        # Master clinical evaluation engine ("the brain")
│           ├── baseline.py         # 30-day personal baseline anomaly detection (z-scores)
│           ├── reference_data.py   # Static physiological normal/warning limits & units
│           └── guidance_data.py    # Evidence-based space medicine countermeasures & body map
```

---

## 3. Environment Variable Configuration

### 3.1 Where `.env` Belongs
* **For Docker Compose:** Place `.env` in the **repository root directory** (`.env`). Docker Compose automatically reads this file when interpolating compose variables.
* **For Standalone Local Development:** Place `.env` inside `backend/.env` or export environment variables in your shell.

### 3.2 Configuring `.env` from the Template
Copy the template to create your `.env` file:
```bash
cp backend/.env.example .env
```

### 3.3 Environment Variables Reference

| Variable | Default (Development) | Purpose |
| :--- | :--- | :--- |
| `POSTGRES_USER` | `astro_user` | PostgreSQL administrative username |
| `POSTGRES_PASSWORD` | `your_local_secure_password` | PostgreSQL password |
| `POSTGRES_DB` | `astrotrack_db` | PostgreSQL database name |
| `DATABASE_URL` | `postgresql+psycopg2://astro_user:your_local_secure_password@db:5432/astrotrack_db` | SQLAlchemy connection string |
| `SECRET_KEY` | `insecure_dev_secret_key_for_hackathon_only` | HMAC-SHA256 key for signing JWT tokens |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed origin for Next.js CORS middleware |
| `AUTH_REQUIRED` | `false` | When `false` (demo mode), anonymous calls map to demo astronaut `1`. When `true`, valid JWT is enforced. |

> [!CAUTION]
> **Production Security Warning:** The values in `.env.example` (such as `SECRET_KEY` and default passwords) are strictly for local development and demonstration. They **must be replaced** with strong, cryptographically generated secrets before deploying to staging or production environments.

---

## 4. Starting the Backend and Database with Docker Compose

To build and start both the PostgreSQL database and FastAPI backend services in detached mode, run from the repository root:

```bash
docker compose up -d --build
```

### What Happens During Startup:
1. **Network & Volume Provisioning:** Docker creates the internal network `nasaspaceappschallenge_default` and persistent volume `postgres_data`.
2. **PostgreSQL Startup (`astrotrack_db`):** PostgreSQL 16 initializes on internal port `5432` and maps to **host port `5433`**.
3. **Health Check Wait:** The backend container waits until the PostgreSQL healthcheck (`pg_isready`) reports `healthy`.
4. **FastAPI Initialization (`astrotrack_backend`):**
   * Python dependencies from `requirements.txt` are verified.
   * Host directory `./backend` is mounted to `/app` (hot-reloading enabled).
   * Host directory `./data` is mounted read-only to `/data:ro`.
   * Application lifespan runs: database tables are created automatically (`Base.metadata.create_all`).
   * The database is automatically seeded with demo astronaut `1` and 1,260 simulated mission telemetry readings from `data/simulator/mission_data.json`.
   * Uvicorn starts listening on `http://0.0.0.0:8000`.

---

## 5. Verifying Container Health and Checking Logs

### 5.1 Check Container Status
Verify that both containers are running:
```bash
docker compose ps
```

**Expected output:**
```text
NAME                 IMAGE                            COMMAND                  SERVICE   STATUS                    PORTS
astrotrack_backend   nasaspaceappschallenge-backend   "uvicorn app.main:ap…"   backend   Up                        0.0.0.0:8000->8000/tcp
astrotrack_db        postgres:16-alpine               "docker-entrypoint.s…"   db        Up (healthy)              0.0.0.0:5433->5432/tcp
```

### 5.2 Inspect Container Logs
To follow live backend logs:
```bash
docker compose logs -f backend
```

To inspect database logs:
```bash
docker compose logs -f db
```

---

## 6. Service Health Endpoints and Interactive API Documentation

Once the backend is running, verify operational readiness using your browser or `curl`:

### 6.1 Root Status Endpoint
```bash
curl -s http://localhost:8000/
```
**Response:**
```json
{
  "service": "AstroTrack AAHMS API",
  "version": "1.0.0",
  "status": "operational",
  "docs": "/docs"
}
```

### 6.2 Health Check Endpoint
```bash
curl -s http://localhost:8000/health
```
**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

### 6.3 Interactive API Documentation
* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)  
  *Provides interactive request execution, request/response schemas, and JWT authorization headers.*
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)  
  *Clean, readable reference documentation.*

---

## 7. API Endpoints Reference

All application endpoints are served under `/api`:

### 7.1 Authentication & Astronaut Profile
* `POST /api/auth/register` (Public)  
  *Registers a new astronaut profile. Body: `{ email, password, name, role }`.*
* `POST /api/auth/login` (Public)  
  *Authenticates credentials and returns `{ access_token, token_type: "bearer" }`.*
* `GET /api/astronauts/me` (Auth / Demo Fallback)  
  *Returns active profile `{ id, email, name, role, mission_day }`. When `AUTH_REQUIRED=false`, automatically returns default demo astronaut `1`.*

### 7.2 Telemetry Ingestion & Trends
* `POST /api/readings` (Auth / Demo Fallback)  
  *Submits a new reading. Ingests `{ indicator, value, unit?, measured_at? }`, queries past 30 readings, calculates baseline anomaly z-score, stores record, and returns immediate status (`normal`, `warning`, `critical`) and clinical reason.*
* `GET /api/readings?indicator={id}&days={30}` (Auth / Demo Fallback)  
  *Returns historical chronological readings for the active astronaut.*

### 7.3 Dashboard Summary
* `GET /api/dashboard/summary?day={day}` (Public / Demo)  
  *Evaluates all 7 physiological indicators against personal baselines for the requested simulated mission day (defaults to Day 90). Computes 7-point sparklines, directional velocity (`up`, `down`, `stable`), and worst-case overall triage status.*

### 7.4 Medical Guidance, Routines, and Body Map
* `GET /api/guidance/{indicator}/{status}` (Public)  
  *Returns evidence-based spaceflight countermeasure advice, citations, and flight surgeon escalation instructions.*
* `GET /api/routine/today` (Public)  
  *Returns daily checklist of scheduled operational health countermeasures (vitals check, ARED resistive exercise, treadmill, mental health check-in).*
* `GET /api/body-map/{body_part}` (Public)  
  *Returns indicators mapped to anatomical regions (`chest`, `head`, `abdomen`, `limbs`, `full_body`).*

### 7.5 AI Telemetry Synthesis (Simulated Operational Assistant)
* `POST /api/v1/health/ai-explanation` & `POST /api/health/ai-explanation` (Public)  
  *Provides structured clinical telemetry explanations for astronaut queries regarding workload, sleep debt, and cardiovascular adaptation.*

---

## 8. Database Initialization and Seeding

### 8.1 Automatic Startup Seeding
You do not need to run manual migration or seed commands for typical development. When the backend container starts, `backend/app/main.py` automatically:
1. Creates the `astronauts` and `readings` tables in PostgreSQL.
2. Checks if demo astronaut `1` exists.
3. If unseeded, provisions `Commander Sarah Walker` (`crew@astrotrack.space`, `CDR-01`, `mission_day: 90`).
4. Reads `/data/simulator/mission_data.json` and bulk-inserts all 1,260 simulated records (180 days across all 7 indicators) evaluated against the personal baseline engine.

### 8.2 Manual Seeding Command
If you wish to re-seed or verify database population manually inside the running container:
```bash
docker compose exec backend python scripts/seed.py
```

---

## 9. Running the Automated Test Suite

AstroTrack includes 70 automated tests covering unit logic, baseline math, Day 90 scenario detection, and full API integration flows.

### 9.1 Run Tests Inside Docker (Recommended)
Run the full test suite using `pytest`:
```bash
docker compose exec backend pytest -v
```

Or run via Python's standard `unittest` runner:
```bash
docker compose exec backend python -m unittest discover -s tests -v
```

### 9.2 Run Tests Locally on Host (Without Docker)
If you have created a local virtual environment (`backend/.venv`):
```bash
PYTHONPATH=backend backend/.venv/bin/pytest -v
```
*Note: In local mode without PostgreSQL, SQLAlchemy automatically falls back to local SQLite (`sqlite:///./aahms.db`), allowing isolated test execution without database dependencies.*

---

## 10. Stopping and Restarting Services

### 10.1 Stop Containers (Preserve Data)
```bash
docker compose stop
```

### 10.2 Resume Stopped Containers
```bash
docker compose start
```

### 10.3 Restart Only the Backend Service
To restart the FastAPI container (e.g., after changing non-reloadable environment variables):
```bash
docker compose restart backend
```

### 10.4 Graceful Teardown
To stop and remove containers and networks while preserving database data:
```bash
docker compose down
```

---

## 11. Resetting the Database

> [!WARNING]
> **Data Deletion Warning:** Resetting the database will permanently delete all newly created user profiles, submitted readings, and database modifications.

To perform a clean database reset and re-initialize from scratch:

```bash
# 1. Stop containers and destroy the persistent volume
docker compose down -v

# 2. Rebuild and restart containers
docker compose up -d --build
```

On restart, the PostgreSQL volume will be created clean, tables will be recreated, and the baseline 180-day telemetry dataset will be re-seeded automatically.

---

## 12. Troubleshooting Common Issues

### 12.1 PostgreSQL Host Port Conflict (`bind: address already in use`)
* **Symptom:** Docker fails to bind port `5432` because a native PostgreSQL server is already running on the host machine.
* **Resolution:** AstroTrack's `docker-compose.yml` maps PostgreSQL to host port **`5433`** (`5433:5432`). 
  * From outside Docker (e.g., pgAdmin or host psql), connect to `localhost:5433`.
  * Inside Docker, the backend connects internally to `db:5432`.
  * Do not change `DATABASE_URL` in `docker-compose.yml` to `5433`; containers communicate over the internal Docker network where PostgreSQL listens on standard port `5432`.

### 12.2 Authentication Failed for User `astro_user`
* **Symptom:** `password authentication failed for user "astro_user"`.
* **Resolution:** Ensure the password defined in `POSTGRES_PASSWORD` matches the password specified in `DATABASE_URL`. If you previously ran PostgreSQL with different credentials, run `docker compose down -v` to destroy the outdated data volume before restarting.

### 12.3 Backend Fails to Start: Database Not Ready
* **Symptom:** Backend container exits with database connection refused.
* **Resolution:** In `docker-compose.yml`, the backend depends on `db` with `condition: service_healthy`. Ensure the `pg_isready` healthcheck has sufficient time to complete (initialization typically takes 3–5 seconds).

### 12.4 Module Not Found When Running Tests Locally
* **Symptom:** `ModuleNotFoundError: No module named 'app'`.
* **Resolution:** Ensure `PYTHONPATH` includes the `backend` directory when executing commands outside Docker:
  ```bash
  PYTHONPATH=backend python3 -m unittest discover -s backend/tests -v
  ```

---

## 13. Local Development Workflow

### 13.1 Hot-Reload Development
The `docker-compose.yml` mounts the `./backend` host directory directly into `/app` in the container. Uvicorn runs with `--reload`. Any edits made to Python files in `backend/app/` on your workstation take effect immediately inside the running container without rebuilding the Docker image.

### 13.2 Standalone Local Execution (Without Docker)
For lightweight local debugging without Docker:
```bash
# 1. Create and activate a virtual environment
python3 -m venv backend/.venv
source backend/.venv/bin/activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Run the development server (uses SQLite fallback by default)
PYTHONPATH=backend uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
