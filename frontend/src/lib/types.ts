// Shared TypeScript types matching AstroTrack backend schemas (docs/frontend_guide.md & docs/backend_guide.md)

export type Status = "normal" | "warning" | "critical";

export type Indicator =
  | "heart_rate"
  | "blood_pressure_systolic"
  | "blood_pressure_diastolic"
  | "body_temp"
  | "blood_sugar"
  | "sleep_hours"
  | "mood_score";

export interface Reading {
  indicator: Indicator;
  value: number;
  unit: string;
  status: Status;
  measured_at: string; // ISO 8601 UTC
  message: string;
}

export interface NewReading {
  indicator: Indicator;
  value: number;
  unit?: string;
  measured_at?: string;
}

export interface DashboardSummary {
  /** Overall worst status across indicators: 'normal' | 'warning' | 'critical' (FastAPI required) */
  overall_status: Status;
  /** Evaluated mission day (FastAPI optional: Optional[int] = None) */
  mission_day?: number;
  /** Astronaut profile identifier (FastAPI optional: Optional[str] = None) */
  astronaut_id?: string;
  /** Demo/fallback metadata container; in live API, profile is fetched via /api/astronauts/me */
  astronaut?: {
    name?: string;
    role?: string;
    mission_day?: number;
  };
  /** Clinical disclaimer (FastAPI default string provided) */
  disclaimer?: string;
  /** Demo helper count; live tasks are fetched separately via GET /api/routine/today */
  pending_tasks_count?: number;
  /** Indicator evaluations list (FastAPI required: List[IndicatorSummary]) */
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

export interface RoutineTask {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  due_time?: string;
}

export interface GuidanceData {
  title: string;
  explanation: string;
  action: string;
  citation: string;
  citation_url?: string;
}
