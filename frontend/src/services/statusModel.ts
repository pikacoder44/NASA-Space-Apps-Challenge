import { HealthStatus, IndicatorSnapshot } from '../types/health';

export interface DerivedHealthState {
  status: HealthStatus;
  headline: string;
  subheadline: string;
  contributingIndicators: string[];
  actionRecommendation: string;
  flightSurgeonStatus: 'not_required' | 'recommended' | 'immediate_contact';
  flightSurgeonReason: string;
  isLinkDegraded?: boolean;
}

export function deriveOverallStatus(
  scenario: 'day90_yellow' | 'nominal_green' | 'insufficient_data',
  indicators?: IndicatorSnapshot[]
): DerivedHealthState {
  // If indicators are provided, inspect valid readings
  const validIndicators = (indicators || []).filter(
    (i) => i.status !== 'unknown' && i.status !== 'stale' && i.latest && i.latest.value !== null && i.latest.value !== undefined
  );

  const hasRed = validIndicators.some((i) => i.status === 'red');
  const hasYellow = validIndicators.some((i) => i.status === 'yellow');
  const allUnknown = (indicators || []).length > 0 && validIndicators.length === 0;

  // Link degraded scenario
  if (scenario === 'insufficient_data') {
    const contributing = validIndicators
      .filter((i) => i.status === 'yellow' || i.status === 'red')
      .map((i) => i.id);

    return {
      status: hasRed ? 'red' : hasYellow ? 'yellow' : 'unknown',
      headline: 'Telemetry Link Degraded — Showing Last Valid Data (Sol 89, 14h ago)',
      subheadline: 'Direct communication link interrupted during scheduled blackout. Displaying cached observations from Sol 89.',
      contributingIndicators: contributing,
      actionRecommendation: 'Verify autonomous local logging. Guidance and alerts remain active based on last verified observations.',
      flightSurgeonStatus: 'not_required',
      flightSurgeonReason: 'Prototype demonstration logic: Telemetry blackout window. Escalation triggers only upon verified sustained deviation from your personal baseline.',
      isLinkDegraded: true
    };
  }

  // Explicit Nominal Green scenario
  if (scenario === 'nominal_green' || (!hasRed && !hasYellow && !allUnknown)) {
    return {
      status: 'green',
      headline: 'All Physiological Indicators Within Calibrated Personal Baselines',
      subheadline: 'Resting pulse, sleep duration, thermal flux, and subjective well-being are tracking within nominal individual cruise envelopes.',
      contributingIndicators: [],
      actionRecommendation: 'Continue standard scheduled countermeasure workouts, hydration protocols, and daily check-ins.',
      flightSurgeonStatus: 'not_required',
      flightSurgeonReason: 'Prototype demonstration logic: Telemetry conforms to calibrated personal baselines. Ground intervention is not required.'
    };
  }

  // All unknown
  if (allUnknown) {
    return {
      status: 'unknown',
      headline: 'Awaiting Initial Mission Sensor Telemetry',
      subheadline: 'No valid physiological observations logged for current operational cycle.',
      contributingIndicators: [],
      actionRecommendation: 'Perform scheduled morning health log or check wearable sensor skin contact.',
      flightSurgeonStatus: 'not_required',
      flightSurgeonReason: 'Prototype demonstration logic: Awaiting data ingestion.'
    };
  }

  // Yellow status: Red/Yellow detected
  const worstStatus: HealthStatus = hasRed ? 'red' : 'yellow';
  const contributing = validIndicators
    .filter((i) => i.status === 'yellow' || i.status === 'red')
    .map((i) => i.id);

  return {
    status: worstStatus,
    headline: 'Multi-System Recovery Deficit: 4-Night Sleep Debt with Elevated Resting Pulse',
    subheadline: 'Sleep duration averaged 5.2 hrs (vs 7.3h personal baseline) alongside a +13 bpm elevation in resting heart rate and depressed HRV.',
    contributingIndicators: contributing.length > 0 ? contributing : ['sleep', 'heart_rate', 'hrv', 'mood', 'fatigue'],
    actionRecommendation: 'Prioritize a 90-minute sleep recovery extension before next primary shift. Inspect berth ventilation and fluid intake.',
    flightSurgeonStatus: 'not_required',
    flightSurgeonReason: 'Prototype demonstration logic: Parameters indicate cumulative operational fatigue rather than acute trauma. Escalation triggers on sustained multi-cycle divergence from your personal baseline.'
  };
}
