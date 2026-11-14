'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

export function FinalCtaSection() {
  return (
    <section className="relative py-28 sm:py-36 bg-[#0A1A1F] text-white overflow-hidden">
      {/* Background NASA image: Earth viewed from ISS Cupola */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nasa/iss-cupola-earth.jpg"
          alt="Earth limb and atmosphere viewed from ISS Cupola module"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 scale-105"
        />
        {/* Dark radial and gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A1F] via-[#0A1A1F]/70 to-[#0A1A1F]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#122B31] border border-[#234954] text-xs font-semibold text-[#3FB6A8] mb-4">
            <ShieldCheck size={14} />
            <span>Mission Readiness Autonomous Platform</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Know your health before{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F2A65A] to-[#3FB6A8]">
              Earth can tell you.
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-xl text-[#C0D1CE] max-w-2xl mx-auto leading-relaxed">
            Experience the complete Sol 90 Mars transit health monitoring simulation built for the 2026 NASA Space Apps Challenge.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-base bg-[#F2A65A] text-[#172A2B] hover:bg-[#E09448] shadow-lg shadow-[#F2A65A]/25 transition-all active:scale-[0.98]"
            >
              <span>Create demo account</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-white border border-[#234954] bg-[#0F2A30]/80 hover:bg-[#182C30] backdrop-blur-xs transition-all active:scale-[0.98]"
            >
              <Play size={16} className="text-[#F2A65A] fill-[#F2A65A]" />
              <span>Try guided walkthrough</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-[#829994]">
            Instant browser access · No real patient health information (PHI) collected
          </p>
        </Reveal>

      </div>
    </section>
  );
}
