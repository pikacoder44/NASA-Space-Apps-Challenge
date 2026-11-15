'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useHealth } from '../../context/HealthContext';
import { DemoScenarioKey } from '../../services/demoHealthRepository';

export default function GuidedDemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { activeScenario, setScenario } = useHealth();

  const scenarios: { id: DemoScenarioKey; name: string; desc: string }[] = [
    { id: 'day90_yellow', name: 'Sol 90 · Mild Fatigue (Watch)', desc: 'Accumulated 4.2h sleep debt, +19% resting heart rate elevation' },
    { id: 'nominal_green', name: 'Sol 90 · All Normal', desc: 'Full workout adherence, normal resting heart rate, 7.2h sleep' },
    { id: 'insufficient_data', name: 'Sol 90 · Degraded Telemetry Link', desc: 'Sensor gap / communication link awaiting fresh telemetry' }
  ];

  const steps = [
    {
      step: 1,
      title: 'Mission Overview & Crew Context',
      duration: '30 seconds',
      description: 'Introduce the astronaut and deep-space mission context at Sol 90.',
      screenContext: 'The commander (CDR-01) is on Day 90 of interplanetary Mars transit. The overview surfaces an Attention Needed (Yellow) readiness state with explicit, non-opaque reasoning.',
      keyPoints: [
        'Mission day and flight phase clearly displayed in the mission chip.',
        'Overall Health Status immediately shows Yellow with clear explanation.',
        'Preset switcher allows evaluators to test Day 90 Yellow, Nominal Green, or Degraded Link instantaneously.'
      ],
      appLink: '/app',
      linkText: 'Inspect Overview Dashboard'
    },
    {
      step: 2,
      title: 'Personal Baseline Differentiator',
      duration: '30 seconds',
      description: 'Demonstrate how today\'s observation differs from this astronaut\'s normal, not generic Earth tables.',
      screenContext: 'Resting pulse is 74 bpm. On Earth, 74 bpm is normal, but against this astronaut\'s established 62 bpm transit baseline, it represents an abnormal +12 bpm (+19.4%) elevation.',
      keyPoints: [
        'Personal baseline established from 60 transit days of sleep-period data.',
        'Baseline tolerance envelopes prevent false alarms and detect subtle autonomic drift.',
        'Clearly explains: Personal baselines are not universal Earth ranges.'
      ],
      appLink: '/app/indicators/heart_rate',
      linkText: 'Open Resting Heart Rate Detail'
    },
    {
      step: 3,
      title: 'Explainable Multi-System Alert',
      duration: '30 seconds',
      description: 'Show that AAHMS never outputs a mystery score.',
      screenContext: 'The alert explains the multi-system cluster: 3 consecutive nights of sleep deficit (< 6 hrs) correlated synchronously with rising nocturnal pulse and a 22.7% decline in heart rate variability (rMSSD).',
      keyPoints: [
        'Lists exact contributing indicators (Sleep, Heart Rate, HRV, Mood, Stamina).',
        'Transparent magnitude, 3-day duration, and pattern match confidence.',
        'Crew can acknowledge the advisory directly from the interface.'
      ],
      appLink: '/app/alerts',
      linkText: 'Open Alerts & Guidance'
    },
    {
      step: 4,
      title: 'Cautious Operational Countermeasures',
      duration: '30 seconds',
      description: 'Review conservative operational next steps and flight surgeon escalation criteria.',
      screenContext: 'The system does not prescribe unverified drugs or clinical interventions. It suggests scheduling a 45-minute sleep opportunity, inspecting cabin CO2 partial pressure (< 2.5 mmHg), and checking fluid intake.',
      keyPoints: [
        'Flight surgeon escalation boundary is explicitly defined: Not required currently.',
        'Escalation triggers only if resting HR > 95 bpm or sleep deficit persists > 6 consecutive days.',
        'AI clinical interpretation (Gemini via FastAPI) separates measured facts from AI-assisted suggestions.'
      ],
      appLink: '/app/ai-explanation',
      linkText: 'Open Gemini AI Explanation'
    },
    {
      step: 5,
      title: 'Multi-Horizon Trends & Radiation Dosimetry',
      duration: '30 seconds',
      description: 'Inspect 7-day, 30-day, and full-mission trends alongside cumulative cosmic radiation.',
      screenContext: 'Recharts visualizations plot the drop in sleep and rise in pulse. Missing telemetry is preserved with visible gaps rather than misleading continuous interpolation.',
      keyPoints: [
        'Range selectors for 7D, 30D, and full 90-day mission.',
        'Accessible data table toggle for complete screen-reader compatibility.',
        'Radiation tracker monitors 1.45 mSv/day cruise rate (130.5 mSv total) referenced against NASA career limits.'
      ],
      appLink: '/app/trends',
      linkText: 'Explore Health Trends'
    },
    {
      step: 6,
      title: 'Built for Offline & Ground Downlink',
      duration: '30 seconds',
      description: 'Show honest local retention and DSN synchronization without fake sync claims.',
      screenContext: 'The app works completely offline in local storage. When communication passes open, telemetry packages are queued for ground downlink.',
      keyPoints: [
        'Local demo persistence retains check-ins, manual tests, and workout logs.',
        'Downlink simulation reflects real speed-of-light delays.',
        'Flight Surgeon ground briefing exportable in standard JSON.'
      ],
      appLink: '/app/log',
      linkText: 'Inspect Mission Log & DSN Sync'
    },
    {
      step: 7,
      title: 'Medical Trust, Ethical Streaks & Limits',
      duration: '30 seconds',
      description: 'Ethical gamification and responsible medical prototype boundaries.',
      screenContext: 'Check-in streaks and points reward daily logging discipline and SOP guide education, NEVER good health or Green scores.',
      keyPoints: [
        'Astronauts are never penalized for reporting fatigue, symptoms, or Yellow/Red states.',
        'Clear Simulated Prototype Data labels throughout.',
        'Interactive Psychomotor Vigilance Test (PVT) available for cognitive alertness assessment.'
      ],
      appLink: '/app/consistency',
      linkText: 'View Consistency & Streaks'
    }
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-[#172A2B]">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-[#D9E2DE]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
            Evaluator Walkthrough
          </span>
          <span className="text-xs text-[#60716E]">
            3-Minute Structured Review Flow
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tracking-tight">
          AAHMS Day 90 Mars Demonstration Walkthrough
        </h1>
        <p className="text-sm text-[#60716E]">
          Follow this 7-step guided journey designed for hackathon evaluators to review the primary challenge requirements.
        </p>
      </div>

      {/* Scenario Switcher Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#172A2B]">
            <SlidersHorizontal size={15} className="text-[#176B68]" />
            <span>Interactive Flight Scenario:</span>
          </div>
          <span className="text-xs text-[#60716E]">Currently testing Sol 90 dataset</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {scenarios.map((sc) => {
            const isSelected = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => setScenario(sc.id)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#176B68] bg-[#DCEDEA]/40 shadow-xs'
                    : 'border-[#D9E2DE] hover:bg-[#F4F6F4]'
                }`}
              >
                <div className="text-xs font-bold text-[#172A2B] truncate">{sc.name}</div>
                <div className="text-[11px] text-[#60716E] line-clamp-1">{sc.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#60716E]">
          <span>Step {currentStep} of {steps.length}: {current.title}</span>
          <span className="text-[#176B68]">{current.duration}</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {steps.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                s.step === currentStep
                  ? 'bg-[#176B68]'
                  : s.step < currentStep
                  ? 'bg-[#247A55]'
                  : 'bg-[#D9E2DE]'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Step Card Content */}
      <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
          <div>
            <span className="text-xs font-bold text-[#176B68] uppercase tracking-wider">
              Phase {current.step} / 7
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172A2B] mt-0.5">
              {current.title}
            </h2>
          </div>
          <StatusBadge status={currentStep === 1 || currentStep === 3 ? 'yellow' : 'green'} size="md" />
        </div>

        <p className="text-sm sm:text-base font-semibold text-[#172A2B] leading-relaxed">
          {current.description}
        </p>

        {/* Screen Context Box */}
        <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] text-xs sm:text-sm text-[#172A2B] space-y-1">
          <strong className="text-[#176B68] block uppercase text-xs">Mission Scenario Context:</strong>
          <p className="leading-relaxed text-[#60716E]">{current.screenContext}</p>
        </div>

        {/* Key Verification Points */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase font-bold text-[#60716E] tracking-wider">
            Evaluation Criteria to Verify:
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-[#172A2B]">
            {current.keyPoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#247A55] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deep Link to Live App Feature */}
        <div className="pt-4 border-t border-[#D9E2DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href={current.appLink}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all shadow-xs"
          >
            <span>{current.linkText}</span>
            <ArrowRight size={14} />
          </Link>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              className="px-3 py-2 rounded-lg border border-[#D9E2DE] text-xs font-semibold hover:bg-[#F4F6F4] disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={13} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentStep === steps.length}
              onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
              className="px-4 py-2 rounded-lg bg-[#172A2B] text-white text-xs font-bold hover:bg-[#28494F] disabled:opacity-40 cursor-pointer flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
