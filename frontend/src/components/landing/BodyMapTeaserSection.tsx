'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, Brain, Heart, Dumbbell } from 'lucide-react';
import { Reveal } from '../motion/MotionHelpers';

interface Hotspot {
  id: string;
  name: string;
  cx: number;
  cy: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  mechanism: string;
  clinicalImpact: string;
  indicators: { name: string; status: 'normal' | 'warning' }[];
  citation: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'brain',
    name: 'Brain & Sleep Architecture',
    cx: 140,
    cy: 50,
    icon: Brain,
    mechanism: 'Loss of 24-hour solar cycle + microgravity intracranial venous pressure engorgement.',
    clinicalImpact: 'Circadian desynchronosis, sleep debt, elevated nocturnal cortisol, and reduced cognitive vigilance.',
    indicators: [
      { name: 'Sleep Duration (5.2 h)', status: 'warning' },
      { name: 'Subjective Mood (7.0/10)', status: 'normal' }
    ],
    citation: 'NASA HRP Behavioral Health & Performance'
  },
  {
    id: 'eyes',
    name: 'Eyes & Vision (SANS)',
    cx: 140,
    cy: 75,
    icon: Eye,
    mechanism: 'Cephalic fluid redistribution elevates optic sheath subarachnoid pressure, flattening posterior globe.',
    clinicalImpact: 'Spaceflight Associated Neuro-ocular Syndrome (SANS), hyperopic refractive shifts, and cotton wool spots.',
    indicators: [
      { name: 'SANS Vision Score', status: 'normal' },
      { name: 'Intracranial Pressure Proxy', status: 'normal' }
    ],
    citation: 'NASA HRP Neuro-Ocular Investigations'
  },
  {
    id: 'heart',
    name: 'Heart & Cardiovascular System',
    cx: 140,
    cy: 140,
    icon: Heart,
    mechanism: 'Absence of hydrostatic pressure gradient causes ~2L fluid shift toward head and thorax.',
    clinicalImpact: 'Decrease in circulating blood plasma volume by 10-15%, stroke volume changes, post-flight orthostatic intolerance.',
    indicators: [
      { name: 'Resting Heart Rate (75 bpm)', status: 'warning' },
      { name: 'Blood Pressure (122/81)', status: 'normal' }
    ],
    citation: 'NASA Twins Study Cardiovascular Findings'
  },
  {
    id: 'bones',
    name: 'Bones & Musculoskeletal',
    cx: 140,
    cy: 220,
    icon: Dumbbell,
    mechanism: 'Unloading of postural weight-bearing bones (calcaneus, femur, lumbar spine) and skeletal muscles.',
    clinicalImpact: 'Bone mineral density loss up to 1% per month without resistive exercise; hypercalciuria and kidney stone risk.',
    indicators: [
      { name: 'ARED Protocol Compliance', status: 'normal' },
      { name: 'Core Temperature (36.8°C)', status: 'normal' }
    ],
    citation: 'NASA HRP Musculoskeletal Alterations'
  }
];

export function BodyMapTeaserSection() {
  const [activeHotspotId, setActiveHotspotId] = useState('heart');
  const activeHotspot = HOTSPOTS.find(h => h.id === activeHotspotId) || HOTSPOTS[0];

  return (
    <section className="py-24 sm:py-32 bg-[#F4F6F4] text-[#172A2B] border-t border-[#D9E2DE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold tracking-widest text-[#176B68] uppercase">
              06 — Interactive Anatomy
            </span>
            <div className="w-12 h-px bg-[#D9E2DE]" />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#172A2B]">
                Interactive Human Body Map
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#60716E] max-w-2xl leading-relaxed">
                Click hotspots on the astronaut figure to inspect how microgravity and cosmic transit affect targeted anatomical zones.
              </p>
            </div>
            <Link
              href="/body-map"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#176B68] hover:text-[#125553] shrink-0"
            >
              <span>Explore full 3D body map</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        {/* Interactive Split Container */}
        <div className="mt-12 bg-white border border-[#D9E2DE] rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Astronaut Figure (5/12) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#F8FAFC] rounded-2xl border border-[#D9E2DE]">
              <div className="relative w-[280px] h-[380px] select-none">
                
                <svg viewBox="0 0 280 380" className="w-full h-full">
                  {/* Clean stylized body silhouette */}
                  <g fill="none" stroke="#176B68" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
                    {/* Head */}
                    <ellipse cx="140" cy="55" rx="22" ry="26" fill="#EAF0ED" />
                    
                    {/* Neck */}
                    <path d="M133 81v10 M147 81v10" />

                    {/* Torso */}
                    <path d="M110 95 Q140 90 170 95 L164 190 Q140 195 116 190 Z" fill="#EAF0ED" />

                    {/* Left Arm */}
                    <path d="M110 95 Q90 140 85 190" />
                    
                    {/* Right Arm */}
                    <path d="M170 95 Q190 140 195 190" />

                    {/* Legs */}
                    <path d="M125 190 L120 330" />
                    <path d="M155 190 L160 330" />
                  </g>

                  {/* Hotspots */}
                  {HOTSPOTS.map((spot) => {
                    const isSelected = activeHotspotId === spot.id;
                    return (
                      <g
                        key={spot.id}
                        className="cursor-pointer group"
                        onClick={() => setActiveHotspotId(spot.id)}
                      >
                        {/* Glow ring */}
                        {isSelected && (
                          <circle
                            cx={spot.cx}
                            cy={spot.cy}
                            r="22"
                            className="fill-[#F2A65A]/25 animate-ping"
                          />
                        )}

                        {/* Outer target */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r="15"
                          className={`transition-all duration-300 ${
                            isSelected
                              ? 'fill-[#F2A65A] stroke-white stroke-2'
                              : 'fill-white stroke-[#176B68] stroke-2 hover:fill-[#EAF0ED]'
                          }`}
                        />

                        {/* Inner dot */}
                        <circle
                          cx={spot.cx}
                          cy={spot.cy}
                          r="4"
                          className={isSelected ? 'fill-[#172A2B]' : 'fill-[#176B68]'}
                        />
                      </g>
                    );
                  })}
                </svg>

              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {HOTSPOTS.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setActiveHotspotId(h.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activeHotspotId === h.id
                        ? 'bg-[#176B68] text-white'
                        : 'bg-white border border-[#D9E2DE] text-[#60716E]'
                    }`}
                  >
                    {h.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel: Physiological Zone Analysis (7/12) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHotspot.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EAF0ED] text-[#176B68] flex items-center justify-center">
                        <activeHotspot.icon size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#176B68]">
                          Anatomical System
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-[#172A2B]">
                          {activeHotspot.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#60716E] block mb-1">
                        Microgravity Mechanism
                      </span>
                      <p className="text-sm text-[#172A2B] leading-relaxed">
                        {activeHotspot.mechanism}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#60716E] block mb-1">
                        Clinical Mission Impact
                      </span>
                      <p className="text-sm text-[#60716E] leading-relaxed">
                        {activeHotspot.clinicalImpact}
                      </p>
                    </div>

                    {/* Associated Indicators with status badges */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#60716E] block mb-2">
                        Monitored Biometric Markers
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeHotspot.indicators.map((ind) => (
                          <span
                            key={ind.name}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                              ind.status === 'warning'
                                ? 'bg-[#FBF0D9] border-[#EED8A7] text-[#8A520F]'
                                : 'bg-[#E4F2E9] border-[#BDE0CB] text-[#247A55]'
                            }`}
                          >
                            {ind.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#D9E2DE] flex items-center justify-between text-xs text-[#60716E]">
                    <span>Reference: {activeHotspot.citation}</span>
                    <Link
                      href="/body-map"
                      className="font-bold text-[#176B68] hover:underline"
                    >
                      View full zone breakdown →
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
