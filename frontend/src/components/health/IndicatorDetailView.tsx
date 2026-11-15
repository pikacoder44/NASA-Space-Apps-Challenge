'use client';

import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { TrendChart } from '../charts/TrendChart';
import { generateTrendHistory } from '../../data/trendData';
import { StatusBadge } from '../ui/StatusBadge';
import { DataSourceTag } from '../ui/DataSourceTag';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Info, 
  BookOpen, 
  AlertTriangle, 
  Layers,
  RefreshCw
} from 'lucide-react';

export function IndicatorDetailView({ indicatorId }: { indicatorId: string }) {
  const { overview, loading, error, refreshOverview } = useHealth();
  const [range, setRange] = useState<'7d' | '30d' | 'mission'>('7d');

  // Loading skeleton when data is initially loading
  if (loading && !overview) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-[#EAF0ED] rounded w-32" />
          <div className="h-4 bg-[#EAF0ED] rounded w-24" />
        </div>
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 space-y-4">
          <div className="h-8 bg-[#EAF0ED] rounded w-1/3" />
          <div className="h-4 bg-[#EAF0ED] rounded w-2/3" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="h-24 bg-[#EAF0ED] rounded-xl" />
            <div className="h-24 bg-[#EAF0ED] rounded-xl" />
            <div className="h-24 bg-[#EAF0ED] rounded-xl" />
          </div>
        </div>
        <div className="h-72 bg-white rounded-xl border border-[#D9E2DE] p-6" />
      </div>
    );
  }

  // Fetch failure state with friendly retry
  if (error && !overview) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/app/indicators"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B68] hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Back to All Health Indicators</span>
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF8EC] border border-[#F3DB9A] flex items-center justify-center text-[#8A520F]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#172A2B]">Telemetry Stream Unavailable</h2>
            <p className="text-xs sm:text-sm text-[#60716E] max-w-md mx-auto leading-relaxed">
              Unable to load telemetry data for indicator <span className="font-mono font-bold text-[#172A2B]">{indicatorId}</span>. The communication link may be degraded or offline.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refreshOverview()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#176B68] text-white hover:bg-[#125553] shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry Telemetry Sync</span>
            </button>
            <Link
              href="/app/indicators"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#172A2B] border border-[#D9E2DE] hover:bg-[#F4F6F4] transition-all"
            >
              <span>Back to All Indicators</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center text-xs text-[#60716E]">
        Telemetry data not initialized.
      </div>
    );
  }

  const indicator = overview.keyIndicators?.find((k) => k.id === indicatorId);

  // Missing indicator graceful fallback
  if (!indicator) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/app/indicators"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B68] hover:underline"
          >
            <ArrowLeft size={14} />
            <span>Back to All Health Indicators</span>
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D9E2DE] shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EAF0ED] border border-[#D9E2DE] flex items-center justify-center text-[#176B68]">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-[#172A2B]">Indicator Not Found</h2>
            <p className="text-xs sm:text-sm text-[#60716E] max-w-md mx-auto leading-relaxed">
              No calibrated metric exists for code <span className="font-mono font-bold text-[#172A2B]">{indicatorId}</span> in current mission logs.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refreshOverview()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#176B68] text-white hover:bg-[#125553] shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry Telemetry Sync</span>
            </button>
            <Link
              href="/app/indicators"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#172A2B] border border-[#D9E2DE] hover:bg-[#F4F6F4] transition-all"
            >
              <span>Back to All Indicators</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safe trend history calculation with try/catch fallback
  let trendData: ReturnType<typeof generateTrendHistory>;
  try {
    trendData = generateTrendHistory(indicator.id, range);
  } catch {
    trendData = {
      unit: indicator.latest?.unit || '',
      title: `${indicator.name} Multi-Day Trajectory`,
      baselineLabel: 'Personal Baseline',
      data: []
    };
  }

  const relatedAlert = overview.activeAlerts?.find((a) =>
    Array.isArray(a.contributingIndicators) && a.contributingIndicators.includes(indicator.id)
  );

  const safeTrend = (indicator.trend || 'stable').replace(/_/g, ' ');

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
          Indicator Code: {indicator.id ? indicator.id.toUpperCase() : 'UNKNOWN'}
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#D9E2DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#60716E]">
                {indicator.category || 'Physiological'}
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
              Observed at Sol {overview.missionDay ?? 90}
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
              Trend trajectory: {safeTrend}
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
              Confidence: {Math.round((relatedAlert.confidence || 0.85) * 100)}% · Duration: {relatedAlert.duration || 'Persistent'}
            </span>
            <Link href="/app/alerts" className="font-semibold text-[#8A520F] hover:underline">
              Inspect Full Advisory Next Steps →
            </Link>
          </div>
        </div>
      )}

      {/* Trend History Chart protected by ErrorBoundary */}
      <ErrorBoundary
        widgetName={`${indicator.name} Trajectory Chart`}
        variant="card"
      >
        <TrendChart
          data={trendData.data}
          title={`${indicator.name} Multi-Day Trajectory`}
          unit={trendData.unit}
          baselineLabel={trendData.baselineLabel}
          activeRange={range}
          onRangeChange={setRange}
        />
      </ErrorBoundary>

      {/* Spaceflight Physiological Relevance & Citation */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#172A2B] uppercase font-mono tracking-wide">
            Spaceflight Physiological Context
          </h2>
          <p className="text-xs sm:text-sm text-[#172A2B] leading-relaxed mt-1">
            {indicator.spaceflightRelevance || 'Monitored as part of the NASA Human Research Program spaceflight physiological envelope.'}
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
