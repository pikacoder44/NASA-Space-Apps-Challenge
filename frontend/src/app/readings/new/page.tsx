'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  ExternalLink,
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';
import { AppShell } from '../../../components/layout/AppShell';
import { submitReading, getGuidance } from '../../../lib/api';
import { STATUS_COLORS, STATUS_LABEL } from '../../../lib/colors';
import type { Indicator, Status, Reading, GuidanceData } from '../../../lib/types';

interface IndicatorConfig {
  key: Indicator;
  label: string;
  unit: string;
  min: number;
  max: number;
  normalRange: [number, number];
  warningRange: [number, number];
  defaultVal: number;
  spaceContext: string;
}

const INDICATORS: IndicatorConfig[] = [
  {
    key: 'heart_rate',
    label: 'Heart Rate (Resting)',
    unit: 'bpm',
    min: 40,
    max: 180,
    normalRange: [60, 100],
    warningRange: [50, 120],
    defaultVal: 74,
    spaceContext: 'Microgravity alters autonomic balance and central blood volume; tachycardia may indicate fluid loss or high workload.'
  },
  {
    key: 'blood_pressure_systolic',
    label: 'Blood Pressure (Systolic)',
    unit: 'mmHg',
    min: 70,
    max: 200,
    normalRange: [90, 120],
    warningRange: [80, 140],
    defaultVal: 122,
    spaceContext: 'Cephalic fluid shifts alter carotid baroreceptors, impacting upper body arterial perfusion.'
  },
  {
    key: 'blood_pressure_diastolic',
    label: 'Blood Pressure (Diastolic)',
    unit: 'mmHg',
    min: 40,
    max: 130,
    normalRange: [60, 80],
    warningRange: [50, 90],
    defaultVal: 81,
    spaceContext: 'Peripheral resistance decreases in spaceflight; monitoring diastolic pressure detects systemic vascular adaptation.'
  },
  {
    key: 'body_temp',
    label: 'Core Body Temperature',
    unit: '°C',
    min: 34.0,
    max: 42.0,
    normalRange: [36.1, 37.2],
    warningRange: [35.5, 38.0],
    defaultVal: 36.8,
    spaceContext: 'Spaceflight-associated core temperature elevation ("space fever") impairs physical thermoregulation during heavy work.'
  },
  {
    key: 'blood_sugar',
    label: 'Blood Glucose (Post-absorptive)',
    unit: 'mg/dL',
    min: 40,
    max: 300,
    normalRange: [70, 140],
    warningRange: [60, 180],
    defaultVal: 95,
    spaceContext: 'Metabolic shifts in space may cause transient insulin resistance; regular tracking avoids hypoglycemic fatigue.'
  },
  {
    key: 'sleep_hours',
    label: 'Sleep Duration (Last Sol)',
    unit: 'hours',
    min: 1.0,
    max: 16.0,
    normalRange: [7.0, 9.0],
    warningRange: [6.0, 10.0],
    defaultVal: 6.8,
    spaceContext: 'Circadian desynchrony in enclosed spacecraft cabins directly correlates with cognitive errors and slow reaction times.'
  },
  {
    key: 'mood_score',
    label: 'Subjective Well-being / Mood',
    unit: '1-10',
    min: 1,
    max: 10,
    normalRange: [6, 10],
    warningRange: [4, 10],
    defaultVal: 7,
    spaceContext: 'Confinement and mission stress can degrade mood; regular subjective ratings maintain crew psychological safety.'
  }
];

export default function NewReadingPage() {
  const [selectedKey, setSelectedKey] = useState<Indicator>('heart_rate');
  const [val, setVal] = useState<number>(74);
  const [submitting, setSubmitting] = useState(false);
  const [savedReading, setSavedReading] = useState<Reading | null>(null);
  const [guidance, setGuidance] = useState<GuidanceData | null>(null);

  const currentConfig = INDICATORS.find(i => i.key === selectedKey) || INDICATORS[0];

  // Evaluate status live before submitting
  const evaluateStatus = (value: number, config: IndicatorConfig): Status => {
    if (value >= config.normalRange[0] && value <= config.normalRange[1]) {
      return 'normal';
    }
    if (value >= config.warningRange[0] && value <= config.warningRange[1]) {
      return 'warning';
    }
    return 'critical';
  };

  const previewStatus = evaluateStatus(val, currentConfig);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSavedReading(null);
    setGuidance(null);

    try {
      const result = await submitReading({
        indicator: selectedKey,
        value: val,
        unit: currentConfig.unit,
        measured_at: new Date().toISOString()
      });
      setSavedReading(result);

      // Fetch NASA/CSA clinical guidance
      const guideData = await getGuidance(selectedKey, result.status);
      setGuidance(guideData);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-main transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs font-mono text-muted">AstroTrack Telemetry Ingestion</span>
        </div>

        {/* Card Header */}
        <div className="p-6 rounded-2xl bg-surface border border-border space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold">
              <Activity size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-main tracking-tight">Record Vital Reading</h1>
              <p className="text-xs text-muted">Designed for rapid crew self-assessment under 30 seconds</p>
            </div>
          </div>
        </div>

        {/* Ingestion Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-surface border border-border space-y-6 shadow-xs">
          {/* Indicator Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Select Physiological Metric
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INDICATORS.map((ind) => {
                const isSelected = selectedKey === ind.key;
                return (
                  <button
                    key={ind.key}
                    type="button"
                    onClick={() => {
                      setSelectedKey(ind.key);
                      setVal(ind.defaultVal);
                      setSavedReading(null);
                      setGuidance(null);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand bg-brand/10 text-brand shadow-xs font-bold'
                        : 'border-border hover:bg-surface-alt text-main font-medium'
                    }`}
                  >
                    <div className="text-xs truncate">{ind.label.split('(')[0]}</div>
                    <div className="text-[11px] text-muted font-mono">{ind.unit}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Big Input with Inline Units */}
          <div className="space-y-2 p-5 rounded-2xl bg-surface-alt/40 border border-border">
            <div className="flex items-center justify-between">
              <label htmlFor="reading-val" className="text-sm font-bold text-main">
                {currentConfig.label}
              </label>
              <span className="text-xs text-muted font-mono">
                Valid: {currentConfig.min} – {currentConfig.max} {currentConfig.unit}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                id="reading-val"
                type="number"
                step={currentConfig.key === 'body_temp' || currentConfig.key === 'sleep_hours' ? '0.1' : '1'}
                min={currentConfig.min}
                max={currentConfig.max}
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                required
                className="w-full text-4xl sm:text-5xl font-mono font-extrabold px-4 py-3 rounded-xl bg-surface border-2 border-border focus:border-brand focus:outline-none text-main shadow-inner transition-colors"
              />
              <span className="absolute right-4 text-xl sm:text-2xl font-mono font-bold text-muted pointer-events-none">
                {currentConfig.unit}
              </span>
            </div>

            {/* Live Status Preview Before Submit */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted">Live Evaluation:</span>
                <span 
                  className="px-2 py-0.5 rounded font-extrabold text-white text-[11px] uppercase tracking-wider"
                  style={{ backgroundColor: STATUS_COLORS[previewStatus] }}
                >
                  {STATUS_LABEL[previewStatus]}
                </span>
              </div>
              <span className="text-xs text-muted">
                Normal range: {currentConfig.normalRange[0]}–{currentConfig.normalRange[1]} {currentConfig.unit}
              </span>
            </div>
          </div>

          {/* Microgravity Spaceflight Context */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface-alt border border-border text-xs text-muted">
            <Info size={16} className="text-brand shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-main">Aerospace Context: </strong>
              {currentConfig.spaceContext}
            </p>
          </div>

          {/* Big Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-extrabold text-base bg-brand text-white hover:bg-brand-hover shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <span>Transmitting Telemetry...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit &amp; Evaluate Reading</span>
              </>
            )}
          </button>
        </form>

        {/* Guidance Panel (Appears after submitting reading) */}
        {savedReading && guidance && (
          <div 
            className="p-6 rounded-2xl border space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ 
              borderColor: STATUS_COLORS[savedReading.status],
              backgroundColor: savedReading.status === 'normal' ? 'rgba(34, 197, 94, 0.06)' : 'rgba(234, 179, 8, 0.08)'
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: STATUS_COLORS[savedReading.status] }}
                >
                  {savedReading.status === 'normal' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-main">{guidance.title}</h3>
                  <div className="text-xs text-muted">
                    Logged {savedReading.value} {savedReading.unit} · {new Date(savedReading.measured_at).toLocaleTimeString()} UTC
                  </div>
                </div>
              </div>

              <span 
                className="px-2.5 py-0.5 rounded text-xs font-extrabold text-white uppercase tracking-wider"
                style={{ backgroundColor: STATUS_COLORS[savedReading.status] }}
              >
                {STATUS_LABEL[savedReading.status]}
              </span>
            </div>

            <div className="space-y-2 text-sm text-main leading-relaxed">
              <p>
                <strong>Spaceflight Explanation: </strong>
                {guidance.explanation}
              </p>
              <p className="p-3 rounded-xl bg-surface border border-border font-medium text-xs text-main">
                <strong>Recommended Countermeasure: </strong>
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
                <span>Citation: {guidance.citation}</span>
                <ExternalLink size={12} />
              </a>
              <Link href="/dashboard" className="font-bold text-main hover:underline">
                Return to Cockpit →
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
