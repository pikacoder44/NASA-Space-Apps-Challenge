'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, Gauge, Thermometer, Droplets, Moon, Smile, ChevronRight, TrendingUp } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

interface IndicatorRow {
  key: string;
  name: string;
  unit: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  captured: string;
  spaceflightRelevance: string;
  expandedDetail: string;
  nominalRange: string;
  sparklinePath: string;
  statusLevel: 'normal' | 'warning';
}

const INDICATORS: IndicatorRow[] = [
  {
    key: 'heart_rate',
    name: 'Resting Heart Rate',
    unit: 'bpm',
    icon: Activity,
    captured: 'Optical plethysmography sensor or manual pulse check',
    spaceflightRelevance: 'Tracks cardiovascular deconditioning & autonomic parasympathetic tone shifts in zero-G.',
    expandedDetail: 'Fluid shifts reduce blood volume by 10-15%. An elevated resting HR signals compensation for decreased stroke volume or rising cumulative fatigue.',
    nominalRange: '60–100 bpm (crew baseline: ~62 bpm)',
    sparklinePath: 'M0 20 Q15 18 30 15 T60 22 T90 12 T120 18',
    statusLevel: 'warning'
  },
  {
    key: 'blood_pressure',
    name: 'Blood Pressure (Sys / Dia)',
    unit: 'mmHg',
    icon: Gauge,
    captured: 'In-habitat arterial cuff sensor with Bluetooth export',
    spaceflightRelevance: 'Monitors cephalic vascular resistance and prevents post-landing orthostatic intolerance.',
    expandedDetail: 'Without hydrostatic gravity gradients, central venous pressure shifts upward. Sustained shifts indicate altered baroreceptor sensitivity.',
    nominalRange: '110/70 – 128/82 mmHg',
    sparklinePath: 'M0 16 Q20 14 40 18 T80 15 T120 16',
    statusLevel: 'normal'
  },
  {
    key: 'body_temperature',
    name: 'Core Body Temperature',
    unit: '°C',
    icon: Thermometer,
    captured: 'Tympanic infrared thermometer or skin sensor',
    spaceflightRelevance: 'Detects "space fever" — baseline elevation caused by altered sweat evaporation in microgravity.',
    expandedDetail: 'Heat dissipation is less efficient in weightlessness due to absent natural convection currents. Astronauts run ~1°C warmer during exercise.',
    nominalRange: '36.5 – 37.5 °C',
    sparklinePath: 'M0 18 Q30 18 60 16 T120 18',
    statusLevel: 'normal'
  },
  {
    key: 'blood_glucose',
    name: 'Blood Glucose',
    unit: 'mg/dL',
    icon: Droplets,
    captured: 'Enzymatic capillary blood test strip',
    spaceflightRelevance: 'Tracks metabolic insulin sensitivity and closed-environment dietary stability.',
    expandedDetail: 'Extended confinement and altered muscle metabolism can induce mild insulin resistance during prolonged planetary voyages.',
    nominalRange: '70 – 110 mg/dL (fasting)',
    sparklinePath: 'M0 16 Q30 12 60 18 T120 14',
    statusLevel: 'normal'
  },
  {
    key: 'sleep',
    name: 'Sleep Duration & Quality',
    unit: 'hours',
    icon: Moon,
    captured: 'Crew quarters actigraphy or morning self-log',
    spaceflightRelevance: 'Circadian disruption from artificial 90-minute orbital days causes cumulative cognitive impairment.',
    expandedDetail: 'Sleep deficits below 6 hours directly correlate with slower reaction times, higher error rates in docking sims, and immune depression.',
    nominalRange: '7.0 – 8.5 hours (target: 7.5 h)',
    sparklinePath: 'M0 12 Q30 14 60 22 T90 26 T120 28',
    statusLevel: 'warning'
  },
  {
    key: 'mood',
    name: 'Subjective Mood & Stress',
    unit: '1–10 scale',
    icon: Smile,
    captured: 'Rapid 1-tap validated operational visual analogue scale',
    spaceflightRelevance: 'Primary metric for behavioral health, psychosocial cohesion, and isolation coping.',
    expandedDetail: 'A drop in self-reported wellbeing is often the earliest signal of mission fatigue before physical decompensation manifests.',
    nominalRange: '7 – 10 points nominal',
    sparklinePath: 'M0 14 Q30 16 60 18 T90 24 T120 22',
    statusLevel: 'warning'
  }
];

export function IndicatorsListSection() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (key: string) => {
    setExpandedRow(prev => (prev === key ? null : key));
  };

  return (
    <section id="indicators" className="py-24 sm:py-32 bg-white text-[#172A2B] border-t border-[#D9E2DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#176B68] uppercase">
              04 — Clinical Signals
            </span>
            <div className="w-12 h-px bg-[#D9E2DE]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#172A2B]">
                Six signals the challenge asks crews to track.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#60716E] max-w-2xl leading-relaxed">
                Carefully selected non-invasive metrics designed for rapid daily self-logging without bulky laboratory apparatus.
              </p>
            </div>
            <Link
              href="/readings/new"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#176B68] hover:text-[#125553] shrink-0"
            >
              <span>Record a reading</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </Reveal>

        {/* Editorial Wide List (Not generic cards) */}
        <div className="mt-12 border-t border-[#D9E2DE]">
          {INDICATORS.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedRow === item.key;
            return (
              <div
                key={item.key}
                onClick={() => toggleRow(item.key)}
                className={`border-b border-[#D9E2DE] py-5 px-3 sm:px-5 transition-colors cursor-pointer ${
                  isExpanded ? 'bg-[#F4F6F4]' : 'hover:bg-[#F8FAFC]'
                }`}
              >
                {/* Main Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Metric Name & Icon (5/12) */}
                  <div className="sm:col-span-5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF0ED] text-[#176B68] flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#172A2B]">
                          {item.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded font-semibold bg-[#EAF0ED] text-[#60716E]">
                          {item.unit}
                        </span>
                      </div>
                      <p className="text-xs text-[#60716E] truncate max-w-xs sm:max-w-sm mt-0.5">
                        {item.captured}
                      </p>
                    </div>
                  </div>

                  {/* Spaceflight Importance (4/12) */}
                  <div className="sm:col-span-4 hidden md:block">
                    <p className="text-xs text-[#172A2B] leading-relaxed line-clamp-2">
                      {item.spaceflightRelevance}
                    </p>
                  </div>

                  {/* Sparkline & Action (3/12) */}
                  <div className="sm:col-span-3 flex items-center justify-end gap-4">
                    {/* SVG Sparkline */}
                    <div className="w-24 h-8 flex items-center">
                      <svg viewBox="0 0 120 32" className="w-full h-full overflow-visible">
                        <path
                          d={item.sparklinePath}
                          fill="none"
                          stroke={item.statusLevel === 'warning' ? '#EAB308' : '#176B68'}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <span className="text-xs font-semibold text-[#176B68] flex items-center gap-0.5">
                      {isExpanded ? 'Hide' : 'Details'}
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </span>
                  </div>

                </div>

                {/* Expanded Drawer Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#D9E2DE]/60 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs animate-in fade-in duration-200">
                    <div className="md:col-span-8 space-y-2">
                      <span className="font-bold text-[#176B68] uppercase tracking-wider block">
                        Spaceflight Pathophysiology
                      </span>
                      <p className="text-sm text-[#172A2B] leading-relaxed">
                        {item.expandedDetail}
                      </p>
                      <div className="flex items-center gap-4 pt-1 text-[#60716E]">
                        <span>Baseline Nominal: <strong className="text-[#172A2B]">{item.nominalRange}</strong></span>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex items-end justify-start md:justify-end">
                      <Link
                        href={`/readings/${item.key}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#176B68] text-white font-bold text-xs hover:bg-[#135754] shadow-xs transition-colors"
                      >
                        <TrendingUp size={13} />
                        <span>View Recharts Trend</span>
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
