import React from 'react';
import { HealthStatus } from '../../types/health';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: HealthStatus;
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
    green: {
      shortLabel: 'Green',
      fullLabel: 'Green · Within Baseline',
      bg: 'bg-[#E4F2E9]',
      text: 'text-[#247A55]',
      border: 'border-[#BDE0CB]',
      dot: 'bg-[#247A55]',
      Icon: CheckCircle2
    },
    yellow: {
      shortLabel: 'Yellow',
      fullLabel: 'Yellow · Watch',
      bg: 'bg-[#FBF0D9]',
      text: 'text-[#8A520F]',
      border: 'border-[#EED8A7]',
      dot: 'bg-[#A96617]',
      Icon: AlertTriangle
    },
    red: {
      shortLabel: 'Red',
      fullLabel: 'Red · Alert',
      bg: 'bg-[#F9E7E5]',
      text: 'text-[#B33C3C]',
      border: 'border-[#F1BCB7]',
      dot: 'bg-[#B33C3C]',
      Icon: AlertOctagon
    },
    unknown: {
      shortLabel: 'Unknown',
      fullLabel: 'Unknown · No Data',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: HelpCircle
    },
    stale: {
      shortLabel: 'Stale',
      fullLabel: 'Stale · Telemetry Link Delayed',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: Clock
    },
    insufficient_data: {
      shortLabel: 'Unknown',
      fullLabel: 'Unknown · No Recent Telemetry',
      bg: 'bg-[#EEF1F0]',
      text: 'text-[#556865]',
      border: 'border-[#D0DED9]',
      dot: 'bg-[#7C8F8C]',
      Icon: HelpCircle
    }
  };

  const current = configs[status] || configs.unknown;
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
      aria-label={label}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} aria-hidden="true" />
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" aria-hidden="true" />}
      <span className="truncate tracking-wide font-medium">
        {label}
      </span>
    </span>
  );
}
