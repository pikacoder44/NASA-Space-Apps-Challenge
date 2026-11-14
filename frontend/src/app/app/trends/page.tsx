'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { TrendChart } from '@/components/charts/TrendChart';
import { generateTrendHistory } from '@/data/trendData';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function HealthTrendsPage() {
  const { overview } = useHealth();
  const [selectedIndicator, setSelectedIndicator] = useState('heart_rate');
  const [range, setRange] = useState<'7d' | '30d' | 'mission'>('30d');

  if (!overview) return null;

  const trendData = generateTrendHistory(selectedIndicator, range);
  const currentSnapshot = overview.keyIndicators.find((i) => i.id === selectedIndicator);

  const indicatorsList = [
    { id: 'heart_rate', name: 'Resting Heart Rate' },
    { id: 'sleep', name: 'Sleep Duration' },
    { id: 'hrv', name: 'Heart Rate Variability (rMSSD)' },
    { id: 'blood_pressure', name: 'Systolic Blood Pressure' },
    { id: 'skin_temperature', name: 'Core/Skin Temperature' },
    { id: 'mood', name: 'Subjective Mood Rating' },
    { id: 'fatigue', name: 'Energy & Stamina Index' },
    { id: 'blood_glucose', name: 'Fasting Blood Glucose' },
    { id: 'radiation_dose', name: 'Cumulative Radiation Dose' },
    { id: 'exercise', name: 'Daily Exercise Minutes' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
              Longitudinal Analysis
            </span>
            <span className="text-xs text-[#60716E]">
              Multi-Horizon Trends (7d · 30d · Full Mission)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Health Trends & Baseline Envelopes
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Identify subtle multi-day drifts, autonomic compensations, and protocol adherence over time.
          </p>
        </div>

        {/* Indicator dropdown selector */}
        <div className="w-full sm:w-auto">
          <label htmlFor="indicator-select" className="sr-only">
            Select Health Indicator
          </label>
          <select
            id="indicator-select"
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="w-full sm:w-64 bg-white border border-[#D9E2DE] text-[#172A2B] text-xs font-bold rounded-lg px-3 py-2 shadow-xs focus:ring-1 focus:ring-[#176B68]"
          >
            {indicatorsList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Quick Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Current Measurement
          </span>
          <span className="text-2xl font-extrabold font-mono tabular-nums text-[#172A2B]">
            {currentSnapshot?.latest?.value ?? 'N/A'} {currentSnapshot?.latest?.unit}
          </span>
          <span className="text-xs text-[#60716E] block mt-0.5">
            Recorded at Sol {overview.missionDay}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Calibrated Baseline
          </span>
          <span className="text-2xl font-extrabold font-mono tabular-nums text-[#176B68]">
            {currentSnapshot?.baseline?.value ?? 'N/A'} {currentSnapshot?.baseline?.unit}
          </span>
          <span className="text-xs text-[#60716E] block mt-0.5">
            60-Day Mission Target
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Observed Trajectory
          </span>
          <span className="text-sm font-bold capitalize text-[#172A2B] block mt-1">
            {currentSnapshot?.trend.replace('_', ' ') || 'Stable'}
          </span>
          <span className="text-xs text-[#60716E] block mt-0.5">
            {currentSnapshot?.deltaFromBaseline || 'Nominal variance'}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Data Completeness
          </span>
          <span className="text-2xl font-extrabold font-mono tabular-nums text-[#247A55]">
            {currentSnapshot?.dataCompleteness || 98}%
          </span>
          <span className="text-xs text-[#60716E] block mt-0.5">
            Telemetry sensor integrity
          </span>
        </div>
      </div>

      {/* Primary Trend Visualization Component */}
      <TrendChart
        data={trendData.data}
        title={trendData.title}
        unit={trendData.unit}
        baselineLabel={trendData.baselineLabel}
        activeRange={range}
        onRangeChange={setRange}
      />

      {/* Explanatory Context Card */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-[#176B68]" />
          <h3 className="text-sm font-bold text-[#172A2B]">
            Data Integrity and Trend Interpretation Rules
          </h3>
        </div>
        <p className="text-xs text-[#60716E] leading-relaxed">
          {currentSnapshot?.spaceflightRelevance}
        </p>
        <div className="pt-2 flex items-center justify-between text-xs border-t border-[#D9E2DE]">
          <Link
            href={`/app/indicators/${selectedIndicator}`}
            className="text-[#176B68] font-bold hover:underline"
          >
            Open Dedicated {currentSnapshot?.name} Indicator View →
          </Link>
          <span className="text-xs text-[#60716E]">
            Gaps represent scheduled rest days or transmission blackouts
          </span>
        </div>
      </div>
    </div>
  );
}
