import { 
  IndicatorSnapshot, 
  HealthAlert, 
  RadiationSummary, 
  GamificationStatus, 
  AIAssistantExplanation, 
  BodySystemInfo, 
  ExerciseEntry, 
  ManualRecordEntry,
  SyncState 
} from '../types/health';

export const INITIAL_SYNC_STATE: SyncState = {
  connectivity: 'online',
  queueState: 'empty',
  pendingCount: 0,
  lastSuccessfulSyncAt: '2026-11-14T06:45:00Z',
  serverEndpoint: 'https://api.aahms.internal/v1'
};

export const INITIAL_RADIATION_DAY90: RadiationSummary = {
  cumulativeDoseMsv: 162.4,
  missionDay: 90,
  dailyRateMsv: 1.82,
  thirtyDayAccumulationMsv: 54.6,
  measuredAt: '2026-11-14T06:00:00Z',
  source: 'simulated',
  sensorLocation: 'Crew Compartment Dosimeter Array (B-3)',
  contextNote: 'Interplanetary transit exposure environment. Galactic Cosmic Rays (GCR) background with solar modulation.',
  citation: 'CSA Radiation Monitoring & NASA HRP Space Radiation Hazard Guidelines (SIMULATED PROTOTYPE DATA)',
  referenceLimitMsv: 600.0,
  referenceLimitLabel: 'Illustrative NASA Career Guideline Reference (600 mSv) — Contextual reference only, not an acute personal threshold'
};

export const INITIAL_GAMIFICATION: GamificationStatus = {
  currentStreakDays: 14,
  bestStreakDays: 28,
  totalPoints: 1420,
  completedLogsCount: 88,
  guidesCompletedCount: 6,
  todayLogCompleted: false,
  badges: [
    {
      id: 'streak_7',
      title: '7-Day Sentinel',
      description: 'Completed 7 consecutive daily health check-ins.',
      iconName: 'Flame',
      category: 'consistency',
      unlockedAt: '2026-11-07T08:00:00Z',
      isUnlocked: true,
      progressPercent: 100
    },
    {
      id: 'streak_14',
      title: 'Orbital Consistency',
      description: 'Completed 14 consecutive daily health logs.',
      iconName: 'Award',
      category: 'consistency',
      unlockedAt: '2026-11-14T06:30:00Z',
      isUnlocked: true,
      progressPercent: 100
    },
    {
      id: 'guide_master',
      title: 'Protocol Scholar',
      description: 'Reviewed all primary measurement guides and sensor procedures.',
      iconName: 'BookOpen',
      category: 'education',
      unlockedAt: '2026-11-02T14:15:00Z',
      isUnlocked: true,
      progressPercent: 100
    },
    {
      id: 'cardio_baseline',
      title: 'Baseline Pioneer',
      description: 'Established reliable 30-day baseline for heart rate and HRV.',
      iconName: 'Activity',
      category: 'protocol',
      unlockedAt: '2026-09-15T12:00:00Z',
      isUnlocked: true,
      progressPercent: 100
    },
    {
      id: 'streak_30',
      title: 'Deep Space Veteran',
      description: 'Complete 30 consecutive daily health logs.',
      iconName: 'Shield',
      category: 'consistency',
      isUnlocked: false,
      progressPercent: 46
    },
    {
      id: 'alertness_expert',
      title: 'Alertness Calibrator',
      description: 'Complete 10 alertness/reaction assessments under operational protocol.',
      iconName: 'Zap',
      category: 'education',
      isUnlocked: false,
      progressPercent: 60
    }
  ]
};

export const INITIAL_INDICATORS_DAY90: IndicatorSnapshot[] = [
  {
    id: 'sleep',
    name: 'Sleep Duration & Quality',
    category: 'behavioral',
    status: 'yellow',
    trend: 'concerning_down',
    deltaFromBaseline: '-2.1 hrs vs established baseline (4-night cumulative deficit)',
    dataCompleteness: 98,
    description: 'Total nightly sleep measured via wearable actigraphy and sleep-state polysomnography sensor.',
    spaceflightRelevance: 'Circadian desynchronization and microgravity fluid shifts disrupt deep sleep cycles, reducing behavioral resilience and immune recovery.',
    researchCitation: 'NASA Human Research Program (HRP) Risk of Performance Decrements from Sleep Loss (HRP-47053)',
    latest: {
      id: 'sleep_d90',
      indicator: 'sleep',
      value: 5.2,
      unit: 'hrs',
      measuredAt: '2026-11-14T06:00:00Z',
      origin: 'simulated',
      quality: 'valid',
      notes: 'Woke 3 times during REM cycle; sleep efficiency 74%'
    },
    baseline: {
      indicator: 'sleep',
      value: 7.3,
      lowerBound: 6.8,
      upperBound: 8.2,
      unit: 'hrs',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 60,
      status: 'established',
      explanation: 'Established from Mission Days 1-60 nominal sleep data during transit cruise.'
    },
    sparklineData: [7.2, 7.0, 6.9, 7.1, 5.8, 5.4, 4.9, 5.2]
  },
  {
    id: 'heart_rate',
    name: 'Resting Heart Rate',
    category: 'cardiovascular',
    status: 'yellow',
    trend: 'concerning_up',
    deltaFromBaseline: '+13 bpm vs nighttime resting baseline',
    dataCompleteness: 99,
    description: 'Continuous resting pulse recorded during supine rest and overnight recovery periods.',
    spaceflightRelevance: 'Elevations in nighttime resting heart rate during spaceflight reflect sympathetic nervous system activation, cumulative fatigue, or fluid imbalance.',
    researchCitation: 'NASA HRP Cardiovascular Alterations in Microgravity & Inspiration4 Medical Telemetry Findings',
    latest: {
      id: 'hr_d90',
      indicator: 'heart_rate',
      value: 75,
      unit: 'bpm',
      measuredAt: '2026-11-14T06:15:00Z',
      origin: 'simulated',
      quality: 'valid',
      notes: 'Overnight minimum 71 bpm; daytime seated rest 88 bpm; transient peak 104 bpm during morning exertion'
    },
    baseline: {
      indicator: 'heart_rate',
      value: 62,
      lowerBound: 58,
      upperBound: 66,
      unit: 'bpm',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 60,
      status: 'established',
      explanation: 'Established from 60 days of calibrated sleep-period measurements.'
    },
    sparklineData: [61, 62, 63, 62, 66, 71, 74, 75]
  },
  {
    id: 'hrv',
    name: 'Heart Rate Variability (rMSSD)',
    category: 'cardiovascular',
    status: 'yellow',
    trend: 'concerning_down',
    deltaFromBaseline: '-18 ms (autonomic stress indicator)',
    dataCompleteness: 95,
    description: 'Root mean square of successive differences between normal heartbeats, indexing parasympathetic vagal tone.',
    spaceflightRelevance: 'Depressed rMSSD indicates autonomic strain, reduced parasympathetic recovery, and systemic stress during long-duration flight.',
    researchCitation: 'ESA/AGBRESA Bed-Rest Study & NASA HRP Autonomic Regulation in Spaceflight',
    latest: {
      id: 'hrv_d90',
      indicator: 'hrv',
      value: 32,
      unit: 'ms',
      measuredAt: '2026-11-14T06:15:00Z',
      origin: 'simulated',
      quality: 'valid'
    },
    baseline: {
      indicator: 'hrv',
      value: 50,
      lowerBound: 44,
      upperBound: 58,
      unit: 'ms',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 60,
      status: 'established',
      explanation: 'Derived from 60 nocturnal resting baseline assessments.'
    },
    sparklineData: [52, 49, 51, 48, 43, 38, 34, 32]
  },
  {
    id: 'blood_pressure',
    name: 'Blood Pressure',
    category: 'cardiovascular',
    status: 'yellow',
    trend: 'elevated',
    deltaFromBaseline: '+16/+10 mmHg above personal resting baseline',
    dataCompleteness: 92,
    description: 'Brachial cuff measurement taken at seated rest under standardized protocol.',
    spaceflightRelevance: 'Cephalad fluid shifts alter carotid baroreceptor setpoints. Sustained elevation above personal baseline warrants monitoring for vascular strain.',
    researchCitation: 'NASA Twins Study Cardiovascular Proteomics & Hemodynamic Shifts',
    latest: {
      id: 'bp_d90',
      indicator: 'blood_pressure',
      value: '136/88',
      unit: 'mmHg',
      measuredAt: '2026-11-14T06:30:00Z',
      origin: 'manual',
      quality: 'valid',
      notes: 'Measured with automated pneumatic oscillometric flight cuff; verified seated after 5 min rest'
    },
    baseline: {
      indicator: 'blood_pressure',
      value: 120,
      lowerBound: 114,
      upperBound: 124,
      unit: 'mmHg',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 45,
      status: 'established',
      explanation: 'Personal baseline: 120/78 mmHg (systolic/diastolic).'
    },
    sparklineData: [118, 120, 119, 122, 126, 130, 134, 136]
  },
  {
    id: 'skin_temperature',
    name: 'Core/Skin Temperature',
    category: 'vital',
    status: 'green',
    trend: 'stable',
    deltaFromBaseline: '+0.1 °C (within normal diurnal tolerance)',
    dataCompleteness: 99,
    description: 'Continuous dual-sensor forehead/subclavicular skin and calculated thermal flux.',
    spaceflightRelevance: 'Spaceflight-associated core temperature elevations (space fever phenomenon) occur due to reduced evaporative convection.',
    researchCitation: 'ESA Circadian Rhythm & Core Body Temperature in Spaceflight (ThermoLab)',
    latest: {
      id: 'temp_d90',
      indicator: 'skin_temperature',
      value: 36.8,
      unit: '°C',
      measuredAt: '2026-11-14T06:30:00Z',
      origin: 'sensor',
      quality: 'valid'
    },
    baseline: {
      indicator: 'skin_temperature',
      value: 36.7,
      lowerBound: 36.4,
      upperBound: 37.1,
      unit: '°C',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 60,
      status: 'established',
      explanation: 'Established circadian thermal cycle from flight days 1-60.'
    },
    sparklineData: [36.6, 36.7, 36.7, 36.8, 36.7, 36.8, 36.7, 36.8]
  },
  {
    id: 'mood',
    name: 'Self-Reported Mood',
    category: 'behavioral',
    status: 'yellow',
    trend: 'concerning_down',
    deltaFromBaseline: '-2.2 pts (1-5 standardized operational scale)',
    dataCompleteness: 96,
    description: 'Astronaut daily subjective assessment of emotional equilibrium, irritability, and morale.',
    spaceflightRelevance: 'Isolation, confinement, and chronic sleep deficit directly impair mood, communication effectiveness, and mission cognitive focus.',
    researchCitation: 'NASA HERA Isolation Studies & Behavioral Health and Performance Element (BHP)',
    latest: {
      id: 'mood_d90',
      indicator: 'mood',
      value: 2.2,
      unit: '/5',
      measuredAt: '2026-11-14T06:40:00Z',
      origin: 'self_reported',
      quality: 'valid',
      notes: 'Reported persistent mental fatigue and heightened sensitivity to ambient equipment noise'
    },
    baseline: {
      indicator: 'mood',
      value: 4.4,
      lowerBound: 4.0,
      upperBound: 5.0,
      unit: '/5',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 50,
      status: 'established',
      explanation: 'Established baseline reflects high subjective stability during early mission cruise.'
    },
    sparklineData: [4.5, 4.3, 4.4, 4.2, 3.5, 3.0, 2.5, 2.2]
  },
  {
    id: 'fatigue',
    name: 'Energy & Alertness Level',
    category: 'behavioral',
    status: 'yellow',
    trend: 'concerning_down',
    deltaFromBaseline: '-2.0 pts on self-reported stamina index',
    dataCompleteness: 96,
    description: 'Self-reported physical stamina and perceived effort required to initiate operational tasks.',
    spaceflightRelevance: 'High fatigue scores correlate with reaction time latency and increased procedural error rates in safety-critical operations.',
    researchCitation: 'NASA HRP Behavioral Health & Fatigue Countermeasures Operations',
    latest: {
      id: 'fatigue_d90',
      indicator: 'fatigue',
      value: 2.0,
      unit: '/5',
      measuredAt: '2026-11-14T06:40:00Z',
      origin: 'self_reported',
      quality: 'valid'
    },
    baseline: {
      indicator: 'fatigue',
      value: 4.2,
      lowerBound: 3.8,
      upperBound: 4.8,
      unit: '/5',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 50,
      status: 'established',
      explanation: 'Nominal operational energy baseline established during early mission phase.'
    },
    sparklineData: [4.2, 4.3, 4.0, 4.1, 3.2, 2.8, 2.3, 2.0]
  },
  {
    id: 'blood_glucose',
    name: 'Blood Glucose (Fasting)',
    category: 'laboratory',
    status: 'green',
    trend: 'stable',
    deltaFromBaseline: '+4 mg/dL vs fasting baseline',
    dataCompleteness: 85,
    description: 'Manual capillary blood glucose evaluation via mission diagnostic reagent cartridge.',
    spaceflightRelevance: 'Metabolic shifts and altered insulin sensitivity have been observed during long-duration confinement and bed-rest analog studies.',
    researchCitation: 'NASA Open Science Data Repository (OSDR) Spaceflight Metabolic Investigations',
    latest: {
      id: 'bg_d90',
      indicator: 'blood_glucose',
      value: 94,
      unit: 'mg/dL',
      measuredAt: '2026-11-13T07:00:00Z',
      origin: 'manual',
      quality: 'valid',
      notes: 'Fasting 8h sample; calibrated cartridge Lot #B24'
    },
    baseline: {
      indicator: 'blood_glucose',
      value: 90,
      lowerBound: 82,
      upperBound: 102,
      unit: 'mg/dL',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 20,
      status: 'established',
      explanation: 'Established from 20 bi-weekly calibrated manual test samples.'
    },
    sparklineData: [88, 92, 89, 91, 93, 89, 92, 94]
  },
  {
    id: 'radiation_dose',
    name: 'Cumulative Radiation Exposure',
    category: 'environmental',
    status: 'green',
    trend: 'stable',
    deltaFromBaseline: 'Tracking anticipated interplanetary transit trajectory (+1.82 mSv/day)',
    dataCompleteness: 100,
    description: 'Passive and active dosimeter telemetry recording ionizing radiation absorbed dose.',
    spaceflightRelevance: 'Galactic cosmic rays and solar particle events cause DNA damage, increasing long-term cancer risk and tissue degeneration.',
    researchCitation: 'Canadian Space Agency (CSA) Radiation Dosimetry & NASA Space Radiation Hazards',
    latest: {
      id: 'rad_d90',
      indicator: 'radiation_dose',
      value: 162.4,
      unit: 'mSv',
      measuredAt: '2026-11-14T06:00:00Z',
      origin: 'simulated',
      quality: 'valid'
    },
    baseline: {
      indicator: 'radiation_dose',
      value: 1.8,
      lowerBound: 1.5,
      upperBound: 2.1,
      unit: 'mSv/day',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 90,
      status: 'established',
      explanation: 'Nominal interplanetary cruise dose rate baseline: ~1.8 mSv/day.'
    },
    sparklineData: [150, 152, 154, 156, 158, 160, 161, 162.4]
  },
  {
    id: 'exercise',
    name: 'Daily Exercise Adherence',
    category: 'musculoskeletal',
    status: 'green',
    trend: 'stable',
    deltaFromBaseline: 'Completed 60/60 min prescribed protocol yesterday',
    dataCompleteness: 94,
    description: 'Cardiovascular and resistive exercise duration recorded on ARED and T2 treadmill.',
    spaceflightRelevance: 'Essential daily countermeasure to mitigate microgravity bone mineral density loss and muscle atrophy.',
    researchCitation: 'NASA HRP Exercise Countermeasures Project & ISS Human Physiology Standards',
    latest: {
      id: 'ex_d90',
      indicator: 'exercise',
      value: 60,
      unit: 'min',
      measuredAt: '2026-11-13T16:00:00Z',
      origin: 'imported',
      quality: 'valid'
    },
    baseline: {
      indicator: 'exercise',
      value: 60,
      lowerBound: 50,
      upperBound: 75,
      unit: 'min',
      establishedAt: '2026-09-01T00:00:00Z',
      sampleCount: 75,
      status: 'established',
      explanation: 'Standard protocol target: 60 min resistive + aerobic countermeasure sessions daily.'
    },
    sparklineData: [60, 65, 55, 60, 60, 50, 60, 60]
  }
];

export const ALERTS_DAY90: HealthAlert[] = [
  {
    id: 'alert_day90_cluster',
    status: 'yellow',
    title: 'Cluster Deviation: Sleep Deficit with Elevated Resting Heart Rate & Autonomic Strain',
    contributingIndicators: ['sleep', 'heart_rate', 'hrv', 'mood', 'fatigue'],
    explanation: 'Over the past 4 consecutive sleep cycles, recorded sleep duration has averaged 5.2 hrs (baseline 7.3 hrs), concurrent with a +13 bpm increase in nighttime resting heart rate and a 36% decline in HRV rMSSD. Self-reported stamina and mood indices have declined synchronously.',
    magnitude: 'Moderate multi-system variance (+21% heart rate, -29% sleep)',
    duration: '4 consecutive mission days (Days 87-90)',
    confidence: 0.89,
    createdAt: '2026-11-14T06:45:00Z',
    suggestedActions: [
      'Prioritize a 90-minute sleep recovery extension before the next critical EVA/docking task cycle.',
      'Verify cabin air telemetry: ensure CO2 partial pressure is below 2.5 mmHg in sleep quarters.',
      'Check hydration and electrolyte balance; ensure targeted 2.5L fluid intake schedule.',
      'Consider moderating peak exertion intensity on next ARED session to prevent excessive cardiovascular loading.'
    ],
    recommendsFlightDoctorContact: false,
    source: 'demo_rule',
    isResolved: false
  },
  {
    id: 'alert_bp_mild',
    status: 'yellow',
    title: 'Mild Orthostatic Blood Pressure Shift (136/88 mmHg)',
    contributingIndicators: ['blood_pressure'],
    explanation: 'Manual oscillometric reading indicates resting blood pressure is 16 mmHg systolic above your established 120/78 baseline, consistent with transient sympathetic elevation or fluid redistribution.',
    magnitude: '+16 systolic / +10 diastolic',
    duration: 'Observed today during post-sleep check-in',
    confidence: 0.82,
    createdAt: '2026-11-14T06:35:00Z',
    suggestedActions: [
      'Repeat resting blood pressure measurement following 10 minutes of quiet relaxation.',
      'Log fluid intake and avoid high-sodium snacks in the next operational cycle.'
    ],
    recommendsFlightDoctorContact: false,
    source: 'demo_rule',
    isResolved: false
  }
];

export const BODY_SYSTEMS: BodySystemInfo[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    shortDescription: 'Heart, central arterial compliance, systemic hemodynamics, and baroreflex function.',
    spaceflightRelevance: 'In microgravity, absence of hydrostatic pressure causes cephalad fluid shifts (~2 liters toward the chest and head). Stroke volume initially increases, followed by plasma volume contraction and autonomic baroreceptor recalibration.',
    microgravityEffects: [
      'Headward venous fluid redistribution and facial engorgement',
      'Decrease in circulating blood plasma volume by 10-15%',
      'Elevated resting nocturnal pulse under cumulative fatigue',
      'Post-flight orthostatic intolerance vulnerability upon re-entering gravity'
    ],
    relatedIndicatorIds: ['heart_rate', 'hrv', 'blood_pressure'],
    researchCitation: 'NASA Human Research Program (HRP) Cardiovascular Risks & NASA Twins Study Hemodynamic Investigations',
    currentStatus: 'yellow',
    statusSummary: 'Resting pulse elevated to 75 bpm (+13 bpm above baseline) with decreased HRV vagal tone.'
  },
  {
    id: 'brain_behavioral',
    name: 'Brain & Behavioral Health',
    shortDescription: 'Cognitive vigilance, sleep architecture, circadian rhythm, and psychological resilience.',
    spaceflightRelevance: 'Confined deep-space transit introduces isolation, altered light-dark cycles, continuous acoustic noise from life support fans, and circadian disruption, impacting sleep cycles and cognitive bandwidth.',
    microgravityEffects: [
      'Disruption of restorative slow-wave and REM sleep phases',
      'Cumulative cognitive fatigue impacting decision latency',
      'Psychological strain and mood variance from prolonged confinement',
      'Neurovestibular adaptation and space motion sickness during initial transit'
    ],
    relatedIndicatorIds: ['sleep', 'mood', 'fatigue'],
    researchCitation: 'NASA HRP Risk of Adverse Cognitive or Behavioral Conditions and Psychiatric Disorders (HRP-47051)',
    currentStatus: 'yellow',
    statusSummary: 'Cumulative 4-night sleep restriction (<6 hrs) correlating with self-reported mental fatigue and reduced mood.'
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal System',
    shortDescription: 'Bone mineral density, cortical bone architecture, muscle mass, and postural muscle endurance.',
    spaceflightRelevance: 'Without gravitational mechanical loading, astronauts lose approximately 1% to 1.5% of bone mineral density per month in weight-bearing bones (hip, calcaneus, lumbar spine) and experience muscle atrophy without countermeasure exercise.',
    microgravityEffects: [
      'Rapid loss of cancellous and cortical bone density without loading',
      'Atrophy of postural antigravity muscles (soleus, gastrocnemius)',
      'Risk of spaceflight-induced spinal elongation and transient back discomfort',
      'Requirement for rigorous daily resistive exercise (ARED) to maintain bone turnover balance'
    ],
    relatedIndicatorIds: ['exercise'],
    researchCitation: 'NASA ISS Bone Mineral Density Countermeasure Evaluations & CSA Bone Health Research',
    currentStatus: 'green',
    statusSummary: 'Daily countermeasure exercise protocol maintained (60 min target met). No anomalous musculoskeletal symptoms reported.'
  },
  {
    id: 'sensory_vision',
    name: 'Sensory & Vision (SANS)',
    shortDescription: 'Visual acuity, optic nerve sheath diameter, and ocular structural changes.',
    spaceflightRelevance: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS) is observed in long-duration astronauts due to chronic venous congestion in the head, leading to optic disc edema, globe flattening, and hyperopic refractive shifts.',
    microgravityEffects: [
      'Cephalad venous pressure elevation affecting retrobulbar tissue',
      'Progressive cotton-wool spots and choroidal folds in susceptible crew',
      'Hyperopic shift requiring reading glasses adjustment',
      'Monitored through regular visual acuity chart and fundoscopy manual entries'
    ],
    relatedIndicatorIds: ['vision_assessment'],
    researchCitation: 'NASA HRP Risk of Spaceflight-Associated Neuro-ocular Syndrome (SANS Evidence Book)',
    currentStatus: 'green',
    statusSummary: 'Visual acuity within baseline calibration. No subjective visual blurring or refractive shifts logged.'
  },
  {
    id: 'immune_environmental',
    name: 'Immune & Environmental Health',
    shortDescription: 'Cell-mediated immunity, latent viral reactivation, and cellular radiation damage response.',
    spaceflightRelevance: 'Combined space radiation, altered sleep, and microgravity alter T-cell activation and cytokine distribution. Dosimetry monitors cosmic radiation doses to ensure lifetime career exposure stays within cautious boundaries.',
    microgravityEffects: [
      'Altered distribution of circulating leukocytes and blunted T-cell response',
      'Potential subclinical reactivation of latent herpesviruses (EBV, VZV)',
      'Cumulative ionization energy deposition from galactic cosmic rays',
      'Continuous monitoring via personal and area radiation dosimeters'
    ],
    relatedIndicatorIds: ['radiation_dose', 'skin_temperature'],
    researchCitation: 'CSA Space Radiation Dosimetry Guidelines & NASA HRP Immune Dysregulation Evidence',
    currentStatus: 'green',
    statusSummary: 'Transit exposure tracking nominal trajectory (1.82 mSv/day). Core thermal balance nominal at 36.8 °C.'
  }
];

export const AI_ASSISTANT_DAY90: AIAssistantExplanation = {
  id: 'ai_exp_day90_001',
  generatedAt: '2026-11-14T06:50:00Z',
  modelProvider: 'Gemini (via FastAPI Backend Integration Contract)',
  overallAssessment: 'Based on your submitted 4-day telemetry and personal baseline comparison, the system identifies an early autonomic and behavioral recovery deficit. All parameters remain within sub-acute boundaries, but the synchronous pattern of shortened sleep, elevated resting pulse, and decreased mood warrants cautious operational self-care.',
  observedPatterns: [
    {
      indicator: 'Sleep Duration',
      finding: '4 consecutive nights under 6.0 hours (average 5.2 hrs), reflecting a cumulative ~8.4 hour sleep debt relative to your 7.3h baseline.',
      baselineComparison: '-2.1 hrs below established 60-day mission baseline'
    },
    {
      indicator: 'Resting Nocturnal Heart Rate',
      finding: 'Gradual upward drift from 62 bpm to 75 bpm (+13 bpm). Daytime exertion readings show increased cardiovascular reactivity.',
      baselineComparison: '+21% above baseline resting band'
    },
    {
      indicator: 'Heart Rate Variability (rMSSD)',
      finding: 'Decreased to 32 ms from 50 ms baseline, indicating suppressed parasympathetic tone and physiological sympathetic compensation.',
      baselineComparison: '-36% below established norm'
    },
    {
      indicator: 'Subjective Morale & Stamina',
      finding: 'Both mood and energy indices dropped from nominal 4.4/5 to ~2.1/5, correlating temporally with the sleep deficit onset.',
      baselineComparison: 'Significant subjective fatigue marker'
    }
  ],
  physiologicalContext: 'During interplanetary transit, microgravity fluid shifts combined with life-support acoustic environment and mission workload can trigger subtle sleep fragmentation. Elevated nighttime heart rate alongside depressed HRV suggests your body is experiencing sympathetic compensation rather than full nocturnal physiological recovery.',
  suggestedReviewSteps: [
    'Schedule a 90-minute sleep extension window in your mission task timeline prior to tomorrow\'s primary shift.',
    'Inspect sleep berth ventilation and verify CO2 scrubber telemetry is within nominal bounds (< 2.5 mmHg).',
    'Review personal hydration log: verify you have reached your scheduled 2.5 L daily fluid and electrolyte intake.',
    'Keep your scheduled resistive exercise (ARED) at moderate maintenance load today; defer high-intensity cardiovascular sprints until recovery indices improve.',
    'Repeat resting blood pressure measurement following 15 minutes of quiet rest.'
  ],
  flightSurgeonEscalation: {
    recommended: false,
    reason: 'Current findings represent early operational fatigue without signs of acute cardiovascular compromise, chest pain, dyspnea, or severe neurological impairment. If resting heart rate exceeds 95 bpm at rest, or if sleep deficit continues past 6 nights with severe disorientation, contact the Flight Surgeon ground team per Mission Rule Med-4.2.'
  },
  uncertaintyDisclaimer: 'This explanation is generated by an experimental AI assistant model for the NASA Space Apps Challenge prototype. It is educational and operational context only. It is NOT a medical diagnosis, does not prescribe drugs or clinical treatments, and does not replace the flight surgeon or mission medical protocols.',
  sourceType: 'gemini_fastapi_contract'
};

export const MEASUREMENT_GUIDES = [
  {
    id: 'heart_rate',
    title: 'Resting Heart Rate & HRV',
    system: 'Cardiovascular',
    readTime: '2 min read',
    overview: 'Resting heart rate reflects cardiovascular autonomic regulation and recovery status in microgravity.',
    equipment: 'Crew wrist wearable (PPG optical sensor) or dry-electrode chest strap transmitter.',
    preparation: [
      'Ensure the optical sensor is snug against clean skin, approximately two finger-widths above the wrist bone.',
      'Allow at least 5 minutes of quiet, still resting in your crew berth before taking a manual seated snapshot.',
      'Avoid high-caffeine rations or immediate post-exercise intervals within 45 minutes of measurement.'
    ],
    steps: [
      'Confirm the sensor contact indicator shows a solid green link on the device.',
      'Remain still, breathing steadily at a normal unforced rate for 60 seconds.',
      'Check that the waveform confidence metric displays > 90% before accepting the reading into the log.'
    ],
    commonPitfalls: [
      'Loose strap movement artifact: causes false spikes or missed beats.',
      'Cold extremities: in lower cabin temperatures, peripheral vasoconstriction can degrade PPG signal amplitude. Warm hands if signal is weak.'
    ],
    troubleshooting: 'If reading shows erratic jumps > 30 bpm without physical movement, switch to the dry-electrode chest strap and verify electrode gel contact.'
  },
  {
    id: 'blood_pressure',
    title: 'Blood Pressure (Flight Cuff)',
    system: 'Cardiovascular',
    readTime: '3 min read',
    overview: 'Standardized brachial blood pressure monitoring assesses central vascular tone following fluid redistribution.',
    equipment: 'Automated pneumatic oscillometric arm cuff with crew calibration memory.',
    preparation: [
      'Sit comfortably with back supported and feet anchored to foot restraints.',
      'Support the arm at heart level using the armrest cushion.',
      'Rest silently for 5 full minutes before pressing start. Do not converse or read active checklists during measurement.'
    ],
    steps: [
      'Wrap the cuff around your upper arm, aligning the artery index marker with the brachial artery.',
      'Ensure the cuff is snug enough that only two fingertips can slide between the cuff and arm.',
      'Press the cycle button once. Remain quiet and motionless until the cuff completely deflates.',
      'Record both systolic and diastolic values (mmHg) into the Daily Check-in form.'
    ],
    commonPitfalls: [
      'Arm position below heart level: can falsely elevate systolic/diastolic readings by 5-10 mmHg.',
      'Talking or moving during inflation cycle: introduces pressure artifacts.'
    ],
    troubleshooting: 'If the reading is unexpectedly high or low, wait 3 minutes and repeat the measurement on the opposite arm.'
  },
  {
    id: 'blood_glucose',
    title: 'Blood Glucose (Manual Diagnostic)',
    system: 'Laboratory & Metabolic',
    readTime: '3 min read',
    overview: 'Capillary blood glucose testing assesses carbohydrate metabolism and insulin sensitivity changes during spaceflight.',
    equipment: 'Micro-gravity capillary blood lancet, test reagent cartridge, handheld flight reflectometer/glucometer.',
    preparation: [
      'Sanitize the puncture site with an alcohol wipe and ensure the site is completely dry.',
      'Perform testing in a fasting state (ideally morning before breakfast) or at a standardized 2-hour postprandial interval.'
    ],
    steps: [
      'Insert the reagent cartridge into the meter and verify calibration code matches the cartridge lot.',
      'Use the safety lancet on the lateral edge of the fingertip.',
      'Form a clean hanging capillary bead; touch the test cartridge tip to the sample. Capillary action will fill the chamber.',
      'Wait 5 seconds for the digital countdown and log the value in mg/dL under Manual Records.'
    ],
    commonPitfalls: [
      'Squeezing the puncture site too aggressively: dilutes blood with interstitial fluid, skewing glucose reading.',
      'Floating micro-droplets in microgravity: ensure absorbent gauze is immediately applied to the fingertip.'
    ],
    troubleshooting: 'If an error code appears (e.g. insufficient sample volume), discard the strip and use a new cartridge.'
  },
  {
    id: 'skin_temperature',
    title: 'Skin & Core Temperature',
    system: 'Thermal & Vital',
    readTime: '2 min read',
    overview: 'Continuous thermal flux monitoring detects space-fever phenomena and circadian thermal phase shifts.',
    equipment: 'Dual-sensor thermal flux sensor attached to forehead or subclavicular region.',
    preparation: [
      'Clean the attachment site with mild saline cleanser to remove natural skin oils and sweat.',
      'Apply a medical-grade double-sided adhesive ring to the sensor head.'
    ],
    steps: [
      'Press the sensor firmly to the skin for 10 seconds to ensure a secure thermal bond.',
      'Wait 3 minutes for temperature equilibration between the skin and sensor ambient reference.',
      'Confirm the reading displays in degrees Celsius (°C).'
    ],
    commonPitfalls: [
      'Air convection interference: placing the sensor directly in the airflow path of a personal ventilation duct can artifically lower readings.',
      'Loose adhesive: if the sensor peels away, thermal conduction is lost.'
    ],
    troubleshooting: 'Replace the adhesive patch every 48 hours or immediately following high-intensity exercise.'
  },
  {
    id: 'sleep_logging',
    title: 'Sleep & Rest Recovery Logging',
    system: 'Behavioral Health',
    readTime: '2 min read',
    overview: 'Accurate sleep duration and quality logs enable early detection of circadian phase misalignment.',
    equipment: 'Wrist actigraphy recorder + subjective sleep log in AAHMS.',
    preparation: [
      'Before entering your sleep berth, dim cabin ambient lights to nocturnal spectrum at least 30 minutes prior.',
      'Inspect sleep restraint bag straps and ear protection to minimize acoustic awakenings.'
    ],
    steps: [
      'Upon waking, check the actigraphy band display for total sleep time (TST) and awakenings count.',
      'Open the AAHMS Daily Health Log.',
      'Input the sleep duration in hours (e.g. 5.2 hrs).',
      'Select your perceived sleep quality and note any disruptive factors (noise, cabin temperature, dreams).'
    ],
    commonPitfalls: [
      'Counting total time in bed instead of actual sleep time: estimate actual sleep, not just resting with eyes closed.',
      'Delaying log entry: subjective recall of sleep quality degrades rapidly after starting daytime duties. Complete within 30 minutes of waking.'
    ],
    troubleshooting: 'If actigraphy battery is depleted, record estimated sleep from cabin schedule clocks and plug band into USB recharge dock.'
  },
  {
    id: 'mood_energy',
    title: 'Mood & Energy Assessment',
    system: 'Behavioral Health',
    readTime: '2 min read',
    overview: 'Honest self-reporting of mood and energy is vital for crew psychological support and fatigue risk management.',
    equipment: 'AAHMS Check-In interface (standardized 1-5 NASA behavioral Likert scale).',
    preparation: [
      'Take 30 seconds of quiet reflection before completing this section.',
      'Remember: this self-monitoring is non-punitive. A lower rating helps identify when recovery steps are needed and does not penalize your streak or achievements.'
    ],
    steps: [
      'Rate your overall mood from 1 (severely stressed/irritable) to 5 (calm/motivated/focused).',
      'Rate your physical and mental stamina from 1 (exhausted/drained) to 5 (energized/sharp).',
      'Add brief context notes if applicable (e.g. "high noise from pump 2", "heavy workload").'
    ],
    commonPitfalls: [
      'Hero-bias / under-reporting fatigue: feeling fatigued during 90+ days in space is biologically normal. Accurate data enables the team to protect your health.',
      'Rushing through the rating without genuine reflection.'
    ],
    troubleshooting: 'If you feel persistently drained for more than 3 consecutive days, discuss schedule pacing with the mission commander or ground medical support.'
  }
];

export const INITIAL_EXERCISE_LOG: ExerciseEntry[] = [
  {
    id: 'ex_1',
    timestamp: '2026-11-13T16:00:00Z',
    missionDay: 89,
    activityType: 'ARED Resistive',
    durationMinutes: 45,
    avgHeartRate: 138,
    intensityScore: 'high',
    notes: 'Squats (4x10), deadlifts (3x10), heel raises. Loading matched protocol target.',
    origin: 'imported'
  },
  {
    id: 'ex_2',
    timestamp: '2026-11-13T16:50:00Z',
    missionDay: 89,
    activityType: 'T2 Treadmill',
    durationMinutes: 20,
    avgHeartRate: 152,
    intensityScore: 'rigorous',
    notes: 'Bungee harness load set at 70% bodyweight equivalent. Interval sprint protocol.',
    origin: 'imported'
  },
  {
    id: 'ex_3',
    timestamp: '2026-11-12T15:30:00Z',
    missionDay: 88,
    activityType: 'Cycle Ergometer (CEVIS)',
    durationMinutes: 35,
    avgHeartRate: 132,
    intensityScore: 'moderate',
    notes: 'Continuous aerobic endurance pacing; sweat capture vacuum nominal.',
    origin: 'imported'
  },
  {
    id: 'ex_4',
    timestamp: '2026-11-11T16:15:00Z',
    missionDay: 87,
    activityType: 'ARED Resistive',
    durationMinutes: 50,
    avgHeartRate: 140,
    intensityScore: 'high',
    notes: 'Upper body and spinal core stabilization routine.',
    origin: 'imported'
  }
];

export const INITIAL_MANUAL_RECORDS: ManualRecordEntry[] = [
  {
    id: 'rec_1',
    timestamp: '2026-11-13T07:00:00Z',
    missionDay: 89,
    testType: 'Blood Glucose',
    value: 94,
    unit: 'mg/dL',
    deviceUsed: 'Handheld Mission Glucometer Cartridge',
    techniqueNotes: 'Fasting morning sample. Cartridge Lot #B24.',
    origin: 'manual',
    status: 'green'
  },
  {
    id: 'rec_2',
    timestamp: '2026-11-10T14:00:00Z',
    missionDay: 86,
    testType: 'Vision Acuity (SANS Check)',
    value: '20/20 Left, 20/25 Right',
    unit: 'Snellen Scale',
    deviceUsed: 'Standardized Near-Vision Test Card (40 cm distance)',
    techniqueNotes: 'Minor 0.25 diopter hyperopic shift noted in right eye. No disc edema symptoms.',
    origin: 'manual',
    status: 'green'
  },
  {
    id: 'rec_3',
    timestamp: '2026-11-12T06:30:00Z',
    missionDay: 88,
    testType: 'Urine Hydration Index',
    value: '1.018',
    unit: 'Specific Gravity',
    deviceUsed: 'Digital Optical Refractometer',
    techniqueNotes: 'Nominal hydration target range (1.010 - 1.025).',
    origin: 'manual',
    status: 'green'
  }
];
