# 🟣 Database Team Guidelines

**Mission:** Design a clean schema that stores readings, supports trend queries, and holds the reference ranges that drive the evaluation engine.

---

## 📌 Your Responsibilities
- ERD + schema design
- Migrations (versioned SQL files)
- Seed data (reference ranges, guidance texts)
- Query optimization for trend endpoints
- Backup/restore docs

---

## 📁 Folder Structure

```text
database/
├── migrations/
│   ├── 001_initial.sql
│   ├── 002_add_guidance.sql
│   └── ...
├── seeds/
│   ├── reference_ranges.sql
│   ├── guidance_texts.sql
│   └── health_tasks.sql
├── ERD.md                # Diagram + explanation
└── README.md             # Run instructions
```

---

## 🗂️ Proposed Schema (v1 — refine as a team)

```sql
-- Astronauts
CREATE TABLE astronauts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       VARCHAR(100),
    mission_name    VARCHAR(100),
    environment     VARCHAR(50),   -- spacecraft | station | rover | base
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Health readings (the core table)
CREATE TABLE readings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    astronaut_id    UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    indicator       VARCHAR(50) NOT NULL,   -- heart_rate, blood_sugar, ...
    value           NUMERIC NOT NULL,
    unit            VARCHAR(20) NOT NULL,
    status          VARCHAR(10) NOT NULL,   -- normal | warning | critical
    measured_at     TIMESTAMPTZ NOT NULL,
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_readings_astronaut_indicator_time
    ON readings (astronaut_id, indicator, measured_at DESC);

-- Reference ranges (drives the evaluator)
CREATE TABLE reference_ranges (
    id              SERIAL PRIMARY KEY,
    indicator       VARCHAR(50) NOT NULL,
    unit            VARCHAR(20) NOT NULL,
    normal_low      NUMERIC NOT NULL,
    normal_high     NUMERIC NOT NULL,
    warning_low     NUMERIC NOT NULL,
    warning_high    NUMERIC NOT NULL,
    body_part       VARCHAR(50),   -- for the body map: head, chest, ...
    description     TEXT           -- plain-language explanation
);

-- Guidance texts
CREATE TABLE guidance (
    id              SERIAL PRIMARY KEY,
    indicator       VARCHAR(50) NOT NULL,
    status          VARCHAR(10) NOT NULL,
    title           TEXT NOT NULL,
    explanation     TEXT NOT NULL,   -- what it means + space context
    action          TEXT NOT NULL,   -- what to do
    source_url      TEXT             -- NASA/CSA citation
);

-- Gamification
CREATE TABLE health_tasks (
    id              SERIAL PRIMARY KEY,
    indicator       VARCHAR(50),
    title           TEXT NOT NULL,
    frequency       VARCHAR(20)      -- daily | weekly | mission
);

CREATE TABLE task_completions (
    id              SERIAL PRIMARY KEY,
    astronaut_id    UUID REFERENCES astronauts(id) ON DELETE CASCADE,
    task_id         INT REFERENCES health_tasks(id),
    completed_at    TIMESTAMPTZ DEFAULT NOW(),
    points          INT DEFAULT 10
);
```

---

## 🔗 Table Relationships (ERD Summary)

```text
astronauts 1 ──────< readings
astronauts 1 ──────< task_completions
reference_ranges    (independent lookup)
guidance            (independent lookup)
health_tasks 1 ────< task_completions
```

- **`astronauts`** = one row per crew member
- **`readings`** = many per astronaut (one row per measurement)
- **`reference_ranges`** = lookup table for the evaluator (one row per indicator)
- **`guidance`** = lookup table for explanations (indicator × status)
- **`health_tasks`** = catalogue of tasks
- **`task_completions`** = which astronaut completed which task, when

Export to [dbdiagram.io](https://dbdiagram.io) for a visual ERD and save the image in `database/ERD.md`.

---

## 📏 Database Rules

1. **Migrations are numbered and immutable:** `001_initial.sql`, `002_add_x.sql`. Never edit a migration that's been run.
2. **Seed data lives in `seeds/`** — reference ranges and guidance texts must be **citable** (add `source_url` pointing to NASA/CSA pages).
3. **All timestamps `TIMESTAMPTZ`, stored in UTC.**
4. **Status is computed by backend, stored in DB** — judges can query it directly for the dashboard.
5. **Index every column used in a `WHERE`/`ORDER BY`** for trend queries (see example above).
6. **No `SELECT *`** in application code.
7. **Document the ERD** in `database/ERD.md` with a diagram (dbdiagram.io export).

---

## 🌱 Seed Data Requirements (Minimum)

- Reference ranges for **all 7 core indicators** (heart rate, BP systolic/diastolic, body temp, blood sugar, sleep hours, mood)
- Guidance text for **each indicator × each status** (normal/warning/critical) = 21 entries
- At least **5 daily health tasks** for gamification

### Example Reference Ranges Seed

```sql
-- seeds/reference_ranges.sql
INSERT INTO reference_ranges
  (indicator, unit, normal_low, normal_high, warning_low, warning_high, body_part, description)
VALUES
  ('heart_rate', 'bpm', 60, 100, 50, 120, 'chest',
   'Number of heartbeats per minute. Rises with stress, exercise, or illness.'),
  ('blood_pressure_systolic', 'mmHg', 90, 120, 80, 140, 'chest',
   'Pressure in arteries when the heart beats.'),
  ('blood_pressure_diastolic', 'mmHg', 60, 80, 50, 90, 'chest',
   'Pressure in arteries between beats.'),
  ('body_temp', '°C', 36.1, 37.2, 35.5, 38.0, 'head',
   'Core body temperature.'),
  ('blood_sugar', 'mg/dL', 70, 140, 60, 180, 'abdomen',
   'Blood glucose level.'),
  ('sleep_hours', 'hours', 7, 9, 6, 10, 'head',
   'Total sleep in the last 24 hours.'),
  ('mood_score', '1-10', 6, 10, 4, 10, 'head',
   'Self-reported mood score (1 = worst, 10 = best).');
```

### Example Guidance Seed

```sql
-- seeds/guidance_texts.sql
INSERT INTO guidance (indicator, status, title, explanation, action, source_url)
VALUES
  ('heart_rate', 'normal',
   'Heart rate is normal',
   'Your heart rate is within the expected range for a resting astronaut.',
   'Continue your mission routine. Re-measure at your next scheduled check-in.',
   'https://www.nasa.gov/hrp/hazards/'),

  ('heart_rate', 'warning',
   'Heart rate is slightly elevated',
   'Microgravity can change how the heart pumps. Elevated values may indicate stress, dehydration, or the start of an infection.',
   'Rest for 15 minutes and re-measure. Drink water. If it stays high, notify the crew medical officer.',
   'https://www.nasa.gov/hrp/risks/'),

  ('heart_rate', 'critical',
   'Heart rate requires attention',
   'This value is outside the safe range. Cardiovascular events are a known risk on long missions.',
   'Notify the crew immediately and contact the flight surgeon. Avoid physical exertion until cleared.',
   'https://www.nasa.gov/hrp/hazards/');
```

### Example Health Tasks Seed

```sql
-- seeds/health_tasks.sql
INSERT INTO health_tasks (indicator, title, frequency)
VALUES
  ('heart_rate', 'Log heart rate', 'daily'),
  ('blood_pressure_systolic', 'Log blood pressure', 'daily'),
  ('body_temp', 'Log body temperature', 'daily'),
  ('sleep_hours', 'Log sleep hours', 'daily'),
  ('mood_score', 'Log mood score', 'daily');
```

---

## 🔍 Useful Queries

### Latest reading per indicator (for dashboard)

```sql
SELECT DISTINCT ON (indicator)
       indicator, value, unit, status, measured_at
FROM readings
WHERE astronaut_id = $1
ORDER BY indicator, measured_at DESC;
```

### 30-day trend (for charts)

```sql
SELECT value, measured_at
FROM readings
WHERE astronaut_id = $1
  AND indicator = $2
  AND measured_at >= NOW() - INTERVAL '30 days'
ORDER BY measured_at;
```

### Today's task completions (for gamification)

```sql
SELECT ht.title, ht.indicator, tc.completed_at, tc.points
FROM health_tasks ht
LEFT JOIN task_completions tc
  ON tc.task_id = ht.id
  AND tc.astronaut_id = $1
  AND tc.completed_at::date = CURRENT_DATE
ORDER BY ht.id;
```

### Count of critical readings in the last 7 days

```sql
SELECT indicator, COUNT(*) AS critical_count
FROM readings
WHERE astronaut_id = $1
  AND status = 'critical'
  AND measured_at >= NOW() - INTERVAL '7 days'
GROUP BY indicator;
```

---

## 🛠️ Migrations Workflow

1. Write a new file: `migrations/00X_description.sql`
2. Test locally: `psql -U postgres -d astrotrack -f migrations/00X_description.sql`
3. Commit it — **never modify it after it's been run by anyone**
4. To change something, write a new migration instead

Example:

```bash
# Run all migrations in order
for f in migrations/*.sql; do
  psql -U postgres -d astrotrack -f "$f"
done
```

---

## 💾 Backup & Restore

```bash
# Backup
pg_dump -U postgres astrotrack > backup.sql

# Restore
psql -U postgres -c "CREATE DATABASE astrotrack;"
psql -U postgres -d astrotrack < backup.sql
```

---

## 🛟 Common Pitfalls

| Problem | Fix |
|---------|-----|
| `uuid` type not found | Run `CREATE EXTENSION IF NOT EXISTS "pgcrypto";` |
| Timestamps in wrong zone | Use `TIMESTAMPTZ`, never `TIMESTAMP` |
| Slow trend queries | Add index on `(astronaut_id, indicator, measured_at DESC)` |
| Duplicate readings | Enforce `UNIQUE (astronaut_id, indicator, measured_at)` if needed |
| Migration fails halfway | Wrap in `BEGIN; ... COMMIT;` transactions |
| Foreign key violations on delete | Use `ON DELETE CASCADE` where appropriate |

---

## 🔗 Links

- **PostgreSQL Docs:** [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- **dbdiagram.io:** [https://dbdiagram.io](https://dbdiagram.io)
- **NASA HRP (for citations):** [https://www.nasa.gov/hrp/](https://www.nasa.gov/hrp/)
- **CSA Health Resources:** [https://www.asc-csa.gc.ca/eng/](https://www.asc-csa.gc.ca/eng/)

---

*Database mission: keep the data clean, fast, and citable — so every number an astronaut sees is backed by science.* 🗄️🛰️
