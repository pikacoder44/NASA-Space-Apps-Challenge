'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ExternalLink, 
  HeartPulse, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Sparkles, 
  Database,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  const hazards = [
    {
      title: 'Space Radiation',
      hazard: 'Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE)',
      impact: 'Ionizing radiation penetrates spacecraft shielding, causing cumulative cellular and DNA damage. Long-term risks include carcinogenesis and endothelial tissue stress.',
      aahmsApproach: 'AAHMS tracks cumulative absorbed dose in mSv with transit daily rates, referenced against NASA career guidelines with full source context.'
    },
    {
      title: 'Isolation and Confinement',
      hazard: 'Psychological & Circadian Disruption',
      impact: 'Altered light-dark cycles, continuous acoustic ventilation noise, and interpersonal confinement lead to sleep architecture fragmentation and behavioral fatigue.',
      aahmsApproach: 'AAHMS monitors nocturnal sleep duration, assesses subjective mood on standardized Likert scales, and correlates sleep debt with resting pulse drift.'
    },
    {
      title: 'Distance from Earth',
      hazard: 'Communication Time Lag (Up to 22 min each way)',
      impact: 'In trans-Mars space, real-time emergency telephone calls to flight surgeons are physically impossible due to speed-of-light delays.',
      aahmsApproach: 'AAHMS provides offline-first logging on-device, executing personal baseline deviation models locally and preparing structured downlinks for ground windows.'
    },
    {
      title: 'Gravity Fields / Altered Gravity',
      hazard: 'Cephalad Fluid Shifts & Musculoskeletal Atrophy',
      impact: 'Without 1G hydrostatic load, ~2L of venous blood shifts upward into the thoracic and cranial cavities. Bone mineral density drops 1.0–1.5% monthly in cancellous bone.',
      aahmsApproach: 'AAHMS tracks daily countermeasure exercise adherence (ARED/T2), logs SANS vision acuity checks, and correlates heart rate variability with autonomic recalibration.'
    },
    {
      title: 'Hostile Closed Environments',
      hazard: 'Life Support Systems & Cabin Air Chemistry',
      impact: 'Elevated cabin CO2, microbial biome shifts, and acoustic noise add persistent physiological stress.',
      aahmsApproach: 'Advisory rules recommend checking sleeping quarter CO2 partial pressure (< 2.5 mmHg) and cabin acoustics when sleep disruption or elevated pulse is detected.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 text-[#172A2B]">
      {/* 1. Hero Banner with Authentic NASA Imagery */}
      <div className="relative rounded-2xl overflow-hidden bg-[#122B31] border border-[#D9E2DE] shadow-sm">
        <div className="relative h-48 sm:h-64 w-full">
          <Image
            src="/images/nasa/iss-cupola-earth.jpg"
            alt="Earth limb seen from ISS Cupola module"
            fill
            priority
            className="object-cover object-center brightness-75 contrast-110"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122B31] via-[#122B31]/70 to-[#122B31]/40" />
        </div>

        <div className="p-6 sm:p-8 space-y-3 relative z-10 -mt-16 sm:-mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#176B68] text-white text-xs font-semibold shadow-xs">
            <HeartPulse size={14} />
            <span>NASA Space Apps Challenge 2026 Project</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Science Behind Autonomous Astronaut Health Monitoring
          </h1>
          <p className="text-sm sm:text-base text-[#A2BEB9] max-w-3xl leading-relaxed">
            Why deep-space human exploration requires comparing an astronaut with their own calibrated baseline rather than Earth population averages.
          </p>
        </div>
      </div>

      {/* 2. Core Engineering Principle */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#176B68] uppercase tracking-wider">
          <ShieldCheck size={16} />
          <span>Core Engineering Principle</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#172A2B]">
          Personal Baseline Calibration vs. Population Brackets
        </h2>
        <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed">
          In terrestrial medicine, clinical guidelines rely on broad statistical population ranges (e.g. resting heart rate 60–100 bpm, blood pressure &lt; 120/80 mmHg). In microgravity, cephalad fluid shifts contract blood plasma by 10–15% and reset baroreceptor setpoints. An astronaut whose nominal resting pulse in transit is 58 bpm experiencing an elevation to 74 bpm has experienced a +27% cardiovascular deviation that demands operational attention, even though 74 bpm is technically &quot;normal&quot; on Earth.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-1">
            <span className="text-xs font-bold text-[#172A2B]">60-Day Rolling Window</span>
            <p className="text-xs text-[#60716E]">Dynamically recalibrates to spaceflight cruise adaptations.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-1">
            <span className="text-xs font-bold text-[#172A2B]">Zero False Positives</span>
            <p className="text-xs text-[#60716E]">Prevents unnecessary alerts for athletic, low-heart-rate pilots.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-1">
            <span className="text-xs font-bold text-[#172A2B]">Explainable Triggers</span>
            <p className="text-xs text-[#60716E]">Clear transparent factors showing exact percentage baseline shifts.</p>
          </div>
        </div>
      </div>

      {/* 3. System Architecture Breakdown */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold text-[#176B68] uppercase tracking-wider">Technical Architecture</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172A2B] mt-1">
            Frontend, Backend & AI Integration Contract
          </h2>
          <p className="text-xs sm:text-sm text-[#60716E] mt-1">
            Built strictly adhering to the technical specification separating UI, FastAPI backend, and Gemini models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white text-[#176B68] flex items-center justify-center shadow-xs">
                <Layers size={16} />
              </div>
              <h3 className="font-bold text-sm text-[#172A2B]">Next.js Frontend (This UI)</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Client-side telemetry visualization, interactive body map, daily log stepper (&lt; 60s), and salted Web Crypto session security in local storage.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#176B68]">100% Offline-First UI</span>
          </div>

          <div className="p-5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white text-[#176B68] flex items-center justify-center shadow-xs">
                <Cpu size={16} />
              </div>
              <h3 className="font-bold text-sm text-[#172A2B]">FastAPI Backend Server</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                REST API contract exposing telemetry ingestion, status evaluation, and store-and-forward batch queueing for ground transmission windows.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#176B68]">Python 3.11 + Pydantic v2</span>
          </div>

          <div className="p-5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-white text-[#176B68] flex items-center justify-center shadow-xs">
                <Sparkles size={16} />
              </div>
              <h3 className="font-bold text-sm text-[#172A2B]">Google Gemini via Backend</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Narrative clinical explanations synthesized through backend proxy calls. When unlinked, AAHMS falls back to deterministic rule summaries.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#176B68]">Gemini 1.5 Pro / Flash</span>
          </div>
        </div>
      </div>

      {/* 4. 5 Hazards Analysis */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-[#176B68] uppercase tracking-wider">Physiological Countermeasures</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#172A2B] mt-1">
            Addressing NASA’s 5 Hazards of Human Spaceflight
          </h2>
          <p className="text-xs sm:text-sm text-[#60716E] mt-1">
            Synthesized from NASA Human Research Program (HRP) evidence books and Canadian Space Agency studies.
          </p>
        </div>

        <div className="space-y-4">
          {hazards.map((h, idx) => (
            <div key={h.title} className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9E2DE]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#DCEDEA] text-[#176B68] font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-[#172A2B]">{h.title}</h3>
                </div>
                <span className="text-xs text-[#60716E] hidden sm:inline">{h.hazard}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-[#F4F6F4] space-y-1">
                  <span className="font-bold text-[#172A2B] block">Spaceflight Hazard Impact:</span>
                  <p className="text-[#60716E] leading-relaxed">{h.impact}</p>
                </div>
                <div className="p-3.5 rounded-lg bg-[#DCEDEA]/60 border border-[#B6D6D0] space-y-1">
                  <span className="font-bold text-[#176B68] block">AAHMS Software Countermeasure:</span>
                  <p className="text-[#172A2B] leading-relaxed">{h.aahmsApproach}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Official Research Links & Attributions */}
      <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
          Official NASA & Space Agency Research Resources
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm">
          <li>
            <a
              href="https://www.nasa.gov/hrp/hazards/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#176B68] hover:underline"
            >
              <span>NASA Human Research Program: 5 Hazards of Human Spaceflight</span>
              <ExternalLink size={13} />
            </a>
          </li>
          <li>
            <a
              href="https://www.nasa.gov/hrp/risks/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#176B68] hover:underline"
            >
              <span>NASA HRP: Evidence Books of Human Spaceflight Risks</span>
              <ExternalLink size={13} />
            </a>
          </li>
          <li>
            <a
              href="https://images.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-[#176B68] hover:underline"
            >
              <span>NASA Image and Video Library (Official Public Domain Archives)</span>
              <ExternalLink size={13} />
            </a>
          </li>
        </ul>
        <p className="text-[11px] text-[#60716E] pt-3 border-t border-[#D9E2DE]">
          Disclaimer: NASA does not endorse student prototypes or non-U.S. Government websites. Citations reflect foundational scientific literature used in prototype requirements design.
        </p>
      </div>

      <div className="flex justify-center pt-2">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#176B68] text-white text-sm font-bold hover:bg-[#135754] transition-all shadow-xs"
        >
          <span>Open Mission Console</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
