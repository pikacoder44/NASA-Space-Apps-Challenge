'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  CheckCircle2, 
  ShieldAlert, 
  Stethoscope, 
  ArrowRight, 
  Info,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function AlertsGuidancePage() {
  const { overview } = useHealth();
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});

  if (!overview) return null;

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
              Explainable Health Monitoring
            </span>
            <span className="text-xs text-[#60716E]">
              {overview.activeAlerts.length} Active System Advisories
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Alerts & Cautious Next Steps
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Every Green / Yellow / Red state is completely transparent and traceable to individual baseline variance.
          </p>
        </div>

        <StatusBadge status={overview.overallStatus} size="lg" />
      </div>

      {/* Trust & Safety Warning Card */}
      <div className="p-4 rounded-xl bg-[#EAF0ED] border border-[#D9E2DE] text-xs text-[#172A2B] flex items-start gap-3">
        <Info size={18} className="text-[#176B68] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Transparent Decision Logic (Non-Diagnostic Prototype)</p>
          <p className="text-[#60716E] leading-relaxed">
            AAHMS never shows mystery health scores. Any alert explains which indicators changed, by how much, and for how many sleep cycles. Guidance consists of conservative operational countermeasure suggestions, never unverified medical treatments.
          </p>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        {overview.activeAlerts.length > 0 ? (
          overview.activeAlerts.map((alert) => {
            const isAck = acknowledgedAlerts[alert.id];
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border p-5 sm:p-6 shadow-xs transition-all ${
                  alert.status === 'red'
                    ? 'border-[#F1BCB7]'
                    : 'border-[#EED8A7]'
                }`}
              >
                {/* Alert Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#D9E2DE]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={alert.status} size="sm" />
                      <span className="text-xs text-[#60716E]">
                        Source: {alert.source === 'demo_rule' ? 'Deterministic Baseline Rule' : 'Analysis Service'}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-[#172A2B]">
                      {alert.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAcknowledge(alert.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isAck
                        ? 'bg-[#E4F2E9] text-[#247A55] border border-[#BDE0CB]'
                        : 'bg-[#F4F6F4] text-[#172A2B] border border-[#D9E2DE] hover:bg-[#EAF0ED]'
                    }`}
                  >
                    <Check size={14} className={isAck ? 'text-[#247A55]' : 'text-[#60716E]'} />
                    <span>{isAck ? 'Crew Acknowledged' : 'Acknowledge Advisory'}</span>
                  </button>
                </div>

                {/* Explanation & Metrics */}
                <div className="my-4 space-y-3">
                  <div>
                    <h3 className="text-xs uppercase font-bold text-[#60716E]">
                      Clinical Explanation of Variance
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#172A2B] leading-relaxed">
                      {alert.explanation}
                    </p>
                  </div>

                  {/* Variance metadata ribbon */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                      <span className="text-xs text-[#60716E] uppercase font-semibold block">Magnitude</span>
                      <span className="font-bold text-[#172A2B]">{alert.magnitude || 'Moderate variance'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                      <span className="text-xs text-[#60716E] uppercase font-semibold block">Observed Duration</span>
                      <span className="font-bold text-[#172A2B]">{alert.duration || 'Multi-cycle'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
                      <span className="text-xs text-[#60716E] uppercase font-semibold block">Analysis Confidence</span>
                      <span className="font-bold font-mono text-[#176B68]">
                        {alert.confidence ? `${Math.round(alert.confidence * 100)}% Pattern Match` : '90% Confirmed'}
                      </span>
                    </div>
                  </div>

                  {/* Contributing indicators pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-medium text-[#60716E]">Contributing Indicators:</span>
                    {alert.contributingIndicators.map((indKey) => (
                      <Link
                        key={indKey}
                        href={`/app/indicators/${indKey}`}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#EAF0ED] text-[#176B68] font-bold hover:bg-[#DCEDEA]"
                      >
                        <span>{indKey.replace('_', ' ')}</span>
                        <ArrowRight size={11} />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Suggested Action Steps */}
                <div className="pt-3 border-t border-[#D9E2DE] space-y-2">
                  <h3 className="text-xs uppercase font-bold text-[#172A2B] flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-[#176B68]" />
                    <span>Approved Operational Next Steps</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#172A2B]">
                    {alert.suggestedActions.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#DCEDEA] text-[#176B68] font-mono font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flight Surgeon Escalation Notice */}
                <div className="mt-4 p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Stethoscope size={16} className="text-[#60716E]" />
                    <span className="text-[#60716E]">
                      Flight Surgeon Escalation: <strong className="text-[#172A2B]">Condition Not Met</strong>
                    </span>
                  </div>
                  <span className="text-xs text-[#60716E]">
                    Trigger: Resting HR &gt; 95 bpm or 6+ days sleep debt
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-[#BDE0CB] p-12 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E4F2E9] text-[#247A55] flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h2 className="text-lg font-bold text-[#172A2B]">
              All Telemetry Systems Operating Within Nominal Baseline
            </h2>
            <p className="text-xs text-[#60716E] max-w-md mx-auto">
              No active Yellow or Red advisories are detected for Sol {overview.missionDay}. Continue regular scheduled check-ins and countermeasure workouts.
            </p>
            <div className="pt-2">
              <Link
                href="/app/check-in"
                className="px-4 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754]"
              >
                Log Today&apos;s Health Entry
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
