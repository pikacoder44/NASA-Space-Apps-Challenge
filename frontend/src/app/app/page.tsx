'use client';

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { HealthStatusSummary } from '../../components/health/HealthStatusSummary';
import { IndicatorCard } from '../../components/health/IndicatorCard';
import { TrendChart } from '../../components/charts/TrendChart';
import { generateTrendHistory } from '../../data/trendData';
import { 
  CheckSquare, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Layers, 
  Award, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AppDashboardPage() {
  const { overview, loading } = useHealth();
  const [selectedTrendIndicator, setSelectedTrendIndicator] = useState('heart_rate');
  const [trendRange, setTrendRange] = useState<'7d' | '30d' | 'mission'>('7d');

  if (loading && !overview) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 bg-white rounded-xl border border-[#D9E2DE]" />
        <div className="card-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-xl border border-[#D9E2DE]" />
          ))}
        </div>
      </div>
    );
  }

  if (!overview) return null;

  // Section 6.2 requirement: Exactly 6 key indicator cards on overview dashboard
  const sixKeyIndicatorIds = ['sleep', 'heart_rate', 'hrv', 'blood_pressure', 'mood', 'skin_temperature'];
  const primarySixIndicators = sixKeyIndicatorIds
    .map((id) => overview.keyIndicators.find((ind) => ind.id === id))
    .filter((ind): ind is typeof overview.keyIndicators[0] => ind !== undefined);

  const trendData = generateTrendHistory(selectedTrendIndicator, trendRange);

  return (
    <div className="space-y-6">
      {/* 1. Header row: Title, one-line context, and primary check-in CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Crew Health Operations
            </span>
            <span className="text-xs text-[#60716E]">
              {overview.scenarioName}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172A2B] mt-0.5">
            Mission Health Overview
          </h1>
        </div>

        {/* Check-In Action Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/app/check-in"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all ${
              overview.dailyCheckInDone
                ? 'bg-[#E4F2E9] text-[#247A55] border border-[#BDE0CB]'
                : 'bg-[#176B68] text-white hover:bg-[#135754]'
            }`}
          >
            <CheckSquare size={14} />
            <span>{overview.dailyCheckInDone ? 'Sol 90 Log Completed' : 'Complete Sol 90 Log'}</span>
          </Link>
        </div>
      </div>

      {/* 2. StatusHeadline panel (Full width, consistent status model) */}
      <HealthStatusSummary />

      {/* 3. Key Indicators: Exactly 6 cards with equal height and no overflow */}
      <section aria-labelledby="key-vitals-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="key-vitals-heading" className="text-base font-bold text-[#172A2B]">
              Key Vitals & Behavioral Health (6 Measures)
            </h2>
            <p className="text-xs text-[#60716E]">
              Calibrated against your personal 60-day mission cruise baseline.
            </p>
          </div>

          <Link
            href="/app/indicators"
            className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1"
          >
            <span>All 10 Indicators</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Auto-Fit Container Grid (Section 3.2) */}
        <div className="card-grid">
          {primarySixIndicators.map((ind) => (
            <IndicatorCard key={ind.id} indicator={ind} />
          ))}
        </div>
      </section>

      {/* 4. Two-Column Zone (Stacks on mobile): Left (2/3) Trend chart | Right (1/3) AI & Radiation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (2/3, 8 cols): Trend Chart with Range & Selector */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#172A2B] flex items-center gap-2">
              <TrendingUp size={16} className="text-[#176B68]" />
              <span>Multi-Day Trajectory Analysis</span>
            </h2>

            <select
              value={selectedTrendIndicator}
              onChange={(e) => setSelectedTrendIndicator(e.target.value)}
              className="bg-white border border-[#D9E2DE] text-[#172A2B] text-xs font-bold rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-[#176B68]"
              aria-label="Select indicator for chart"
            >
              <option value="heart_rate">Resting Heart Rate</option>
              <option value="sleep">Sleep Duration</option>
              <option value="hrv">Heart Rate Variability</option>
              <option value="blood_pressure">Blood Pressure</option>
              <option value="mood">Subjective Mood</option>
              <option value="fatigue">Energy / Stamina</option>
            </select>
          </div>

          <TrendChart
            data={trendData.data}
            title={trendData.title}
            unit={trendData.unit}
            baselineLabel={trendData.baselineLabel}
            activeRange={trendRange}
            onRangeChange={setTrendRange}
          />
        </div>

        {/* Right Column (1/3, 4 cols): Stacked AI Explanation & Radiation Summary */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* AI Explanation Preview */}
          <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-3 flex flex-col justify-between flex-1">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9E2DE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DCEDEA] text-[#176B68] flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172A2B]">Gemini Health Assistant</h3>
                    <span className="text-xs text-[#60716E]">Mission telemetry analysis</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#DCEDEA] text-[#176B68]">
                  Advisory
                </span>
              </div>

              <p className="text-xs text-[#172A2B] leading-relaxed line-clamp-3">
                {overview.aiExplanation?.overallAssessment ||
                  'Telemetry reflects early autonomic recovery deficit from cumulative sleep debt and elevated resting heart rate.'}
              </p>
            </div>

            <Link
              href="/app/ai-explanation"
              className="inline-flex items-center justify-between w-full pt-2.5 border-t border-[#D9E2DE] text-xs font-semibold text-[#176B68] hover:underline"
            >
              <span>Read Full AI Synthesis</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {/* Radiation Summary Card */}
          <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-3 flex flex-col justify-between flex-1">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#D9E2DE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF0ED] text-[#172A2B] flex items-center justify-center shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#172A2B]">Radiation Dosimetry</h3>
                    <span className="text-xs text-[#60716E]">Sol 90 Cumulative</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#247A55]">
                  +{overview.radiation.dailyRateMsv} mSv/d
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-2xl font-extrabold tabular-data text-[#172A2B]">
                    {overview.radiation.cumulativeDoseMsv}
                  </span>
                  <span className="text-xs text-[#60716E] ml-1">mSv total</span>
                </div>
                <span className="text-xs text-[#60716E]">
                  600 mSv Ref limit
                </span>
              </div>

              <div className="w-full bg-[#EAF0ED] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#176B68] h-full rounded-full transition-all"
                  style={{ width: `${(overview.radiation.cumulativeDoseMsv / overview.radiation.referenceLimitMsv) * 100}%` }}
                />
              </div>
            </div>

            <Link
              href="/app/radiation"
              className="inline-flex items-center justify-between w-full pt-2.5 border-t border-[#D9E2DE] text-xs font-semibold text-[#176B68] hover:underline"
            >
              <span>View Dosimetry Timeline</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Small Row: Body Map Teaser & Consistency/Streak Teaser */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Link
          href="/app/body-map"
          className="group flex items-center justify-between p-4 rounded-xl bg-white border border-[#D9E2DE] hover:border-[#176B68] shadow-xs transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DCEDEA] text-[#176B68] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#172A2B] group-hover:text-[#176B68]">
                Interactive Anatomical Body Map
              </h3>
              <p className="text-[11px] text-[#60716E]">
                Explore cardiovascular, brain & musculoskeletal spaceflight effects
              </p>
            </div>
          </div>
          <ArrowRight size={15} className="text-[#B6C6C2] group-hover:text-[#176B68] transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/app/consistency"
          className="group flex items-center justify-between p-4 rounded-xl bg-white border border-[#D9E2DE] hover:border-[#176B68] shadow-xs transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EAF0ED] text-[#176B68] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#172A2B] group-hover:text-[#176B68]">
                Protocol Adherence & Streak ({overview.gamification.currentStreakDays} Sols)
              </h3>
              <p className="text-[11px] text-[#60716E]">
                {overview.gamification.totalPoints} points earned · Milestone badges
              </p>
            </div>
          </div>
          <ArrowRight size={15} className="text-[#B6C6C2] group-hover:text-[#176B68] transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
