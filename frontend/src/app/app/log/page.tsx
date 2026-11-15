'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  Download, 
  Clock 
} from 'lucide-react';

export default function MissionLogSyncPage() {
  const { overview, syncState, triggerSync } = useHealth();
  const [activeTab, setActiveTab] = useState<'timeline' | 'ground_brief'>('timeline');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!overview) return null;

  const isSyncing = syncState?.queueState === 'syncing';

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(overview, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AAHMS_Mission_Telemetry_Sol_${overview.missionDay}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
              Telemetry Retention & Ground Sync
            </span>
            <span className="text-xs text-[#60716E]">
              Deep Space Communications
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Mission Log & Synchronization
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Chronological audit of health logs, local queue states, and downlinked ground briefings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerSync}
            disabled={isSyncing}
            className="px-4 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-75"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Synchronizing...' : 'Transmit Downlink'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Communications Link
          </span>
          <div className="flex items-center gap-2 text-sm font-bold text-[#247A55]">
            <Radio size={16} />
            <span>Deep Space Network (DSN) Online</span>
          </div>
          <span className="text-xs text-[#60716E] block mt-1 font-mono">
            One-way signal latency: ~14.2 min
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Pending Queue State
          </span>
          <div className="flex items-center gap-2 text-sm font-bold text-[#172A2B]">
            {isSyncing ? (
              <span className="text-[#176B68] flex items-center gap-1">
                <RefreshCw size={14} className="animate-spin" /> Transmitting Telemetry Packet...
              </span>
            ) : syncState?.pendingCount ? (
              <span className="text-[#A96617]">
                {syncState.pendingCount} Observations Pending Window
              </span>
            ) : (
              <span className="text-[#247A55] flex items-center gap-1">
                <CheckCircle2 size={14} /> Local Queue Synchronized
              </span>
            )}
          </div>
          <span className="text-xs text-[#60716E] block mt-1 font-mono">
            Target: {syncState?.serverEndpoint || 'https://api.aahms.internal/v1'}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 shadow-xs">
          <span className="text-xs uppercase text-[#60716E] font-semibold block mb-1">
            Last Successful Downlink
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#172A2B]">
            <Clock size={14} className="text-[#176B68]" />
            <span>
              {syncState?.lastSuccessfulSyncAt
                ? new Date(syncState.lastSuccessfulSyncAt).toLocaleTimeString()
                : 'Pending connection'}
            </span>
          </div>
          <span className="text-xs text-[#60716E] block mt-1">
            Verified server acknowledgment
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9E2DE] pb-2 text-xs font-semibold" role="tablist">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-[#176B68] text-white'
              : 'text-[#60716E] hover:bg-[#EAF0ED]'
          }`}
        >
          Daily Mission Timeline
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ground_brief')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ground_brief'
              ? 'bg-[#176B68] text-white'
              : 'text-[#60716E] hover:bg-[#EAF0ED]'
          }`}
        >
          Flight Surgeon Ground Briefing Export
        </button>
      </div>

      {/* Tab 1: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide pb-2 border-b border-[#D9E2DE]">
            Mission Sol 85 - Sol 90 Telemetry Chronology
          </h2>

          <div className="space-y-4">
            {/* Sol 90 (Today) */}
            <div className="p-4 rounded-xl border border-[#EED8A7] bg-[#FBF0D9]/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#172A2B]">
                    SOL 090 (Today)
                  </span>
                  <StatusBadge status="yellow" size="sm" />
                </div>
                <span className="text-xs text-[#60716E]">
                  Status: Retained Locally (Demo)
                </span>
              </div>
              <p className="text-xs text-[#172A2B] font-medium leading-relaxed">
                Sleep logged at 5.2 hrs. Resting pulse 75 bpm (+13 bpm). Mild orthostatic blood pressure reading (136/88 mmHg). Autonomic cluster advisory active.
              </p>
              <div className="flex items-center justify-between text-xs text-[#60716E] pt-1">
                <span>Completed by CDR-01</span>
                <span>Sync Status: Ready for Downlink</span>
              </div>
            </div>

            {/* Sol 89 */}
            <div className="p-4 rounded-xl border border-[#D9E2DE] bg-[#F9FBFA] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#172A2B]">
                    SOL 089
                  </span>
                  <StatusBadge status="yellow" size="sm" />
                </div>
                <span className="text-xs text-[#247A55] font-semibold">
                  Downlink Confirmed
                </span>
              </div>
              <p className="text-xs text-[#172A2B] leading-relaxed">
                Sleep logged at 4.9 hrs. ARED resistive workout completed (45 min, 138 bpm avg). Fasting blood glucose 94 mg/dL.
              </p>
              <span className="text-xs text-[#60716E] block font-mono">
                ACK Hash: #89-ARES5-DSN
              </span>
            </div>

            {/* Sol 88 */}
            <div className="p-4 rounded-xl border border-[#D9E2DE] bg-[#F9FBFA] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#172A2B]">
                    SOL 088
                  </span>
                  <StatusBadge status="yellow" size="sm" />
                </div>
                <span className="text-xs text-[#247A55] font-semibold">
                  Downlink Confirmed
                </span>
              </div>
              <p className="text-xs text-[#172A2B] leading-relaxed">
                Sleep logged at 5.4 hrs. CEVIS cycle ergometer completed (35 min). Refractometer hydration index: 1.018 nominal.
              </p>
            </div>

            {/* Sol 87 */}
            <div className="p-4 rounded-xl border border-[#D9E2DE] bg-[#F9FBFA] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#172A2B]">
                    SOL 087
                  </span>
                  <StatusBadge status="yellow" size="sm" />
                </div>
                <span className="text-xs text-[#247A55] font-semibold">
                  Downlink Confirmed
                </span>
              </div>
              <p className="text-xs text-[#172A2B] leading-relaxed">
                Sleep recorded at 5.8 hrs. Initial sleep deficit threshold reached. Rest pulse drift observed.
              </p>
            </div>

            {/* Sol 86 */}
            <div className="p-4 rounded-xl border border-[#D9E2DE] bg-[#F9FBFA] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#172A2B]">
                    SOL 086
                  </span>
                  <StatusBadge status="green" size="sm" />
                </div>
                <span className="text-xs text-[#247A55] font-semibold">
                  Downlink Confirmed
                </span>
              </div>
              <p className="text-xs text-[#172A2B] leading-relaxed">
                Sleep logged at 7.1 hrs. Resting pulse 62 bpm. Vision acuity check 20/20 Left, 20/25 Right. All parameters nominal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ground Briefing Export */}
      {activeTab === 'ground_brief' && (
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
            <div>
              <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
                Flight Surgeon Telemetry Summary Brief
              </h2>
              <p className="text-xs text-[#60716E]">
                Formatted medical telemetry package prepared for ground medical team transmission.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-4 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download size={14} />
              <span>Export JSON Telemetry</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-[#E4F2E9] border border-[#BDE0CB] text-[#247A55] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Telemetry package downloaded successfully to your local machine!</span>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] text-xs space-y-2 text-[#172A2B]">
            <div className="flex justify-between border-b border-[#D9E2DE] pb-2 text-[#60716E] font-semibold">
              <span>MISSION: ARES-V / DAY 090</span>
              <span>CREW: CDR-01</span>
              <span>STATUS: ADVISORY (YELLOW)</span>
            </div>
            <p className="text-xs leading-relaxed py-1">
              <strong>EXECUTIVE CLINICAL SUMMARY:</strong> Astronaut exhibits a 4-night cumulative sleep deficit (avg 5.2 hrs vs 7.3 hrs baseline), accompanied by an autonomic compensation shift (+13 bpm resting nocturnal pulse, 36% decline in rMSSD). Daytime exertion reactivity noted. Core temperature, capillary glucose, and exercise compliance remain strictly nominal. Ground intervention not currently indicated; 90-min recovery sleep protocol initiated aboard vehicle.
            </p>
            <div className="pt-2 border-t border-[#D9E2DE] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#60716E]">
              <div>Sleep: 5.2 hrs (Yellow)</div>
              <div>HR: 75 bpm (Yellow)</div>
              <div>HRV: 32 ms (Yellow)</div>
              <div>Rad Dose: 162.4 mSv (Nominal)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
