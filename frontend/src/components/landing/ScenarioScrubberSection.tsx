'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Reveal, usePrefersReducedMotion } from '../motion/MotionHelpers';

interface SolData {
  sol: number;
  sleep: number;
  hr: number;
  status: 'normal' | 'watch';
  notes: string;
}

const TIMELINE_DATA: SolData[] = [
  { sol: 84, sleep: 7.4, hr: 62, status: 'normal', notes: 'Nominal deep space cruise. Full sleep cycle, resting HR at baseline target.' },
  { sol: 85, sleep: 7.2, hr: 63, status: 'normal', notes: 'Routine operations. Baseline within nominal green bounds.' },
  { sol: 86, sleep: 6.8, hr: 64, status: 'normal', notes: 'Late telemetry log. Minor sleep reduction, autonomic markers stable.' },
  { sol: 87, sleep: 6.2, hr: 67, status: 'normal', notes: 'Night equipment alarm causes interrupted sleep. Mild nocturnal HR rise.' },
  { sol: 88, sleep: 5.8, hr: 70, status: 'watch', notes: 'Second consecutive short night. Cumulative sleep deficit starts accumulating.' },
  { sol: 89, sleep: 5.4, hr: 73, status: 'watch', notes: 'Elevated sympathetic tone. Resting pulse +11 bpm above baseline.' },
  { sol: 90, sleep: 5.2, hr: 75, status: 'watch', notes: 'Watch status triggered: 4-day sleep deficit (-2.1 h) with sustained HR elevation (+13 bpm).' },
];

export function ScenarioScrubberSection() {
  const [selectedSolIndex, setSelectedSolIndex] = useState(6); // Default Sol 90
  const [isPlaying, setIsPlaying] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();

  const current = TIMELINE_DATA[selectedSolIndex];

  // Auto-scrubber player
  useEffect(() => {
    if (!isPlaying || shouldReduceMotion) return;
    const interval = setInterval(() => {
      setSelectedSolIndex((prev) => (prev >= TIMELINE_DATA.length - 1 ? 0 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, shouldReduceMotion]);

  return (
    <section id="scenario" className="relative py-24 sm:py-32 bg-[#0A1A1F] text-white overflow-hidden">
      {/* Background Mars Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nasa/mars-curiosity-sol.jpg"
          alt="Mars surface panoramic terrain captured by NASA Curiosity rover"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A1F] via-[#0A1A1F]/80 to-[#0A1A1F]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#F2A65A] uppercase">
              05 — Walkthrough Scenario
            </span>
            <div className="w-12 h-px bg-[#234954]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Sol 84 → Sol 90: How a subtle shift unfolds.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#C0D1CE] max-w-2xl leading-relaxed">
                Acute medical crises are rare. Cumulative sleep debt and rising resting pulse develop quietly over days. Scrub the timeline to watch AstroTrack detect the drift.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2A65A] text-[#172A2B] font-bold text-sm hover:bg-[#E09448] shadow-md transition-all active:scale-[0.98] shrink-0"
            >
              <span>Open Demo Cockpit</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        {/* Timeline Scrubber Container */}
        <div className="mt-12 bg-[#0F2A30]/90 backdrop-blur-md border border-[#234954] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Stepper Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A2BEB9]">
                Select Mission Day
              </span>
              
              {!shouldReduceMotion && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#182C30] hover:bg-[#1E373C] border border-[#234954] text-[#EAF0ED] cursor-pointer"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? 'Pause Playback' : 'Autoplay Timeline'}</span>
                </button>
              )}
            </div>

            {/* Stepper Pills */}
            <div className="grid grid-cols-7 gap-2">
              {TIMELINE_DATA.map((item, index) => {
                const isSelected = selectedSolIndex === index;
                return (
                  <button
                    key={item.sol}
                    type="button"
                    onClick={() => {
                      setSelectedSolIndex(index);
                      setIsPlaying(false);
                    }}
                    className={`p-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#F2A65A] text-[#172A2B] border-[#F2A65A] font-extrabold shadow-md scale-105'
                        : item.status === 'watch'
                        ? 'bg-[#0A1A1F] text-[#F2A65A] border-[#A96617]/50 hover:bg-[#182C30]'
                        : 'bg-[#0A1A1F] text-[#C0D1CE] border-[#234954] hover:bg-[#182C30]'
                    }`}
                  >
                    <span className="block text-[11px] font-medium opacity-80">Day</span>
                    <span className="block text-sm sm:text-base font-bold">Sol {item.sol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetry Display for Selected Sol */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 border-t border-[#234954]">
            
            {/* Vitals Gauges (5/12) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              
              {/* Sleep Box */}
              <div className="p-4 rounded-2xl bg-[#0A1A1F] border border-[#234954] space-y-1">
                <span className="text-xs text-[#A2BEB9] font-medium">Sleep Duration</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{current.sleep}</span>
                  <span className="text-xs text-[#829994]">hours</span>
                </div>
                <span className={`text-[11px] font-semibold block ${current.sleep < 6 ? 'text-[#F2A65A]' : 'text-[#3FB6A8]'}`}>
                  {current.sleep < 6 ? `${(current.sleep - 7.3).toFixed(1)} h deficit` : 'Within baseline'}
                </span>
              </div>

              {/* Heart Rate Box */}
              <div className="p-4 rounded-2xl bg-[#0A1A1F] border border-[#234954] space-y-1">
                <span className="text-xs text-[#A2BEB9] font-medium">Resting Heart Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{current.hr}</span>
                  <span className="text-xs text-[#829994]">bpm</span>
                </div>
                <span className={`text-[11px] font-semibold block ${current.hr > 68 ? 'text-[#F2A65A]' : 'text-[#3FB6A8]'}`}>
                  {current.hr > 68 ? `+${current.hr - 62} bpm elevation` : 'Nominal 62 bpm'}
                </span>
              </div>

            </div>

            {/* Narrative & Status Assessment (7/12) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                    current.status === 'watch'
                      ? 'bg-[#eab308] text-[#172A2B]'
                      : 'bg-[#22c55e] text-white'
                  }`}
                >
                  {current.status === 'watch' ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  <span>{current.status === 'watch' ? 'Watch Status' : 'Nominal Green'}</span>
                </span>
                <span className="text-xs text-[#A2BEB9]">
                  Trajectory Evaluation for Mission Commander
                </span>
              </div>

              <p className="text-sm sm:text-base text-white leading-relaxed">
                {current.notes}
              </p>

              {current.status === 'watch' && (
                <div className="p-3.5 rounded-xl bg-[#122B31] border border-[#A96617]/50 text-xs text-[#F2A65A]">
                  <strong>Autonomous Action:</strong> Sleep recovery nap recommended; acoustic sleep berth review scheduled before Sol 91 EVA.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
