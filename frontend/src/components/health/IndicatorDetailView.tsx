'use client';

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { TrendChart } from '../charts/TrendChart';
import { generateTrendHistory } from '../../data/trendData';
import { StatusBadge } from '../ui/StatusBadge';
import { DataSourceTag } from '../ui/DataSourceTag';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Info, 
  BookOpen, 
  AlertTriangle, 
  Layers 
} from 'lucide-react';
import { notFound } from 'next/navigation';

export function IndicatorDetailView({ indicatorId }: { indicatorId: string }) {
  const { overview } = useHealth();
  const [range, setRange] = useState<'7d' | '30d' | 'mission'>('7d');

  if (!overview) return null;

  const indicator = overview.keyIndicators.find((k) => k.id === indicatorId);

  if (!indicator) {
    notFound();
  }

  const trendData = generateTrendHistory(indicator.id, range);
  const relatedAlert = overview.activeAlerts.find((a) =>
    a.contributingIndicators.includes(indicator.id)
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/app/indicators"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B68] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to All Health Indicators</span>
        </Link>

        <span className="text-xs text-[#60716E]">
          Indicator Code: {indicator.id.toUpperCase()}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#D9E2DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#60716E]">
                {indicator.category}
              </span>
              <DataSourceTag origin={indicator.latest?.origin || 'simulated'} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] mt-1">
              {indicator.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#60716E] mt-1 max-w-2xl">
              {indicator.description}
            </p>
          </div>

          <StatusBadge status={indicator.status} size="lg" />
        </div>

        {/* Current Readout & Personal Baseline Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-xs font-bold text-[#60716E] block mb-1">
              Latest Recorded Observation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tabular-data text-[#172A2B]">
                {indicator.latest?.value ?? 'N/A'}
              </span>
              <span className="text-sm text-[#60716E]">
                {indicator.latest?.unit}
              </span>
            </div>
            <span className="text-xs text-[#60716E] mt-1 block">
              Observed at Sol {overview.missionDay}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-xs font-bold text-[#60716E] block mb-1">
              Personal Baseline Target
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tabular-data text-[#176B68]">
                {indicator.baseline?.value ?? 'N/A'}
              </span>
              <span className="text-sm text-[#60716E]">
                {indicator.baseline?.unit}
              </span>
            </div>
            <span className="text-xs text-[#60716E] mt-1 block">
              Established across 60 transit days
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-xs font-bold text-[#60716E] block mb-1">
              Current Variance / Delta
            </span>
            <p className="text-sm font-bold text-[#172A2B] mt-1 leading-snug">
              {indicator.deltaFromBaseline || 'Matching nominal range'}
            </p>
            <span className="text-xs text-[#60716E] mt-1 block capitalize">
              Trend trajectory: {indicator.trend.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Notice on Personal Baseline vs General Population */}
        <div className="p-3 rounded-lg bg-[#EAF0ED] border border-[#D9E2DE] text-xs text-[#172A2B] flex items-start gap-2.5">
          <Info size={16} className="text-[#176B68] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Personal Baseline Monitoring:</strong> In spaceflight, individual autonomic and cardiovascular profiles vary due to fluid shifts and space adaptation. This indicator is compared against <em>your</em> calibrated mission baseline, not a generic terrestrial population reference.
          </p>
        </div>
      </div>

      {/* Active Alert Banner if this indicator contributed */}
      {relatedAlert && (
        <div className="bg-[#FBF0D9] border border-[#EED8A7] rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#8A520F] font-bold text-sm">
            <AlertTriangle size={16} />
            <span>Active Advisory Involving {indicator.name}</span>
          </div>
          <p className="text-xs text-[#172A2B] leading-relaxed">
            {relatedAlert.explanation}
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-[#8A520F]">
              Confidence: {Math.round((relatedAlert.confidence || 0.85) * 100)}% · Duration: {relatedAlert.duration}
            </span>
            <Link href="/app/alerts" className="font-semibold text-[#8A520F] hover:underline">
              Inspect Full Advisory Next Steps →
            </Link>
          </div>
        </div>
      )}

      {/* Trend History Chart */}
      <TrendChart
        data={trendData.data}
        title={`${indicator.name} Multi-Day Trajectory`}
        unit={trendData.unit}
        baselineLabel={trendData.baselineLabel}
        activeRange={range}
        onRangeChange={setRange}
      />

      {/* Spaceflight Physiological Relevance & Citation */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#172A2B] uppercase font-mono tracking-wide">
            Spaceflight Physiological Context
          </h2>
          <p className="text-xs sm:text-sm text-[#172A2B] leading-relaxed mt-1">
            {indicator.spaceflightRelevance}
          </p>
        </div>

        {indicator.researchCitation && (
          <div className="pt-3 border-t border-[#D9E2DE] text-xs text-[#60716E]">
            <span className="font-mono font-bold text-[#172A2B] uppercase text-[11px] block mb-0.5">
              Reviewed Research Citation:
            </span>
            <p className="italic">{indicator.researchCitation}</p>
          </div>
        )}

        <div className="pt-3 border-t border-[#D9E2DE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            href="/app/guides"
            className="inline-flex items-center gap-1.5 font-semibold text-[#176B68] hover:underline"
          >
            <BookOpen size={14} />
            <span>How to measure and calibrate this indicator</span>
          </Link>

          <Link
            href="/app/body-map"
            className="inline-flex items-center gap-1.5 font-semibold text-[#176B68] hover:underline"
          >
            <Layers size={14} />
            <span>Inspect Related Anatomical System</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
