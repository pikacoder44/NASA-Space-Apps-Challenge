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
import {
  INITIAL_INDICATORS_DAY90,
  ALERTS_DAY90,
  INITIAL_RADIATION_DAY90,
  INITIAL_GAMIFICATION,
  INITIAL_SYNC_STATE,
  AI_ASSISTANT_DAY90,
  INITIAL_EXERCISE_LOG,
  INITIAL_MANUAL_RECORDS
} from '../data/mockData';
import { generateTrendHistory } from '../data/trendData';

import { deriveOverallStatus } from './statusModel';

export type DemoScenarioKey = 'day90_yellow' | 'nominal_green' | 'insufficient_data';

export class DemoHealthRepository implements HealthRepository {
  private currentScenario: DemoScenarioKey = 'day90_yellow';
  private indicators: IndicatorSnapshot[] = JSON.parse(JSON.stringify(INITIAL_INDICATORS_DAY90));
  private alerts: HealthAlert[] = JSON.parse(JSON.stringify(ALERTS_DAY90));
  private radiation: RadiationSummary = JSON.parse(JSON.stringify(INITIAL_RADIATION_DAY90));
  private gamification = JSON.parse(JSON.stringify(INITIAL_GAMIFICATION));
  private syncState: SyncState = JSON.parse(JSON.stringify(INITIAL_SYNC_STATE));
  private exercises: ExerciseEntry[] = JSON.parse(JSON.stringify(INITIAL_EXERCISE_LOG));
  private manualRecords: ManualRecordEntry[] = JSON.parse(JSON.stringify(INITIAL_MANUAL_RECORDS));
  private aiExplanation: AIAssistantExplanation = JSON.parse(JSON.stringify(AI_ASSISTANT_DAY90));
  private dailyCheckInDone = false;

  constructor() {
    this.loadLocalOverrides();
  }

  private loadLocalOverrides() {
    if (typeof window === 'undefined') return;
    try {
      const savedEx = localStorage.getItem('aahms_exercises');
      if (savedEx) this.exercises = JSON.parse(savedEx);

      const savedRecs = localStorage.getItem('aahms_manual_records');
      if (savedRecs) this.manualRecords = JSON.parse(savedRecs);

      const savedScenario = localStorage.getItem('aahms_scenario') as DemoScenarioKey;
      if (savedScenario) this.currentScenario = savedScenario;

      const checkInDone = localStorage.getItem('aahms_checkin_done');
      if (checkInDone === 'true') {
        this.dailyCheckInDone = true;
        this.gamification.todayLogCompleted = true;
      }
    } catch {
      // ignore SSR or storage exceptions
    }
  }

  private saveLocal() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('aahms_exercises', JSON.stringify(this.exercises));
      localStorage.setItem('aahms_manual_records', JSON.stringify(this.manualRecords));
      localStorage.setItem('aahms_scenario', this.currentScenario);
      localStorage.setItem('aahms_checkin_done', String(this.dailyCheckInDone));
    } catch {
      // ignore
    }
  }

  public async getMissionOverview(): Promise<MissionOverview> {
    const derived = deriveOverallStatus(this.currentScenario, this.indicators);

    return {
      missionDay: 90,
      missionPhase: 'Trans-Mars Injection Cruise (Trajectory Leg 2)',
      crewMember: {
        callsign: 'CDR-01',
        role: 'Mission Commander / Flight Engineer',
        missionCode: 'ARES-V'
      },
      overallStatus: derived.status,
      overallStatusReason: derived.headline,
      statusTimestamp: '2026-11-14T06:45:00Z',
      isDemoScenarioActive: true,
      scenarioName: 
        this.currentScenario === 'day90_yellow'
          ? 'Day 90 on Mars: Yellow Alert Demo'
          : this.currentScenario === 'nominal_green'
          ? 'Nominal Cruise Baseline (All Green)'
          : 'Telemetry Link Degraded (Sol 89 Data)',
      dailyCheckInDone: this.dailyCheckInDone,
      activeAlerts: this.currentScenario === 'nominal_green' || this.currentScenario === 'insufficient_data' ? [] : this.alerts,
      keyIndicators: this.indicators,
      radiation: this.radiation,
      gamification: this.gamification,
      sync: this.syncState,
      aiExplanation: this.aiExplanation
    };
  }

  public async getIndicator(id: string): Promise<IndicatorSnapshot | undefined> {
    return this.indicators.find((ind) => ind.id === id);
  }

  public async getIndicatorHistory(
    indicator: string,
    range: '7d' | '30d' | 'mission'
  ): Promise<IndicatorHistoryResult> {
    const res = generateTrendHistory(indicator, range);
    return {
      indicatorId: indicator,
      unit: res.unit,
      title: res.title,
      baselineLabel: res.baselineLabel,
      data: res.data
    };
  }

  public async submitDailyCheckIn(input: DailyCheckInInput): Promise<SaveResult> {
    this.dailyCheckInDone = true;
    this.gamification.todayLogCompleted = true;
    this.gamification.totalPoints += 50;
    this.gamification.completedLogsCount += 1;

    // Update relevant indicators with new measurements
    if (input.heartRate) {
      const hr = this.indicators.find((i) => i.id === 'heart_rate');
      if (hr && hr.latest) {
        hr.latest.value = input.heartRate;
        hr.latest.origin = 'manual';
        hr.latest.measuredAt = new Date().toISOString();
      }
    }
    if (input.sleepHours) {
      const sl = this.indicators.find((i) => i.id === 'sleep');
      if (sl && sl.latest) {
        sl.latest.value = input.sleepHours;
        sl.latest.origin = 'self_reported';
        sl.latest.measuredAt = new Date().toISOString();
      }
    }
    if (input.moodRating) {
      const m = this.indicators.find((i) => i.id === 'mood');
      if (m && m.latest) {
        m.latest.value = input.moodRating;
        m.latest.origin = 'self_reported';
        m.latest.measuredAt = new Date().toISOString();
      }
    }
    if (input.energyRating) {
      const f = this.indicators.find((i) => i.id === 'fatigue');
      if (f && f.latest) {
        f.latest.value = input.energyRating;
        f.latest.origin = 'self_reported';
        f.latest.measuredAt = new Date().toISOString();
      }
    }
    if (input.bloodPressureSystolic && input.bloodPressureDiastolic) {
      const bp = this.indicators.find((i) => i.id === 'blood_pressure');
      if (bp && bp.latest) {
        bp.latest.value = `${input.bloodPressureSystolic}/${input.bloodPressureDiastolic}`;
        bp.latest.origin = 'manual';
        bp.latest.measuredAt = new Date().toISOString();
      }
    }

    this.saveLocal();

    return {
      success: true,
      message: 'Daily health check-in logged and verified locally. Streak maintained.',
      savedId: `chk_${Date.now()}`,
      syncState: 'saved_locally_demo',
      timestamp: new Date().toISOString()
    };
  }

  public async getAlerts(): Promise<HealthAlert[]> {
    if (this.currentScenario === 'nominal_green') return [];
    return this.alerts;
  }

  public async getRadiationSummary(): Promise<RadiationSummary> {
    return this.radiation;
  }

  public async getExerciseEntries(): Promise<ExerciseEntry[]> {
    return this.exercises;
  }

  public async addExerciseEntry(input: Omit<ExerciseEntry, 'id' | 'timestamp'>): Promise<SaveResult> {
    const entry: ExerciseEntry = {
      ...input,
      id: `ex_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.exercises.unshift(entry);
    this.gamification.totalPoints += 30;
    this.saveLocal();

    return {
      success: true,
      message: 'Countermeasure exercise session recorded successfully.',
      savedId: entry.id,
      syncState: 'saved_locally_demo',
      timestamp: entry.timestamp
    };
  }

  public async getManualRecords(): Promise<ManualRecordEntry[]> {
    return this.manualRecords;
  }

  public async addManualRecord(input: Omit<ManualRecordEntry, 'id' | 'timestamp'>): Promise<SaveResult> {
    const entry: ManualRecordEntry = {
      ...input,
      id: `rec_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.manualRecords.unshift(entry);
    this.gamification.totalPoints += 25;
    this.saveLocal();

    return {
      success: true,
      message: 'Manual diagnostic entry recorded with verified timestamp.',
      savedId: entry.id,
      syncState: 'saved_locally_demo',
      timestamp: entry.timestamp
    };
  }

  public async getSyncState(): Promise<SyncState> {
    return this.syncState;
  }

  public async triggerSyncSimulation(): Promise<SyncState> {
    // Simulate real communication window delay
    this.syncState = {
      ...this.syncState,
      queueState: 'syncing'
    };
    await new Promise((res) => setTimeout(res, 800));

    this.syncState = {
      connectivity: 'online',
      queueState: 'empty',
      pendingCount: 0,
      lastSuccessfulSyncAt: new Date().toISOString(),
      serverEndpoint: 'https://api.aahms.internal/v1'
    };
    return this.syncState;
  }

  public async requestAIExplanation(forceRefresh?: boolean): Promise<AIAssistantExplanation> {
    if (forceRefresh) {
      await new Promise((res) => setTimeout(res, 900));
    }
    return this.aiExplanation;
  }

  public async switchDemoScenario(scenario: DemoScenarioKey): Promise<MissionOverview> {
    this.currentScenario = scenario;
    if (scenario === 'nominal_green') {
      this.indicators.forEach((ind) => {
        ind.status = 'green';
        if (ind.id === 'sleep' && ind.latest) ind.latest.value = 7.4;
        if (ind.id === 'heart_rate' && ind.latest) ind.latest.value = 63;
        if (ind.id === 'hrv' && ind.latest) ind.latest.value = 49;
        if (ind.id === 'mood' && ind.latest) ind.latest.value = 4.5;
        if (ind.id === 'fatigue' && ind.latest) ind.latest.value = 4.2;
        if (ind.id === 'blood_pressure' && ind.latest) ind.latest.value = '120/78';
      });
    } else if (scenario === 'day90_yellow') {
      this.indicators = JSON.parse(JSON.stringify(INITIAL_INDICATORS_DAY90));
    } else if (scenario === 'insufficient_data') {
      this.indicators.forEach((ind) => {
        if (ind.id === 'heart_rate' || ind.id === 'hrv' || ind.id === 'blood_pressure') {
          ind.status = 'unknown';
          ind.latest = undefined;
          ind.deltaFromBaseline = 'Link degraded · last valid reading Sol 89';
        }
      });
    }
    this.saveLocal();
    return this.getMissionOverview();
  }
}
