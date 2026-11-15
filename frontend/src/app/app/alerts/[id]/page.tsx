'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHealth } from '@/context/HealthContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Stethoscope, 
  Activity, 
  ArrowRight,
  ClipboardCheck,
  Check
} from 'lucide-react';

export default function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { overview } = useHealth();
  const [checkedActions, setCheckedActions] = useState<Record<number, boolean>>({});

  if (!overview) return null;

  const alert = overview.activeAlerts.find((a) => a.id === id) || {
    id,
    title: 'Autonomic Recovery Deficit & Cumulative Sleep Strain',
    status: 'yellow' as const,
    source: 'demo_rule',
    explanation: 'Resting pulse has elevated by +19.4% above Sol 60 baseline concurrently with a 4.2-hour cumulative sleep debt over the preceding 72 hours.',
    magnitude: '+19.4% pulse drift · 4.2h sleep deficit',
    duration: '3 consecutive mission Sols',
    confidence: 0.91,
    contributingIndicators: ['sleep', 'heart_rate', 'hrv'],
    suggestedActions: [
      'Schedule a protected 45-minute sleep opportunity before scheduled EVA shift',
      'Increase oral fluid intake by 500 mL electrolyte solution to counter plasma volume loss',
      'Verify acoustic sound levels in crew quarters remain below 45 dBA'
    ],
    flightSurgeonEscalation: {
      required: false,
      reason: 'No signs of acute cardiac arrhythmia. Escalation threshold is resting HR > 95 bpm or persistent sleep deficit > 6 days.'
    }
  };

  const toggleAction = (idx: number) => {
    setCheckedActions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#172A2B]">
      {/* Back button */}
      <div>
        <Link
          href="/app/alerts"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B68] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Active Advisories</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#D9E2DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#60716E]">
                Operational Advisory Detail
              </span>
              <span className="text-xs font-medium text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
                Sol {overview.missionDay}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] mt-1">
              {alert.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#60716E] mt-1">
              Deterministic rule trigger calibrated to 60-day personal baseline envelope.
            </p>
          </div>

          <StatusBadge status={alert.status} size="lg" />
        </div>

        {/* Magnitude & Duration Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]">
            <span className="text-xs text-[#60716E] block mb-1">Divergence Magnitude</span>
            <span className="font-bold text-sm text-[#172A2B]">{alert.magnitude || 'Moderate'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]">
            <span className="text-xs text-[#60716E] block mb-1">Persistence Duration</span>
            <span className="font-bold text-sm text-[#172A2B]">{alert.duration || '3 Days'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]">
            <span className="text-xs text-[#60716E] block mb-1">Analysis Confidence</span>
            <span className="font-bold text-sm text-[#176B68]">
              {alert.confidence ? `${Math.round(alert.confidence * 100)}% Pattern Match` : '90%'}
            </span>
          </div>
        </div>

        {/* Narrative Explanation */}
        <div className="space-y-1.5 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#60716E]">
            Clinical Reasoning & Telemetry Evidence
          </h2>
          <p className="text-sm text-[#172A2B] leading-relaxed">
            {alert.explanation}
          </p>
        </div>

        {/* Contributing Indicators */}
        <div className="pt-2 border-t border-[#D9E2DE] space-y-2">
          <span className="text-xs font-bold text-[#60716E] block">Contributing Physiological Indicators:</span>
          <div className="flex flex-wrap gap-2">
            {alert.contributingIndicators.map((indKey) => (
              <Link
                key={indKey}
                href={`/app/indicators/${indKey}`}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-[#DCEDEA] text-[#176B68] font-bold hover:bg-[#B6D6D0] transition-colors"
              >
                <Activity size={13} />
                <span>{indKey.replace('_', ' ')}</span>
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Countermeasure Checklist */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#D9E2DE]">
          <ClipboardCheck size={18} className="text-[#176B68]" />
          <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
            Approved Countermeasure Checklist
          </h2>
        </div>

        <p className="text-xs text-[#60716E]">
          Complete the following non-invasive operational countermeasures and check each item off when performed:
        </p>

        <div className="space-y-2.5">
          {alert.suggestedActions.map((action, idx) => {
            const isDone = !!checkedActions[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleAction(idx)}
                className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                  isDone
                    ? 'bg-[#E4F2E9]/60 border-[#BDE0CB] text-[#247A55]'
                    : 'bg-[#F4F6F4] border-[#D9E2DE] text-[#172A2B] hover:bg-[#EAF0ED]'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                  isDone ? 'bg-[#247A55] border-[#247A55] text-white' : 'border-[#D9E2DE] bg-white'
                }`}>
                  {isDone && <Check size={13} className="stroke-[3]" />}
                </div>
                <div className="text-xs font-semibold leading-relaxed">
                  {action}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flight Surgeon Escalation Criteria */}
      <div className="p-5 rounded-xl bg-white border border-[#D9E2DE] shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-[#176B68]" />
          <h3 className="text-xs uppercase font-bold text-[#172A2B]">
            Flight Surgeon Ground Escalation Boundary
          </h3>
        </div>
        <p className="text-xs text-[#60716E] leading-relaxed">
          Ground medical intervention is currently <strong>not required</strong>. Escalation criteria are strictly evaluated based on NASA flight standards:
        </p>
        <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE] text-xs text-[#172A2B]">
          Trigger criteria: Sustained resting HR &gt; 95 bpm, acute orthostatic syncope, or persistent sleep fragmentation &gt; 6 consecutive days.
        </div>
      </div>
    </div>
  );
}
