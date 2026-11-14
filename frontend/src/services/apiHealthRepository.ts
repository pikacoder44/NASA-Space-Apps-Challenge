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
  IndicatorSnapshot
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
      // Proposed endpoint: to be confirmed with backend team
      const res = await fetch(getApiUrl(API_ENDPOINTS.MISSION_OVERVIEW), {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
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
      return await res.json();
    } catch {
      return this.fallbackRepo.requestAIExplanation(forceRefresh);
    }
  }

  public async switchDemoScenario(scenario: 'day90_yellow' | 'nominal_green' | 'insufficient_data'): Promise<MissionOverview> {
    return this.fallbackRepo.switchDemoScenario(scenario);
  }
}
