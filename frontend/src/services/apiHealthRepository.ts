import {
  MissionOverview,
  DailyCheckInInput,
  SaveResult,
  HealthAlert,
  RadiationSummary,
  ExerciseEntry,
  ManualRecordEntry,
  SyncState,
  AIAssistantExplanation,
  IndicatorSnapshot,
  HealthStatus
} from '../types/health';
import { HealthRepository, IndicatorHistoryResult } from './healthRepository';
import { DemoHealthRepository } from './demoHealthRepository';
import { API_ENDPOINTS, getApiUrl } from './apiClient';

/**
 * ApiHealthRepository implements the API contract for the FastAPI backend.
 * Falls back transparently to DemoHealthRepository when the backend is not yet deployed or unreachable.
 *
 * NOTE: All endpoints are proposed and to be confirmed with the backend team.
 */
export class ApiHealthRepository implements HealthRepository {
  private fallbackRepo: DemoHealthRepository;

  constructor() {
    this.fallbackRepo = new DemoHealthRepository();
  }

  public async getMissionOverview(): Promise<MissionOverview> {
    try {
      const res = await fetch(getApiUrl(API_ENDPOINTS.MISSION_OVERVIEW), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const summary = await res.json();
      const fallback = await this.fallbackRepo.getMissionOverview();

      const statusMap: Record<string, HealthStatus> = {
        normal: 'green',
        warning: 'yellow',
        critical: 'red'
      };
      const mappedStatus: HealthStatus = statusMap[summary.overall_status] || fallback.overallStatus;

      const updatedIndicators = fallback.keyIndicators.map((ind) => {
        const found = summary.indicators?.find((si: { indicator?: string; value?: number; latest_value?: number; status?: string; measured_at?: string }) => 
          si.indicator === ind.id || 
          (ind.id === 'sleep' && si.indicator === 'sleep_hours') ||
          (ind.id === 'mood' && si.indicator === 'mood_score') ||
          (ind.id === 'blood_glucose' && si.indicator === 'blood_sugar') ||
          (ind.id === 'skin_temperature' && si.indicator === 'body_temp') ||
          (ind.id === 'blood_pressure' && si.indicator === 'blood_pressure_systolic')
        );
        if (found) {
          const indStatus: HealthStatus = statusMap[found.status || ''] || ind.status;
          return {
            ...ind,
            status: indStatus,
            latest: ind.latest ? {
              ...ind.latest,
              value: found.value ?? found.latest_value ?? ind.latest.value,
              measuredAt: found.measured_at || ind.latest.measuredAt
            } : undefined
          };
        }
        return ind;
      });

      return {
        ...fallback,
        missionDay: summary.mission_day || summary.astronaut?.mission_day || fallback.missionDay,
        overallStatus: mappedStatus,
        keyIndicators: updatedIndicators,
        sync: {
          connectivity: 'online',
          queueState: 'empty',
          pendingCount: 0,
          lastSuccessfulSyncAt: new Date().toISOString()
        }
      };
    } catch {
      return this.fallbackRepo.getMissionOverview();
    }
  }

  public async getIndicator(id: string): Promise<IndicatorSnapshot | undefined> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.INDICATOR_DETAIL(id)), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getIndicator(id);
    }
  }

  public async getIndicatorHistory(
    indicator: string,
    range: '7d' | '30d' | 'mission'
  ): Promise<IndicatorHistoryResult> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.INDICATOR_HISTORY(indicator, range)), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getIndicatorHistory(indicator, range);
    }
  }

  public async submitDailyCheckIn(input: DailyCheckInInput): Promise<SaveResult> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.DAILY_CHECK_IN), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.submitDailyCheckIn(input);
    }
  }

  public async getAlerts(): Promise<HealthAlert[]> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.ALERTS), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getAlerts();
    }
  }

  public async getRadiationSummary(): Promise<RadiationSummary> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.RADIATION_SUMMARY), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getRadiationSummary();
    }
  }

  public async getExerciseEntries(): Promise<ExerciseEntry[]> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.EXERCISE_ENTRIES), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getExerciseEntries();
    }
  }

  public async addExerciseEntry(input: Omit<ExerciseEntry, 'id' | 'timestamp'>): Promise<SaveResult> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.ADD_EXERCISE), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.addExerciseEntry(input);
    }
  }

  public async getManualRecords(): Promise<ManualRecordEntry[]> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.MANUAL_RECORDS), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getManualRecords();
    }
  }

  public async addManualRecord(input: Omit<ManualRecordEntry, 'id' | 'timestamp'>): Promise<SaveResult> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.ADD_MANUAL_RECORD), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.addManualRecord(input);
    }
  }

  public async getSyncState(): Promise<SyncState> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.SYNC_STATUS), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2000)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch {
      return this.fallbackRepo.getSyncState();
    }
  }

  public async triggerSyncSimulation(): Promise<SyncState> {
    return this.fallbackRepo.triggerSyncSimulation();
  }

  public async requestAIExplanation(forceRefresh?: boolean): Promise<AIAssistantExplanation> {
    try {
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.AI_EXPLANATION), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh }),
        signal: AbortSignal.timeout(8000)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const raw = await res.json();
      // Gracefully adapt FastAPI backend AIExplanationResponse if returned
      if (raw && raw.title && raw.explanation && !raw.overallAssessment) {
        return {
          id: `ai-${Date.now()}`,
          generatedAt: new Date().toISOString(),
          modelProvider: 'Clinical Decision Engine (FastAPI Service)',
          overallAssessment: `${raw.title}: ${raw.explanation}`,
          observedPatterns: [
            {
              indicator: raw.indicator || 'telemetry',
              finding: raw.explanation,
              baselineComparison: `Risk evaluated as ${raw.risk_level || 'nominal'}. Reference: ${raw.clinical_reference || 'NASA HRP'}`
            }
          ],
          physiologicalContext: raw.explanation,
          suggestedReviewSteps: raw.recommendation ? [raw.recommendation] : ['Log repeat reading per protocol schedule.'],
          flightSurgeonEscalation: {
            recommended: raw.risk_level === 'high' || raw.status === 'critical',
            reason: raw.risk_level === 'high'
              ? 'Telemetry divergence exceeds flight thresholds; flight surgeon consultation recommended.'
              : 'Routine autonomous flight monitoring; physician call not required.'
          },
          uncertaintyDisclaimer: raw.clinical_reference || 'NASA Human Research Program (HRP) protocol.',
          sourceType: 'gemini_fastapi_contract'
        };
      }
      return raw;
    } catch {
      return this.fallbackRepo.requestAIExplanation(forceRefresh);
    }
  }

  public async switchDemoScenario(scenario: 'day90_yellow' | 'nominal_green' | 'insufficient_data'): Promise<MissionOverview> {
    return this.fallbackRepo.switchDemoScenario(scenario);
  }
}
