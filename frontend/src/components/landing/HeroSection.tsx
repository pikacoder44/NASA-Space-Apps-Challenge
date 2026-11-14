'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, ChevronDown, Moon, Activity } from 'lucide-react';
import { CountUp } from '../motion/MotionHelpers';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between bg-[#12343B] text-white overflow-hidden pt-28 pb-10">
      {/* Background bright NASA photo: Earth viewed from Cupola */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nasa/iss-cupola-earth.jpg"
          alt="Earth observed from the International Space Station Cupola module"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-center opacity-90"
        />
        {/* Left-side overlay only: right 40% remains brightly visible! */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(18,52,59,0.92) 0%, rgba(18,52,59,0.82) 42%, rgba(18,52,59,0.3) 70%, transparent 100%)'
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(18,52,59,0.95) 0%, transparent 28%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Solid text headline & CTAs (7/12) */}
          <div className="lg:col-span-7 space-y-6 max-w-2xl">
            
            {/* Mission chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B4B52]/90 border border-[#3FB6A8]/40 text-xs font-medium text-white backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#F2A65A]" />
              <span>NASA Space Apps Challenge 2026</span>
              <span className="text-white/40">·</span>
              <span className="text-[#3FB6A8]">Mars transit</span>
            </div>

            {/* H1 Headline (Inter 700, solid white + solid accent, NO gradient) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-white leading-[1.1]">
              Your health.{' '}
              <span className="text-[#F2A65A]">
                225 million km
              </span>{' '}
              from help.
            </h1>

            {/* Subline */}
            <p className="text-base sm:text-lg text-white/85 max-w-xl font-normal leading-relaxed">
              When communication with Earth is delayed up to 22 minutes each way, astronauts need an autonomous health cockpit that detects subtle physiological shifts before clinical emergencies occur.
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base bg-[#F2A65A] text-[#172A2B] hover:bg-[#E09448] shadow-md transition-all active:scale-[0.98]"
              >
                <span>Get started</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-base text-white border border-white/30 bg-[#12343B]/60 hover:bg-[#1B4B52]/80 backdrop-blur-xs transition-all active:scale-[0.98]"
              >
                <Play size={16} className="text-[#F2A65A] fill-[#F2A65A]" />
                <span>Watch Sol 90 walkthrough</span>
              </Link>
            </div>

            <p className="text-xs text-white/70 font-medium">
              Prototype for crew self-monitoring · Informed by NASA Human Research Program literature
            </p>
          </div>

          {/* Right Column: Lighter White Floating Demo Card (5/12) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#D9E2DE] p-5 shadow-2xl space-y-4 text-[#172A2B]">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#176B68]" />
                  <span className="text-sm font-bold text-[#172A2B]">
                    Sol 90 check-in
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#FBF0D9] text-[#8A520F] border border-[#EED8A7]">
                  Watch status
                </span>
              </div>

              {/* Sample Indicator 1: Sleep */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#D9E2DE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={16} className="text-[#176B68]" />
                    <span className="text-sm font-bold text-[#172A2B]">Sleep duration</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FBF0D9] text-[#8A520F]">
                    Yellow
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#172A2B]">5.2</span>
                    <span className="text-xs text-[#60716E]">hrs / night</span>
                  </div>
                  <span className="text-xs font-semibold text-[#8A520F]">
                    -2.1 h vs 7.3 h baseline
                  </span>
                </div>
                <p className="text-xs text-[#60716E] leading-relaxed">
                  Cumulative sleep deficit over 4 consecutive sols. Early autonomic fatigue indicator.
                </p>
              </div>

              {/* Sample Indicator 2: Heart Rate */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#D9E2DE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#F2A65A]" />
                    <span className="text-sm font-bold text-[#172A2B]">Resting heart rate</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FBF0D9] text-[#8A520F]">
                    Yellow
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#172A2B]">75</span>
                    <span className="text-xs text-[#60716E]">bpm (nocturnal)</span>
                  </div>
                  <span className="text-xs font-semibold text-[#8A520F]">
                    +13 bpm above baseline
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-[#60716E]">
                <span>Demo data</span>
                <span>CDR-01 Mars transit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: 4 Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8">
        <div className="pt-6 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              <CountUp to={6} suffix=" core measures" />
            </div>
            <p className="text-xs text-white/75">
              Tracked daily with rapid input
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-[#F2A65A]">
              <CountUp to={5} suffix=" NASA hazards" />
            </div>
            <p className="text-xs text-white/75">
              Mapped to physiological risks
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-[#3FB6A8]">
              <CountUp to={5} suffix=" official sources" />
            </div>
            <p className="text-xs text-white/75">
              NASA HRP & CSA literature
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              &lt; 60 s
            </div>
            <p className="text-xs text-white/75">
              Daily check-in commitment
            </p>
          </div>

        </div>

        {/* Scroll cue */}
        <div className="flex justify-center pt-6">
          <a
            href="#challenge"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            <span>Explore the challenge</span>
            <ChevronDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
