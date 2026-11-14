'use client';

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Sparkles, Info, X } from 'lucide-react';

export function DemoScenarioBanner() {
  const { activeScenario, setScenario, loading } = useHealth();
  const [showInfoPopover, setShowInfoPopover] = useState(false);

  return (
    <aside
      aria-label="Demo environment status and scenario selector"
      className="bg-[#122B31] text-[#EAF0ED] border-b border-[#1E434C] px-3 py-1.5 sm:px-6 transition-colors text-[13px]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Compact Tag & Disclaimer */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 bg-[#176B68] text-white px-2 py-0.5 rounded-full text-xs font-semibold tracking-normal shrink-0">
            <Sparkles size={12} aria-hidden="true" />
            Simulated Data
          </span>

          <p className="hidden md:inline text-[#C0D1CE] truncate text-xs">
            <strong className="text-white font-semibold">NASA Space Apps 2026 Prototype:</strong> Personal-baseline monitoring demo. Not a diagnostic device.
          </p>

          {/* Mobile info icon button */}
          <button
            type="button"
            onClick={() => setShowInfoPopover(!showInfoPopover)}
            className="md:hidden text-[#A2BEB9] hover:text-white p-0.5 rounded cursor-pointer"
            aria-label="Toggle prototype safety notice"
          >
            <Info size={14} />
          </button>
        </div>

        {/* Right: Compact Scenario Segmented Control */}
        <div className="flex items-center gap-1.5 shrink-0" role="group" aria-label="Scenario Selector">
          <span className="hidden sm:inline text-[#A2BEB9] text-xs font-medium mr-0.5">
            Scenario:
          </span>

          <button
            type="button"
            disabled={loading}
            onClick={() => setScenario('day90_yellow')}
            className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeScenario === 'day90_yellow'
                ? 'bg-[#A96617] text-white shadow-xs font-semibold'
                : 'text-[#D8E6E3] hover:bg-[#1A3840]'
            }`}
            title="Day 90 Mars scenario: sleep deficit with rising resting HR"
          >
            Day 90 Yellow
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setScenario('nominal_green')}
            className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeScenario === 'nominal_green'
                ? 'bg-[#247A55] text-white shadow-xs font-semibold'
                : 'text-[#D8E6E3] hover:bg-[#1A3840]'
            }`}
            title="Nominal baseline cruise: all metrics within personal target window"
          >
            Nominal Green
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setScenario('insufficient_data')}
            className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              activeScenario === 'insufficient_data'
                ? 'bg-[#6B7A78] text-white shadow-xs font-semibold'
                : 'text-[#D8E6E3] hover:bg-[#1A3840]'
            }`}
            title="Link degraded test state: observations unknown/stale"
          >
            Degraded Link
          </button>
        </div>
      </div>

      {/* Mobile Popover */}
      {showInfoPopover && (
        <div className="md:hidden mt-2 p-2.5 rounded-lg bg-[#1A3840] border border-[#234954] text-xs text-[#D8E6E3] flex items-start justify-between gap-2">
          <p className="leading-relaxed">
            <strong>Prototype Note:</strong> All values are synthetic demonstration data for the NASA Space Apps Challenge 2026. AAHMS is not a certified medical device and thresholds are prototype demo rules.
          </p>
          <button
            type="button"
            onClick={() => setShowInfoPopover(false)}
            className="text-[#A2BEB9] hover:text-white p-0.5 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </aside>
  );
}
