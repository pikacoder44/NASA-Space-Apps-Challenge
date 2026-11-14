'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Stethoscope, 
  Brain,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Server
} from 'lucide-react';
import { AIAssistantExplanation } from '@/types/health';

export default function AIAssistantPage() {
  const { overview, repository } = useHealth();
  const [explanation, setExplanation] = useState<AIAssistantExplanation | null>(
    overview?.aiExplanation || null
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'raw_telemetry' | 'contract'>('explanation');
  
  // 3 States required by prompt: 'demo' | 'api_ready' | 'offline'
  const [evalState, setEvalState] = useState<'demo' | 'api_ready' | 'offline'>('demo');

  const handleRefreshEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const result = await repository.requestAIExplanation(true);
      setExplanation(result);
    } catch {
      // handled gracefully
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!overview) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#172A2B]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded flex items-center gap-1">
              <Sparkles size={12} />
              AI Assistant Interface
            </span>
            <span className="text-xs text-[#60716E]">
              FastAPI Backend Contract · Gemini Model
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            AI-Assisted Health Explanation
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Transparent clinical context generated from submitted telemetry and personal baseline variance.
          </p>
        </div>

        <button
          type="button"
          disabled={isEvaluating || evalState === 'offline'}
          onClick={handleRefreshEvaluation}
          className="px-4 py-2 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-40"
        >
          <RefreshCw size={14} className={isEvaluating ? 'animate-spin' : ''} />
          <span>{isEvaluating ? 'Synthesizing...' : 'Request Backend AI Synthesis'}</span>
        </button>
      </div>

      {/* State Switcher Bar (Demo / API-Ready / Offline) */}
      <div className="p-3 bg-white rounded-xl border border-[#D9E2DE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Server size={16} className="text-[#176B68]" />
          <span className="text-xs font-bold text-[#172A2B]">Architecture State Simulation:</span>
        </div>
        <div className="inline-flex rounded-lg border border-[#D9E2DE] p-0.5 bg-[#F4F6F4]" role="group">
          <button
            type="button"
            onClick={() => setEvalState('demo')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              evalState === 'demo' ? 'bg-white text-[#176B68] shadow-xs' : 'text-[#60716E]'
            }`}
          >
            Pre-Written Demo
          </button>
          <button
            type="button"
            onClick={() => setEvalState('api_ready')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              evalState === 'api_ready' ? 'bg-white text-[#176B68] shadow-xs' : 'text-[#60716E]'
            }`}
          >
            API-Ready Contract
          </button>
          <button
            type="button"
            onClick={() => setEvalState('offline')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              evalState === 'offline' ? 'bg-white text-[#176B68] shadow-xs' : 'text-[#60716E]'
            }`}
          >
            Offline / Unlinked
          </button>
        </div>
      </div>

      {/* State 1: Offline Fallback Banner */}
      {evalState === 'offline' && (
        <div className="p-5 rounded-xl bg-[#FBF0D9] border border-[#EED8A7] text-[#8A520F] space-y-3">
          <div className="flex items-center gap-2">
            <WifiOff size={18} className="shrink-0" />
            <h2 className="text-sm font-bold">FastAPI Backend Unreachable (Deep-Space Latency Window)</h2>
          </div>
          <p className="text-xs leading-relaxed">
            Gemini generative models run through our connected FastAPI backend server (proposed endpoint: <code className="bg-white/60 px-1 py-0.5 rounded text-[#172A2B]">POST /api/v1/health/ai-explanation</code>, to be confirmed with the backend team) and are not hosted locally on client hardware. During telemetry blackouts, AAHMS falls back smoothly to deterministic, rule-based clinical advice:
          </p>
          <div className="p-3.5 rounded-lg bg-white/80 border border-[#EED8A7] text-xs text-[#172A2B] space-y-1.5">
            <span className="font-bold text-[#8A520F] block">Deterministic Emergency Rule Summary:</span>
            <p>• Resting heart rate (+19.4% above Sol 60 baseline) combined with 4.2h sleep debt indicates autonomic recovery deficit.</p>
            <p>• Recommend scheduling 45-minute sleep opportunity and oral fluid rehydration prior to heavy physical task execution.</p>
            <p>• Ground telemetry package queued for transmission upon next Deep Space Network pass.</p>
          </div>
        </div>
      )}

      {/* State 2: API-Ready Contract View */}
      {evalState === 'api_ready' && (
        <div className="p-5 rounded-xl bg-white border border-[#D9E2DE] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-[#176B68]" />
              <h2 className="text-sm font-bold text-[#172A2B]">FastAPI Backend Endpoint Contract</h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#E4F2E9] text-[#247A55] text-xs font-semibold">
              Ready for Live Backend Dispatch
            </span>
          </div>
          <p className="text-xs text-[#60716E] leading-relaxed">
            When connected to the live FastAPI backend server, the client packages the active crew member’s calibrated baselines and latest Sol observations into the payload below:
          </p>
          <div className="p-4 rounded-xl bg-[#122B31] text-[#A2BEB9] text-xs font-mono overflow-x-auto space-y-1">
            <div className="text-[#84C2B4]">POST http://localhost:8000/api/v1/health/ai-explanation <span className="text-white/60 text-[11px]">(proposed, to be confirmed with the backend team)</span></div>
            <div className="text-white/40">Content-Type: application/json</div>
            <pre className="text-white mt-2 leading-relaxed">
{`{
  "mission_day": ${overview.missionDay},
  "crew_id": "CDR-01",
  "status": "${overview.overallStatus}",
  "telemetry": {
    "heart_rate": 74,
    "hrv_rmssd": 34,
    "sleep_hours": 5.2,
    "blood_pressure_systolic": 136,
    "blood_pressure_diastolic": 88
  },
  "baselines": {
    "heart_rate": 62,
    "hrv_rmssd": 44,
    "sleep_hours": 7.2
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* State 3: Pre-Written Demo State Label */}
      {evalState === 'demo' && (
        <div className="p-3 rounded-xl bg-[#DCEDEA]/60 border border-[#B6D6D0] flex items-center justify-between text-xs text-[#176B68]">
          <span className="font-semibold flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Demonstration Response: Pre-written synthesis for Sol 90 Attention scenario</span>
          </span>
          <span className="text-[11px] font-medium text-[#60716E]">FastAPI Schema Compliant</span>
        </div>
      )}

      {/* Trust & Boundary Notice */}
      <div className="p-4 rounded-xl bg-white border border-[#D9E2DE] text-xs text-[#172A2B] flex items-start gap-3 shadow-xs">
        <ShieldCheck size={18} className="text-[#176B68] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Medical Safety & Architectural Separation</p>
          <p className="text-[#60716E] leading-relaxed">
            The frontend never calls Gemini directly with private API keys. All AI evaluations pass through our validated FastAPI backend schema (`POST /api/v1/health/ai-explanation`). Measured telemetry facts are strictly isolated from advisory suggestions.
          </p>
        </div>
      </div>

      {/* Tab 1: Clinical Synthesis (Shown in Demo & API-Ready mode) */}
      {evalState !== 'offline' && explanation && (
        <div className="space-y-4">
          {/* Main Assessment Card */}
          <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
              <div className="flex items-center gap-2">
                <Brain size={18} className="text-[#176B68]" />
                <h2 className="text-sm font-bold text-[#172A2B]">
                  Autonomous Clinical Assessment
                </h2>
              </div>
              <span className="text-xs text-[#60716E]">
                Provider: {explanation.modelProvider} ({explanation.sourceType === 'gemini_fastapi_contract' ? 'FastAPI Contract' : 'Deterministic Rule'})
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#172A2B] font-medium leading-relaxed">
              {explanation.overallAssessment}
            </p>

            {/* Contributing Indicators */}
            <div className="pt-2">
              <span className="text-xs uppercase font-bold text-[#60716E] block mb-2">
                Key Telemetry Observations Analyzed:
              </span>
              <ul className="space-y-2 text-xs text-[#172A2B]">
                {explanation.observedPatterns.map((pat, idx) => (
                  <li key={idx} className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]/70 leading-relaxed">
                    <span className="font-bold text-[#176B68] uppercase text-[10px] tracking-wide block mb-0.5">
                      {pat.indicator.replace('_', ' ')}
                    </span>
                    <p className="font-semibold text-[#172A2B]">{pat.finding}</p>
                    <p className="text-[#60716E] text-xs italic mt-0.5">{pat.baselineComparison}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Operational Countermeasures vs Medical Disclaimers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Operational Recommendations */}
            <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-[#176B68]">
                  Conservative Countermeasures Suggested
                </h3>
                <ul className="space-y-2 text-xs text-[#172A2B]">
                  {explanation.suggestedReviewSteps.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#DCEDEA] text-[#176B68] font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flight Surgeon Escalation Criteria */}
            <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-[#176B68]" />
                  <h3 className="text-xs uppercase font-bold text-[#172A2B]">
                    Flight Surgeon Escalation Criteria
                  </h3>
                </div>
                <p className="text-xs text-[#60716E] leading-relaxed">
                  {explanation.flightSurgeonEscalation.reason}
                </p>
                <div className="p-3 rounded-lg bg-[#FBF0D9]/50 border border-[#EED8A7] text-xs space-y-1">
                  <span className="font-bold text-[#8A520F] block">Safety Boundary:</span>
                  <p className="text-[#8A520F] text-xs leading-relaxed">
                    The AI is configured never to generate clinical drug prescriptions or override mission flight physician directives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
