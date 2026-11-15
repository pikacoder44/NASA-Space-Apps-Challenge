import React from 'react';
import { HealthStatus } from '../../types/health';
import type { Status } from '../../lib/types';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, Clock } from 'lucide-react';

export type StatusInput = HealthStatus | Status | 'empty' | string;

interface StatusBadgeProps {
  status: StatusInput;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'full';
  showIcon?: boolean;
  labelOverride?: string;
  className?: string;
}

export function StatusBadge({
  status,
  size = 'md',
  variant = 'compact',
  showIcon = true,
  labelOverride,
  className = ''
}: StatusBadgeProps) {
  const configs: Record<
    string,
    {
      shortLabel: string;
      fullLabel: string;
      bg: string;
      text: string;
      border: string;
      dot: string;
      Icon: React.ComponentType<{ size: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    }
  > = {
    normal: {
      shortLabel: 'Normal',
      fullLabel: 'Normal · Within Healthy Baseline',
      bg: 'bg-[#E4F2E9]',
      text: 'text-[#247A55]',
      border: 'border-[#BDE0CB]',
      dot: 'bg-[#247A55]',
      Icon: CheckCircle2
    },
    green: {
      shortLabel: 'Normal',
      fullLabel: 'Normal · Within Healthy Baseline',
      bg: 'bg-[#E4F2E9]',
      text: 'text-[#247A55]',
      border: 'border-[#BDE0CB]',
      dot: 'bg-[#247A55]',
      Icon: CheckCircle2
    },
    warning: {
      shortLabel: 'Watch',
      fullLabel: 'Watch · Needs Attention',
      bg: 'bg-[#FBF0D9]',
      text: 'text-[#8A520F]',
      border: 'border-[#EED8A7]',
      dot: 'bg-[#A96617]',
      Icon: AlertTriangle
    },
    yellow: {
      shortLabel: 'Watch',
      fullLabel: 'Watch · Needs Attention',
      bg: 'bg-[#FBF0D9]',
      text: 'text-[#8A520F]',
      border: 'border-[#EED8A7]',
      dot: 'bg-[#A96617]',
      Icon: AlertTriangle
    },
    critical: {
      shortLabel: 'Act Now',
      fullLabel: 'Act Now · Immediate Action',
      bg: 'bg-[#F9E7E5]',
      text: 'text-[#B33C3C]',
      border: 'border-[#F1BCB7]',
      dot: 'bg-[#B33C3C]',
      Icon: AlertOctagon
    },
    red: {
      shortLabel: 'Act Now',
      fullLabel: 'Act Now · Immediate Action',
      bg: 'bg-[#F9E7E5]',
      text: 'text-[#B33C3C]',
      border: 'border-[#F1BCB7]',
      dot: 'bg-[#B33C3C]',
      Icon: AlertOctagon
    },
    empty: {
      shortLabel: 'No Data',
      fullLabel: 'No Data · Not Recorded Yet',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: HelpCircle
    },
    unknown: {
      shortLabel: 'No Data',
      fullLabel: 'No Data · Not Recorded Yet',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: HelpCircle
    },
    stale: {
      shortLabel: 'Delayed',
      fullLabel: 'Delayed · Telemetry Link Delayed',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: Clock
    },
    insufficient_data: {
      shortLabel: 'No Data',
      fullLabel: 'No Data · Waiting for Telemetry',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: HelpCircle
    }
  };

  const key = String(status).toLowerCase();
  const current = configs[key] || configs.unknown;
  const Icon = current.Icon;
  const label = labelOverride || (variant === 'compact' ? current.shortLabel : current.fullLabel);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 13,
    lg: 15
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shrink-0 max-w-full ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]} ${className}`}
      role="status"
      title={current.fullLabel}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" aria-hidden="true" />}
      <span className="truncate">{label}</span>
    </span>
  );
}
