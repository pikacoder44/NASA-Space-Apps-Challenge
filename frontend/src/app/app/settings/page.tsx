'use client';

import React, { useState } from 'react';
import { useHealth } from '../../../context/HealthContext';
import { 
  Sparkles, 
  Download, 
  Info, 
  CheckCircle2, 
  Sliders 
} from 'lucide-react';

export default function SettingsPage() {
  const { overview, activeScenario, setScenario, loading } = useHealth();
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    if (!overview) return;
    const blob = new Blob([JSON.stringify(overview, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AAHMS_Telemetry_Sol_${overview.missionDay}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#D9E2DE]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
            System Preferences
          </span>
          <span className="text-xs text-[#60716E]">
            Sol 90 Flight Profile
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172A2B] mt-0.5">
          Mission Settings & Data Controls
        </h1>
        <p className="text-xs text-[#60716E] mt-0.5">
          Configure demonstration scenarios, units of measurement, accessibility preferences, and local data export.
        </p>
      </div>

      {exportSuccess && (
        <div className="p-3 rounded-lg bg-[#E4F2E9] border border-[#BDE0CB] text-[#247A55] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Local telemetry export successfully downloaded as JSON!</span>
        </div>
      )}

      {/* 1. Demonstration Scenario Selector */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2DE]">
          <Sparkles size={16} className="text-[#176B68]" />
          <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
            Evaluator Scenario Preset Selector
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => setScenario('day90_yellow')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
              activeScenario === 'day90_yellow'
                ? 'bg-[#FBF0D9]/40 border-[#A96617] ring-1 ring-[#A96617]'
                : 'bg-white border-[#D9E2DE] hover:bg-[#F4F6F4]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#172A2B]">Day 90 Mars (Yellow)</span>
              <span className="w-2 h-2 rounded-full bg-[#A96617]" />
            </div>
            <p className="text-xs text-[#60716E]">
              4-night sleep deficit (&lt;6h), rising resting HR (+13 bpm), depressed HRV, lowered mood.
            </p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setScenario('nominal_green')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
              activeScenario === 'nominal_green'
                ? 'bg-[#E4F2E9]/40 border-[#247A55] ring-1 ring-[#247A55]'
                : 'bg-white border-[#D9E2DE] hover:bg-[#F4F6F4]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#172A2B]">Nominal Cruise (Green)</span>
              <span className="w-2 h-2 rounded-full bg-[#247A55]" />
            </div>
            <p className="text-xs text-[#60716E]">
              All physiological vitals tracking calibrated 60-day baseline. Sleep 7.4h, HR 63 bpm.
            </p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => setScenario('insufficient_data')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
              activeScenario === 'insufficient_data'
                ? 'bg-[#EEF1F0] border-[#6B7A78] ring-1 ring-[#6B7A78]'
                : 'bg-white border-[#D9E2DE] hover:bg-[#F4F6F4]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#172A2B]">Degraded Link (Unknown)</span>
              <span className="w-2 h-2 rounded-full bg-[#6B7A78]" />
            </div>
            <p className="text-xs text-[#60716E]">
              Telemetry interrupted during DSN blackout. Cards explicitly show Unknown (grey).
            </p>
          </button>
        </div>
      </div>

      {/* 2. Units & Display Preferences */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#D9E2DE]">
          <Sliders size={16} className="text-[#176B68]" />
          <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
            Display Units & Accessibility
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#172A2B] mb-1">
              Thermal Measurement Unit
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTemperatureUnit('celsius')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  temperatureUnit === 'celsius'
                    ? 'bg-[#176B68] text-white border-[#176B68]'
                    : 'bg-white text-[#172A2B] border-[#D9E2DE] hover:bg-[#F4F6F4]'
                }`}
              >
                Celsius (°C) — NASA Standard
              </button>
              <button
                type="button"
                onClick={() => setTemperatureUnit('fahrenheit')}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                  temperatureUnit === 'fahrenheit'
                    ? 'bg-[#176B68] text-white border-[#176B68]'
                    : 'bg-white text-[#172A2B] border-[#D9E2DE] hover:bg-[#F4F6F4]'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#172A2B] mb-1">
              Accessibility & Motion
            </label>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all flex items-center gap-1.5 ${
                reducedMotion
                  ? 'bg-[#176B68] text-white border-[#176B68]'
                  : 'bg-white text-[#172A2B] border-[#D9E2DE] hover:bg-[#F4F6F4]'
              }`}
            >
              <span>{reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF (Respect OS)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Local Data Export & Privacy Notice */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#D9E2DE]">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-[#176B68]" />
            <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
              Local Storage Telemetry Export
            </h2>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="px-3.5 py-1.5 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download size={13} />
            <span>Export Mission JSON</span>
          </button>
        </div>

        <p className="text-xs text-[#60716E] leading-relaxed">
          All astronaut logs, diagnostic records, and workout logs are retained locally on this device in adherence with deep-space offline operation rules. You can export the active mission state as a structured telemetry JSON file at any time.
        </p>

        {/* Prototype trust notice */}
        <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE] text-xs text-[#60716E] flex items-start gap-2">
          <Info size={15} className="text-[#176B68] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>About this data:</strong> All values in this application are synthetic simulation fixtures designed for the NASA Space Apps Challenge 2026. AAHMS is not certified for clinical patient use.
          </p>
        </div>
      </div>
    </div>
  );
}
