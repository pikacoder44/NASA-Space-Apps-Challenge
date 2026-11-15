# Frontend Issues Found During Backend Integration Testing

**For:** Sahrish (frontend)
**Reported by:** Abu Huraira (backend), 2026-11-15
**How tested:** backend (`uvicorn`, port 8000) + frontend (`npm run dev` with `NEXT_PUBLIC_USE_API=true`, port 3000), checked in the browser (DevTools Network/Console).

The backend itself is working: `/api/dashboard/summary`, `/api/routine/today`, `/api/readings` and `/api/guidance/...` all return 200 and the dashboard shows live data. The items below are frontend-side only.

| # | Issue | Severity |
|---|---|---|
| 1 | `GET /mission/overview` returns 404 | Medium |
| 2 | Top bar status does not follow the real status | Medium |
| 3 | Indicator card text does not match the status | Medium |
| 4 | Real NASA data is not shown anywhere | **High** (Space Apps award requirement) |
| 5 | "Gemini AI" claims, but no AI is used | **High** (incorrect claim to judges) |
| 6 | Login session lasts 24 h in the frontend, token now expires in 30 min | Medium |

---

## 1. `GET /mission/overview` returns 404

**Steps:** open `http://localhost:3000/dashboard` → F12 → Network → refresh → filter `mission`.
**Actual:** `overview` → **404** (twice per page), console shows `Failed to load resource: 404`.
**Cause:** the old `services/` layer calls an endpoint the backend does not have:
- `src/services/apiClient.ts:20` → `MISSION_OVERVIEW: '/mission/overview'`
- `src/services/apiHealthRepository.ts:33` (used by `HealthContext`)

**Expected / fix:** use the `lib/api.ts` functions (`getDashboardSummary()` → `GET /api/dashboard/summary`) instead of `/mission/overview`, or remove this call.

## 2. Top bar status does not follow the real status

**Steps:** record heart rate **125** (Record Reading) → open Dashboard.
**Actual:** "Mission Health Status" shows **Act Now** (red), but the top bar still shows **"Sim · Sol 90 · Attention"** (yellow).
**Cause:** `src/components/layout/TopBar.tsx:26` and `:65` show a fixed demo scenario label from `HealthContext`, not the backend.

**Expected / fix:** take the status from `GET /api/dashboard/summary` → `overall_status` (`normal` / `warning` / `critical`).

## 3. Indicator card text does not match the status

**Steps:** after recording heart rate 125, look at the Heart Rate card on the Dashboard.
**Actual:** badge says **Act Now**, text says *"Higher than usual — drink water and take a rest break."*
**Cause:** `src/app/dashboard/page.tsx:48-50` (`contextSentence`) only has two fixed texts (normal / not normal).

**Expected / fix:** show the backend text: each indicator in `/api/dashboard/summary` has `message` (e.g. *"CRITICAL: Heart Rate (125.0 bpm) is above absolute safety limit of 120.0 bpm."*). Or at least use a different text for `critical`.

## 4. Real NASA data is not shown anywhere

**Why it matters:** Space Apps rule: *"In order to be eligible for a Global Award, you must use NASA data or resources."*
**Actual:** the backend now serves real NASA data, but no frontend page calls it (searched `src/` for `nasa/inspiration4` / `OSD-575`: no results).

**Endpoint (ready):** `GET /api/nasa/inspiration4/glucose`
- Real blood glucose of the 4 SpaceX Inspiration4 crew members (NASA OSDR study **OSD-575**), 7 time points each, before and after flight, in mg/dL.
- Each reading: `timepoint` (e.g. `L-92`, `R+1`), `phase` (`pre-flight` / `post-flight`), `value`, `lab_flag` (`low` / `normal` / `high`).
- `summary.preflight_mean` = 75.3, `summary.return_day_mean` = 93.2 (useful headline).
- `source.url` = https://osdr.nasa.gov/bio/repo/data/studies/OSD-575 (show as the citation).

`GET /api/nasa/sources` lists the NASA resources used (for an "Official sources" section).

**Expected / fix:** a simple card or chart, e.g. *"Real NASA data: SpaceX Inspiration4 crew blood glucose (NASA OSDR OSD-575)"*, with the source link. Please keep the label "real NASA data" separate from the simulated indicators.

## 5. "Gemini AI" claims, but no AI is used

**Actual:** the backend `POST /api/health/ai-explanation` returns **fixed, pre-written text** (no Gemini or any AI model). The frontend says Gemini is used in:
- `src/components/landing/FaqSection.tsx:21-22` ("How does Gemini AI function…")
- `src/components/landing/HowItWorksSection.tsx:84` and `:93` ("FastAPI + Gemini AI explanation")
- `src/app/about/page.tsx:116`, `:152`, `:157` ("Google Gemini via Backend", "Gemini 1.5 Pro / Flash")
- `src/app/app/ai-explanation/page.tsx:52`, `:119`, `:188`

**Expected / fix:** remove or reword these, e.g. "rule-based explanations". Judges may ask to see the Gemini integration.

## 6. Login session lasts 24 h in the frontend, token now expires in 30 min

**Backend change (issue #13):** login tokens now expire after **30 minutes** (`ACCESS_TOKEN_EXPIRE_MINUTES`, default 30).
**Actual:** `src/context/AuthContext.tsx:45` and `:95` set `expiresAt` to **24 hours**. After 30 minutes the token is no longer valid: with `AUTH_REQUIRED=false` the backend silently falls back to the demo astronaut, so a logged-in user would suddenly see demo data.

**Expected / fix:** set `expiresAt` to 30 minutes (or read it from config), and log the user out / ask to log in again when it expires or when an API call returns 401.

---

## FYI: backend changes (nothing breaks, no action needed)

- `GET /api/readings` now supports `skip` (default 0), `limit` (default 100, max 1000) and `order` (`asc` default, or `desc`). Existing calls without these parameters work as before.
- `/api/dashboard/summary`: new optional fields `source` (`database` / `simulator`), `measured_at`, `data_source`.
- `/api/routine/today`: new optional field `indicator`; tasks are now based on today's readings.
- `/api/body-map/{part}`: `heart` returns `chest`, `brain` returns `head`; unknown part → 404.
- All endpoints: `http://localhost:8000/docs`
