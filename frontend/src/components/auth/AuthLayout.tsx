'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  quote?: string;
  quoteAuthor?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  quote = '“In deep space, autonomous health monitoring is not a convenience — it is the lifeline between the crew and mission survival.”',
  quoteAuthor = 'AAHMS Mission Operations Architecture',
  imageSrc = '/images/nasa/iss-cupola-earth.jpg',
  imageAlt = 'Earth limb viewed through the ISS Cupola observation module'
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#F4F6F4] flex flex-col lg:flex-row text-[#172A2B]">
      {/* Left Column (45% on desktop): Authentic NASA Imagery & Mission Identity */}
      <div className="relative w-full lg:w-[45%] h-48 sm:h-64 lg:h-auto min-h-[160px] lg:min-h-screen bg-[#122B31] overflow-hidden flex flex-col justify-between p-6 sm:p-10 shrink-0">
        {/* Background authentic NASA photograph with subtle zoom/focus */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover object-center brightness-75 contrast-110"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          {/* Deep aerospace gradient overlay for high legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#122B31] via-[#122B31]/60 to-[#122B31]/80 lg:bg-gradient-to-r lg:from-[#122B31]/75 lg:via-[#122B31]/50 lg:to-[#122B31]/95" />
        </div>

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#176B68] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
              <Activity size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
                AAHMS
              </span>
              <span className="text-[10px] tracking-wider text-[#A2BEB9] uppercase font-semibold block">
                NASA Space Apps 2026
              </span>
            </div>
          </Link>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs border border-white/10 text-white text-[11px]">
            <ShieldCheck size={13} className="text-[#84C2B4]" />
            <span>Air-Gapped Flight Node</span>
          </div>
        </div>

        {/* Bottom Quote & Attribution (Hidden on very short mobile banners, visible on sm+) */}
        <div className="relative z-10 hidden sm:block max-w-lg mt-auto pt-8">
          <blockquote className="text-white/90 text-sm md:text-base font-normal italic leading-relaxed">
            {quote}
          </blockquote>
          <p className="text-[#A2BEB9] text-xs font-semibold mt-2">
            — {quoteAuthor}
          </p>

          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-[#A2BEB9]/80">
            <span>Photo: NASA Public Domain (Exp. 34)</span>
            <span>Sol 90 Mars Transit Scenario</span>
          </div>
        </div>
      </div>

      {/* Right Column (55% on desktop): Form Container */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 xl:p-16 flex-1">
        <div className="w-full max-w-md mx-auto">
          {/* Form Header */}
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B]">
              {title}
            </h1>
            <p className="text-sm text-[#60716E] mt-1.5">
              {subtitle}
            </p>
          </div>

          {/* Card Wrapper for Form Content */}
          <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 shadow-sm">
            {children}
          </div>

          {/* Footer Prototype Disclaimer */}
          <div className="mt-6 text-center text-xs text-[#60716E] space-y-1">
            <p>AAHMS Operational Research Prototype · NASA Space Apps Challenge 2026</p>
            <p className="text-[11px] text-[#8C9E9A]">
              Not an FDA-cleared clinical medical device. Simulated telemetry for flight evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
