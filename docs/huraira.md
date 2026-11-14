# huraira.md: Backend Track A (Platform, Content, Tests, Deploy)

**Owner:** Abu Huraira Ahmed  |  **Partner:** Hashir (see `hashir.md`)
**Mission:** Build the API base (app, database, readings, auth, guidance), keep tests and CI green, and deploy.

**Deadlines:** Sat 7:00 PM base ready. Sat 11:00 PM all P1 done. Sun 12:00 PM code freeze. Submit by Sun 9:00 PM.

---

## You own (edit ONLY these files)

```text
backend/app/main.py
backend/app/core/config.py, security.py, database.py
backend/app/models/astronaut.py, reading.py
backend/app/schemas/astronaut.py, reading.py, guidance.py
backend/app/routers/auth.py, astronauts.py, readings.py, guidance.py
backend/app/services/guidance_data.py
backend/scripts/seed.py
backend/tests/test_auth.py, test_readings.py, test_guidance.py, test_api_flow.py
backend/requirements.txt, backend/.env.example
.github/workflows/ci.yml
```

## Hashir owns (do NOT edit, ask him instead)

```text
backend/app/services/evaluator.py, reference_data.py, baseline.py
backend/app/routers/dashboard.py, backend/app/schemas/dashboard.py
backend/tests/test_evaluator.py, test_baseline.py, test_simulator.py
data/simulator/*
```

---

## Order of work

### Step 0: Skeleton (finish by 4:30 PM, Hashir is waiting)
- [ ] Create ALL folders and files from `backend_guide.md`, including Hashir's files as empty stubs
- [ ] `services/evaluator.py` temporary stub: always returns `EvalResult("normal", "stub", "reference")` (Hashir will replace it)
- [ ] `main.py`: CORS, `GET /health`, and register ALL 5 routers (auth, astronauts, readings, guidance, dashboard) so nobody touches `main.py` again
- [ ] `requirements.txt`: fastapi, uvicorn, sqlalchemy, pydantic-settings, python-jose, passlib[bcrypt], pytest, httpx, numpy, pandas
- [ ] Push to `main` and message Hashir: "Skeleton is ready, pull now."

### Step 1: Database and readings (by 7:00 PM) [P1]
- [ ] `core/config.py` (settings from `.env`) and `core/database.py` (default `sqlite:///./aahms.db`, works offline)
- [ ] Models: `Astronaut`, `Reading` (id, astronaut_id, indicator, value, unit, status, reason, recorded_at in UTC)
- [ ] `POST /api/readings`: validate indicator, load last 30 values of that indicator, call `evaluate(...)`, save status and reason
- [ ] `GET /api/readings?indicator=heart_rate&days=30`
- [ ] `GET /api/astronauts/me` (use a default demo astronaut with id 1 for now)
- [ ] Push and tell Hashir: "Models are ready." He needs them for the dashboard.

### Step 2: Tests and CI (by 8:00 PM) [P1]
- [ ] `test_readings.py`: submit a reading, check status field exists, check invalid indicator returns 422
- [ ] Open the GitHub **Actions** tab: CI must be green. If red, fix it first.

### Step 3: Guidance, body map, routine (by 11:00 PM) [P1 guidance, P2 others]
- [ ] `services/guidance_data.py`: simple dict for 7 indicators x 3 statuses, 2-3 short advice lines each. Safe and general only (rest, water, lower workload). For `critical`: "Contact the flight doctor." Never give a diagnosis.
- [ ] `GET /api/guidance/{indicator}/{status}` with a `disclaimer` field: "Support tool only, not a medical device."
- [ ] `GET /api/body-map/{body_part}`: static dict (heart -> heart_rate, blood pressure; brain -> mood_score, sleep_hours; etc.) [P2]
- [ ] `GET /api/routine/today`: static task list chosen from the latest saved statuses (for example sleep is warning -> "Plan recovery sleep") [P2]

### Step 4: Seed script (Sat night or Sun morning) [P1]
- [ ] `scripts/seed.py` loads `data/simulator/mission_data.json` (from Hashir) into the database. Day 1 = mission start date.
- [ ] Goal: after seeding, the dashboard shows the "Day 90 story" (yellow status).

### Step 5: Authentication (Sun morning) [P2]
- [ ] `POST /api/auth/register` and `POST /api/auth/login` (JWT, password hash)
- [ ] Add a setting `AUTH_REQUIRED` (default `false`). If false, use demo astronaut 1. This way the frontend and the demo never break.
- [ ] Tests in `test_auth.py`: register, login, protected route with and without token
- [ ] Tell Sahrish when auth is ready and how to send the token.

### Step 6: Deploy and final checks [P2]
- [ ] `.env.example` with `DATABASE_URL`, `SECRET_KEY`, `FRONTEND_URL`
- [ ] Deploy to Render or Railway only if everything else is done. A local demo is fine if deploy fails. Note: free hosting may reset SQLite, so run the seed on startup.
- [ ] Add "How to run" steps to the README (install, run, test)
- [ ] Test on a **fresh clone**: follow the README exactly, then run `pytest -v`

---

## Shared contract (same in hashir.md, do not change without telling each other)

- Indicators (exact names): `heart_rate`, `blood_pressure_systolic`, `blood_pressure_diastolic`, `body_temp`, `blood_sugar`, `sleep_hours`, `mood_score`
- Status values: `"normal"`, `"warning"`, `"critical"` (frontend shows Green, Yellow, Red)
- All timestamps in UTC, ISO 8601

```python
# backend/app/services/evaluator.py (Hashir writes, you call it)
@dataclass
class EvalResult:
    status: str   # "normal" | "warning" | "critical"
    reason: str   # short sentence shown to the astronaut
    mode: str     # "baseline" or "reference"

def evaluate(indicator: str, value: float, history: list[float] | None = None) -> EvalResult: ...
# history = same astronaut's previous values for this indicator, oldest to newest, max 30,
# WITHOUT the current value.
```

```json
POST /api/readings  body:  {"indicator": "heart_rate", "value": 72.0, "recorded_at": "2026-11-15T08:00:00Z"}
201 response: {"id": 1, "indicator": "heart_rate", "value": 72.0, "unit": "bpm",
               "status": "normal", "reason": "...", "recorded_at": "2026-11-15T08:00:00Z"}

GET /api/guidance/sleep_hours/warning
{"indicator": "sleep_hours", "status": "warning", "title": "...", "advice": ["..."], "disclaimer": "..."}

data/simulator/mission_data.json (from Hashir): [{"day": 1, "indicator": "heart_rate", "value": 64.2}, ...]
```

---

## Git rules
- Work on your own branch: `feat/huraira-<topic>`. Merge to `main` at every milestone.
- Always `git pull origin main` before you start and before you push.
- Commit messages: `feat(readings): add POST endpoint`, not `fixed stuff`.
- Never force-push. Never edit Hashir's files. If you need a change, ask him.

## Definition of done
- [ ] All P1 endpoints work and appear in `/docs`
- [ ] Every route has a docstring and Pydantic response model
- [ ] No secrets in code
- [ ] `pytest -v` passes locally and CI is green
- [ ] Fresh-clone test passed
