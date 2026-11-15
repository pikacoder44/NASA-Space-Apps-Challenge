'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, GitCompare, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

const STEPS = [
  {
    step: '01',
    title: 'Log',
    subtitle: 'Under 60 seconds daily',
    description: 'Astronauts log six vital signs using touch-optimized inputs with inline units and range validation. Works completely offline on the crew tablet.',
    icon: CheckSquare,
    previewTitle: 'Daily Telemetry Ingestion',
    badge: 'Step 1: Input',
    previewContent: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white border border-[#D9E2DE]">
            <span className="text-[11px] text-[#60716E] font-medium block">Resting Heart Rate</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-[#172A2B]">75</span>
              <span className="text-xs text-[#60716E]">bpm</span>
            </div>
            <span className="text-[10px] text-[#247A55] font-semibold block mt-1">Valid range: 40–180</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#D9E2DE]">
            <span className="text-[11px] text-[#60716E] font-medium block">Sleep Duration</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-[#172A2B]">5.2</span>
              <span className="text-xs text-[#60716E]">hrs</span>
            </div>
            <span className="text-[10px] text-[#A96617] font-semibold block mt-1">Under target (7.3 h)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#EAF0ED] border border-[#D9E2DE] text-xs text-[#176B68] flex items-center justify-between">
          <span className="font-semibold">Local Storage Saved · Instant Preview Ready</span>
          <span className="px-2 py-0.5 rounded-full bg-[#176B68] text-white text-[10px] font-bold">Fast</span>
        </div>
      </div>
    )
  },
  {
    step: '02',
    title: 'Compare',
    subtitle: 'Personal baseline vs population',
    description: 'Every observation is evaluated against your own 80-day pre-flight and transit baseline — not generic population averages that fail in microgravity.',
    icon: GitCompare,
    previewTitle: 'Multi-Day Baseline Differential',
    badge: 'Step 2: Analysis',
    previewContent: (
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-white border border-[#D9E2DE] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#172A2B]">Sleep Baseline vs Observation</span>
            <span className="font-semibold text-[#A96617]">-2.1 h deficit</span>
          </div>
          
          {/* Progress comparison bar */}
          <div className="space-y-1">
            <div className="h-3 w-full bg-[#EAF0ED] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#176B68]" style={{ width: '71%' }} title="Today: 5.2 h" />
              <div className="h-full bg-[#EED8A7]" style={{ width: '29%' }} title="Deficit: 2.1 h" />
            </div>
            <div className="flex justify-between text-[11px] text-[#60716E]">
              <span>5.2 h recorded</span>
              <span>7.3 h baseline threshold</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FBF0D9] border border-[#EED8A7] text-xs text-[#8A520F]">
          <p className="font-semibold">Cumulative 4-night sleep deficit detected (6.8 h total).</p>
        </div>
      </div>
    )
  },
  {
    step: '03',
    title: 'Understand',
    subtitle: 'FastAPI Clinical Decision Engine',
    description: 'When connected to the habitat gateway, our FastAPI backend generates concise, plain-language clinical synthesis. Clear offline fallbacks are shown when unlinked.',
    icon: Sparkles,
    previewTitle: 'Clinical Telemetry Synthesis',
    badge: 'Step 3: Reasoning',
    previewContent: (
      <div className="p-4 rounded-xl bg-white border border-[#D9E2DE] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#176B68]">
          <Sparkles size={14} />
          <span>Automated Clinical Assistant (via FastAPI)</span>
        </div>
        <p className="text-xs text-[#172A2B] leading-relaxed">
          &ldquo;Based on your 4-day telemetry, your rising nocturnal heart rate (+13 bpm) and declining sleep duration reflect cumulative operational fatigue rather than acute medical illness.&rdquo;
        </p>
        <div className="flex items-center justify-between text-[11px] text-[#60716E] pt-1 border-t border-[#EAF0ED]">
          <span>Telemetry confidence: High</span>
          <span className="text-[#176B68] font-semibold">Pre-computed demo synthesis</span>
        </div>
      </div>
    )
  },
  {
    step: '04',
    title: 'Act',
    subtitle: 'Targeted countermeasures',
    description: 'The cockpit surfaces immediate operational countermeasures and flight surgeon protocols tailored to mission timeline constraints.',
    icon: ShieldCheck,
    previewTitle: 'Actionable Protocols',
    badge: 'Step 4: Countermeasure',
    previewContent: (
      <div className="space-y-3">
        <div className="p-4 rounded-xl bg-[#E4F2E9] border border-[#BDE0CB] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#247A55]">
            <CheckCircle2 size={16} />
            <span>Recommended Operational Countermeasure</span>
          </div>
          <p className="text-xs text-[#172A2B] leading-relaxed">
            Review sleep berth acoustic insulation and schedule a 45-minute sleep recovery extension before scheduled EVA activity.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white border border-[#D9E2DE] flex items-center justify-between text-xs">
          <span className="text-[#60716E]">Ground Escalation: <strong className="text-[#172A2B]">Not required</strong></span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#EAF0ED] text-[#176B68]">In-Flight Manageable</span>
        </div>
      </div>
    )
  }
];

export function HowItWorksSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#F4F6F4] text-[#172A2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#176B68] uppercase">
              03 — System Architecture
            </span>
            <div className="w-12 h-px bg-[#D9E2DE]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#172A2B]">
            Monitor. Understand. Assess. Act.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#60716E] max-w-2xl leading-relaxed">
            A continuous four-stage pipeline engineered to keep an exhausted crew member in control within seconds.
          </p>
        </Reveal>

        {/* Step Selector Card */}
        <div className="mt-12 bg-white border border-[#D9E2DE] rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Step Rail & Buttons (5/12) */}
            <div className="lg:col-span-5 space-y-3">
              {STEPS.map((item, index) => {
                const isActive = activeStepIndex === index;
                const Icon = item.icon;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setActiveStepIndex(index)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-[#176B68] text-white shadow-md'
                        : 'hover:bg-[#EAF0ED] text-[#172A2B]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#EAF0ED] text-[#176B68]'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${isActive ? 'text-[#F2A65A]' : 'text-[#60716E]'}`}>
                          STEP {item.step}
                        </span>
                        <h3 className="text-base font-bold truncate">
                          {item.title}
                        </h3>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-[#EAF0ED]' : 'text-[#60716E]'}`}>
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="self-center">
                      <ArrowRight size={16} className={`transition-transform ${isActive ? 'text-white translate-x-1' : 'opacity-0'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Live Interactive Component Preview (7/12) */}
            <div className="lg:col-span-7">
              <div className="bg-[#F4F6F4] border border-[#D9E2DE] rounded-2xl p-6 sm:p-8 space-y-6">
                
                {/* Step header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
                  <div>
                    <span className="text-xs font-bold text-[#176B68] uppercase tracking-wider">
                      {activeStep.badge}
                    </span>
                    <h4 className="text-xl font-bold text-[#172A2B] mt-0.5">
                      {activeStep.previewTitle}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#D9E2DE] text-[#60716E]">
                    Interactive Preview
                  </span>
                </div>

                <p className="text-sm text-[#60716E] leading-relaxed">
                  {activeStep.description}
                </p>

                {/* Animated Component Preview */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep.step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {activeStep.previewContent}
                  </motion.div>
                </AnimatePresence>

              </div>
            </div>

          </div>

          {/* Bottom Progress Bar */}
          <div className="mt-8 pt-6 border-t border-[#D9E2DE] flex items-center justify-between text-xs text-[#60716E]">
            <div className="flex items-center gap-1.5 font-semibold text-[#176B68]">
              <Clock size={14} />
              <span>Full check-in cycle: ~45 seconds</span>
            </div>
            <span>Step {activeStepIndex + 1} of 4</span>
          </div>

        </div>

      </div>
    </section>
  );
}
