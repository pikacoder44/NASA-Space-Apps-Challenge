'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

export function FinalCtaSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#12343B] text-white overflow-hidden">
      {/* Background bright NASA Earth limb / Cupola photo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/nasa/iss-cupola-earth.jpg"
          alt="Earth horizon and atmosphere viewed from the International Space Station"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-85"
        />
        {/* Subtle overlay only: at most rgba(18,52,59,0.40) with bottom gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(18,52,59,0.92) 0%, rgba(18,52,59,0.45) 50%, rgba(18,52,59,0.2) 100%)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        
        <Reveal>
          {/* Headline: solid white with solid accent phrase, NO gradient */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Know your health before{' '}
            <span className="text-[#F2A65A]">
              Earth can tell you.
            </span>
          </h2>

          <p className="mt-3 text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            Experience the complete Sol 90 Mars transit health monitoring simulation built for the 2026 NASA Space Apps Challenge.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base bg-[#F2A65A] text-[#172A2B] hover:bg-[#E09448] shadow-md transition-all active:scale-[0.98]"
            >
              <span>Create demo account</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-base text-white border border-white/30 bg-[#12343B]/70 hover:bg-[#1B4B52] backdrop-blur-xs transition-all active:scale-[0.98]"
            >
              <Play size={16} className="text-[#F2A65A] fill-[#F2A65A]" />
              <span>Try guided walkthrough</span>
            </Link>
          </div>

          <p className="mt-5 text-xs text-white/70">
            Instant browser access · Prototype demonstration
          </p>
        </Reveal>

      </div>
    </section>
  );
}
