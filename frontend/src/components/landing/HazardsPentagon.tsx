'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ShieldAlert, Users, Radio, Compass, Box } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

interface HazardData {
  id: string;
  name: string;
  shortLabel: string;
  desc: string;
  image: string;
  imageAlt: string;
  tracked: string[];
  mechanism: string;
  sourceUrl: string;
  sourceName: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

const HAZARDS: HazardData[] = [
  {
    id: 'radiation',
    name: '1. Space Radiation',
    shortLabel: 'Radiation',
    desc: 'Deep-space ionizing radiation from galactic cosmic rays and solar flares increases long-term cancer risk and induces acute hematopoietic and neurovascular shifts.',
    image: '/images/nasa/space-radiation-dosimetry.jpg',
    imageAlt: 'Space radiation mapping and dosimetry research',
    tracked: ['Cumulative Dosimetry (mSv)', 'White Blood Cell & Blood Markers', 'Symptom Checklist'],
    mechanism: 'Shielding mass is constrained; real-time passive & active dosimeters must trigger shelter protocols.',
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    sourceName: 'NASA HRP Radiation Risk Analysis',
    icon: ShieldAlert
  },
  {
    id: 'isolation',
    name: '2. Isolation & Confinement',
    shortLabel: 'Isolation',
    desc: 'Months confined in habitat volume with the same crew disrupts circadian biology, elevates chronic cortisol, and causes cumulative psychological fatigue.',
    image: '/images/nasa/iss-crew-sleep.jpg',
    imageAlt: 'Astronaut inside individual crew quarters sleep station',
    tracked: ['Sleep Duration & Sleep Debt', 'Subjective Mood Score (1-10)', 'Cognitive Reaction Test'],
    mechanism: 'Subtle shifts in nocturnal heart rate variability (rMSSD) precede overt clinical behavioral stress.',
    sourceUrl: 'https://www.nasa.gov/hrp/risks/',
    sourceName: 'NASA Behavioral Health & Performance',
    icon: Users
  },
  {
    id: 'distance',
    name: '3. Distance from Earth',
    shortLabel: 'Distance',
    desc: 'Mars missions operate with up to 22-minute radio latency in each direction. Telemedicine cannot guide emergency intubations or rapid clinical decisions.',
    image: '/images/nasa/mars-transit-concept.jpg',
    imageAlt: 'Orion deep space exploration vehicle transit view',
    tracked: ['Automated Telemetry Triage', 'Onboard Guideline Protocol Engine', 'Pending Ground Sync Queue'],
    mechanism: 'Autonomous three-tier classification (Normal / Watch / Act Now) provides immediate guidance without waiting for Houston.',
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    sourceName: 'NASA Exploration Medical Capability (ExMC)',
    icon: Radio
  },
  {
    id: 'gravity',
    name: '4. Gravity Fields',
    shortLabel: 'Microgravity',
    desc: 'Transitions between 1G, 0G transit, and 0.38G on Mars trigger orthostatic intolerance, muscular atrophy, bone mineral density decline, and fluid shifts.',
    image: '/images/nasa/iss-exercise-ared.jpg',
    imageAlt: 'Astronaut exercising on the Advanced Resistive Exercise Device',
    tracked: ['Resting Heart Rate (bpm)', 'Blood Pressure (Sys / Dia)', 'Core Body Temperature (°C)'],
    mechanism: 'Daily resistive exercise counteracts muscle wasting; cardiovascular vitals confirm autonomic adaptation.',
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    sourceName: 'NASA Cardiovascular & Sensorimotor Health',
    icon: Compass
  },
  {
    id: 'hostile_environment',
    name: '5. Hostile Environments',
    shortLabel: 'Environment',
    desc: 'A closed environmental habitat recirculates air, water, and contaminants. Microbial balance shifts, and metabolic demands fluctuate under enclosed life support.',
    image: '/images/nasa/iss-crew-meal.jpg',
    imageAlt: 'Crew members in habitat module sharing meal',
    tracked: ['Blood Glucose (mg/dL)', 'Skin Temperature & Thermal Drift', 'Routine Protocol Checklist'],
    mechanism: 'Metabolic shifts and nutritional absorption vary in microgravity; continuous tracking verifies metabolic stability.',
    sourceUrl: 'https://www.nasa.gov/hrp/hazards/',
    sourceName: 'NASA Environmental Health & Toxicology',
    icon: Box
  }
];

export function HazardsPentagon() {
  const [activeHazardIndex, setActiveHazardIndex] = useState(0);
  const activeHazard = HAZARDS[activeHazardIndex];

  // Pentagon coordinates for SVG (radius 130px, center 160, 160)
  const pentagonNodes = [
    { x: 160, y: 35 },   // Top (Radiation)
    { x: 280, y: 120 },  // Top Right (Isolation)
    { x: 235, y: 260 },  // Bottom Right (Distance)
    { x: 85,  y: 260 },  // Bottom Left (Gravity)
    { x: 40,  y: 120 },  // Top Left (Hostile Environment)
  ];

  return (
    <section id="hazards" className="py-24 sm:py-32 bg-[#0A1A1F] text-white relative overflow-hidden border-t border-b border-[#1E373C]">
      {/* Background Star Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #3FB6A8 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#3FB6A8] uppercase">
              02 — The 5 NASA Hazards
            </span>
            <div className="w-12 h-px bg-[#233E44]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
            Five hazards every crew carries with them.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#A2BEB9] max-w-3xl leading-relaxed">
            NASA Human Research Program groups spaceflight risks into five interdependent hazards. AstroTrack maps each hazard directly to measurable physiological telemetry.
          </p>
        </Reveal>

        {/* Content: SVG Pentagon on Desktop, Tabs on Mobile */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Desktop SVG Pentagon Diagram (5/12) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center p-4">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              
              <svg width="320" height="320" viewBox="0 0 320 320" className="overflow-visible select-none">
                {/* Center Node "Crew" */}
                <circle cx="160" cy="160" r="32" className="fill-[#0F2A30] stroke-[#3FB6A8] stroke-width-2" />
                <text x="160" y="156" textAnchor="middle" className="text-[11px] font-extrabold fill-white tracking-widest uppercase">
                  CREW
                </text>
                <text x="160" y="170" textAnchor="middle" className="text-[9px] font-semibold fill-[#A2BEB9]">
                  CENTER
                </text>

                {/* Connecting lines from Center to 5 nodes */}
                {pentagonNodes.map((node, i) => {
                  const isActive = activeHazardIndex === i;
                  return (
                    <line
                      key={`line-${i}`}
                      x1="160"
                      y1="160"
                      x2={node.x}
                      y2={node.y}
                      stroke={isActive ? '#F2A65A' : '#234954'}
                      strokeWidth={isActive ? '2.5' : '1.2'}
                      strokeDasharray={isActive ? 'none' : '4 4'}
                      className="transition-colors duration-300"
                    />
                  );
                })}

                {/* Outer pentagon outline connecting nodes */}
                <polygon
                  points={pentagonNodes.map(n => `${n.x},${n.y}`).join(' ')}
                  fill="none"
                  stroke="#1E373C"
                  strokeWidth="1"
                />

                {/* 5 Outer Hazard Nodes */}
                {pentagonNodes.map((node, i) => {
                  const isActive = activeHazardIndex === i;
                  const item = HAZARDS[i];
                  return (
                    <g
                      key={item.id}
                      className="cursor-pointer group"
                      onClick={() => setActiveHazardIndex(i)}
                      tabIndex={0}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={item.name}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setActiveHazardIndex(i);
                        }
                      }}
                    >
                      {/* Outer pulse when active */}
                      {isActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="26"
                          className="fill-[#F2A65A]/20 animate-ping"
                        />
                      )}
                      
                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="20"
                        className={`transition-all duration-300 ${
                          isActive
                            ? 'fill-[#F2A65A] stroke-white stroke-width-2 shadow-lg'
                            : 'fill-[#0F2A30] stroke-[#234954] stroke-width-1.5 hover:stroke-[#3FB6A8]'
                        }`}
                      />

                      {/* Number inside */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        textAnchor="middle"
                        className={`text-xs font-black ${
                          isActive ? 'fill-[#172A2B]' : 'fill-[#C0D1CE]'
                        }`}
                      >
                        0{i + 1}
                      </text>

                      {/* Label under/over node */}
                      <text
                        x={node.x}
                        y={node.y > 160 ? node.y + 24 : node.y - 18}
                        textAnchor="middle"
                        className={`text-[11px] font-bold tracking-tight transition-colors ${
                          isActive ? 'fill-[#F2A65A]' : 'fill-[#A2BEB9] group-hover:fill-white'
                        }`}
                      >
                        {item.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>

            </div>
            <p className="mt-4 text-xs text-[#829994] text-center">
              Click any node to explore its clinical tracking profile
            </p>
          </div>

          {/* Mobile Tab Pills (shown only on small screens) */}
          <div className="lg:hidden flex flex-wrap gap-2 pb-2">
            {HAZARDS.map((h, i) => {
              const isActive = activeHazardIndex === i;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHazardIndex(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#F2A65A] text-[#172A2B]'
                      : 'bg-[#0F2A30] text-[#A2BEB9] border border-[#234954]'
                  }`}
                >
                  0{i + 1} {h.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Right Panel: Hazard Detail Card (7/12) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHazard.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0F2A30] border border-[#234954] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl"
              >
                {/* Title and Icon */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#234954]">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-[#F2A65A] uppercase block">
                      Hazard Classification
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {activeHazard.name}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#176B68]/30 border border-[#3FB6A8]/40 flex items-center justify-center shrink-0 text-[#3FB6A8]">
                    <activeHazard.icon size={24} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#C0D1CE] leading-relaxed">
                  {activeHazard.desc}
                </p>

                {/* Grid: Photo + What AstroTrack Tracks */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Photo */}
                  <div className="sm:col-span-5 relative aspect-4/3 rounded-xl overflow-hidden border border-[#234954]">
                    <Image
                      src={activeHazard.image}
                      alt={activeHazard.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-white/80 font-medium">
                      NASA Public Domain
                    </span>
                  </div>

                  {/* What AstroTrack Tracks */}
                  <div className="sm:col-span-7 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3FB6A8]">
                      What AstroTrack Tracks
                    </span>
                    <ul className="space-y-1.5">
                      {activeHazard.tracked.map((metric) => (
                        <li key={metric} className="text-xs sm:text-sm text-white font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F2A65A]" />
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-[#829994] pt-1 leading-normal italic">
                      {activeHazard.mechanism}
                    </p>
                  </div>
                </div>

                {/* Source link footer */}
                <div className="pt-4 border-t border-[#234954] flex items-center justify-between text-xs">
                  <span className="text-[#829994]">{activeHazard.sourceName}</span>
                  <a
                    href={activeHazard.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#3FB6A8] hover:text-white font-bold transition-colors"
                  >
                    <span>Official NASA Literature</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
