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
  const [selectedSolIndex, setSelectedSolIndex] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const shouldReduceMotion = usePrefersReducedMotion();

  const current = TIMELINE_DATA[selectedSolIndex];

  useEffect(() => {
    if (!isPlaying || shouldReduceMotion) return;
    const interval = setInterval(() => {
      setSelectedSolIndex((prev) => (prev >= TIMELINE_DATA.length - 1 ? 0 : prev + 1));
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying, shouldReduceMotion]);

  return (
    <section id="scenario" className="relative py-20 sm:py-28 bg-[#12343B] text-white overflow-hidden">
      {/* Background Mars Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nasa/mars-curiosity-sol.jpg"
          alt="Mars surface panoramic terrain captured by NASA Curiosity rover"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12343B] via-[#12343B]/80 to-[#12343B]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-[#F2A65A]">
              05 — Walkthrough scenario
            </span>
            <div className="w-10 h-px bg-[#1B4B52]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Sol 84 → Sol 90: How a subtle shift unfolds.
              </h2>
              <p className="mt-2 text-base text-white/85 max-w-2xl leading-relaxed">
                Acute medical crises are rare. Cumulative sleep debt and rising resting pulse develop quietly over days. Scrub the timeline to watch AstroTrack detect the drift.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F2A65A] text-[#172A2B] font-bold text-sm hover:bg-[#E09448] shadow-md transition-all active:scale-[0.98] shrink-0"
            >
              <span>Open demo cockpit</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        {/* Timeline Scrubber Container */}
        <div className="mt-10 bg-[#1B4B52]/90 backdrop-blur-md border border-[#3FB6A8]/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Stepper Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">
                Select mission sol:
              </span>
              
              {!shouldReduceMotion && (
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#12343B] hover:bg-[#12343B]/80 border border-white/20 text-white cursor-pointer"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
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
                    className={`p-2 sm:p-3 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#F2A65A] text-[#172A2B] border-[#F2A65A] font-bold shadow-md'
                        : item.status === 'watch'
                        ? 'bg-[#12343B] text-[#F2A65A] border-[#F2A65A]/40 hover:bg-[#12343B]/80'
                        : 'bg-[#12343B] text-white/80 border-white/10 hover:bg-[#12343B]/80'
                    }`}
                  >
                    <span className="block text-xs opacity-75">Sol</span>
                    <span className="block text-sm sm:text-base font-bold">{item.sol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetry Display for Selected Sol */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-4 border-t border-white/15">
            
            {/* Vitals (5/12) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              
              {/* Sleep Box */}
              <div className="p-3.5 rounded-xl bg-[#12343B] border border-white/10 space-y-1">
                <span className="text-xs text-white/70 font-medium">Sleep duration</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{current.sleep}</span>
                  <span className="text-xs text-white/60">hours</span>
                </div>
                <span className={`text-xs font-semibold block ${current.sleep < 6 ? 'text-[#F2A65A]' : 'text-[#3FB6A8]'}`}>
                  {current.sleep < 6 ? `${(current.sleep - 7.3).toFixed(1)} h deficit` : 'Nominal baseline'}
                </span>
              </div>

              {/* Heart Rate Box */}
              <div className="p-3.5 rounded-xl bg-[#12343B] border border-white/10 space-y-1">
                <span className="text-xs text-white/70 font-medium">Resting heart rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{current.hr}</span>
                  <span className="text-xs text-white/60">bpm</span>
                </div>
                <span className={`text-xs font-semibold block ${current.hr > 68 ? 'text-[#F2A65A]' : 'text-[#3FB6A8]'}`}>
                  {current.hr > 68 ? `+${current.hr - 62} bpm elevation` : 'Nominal 62 bpm'}
                </span>
              </div>

            </div>

            {/* Narrative & Status Assessment (7/12) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${
                    current.status === 'watch'
                      ? 'bg-[#eab308] text-[#172A2B]'
                      : 'bg-[#22c55e] text-white'
                  }`}
                >
                  {current.status === 'watch' ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  <span>{current.status === 'watch' ? 'Watch status' : 'Nominal green'}</span>
                </span>
                <span className="text-xs text-white/70">
                  Telemetry evaluation for Sol {current.sol}
                </span>
              </div>

              <p className="text-sm text-white/90 leading-relaxed">
                {current.notes}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
