'use client';

import React, { useState } from 'react';
import { Sliders, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

export function BaselineDemoSection() {
  const [sleepHours, setSleepHours] = useState(5.4);
  const [restingHr, setRestingHr] = useState(76);
  const [comparisonMode, setComparisonMode] = useState<'personal' | 'population'>('personal');

  // Baseline definitions
  // Personal baseline for CDR-01: Sleep = 7.3 h, HR = 62 bpm
  // Population standard: Sleep = 8.0 h, HR = 72 bpm
  const baselineSleep = comparisonMode === 'personal' ? 7.3 : 8.0;
  const baselineHr = comparisonMode === 'personal' ? 62 : 72;

  const sleepDelta = +(sleepHours - baselineSleep).toFixed(1);
  const hrDelta = restingHr - baselineHr;

  // Determine status
  let reason = '';
  let badgeColor = 'bg-[#22c55e] text-white';
  let badgeLabel = 'Normal';
  let Icon = CheckCircle2;

  if (sleepHours < 5.0 || restingHr > 88) {
    badgeLabel = 'Act Now';
    badgeColor = 'bg-[#ef4444] text-white';
    Icon = AlertOctagon;
    reason = `Critical deviation: Severe sleep deficit (${sleepDelta} h) and high resting HR (+${hrDelta} bpm) exceed safe operational margins. Immediate nap protocol required.`;
  } else if (sleepHours < 6.5 || restingHr > 72) {
    badgeLabel = 'Watch';
    badgeColor = 'bg-[#eab308] text-[#172A2B] font-bold';
    Icon = AlertTriangle;
    reason = `Cautionary deviation: Sleep is ${Math.abs(sleepDelta)} h below your established baseline. Resting HR is +${hrDelta} bpm higher. Monitor for cumulative fatigue.`;
  } else {
    badgeLabel = 'Normal';
    badgeColor = 'bg-[#22c55e] text-white';
    Icon = CheckCircle2;
    reason = `All indicators are aligned with your established multi-day baseline. Mission readiness optimal.`;
  }

  return (
    <section className="py-20 sm:py-28 bg-[#F4F6F4] text-[#172A2B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0ED] border border-[#D9E2DE] text-xs font-bold text-[#176B68]">
            <Sliders size={13} />
            <span>Interactive Baseline Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172A2B]">
            Why personal baselines beat generic averages.
          </h2>
          <p className="text-sm sm:text-base text-[#60716E] max-w-xl mx-auto">
            Drag the sliders below to experience how AstroTrack evaluates a single night of telemetry against your individual biometric profile.
          </p>
        </Reveal>

        {/* Elevated Demo Card */}
        <div className="bg-white border border-[#D9E2DE] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          {/* Toggle: Population vs Personal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9E2DE]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60716E] block">
                Evaluation Benchmark
              </span>
              <p className="text-xs text-[#60716E] mt-0.5">
                Switch modes to see how verdict changes with context.
              </p>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]">
              <button
                type="button"
                onClick={() => setComparisonMode('population')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  comparisonMode === 'population'
                    ? 'bg-white text-[#172A2B] shadow-xs'
                    : 'text-[#60716E] hover:text-[#172A2B]'
                }`}
              >
                Population Average (8.0 h / 72 bpm)
              </button>
              <button
                type="button"
                onClick={() => setComparisonMode('personal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  comparisonMode === 'personal'
                    ? 'bg-[#176B68] text-white shadow-xs'
                    : 'text-[#60716E] hover:text-[#172A2B]'
                }`}
              >
                Your Personal Baseline (7.3 h / 62 bpm)
              </button>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Slider 1: Sleep */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <label htmlFor="sleep-slider" className="text-[#172A2B]">Tonight&apos;s Sleep Duration</label>
                <span className="text-lg font-extrabold text-[#176B68]">{sleepHours} h</span>
              </div>
              <input
                id="sleep-slider"
                type="range"
                min="3.0"
                max="9.5"
                step="0.1"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-[#176B68] cursor-pointer h-2 bg-[#EAF0ED] rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-[#60716E]">
                <span>3.0 h (critical deficit)</span>
                <span>Baseline: {baselineSleep} h</span>
                <span>9.5 h (full rest)</span>
              </div>
            </div>

            {/* Slider 2: Resting HR */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <label htmlFor="hr-slider" className="text-[#172A2B]">Resting Heart Rate</label>
                <span className="text-lg font-extrabold text-[#176B68]">{restingHr} bpm</span>
              </div>
              <input
                id="hr-slider"
                type="range"
                min="48"
                max="105"
                step="1"
                value={restingHr}
                onChange={(e) => setRestingHr(parseInt(e.target.value, 10))}
                className="w-full accent-[#176B68] cursor-pointer h-2 bg-[#EAF0ED] rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-[#60716E]">
                <span>48 bpm (athlete)</span>
                <span>Baseline: {baselineHr} bpm</span>
                <span>105 bpm (elevated)</span>
              </div>
            </div>

          </div>

          {/* Real-time Verdict Output */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#D9E2DE] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${badgeColor}`}>
                  <Icon size={14} />
                  <span>{badgeLabel}</span>
                </span>
                <span className="text-xs font-medium text-[#60716E]">
                  Deviation: {sleepDelta > 0 ? `+${sleepDelta}` : sleepDelta} h sleep · {hrDelta > 0 ? `+${hrDelta}` : hrDelta} bpm HR
                </span>
              </div>
              <span className="text-[11px] text-[#60716E] font-medium hidden sm:inline">
                Live Simulator
              </span>
            </div>

            <p className="text-sm text-[#172A2B] font-medium leading-relaxed">
              {reason}
            </p>
          </div>

          <p className="text-center text-[11px] text-[#60716E] italic">
            Illustrative demo logic for demonstration purposes · Not validated medical thresholds
          </p>

        </div>

      </div>
    </section>
  );
}
