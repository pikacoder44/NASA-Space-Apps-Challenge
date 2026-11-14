import { DataOrigin, DataQuality } from '../types/health';

export interface TrendDataPoint {
  missionDay: number;
  dateStr: string;
  value: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  baseline: number;
  baselineLower?: number;
  baselineUpper?: number;
  origin: DataOrigin;
  quality: DataQuality;
}

export function generateTrendHistory(
  indicatorId: string,
  range: '7d' | '30d' | 'mission'
): {
  unit: string;
  title: string;
  baselineLabel: string;
  data: TrendDataPoint[];
} {
  const count = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const startDay = 91 - count;

  let unit = '';
  let title = '';
  let baselineLabel = '';

  const data: TrendDataPoint[] = [];

  for (let i = 0; i < count; i++) {
    const day = startDay + i;
    // Generate dates working backwards from 2026-11-14 (Day 90)
    const d = new Date(2026, 10, 14);
    d.setDate(d.getDate() - (90 - day));
    const dateStr = `Day ${day} (${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;

    let val: number | null = null;
    let base = 0;
    let baseLow: number | undefined;
    let baseHigh: number | undefined;
    let origin: DataOrigin = 'sensor';
    let quality: DataQuality = 'valid';

    if (indicatorId === 'sleep') {
      unit = 'hrs';
      title = 'Sleep Duration';
      base = 7.3;
      baseLow = 6.8;
      baseHigh = 8.2;
      baselineLabel = 'Personal Baseline: 7.3 hrs (6.8–8.2 hrs normal window)';
      origin = 'simulated';

      // Days 87-90 have sleep deficit (<6h)
      if (day >= 87) {
        val = day === 87 ? 5.8 : day === 88 ? 5.4 : day === 89 ? 4.9 : 5.2;
      } else if (day === 84) {
        // missing data point demonstration
        val = null;
        quality = 'missing';
      } else {
        // nominal slight fluctuations
        const jitter = Math.sin(day * 0.7) * 0.4 + Math.cos(day * 1.3) * 0.3;
        val = Math.round((7.2 + jitter) * 10) / 10;
      }
    } else if (indicatorId === 'heart_rate') {
      unit = 'bpm';
      title = 'Resting Heart Rate (Sleep-Period)';
      base = 62;
      baseLow = 58;
      baseHigh = 66;
      baselineLabel = 'Personal Baseline: 62 bpm (58–66 bpm)';
      origin = 'sensor';

      if (day >= 87) {
        val = day === 87 ? 68 : day === 88 ? 71 : day === 89 ? 74 : 75;
      } else {
        const jitter = Math.sin(day * 0.5) * 2;
        val = Math.round(62 + jitter);
      }
    } else if (indicatorId === 'hrv') {
      unit = 'ms';
      title = 'Heart Rate Variability (rMSSD)';
      base = 50;
      baseLow = 44;
      baseHigh = 58;
      baselineLabel = 'Personal Baseline: 50 ms (44–58 ms)';
      origin = 'sensor';

      if (day >= 87) {
        val = day === 87 ? 42 : day === 88 ? 37 : day === 89 ? 34 : 32;
      } else {
        const jitter = Math.cos(day * 0.8) * 4;
        val = Math.round(50 + jitter);
      }
    } else if (indicatorId === 'blood_pressure') {
      unit = 'mmHg';
      title = 'Systolic Blood Pressure';
      base = 120;
      baseLow = 114;
      baseHigh = 124;
      baselineLabel = 'Personal Baseline: 120 mmHg (114–124 mmHg)';
      origin = 'manual';

      if (day >= 87) {
        val = day === 87 ? 126 : day === 88 ? 130 : day === 89 ? 134 : 136;
      } else {
        const jitter = Math.sin(day * 0.3) * 3;
        val = Math.round(119 + jitter);
      }
    } else if (indicatorId === 'skin_temperature') {
      unit = '°C';
      title = 'Core/Skin Temperature';
      base = 36.7;
      baseLow = 36.4;
      baseHigh = 37.1;
      baselineLabel = 'Personal Baseline: 36.7 °C (36.4–37.1 °C)';
      origin = 'sensor';

      const jitter = Math.sin(day * 0.6) * 0.15;
      val = Math.round((36.7 + jitter) * 10) / 10;
    } else if (indicatorId === 'mood') {
      unit = '/5';
      title = 'Subjective Mood';
      base = 4.4;
      baseLow = 4.0;
      baseHigh = 5.0;
      baselineLabel = 'Personal Baseline: 4.4 / 5.0';
      origin = 'self_reported';

      if (day >= 87) {
        val = day === 87 ? 3.5 : day === 88 ? 2.9 : day === 89 ? 2.4 : 2.2;
      } else {
        const jitter = Math.sin(day * 0.4) * 0.3;
        val = Math.round((4.3 + jitter) * 10) / 10;
      }
    } else if (indicatorId === 'fatigue') {
      unit = '/5';
      title = 'Energy & Stamina Index';
      base = 4.2;
      baseLow = 3.8;
      baseHigh = 4.8;
      baselineLabel = 'Personal Baseline: 4.2 / 5.0';
      origin = 'self_reported';

      if (day >= 87) {
        val = day === 87 ? 3.2 : day === 88 ? 2.7 : day === 89 ? 2.2 : 2.0;
      } else {
        const jitter = Math.cos(day * 0.5) * 0.3;
        val = Math.round((4.2 + jitter) * 10) / 10;
      }
    } else if (indicatorId === 'radiation_dose') {
      unit = 'mSv';
      title = 'Cumulative Ionizing Dose';
      base = 1.82;
      baselineLabel = 'Nominal Interplanetary Transit Rate: ~1.82 mSv/day';
      origin = 'simulated';

      val = Math.round(day * 1.805 * 10) / 10;
    } else if (indicatorId === 'exercise') {
      unit = 'min';
      title = 'Daily Exercise Duration';
      base = 60;
      baseLow = 50;
      baseHigh = 75;
      baselineLabel = 'Standard Protocol Target: 60 min/day';
      origin = 'imported';

      if (day % 7 === 0) {
        // Active recovery rest day every 7th day
        val = 30;
      } else {
        const jitter = Math.round((Math.sin(day * 0.9) * 5) / 5) * 5;
        val = 60 + jitter;
      }
    } else if (indicatorId === 'blood_glucose') {
      unit = 'mg/dL';
      title = 'Fasting Blood Glucose';
      base = 90;
      baseLow = 82;
      baseHigh = 102;
      baselineLabel = 'Personal Baseline: 90 mg/dL (82–102 mg/dL)';
      origin = 'manual';

      // Bi-weekly test, show values periodically
      if (day % 3 === 0 || day === 89 || day === 90) {
        val = Math.round(90 + Math.sin(day) * 4);
      } else {
        val = null; // not tested daily
        quality = 'missing';
      }
    } else {
      unit = 'pts';
      title = indicatorId;
      base = 50;
      baselineLabel = 'Nominal Baseline';
      val = 50;
    }

    data.push({
      missionDay: day,
      dateStr,
      value: val,
      baseline: base,
      baselineLower: baseLow,
      baselineUpper: baseHigh,
      origin,
      quality
    });
  }

  return {
    unit,
    title,
    baselineLabel,
    data
  };
}
