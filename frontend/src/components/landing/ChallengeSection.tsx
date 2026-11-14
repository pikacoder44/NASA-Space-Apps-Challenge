'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

const CHALLENGES = [
  {
    num: '01',
    title: 'Extended weightlessness',
    desc: 'Fluid redistribution upward causes cardiovascular deconditioning, bone mineral loss, and visual shifts.'
  },
  {
    num: '02',
    title: 'Galactic radiation exposure',
    desc: 'Beyond Earth magnetosphere, astronauts face cumulative ionizing galactic cosmic rays and solar particles.'
  },
  {
    num: '03',
    title: 'Isolation and confinement',
    desc: 'Circadian rhythm disruption in small habitat volumes triggers cumulative sleep debt and autonomic fatigue.'
  },
  {
    num: '04',
    title: 'Up to 22-minute communication delay',
    desc: 'Real-time ground telemedicine is impossible when round-trip signals require up to 44 minutes.'
  },
  {
    num: '05',
    title: 'Zero emergency resupply',
    desc: 'Transit vehicles carry finite medical inventory without possibilities for mission abort or emergency care.'
  }
];

export function ChallengeSection() {
  return (
    <section id="challenge" className="py-20 sm:py-28 bg-[#F4F6F4] text-[#172A2B]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Tag */}
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-[#176B68]">
              01 — The challenge
            </span>
            <div className="w-10 h-px bg-[#D9E2DE]" />
          </div>
        </Reveal>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left 6 Columns: Text & Compact Rows (max-width 520px, height ~560px) */}
          <div className="lg:col-span-6 max-w-[520px] space-y-5">
            <Reveal delay={0.1}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#172A2B] leading-tight">
                Doctors are minutes away on Earth.{' '}
                <span className="text-[#176B68]">On Mars, they are a delay away.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base text-[#60716E] leading-relaxed">
                Deep space travel exposes the human body to extreme operational stresses without real-time telemedicine support from Mission Control.
              </p>
            </Reveal>

            {/* 5 Compact Rows */}
            <div className="space-y-3 pt-1">
              {CHALLENGES.map((item) => (
                <div key={item.num} className="flex gap-3.5 items-start">
                  <span className="text-sm font-bold text-[#176B68] bg-[#EAF0ED] px-2 py-0.5 rounded shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#172A2B] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-[#60716E] leading-snug mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 6 Columns: 4/5 Aspect Photo of Astronaut Working (NO close-up face) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-end">
            <Reveal delay={0.2} className="w-full max-w-[480px]">
              <div className="relative aspect-4/5 max-h-[560px] w-full rounded-2xl overflow-hidden shadow-lg border border-[#D9E2DE] bg-[#EAF0ED]">
                <Image
                  src="/images/nasa/iss-spacewalk-eva.jpg"
                  alt="NASA astronaut working outside the International Space Station on orbital trusses"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Verified Attribution under photo (NO fake quotes, NO floating card) */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#60716E] px-1">
                <span>Image: NASA public domain</span>
                <a
                  href="https://www.nasa.gov/hrp/hazards/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#176B68] font-medium hover:underline"
                >
                  <span>Source: NASA HRP, 5 Hazards of Human Spaceflight</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
}
