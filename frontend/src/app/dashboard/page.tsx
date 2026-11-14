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
  RefreshCw,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from '../../lib/branding';
import { STATUS_COLORS, STATUS_LABEL } from '../../lib/colors';
import { getDashboardSummary, getRoutineTasks } from '../../lib/api';
import type { DashboardSummary, RoutineTask } from '../../lib/types';
import { AppShell } from '../../components/layout/AppShell';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getDashboardSummary(), getRoutineTasks()]).then(([sumData, routData]) => {
      if (mounted) {
        setSummary(sumData);
        setRoutines(routData);
        setLoading(false);
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
    <AppShell>
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
            <span className="text-xs text-muted">Click any indicator to view Recharts historical trends</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {summary?.indicators.map((ind) => {
              const statusColor = STATUS_COLORS[ind.status] || '#6b7280';
              return (
                <Link
                  key={ind.indicator}
                  href={`/readings/${ind.indicator}`}
                  className="group p-4 rounded-2xl bg-surface border border-border hover:border-brand/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        {getIndicatorIcon(ind.indicator)}
                        <span className="font-bold text-sm text-main group-hover:text-brand transition-colors">{ind.name}</span>
                      </div>
                      <span 
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: statusColor }}
                      >
                        {ind.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-main font-mono">{ind.value}</span>
                      <span className="text-xs text-muted font-mono">{ind.unit}</span>
                    </div>

                    <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                      {ind.message}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-brand font-semibold">
                    <span>View Recharts Trend</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Split: Routines / Gamification & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Daily Routine Tasks */}
          <div className="lg:col-span-2 p-5 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand" />
                <h3 className="font-bold text-base text-main">Today&apos;s Health Routine &amp; Compliance</h3>
              </div>
              <Link href="/app/consistency" className="text-xs font-bold text-brand hover:underline">
                View Gamification Badges
              </Link>
            </div>

            <div className="space-y-2.5">
              {routines.map((task) => (
                <div 
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    task.completed 
                      ? 'bg-surface-alt/40 border-border text-muted' 
                      : 'bg-surface border-brand/20 text-main shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                      task.completed ? 'bg-[#22c55e] text-white' : 'border border-border text-transparent'
                    }`}>
                      {task.completed ? '✓' : ''}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${task.completed ? 'line-through text-muted' : 'text-main'}`}>
                        {task.title}
                      </div>
                      <div className="text-[11px] text-muted flex items-center gap-2">
                        <span>{task.category}</span>
                        {task.due_time && <span>· Due {task.due_time}</span>}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    task.completed ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#eab308]/10 text-[#eab308]'
                  }`}>
                    {task.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
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
    </AppShell>
  );
}
