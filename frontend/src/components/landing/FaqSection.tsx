'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

const FAQS = [
  {
    q: 'Is AstroTrack an official medical device or certified diagnostic tool?',
    a: 'No. AstroTrack (AAHMS) is a research and operational concept prototype created for the 2026 NASA Space Apps Challenge. It demonstrates how autonomous personal-baseline monitoring could function during deep-space exploration missions. It is not an FDA-cleared diagnostic device and should never replace licensed clinical judgment.'
  },
  {
    q: 'Where does the health telemetry come from in this demo?',
    a: 'All data displayed in demo mode (Sol 90 scenario, sliders, and charts) is synthetic demonstration data generated to reflect documented NASA human spaceflight physiological trends. In production/API mode, AstroTrack connects to our FastAPI backend with secure PostgreSQL storage.'
  },
  {
    q: 'How does the three-tier alert system work?',
    a: 'Instead of comparing against rigid population averages that fail in microgravity, AstroTrack compares each reading against the astronaut’s own multi-day rolling baseline. Observations are classified as Normal (green), Watch (yellow), or Act Now (red), with an explicit clinical reason sentence explaining the deviation.'
  },
  {
    q: 'How does Gemini AI function, and does it work offline?',
    a: 'Gemini-powered explanations run via our FastAPI backend to generate concise, human-readable clinical summaries. When a spacecraft is disconnected from the habitat gateway or ground network, AstroTrack gracefully displays an offline fallback with pre-computed protocol countermeasures.'
  },
  {
    q: 'Who developed this software?',
    a: 'AstroTrack was engineered by our hackathon team for the NASA Space Apps Challenge 2026 challenge track: "Create Health Monitoring Software for Astronauts on Space Missions". It is informed by published NASA Human Research Program and Canadian Space Agency literature.'
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i));
  };

  return (
    <section className="py-24 sm:py-32 bg-white text-[#172A2B] border-t border-[#D9E2DE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF0ED] border border-[#D9E2DE] text-xs font-bold text-[#176B68]">
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172A2B]">
            Clear answers about the prototype.
          </h2>
          <p className="text-sm sm:text-base text-[#60716E] max-w-xl mx-auto">
            Everything you need to know about system architecture, data provenance, and scientific boundaries.
          </p>
        </Reveal>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-[#D9E2DE] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span className="text-base font-bold text-[#172A2B]">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#60716E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#176B68]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 pt-0 bg-white text-sm text-[#60716E] leading-relaxed border-t border-[#D9E2DE]/50">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
