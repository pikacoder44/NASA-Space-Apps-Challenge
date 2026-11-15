'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABEL } from '../lib/colors';
import type { Status, GuidanceData } from '../lib/types';

interface GuidancePanelProps {
  status: Status;
  guidance: GuidanceData;
}

export default function GuidancePanel({ status, guidance }: GuidancePanelProps) {
  const statusColor = STATUS_COLORS[status] || '#6b7280';

  return (
    <div 
      className="p-5 sm:p-6 rounded-2xl border space-y-4"
      style={{
        borderColor: statusColor,
        backgroundColor: status === 'normal' ? 'rgba(34, 197, 94, 0.06)' : 'rgba(234, 179, 8, 0.08)'
      }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: statusColor }}
          >
            {status === 'normal' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-main">{guidance.title}</h3>
            <span className="text-xs text-muted">Clinical Space Medicine Advisory</span>
          </div>
        </div>

        <span 
          className="px-2.5 py-0.5 rounded text-xs font-extrabold text-white uppercase tracking-wider"
          style={{ backgroundColor: statusColor }}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="space-y-3 text-sm text-main leading-relaxed">
        <p>
          <strong>Explanation: </strong>
          {guidance.explanation}
        </p>
        <p className="p-3.5 rounded-xl bg-surface border border-border text-xs text-main font-medium">
          <strong>Recommended Action: </strong>
          {guidance.action}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-between text-xs text-muted border-t border-border/40">
        <a 
          href={guidance.citation_url || 'https://www.nasa.gov/hrp'} 
          target="_blank" 
          rel="noreferrer"
          className="font-bold text-brand hover:underline flex items-center gap-1"
        >
          <span>Source: {guidance.citation}</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
