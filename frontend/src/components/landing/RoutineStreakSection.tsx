'use client';

import React from 'react';
import { Award, Flame, CheckCircle, Zap } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

export function RoutineStreakSection() {
  return (
    <section className="py-20 bg-white text-[#172A2B] border-t border-[#D9E2DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text (5/12) */}
          <div className="lg:col-span-5 space-y-4">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-[#176B68] uppercase">
                  07 — Adherence & Routine
                </span>
                <div className="w-12 h-px bg-[#D9E2DE]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172A2B]">
                Daily consistency makes baselines accurate.
              </h2>
              <p className="text-sm sm:text-base text-[#60716E] leading-relaxed">
                Spaceflight data is only as good as crew compliance. AstroTrack turns routine data entry into low-friction, streak-based habits so astronauts never skip a log.
              </p>
            </Reveal>
          </div>

          {/* Right Cards & Ring (7/12) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Streak Ring Card */}
            <div className="p-5 rounded-2xl bg-[#F4F6F4] border border-[#D9E2DE] flex flex-col items-center text-center space-y-3">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#D9E2DE" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#F2A65A"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - 0.77)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <Flame size={18} className="text-[#F2A65A]" />
                  <span className="text-xs font-black text-[#172A2B]">7 Sols</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172A2B]">7-Day Sol Streak</h3>
                <p className="text-xs text-[#60716E] mt-0.5">Consecutive daily checks</p>
              </div>
            </div>

            {/* Total Readings Logged */}
            <div className="p-5 rounded-2xl bg-[#F4F6F4] border border-[#D9E2DE] flex flex-col items-center text-center space-y-3 justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF0ED] text-[#176B68] flex items-center justify-center">
                <Zap size={26} />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#172A2B]">30+</span>
                <h3 className="text-sm font-bold text-[#172A2B] mt-0.5">Readings Logged</h3>
                <p className="text-xs text-[#60716E]">High baseline fidelity</p>
              </div>
            </div>

            {/* Protocol Badges */}
            <div className="p-5 rounded-2xl bg-[#F4F6F4] border border-[#D9E2DE] flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#176B68]">
                <Award size={16} />
                <span>Earned Badges</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#D9E2DE]">
                  <CheckCircle size={14} className="text-[#247A55]" />
                  <span className="font-semibold text-[#172A2B]">ARED Compliance</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#D9E2DE]">
                  <CheckCircle size={14} className="text-[#247A55]" />
                  <span className="font-semibold text-[#172A2B]">Full Sleep Week</span>
                </div>
              </div>
              <span className="text-[10px] text-[#60716E] text-center">340 Mission Readiness Pts</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
