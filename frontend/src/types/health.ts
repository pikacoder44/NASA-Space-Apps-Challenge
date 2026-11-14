export type HealthStatus = 'green' | 'yellow' | 'red' | 'unknown' | 'stale' | 'insufficient_data';

export type DataOrigin = 'sensor' | 'manual' | 'self_reported' | 'simulated' | 'imported';

export type DataQuality = 'valid' | 'suspect' | 'invalid' | 'missing' | 'stale';

export type TrendDirection = 'improving' | 'stable' | 'concerning_up' | 'concerning_down' | 'elevated' | 'insufficient';

export interface Measurement<TValue = number | string> {
  id: string;
  indicator: string;
  value: TValue;
  unit?: string;
  measuredAt: string; // ISO 8601
  origin: DataOrigin;
  quality: DataQuality;
  notes?: string;
}

export interface PersonalBaseline {
  indicator: string;
  value?: number;
  lowerBound?: number;
  upperBound?: number;
  unit?: string;
  establishedAt?: string;
  sampleCount?: number;
  status: 'established' | 'building' | 'unavailable';
  explanation?: string;
}

export interface IndicatorSnapshot {
  id: string;
  name: string;
  category: 'cardiovascular' | 'behavioral' | 'vital' | 'environmental' | 'laboratory' | 'musculoskeletal';
  latest?: Measurement;
  baseline?: PersonalBaseline;
  status: HealthStatus;
  trend: TrendDirection;
  deltaFromBaseline?: string;
  dataCompleteness?: number; // 0-100%
  description: string;
  spaceflightRelevance: string;
  researchCitation?: string;
  sparklineData: number[];
}

export interface HealthAlert {
  id: string;
  status: 'yellow' | 'red';
  title: string;
  contributingIndicators: string[];
  explanation: string;
  magnitude?: string;
  duration?: string;
  confidence?: number; // 0-1.0
  createdAt: string;
  suggestedActions: string[];
  recommendsFlightDoctorContact?: boolean;
  source: 'demo_rule' | 'analysis_service';
  isResolved?: boolean;
}

export interface DailyCheckInInput {
  missionDay: number;
  timestamp: string;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodSugar?: number;
  skinTemperature?: number;
  sleepHours?: number;
  moodRating: number; // 1-5 scale (1: exhausted/stressed, 5: excellent/calm)
  energyRating: number; // 1-5 scale
  waterIntakeLiters?: number;
  symptomsNotes?: string;
}

export interface SaveResult {
  success: boolean;
  message: string;
  savedId?: string;
  syncState: 'saved_locally_demo' | 'pending_sync' | 'synced_server';
  timestamp: string;
}

export interface SyncState {
  connectivity: 'online' | 'offline' | 'unknown';
  queueState: 'empty' | 'pending' | 'syncing' | 'failed';
  pendingCount: number;
  lastSuccessfulSyncAt?: string;
  serverEndpoint?: string;
}

export interface RadiationSummary {
  cumulativeDoseMsv: number;
  missionDay: number;
  dailyRateMsv: number;
  thirtyDayAccumulationMsv: number;
  measuredAt: string;
  source: DataOrigin;
  sensorLocation: string;
  contextNote: string;
  citation: string;
  referenceLimitMsv: number;
  referenceLimitLabel: string;
}

export interface ExerciseEntry {
  id: string;
  timestamp: string;
  missionDay: number;
  activityType: 'ARED Resistive' | 'T2 Treadmill' | 'Cycle Ergometer (CEVIS)' | 'EVA Mobility Drill';
  durationMinutes: number;
  avgHeartRate: number;
  intensityScore: 'low' | 'moderate' | 'high' | 'rigorous';
  notes?: string;
  origin: DataOrigin;
}

export interface ManualRecordEntry {
  id: string;
  timestamp: string;
  missionDay: number;
  testType: 'Blood Glucose' | 'Vision Acuity (SANS Check)' | 'Urine Hydration Index' | 'Salivary Cortisol';
  value: string | number;
  unit: string;
  deviceUsed: string;
  techniqueNotes?: string;
  origin: 'manual';
  status: HealthStatus;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'consistency' | 'education' | 'protocol';
  unlockedAt?: string;
  isUnlocked: boolean;
  progressPercent: number;
}

export interface GamificationStatus {
  currentStreakDays: number;
  bestStreakDays: number;
  totalPoints: number;
  completedLogsCount: number;
  guidesCompletedCount: number;
  badges: AchievementBadge[];
  todayLogCompleted: boolean;
}

export interface AIAssistantExplanation {
  id: string;
  generatedAt: string;
  modelProvider: string;
  overallAssessment: string;
  observedPatterns: {
    indicator: string;
    finding: string;
    baselineComparison: string;
  }[];
  physiologicalContext: string;
  suggestedReviewSteps: string[];
  flightSurgeonEscalation: {
    recommended: boolean;
    reason: string;
  };
  uncertaintyDisclaimer: string;
  sourceType: 'gemini_fastapi_contract' | 'deterministic_offline_rule';
}

export interface BodySystemInfo {
  id: string;
  name: string;
  shortDescription: string;
  spaceflightRelevance: string;
  microgravityEffects: string[];
  relatedIndicatorIds: string[];
  researchCitation: string;
  currentStatus: HealthStatus;
  statusSummary: string;
}

export interface MissionOverview {
  missionDay: number;
  missionPhase: string;
  crewMember: {
    callsign: string;
    role: string;
    missionCode: string;
  };
  overallStatus: HealthStatus;
  overallStatusReason: string;
  statusTimestamp: string;
  isDemoScenarioActive: boolean;
  scenarioName: string;
  dailyCheckInDone: boolean;
  activeAlerts: HealthAlert[];
  keyIndicators: IndicatorSnapshot[];
  radiation: RadiationSummary;
  gamification: GamificationStatus;
  sync: SyncState;
  aiExplanation?: AIAssistantExplanation;
}
