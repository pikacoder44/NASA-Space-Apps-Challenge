'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BodyMapInteractive } from '@/components/body/BodyMapInteractive';
import { ShieldCheck, BookOpen, Activity, Layers } from 'lucide-react';
import Link from 'next/link';

export default function BodyMapPage() {
  const [activeLayer, setActiveLayer] = useState<'systems' | 'countermeasures' | 'radiation'>('systems');

  return (
    <div className="space-y-6 text-[#172A2B]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Interactive Body Map
            </span>
            <span className="text-xs text-[#60716E]">
              Space Adaptation Guide
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Interactive Body Systems Map
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Explore how zero gravity affects different areas of your body and your daily health readings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/app/indicators"
            className="px-3 py-1.5 rounded-lg border border-[#D9E2DE] text-xs font-semibold text-[#172A2B] hover:bg-white transition-colors flex items-center gap-1.5"
          >
            <Activity size={14} className="text-[#176B68]" />
            <span>View All Indicators</span>
          </Link>
          <Link
            href="/app/guides"
            className="px-3 py-1.5 rounded-lg bg-[#176B68] text-white text-xs font-semibold hover:bg-[#135754] transition-colors flex items-center gap-1.5"
          >
            <BookOpen size={14} />
            <span>How-To Guides</span>
          </Link>
        </div>
      </div>

      {/* Layer Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-[#D9E2DE]">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-[#176B68]" />
          <span className="text-xs font-bold text-[#172A2B]">Physiological Visualization Layer:</span>
        </div>
        <div className="inline-flex rounded-lg border border-[#D9E2DE] p-0.5 bg-[#F4F6F4]" role="group">
          <button
            type="button"
            onClick={() => setActiveLayer('systems')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeLayer === 'systems' ? 'bg-white text-[#176B68] shadow-xs' : 'text-[#60716E]'
            }`}
          >
            Organ Systems
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('countermeasures')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeLayer === 'countermeasures' ? 'bg-white text-[#176B68] shadow-xs' : 'text-[#60716E]'
            }`}
          >
            Countermeasures
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('radiation')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeLayer === 'radiation' ? 'bg-white text-[#176B68] shadow-xs' : 'text-[#60716E]'
            }`}
          >
            Dosimetry Exposure
          </button>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <BodyMapInteractive />

      {/* NASA Context & Astronaut EVA Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#176B68]" />
              <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
                NASA Human Research Program: 5 Spaceflight Hazards
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                <span className="font-bold text-[#172A2B] block mb-1">1. Space Radiation</span>
                <p className="text-[#60716E]">GCR and solar energetic particles increase lifetime cancer and tissue degeneration risks.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                <span className="font-bold text-[#172A2B] block mb-1">2. Isolation & Confinement</span>
                <p className="text-[#60716E]">Sleep desynchronization, circadian shifts, and behavioural fatigue over multi-month transit.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                <span className="font-bold text-[#172A2B] block mb-1">3. Distance from Earth</span>
                <p className="text-[#60716E]">Communication delays up to 22 minutes each way require autonomous crew self-assessment.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                <span className="font-bold text-[#172A2B] block mb-1">4. Altered Gravity Fields</span>
                <p className="text-[#60716E]">Cephalad fluid shifts, cardiovascular deconditioning, and bone mineral density loss.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70 sm:col-span-2 lg:col-span-2">
                <span className="font-bold text-[#172A2B] block mb-1">5. Hostile Environments</span>
                <p className="text-[#60716E]">Closed life support systems, acoustic noise, microbial biome shifts, and CO2 management.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right NASA Image Card */}
        <div className="lg:col-span-4 rounded-xl border border-[#D9E2DE] overflow-hidden bg-[#122B31] text-white relative min-h-[220px] flex flex-col justify-end p-5">
          <Image
            src="/images/nasa/iss-spacewalk-eva.jpg"
            alt="Astronaut on EVA spacewalk"
            fill
            className="object-cover object-center opacity-60"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122B31] via-[#122B31]/60 to-transparent" />
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#84C2B4]">Operational Countermeasures</span>
            <h3 className="text-sm font-bold text-white">Physical Strain During EVA</h3>
            <p className="text-xs text-[#A2BEB9] leading-relaxed">
              Spacewalks place acute cardiovascular and musculoskeletal loads requiring optimal hydration and autonomic recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
