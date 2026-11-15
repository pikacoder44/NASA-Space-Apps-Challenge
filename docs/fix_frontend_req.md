# Frontend Integration Requirements — AstroTrack

**Target Audience:** Frontend Development Team  
**Author:** Syed Muhammad Hashir Ali (Backend Track B — Evaluation Engine, Baseline, Simulator, Dashboard)  
**Date:** 2026-11-15  
**Status:** Action Required (Contract Reconciliation)  

---

## Executive Summary

To establish a zero-error end-to-end integration between the AstroTrack Next.js frontend and the FastAPI backend, Track B has resolved all backend-side mismatches within our domain. 

The backend `/api/dashboard/summary` endpoint now directly supplies:
* Both `value` (frontend requirement) and `latest_value` (backend spec).
* Both `name` (human-readable title) and `indicator` (snake_case identifier).
* Both `message` (frontend requirement) and `reason` (clinical explanation).
* Both `trend` (`"up"` | `"down"` | `"stable"` computed velocity) and `trend_7d` (sparkline float sequence).
* Root fields: `overall_status`, `mission_day`, `astronaut_id`, and `disclaimer`.

This document outlines the **remaining frontend-side fixes** necessary to achieve seamless runtime integration, prevent client-side JavaScript crashes, and ensure consistent multi-indicator rendering.

---

## Part 1: Frontend-Only Fixes (Independent of Huraira / Track A)

### 1. Unsafe Property Access on Astronaut in Dashboard Header

* **File:** `frontend/src/app/dashboard/page.tsx`, Line 200
* **Current Behavior:**
  ```tsx
  Crew Member (demo) · CDR-01 · Sol {summary?.astronaut.mission_day || 90}
  ```
  The code uses optional chaining on `summary`, but **not** on `astronaut`. When connecting to the real backend, `summary.astronaut` is undefined, causing a fatal runtime exception:
  `TypeError: Cannot read properties of undefined (reading 'mission_day')`.
* **Required Change:**
  Use optional chaining across both levels and fallback to `summary?.mission_day`:
  ```tsx
  Crew Member (demo) · CDR-01 · Sol {summary?.astronaut?.mission_day || summary?.mission_day || 90}
  ```
* **Expected API Field:**
  `mission_day: number` is provided directly on the root of `DashboardSummaryResponse`.
* **Reason:** Prevents immediate client-side white-screen crash when loading the dashboard with live telemetry.

---

### 2. Update and Relax TypeScript Interfaces (`DashboardSummary`)

* **File:** `frontend/src/lib/types.ts`, Lines 30–48
* **Current Behavior:**
  The `DashboardSummary` interface mandates fields that the telemetry summary endpoint cannot guarantee:
  ```typescript
  export interface DashboardSummary {
    astronaut: {
      name: string;
      role: string;
      mission_day: number;
    };
    indicators: Array<{
      indicator: Indicator;
      name: string;
      value: number;
      unit: string;
      status: Status;
      trend: "up" | "down" | "stable";
      measured_at: string; // Mandatory ISO string
      message: string;
    }>;
    overall_status: Status;
    pending_tasks_count: number; // Mandatory number
  }
  ```
* **Required Change:**
  Update `lib/types.ts` so optional server fields are marked with `?`, and support backend-native fields:
  ```typescript
  export interface DashboardSummary {
    overall_status: Status;
    mission_day?: number;
    astronaut_id?: string;
    astronaut?: {
      name?: string;
      role?: string;
      mission_day?: number;
    };
    disclaimer?: string;
    pending_tasks_count?: number;
    indicators: Array<{
      indicator: Indicator;
      name: string;
      value: number;
      latest_value?: number;
      unit: string;
      status: Status;
      trend: "up" | "down" | "stable";
      trend_7d?: number[];
      reason?: string;
      message?: string;
      mode?: "baseline" | "reference";
      measured_at?: string;
    }>;
  }
  ```
* **Reason:** Prevents TypeScript compilation errors during Next.js production builds (`npm run build`) and allows both mock and live API payloads.

---

### 3. Add Missing `blood_sugar` to Indicator Readings Metadata

* **File:** `frontend/src/app/readings/[indicator]/ReadingIndicatorClient.tsx`, Lines 34–85
* **Current Behavior:**
  `INDICATOR_METADATA` defines configurations for 6 indicators (`heart_rate`, `blood_pressure_systolic`, `blood_pressure_diastolic`, `body_temp`, `sleep_hours`, `mood_score`), but **completely omits `blood_sugar`**.
  Navigating to `/readings/blood_sugar` renders unformatted fallback text with missing unit, clinical description, and reference thresholds.
* **Required Change:**
  Add `blood_sugar` to `INDICATOR_METADATA`:
  ```typescript
  blood_sugar: {
    name: 'Blood Glucose',
    unit: 'mg/dL',
    normal: [70, 140],
    warning: [60, 180],
    desc: 'Capillary glucose monitored for metabolic stability, insulin resistance, and nutrition management in spaceflight.'
  },
  ```
* **Reason:** Ensures all 7 supported physiological indicators have consistent UI presentations, units, and clinical descriptions.

---

### 4. Harmonize Trend Indicator Keys in `trendData.ts`

* **File:** `frontend/src/data/trendData.ts`, Lines 50–180, and `frontend/src/app/dashboard/page.tsx`, Lines 145–153
* **Current Behavior:**
  The `TREND_OPTIONS` dropdown and `generateTrendHistory()` function use non-standard keys that do not correspond to the backend indicators:
  * Uses `sleep` instead of `sleep_hours`
  * Uses `mood` instead of `mood_score`
  * Uses `skin_temperature` instead of `body_temp`
  * Uses `blood_glucose` instead of `blood_sugar`
  * Uses singular `blood_pressure` instead of split systolic/diastolic
  * References unsupported keys (`oxygen_saturation`, `radiation_dosimetry`, `exercise`, `fatigue`)
* **Required Change:**
  Standardize `TREND_OPTIONS` to the 7 core indicator IDs:
  ```typescript
  const TREND_OPTIONS = [
    { id: 'heart_rate', name: 'Resting Heart Rate' },
    { id: 'blood_pressure_systolic', name: 'Systolic Blood Pressure' },
    { id: 'blood_pressure_diastolic', name: 'Diastolic Blood Pressure' },
    { id: 'body_temp', name: 'Core Body Temperature' },
    { id: 'blood_sugar', name: 'Blood Glucose' },
    { id: 'sleep_hours', name: 'Sleep Duration' },
    { id: 'mood_score', name: 'Subjective Mood Score' },
  ];
  ```
  Update `generateTrendHistory(indicatorId, range)` to handle these exact keys.
* **Reason:** When astronauts switch between the Dashboard and Indicator Detail pages (`/readings/[indicator]`), chart keys must match the telemetry database.

---

### 5. Retire or Unify Duplicate Services Architecture

* **Files:**
  * `frontend/src/services/` (entire directory)
  * `frontend/src/types/health.ts`
  * `frontend/src/context/HealthContext.tsx`
* **Current Behavior:**
  The frontend currently has **two conflicting API client architectures**:
  1. `frontend/src/lib/api.ts` (used by `dashboard/page.tsx` and `readings/`): Uses `"normal" | "warning" | "critical"`, calls real endpoints with offline fallback.
  2. `frontend/src/services/` (used by `HealthContext.tsx`): Uses `HealthStatus = 'green' | 'yellow' | 'red' | 'unknown'`, requires `NEXT_PUBLIC_USE_API=true` (which is `false` by default in `.env.example`), and expects an entirely different `MissionOverview` schema.
* **Required Change:**
  Standardize all components on the `lib/api.ts` client and `lib/types.ts` schemas. If `HealthContext` is retained for demo scenario switching, ensure it consumes `DashboardSummary` rather than the orphaned `MissionOverview` structure.
* **Reason:** Having two parallel, incompatible abstractions leads to dead code, broken feature toggles, and confusion over which data models are active.

---

### 6. Standardize API Base URL Environment Variables

* **Files:**
  * `frontend/.env.example`, Lines 1–4
  * `frontend/src/lib/api.ts`, Line 4
  * `frontend/src/services/apiClient.ts`, Line 11
* **Current Behavior:**
  `.env.example` defines two conflicting variables:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:8000
  NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
  ```
  `apiClient.ts` appends `/api/v1`, but backend endpoints are served at `/api/...` (without `/v1`).
* **Required Change:**
  Remove `NEXT_PUBLIC_API_BASE_URL` and use only:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
* **Reason:** Avoids 404 Not Found routing errors caused by `/v1` prefix mismatches.

---

### 7. Correct Route in `getAIExplanation`

* **File:** `frontend/src/lib/api.ts`, Line 244
* **Current Behavior:**
  ```typescript
  const res = await fetch(`${API}/api/v1/health/ai-explanation`, { ... });
  ```
* **Required Change:**
  Change path to `/api/health/ai-explanation` (or whatever route is finalized with Track A):
  ```typescript
  const res = await fetch(`${API}/api/health/ai-explanation`, { ... });
  ```
* **Reason:** Removes invalid `/v1` segment.

---

## Part 2: Coordination Items with Abu Huraira (Backend Track A)

The following items involve services owned by Huraira (`huraira.md`) and cannot be resolved by Track B:

| Feature / Endpoint | Frontend Caller | Required Coordination with Huraira |
| :--- | :--- | :--- |
| **CORS Whitelist** | All API calls | Huraira must ensure `main.py` registers `CORSMiddleware` with `allow_origins=["http://localhost:3000"]`, `allow_credentials=True`. |
| **Astronaut Identity** (`/api/astronauts/me`) | `lib/api.ts:53` | Astronaut name/role should be fetched from `GET /api/astronauts/me` upon login, not expected inside the telemetry summary. |
| **Authentication** (`/api/auth/login`, `/register`) | `lib/api.ts:29, 43` | JWT issuance, password hashing, and user persistence must be wired in `backend/app/routers/auth.py`. |
| **Telemetry History** (`GET /api/readings`) | `lib/api.ts:93` | Trend charts currently fall back to mock data because `routers/readings.py` is not yet mounted. |
| **Reading Submission** (`POST /api/readings`) | `lib/api.ts:66` | "Record Reading" modal will cache locally until `routers/readings.py` is mounted. |
| **Routine Tasks** (`GET /api/routine/today`) | `lib/api.ts:167` | Dashboard currently displays fallback routines until `routers/routine.py` is created. |
| **Clinical Guidance** (`GET /api/guidance/{indicator}/{status}`) | `lib/api.ts:189` | Guidance drawer will use offline templates until Huraira's guidance router is wired. |

---

## Summary of Completed Track B Compatibility Updates

For reference, here is the exact payload structure guaranteed by `GET /api/dashboard/summary?day=90`:

```json
{
  "overall_status": "warning",
  "indicators": [
    {
      "indicator": "sleep_hours",
      "name": "Sleep Duration",
      "value": 5.6,
      "latest_value": 5.6,
      "unit": "hours",
      "status": "warning",
      "reason": "Sleep Duration (5.6 hours) is 2.2 SD below your baseline (7.1 hours, based on your last 30 readings).",
      "message": "Sleep Duration (5.6 hours) is 2.2 SD below your baseline (7.1 hours, based on your last 30 readings).",
      "trend": "down",
      "trend_7d": [6.2, 8.2, 8.0, 6.9, 6.1, 7.0, 5.6],
      "mode": "baseline"
    },
    {
      "indicator": "heart_rate",
      "name": "Heart Rate",
      "value": 73.0,
      "latest_value": 73.0,
      "unit": "bpm",
      "status": "warning",
      "reason": "Heart Rate (73.0 bpm) is 2.0 SD above your baseline (65.8 bpm, based on your last 30 readings).",
      "message": "Heart Rate (73.0 bpm) is 2.0 SD above your baseline (65.8 bpm, based on your last 30 readings).",
      "trend": "up",
      "trend_7d": [71.2, 64.4, 70.6, 62.9, 71.1, 70.8, 73.0],
      "mode": "baseline"
    }
  ],
  "mission_day": 90,
  "astronaut_id": "1",
  "disclaimer": "Notice: AstroTrack provides automated mission support evaluations and anomaly detection. It does not substitute for certified aerospace medical diagnosis or flight surgeon protocol."
}
```

Once Part 1 items 1 (`summary?.astronaut?.mission_day`) and 2 (`DashboardSummary` TypeScript relaxation) are applied in the frontend, the dashboard will immediately render live telemetry data without errors.
