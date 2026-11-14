'use client';

import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { StatusBadge } from '../ui/StatusBadge';
import { AlertTriangle, ArrowRight, Stethoscope, Radio } from 'lucide-react';
import Link from 'next/link';

export function HealthStatusSummary() {
  const { overview, activeScenario } = useHealth();

  if (!overview) return null;

  const status = overview.overallStatus;
  const isYellowOrRed = status === 'yellow' || status === 'red';
  const isDegradedLink = activeScenario === 'insufficient_data';

  return (
    <div className="bg-white rounded-2xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-5">
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#60716E]">
              Operational Health Assessment
            </span>
            <span className="text-xs font-semibold text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded-full">
              Sol {overview.missionDay}
            </span>
            {isDegradedLink && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A520F] bg-[#FBF0D9] border border-[#EED8A7] px-2 py-0.5 rounded-full">
                <Radio size={11} className="shrink-0" />
                Cached Sol 89 Data
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172A2B] mt-1">
            Mission Readiness Assessment
          </h2>
        </div>

        <div className="shrink-0">
          <StatusBadge status={status} size="lg" />
        </div>
      </div>

      {/* Degraded Link Banner if applicable */}
      {isDegradedLink && (
        <div className="p-3.5 rounded-xl bg-[#FBF0D9]/50 border border-[#EED8A7] flex items-center gap-2.5 text-xs text-[#8A520F]">
          <Radio size={15} className="shrink-0" />
          <span>
            <strong>Telemetry Link Degraded:</strong> Displaying cached observations from Sol 89 (14h ago). Guidance remains active based on last verified readings.
          </span>
        </div>
      )}

      {/* 2. Re-Balanced Two-Column Body Grid (V3 §1: Similar height, no empty spaces) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Clinical Reason, Contributing Factors, & Countermeasures */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-[#60716E]">
              Clinical Reason & System Finding
            </h3>
            <p className="text-sm sm:text-base text-[#172A2B] font-medium leading-relaxed">
              {overview.overallStatusReason}
            </p>

            {/* Contributing Indicators */}
            {overview.activeAlerts.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-[#60716E] font-medium mr-0.5">Contributing factors:</span>
                {overview.activeAlerts.flatMap(a => a.contributingIndicators).map((indKey) => {
                  const snapshot = overview.keyIndicators.find(k => k.id === indKey);
                  return (
                    <Link
                      key={indKey}
                      href={`/app/indicators/${indKey}`}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FBF0D9] text-[#8A520F] border border-[#EED8A7] font-semibold hover:bg-[#F3E2C0] transition-colors"
                    >
                      <span>{snapshot?.name || indKey}</span>
                      <ArrowRight size={11} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Operational Countermeasure Box */}
          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#172A2B]">
              <AlertTriangle size={15} className="text-[#A96617]" />
              <span className="text-xs">Recommended Operational Countermeasure</span>
            </div>
            <p className="text-xs text-[#60716E] leading-relaxed">
              {isYellowOrRed
                ? 'Review sleep berth acoustic insulation and schedule a 90-minute sleep recovery extension before your next primary shift cycle.'
                : 'Maintain scheduled countermeasure exercise volume and 2.5 L daily hydration. Continue standard protocol check-ins.'}
            </p>
          </div>
        </div>

        {/* Right Column: Flight Surgeon Escalation & Action Directives */}
        <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#EAF0ED]/60 border border-[#D9E2DE] space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172A2B]">
                <Stethoscope size={16} className="text-[#176B68]" />
                <span>Flight Surgeon Protocol Threshold</span>
              </div>
              <span className="text-[11px] text-[#60716E] font-medium bg-white px-2 py-0.5 rounded-full border border-[#D9E2DE]">
                Prototype Demo Logic
              </span>
            </div>

            <div className="text-xs text-[#60716E] space-y-1.5">
              <p className="font-medium text-[#172A2B] text-xs">
                Ground Telemedicine Escalation: <span className="text-[#247A55] font-bold">NOT REQUIRED</span>
              </p>
              <p className="text-xs leading-relaxed text-[#60716E]">
                Parameters reflect cumulative operational fatigue rather than acute clinical trauma. Escalation triggers only if an indicator shows sustained multi-cycle deviation from your calibrated personal baseline.
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-2 border-t border-[#D9E2DE] grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href="/app/alerts"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-white border border-[#D9E2DE] text-xs font-semibold text-[#172A2B] hover:bg-[#F4F6F4] transition-colors shadow-xs"
            >
              <span>Review Alert Details</span>
              <ArrowRight size={13} />
            </Link>

            <Link
              href="/app/ai-explanation"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg bg-[#176B68] text-white text-xs font-semibold hover:bg-[#135754] transition-colors shadow-xs"
            >
              <span>Gemini Clinical AI</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
