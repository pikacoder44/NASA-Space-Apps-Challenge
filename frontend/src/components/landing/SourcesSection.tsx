'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

const SOURCES = [
  {
    num: '01',
    agency: 'NASA Human Research Program',
    title: '5 Hazards of Human Spaceflight',
    desc: 'The foundational framework categorizing spaceflight hazards into Radiation, Isolation, Distance, Microgravity, and Closed Environments.',
    url: 'https://www.nasa.gov/hrp/hazards/'
  },
  {
    num: '02',
    agency: 'NASA Human Research Program',
    title: 'Risks of Human Spaceflight',
    desc: 'Detailed research reports on cardiovascular deconditioning, bone mineral loss, behavioral health, and vision alterations.',
    url: 'https://www.nasa.gov/hrp/risks/'
  },
  {
    num: '03',
    agency: 'NASA Human Research Program',
    title: 'Ongoing HRP Research in Space',
    desc: 'Current biomedical countermeasures and clinical protocols tested aboard the International Space Station.',
    url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/'
  },
  {
    num: '04',
    agency: 'Canadian Space Agency (CSA)',
    title: 'Monitoring Radiation for Astronaut Health',
    desc: 'Operational radiation dosimetry tracking, space weather monitoring, and astronaut shelter procedures.',
    url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp'
  },
  {
    num: '05',
    agency: 'Canadian Space Agency (CSA)',
    title: 'Why Do We Conduct Science Experiments in Space?',
    desc: 'Studies on fluid redistribution, vestibular adaptation, and cardiovascular baroreflex changes in microgravity.',
    url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp'
  }
];

export function SourcesSection() {
  return (
    <section id="sources" className="py-20 sm:py-28 bg-[#F4F6F4] text-[#172A2B] border-t border-[#D9E2DE]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-[#176B68]">
              08 — Scientific grounding
            </span>
            <div className="w-10 h-px bg-[#D9E2DE]" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#172A2B]">
              Five official sources.
            </h2>
            <p className="mt-2 text-base text-[#60716E] max-w-2xl leading-relaxed">
              The hazards, risks and research context in AstroTrack come from these NASA and CSA pages.
            </p>
          </div>
        </Reveal>

        {/* Editorial Rows Separated by 1px Lines (NO heavy cards) */}
        <div className="mt-10 border-t border-[#D9E2DE]">
          {SOURCES.map((source) => (
            <a
              key={source.num}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-7 px-4 -mx-4 rounded-xl border-b border-[#D9E2DE] hover:bg-white/70 transition-all cursor-pointer"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                
                {/* Big Numeral (2/12): 40px accent color */}
                <div className="md:col-span-2 flex items-baseline md:flex-col gap-3 md:gap-0">
                  <span className="text-3xl sm:text-4xl font-bold text-[#F2A65A]">
                    {source.num}
                  </span>
                  <span className="text-xs font-medium text-[#60716E] md:mt-1">
                    {source.agency}
                  </span>
                </div>

                {/* Content (8/12) */}
                <div className="md:col-span-8 space-y-1">
                  <h3 className="text-lg sm:text-[20px] font-semibold text-[#172A2B] group-hover:text-[#176B68] transition-colors">
                    {source.title}
                  </h3>
                  <p className="text-[15px] text-[#60716E] leading-relaxed">
                    {source.desc}
                  </p>
                </div>

                {/* Link Action (2/12) */}
                <div className="md:col-span-2 flex items-center md:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#176B68] group-hover:translate-x-1 transition-transform">
                    <span>Open source</span>
                    <ArrowRight size={15} />
                  </span>
                </div>

              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
