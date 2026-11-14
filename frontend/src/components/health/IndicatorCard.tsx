'use client';

import React from 'react';
import Link from 'next/link';
import { IndicatorSnapshot } from '../../types/health';
import { StatusBadge } from '../ui/StatusBadge';
import { DataSourceTag } from '../ui/DataSourceTag';
import { 
  Heart, 
  Moon, 
  Activity, 
  Gauge, 
  Thermometer, 
  Smile, 
  BatteryMedium, 
  Droplets, 
  ShieldAlert, 
  Dumbbell, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronRight
} from 'lucide-react';

interface IndicatorCardProps {
  indicator: IndicatorSnapshot;
}

const INDICATOR_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  sleep: Moon,
  heart_rate: Heart,
  hrv: Activity,
  blood_pressure: Gauge,
  skin_temperature: Thermometer,
  mood: Smile,
  fatigue: BatteryMedium,
  blood_glucose: Droplets,
  radiation_dose: ShieldAlert,
  exercise: Dumbbell
};

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const latest = indicator.latest;
  const baseline = indicator.baseline;
  const hasData = latest && latest.value !== null && latest.value !== undefined;

  const Icon = INDICATOR_ICONS[indicator.id] || Activity;

  // Short trend display: icon + 1 short word
  const renderTrend = () => {
    switch (indicator.trend) {
      case 'concerning_up':
      case 'elevated':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#A96617]">
            <TrendingUp size={13} className="shrink-0" />
            <span>Rising</span>
          </span>
        );
      case 'concerning_down':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#A96617]">
            <TrendingDown size={13} className="shrink-0" />
            <span>Dropping</span>
          </span>
        );
      case 'improving':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#247A55]">
            <TrendingUp size={13} className="shrink-0" />
            <span>Improving</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#60716E]">
            <Minus size={13} className="shrink-0" />
            <span>Stable</span>
          </span>
        );
    }
  };

  return (
    <Link
      href={`/app/indicators/${indicator.id}`}
      className="group flex flex-col justify-between bg-white rounded-xl border border-[#D9E2DE] p-4 sm:p-5 shadow-xs hover:border-[#176B68] transition-colors duration-150 h-full min-w-0"
    >
      {/* Row 1: Icon + Name (wraps max 2 lines) + Short Status Badge */}
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-lg bg-[#EAF0ED] text-[#176B68] flex items-center justify-center shrink-0">
            <Icon size={15} />
          </div>
          <h3 className="text-sm font-bold text-[#172A2B] group-hover:text-[#176B68] transition-colors line-clamp-2 leading-snug min-w-0">
            {indicator.name}
          </h3>
        </div>
        <StatusBadge status={indicator.status} size="sm" variant="compact" />
      </div>

      {/* Row 2: Value + Unit | Trend (Icon + 1 word) */}
      <div className="my-3 flex items-baseline justify-between gap-2 min-w-0">
        <div className="flex items-baseline gap-1.5 min-w-0">
          {hasData ? (
            <>
              <span className="text-2xl sm:text-3xl font-extrabold tabular-data text-[#172A2B] tracking-tight">
                {latest.value}
              </span>
              {latest.unit && (
                <span className="text-xs font-semibold text-[#60716E]">
                  {latest.unit}
                </span>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold text-[#60716E] tracking-tight">
              —
            </span>
          )}
        </div>

        <div className="shrink-0">
          {hasData ? renderTrend() : <span className="text-xs text-[#60716E]">No link</span>}
        </div>
      </div>

      {/* Row 3: Baseline Comparison (Never cut with ellipsis, wraps up to 2 lines) */}
      <div className="p-2.5 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70 text-xs mb-3 baseline-box flex flex-col justify-center">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#60716E] mb-0.5">
          <span>Your baseline</span>
          <span className="font-mono text-[#172A2B]">
            {baseline?.value !== undefined ? `${baseline.value} ${baseline.unit || ''}` : 'Establishing'}
          </span>
        </div>
        <p className="text-xs font-medium text-[#172A2B] line-clamp-2 leading-tight">
          {hasData
            ? indicator.deltaFromBaseline || 'Matching nominal range'
            : 'No valid reading · last Sol 89'}
        </p>
      </div>

      {/* Row 4: Timestamp + Short Source Chip + Link */}
      <div className="flex items-center justify-between pt-2 border-t border-[#D9E2DE]/60 text-xs text-[#60716E] min-w-0 gap-1.5">
        <span className="truncate text-[11px]">
          {hasData && latest?.measuredAt
            ? `Sol 90 · ${new Date(latest.measuredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : 'Sol 89 link'}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <DataSourceTag origin={latest?.origin || 'simulated'} />
          <span className="text-[11px] font-semibold text-[#176B68] group-hover:translate-x-0.5 transition-transform flex items-center">
            View <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
