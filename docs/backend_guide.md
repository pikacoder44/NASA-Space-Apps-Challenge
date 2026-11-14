# 🔵 Backend Team Guidelines — FastAPI + Python

**Mission:** Build a clean, well-documented REST API that stores health data, evaluates status, and returns guidance.

---

## 📌 Your Responsibilities
- REST API for astronaut profiles, health readings, and guidance
- Health status evaluation engine (normal / warning / critical)
- Reference ranges data (sourced from NASA/medical references)
- JWT authentication
- Data validation with Pydantic
- Auto-generated API docs

---

## 📁 Folder Structure

```text
backend/app/
├── main.py                     # App entry, CORS, router registration
├── core/
│   ├── config.py               # Settings via pydantic-settings
│   ├── security.py             # JWT, password hashing
│   └── database.py             # SQLAlchemy engine + session
├── models/                     # SQLAlchemy ORM models
│   ├── astronaut.py
│   ├── reading.py
│   └── guidance.py
├── schemas/                    # Pydantic request/response models
│   ├── astronaut.py
│   ├── reading.py
│   └── guidance.py
├── routers/                    # One file per resource
│   ├── auth.py
│   ├── astronauts.py
│   ├── readings.py
│   ├── guidance.py
│   └── dashboard.py
└── services/
    ├── evaluator.py            # THE BRAIN: status logic
    └── reference_data.py       # Normal ranges
```

---

## 🧠 Evaluation Engine (Most Important)

Every reading → `normal` | `warning` | `critical`.

```python
# services/evaluator.py
REFERENCE_RANGES = {
    "heart_rate":               {"unit": "bpm",   "normal": (60, 100),    "warning": (50, 120)},
    "blood_pressure_systolic":  {"unit": "mmHg",  "normal": (90, 120),    "warning": (80, 140)},
    "blood_pressure_diastolic": {"unit": "mmHg",  "normal": (60, 80),     "warning": (50, 90)},
    "body_temp":                {"unit": "°C",    "normal": (36.1, 37.2), "warning": (35.5, 38.0)},
    "blood_sugar":              {"unit": "mg/dL", "normal": (70, 140),    "warning": (60, 180)},
    "sleep_hours":              {"unit": "hours", "normal": (7, 9),       "warning": (6, 10)},
    "mood_score":               {"unit": "1-10",  "normal": (6, 10),      "warning": (4, 10)},
}

def evaluate(indicator: str, value: float) -> str:
    """Returns 'normal' | 'warning' | 'critical'."""
    ref = REFERENCE_RANGES[indicator]
    lo, hi = ref["normal"]
    if lo <= value <= hi:
        return "normal"
    wlo, whi = ref["warning"]
    if wlo <= value <= whi:
        return "warning"
    return "critical"
```

> 💡 **Tip:** Store ranges in DB (not hardcoded) — judges love data-driven design.

---

## 🔌 Required API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create astronaut profile |
| POST | `/api/auth/login` | Get JWT token |
| GET  | `/api/astronauts/me` | Current profile |
| POST | `/api/readings` | Submit a health reading |
| GET  | `/api/readings?indicator=heart_rate&days=30` | Trend data |
| GET  | `/api/dashboard/summary` | All indicators + latest status |
| GET  | `/api/guidance/{indicator}/{status}` | Guidance text |
| GET  | `/api/body-map/{body_part}` | Indicators for a body part |
| GET  | `/api/routine/today` | Today's health tasks |

---

## ✅ Backend Rules

- Every endpoint returns Pydantic-validated responses — no raw dicts.
- Docstrings on every route — they become the Swagger docs.
- No secrets in code — use `.env` files.
- CORS configured for the frontend origin.
- Write at least 1 test per critical path (auth, reading submission, evaluation).
- Timestamp everything in UTC. Space has no time zones — but we do.
- Commit messages: `feat(readings): add POST endpoint`, not `fixed stuff`.

---

## 🧪 Backend Testing

- Use `pytest`
- Cover: register → login → submit reading → verify status
- Test boundary values in evaluator (e.g., `heart_rate = 100` → normal, `101` → warning)

```bash
cd backend
pytest -v
```

---

## 🚀 Backend Deploy

- Render or Railway (both free tiers work for a hackathon)
- Environment variables: `DATABASE_URL`, `SECRET_KEY`, `FRONTEND_URL`
- Health check endpoint: `GET /health` → `{"status": "ok"}`
