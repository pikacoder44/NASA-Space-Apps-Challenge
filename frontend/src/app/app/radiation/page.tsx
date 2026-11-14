'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useHealth } from '@/context/HealthContext';
import { TrendChart } from '@/components/charts/TrendChart';
import { generateTrendHistory } from '@/data/trendData';
import { Radio, ExternalLink, ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RadiationTrackerPage() {
  const { overview } = useHealth();
  const [range, setRange] = useState<'7d' | '30d' | 'mission'>('mission');

  if (!overview) return null;

  const rad = overview.radiation;
  const trendData = generateTrendHistory('radiation_dose', range);

  return (
    <div className="space-y-6 text-[#172A2B]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Environmental Dosimetry
            </span>
            <span className="text-xs text-[#60716E]">
              Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Cumulative Space Radiation Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Monitors ionizing radiation absorbed dose across long-duration interplanetary cruise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#247A55] bg-[#E4F2E9] px-3 py-1.5 rounded-lg border border-[#BDE0CB]">
            Nominal Cruise Rate
          </span>
        </div>
      </div>

      {/* Primary Dosimetry Readout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <span className="text-xs text-[#60716E] font-bold block mb-1">
            Total Absorbed Dose (Sol 90)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#172A2B]">
              {rad.cumulativeDoseMsv}
            </span>
            <span className="text-xs text-[#60716E]">mSv</span>
          </div>
          <span className="text-xs text-[#60716E] block mt-1">
            Passive + active crew dosimeter array
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <span className="text-xs text-[#60716E] font-bold block mb-1">
            Daily Accumulation Rate
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#176B68]">
              +{rad.dailyRateMsv}
            </span>
            <span className="text-xs text-[#60716E]">mSv / day</span>
          </div>
          <span className="text-xs text-[#60716E] block mt-1">
            Interplanetary transit baseline
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <span className="text-xs text-[#60716E] font-bold block mb-1">
            30-Day Exposure Total
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#172A2B]">
              {rad.thirtyDayAccumulationMsv}
            </span>
            <span className="text-xs text-[#60716E]">mSv</span>
          </div>
          <span className="text-xs text-[#60716E] block mt-1">
            Rolling 30-day accumulation
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <span className="text-xs text-[#60716E] font-bold block mb-1">
            Dosimeter Status
          </span>
          <div className="flex items-center gap-1.5 mt-1 text-sm font-bold text-[#247A55]">
            <Radio size={16} />
            <span>Telemetry Online</span>
          </div>
          <span className="text-xs text-[#60716E] block mt-1">
            Array: {rad.sensorLocation}
          </span>
        </div>
      </div>

      {/* NASA Photographic Feature Card & Storm Shelter Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2DE]">
            <ShieldAlert size={18} className="text-[#176B68]" />
            <h2 className="text-sm font-bold text-[#172A2B]">
              Solar Particle Event (SPE) Storm Shelter Guidance (Simulated Protocol)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#172A2B] leading-relaxed">
            During coronal mass ejections or solar energetic particle storms, simulated dosimeter monitoring triggers a shelter advisory if ambient rates exceed <strong>5.0 mSv/hour</strong> <span className="text-xs text-[#A96617] font-semibold">(illustrative demo value, not NASA guidance)</span>. Operational protocol suggests seeking vehicle storm shelter protection, utilizing water storage and dense habitat bulkhead shielding.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]">
              <span className="font-bold text-[#172A2B] block mb-0.5">Quiet Transit (GCR Dominant):</span>
              <p className="text-[#60716E]">Simulated baseline galactic cosmic ray exposure: ~1.45–1.80 mSv/day <span className="text-[#A96617] font-medium">(illustrative demo value, not NASA guidance)</span>.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#DCEDEA]/60 border border-[#B6D6D0]">
              <span className="font-bold text-[#176B68] block mb-0.5">Storm Shelter Countermeasure:</span>
              <p className="text-[#172A2B]">Hydrogen-rich water storage surrounds crew berths, estimated ~40% flux attenuation <span className="text-[#A96617] font-medium">(illustrative demo value, not NASA guidance)</span>.</p>
            </div>
          </div>
        </div>

        {/* Right NASA Image Card */}
        <div className="lg:col-span-4 rounded-xl border border-[#D9E2DE] overflow-hidden bg-[#122B31] text-white relative min-h-[220px] flex flex-col justify-end p-5">
          <Image
            src="/images/nasa/space-radiation-dosimetry.jpg"
            alt="Van Allen Radiation Belt Spacecraft Mapping"
            fill
            className="object-cover object-center opacity-65"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122B31] via-[#122B31]/60 to-transparent" />
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#84C2B4]">NASA Space Radiation Analysis</span>
            <h3 className="text-sm font-bold text-white">Van Allen Probes Mapping</h3>
            <p className="text-xs text-[#A2BEB9] leading-relaxed">
              NASA observational models map high-energy particle distributions to forecast interplanetary transit exposure.
            </p>
          </div>
        </div>
      </div>

      {/* Cumulative Timeline Visualization */}
      <TrendChart
        data={trendData.data}
        title="Cumulative Radiation Dose Curve"
        unit="mSv"
        baselineLabel="Transit Trajectory (~1.45 mSv/day)"
        activeRange={range}
        onRangeChange={setRange}
      />

      {/* NASA / CSA Radiation Standard Context */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#172A2B]">
            Space Radiation Guidance & Reference Context
          </h2>
          <p className="text-xs sm:text-sm text-[#172A2B] leading-relaxed mt-1">
            {rad.contextNote}
          </p>
        </div>

        {/* Career Reference Progress Bar */}
        <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#172A2B]">
              {rad.referenceLimitLabel}
            </span>
            <span className="text-[#176B68] font-bold">
              {Math.round((rad.cumulativeDoseMsv / rad.referenceLimitMsv) * 100)}% of 600 mSv
            </span>
          </div>
          <div className="w-full bg-[#D9E2DE] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#176B68] h-full rounded-full transition-all"
              style={{ width: `${(rad.cumulativeDoseMsv / rad.referenceLimitMsv) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#60716E] leading-relaxed italic">
            Important distinction: The 600 mSv NASA career standard is a lifetime exposure guideline designed to limit career radiation carcinogenesis risk to &lt; 3% REID. It is not an acute daily toxicity limit.
          </p>
        </div>

        {/* Attribution link to Canadian Space Agency & NASA */}
        <div className="pt-2 border-t border-[#D9E2DE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#60716E]">
          <span>Attribution: {rad.citation}</span>
          <a
            href="https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#176B68] hover:underline"
          >
            <span>CSA Radiation Monitoring Paper</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
