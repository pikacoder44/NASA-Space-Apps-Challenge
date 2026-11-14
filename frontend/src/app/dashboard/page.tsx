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
  Calendar,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from '../../lib/branding';
import { STATUS_COLORS, STATUS_LABEL } from '../../lib/colors';
import { getDashboardSummary, getRoutineTasks } from '../../lib/api';
import type { DashboardSummary, RoutineTask, Indicator } from '../../lib/types';
import RoutineList from '../../components/RoutineList';

interface IndicatorInfo {
  what: string;
  why: string;
  how: string;
  contextSentence: (val: number, status: string) => string;
  sparkline: number[];
}

const INDICATOR_DETAILS: Record<Indicator, IndicatorInfo> = {
  heart_rate: {
    what: 'Frequency of cardiac contractions per minute while at rest.',
    why: 'Microgravity causes upward fluid shift and baroreceptor recalibration. Elevated heart rate indicates cardiovascular stress, dehydration, or countermeasure fatigue.',
    how: 'Measured autonomously via continuous chest bio-harness or optical photoplethysmography sensor.',
    contextSentence: (val, status) => status === 'normal' 
      ? `${val} bpm — 🟢 Within safe resting spaceflight baseline.` 
      : status === 'warning'
      ? `${val} bpm — 🟡 Slightly elevated, monitor fluid intake & workload.`
      : `${val} bpm — 🔴 Tachycardia detected, initiate medical protocol.`,
    sparkline: [70, 72, 71, 75, 73, 76, 74]
  },
  blood_pressure_systolic: {
    what: 'Maximum arterial pressure during cardiac systolic contraction.',
    why: 'Cephalic fluid redistribution increases central arterial pressures, altering cranial perfusion.',
    how: 'Automated brachial oscillometric inflatable cuff on crew medical locker.',
    contextSentence: (val, status) => status === 'normal'
      ? `${val} mmHg — 🟢 Optimal resting arterial tension.`
      : `${val} mmHg — 🟡 Elevated systolic load, re-verify in 2 hours.`,
    sparkline: [118, 120, 119, 124, 121, 123, 122]
  },
  blood_pressure_diastolic: {
    what: 'Minimum arterial pressure during resting cardiac diastolic phase.',
    why: 'Loss of hydrostatic gravity gradient reduces lower limb peripheral vascular resistance.',
    how: 'Automated brachial oscillometric cuff during synchronized morning vitals.',
    contextSentence: (val, status) => status === 'normal'
      ? `${val} mmHg — 🟢 Nominal vascular resistance.`
      : `${val} mmHg — 🟡 Borderline diastolic variance, track trend.`,
    sparkline: [78, 80, 79, 82, 80, 81, 81]
  },
  body_temp: {
    what: 'Core physiological thermal equilibrium.',
    why: 'Spaceflight-associated core temperature elevation ("space fever") impairs convective cooling and exercise endurance.',
    how: 'Infrared non-invasive tympanic sensor or ingestible telemetry capsule.',
    contextSentence: (val, status) => status === 'normal'
      ? `${val} °C — 🟢 Optimal core thermal homeostasis.`
      : `${val} °C — 🟡 Elevated core temperature, avoid EVA countermeasure.`,
    sparkline: [36.6, 36.7, 36.8, 36.9, 36.7, 36.8, 36.8]
  },
  blood_sugar: {
    what: 'Circulating plasma glucose concentration in post-absorptive state.',
    why: 'Microgravity alters glucose metabolism and cellular insulin sensitivity.',
    how: 'Fingerstick capillary glucometer strip recorded during morning check-in.',
    contextSentence: (val, status) => status === 'normal'
      ? `${val} mg/dL — 🟢 Post-absorptive metabolic baseline stable.`
      : `${val} mg/dL — 🟡 Glycemic fluctuation detected, review nutrition.`,
    sparkline: [92, 94, 98, 91, 96, 93, 94]
  },
  sleep_hours: {
    what: 'Total continuous restorative sleep duration over the preceding sol.',
    why: 'Circadian desynchrony in enclosed spacecraft cabins directly correlates with operational error rates.',
    how: 'Actigraphy sleep watch combined with subjective morning log entry.',
    contextSentence: (val, status) => status === 'normal'
      ? `${val} h — 🟢 Restorative circadian quota achieved.`
      : `${val} h — 🟡 Mild sleep debt accumulated, schedule nap protocol.`,
    sparkline: [7.2, 6.8, 7.0, 5.8, 6.2, 6.5, 6.4]
  },
  mood_score: {
    what: 'Self-reported psychological well-being and mission morale on a 1–10 scale.',
    why: 'Confinement, distance from Earth, and 22-minute delay induce psychological stress.',
    how: 'Standardized 30-second crew subjective rating during evening check-in.',
    contextSentence: (val, status) => status === 'normal'
      ? `${val} / 10 — 🟢 Psychological resilience and crew morale high.`
      : `${val} / 10 — 🟡 Elevated fatigue or stress reported, review rest.`,
    sparkline: [8, 8, 7, 7, 8, 7, 7]
  }
};

// SVG Sparkline Component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden="true">
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

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<Indicator | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDashboardSummary(), getRoutineTasks()]).then(([sumData, routData]) => {
      if (mounted) {
        setSummary(sumData);
        setRoutines(routData);
      }
    });
    return () => { mounted = false; };
  }, []);

  const getIndicatorIcon = (ind: string) => {
    switch (ind) {
      case 'heart_rate': return <Heart size={18} className="text-[#ef4444]" />;
      case 'blood_pressure_systolic':
      case 'blood_pressure_diastolic': return <Activity size={18} className="text-[#3b82f6]" />;
      case 'body_temp': return <Flame size={18} className="text-[#f97316]" />;
      case 'sleep_hours': return <Moon size={18} className="text-[#8b5cf6]" />;
      case 'mood_score': return <Smile size={18} className="text-[#10b981]" />;
      default: return <Activity size={18} className="text-[#14b8a6]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header Strip with Project Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-brand/10 text-brand uppercase tracking-wider">
                Mission Sol {summary?.astronaut.mission_day || 90}
              </span>
              <span className="text-xs text-muted font-mono">MARS-TRANSIT-PHASE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main mt-1 tracking-tight">
              {APP_NAME} <span className="text-sm font-normal text-muted block sm:inline">· {APP_SUBTITLE}</span>
            </h1>
            <p className="text-sm text-muted mt-0.5">
              Cockpit evaluation for {summary?.astronaut.name || 'Crew Commander'} ({summary?.astronaut.role || 'CDR-01'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/readings/new"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-brand text-white hover:bg-brand-hover shadow-sm transition-all"
            >
              <PlusCircle size={18} />
              <span>+ Add Reading</span>
            </Link>
            <Link
              href="/body-map"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-surface-alt hover:bg-border text-main border border-border transition-all"
            >
              <Compass size={18} />
              <span>Body Map</span>
            </Link>
          </div>
        </div>

        {/* Overall Status Banner */}
        {summary && (
          <div 
            className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            style={{ 
              borderColor: STATUS_COLORS[summary.overall_status] || '#6b7280',
              backgroundColor: summary.overall_status === 'warning' ? 'rgba(234, 179, 8, 0.08)' : summary.overall_status === 'critical' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)'
            }}
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs"
                style={{ backgroundColor: STATUS_COLORS[summary.overall_status] }}
              >
                {summary.overall_status === 'normal' ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-main">Overall Astronaut Status:</span>
                  <span 
                    className="px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wide text-white"
                    style={{ backgroundColor: STATUS_COLORS[summary.overall_status] }}
                  >
                    {STATUS_LABEL[summary.overall_status]}
                  </span>
                </div>
                <p className="text-sm text-muted mt-0.5">
                  {summary.overall_status === 'normal' 
                    ? 'All microgravity telemetry within safe medical tolerances for active Mars transit.' 
                    : 'Elevated cardiovascular load and sleep debt detected. Countermeasure protocol active.'}
                </p>
              </div>
            </div>

            <Link
              href="/app/ai-explanation"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-alt text-main shrink-0"
            >
              <Sparkles size={14} className="text-brand" />
              <span>Explain Status</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Indicators Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-main flex items-center gap-2">
              <Activity size={18} className="text-brand" />
              <span>Physiological Telemetry Indicators</span>
            </h2>
            <span className="text-xs text-muted">Click ⓘ for spaceflight protocol · click card for trend chart</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {summary?.indicators.map((ind) => {
              const statusColor = STATUS_COLORS[ind.status] || '#6b7280';
              const detail = INDICATOR_DETAILS[ind.indicator];
              const contextText = detail 
                ? detail.contextSentence(ind.value, ind.status) 
                : `${ind.value} ${ind.unit} — ${STATUS_LABEL[ind.status]}`;
              const sparklinePoints = detail ? detail.sparkline : [ind.value - 2, ind.value, ind.value + 1, ind.value];

              return (
                <div
                  key={ind.indicator}
                  className="group relative p-4 rounded-2xl bg-surface border border-border hover:border-brand/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Icon, Name, Info button & Status Badge */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
                      <div className="flex items-center gap-1.5">
                        {getIndicatorIcon(ind.indicator)}
                        <span className="font-bold text-sm text-main">{ind.name}</span>
                        {/* Interactive Accessible Info Tooltip Button (Click, Touch, Keyboard Focus) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveTooltip(activeTooltip === ind.indicator ? null : ind.indicator);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveTooltip(activeTooltip === ind.indicator ? null : ind.indicator);
                            }
                          }}
                          aria-label={`Information protocol for ${ind.name}`}
                          aria-expanded={activeTooltip === ind.indicator}
                          className="p-1 rounded-md text-muted hover:text-brand hover:bg-brand/10 transition-colors cursor-pointer"
                        >
                          <Info size={14} />
                        </button>
                      </div>

                      <span 
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: statusColor }}
                      >
                        {ind.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Value + Sparkline row */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-main font-mono">{ind.value}</span>
                        <span className="text-xs text-muted font-mono">{ind.unit}</span>
                      </div>
                      <Sparkline data={sparklinePoints} color={statusColor} />
                    </div>

                    {/* Context sentence: Never show a number without context */}
                    <div className="mt-2.5 p-2 rounded-lg bg-surface-alt/60 border border-border/40 text-xs font-medium text-main leading-relaxed">
                      {contextText}
                    </div>
                  </div>

                  <Link
                    href={`/readings/${ind.indicator}`}
                    className="mt-4 pt-2.5 border-t border-border/40 flex items-center justify-between text-xs text-brand font-semibold hover:underline"
                  >
                    <span>View Recharts Trend</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Accessible Info Tooltip Modal/Drawer (Touch & Keyboard friendly) */}
                  {activeTooltip === ind.indicator && detail && (
                    <div 
                      className="absolute inset-0 z-20 bg-surface border-2 border-brand rounded-2xl p-4 shadow-xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-150"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div className="space-y-2 text-xs overflow-y-auto">
                        <div className="flex items-center justify-between pb-1.5 border-b border-border">
                          <span className="font-extrabold text-main">{ind.name} Protocol</span>
                          <button
                            type="button"
                            onClick={() => setActiveTooltip(null)}
                            className="p-1 rounded text-muted hover:text-main cursor-pointer"
                            aria-label="Close tooltip"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div>
                          <strong className="text-brand">What it is: </strong>
                          <span className="text-main">{detail.what}</span>
                        </div>
                        <div>
                          <strong className="text-amber-500">Why in space: </strong>
                          <span className="text-main">{detail.why}</span>
                        </div>
                        <div>
                          <strong className="text-teal-500">How to measure: </strong>
                          <span className="text-main">{detail.how}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTooltip(null)}
                        className="mt-2 w-full py-1.5 bg-brand text-white font-bold text-xs rounded-lg cursor-pointer"
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

        {/* Bottom Split: Routines / Gamification & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Daily Routine Tasks with Gamification & Badges */}
          <div className="lg:col-span-2">
            <RoutineList tasks={routines} points={340} streakDays={7} />
          </div>

          {/* Quick Mission Modules Access */}
          <div className="p-5 rounded-2xl bg-surface border border-border space-y-3">
            <h3 className="font-bold text-base text-main flex items-center gap-2">
              <ShieldAlert size={18} className="text-brand" />
              <span>Deep-Space Tools</span>
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Autonomous modules ensuring flight readiness under 22-minute Earth communication latency.
            </p>

            <div className="space-y-2 pt-1">
              <Link 
                href="/app/radiation"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-surface-alt text-xs font-bold text-main"
              >
                <span>Space Radiation Shelter Tracker</span>
                <ArrowRight size={13} className="text-muted" />
              </Link>
              <Link 
                href="/app/exercise"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-surface-alt text-xs font-bold text-main"
              >
                <span>Countermeasure Exercise Log</span>
                <ArrowRight size={13} className="text-muted" />
              </Link>
              <Link 
                href="/app/reaction-test"
                className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-surface-alt text-xs font-bold text-main"
              >
                <span>Cognitive Vigilance Test</span>
                <ArrowRight size={13} className="text-muted" />
              </Link>
              <Link 
                href="/demo"
                className="flex items-center justify-between p-2.5 rounded-xl border border-brand/30 bg-brand/5 hover:bg-brand/10 text-xs font-bold text-brand"
              >
                <span>7-Step Sol 90 Guided Demo</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
