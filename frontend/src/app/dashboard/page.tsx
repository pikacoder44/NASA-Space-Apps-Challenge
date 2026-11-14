'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Heart, 
  Flame, 
  Moon, 
  Smile, 
  PlusCircle, 
  Compass, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  X,
  Stethoscope,
  Radio,
  TrendingUp,
  Award
} from 'lucide-react';
import { STATUS_COLORS } from '../../lib/colors';
import { getDashboardSummary, getRoutineTasks } from '../../lib/api';
import type { DashboardSummary, RoutineTask, Indicator } from '../../lib/types';
import RoutineList from '../../components/RoutineList';
import { TrendChart } from '../../components/charts/TrendChart';
import { generateTrendHistory } from '../../data/trendData';
import { useHealth } from '../../context/HealthContext';

interface IndicatorInfo {
  what: string;
  why: string;
  how: string;
  contextSentence: (val: number, status: string) => string;
  sparkline: number[];
}

const SHORT_STATUS_LABEL: Record<string, string> = {
  normal: 'Normal',
  warning: 'Watch',
  critical: 'Act now',
  empty: 'No data'
};

const INDICATOR_DETAILS: Record<Indicator, IndicatorInfo> = {
  heart_rate: {
    what: 'Frequency of cardiac contractions per minute while at rest.',
    why: 'Microgravity upward fluid shift alters cardiovascular baroreflex. Elevated heart rate indicates cardiovascular stress, dehydration, or countermeasure fatigue.',
    how: 'Continuous chest bio-harness or optical photoplethysmography sensor.',
    contextSentence: (val, status) => status === 'normal' 
      ? 'Within your normal resting range.' 
      : 'Slightly high, monitor fluid and rest.',
    sparkline: [68, 70, 69, 72, 71, 74, 74]
  },
  blood_pressure_systolic: {
    what: 'Maximum arterial pressure during cardiac contraction.',
    why: 'Cephalic fluid redistribution increases central arterial pressure in microgravity.',
    how: 'Automated brachial oscillometric inflatable cuff on crew medical locker.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Optimal resting arterial tension.'
      : 'Slightly elevated systolic pressure, track trend.',
    sparkline: [118, 120, 119, 124, 121, 123, 122]
  },
  blood_pressure_diastolic: {
    what: 'Minimum arterial pressure during cardiac resting phase.',
    why: 'Absence of hydrostatic gravity gradient alters peripheral vascular resistance.',
    how: 'Automated brachial oscillometric cuff during synchronized morning vitals.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Nominal peripheral vascular resistance.'
      : 'Borderline diastolic variance, re-check later.',
    sparkline: [78, 80, 79, 82, 80, 81, 81]
  },
  body_temp: {
    what: 'Core physiological thermal equilibrium.',
    why: 'Spaceflight core temperature elevation impairs convective cooling and exercise tolerance.',
    how: 'Infrared non-invasive tympanic sensor or ingestible telemetry capsule.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Optimal core thermal balance.'
      : 'Slightly elevated core temperature, hydrate.',
    sparkline: [36.6, 36.7, 36.8, 36.9, 36.7, 36.8, 36.8]
  },
  blood_sugar: {
    what: 'Circulating plasma glucose concentration in fasting state.',
    why: 'Microgravity induces shifts in glucose metabolism and cellular insulin sensitivity.',
    how: 'Capillary glucometer strip recorded during morning crew check-in.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Post-absorptive glucose stable.'
      : 'Mild metabolic variance, monitor nutrition.',
    sparkline: [92, 94, 91, 95, 93, 94, 94]
  },
  sleep_hours: {
    what: 'Total consolidated restorative sleep recorded per 24-hour circadian cycle.',
    why: 'Circadian desynchrony and acoustic disturbance cause cumulative sleep debt.',
    how: 'Actigraphy sleep monitor band and cabin acoustic sensor logs.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Restorative sleep target achieved.'
      : 'Mild sleep debt accumulated, schedule nap protocol.',
    sparkline: [7.2, 6.8, 7.0, 5.8, 6.2, 5.6, 6.4]
  },
  mood_score: {
    what: 'Standardized self-reported psychological resilience and subjective well-being.',
    why: 'Isolation, sensory monotony, and high workload challenge behavioral health.',
    how: 'Validated 10-point visual analog operational mood rating.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Psychological resilience high.'
      : 'Slight operational fatigue reported.',
    sparkline: [8, 8, 7, 7, 6, 7, 7]
  }
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 140;
  const height = 28;
  const padding = 2;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - min) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

const TREND_OPTIONS = [
  { id: 'heart_rate', name: 'Resting Heart Rate' },
  { id: 'sleep', name: 'Sleep Duration' },
  { id: 'hrv', name: 'Heart Rate Variability' },
  { id: 'blood_pressure', name: 'Blood Pressure' },
  { id: 'skin_temperature', name: 'Core Temperature' },
  { id: 'oxygen_saturation', name: 'Oxygen Saturation' },
  { id: 'radiation_dosimetry', name: 'Radiation Dosimetry' }
];

export default function DashboardPage() {
  const { activeScenario } = useHealth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [trendIndicator, setTrendIndicator] = useState('heart_rate');
  const [trendRange, setTrendRange] = useState<'7d' | '30d' | 'mission'>('7d');

  useEffect(() => {
    let mounted = true;
    Promise.all([getDashboardSummary(), getRoutineTasks()]).then(([sumData, routData]) => {
      if (mounted) {
        setSummary(sumData);
        if (routData && routData.length > 0) {
          setRoutines(routData);
        }
      }
    });
    return () => { mounted = false; };
  }, []);

  const getIndicatorIcon = (ind: string) => {
    switch (ind) {
      case 'heart_rate': return <Heart size={16} className="text-[#ef4444]" />;
      case 'blood_pressure_systolic':
      case 'blood_pressure_diastolic': return <Activity size={16} className="text-[#3b82f6]" />;
      case 'body_temp': return <Flame size={16} className="text-[#f97316]" />;
      case 'sleep_hours': return <Moon size={16} className="text-[#8b5cf6]" />;
      case 'mood_score': return <Smile size={16} className="text-[#10b981]" />;
      default: return <Activity size={16} className="text-[#14b8a6]" />;
    }
  };

  const trendHistory = generateTrendHistory(trendIndicator, trendRange);
  const isDegradedLink = activeScenario === 'insufficient_data';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Simple Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-[#60716E] mt-0.5">
            Crew Member (demo) · CDR-01 · Sol {summary?.astronaut.mission_day || 90}
            {isDegradedLink && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-[#8A520F] bg-[#FBF0D9] border border-[#EED8A7] px-2 py-0.5 rounded-full">
                <Radio size={11} className="shrink-0" />
                Cached Sol 89 Data
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/readings/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-[#176B68] text-white hover:bg-[#125553] shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Record Reading</span>
          </Link>
          <Link
            href="/body-map"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-white hover:bg-[#F4F6F4] text-[#172A2B] border border-[#D9E2DE] transition-all cursor-pointer"
          >
            <Compass size={16} />
            <span>Body Map</span>
          </Link>
        </div>
      </div>

      {/* 2. Operational Readiness Assessment (Merged Overview Panel) */}
      <div className="bg-white rounded-2xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9E2DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#60716E]">
                Operational Health Assessment
              </span>
              <span className="text-xs font-semibold text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded-full">
                Sol 90
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#172A2B] mt-0.5">Mission Readiness Assessment</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-[#F3DB9A] bg-[#FEF8EC] text-[#8A520F]">
              <AlertTriangle size={14} className="text-[#8A520F]" />
              <span>Watch</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#FEF8EC] border border-[#F3DB9A]/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A520F] uppercase tracking-wider">
              <AlertTriangle size={14} />
              <span>Recommended Operational Countermeasure</span>
            </div>
            <p className="text-sm text-[#172A2B] leading-relaxed">
              Review sleep berth acoustic insulation and schedule a 45-minute sleep recovery extension before scheduled EVA activity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#D9E2DE] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#60716E] uppercase tracking-wider">
                <Stethoscope size={14} className="text-[#176B68]" />
                <span>Flight Surgeon Protocol Threshold</span>
              </div>
              <p className="text-sm text-[#60716E] mt-1 leading-relaxed">
                Ground Telemedicine Escalation: Not Required. Telemetry reflects cumulative operational fatigue rather than acute medical emergency.
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-[#D9E2DE] flex items-center justify-end">
              <Link
                href="/app/ai-explanation"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#176B68] text-white hover:bg-[#125553] transition-colors"
              >
                <Sparkles size={13} />
                <span>Explain Status</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Physiological Telemetry Indicator Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#172A2B] flex items-center gap-2">
            <Activity size={18} className="text-[#176B68]" />
            <span>Key Physiological Indicators</span>
          </h2>
          <span className="text-xs text-[#60716E]">Click ⓘ for protocol · Click card for Recharts trend</span>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', 
            gap: '20px' 
          }}
        >
          {summary?.indicators.map((ind) => {
            const statusColor = STATUS_COLORS[ind.status] || '#6b7280';
            const detail = INDICATOR_DETAILS[ind.indicator];
            const contextText = detail 
              ? detail.contextSentence(ind.value, ind.status) 
              : 'Within safe flight baseline range.';
            const sparklinePoints = detail ? detail.sparkline : [ind.value - 2, ind.value, ind.value + 1, ind.value];
            const shortLabel = SHORT_STATUS_LABEL[ind.status] || 'Normal';

            return (
              <div
                key={ind.indicator}
                className="group relative p-4 rounded-2xl bg-white border border-[#D9E2DE] hover:border-[#176B68]/40 hover:shadow-md transition-all flex flex-col justify-between h-full min-w-0"
              >
                <div>
                  {/* Top row: Icon, Name, Info button & Status Badge */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#D9E2DE]/70">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getIndicatorIcon(ind.indicator)}
                      <span className="font-bold text-sm text-[#172A2B] truncate">{ind.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveTooltip(activeTooltip === ind.indicator ? null : ind.indicator);
                        }}
                        aria-label={`Information protocol for ${ind.name}`}
                        className="p-1 rounded-md text-[#60716E] hover:text-[#176B68] hover:bg-[#DCEDEA] transition-colors cursor-pointer shrink-0"
                      >
                        <Info size={14} />
                      </button>
                    </div>

                    <span 
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ backgroundColor: statusColor }}
                    >
                      {shortLabel}
                    </span>
                  </div>

                  {/* Value row */}
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#172A2B] font-mono">{ind.value}</span>
                    <span className="text-xs text-[#60716E]">{ind.unit}</span>
                  </div>

                  {/* Sparkline in its own row under value */}
                  <div className="mt-2 w-full h-7">
                    <Sparkline data={sparklinePoints} color={statusColor} />
                  </div>

                  {/* Context sentence */}
                  <p className="mt-2 text-xs text-[#60716E] leading-relaxed">
                    {contextText}
                  </p>
                </div>

                <Link
                  href={`/readings/${ind.indicator}`}
                  className="mt-3 pt-2.5 border-t border-[#D9E2DE]/60 flex items-center justify-between text-xs text-[#176B68] font-semibold hover:underline"
                >
                  <span>View Recharts Trend</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Accessible Info Tooltip Drawer */}
                {activeTooltip === ind.indicator && detail && (
                  <div 
                    className="absolute inset-0 z-20 bg-white border-2 border-[#176B68] rounded-2xl p-4 shadow-xl flex flex-col justify-between animate-in fade-in duration-150"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="space-y-2 text-xs overflow-y-auto">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#D9E2DE]">
                        <span className="font-extrabold text-[#172A2B]">{ind.name} Protocol</span>
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(null)}
                          className="p-1 rounded text-[#60716E] hover:text-[#172A2B] cursor-pointer"
                          aria-label="Close tooltip"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div>
                        <strong className="text-[#176B68]">What it is: </strong>
                        <span className="text-[#172A2B]">{detail.what}</span>
                      </div>
                      <div>
                        <strong className="text-[#8A520F]">Why in space: </strong>
                        <span className="text-[#172A2B]">{detail.why}</span>
                      </div>
                      <div>
                        <strong className="text-[#176B68]">How to measure: </strong>
                        <span className="text-[#172A2B]">{detail.how}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTooltip(null)}
                      className="mt-3 w-full py-1.5 bg-[#DCEDEA] hover:bg-[#176B68] hover:text-white text-[#176B68] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Dismiss Protocol
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Multi-Day Trajectory Analysis (Merged Recharts Overview Component) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[#172A2B] flex items-center gap-2">
            <TrendingUp size={18} className="text-[#176B68]" />
            <span>Multi-Day Trajectory Analysis</span>
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={trendIndicator}
              onChange={(e) => setTrendIndicator(e.target.value)}
              className="text-xs bg-white border border-[#D9E2DE] rounded-lg px-2.5 py-1.5 text-[#172A2B] font-medium focus:outline-none focus:border-[#176B68]"
            >
              {TREND_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>

            <div className="flex items-center border border-[#D9E2DE] rounded-lg bg-white p-0.5 text-xs font-semibold">
              {(['7d', '30d', 'mission'] as const).map((rng) => (
                <button
                  key={rng}
                  type="button"
                  onClick={() => setTrendRange(rng)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    trendRange === rng ? 'bg-[#176B68] text-white shadow-xs' : 'text-[#60716E] hover:text-[#172A2B]'
                  }`}
                >
                  {rng.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <TrendChart
          data={trendHistory.data}
          title={trendHistory.title}
          unit={trendHistory.unit}
          baselineLabel={trendHistory.baselineLabel}
          activeRange={trendRange}
          onRangeChange={setTrendRange}
        />
      </div>

      {/* 5. Bottom Split: Routine Checklist & AI / Radiation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left: Routine List with Points, Streak and Badges */}
        <div className="lg:col-span-2">
          <RoutineList tasks={routines} points={340} streakDays={7} />
        </div>

        {/* Right: AI Synthesis & Radiation Dosimetry Stack */}
        <div className="space-y-4">
          {/* Gemini AI Synthesis Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-[#176B68]" />
                <span className="font-bold text-sm text-[#172A2B]">Gemini Health Assistant</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#DCEDEA] text-[#176B68]">
                AI Advisory
              </span>
            </div>
            <p className="text-xs text-[#60716E] leading-relaxed">
              Based on submitted 4-day telemetry and personal baseline comparison, the system identifies an early autonomic and behavioral recovery deficit.
            </p>
            <Link
              href="/app/ai-explanation"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] hover:underline pt-1"
            >
              <span>Read Full AI Synthesis</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Radiation Dosimetry Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={17} className="text-[#176B68]" />
                <span className="font-bold text-sm text-[#172A2B]">Radiation Dosimetry</span>
              </div>
              <span className="text-xs font-bold text-[#60716E]">1.82 mSv/d</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#172A2B]">162.4</span>
              <span className="text-xs text-[#60716E]">mSv cumulative total</span>
            </div>
            <div className="w-full bg-[#EAF0ED] h-2 rounded-full overflow-hidden">
              <div className="bg-[#176B68] h-full rounded-full" style={{ width: '27%' }} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#60716E]">
              <span>Current Mission Total</span>
              <span>600 mSv Ref Limit</span>
            </div>
            <Link
              href="/app/radiation"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] hover:underline pt-1"
            >
              <span>View Dosimetry Timeline</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
