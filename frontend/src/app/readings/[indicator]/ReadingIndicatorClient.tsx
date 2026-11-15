'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Activity, 
  Calendar, 
  Info, 
  TrendingUp, 
  TrendingDown,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { getReadings } from '../../../lib/api';
import { STATUS_COLORS } from '../../../lib/colors';
import type { Indicator, Reading } from '../../../lib/types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceArea, 
  CartesianGrid 
} from 'recharts';

interface Props {
  indicatorKey: Indicator;
}

const INDICATOR_METADATA: Record<Indicator, { name: string; unit: string; normal: [number, number]; warning: [number, number]; desc: string }> = {
  heart_rate: {
    name: 'Heart Rate',
    unit: 'bpm',
    normal: [60, 100],
    warning: [50, 120],
    desc: 'Resting pulse monitored for cardiovascular deconditioning in microgravity.'
  },
  blood_pressure_systolic: {
    name: 'Systolic Blood Pressure',
    unit: 'mmHg',
    normal: [90, 120],
    warning: [80, 140],
    desc: 'Peak arterial pressure during cardiac contraction.'
  },
  blood_pressure_diastolic: {
    name: 'Diastolic Blood Pressure',
    unit: 'mmHg',
    normal: [60, 80],
    warning: [50, 90],
    desc: 'Minimum arterial pressure during resting cardiac phase.'
  },
  body_temp: {
    name: 'Core Body Temperature',
    unit: '°C',
    normal: [36.1, 37.2],
    warning: [35.5, 38.0],
    desc: 'Thermoregulatory circadian cycle tracking to prevent space fever.'
  },
  blood_sugar: {
    name: 'Blood Glucose',
    unit: 'mg/dL',
    normal: [70, 140],
    warning: [60, 180],
    desc: 'Capillary glucose monitored for metabolic stability, insulin resistance, and nutrition management in spaceflight.'
  },
  sleep_hours: {
    name: 'Sleep Duration',
    unit: 'hours',
    normal: [7.0, 9.0],
    warning: [6.0, 10.0],
    desc: 'Rest recovery ensuring cognitive resilience and reaction speed.'
  },
  mood_score: {
    name: 'Subjective Well-being',
    unit: '1-10',
    normal: [6, 10],
    warning: [4, 10],
    desc: 'Psychological assessment of astronaut morale during confinement.'
  }
};

export default function ReadingIndicatorClient({ indicatorKey }: Props) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [readings, setReadings] = useState<Reading[]>([]);

  const meta = INDICATOR_METADATA[indicatorKey] || {
    name: indicatorKey,
    unit: '',
    normal: [60, 100],
    warning: [50, 120],
    desc: 'Physiological monitoring telemetry.'
  };

  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

  useEffect(() => {
    let mounted = true;
    getReadings(indicatorKey, days).then((data) => {
      if (mounted) {
        setReadings(data);
      }
    });
    return () => { mounted = false; };
  }, [indicatorKey, days]);

  const latestVal = readings.length > 0 ? readings[readings.length - 1].value : 0;

  const chartData = readings.map((r) => ({
    time: new Date(r.measured_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    value: r.value,
    status: r.status,
    measured_at: r.measured_at
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-main transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/readings/new"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand text-white hover:bg-brand-hover shadow-xs"
            >
              <PlusCircle size={14} />
              <span>Log Reading</span>
            </Link>
          </div>
        </div>

        {/* Header Strip */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand uppercase tracking-wider">
                Telemetry Analytics
              </span>
              <span className="text-xs text-muted font-mono">RECHARTS ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main mt-1 tracking-tight">
              {meta.name}
            </h1>
            <p className="text-xs text-muted mt-0.5">{meta.desc}</p>
          </div>

          <div className="flex items-baseline gap-2 bg-surface-alt/60 p-4 rounded-xl border border-border">
            <span className="text-xs text-muted font-semibold">Latest:</span>
            <span className="text-3xl font-mono font-extrabold text-main">{latestVal}</span>
            <span className="text-xs text-muted font-mono">{meta.unit}</span>
          </div>
        </div>

        {/* Trend Chart Card with Threshold Bands */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-main">Historical Longitudinal Trend</h2>
              <div className="text-xs text-muted flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" /> Normal ({meta.normal[0]}–{meta.normal[1]})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" /> Warning ({meta.warning[0]}–{meta.warning[1]})
                </span>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center p-1 rounded-xl bg-surface-alt border border-border self-start sm:self-auto">
              {(['7d', '30d', 'all'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeRange === r 
                      ? 'bg-surface text-brand shadow-xs' 
                      : 'text-muted hover:text-main'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Container */}
          <div className="h-[340px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" stroke="#60716E" fontSize={11} tickLine={false} />
                <YAxis 
                  stroke="#60716E" 
                  fontSize={11} 
                  tickLine={false}
                  domain={[meta.warning[0] - 10, meta.warning[1] + 10]}
                />
                
                {/* Horizontal Normal Band */}
                <ReferenceArea 
                  y1={meta.normal[0]} 
                  y2={meta.normal[1]} 
                  fill="#22c55e" 
                  fillOpacity={0.08} 
                />

                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const statusColor = STATUS_COLORS[data.status as 'normal' | 'warning' | 'critical'] || '#22c55e';
                      return (
                        <div className="p-3 rounded-xl bg-surface border border-border shadow-lg space-y-1">
                          <div className="text-[11px] font-mono text-muted">{data.time}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-main font-mono">
                              {data.value} {meta.unit}
                            </span>
                            <span 
                              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white"
                              style={{ backgroundColor: statusColor }}
                            >
                              {String(data.status).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#176B68"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#176B68' }}
                  activeDot={{ r: 6, fill: '#176B68' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Space Clinical Interpretation */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-brand font-bold text-sm">
            <Sparkles size={16} />
            <span>NASA Human Research Program Medical Insights</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Longitudinal trending accounts for microgravity cardiovascular adaptation. Gradual upward or downward drift triggers automated telemetry notifications before acute symptomatic thresholds are reached.
          </p>
        </div>
      </div>
  );
}
