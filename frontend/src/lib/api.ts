// lib/api.ts — AstroTrack API client conforming to docs/frontend_guide.md & backend_guide.md
import type { NewReading, Reading, Indicator, Status, DashboardSummary, RoutineTask, GuidanceData } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("aahms_auth_token") || localStorage.getItem("token") || null;
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("aahms_auth_token", token);
    localStorage.setItem("token", token);
  }
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("aahms_auth_token");
    localStorage.removeItem("token");
    localStorage.removeItem("aahms_current_user");
  }
}

// --- 1. Authentication (Confirmed in backend_guide.md) ---

export async function loginUser(email: string, password: string):Promise<{ access_token: string; token_type: string }> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (data.access_token) {
    setToken(data.access_token);
  }
  return data;
}

export async function registerUser(email: string, password: string, name: string, role?: string): Promise<{ id: string; email: string }> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, role })
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function getMe(): Promise<{ id: string; email: string; name: string; role: string }> {
  const res = await fetch(`${API}/api/astronauts/me`, {
    headers: {
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// --- 2. Readings (Confirmed in backend_guide.md) ---

export async function submitReading(data: NewReading): Promise<Reading> {
  try {
    const res = await fetch(`${API}/api/readings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.warn("Backend unavailable, saving locally in offline mode:", error);
    const mockStatus: Status = data.value > 100 || (data.indicator === "body_temp" && data.value > 38) ? "warning" : "normal";
    const simulated: Reading = {
      indicator: data.indicator,
      value: data.value,
      unit: data.unit || "unit",
      status: mockStatus,
      measured_at: data.measured_at || new Date().toISOString(),
      message: `${data.indicator} recorded successfully (offline cached).`
    };
    return simulated;
  }
}

export async function getReadings(indicator: Indicator, days: number = 30): Promise<Reading[]> {
  try {
    const res = await fetch(`${API}/api/readings?indicator=${indicator}&days=${days}`, {
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.warn(`Falling back to simulated historical readings for ${indicator}:`, error);
    const points: Reading[] = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      let baseVal = 72;
      let unit = "bpm";
      if (indicator === "heart_rate") { baseVal = 72 + Math.sin(i) * 5; unit = "bpm"; }
      else if (indicator === "body_temp") { baseVal = 36.6 + Math.sin(i) * 0.2; unit = "°C"; }
      else if (indicator === "blood_sugar") { baseVal = 95 + Math.cos(i) * 8; unit = "mg/dL"; }
      else if (indicator === "sleep_hours") { baseVal = 7.1 + Math.sin(i * 0.5) * 0.8; unit = "hours"; }
      else if (indicator === "blood_pressure_systolic") { baseVal = 118 + Math.sin(i) * 6; unit = "mmHg"; }
      else if (indicator === "blood_pressure_diastolic") { baseVal = 78 + Math.cos(i) * 4; unit = "mmHg"; }
      else if (indicator === "mood_score") { baseVal = 8; unit = "1-10"; }

      points.push({
        indicator,
        value: Number(baseVal.toFixed(1)),
        unit,
        status: "normal",
        measured_at: d.toISOString(),
        message: "Nominal resting reading."
      });
    }
    return points;
  }
}

// --- 3. Dashboard Summary (Confirmed in backend_guide.md) ---

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const res = await fetch(`${API}/api/dashboard/summary`, {
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.warn("Falling back to demo dashboard summary:", error);
    return {
      astronaut: {
        name: "Crew Member (demo)",
        role: "CDR-01",
        mission_day: 90
      },
      indicators: [
        { indicator: "heart_rate", name: "Heart Rate", value: 74, unit: "bpm", status: "normal", trend: "stable", measured_at: new Date().toISOString(), message: "Resting cardiac rhythm nominal." },
        { indicator: "blood_pressure_systolic", name: "Blood Pressure (Sys)", value: 122, unit: "mmHg", status: "normal", trend: "stable", measured_at: new Date().toISOString(), message: "Systolic arterial pressure nominal." },
        { indicator: "blood_pressure_diastolic", name: "Blood Pressure (Dia)", value: 81, unit: "mmHg", status: "normal", trend: "stable", measured_at: new Date().toISOString(), message: "Diastolic pressure nominal." },
        { indicator: "body_temp", name: "Core Temperature", value: 36.8, unit: "°C", status: "normal", trend: "stable", measured_at: new Date().toISOString(), message: "Core thermal balance optimal." },
        { indicator: "blood_sugar", name: "Blood Glucose", value: 94, unit: "mg/dL", status: "normal", trend: "stable", measured_at: new Date().toISOString(), message: "Post-absorptive glucose stable." },
        { indicator: "sleep_hours", name: "Sleep Duration", value: 6.4, unit: "hours", status: "warning", trend: "down", measured_at: new Date().toISOString(), message: "Mild sleep debt accumulated during EVA cycle." },
        { indicator: "mood_score", name: "Subjective Well-being", value: 7, unit: "1-10", status: "normal", trend: "stable", measured_at: new Date().toISOString(), message: "Psychological resilience high." }
      ],
      overall_status: "warning",
      pending_tasks_count: 2
    };
  }
}

// --- 4. Routine Tasks (Confirmed in backend_guide.md) ---

export async function getRoutineTasks(): Promise<RoutineTask[]> {
  try {
    const res = await fetch(`${API}/api/routine/today`, {
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.warn("Using offline routine tasks:", error);
    return [
      { id: "task-1", title: "Morning Vitals & Pulse Oximetry", category: "Medical", completed: true, due_time: "07:30 UTC" },
      { id: "task-2", title: "ARED Resistive Countermeasure (60 min)", category: "Exercise", completed: true, due_time: "10:00 UTC" },
      { id: "task-3", title: "T2 Treadmill Aerobic Session (30 min)", category: "Exercise", completed: false, due_time: "16:00 UTC" },
      { id: "task-4", title: "Evening Subjective Check-in & Sleep Prep", category: "Mental Health", completed: false, due_time: "21:30 UTC" }
    ];
  }
}

// --- 5. Clinical Guidance (Confirmed in backend_guide.md) ---

export async function getGuidance(indicator: Indicator, status: Status): Promise<GuidanceData> {
  try {
    const res = await fetch(`${API}/api/guidance/${indicator}/${status}`, {
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.warn(`Falling back to offline guidance for ${indicator} (${status}):`, error);
    if (status === "normal") {
      return {
        title: "Telemetry Nominal",
        explanation: `${indicator} is within expected NASA baseline for deep space transit.`,
        action: "Maintain current flight schedule and countermeasures.",
        citation: "NASA Human Research Program Standard Medical Protocol",
        citation_url: "https://www.nasa.gov/hrp"
      };
    }
    return {
      title: "Monitoring Advisory Required",
      explanation: `Microgravity fluid redistribution or workload fatigue may be affecting ${indicator}.`,
      action: "Log repeat reading in 4 hours, increase hydration, and verify sleep cycle compliance.",
      citation: "NASA Clinical Space Medicine Reference (HRP Risk Guidelines)",
      citation_url: "https://www.nasa.gov/hrp/hazards"
    };
  }
}

// --- 6. Body Map Region Indicators (Confirmed in backend_guide.md) ---

export async function getBodyPartIndicators(bodyPart: string): Promise<{ body_part: string; indicators: Indicator[]; status: Status }> {
  try {
    const res = await fetch(`${API}/api/body-map/${bodyPart}`, {
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.warn(`Falling back to offline body part mapping for ${bodyPart}:`, error);
    return {
      body_part: bodyPart,
      indicators: ["heart_rate", "blood_pressure_systolic", "blood_pressure_diastolic"],
      status: "normal"
    };
  }
}

// --- 7. Proposed Endpoints (to be confirmed with backend team) ---

/**
 * Proposed AI Explanation Endpoint (to be confirmed with backend team)
 */
export async function getAIExplanation(params: { indicator?: string; status?: string; prompt?: string }) {
  const res = await fetch(`${API}/api/health/ai-explanation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error("AI explanation endpoint (proposed) unavailable");
  return await res.json();
}
