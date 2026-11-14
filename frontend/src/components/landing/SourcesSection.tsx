'use client';

import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

const SOURCES = [
  {
    num: '01',
    agency: 'NASA Human Research Program',
    title: '5 Hazards of Human Spaceflight',
    desc: 'The foundational architecture categorizing spaceflight hazards into Radiation, Isolation, Distance, Microgravity, and Closed Environments.',
    url: 'https://www.nasa.gov/hrp/hazards/'
  },
  {
    num: '02',
    agency: 'NASA Human Research Program',
    title: 'Risks of Human Spaceflight',
    desc: 'Detailed breakdown of cardiovascular deconditioning, bone mineral loss, behavioral stress, and SANS neuro-ocular pathology.',
    url: 'https://www.nasa.gov/hrp/risks/'
  },
  {
    num: '03',
    agency: 'NASA Human Research Program',
    title: 'Ongoing HRP Research in Space',
    desc: 'Active flight experiments and clinical protocols tested aboard the ISS for deep-space Mars transit preparation.',
    url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/'
  },
  {
    num: '04',
    agency: 'Canadian Space Agency (CSA)',
    title: 'Monitoring Radiation for Astronaut Health',
    desc: 'Personal active and passive radiation dosimetry analysis, cellular biodosimetry, and deep-space shelter protocols.',
    url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp'
  },
  {
    num: '05',
    agency: 'Canadian Space Agency (CSA)',
    title: 'Why Do We Conduct Science Experiments in Space?',
    desc: 'Physiological mechanisms of fluid redistribution, altered vestibular balance, and autonomic baroreflex adjustments in orbit.',
    url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp'
  }
];

export function SourcesSection() {
  return (
    <section id="sources" className="py-24 sm:py-32 bg-[#F4F6F4] text-[#172A2B] border-t border-[#D9E2DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#176B68] uppercase">
              08 — Scientific Grounding
            </span>
            <div className="w-12 h-px bg-[#D9E2DE]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#172A2B]">
                Five official sources. Nothing else.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#60716E] max-w-2xl leading-relaxed">
                Every physiological indicator, hazard classification, and countermeasure protocol in AstroTrack is derived directly from peer-reviewed NASA and CSA documentation.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#176B68] bg-[#EAF0ED] px-3.5 py-2 rounded-xl shrink-0">
              <BookOpen size={15} />
              <span>Verified Scientific References</span>
            </div>
          </div>
        </Reveal>

        {/* Editorial Rows with Big Numerals */}
        <div className="mt-12 space-y-4">
          {SOURCES.map((source) => (
            <a
              key={source.num}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 sm:p-8 rounded-2xl bg-white border border-[#D9E2DE] hover:border-[#176B68] hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Big Numeral (2/12) */}
                <div className="md:col-span-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#B6C6C2] group-hover:text-[#176B68] transition-colors">
                    {source.num}
                  </span>
                  <span className="block text-xs font-semibold text-[#60716E] mt-1">
                    {source.agency}
                  </span>
                </div>

                {/* Content (8/12) */}
                <div className="md:col-span-8 space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#172A2B] group-hover:text-[#176B68] transition-colors">
                    {source.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed">
                    {source.desc}
                  </p>
                </div>

                {/* Action Link (2/12) */}
                <div className="md:col-span-2 flex justify-start md:justify-end">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] group-hover:translate-x-1 transition-transform">
                    <span>Open source</span>
                    <ExternalLink size={13} />
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
