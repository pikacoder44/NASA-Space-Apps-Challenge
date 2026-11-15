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
import { TrendDataPoint } from '../data/trendData';

export interface IndicatorHistoryResult {
  indicatorId: string;
  unit: string;
  title: string;
  baselineLabel: string;
  data: TrendDataPoint[];
}

export interface HealthRepository {
  getMissionOverview(): Promise<MissionOverview>;
  getIndicator(id: string): Promise<IndicatorSnapshot | undefined>;
  getIndicatorHistory(indicator: string, range: '7d' | '30d' | 'mission'): Promise<IndicatorHistoryResult>;
  submitDailyCheckIn(input: DailyCheckInInput): Promise<SaveResult>;
  getAlerts(): Promise<HealthAlert[]>;
  getRadiationSummary(): Promise<RadiationSummary>;
  getExerciseEntries(): Promise<ExerciseEntry[]>;
  addExerciseEntry(input: Omit<ExerciseEntry, 'id' | 'timestamp'>): Promise<SaveResult>;
  getManualRecords(): Promise<ManualRecordEntry[]>;
  addManualRecord(input: Omit<ManualRecordEntry, 'id' | 'timestamp'>): Promise<SaveResult>;
  getSyncState(): Promise<SyncState>;
  triggerSyncSimulation(): Promise<SyncState>;
  requestAIExplanation(forceRefresh?: boolean): Promise<AIAssistantExplanation>;
  switchDemoScenario(scenario: 'day90_yellow' | 'nominal_green' | 'insufficient_data'): Promise<MissionOverview>;
}
