# hashir.md: Backend Track B (Evaluation Brain, Baseline, Simulator, Dashboard)

**Owner:** Syed Muhammad Hashir Ali  |  **Partner:** Huraira (see `huraira.md`)
**Mission:** Build the "brain" of the app: decide normal, warning or critical for each reading, compare the astronaut with their OWN baseline, create realistic simulated mission data, and serve the dashboard summary.

**Deadlines:** Sat 6:00 PM evaluator v1. Sat 11:00 PM all P1 done. Sun 12:00 PM code freeze. Submit by Sun 9:00 PM.

---

## You own (edit ONLY these files)

```text
backend/app/services/evaluator.py
backend/app/services/reference_data.py
backend/app/services/baseline.py          (new file)
backend/app/routers/dashboard.py
backend/app/schemas/dashboard.py          (new file)
backend/tests/test_evaluator.py, test_baseline.py, test_simulator.py
data/simulator/generate.py
data/simulator/mission_data.json          (generated output)
```

## Huraira owns (do NOT edit, ask him instead)

```text
backend/app/main.py, core/*, models/*, schemas/reading.py, astronaut.py, guidance.py
backend/app/routers/auth.py, astronauts.py, readings.py, guidance.py
backend/app/services/guidance_data.py
backend/scripts/seed.py, requirements.txt, .github/workflows/ci.yml
```

---

## Important design rule (read this first)

`backend_guide.md` uses ONE fixed range for everyone. But our README says: **"Compare the astronaut with themselves, not with everyone else."** Example of the problem: a fixed range marks sleep of 5.5 hours as `critical`, but our README story says 5.5 hours should only be Yellow (warning). So `evaluate()` must work in two modes:

1. **Baseline mode** (when the astronaut has at least 7 previous values): compare with their own recent average.
2. **Reference mode** (fallback, not enough history): use the fixed ranges from the guide.

Also keep the guide's `warning` ranges as **absolute danger limits** for vitals only (`heart_rate`, `blood_pressure_*`, `body_temp`, `blood_sugar`): a value outside them is always `critical`, even in baseline mode. Do not use absolute limits for `sleep_hours` and `mood_score`.

Our personal thresholds are **demo design choices, not official NASA numbers**. Say this in code comments and in the presentation.

---

## Order of work

### Step 0 (now, while Huraira builds the skeleton)
- [ ] Write `evaluator.py` on your computer. It has no database dependency. Do not create folders yourself. Pull the skeleton when Huraira says it is ready (about 4:30 PM) and replace his stub file with yours.

### Step 1: Evaluator v1 with fixed ranges (by 6:00 PM) [P1]
- [ ] `reference_data.py`: the `REFERENCE_RANGES` dict from `backend_guide.md`
- [ ] `evaluate()` in reference mode, returning `EvalResult` (see contract below)
- [ ] Tests (`test_evaluator.py`): boundary values. `heart_rate=100` gives normal, `101` gives warning, `120` gives warning, `121` gives critical.
- [ ] Push and tell Huraira: "Evaluator v1 is in."

### Step 2: Baseline mode (by 8:00 PM) [P1]
- [ ] `baseline.py`: mean and standard deviation of `history`. Use a small minimum standard deviation to avoid division by zero.
- [ ] z-score = (value - mean) / std. Starting thresholds (design choice): absolute z below 1.5 is normal, 1.5 to 2.5 is warning, above 2.5 is critical.
- [ ] `sleep_hours` and `mood_score`: only drops count as bad. Other indicators: both directions count.
- [ ] `reason` must be a readable sentence, for example: "Sleep 5.5 h is 2.1 SD below your 30-day normal (6.8 h)."
- [ ] Tests (`test_baseline.py`): fewer than 7 values uses reference mode. Stable history plus a big change gives warning or critical. Vital outside absolute limit gives critical.

### Step 3: Dashboard summary (by 10:00 PM) [P1]
Wait for Huraira's models (about 7:00 PM).
- [ ] `GET /api/dashboard/summary`: for each indicator, take the latest reading and the last 30 values, call `evaluate`, and return the result. `overall_status` is the worst of all indicators. Include `trend_7d` (last 7 values).
- [ ] Use `schemas/dashboard.py` as the response model, and add a docstring to the route.

### Step 4: Simulator (by 11:00 PM) [P1]
- [ ] `data/simulator/generate.py` with a **fixed random seed** (same output every run)
- [ ] 180 days, one value per day for all 7 indicators, realistic noise around a personal normal (for example resting heart rate around 62 to 68, sleep around 6.5 to 7 hours)
- [ ] Events to include: **Days 87 to 90**: sleep under 6 hours, heart rate going up, mood going down (the README "Day 90 story", the dashboard on Day 90 must be warning). Also one infection-like heart rate and temperature rise, and one mood drop later.
- [ ] Output format (Huraira's `seed.py` reads this): `[{"day": 1, "indicator": "heart_rate", "value": 64.2}, ...]` saved as `mission_data.json`
- [ ] `test_simulator.py`: file has 180 days x 7 indicators, values are in realistic limits.
- [ ] Message Huraira when `mission_data.json` is pushed.

### Step 5: Day 90 story check (Sun morning) [P1]
- [ ] Run Huraira's seed, open `/api/dashboard/summary`, and confirm Day 90 shows `warning` with readable reasons. Tune the simulator or thresholds if it shows `critical` or `normal`.
- [ ] Add one test for this in `test_baseline.py`.

### Step 6: Optional extras [P3, only if everything else is done and tested]
- Isolation Forest (scikit-learn) as an extra score. Keep the z-score logic as the main logic. Do not claim "accuracy" on our own simulated data.
- Radiation tracker: cumulative dose against the 600 mSv NASA career limit (talk to the team first because it needs a new indicator).

---

## Shared contract (same in huraira.md, do not change without telling each other)

- Indicators (exact names): `heart_rate`, `blood_pressure_systolic`, `blood_pressure_diastolic`, `body_temp`, `blood_sugar`, `sleep_hours`, `mood_score`
- Status values: `"normal"`, `"warning"`, `"critical"` (frontend shows Green, Yellow, Red)
- All timestamps in UTC, ISO 8601

```python
# backend/app/services/evaluator.py (you write it, Huraira calls it)
@dataclass
class EvalResult:
    status: str   # "normal" | "warning" | "critical"
    reason: str   # short sentence shown to the astronaut
    mode: str     # "baseline" or "reference"

def evaluate(indicator: str, value: float, history: list[float] | None = None) -> EvalResult: ...
# history = same astronaut's previous values for this indicator, oldest to newest, max 30,
# WITHOUT the current value. Empty or short history means reference mode.
```

```json
GET /api/dashboard/summary
{"overall_status": "warning",
 "indicators": [{"indicator": "sleep_hours", "latest_value": 5.5, "unit": "hours",
                 "status": "warning", "reason": "...", "trend_7d": [6.1, 5.9, 5.8]}]}

data/simulator/mission_data.json: [{"day": 1, "indicator": "heart_rate", "value": 64.2}, ...]
```

---

## Git rules
- Work on your own branch: `feat/hashir-<topic>`. Merge to `main` at every milestone.
- Always `git pull origin main` before you start and before you push.
- Commit messages: `feat(evaluator): add baseline mode`, not `fixed stuff`.
- Never force-push. Never edit Huraira's files. If you need a change (for example a new field in `Reading`), ask him.

## Definition of done
- [ ] `evaluate()` works in both modes and is covered by tests
- [ ] Day 90 story gives `warning` with a readable reason
- [ ] `mission_data.json` is generated with a fixed seed and pushed
- [ ] Dashboard summary works and appears in `/docs`
- [ ] `pytest -v` passes and CI is green
