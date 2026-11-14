'use client';

import React from 'react';
import Image from 'next/image';
import { ExternalLink, Quote } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../motion/MotionHelpers';

const CHALLENGES = [
  {
    num: '01',
    title: 'Extended Weightlessness',
    desc: 'Cephalad fluid redistribution causes cardiovascular deconditioning, bone mineral density loss (~1% per month without countermeasure), and neuro-ocular shifts (SANS).'
  },
  {
    num: '02',
    title: 'Galactic Radiation Exposure',
    desc: 'Beyond the protective shield of Earth magnetosphere, astronauts face cumulative ionizing galactic cosmic rays (GCR) and unpredictable solar particle events (SPE).'
  },
  {
    num: '03',
    title: 'Extreme Isolation & Confinement',
    desc: 'Small crews living in close quarters experience disrupted circadian rhythms, cumulative sleep debt, autonomic stress, and psychological fatigue over multi-year journeys.'
  },
  {
    num: '04',
    title: 'Up to 22-Minute Communication Latency',
    desc: 'Real-time telemedicine from flight surgeons at Mission Control becomes impossible. Ground responses can take 44 minutes round-trip, requiring onboard autonomy.'
  },
  {
    num: '05',
    title: 'Zero Evacuation or Resupply',
    desc: 'Unlike low-Earth orbit aboard the ISS, a Mars transit vehicle cannot abort or receive emergency medical drops. Crews must triage and manage symptoms on their own.'
  }
];

export function ChallengeSection() {
  return (
    <section id="challenge" className="py-24 sm:py-32 bg-[#F4F6F4] text-[#172A2B] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Tag */}
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold tracking-widest text-[#176B68] uppercase">
              01 — The Challenge
            </span>
            <div className="w-12 h-px bg-[#D9E2DE]" />
          </div>
        </Reveal>

        {/* Asymmetrical Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (5/12) */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#172A2B] leading-tight">
                Doctors are minutes away on Earth.{' '}
                <span className="text-[#176B68]">On Mars, they are a delay away.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg text-[#60716E] leading-relaxed">
                During exploration missions, the human body undergoes physiological adaptations that would be considered pathological on Earth. Without immediate ground support, detecting these shifts early is essential to mission success.
              </p>
            </Reveal>

            {/* Challenge List */}
            <Stagger className="space-y-6 pt-2">
              {CHALLENGES.map((item) => (
                <StaggerItem key={item.num} className="flex gap-4 items-start">
                  <span className="text-sm font-extrabold text-[#176B68] bg-[#EAF0ED] px-2 py-1 rounded-md shrink-0">
                    {item.num}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#172A2B]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#60716E] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Right Column (7/12): Tall NASA Photo + Floating Quote Card */}
          <div className="lg:col-span-7 relative">
            <Reveal delay={0.3} className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/5 sm:aspect-3/4 max-h-[700px] w-full">
              <Image
                src="/images/nasa/iss-crew-sleep.jpg"
                alt="NASA astronaut inside sound-dampened crew quarters station on ISS"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172A2B]/80 via-transparent to-transparent" />
              
              {/* Photo Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-xs text-[#EAF0ED] flex items-center justify-between">
                <span>Astronaut sleep quarters aboard ISS</span>
                <span className="font-semibold text-white/80">Image: NASA / CSA</span>
              </div>
            </Reveal>

            {/* Floating Quote Card */}
            <Reveal delay={0.4} className="mt-6 lg:mt-0 lg:absolute lg:-bottom-8 lg:-left-12 lg:max-w-md bg-white border border-[#D9E2DE] p-6 rounded-2xl shadow-xl space-y-3 z-10">
              <div className="flex items-center gap-2 text-[#176B68]">
                <Quote size={20} className="fill-[#176B68]/20" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  NASA Human Research Program
                </span>
              </div>
              <p className="text-sm text-[#172A2B] italic font-medium leading-relaxed">
                &ldquo;These hazards do not stand alone. They combine and amplify each other, creating cumulative physiological stress that demands continuous, adaptive monitoring.&rdquo;
              </p>
              <div className="pt-1 flex items-center justify-between text-xs text-[#60716E]">
                <span>NASA HRP 5 Hazards Synthesis</span>
                <a
                  href="https://www.nasa.gov/hrp/hazards/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#176B68] font-bold hover:underline"
                >
                  <span>Read report</span>
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
