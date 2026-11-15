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
