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
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Info,
  X,
  Stethoscope,
  Radio,
  TrendingUp,
  RefreshCw,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { STATUS_COLORS } from '../../lib/colors';
import { getDashboardSummary, getRoutineTasks } from '../../lib/api';
import type { DashboardSummary, RoutineTask, Indicator } from '../../lib/types';
import RoutineList from '../../components/RoutineList';
import { TrendChart } from '../../components/charts/TrendChart';
import { generateTrendHistory } from '../../data/trendData';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ErrorBoundary } from '../../components/ui/ErrorBoundary';

interface IndicatorInfo {
  what: string;
  why: string;
  how: string;
  contextSentence: (val: number, status: string) => string;
  sparkline: number[];
}

const INDICATOR_DETAILS: Record<Indicator, IndicatorInfo> = {
  heart_rate: {
    what: 'How many times your heart beats in one minute while you are resting.',
    why: 'In zero gravity, fluids shift toward your chest and head. A rising pulse is an early sign of dehydration, fatigue, or stress.',
    how: 'Chest heart strap or optical wrist sensor.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Within your usual healthy resting range.'
      : 'Higher than usual — drink water and take a rest break.',
    sparkline: [68, 70, 69, 72, 71, 74, 74]
  },
  blood_pressure_systolic: {
    what: 'The maximum pressure in your blood vessels when your heart beats.',
    why: 'Fluid shifting toward the upper body slightly increases resting blood pressure.',
    how: 'Upper arm blood pressure cuff during morning check-in.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Optimal resting blood pressure.'
      : 'Slightly higher than normal — check again after resting.',
    sparkline: [118, 120, 119, 124, 121, 123, 122]
  },
  blood_pressure_diastolic: {
    what: 'The resting pressure in your blood vessels between heartbeats.',
    why: 'Helps track how your blood vessels adapt without gravity pulling blood down.',
    how: 'Upper arm blood pressure cuff during morning check-in.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Healthy resting vascular pressure.'
      : 'Mild difference from your baseline — re-test at your next check.',
    sparkline: [78, 80, 79, 82, 80, 81, 81]
  },
  body_temp: {
    what: 'Your core body temperature.',
    why: 'Without gravity, heat does not easily rise away from the body. An elevated temperature can signal heat buildup or infection.',
    how: 'Infrared ear thermometer.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Normal body temperature.'
      : 'Slightly warm — hydrate and reduce heavy gear.',
    sparkline: [36.6, 36.7, 36.8, 36.9, 36.7, 36.8, 36.8]
  },
  blood_sugar: {
    what: 'The concentration of glucose sugar in your bloodstream.',
    why: 'Prolonged microgravity changes how muscle tissue and cells use glucose for energy.',
    how: 'Capillary finger-prick test strip with morning kit.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Fasting blood sugar is stable.'
      : 'Small change in blood sugar — follow daily meal plan.',
    sparkline: [92, 94, 91, 95, 93, 94, 94]
  },
  sleep_hours: {
    what: 'How many continuous hours of restful sleep you got last night.',
    why: 'Cabin noise, artificial light, and floating make deep sleep harder, causing slow tiredness to build up over months.',
    how: 'Sleep wristband tracker and crew log.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Healthy sleep duration reached.'
      : 'You are down on sleep — schedule a rest period.',
    sparkline: [7.2, 6.8, 7.0, 5.8, 6.2, 5.6, 6.4]
  },
  mood_score: {
    what: 'Your own rating of your energy, focus, and morale from 1 (low) to 10 (great).',
    why: 'Confinement and isolation can affect mood and team cohesion over time.',
    how: 'Quick 1-to-10 self-rating during daily check-in.',
    contextSentence: (val, status) => status === 'normal'
      ? 'Morale and energy remain high.'
      : 'Slight fatigue reported — check in with crewmates.',
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
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

const TREND_OPTIONS = [
  { id: 'heart_rate', name: 'Resting Heart Rate' },
  { id: 'blood_pressure_systolic', name: 'Systolic Blood Pressure' },
  { id: 'blood_pressure_diastolic', name: 'Diastolic Blood Pressure' },
  { id: 'body_temp', name: 'Core Body Temperature' },
  { id: 'blood_sugar', name: 'Blood Glucose' },
  { id: 'sleep_hours', name: 'Sleep Duration' },
  { id: 'mood_score', name: 'Subjective Mood Score' },
];

export default function DashboardPage() {
  const { activeScenario } = useHealth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [trendIndicator, setTrendIndicator] = useState('heart_rate');
  const [trendRange, setTrendRange] = useState<'7d' | '30d' | 'mission'>('7d');

  useEffect(() => {
    let mounted = true;
    Promise.all([getDashboardSummary(), getRoutineTasks()])
      .then(([sumData, routData]) => {
        if (mounted) {
          setSummary(sumData);
          if (routData && routData.length > 0) {
            setRoutines(routData);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (mounted) {
          const msg = err instanceof Error ? err.message : 'Could not connect to health summary data.';
          setError(msg);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    Promise.all([getDashboardSummary(), getRoutineTasks()])
      .then(([sumData, routData]) => {
        setSummary(sumData);
        if (routData && routData.length > 0) {
          setRoutines(routData);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Could not connect to health summary data.';
        setError(msg);
        setLoading(false);
      });
  };

  const getIndicatorIcon = (ind: string) => {
    switch (ind) {
      case 'heart_rate': return <Heart size={16} className="text-[#ef4444]" />;
      case 'blood_pressure_systolic':
      case 'blood_pressure_diastolic': return <Activity size={16} className="text-[#3b82f6]" />;
      case 'body_temp': return <Flame size={16} className="text-[#f97316]" />;
      case 'blood_sugar': return <Activity size={16} className="text-[#10b981]" />;
      case 'sleep_hours': return <Moon size={16} className="text-[#8b5cf6]" />;
      case 'mood_score': return <Smile size={16} className="text-[#10b981]" />;
      default: return <Activity size={16} className="text-[#14b8a6]" />;
    }
  };

  const trendHistory = generateTrendHistory(trendIndicator, trendRange);
  const isDegradedLink = activeScenario === 'insufficient_data';
  const overallStatus = summary?.overall_status || 'warning';
  const missionDay = summary?.astronaut?.mission_day || summary?.mission_day || 90;
  const astronautName = summary?.astronaut?.name || 'Crew Member (demo)';
  const astronautRole = summary?.astronaut?.role || 'CDR-01';

  return (
    <ErrorBoundary widgetName="Mission Health Dashboard" variant="page" onReset={handleRetry}>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* 1. Header Greeting & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-[#60716E] mt-0.5">
              {astronautName} · {astronautRole} · Sol {missionDay}
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

        {/* Error Card with Retry Button */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-[#FBF0D9] border border-[#EED8A7] text-[#8A520F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="shrink-0" />
              <span>Could not refresh live data. Viewing cached local health telemetry.</span>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#EED8A7] font-bold text-[#8A520F] hover:bg-[#FBF0D9] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={13} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* 2. Mission Health Readiness Assessment Banner */}
        <ErrorBoundary
          widgetName="Mission Readiness Assessment"
          variant="card"
          onReset={handleRetry}
        >
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 shadow-xs animate-pulse space-y-4">
              <div className="h-6 bg-[#EAF0ED] rounded-md w-1/3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-24 bg-[#EAF0ED] rounded-xl" />
                <div className="h-24 bg-[#EAF0ED] rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9E2DE]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#60716E]">
                      Daily Health Overview
                    </span>
                    <span className="text-xs font-semibold text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded-full">
                      Sol {missionDay}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#172A2B] mt-0.5">Mission Health Status</h2>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={overallStatus} size="md" variant="full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border space-y-2 ${
                  overallStatus === 'critical'
                    ? 'bg-[#F9E7E5] border-[#F1BCB7]'
                    : overallStatus === 'normal'
                    ? 'bg-[#E4F2E9] border-[#BDE0CB]'
                    : 'bg-[#FEF8EC] border-[#F3DB9A]/60'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#172A2B]">
                    {overallStatus === 'critical' ? (
                      <AlertOctagon size={14} className="text-[#B33C3C]" />
                    ) : overallStatus === 'normal' ? (
                      <CheckCircle2 size={14} className="text-[#247A55]" />
                    ) : (
                      <AlertTriangle size={14} className="text-[#8A520F]" />
                    )}
                    <span>Recommended Next Step</span>
                  </div>
                  <p className="text-sm text-[#172A2B] leading-relaxed">
                    {overallStatus === 'normal'
                      ? 'All monitored vitals are within your typical personal baseline. You are in good condition for regular mission activities.'
                      : overallStatus === 'critical'
                      ? 'One or more readings are significantly outside safe flight limits. Stop strenuous activities, hydrate, and alert crew medical.'
                      : 'Reduce cabin noise levels during sleep and schedule a 45-minute rest period before your next scheduled spacewalk.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#D9E2DE] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#60716E] uppercase tracking-wider">
                      <Stethoscope size={14} className="text-[#176B68]" />
                      <span>Flight Doctor Guidance</span>
                    </div>
                    <p className="text-sm text-[#60716E] mt-1 leading-relaxed">
                      {overallStatus === 'critical'
                        ? 'Ground medical call: Recommended. Telemetry package has been prioritized for next Deep Space Network pass.'
                        : 'Ground medical call: Not required. Your readings reflect built-up tiredness rather than an acute medical emergency.'}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#D9E2DE] flex items-center justify-end">
                    <Link
                      href="/app/ai-explanation"
                      className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#176B68] text-white hover:bg-[#125553] transition-colors"
                    >
                      <Sparkles size={13} />
                      <span>Explain Status with AI</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ErrorBoundary>

        {/* 3. Physiological Telemetry Indicator Grid */}
        <ErrorBoundary
          widgetName="Physiological Telemetry Grid"
          variant="card"
          onReset={handleRetry}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#172A2B] flex items-center gap-2">
                <Activity size={18} className="text-[#176B68]" />
                <span>Key Health Readings</span>
              </h2>
              <span className="text-xs text-[#60716E]">Click ⓘ for a simple explanation · Click card for historical trends</span>
            </div>

            {loading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                  gap: '20px'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <div key={n} className="p-5 rounded-2xl bg-white border border-[#D9E2DE] h-48 animate-pulse space-y-3">
                    <div className="h-4 bg-[#EAF0ED] rounded w-1/2" />
                    <div className="h-8 bg-[#EAF0ED] rounded w-1/3" />
                    <div className="h-6 bg-[#EAF0ED] rounded w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                  gap: '20px'
                }}
              >
                {(!summary?.indicators || summary.indicators.length === 0) && !loading && (
                  <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-[#D9E2DE] text-[#60716E]">
                    <Activity size={32} className="mx-auto mb-2 text-[#60716E]/40" />
                    <p className="text-sm font-semibold text-[#172A2B]">No health indicators available</p>
                    <p className="text-xs mt-1">Health telemetry readings will appear here once logged.</p>
                  </div>
                )}
                {summary?.indicators.map((ind) => {
                  const statusColor = STATUS_COLORS[ind.status] || '#6b7280';
                  const detail = INDICATOR_DETAILS[ind.indicator];
                  const fallbackText = detail
                    ? detail.contextSentence(ind.value ?? ind.latest_value ?? 0, ind.status)
                    : 'Within your usual healthy baseline range.';
                  const reasonText = ind.reason || ind.message || fallbackText;
                  const sparklinePoints = (ind.trend_7d && ind.trend_7d.length > 0)
                    ? ind.trend_7d
                    : (detail ? detail.sparkline : [ind.value - 2, ind.value, ind.value + 1, ind.value]);
                  const displayValue = ind.value ?? ind.latest_value ?? 0;

                  return (
                    <ErrorBoundary
                      key={ind.indicator}
                      widgetName={`${ind.name} Reading`}
                      variant="compact"
                    >
                      <div
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
                                aria-label={`Simple guide for ${ind.name}`}
                                className="p-1 rounded-md text-[#60716E] hover:text-[#176B68] hover:bg-[#DCEDEA] transition-colors cursor-pointer shrink-0"
                              >
                                <Info size={14} />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {ind.mode && (
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#EAF0ED] text-[#176B68]">
                                  {ind.mode}
                                </span>
                              )}
                              <StatusBadge status={ind.status} size="sm" variant="compact" />
                            </div>
                          </div>

                          {/* Value row */}
                          <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-3xl font-extrabold text-[#172A2B] font-mono">{displayValue}</span>
                            <span className="text-xs text-[#60716E] font-medium">{ind.unit}</span>
                          </div>

                          {/* Sparkline in its own row under value */}
                          <div className="mt-2 w-full h-7">
                            <Sparkline data={sparklinePoints} color={statusColor} />
                          </div>

                          {/* Context / Reason sentence with clean line wrap */}
                          <p className="mt-2 text-xs text-[#60716E] leading-relaxed break-words line-clamp-3">
                            {reasonText}
                          </p>
                        </div>

                        <Link
                          href={`/readings/${ind.indicator}`}
                          className="mt-3 pt-2.5 border-t border-[#D9E2DE]/60 flex items-center justify-between text-xs text-[#176B68] font-bold hover:underline"
                        >
                          <span>View 30-day trend</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        {/* Accessible Info Tooltip Drawer */}
                        {activeTooltip === ind.indicator && detail && (
                          <div
                            className="absolute inset-0 z-20 bg-white border-2 border-[#176B68] rounded-2xl p-4 shadow-xl flex flex-col justify-between animate-in fade-in duration-150"
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${ind.name} Guide`}
                          >
                            <div className="space-y-2.5 text-xs overflow-y-auto">
                              <div className="flex items-center justify-between pb-1.5 border-b border-[#D9E2DE]">
                                <span className="font-extrabold text-sm text-[#172A2B]">{ind.name} Guide</span>
                                <button
                                  type="button"
                                  onClick={() => setActiveTooltip(null)}
                                  className="p-1 rounded text-[#60716E] hover:text-[#172A2B] cursor-pointer"
                                  aria-label="Close guide"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div>
                                <strong className="text-[#176B68] block font-semibold mb-0.5">What it measures:</strong>
                                <p className="text-[#172A2B] leading-relaxed">{detail.what}</p>
                              </div>
                              <div>
                                <strong className="text-[#8A520F] block font-semibold mb-0.5">Why it matters in space:</strong>
                                <p className="text-[#172A2B] leading-relaxed">{detail.why}</p>
                              </div>
                              <div>
                                <strong className="text-[#176B68] block font-semibold mb-0.5">How to measure:</strong>
                                <p className="text-[#172A2B] leading-relaxed">{detail.how}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setActiveTooltip(null)}
                              className="mt-3 w-full py-1.5 bg-[#DCEDEA] hover:bg-[#176B68] hover:text-white text-[#176B68] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Got it, close
                            </button>
                          </div>
                        )}
                      </div>
                    </ErrorBoundary>
                  );
                })}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* 4. Multi-Day Health Trends Chart */}
        <ErrorBoundary
          widgetName="Health Trends Trajectory Chart"
          variant="card"
        >
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#172A2B] flex items-center gap-2">
                <TrendingUp size={18} className="text-[#176B68]" />
                <span>Health Trends Over Time</span>
              </h2>

              <div className="flex items-center gap-2">
                <select
                  value={trendIndicator}
                  onChange={(e) => setTrendIndicator(e.target.value)}
                  className="text-xs bg-white border border-[#D9E2DE] rounded-lg px-2.5 py-1.5 text-[#172A2B] font-medium focus:outline-none focus:border-[#176B68]"
                  aria-label="Select metric for trend chart"
                >
                  {TREND_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>

                <div className="flex items-center border border-[#D9E2DE] rounded-lg bg-white p-0.5 text-xs font-semibold" role="group" aria-label="Select time range">
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
        </ErrorBoundary>

        {/* 5. Bottom Split: Routine Checklist & AI / Radiation Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Left: Routine List with Points, Streak and Badges */}
          <div className="lg:col-span-2">
            <ErrorBoundary
              widgetName="Flight Routine Tasks"
              variant="card"
              onReset={handleRetry}
            >
              <RoutineList tasks={routines} points={340} streakDays={7} />
            </ErrorBoundary>
          </div>

          {/* Right: AI Synthesis & Radiation Dosimetry Stack */}
          <div className="space-y-4">
            {/* Gemini AI Synthesis Card */}
            <ErrorBoundary widgetName="AI Health Advisory" variant="card">
              <div className="p-5 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={17} className="text-[#176B68]" />
                    <span className="font-bold text-sm text-[#172A2B]">AI Health Assistant</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#DCEDEA] text-[#176B68]">
                    AI Advisory
                  </span>
                </div>
                <p className="text-xs text-[#60716E] leading-relaxed">
                  Based on your recent health readings compared to your usual baseline, you are showing early signs of physical fatigue and sleep debt.
                </p>
                <Link
                  href="/app/ai-explanation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] hover:underline pt-1"
                >
                  <span>Read Full AI Summary</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </ErrorBoundary>

            {/* Radiation Dosimetry Card */}
            <ErrorBoundary widgetName="Radiation Dosimetry" variant="card">
              <div className="p-5 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={17} className="text-[#176B68]" />
                    <span className="font-bold text-sm text-[#172A2B]">Radiation Tracker</span>
                  </div>
                  <span className="text-xs font-bold text-[#60716E]">1.82 mSv/day</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-[#172A2B]">162.4</span>
                  <span className="text-xs text-[#60716E]">mSv total mission dose</span>
                </div>
                <div className="w-full bg-[#EAF0ED] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#176B68] h-full rounded-full" style={{ width: '27%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#60716E]">
                  <span>Mission Total So Far</span>
                  <span>600 mSv Safe Limit</span>
                </div>
                <Link
                  href="/app/radiation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] hover:underline pt-1"
                >
                  <span>View Radiation Timeline</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </ErrorBoundary>
          </div>
        </div>

        {/* Backend Clinical Disclaimer Banner */}
        {summary?.disclaimer && (
          <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] text-xs text-[#60716E] flex items-start gap-2.5">
            <Info size={15} className="text-[#176B68] shrink-0 mt-0.5" />
            <p className="leading-relaxed">{summary.disclaimer}</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
