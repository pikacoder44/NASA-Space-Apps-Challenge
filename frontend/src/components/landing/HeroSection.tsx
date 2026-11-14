'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, ChevronDown, Moon, Activity } from 'lucide-react';
import { CountUp } from '../motion/MotionHelpers';

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-between bg-[#0A1A1F] text-white overflow-hidden pt-24 pb-10">
      {/* Background NASA image with dark vignette & radial gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nasa/iss-spacewalk-eva.jpg"
          alt="NASA astronaut conducting extravehicular activity in deep space above Earth"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Dark radial and linear overlays for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A1F] via-[#0A1A1F]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A1F] via-transparent to-[#0A1A1F]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, subline, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mission badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#122B31] border border-[#234954] text-xs font-medium text-[#C0D1CE]">
              <span className="w-2 h-2 rounded-full bg-[#F2A65A] animate-pulse" />
              <span>NASA Space Apps Challenge 2026</span>
              <span className="text-[#60716E]">·</span>
              <span className="text-[#3FB6A8]">Mission Mars Transit</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-white leading-[1.05]">
              Your health.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2A65A] via-[#F6C28B] to-[#3FB6A8]">
                225 million km
              </span>{' '}
              from help.
            </h1>

            {/* Subline */}
            <p className="text-lg sm:text-xl text-[#C0D1CE] max-w-2xl font-normal leading-relaxed">
              When communication with Earth is delayed up to 22 minutes each way, astronauts need an autonomous health cockpit that detects subtle physiological shifts before clinical emergencies occur.
            </p>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base bg-[#F2A65A] text-[#172A2B] hover:bg-[#E09448] shadow-lg shadow-[#F2A65A]/20 transition-all active:scale-[0.98]"
              >
                <span>Get started</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-base text-white border border-[#234954] bg-[#0F2A30]/60 hover:bg-[#182C30] backdrop-blur-xs transition-all active:scale-[0.98]"
              >
                <Play size={16} className="text-[#F2A65A] fill-[#F2A65A]" />
                <span>Watch Sol 90 Walkthrough</span>
              </Link>
            </div>

            <p className="text-xs text-[#829994] font-medium">
              Prototype for crew self-monitoring · Informed by NASA Human Research Program literature
            </p>
          </div>

          {/* Right Column: Live Floating Preview Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#0F2A30]/90 backdrop-blur-md rounded-2xl border border-[#234954] p-5 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#234954]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#176B68]" />
                  <span className="text-xs font-bold text-[#EAF0ED] tracking-wide uppercase">
                    Sol 90 Live Telemetry
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#A96617]/30 border border-[#A96617]/60 text-[#F2A65A]">
                  Watch Status
                </span>
              </div>

              {/* Sample Indicator 1: Sleep Duration */}
              <div className="p-3.5 rounded-xl bg-[#0A1A1F]/80 border border-[#1E373C] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={16} className="text-[#3FB6A8]" />
                    <span className="text-sm font-semibold text-white">Sleep Duration</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/20 text-[#EAB308]">
                    Yellow
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-white">5.2</span>
                    <span className="text-xs text-[#829994]">hrs / night</span>
                  </div>
                  <span className="text-xs font-medium text-[#F2A65A]">
                    -2.1 h vs 7.3 h baseline
                  </span>
                </div>
                <p className="text-xs text-[#A2BEB9] leading-relaxed">
                  Cumulative sleep deficit over 4 consecutive sols. Early autonomic fatigue indicator.
                </p>
              </div>

              {/* Sample Indicator 2: Resting HR */}
              <div className="p-3.5 rounded-xl bg-[#0A1A1F]/80 border border-[#1E373C] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#F2A65A]" />
                    <span className="text-sm font-semibold text-white">Resting Heart Rate</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EAB308]/20 text-[#EAB308]">
                    Yellow
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-white">75</span>
                    <span className="text-xs text-[#829994]">bpm (nocturnal)</span>
                  </div>
                  <span className="text-xs font-medium text-[#F2A65A]">
                    +13 bpm above baseline
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#60716E]">
                <span>Illustrative demo data</span>
                <span>CDR-01 Mars Transit Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: 4 Animated Stats */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8">
        <div className="pt-6 border-t border-[#233E44]/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              <CountUp to={6} suffix=" Core Measures" />
            </div>
            <p className="text-xs text-[#A2BEB9]">
              Tracked daily with rapid input
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F2A65A]">
              <CountUp to={5} suffix=" NASA Hazards" />
            </div>
            <p className="text-xs text-[#A2BEB9]">
              Mapped to physiological risks
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#3FB6A8]">
              <CountUp to={5} suffix=" Official Sources" />
            </div>
            <p className="text-xs text-[#A2BEB9]">
              NASA HRP & CSA research foundation
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              &lt; 60 s
            </div>
            <p className="text-xs text-[#A2BEB9]">
              Daily check-in time commitment
            </p>
          </div>

        </div>

        {/* Scroll cue */}
        <div className="flex justify-center pt-6">
          <a
            href="#challenge"
            className="inline-flex items-center gap-1.5 text-xs text-[#829994] hover:text-white transition-colors"
          >
            <span>Explore the challenge</span>
            <ChevronDown size={14} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
