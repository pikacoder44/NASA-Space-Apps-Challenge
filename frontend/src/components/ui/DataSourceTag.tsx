import React from 'react';
import { DataOrigin, DataQuality } from '../../types/health';
import { Radio, Edit3, User, Sparkles, Database } from 'lucide-react';

interface DataSourceTagProps {
  origin?: DataOrigin;
  quality?: DataQuality;
  className?: string;
}

export function DataSourceTag({ origin = 'simulated', quality, className = '' }: DataSourceTagProps) {
  const originConfigs = {
    sensor: {
      short: 'Sensor',
      full: 'Telemetry Sensor',
      bg: 'bg-teal-50 text-[#176B68] border-teal-200',
      Icon: Radio
    },
    manual: {
      short: 'Manual',
      full: 'Manual Entry',
      bg: 'bg-stone-100 text-stone-700 border-stone-200',
      Icon: Edit3
    },
    self_reported: {
      short: 'Self-reported',
      full: 'Self-Reported Well-being',
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      Icon: User
    },
    simulated: {
      short: 'Simulated',
      full: 'Simulated Prototype Data',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      Icon: Sparkles
    },
    imported: {
      short: 'Imported',
      full: 'Imported Mission Protocol',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Icon: Database
    }
  };

  const curr = originConfigs[origin] || originConfigs.simulated;
  const Icon = curr.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border shrink-0 max-w-full truncate ${curr.bg} ${className}`}
      title={`${curr.full}${quality && quality !== 'valid' ? ` (${quality})` : ''}`}
    >
      <Icon size={11} className="shrink-0" aria-hidden="true" />
      <span className="truncate">{curr.short}</span>
      {quality && quality !== 'valid' && (
        <span className="ml-0.5 px-1 rounded bg-stone-200 text-stone-700 text-[9px] uppercase font-bold shrink-0">
          {quality}
        </span>
      )}
    </span>
  );
}
