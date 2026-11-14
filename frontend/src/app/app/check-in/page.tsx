'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { DailyCheckInInput, SaveResult } from '@/types/health';
import { 
  Heart, 
  Moon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DailyCheckInPage() {
  const { overview, submitCheckIn } = useHealth();

  const [formData, setFormData] = useState<DailyCheckInInput>({
    missionDay: 90,
    timestamp: '2026-11-14T06:00:00Z',
    heartRate: 75,
    bloodPressureSystolic: 136,
    bloodPressureDiastolic: 88,
    bloodSugar: 94,
    skinTemperature: 36.8,
    sleepHours: 5.2,
    moodRating: 2,
    energyRating: 2,
    waterIntakeLiters: 2.2,
    symptomsNotes: 'Mild morning fatigue, light tension in neck, acoustic noise from ventilation fan #2.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SaveResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<'form' | 'review' | 'success'>('form');

  const handleChange = (field: keyof DailyCheckInInput, val: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePreFillNominal = () => {
    setFormData({
      missionDay: overview?.missionDay || 90,
      timestamp: new Date().toISOString(),
      heartRate: 63,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 78,
      bloodSugar: 90,
      skinTemperature: 36.7,
      sleepHours: 7.4,
      moodRating: 4,
      energyRating: 4,
      waterIntakeLiters: 2.5,
      symptomsNotes: 'Well rested. No unusual physiological symptoms.'
    });
  };

  const handlePreFillDay90Scenario = () => {
    setFormData({
      missionDay: 90,
      timestamp: new Date().toISOString(),
      heartRate: 75,
      bloodPressureSystolic: 136,
      bloodPressureDiastolic: 88,
      bloodSugar: 94,
      skinTemperature: 36.8,
      sleepHours: 5.2,
      moodRating: 2,
      energyRating: 2,
      waterIntakeLiters: 2.0,
      symptomsNotes: 'Woke multiple times. Light eye fatigue, feeling drained after morning shift.'
    });
  };

  const validateAndProceedToReview = () => {
    setValidationError(null);
    if (!formData.sleepHours || formData.sleepHours < 0 || formData.sleepHours > 24) {
      setValidationError('Please enter a valid sleep duration between 0 and 24 hours.');
      return;
    }
    if (formData.heartRate && (formData.heartRate < 35 || formData.heartRate > 220)) {
      setValidationError('Heart rate value appears outside plausible operational range (35–220 bpm).');
      return;
    }
    if (formData.bloodPressureSystolic && (formData.bloodPressureSystolic < 70 || formData.bloodPressureSystolic > 250)) {
      setValidationError('Systolic pressure appears outside plausible range (70–250 mmHg).');
      return;
    }
    setActiveStep('review');
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await submitCheckIn(formData);
      setSubmissionResult(res);
      setActiveStep('success');
    } catch {
      setValidationError('Failed to record check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Protocol Check-In
            </span>
            <span className="text-xs text-[#60716E]">
              Target Duration: &lt; 60 Seconds
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Daily Astronaut Health Log
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Log vital observations and subjective well-being. Maintains your mission consistency streak.
          </p>
        </div>

        {/* Demo Fast-Fill presets for judging walkthrough */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePreFillDay90Scenario}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FBF0D9] text-[#8A520F] border border-[#EED8A7] hover:bg-[#F5E5C4] transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles size={12} />
            Fill Day 90 (Deficit)
          </button>
          <button
            type="button"
            onClick={handlePreFillNominal}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#E4F2E9] text-[#247A55] border border-[#BDE0CB] hover:bg-[#D5EBDE] transition-colors cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 size={12} />
            Fill Nominal
          </button>
        </div>
      </div>

      {/* Validation alert banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-[#F9E7E5] border border-[#F1BCB7] text-[#B33C3C] text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step 1: Form Input View */}
      {activeStep === 'form' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validateAndProceedToReview();
          }}
          className="space-y-6"
        >
          {/* Section 1: Measured Vitals (Sensors / Cuffs) */}
          <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#176B68]" />
                <h2 className="text-sm font-bold text-[#172A2B] uppercase font-mono tracking-wide">
                  1. Measured Physiological Vitals
                </h2>
              </div>
              <span className="text-[11px] text-[#60716E]">
                Imported from wearable sensor or flight diagnostic cuff
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Resting Heart Rate */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Resting Heart Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.heartRate || ''}
                    onChange={(e) => handleChange('heartRate', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="62"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    bpm
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#60716E] mt-1">
                  <span>Baseline: ~62 bpm</span>
                  <Link href="/app/guides" className="text-[#176B68] hover:underline">Guide</Link>
                </div>
              </div>

              {/* Blood Pressure Systolic */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Blood Pressure (Systolic)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bloodPressureSystolic || ''}
                    onChange={(e) => handleChange('bloodPressureSystolic', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="120"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    mmHg
                  </span>
                </div>
                <span className="text-[10px] text-[#60716E] mt-1 block">Baseline: 120 mmHg</span>
              </div>

              {/* Blood Pressure Diastolic */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Blood Pressure (Diastolic)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bloodPressureDiastolic || ''}
                    onChange={(e) => handleChange('bloodPressureDiastolic', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="78"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    mmHg
                  </span>
                </div>
                <span className="text-[10px] text-[#60716E] mt-1 block">Baseline: 78 mmHg</span>
              </div>

              {/* Skin/Core Temperature */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Core / Skin Temperature
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.skinTemperature || ''}
                    onChange={(e) => handleChange('skinTemperature', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="36.7"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    °C
                  </span>
                </div>
                <span className="text-[10px] text-[#60716E] mt-1 block">Baseline: 36.7 °C</span>
              </div>

              {/* Blood Glucose (Fasting) */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Blood Glucose (Fasting Manual)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bloodSugar || ''}
                    onChange={(e) => handleChange('bloodSugar', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="90"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    mg/dL
                  </span>
                </div>
                <span className="text-[10px] text-[#60716E] mt-1 block">Baseline: 82–102 mg/dL</span>
              </div>

              {/* Water Intake */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Hydration Target (24h)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waterIntakeLiters || ''}
                    onChange={(e) => handleChange('waterIntakeLiters', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="2.5"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    Liters
                  </span>
                </div>
                <span className="text-[10px] text-[#60716E] mt-1 block">Target: 2.5 L / day</span>
              </div>
            </div>
          </div>

          {/* Section 2: Rest & Self-Reported Well-Being */}
          <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
              <div className="flex items-center gap-2">
                <Moon size={18} className="text-[#176B68]" />
                <h2 className="text-sm font-bold text-[#172A2B] uppercase font-mono tracking-wide">
                  2. Sleep & Self-Reported Well-Being
                </h2>
              </div>
              <span className="text-[11px] text-[#60716E]">
                Self-reported under NASA behavioral health Likert scale
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Sleep Duration */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Sleep Duration (Hours)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.sleepHours || ''}
                    onChange={(e) => handleChange('sleepHours', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold tabular-data border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68] focus:border-[#176B68]"
                    placeholder="7.3"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-[#60716E]">
                    hrs
                  </span>
                </div>
                <span className="text-[10px] text-[#60716E] mt-1 block">
                  Established Baseline: 7.3 hrs
                </span>
              </div>

              {/* Mood Rating (1-5) */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Subjective Mood ({formData.moodRating} / 5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.moodRating}
                  onChange={(e) => handleChange('moodRating', Number(e.target.value))}
                  className="w-full accent-[#176B68] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#60716E] mt-1">
                  <span>1: Stressed</span>
                  <span>3: Moderate</span>
                  <span>5: Calm & Focused</span>
                </div>
              </div>

              {/* Energy / Fatigue (1-5) */}
              <div>
                <label className="block text-xs font-bold text-[#172A2B] mb-1">
                  Energy & Stamina ({formData.energyRating} / 5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.energyRating}
                  onChange={(e) => handleChange('energyRating', Number(e.target.value))}
                  className="w-full accent-[#176B68] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#60716E] mt-1">
                  <span>1: Drained</span>
                  <span>3: Normal</span>
                  <span>5: High Energy</span>
                </div>
              </div>
            </div>

            {/* Qualitative Symptoms / Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#172A2B] mb-1">
                Optional Operational Observations / Symptoms
              </label>
              <textarea
                rows={2}
                value={formData.symptomsNotes || ''}
                onChange={(e) => handleChange('symptomsNotes', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68]"
                placeholder="Note cabin noise, environmental temperature, or specific fatigue sensations..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/app"
              className="text-xs font-semibold text-[#60716E] hover:text-[#172A2B]"
            >
              Cancel and Return
            </Link>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Review Observations</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Verification & Review View */}
      {activeStep === 'review' && (
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-6">
          <div className="pb-3 border-b border-[#D9E2DE]">
            <h2 className="text-lg font-bold text-[#172A2B]">
              Verify Daily Health Log Entries
            </h2>
            <p className="text-xs text-[#60716E]">
              Confirm entries before submitting to local mission storage and synchronization queue.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-[11px]">Resting Pulse:</span>
              <span className="text-base font-bold tabular-data text-[#172A2B]">
                {formData.heartRate} bpm
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-[11px]">Blood Pressure:</span>
              <span className="text-base font-bold tabular-data text-[#172A2B]">
                {formData.bloodPressureSystolic}/{formData.bloodPressureDiastolic} mmHg
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-[11px]">Sleep Recorded:</span>
              <span className="text-base font-bold tabular-data text-[#172A2B]">
                {formData.sleepHours} hrs
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-[11px]">Core/Skin Temp:</span>
              <span className="text-base font-bold tabular-data text-[#172A2B]">
                {formData.skinTemperature} °C
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-[11px]">Mood Rating:</span>
              <span className="text-base font-bold tabular-data text-[#172A2B]">
                {formData.moodRating} / 5
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-[11px]">Energy / Stamina:</span>
              <span className="text-base font-bold tabular-data text-[#172A2B]">
                {formData.energyRating} / 5
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-xs">Blood Glucose:</span>
              <span className="text-base font-bold tabular-nums text-[#172A2B]">
                {formData.bloodSugar} mg/dL
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4]">
              <span className="text-[#60716E] block text-xs">Hydration:</span>
              <span className="text-base font-bold tabular-nums text-[#172A2B]">
                {formData.waterIntakeLiters} L
              </span>
            </div>
          </div>

          {formData.symptomsNotes && (
            <div className="p-3 rounded-lg bg-[#F4F6F4] text-xs">
              <span className="font-bold text-[#172A2B] block mb-0.5">Notes:</span>
              <p className="text-[#60716E]">{formData.symptomsNotes}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#D9E2DE]">
            <button
              type="button"
              onClick={() => setActiveStep('form')}
              className="px-4 py-2 text-xs font-semibold text-[#172A2B] hover:bg-[#F4F6F4] rounded-lg border border-[#D9E2DE]"
            >
              Back to Edit
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <CheckCircle2 size={16} />
              <span>{isSubmitting ? 'Logging...' : 'Confirm & Save Check-In'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success State View */}
      {activeStep === 'success' && submissionResult && (
        <div className="bg-white rounded-xl border border-[#BDE0CB] p-8 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#E4F2E9] text-[#247A55] flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#172A2B]">
              Daily Health Log Recorded Successfully
            </h2>
            <p className="text-xs text-[#60716E] mt-1 max-w-md mx-auto">
              {submissionResult.message}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F6F4] max-w-sm mx-auto text-xs text-[#60716E] space-y-1.5 border border-[#D9E2DE]">
            <div className="flex justify-between items-center">
              <span>Sync State:</span>
              <span className="font-semibold text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded text-[11px]">Saved on this device · pending sync</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gamification Reward:</span>
              <span className="font-bold text-[#247A55]">+50 Protocol Points</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Timestamp:</span>
              <span className="tabular-data">{new Date(submissionResult.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              href="/app"
              className="px-5 py-2.5 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-colors"
            >
              Return to Mission Overview
            </Link>
            <Link
              href="/app/consistency"
              className="px-5 py-2.5 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE] text-[#172A2B] text-xs font-bold hover:bg-[#EAF0ED] transition-colors"
            >
              View Consistency Streak
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
