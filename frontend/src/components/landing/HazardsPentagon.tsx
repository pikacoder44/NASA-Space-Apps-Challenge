'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ShieldAlert, Users, Radio, Compass, Box, ChevronRight } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

interface HazardData {
  id: string;
  name: string;
  shortLabel: string;
  desc: string;
  image: string;
  imageAlt: string;
  tracked: string[];
  sourceUrl: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

const HAZARDS: HazardData[] = [
  {
    id: 'radiation',
    name: 'Space radiation',
    shortLabel: 'Radiation',
    desc: 'Deep-space ionizing radiation increases health risks and induces acute hematopoietic and neurovascular shifts.',
    image: '/images/nasa/space-radiation-dosimetry.jpg',
    imageAlt: 'Space radiation dosimetry mapping',
    tracked: ['Blood markers', 'Radiation symptoms', 'Cumulative dosimetry'],
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    icon: ShieldAlert
  },
  {
    id: 'isolation',
    name: 'Isolation and confinement',
    shortLabel: 'Isolation',
    desc: 'Months in confined habitat volumes disrupt circadian biology, elevating autonomic stress and sleep debt.',
    image: '/images/nasa/iss-crew-sleep.jpg',
    imageAlt: 'Astronaut in crew quarters',
    tracked: ['Sleep hours', 'Mood score', 'Cognitive checklist'],
    sourceUrl: 'https://www.nasa.gov/hrp/risks/',
    icon: Users
  },
  {
    id: 'distance',
    name: 'Distance from Earth',
    shortLabel: 'Distance',
    desc: 'Up to 22-minute radio latency each way prevents real-time ground clinical intervention during missions.',
    image: '/images/nasa/mars-transit-concept.jpg',
    imageAlt: 'Deep space exploration vehicle',
    tracked: ['Automated triage', 'Guidance engine', 'Offline logging'],
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    icon: Radio
  },
  {
    id: 'gravity',
    name: 'Gravity fields (microgravity)',
    shortLabel: 'Microgravity',
    desc: 'Weightlessness induces cephalic fluid shifts, muscle atrophy, bone loss, and cardiovascular deconditioning.',
    image: '/images/nasa/iss-exercise-ared.jpg',
    imageAlt: 'Astronaut exercising on ARED in microgravity',
    tracked: ['Heart rate', 'Blood pressure', 'Body temperature'],
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    icon: Compass
  },
  {
    id: 'environment',
    name: 'Hostile closed environments',
    shortLabel: 'Environment',
    desc: 'Recirculated habitat air, microflora shifts, and environmental enclosures challenge human physiological reserves.',
    image: '/images/nasa/iss-crew-meal.jpg',
    imageAlt: 'Crew members in habitat module',
    tracked: ['Blood glucose', 'Physiological vitals', 'Daily routine'],
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    icon: Box
  }
];

export function HazardsPentagon() {
  const [activeHazardIndex, setActiveHazardIndex] = useState(0);

  // Expanded Pentagon nodes coordinates (radius 140, center 190, 190 in 380x380 SVG)
  const pentagonNodes = [
    { x: 190, y: 50,  labelY: 20 },   // Top (Radiation) - label well above circle
    { x: 323, y: 147, labelY: 190 },  // Top Right (Isolation)
    { x: 272, y: 304, labelY: 340 },  // Bottom Right (Distance) - label below
    { x: 108, y: 304, labelY: 340 },  // Bottom Left (Gravity) - label below
    { x: 57,  y: 147, labelY: 190 },  // Top Left (Environment)
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveHazardIndex((prev) => (prev + 1) % HAZARDS.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveHazardIndex((prev) => (prev - 1 + HAZARDS.length) % HAZARDS.length);
    }
  };

  return (
    <section id="hazards" className="py-16 sm:py-20 bg-[#12343B] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-[#3FB6A8]">
              02 — Five hazards
            </span>
            <div className="w-10 h-px bg-[#1B4B52]" />
          </div>
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Five hazards every crew carries with them.
            </h2>
            <p className="mt-2 text-base text-white/85 leading-relaxed">
              NASA Human Research Program groups spaceflight risks into five interdependent hazards mapped to AstroTrack telemetry.
            </p>
          </div>
        </Reveal>

        {/* Content: Left Diagram (max 440px) + Right Table of Contents Rows */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop SVG Pentagon Diagram (5/12, enlarged with clear spacing) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center p-2">
            <div className="relative w-[380px] h-[380px] flex items-center justify-center">
              
              <svg
                width="380"
                height="380"
                viewBox="0 0 380 380"
                className="overflow-visible select-none focus:outline-hidden"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                role="tablist"
                aria-label="5 NASA Hazards diagram"
              >
                {/* Center Node "Crew" */}
                <circle cx="190" cy="190" r="34" fill="#1B4B52" stroke="#3FB6A8" strokeWidth="2" />
                <text x="190" y="195" textAnchor="middle" className="text-xs font-bold fill-white tracking-widest">
                  CREW
                </text>

                {/* Connecting lines */}
                {pentagonNodes.map((node, i) => {
                  const isActive = activeHazardIndex === i;
                  return (
                    <line
                      key={`line-${i}`}
                      x1="190"
                      y1="190"
                      x2={node.x}
                      y2={node.y}
                      stroke={isActive ? '#F2A65A' : '#1B4B52'}
                      strokeWidth={isActive ? '2.5' : '1.25'}
                      strokeDasharray={isActive ? 'none' : '3 3'}
                    />
                  );
                })}

                {/* Outer pentagon ring */}
                <polygon
                  points={pentagonNodes.map(n => `${n.x},${n.y}`).join(' ')}
                  fill="none"
                  stroke="#1B4B52"
                  strokeWidth="1.25"
                />

                {/* 5 Outer Hazard Nodes */}
                {pentagonNodes.map((node, i) => {
                  const isActive = activeHazardIndex === i;
                  const item = HAZARDS[i];
                  return (
                    <g
                      key={item.id}
                      className="cursor-pointer group outline-hidden"
                      style={{ outline: 'none' }}
                      onClick={() => setActiveHazardIndex(i)}
                      role="tab"
                      aria-selected={isActive}
                      tabIndex={-1}
                    >
                      {/* Soft glow ring on active */}
                      {isActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="30"
                          fill="#F2A65A"
                          fillOpacity="0.2"
                        />
                      )}
                      
                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="21"
                        className="transition-colors duration-200"
                        fill={isActive ? '#F2A65A' : '#1B4B52'}
                        stroke={isActive ? '#FFFFFF' : '#3FB6A8'}
                        strokeWidth={isActive ? '2.5' : '1.5'}
                        style={{ outline: 'none' }}
                      />

                      {/* Number */}
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        className={`text-[13px] font-black ${
                          isActive ? 'fill-[#172A2B]' : 'fill-white'
                        }`}
                      >
                        0{i + 1}
                      </text>

                      {/* Label placed safely outside the circle */}
                      <text
                        x={node.x}
                        y={node.labelY}
                        textAnchor="middle"
                        className={`text-[13px] font-semibold tracking-tight transition-colors ${
                          isActive ? 'fill-[#F2A65A]' : 'fill-white/85 group-hover:fill-white'
                        }`}
                      >
                        {item.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>

            </div>
            <p className="mt-3 text-xs text-white/60 text-center">
              Click a node or use arrow keys to inspect each hazard
            </p>
          </div>

          {/* Right Column: Numbered List 01-05 (Table of contents style) */}
          <div className="lg:col-span-7 space-y-2.5">
            {HAZARDS.map((hazard, index) => {
              const isActive = activeHazardIndex === index;
              return (
                <div
                  key={hazard.id}
                  onClick={() => setActiveHazardIndex(index)}
                  className={`rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1B4B52] border-[#3FB6A8] shadow-md'
                      : 'bg-[#12343B] border-[#1B4B52] hover:bg-[#1B4B52]/60'
                  }`}
                >
                  {/* Row Header */}
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                        isActive ? 'bg-[#F2A65A] text-[#172A2B]' : 'bg-[#1B4B52] text-white/80'
                      }`}>
                        0{index + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                        {hazard.name}
                      </h3>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`text-white/60 transition-transform ${isActive ? 'rotate-90 text-[#F2A65A]' : ''}`}
                    />
                  </div>

                  {/* Expanded In-Place Content */}
                  {isActive && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#12343B] space-y-3.5 text-sm">
                      <p className="text-white/85 leading-relaxed">
                        {hazard.desc}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Thumbnail photo (un-darkened) */}
                        <div className="sm:col-span-5 relative aspect-16/9 rounded-lg overflow-hidden border border-[#3FB6A8]/40 bg-black">
                          <Image
                            src={hazard.image}
                            alt={hazard.imageAlt}
                            fill
                            sizes="240px"
                            className="object-cover"
                          />
                        </div>

                        {/* What AstroTrack Tracks */}
                        <div className="sm:col-span-7 space-y-1.5">
                          <span className="text-xs font-semibold text-[#3FB6A8] block">
                            What AstroTrack tracks:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {hazard.tracked.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-0.5 rounded bg-[#12343B] border border-[#3FB6A8]/40 text-xs text-white font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-white/70">
                        <span>NASA Human Research Program</span>
                        <a
                          href={hazard.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#F2A65A] hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Official source</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
