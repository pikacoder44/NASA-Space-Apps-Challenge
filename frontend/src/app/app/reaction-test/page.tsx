'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useHealth } from '@/context/HealthContext';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Award 
} from 'lucide-react';

type TestState = 'idle' | 'waiting' | 'ready' | 'result' | 'false_start' | 'completed';

export default function ReactionTestPage() {
  const { overview, repository } = useHealth();

  const [testState, setTestState] = useState<TestState>('idle');
  const [round, setRound] = useState(1);
  const totalRounds = 5;
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentReactionTime, setCurrentReactionTime] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTestRound = () => {
    setTestState('waiting');
    setCurrentReactionTime(null);

    // Random delay between 1.8s and 4.5s
    const randomDelay = Math.floor(Math.random() * 2700) + 1800;

    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setTestState('ready');
    }, randomDelay);
  };

  const handleStimulusPress = () => {
    if (testState === 'waiting') {
      // False start / anticipation error
      if (timerRef.current) clearTimeout(timerRef.current);
      setTestState('false_start');
      return;
    }

    if (testState === 'ready') {
      const elapsed = Date.now() - startTimeRef.current;
      setCurrentReactionTime(elapsed);
      const updatedTimes = [...reactionTimes, elapsed];
      setReactionTimes(updatedTimes);

      if (round < totalRounds) {
        setTestState('result');
      } else {
        setTestState('completed');
        // Record as manual assessment
        const avg = Math.round(updatedTimes.reduce((a, b) => a + b, 0) / updatedTimes.length);
        repository.addManualRecord({
          missionDay: overview?.missionDay || 90,
          testType: 'Vision Acuity (SANS Check)',
          value: `${avg} ms avg (PVT)`,
          unit: 'ms',
          deviceUsed: 'AAHMS Psychomotor Vigilance Assessment Module',
          techniqueNotes: `Completed 5-round reaction test. Lapses (>500ms): ${updatedTimes.filter(t => t > 500).length}`,
          origin: 'manual',
          status: avg > 320 ? 'yellow' : 'green'
        });
      }
    }
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    startTestRound();
  };

  const resetFullTest = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRound(1);
    setReactionTimes([]);
    setCurrentReactionTime(null);
    setTestState('idle');
  };

  const averageReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const fastestTime = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
  const lapsesCount = reactionTimes.filter((t) => t > 500).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Psychomotor Vigilance Test (PVT)
            </span>
            <span className="text-xs text-[#60716E]">
              Cognitive Fatigue Assessment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Operational Alertness & Reaction Test
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Evaluates sensorimotor speed and sustained vigilance to identify cognitive fatigue from sleep debt.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#60716E]">
            Baseline Target: ~240 ms
          </span>
        </div>
      </div>

      {/* Protocol Context Info */}
      <div className="p-4 rounded-xl bg-[#EAF0ED] border border-[#D9E2DE] text-xs text-[#172A2B] flex items-start gap-2.5">
        <Info size={16} className="text-[#176B68] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>NASA HRP Behavioral Health Standard:</strong> Visual Psychomotor Vigilance testing detects micro-lapses and vigilance degradation before overt operational mistakes occur during critical space maneuvers.
        </p>
      </div>

      {/* Main Interactive Test Area */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#176B68]" />
            <h2 className="text-sm font-bold text-[#172A2B] uppercase font-mono tracking-wide">
              Stimulus Response Canvas (Round {round} of {totalRounds})
            </h2>
          </div>
          <span className="text-xs font-mono text-[#60716E]">
            {reactionTimes.length} Trials Recorded
          </span>
        </div>

        {/* Dynamic Interactive Box */}
        <div
          onClick={handleStimulusPress}
          className={`w-full h-72 sm:h-80 rounded-2xl flex flex-col items-center justify-center text-center p-6 transition-all select-none cursor-pointer ${
            testState === 'idle'
              ? 'bg-[#F4F6F4] border-2 border-dashed border-[#D9E2DE] hover:border-[#176B68]'
              : testState === 'waiting'
              ? 'bg-[#122B31] border-2 border-[#1E434C] text-white'
              : testState === 'ready'
              ? 'bg-[#247A55] border-2 border-[#1B5D41] text-white animate-pulse'
              : testState === 'false_start'
              ? 'bg-[#F9E7E5] border-2 border-[#F1BCB7] text-[#B33C3C]'
              : testState === 'result'
              ? 'bg-[#DCEDEA] border-2 border-[#B4D7D1] text-[#172A2B]'
              : 'bg-[#E4F2E9] border-2 border-[#BDE0CB] text-[#172A2B]'
          }`}
        >
          {testState === 'idle' && (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#DCEDEA] text-[#176B68] flex items-center justify-center mx-auto">
                <Play size={28} className="translate-x-0.5" />
              </div>
              <h3 className="text-base font-bold text-[#172A2B]">
                Press Start to Begin Alertness Assessment
              </h3>
              <p className="text-xs text-[#60716E] max-w-sm mx-auto">
                Tap anywhere inside the box as soon as the screen turns GREEN.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startTestRound();
                }}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] shadow-xs cursor-pointer"
              >
                Begin Trial 1
              </button>
            </div>
          )}

          {testState === 'waiting' && (
            <div className="space-y-2">
              <Clock size={36} className="mx-auto text-[#A2BEB9] animate-spin" />
              <h3 className="text-lg font-bold text-white tracking-wide font-mono">
                WAIT FOR GREEN STIMULUS...
              </h3>
              <p className="text-xs text-[#A2BEB9]">
                Keep finger ready. Do not tap early.
              </p>
            </div>
          )}

          {testState === 'ready' && (
            <div className="space-y-2">
              <Zap size={56} className="mx-auto text-white" />
              <h3 className="text-3xl font-extrabold text-white tracking-wider font-mono">
                TAP NOW!
              </h3>
            </div>
          )}

          {testState === 'false_start' && (
            <div className="space-y-3">
              <AlertTriangle size={36} className="mx-auto text-[#B33C3C]" />
              <h3 className="text-base font-bold text-[#B33C3C]">
                Too Early! (Anticipation Error)
              </h3>
              <p className="text-xs text-[#60716E]">
                Wait for the screen to turn green before responding.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startTestRound();
                }}
                className="px-4 py-2 rounded-lg bg-[#B33C3C] text-white text-xs font-bold hover:bg-[#962F2F] cursor-pointer"
              >
                Retry Trial {round}
              </button>
            </div>
          )}

          {testState === 'result' && (
            <div className="space-y-3">
              <CheckCircle2 size={36} className="mx-auto text-[#176B68]" />
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold tabular-data text-[#172A2B]">
                  {currentReactionTime}
                </span>
                <span className="text-sm font-mono text-[#60716E]">ms</span>
              </div>
              <p className="text-xs text-[#176B68] font-bold">
                {currentReactionTime && currentReactionTime < 250
                  ? 'Excellent response speed!'
                  : currentReactionTime && currentReactionTime < 350
                  ? 'Nominal operational range'
                  : 'Slight latency detected (fatigue marker)'}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextRound();
                }}
                className="px-5 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] cursor-pointer"
              >
                Proceed to Trial {round + 1}
              </button>
            </div>
          )}

          {testState === 'completed' && (
            <div className="space-y-3">
              <Award size={40} className="mx-auto text-[#247A55]" />
              <h3 className="text-lg font-bold text-[#172A2B]">
                Assessment Complete (5 Trials Finished)
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold tabular-data text-[#247A55]">
                  {averageReactionTime}
                </span>
                <span className="text-sm font-mono text-[#60716E]">ms average</span>
              </div>
              <p className="text-xs text-[#60716E] max-w-sm mx-auto">
                Logged to your mission records. Personal baseline comparison: {averageReactionTime - 240 > 0 ? `+${averageReactionTime - 240} ms slower` : `${240 - averageReactionTime} ms faster`}.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetFullTest();
                }}
                className="px-5 py-2 rounded-lg bg-[#172A2B] text-white text-xs font-bold hover:bg-[#28494F] cursor-pointer"
              >
                Start New Assessment
              </button>
            </div>
          )}
        </div>

        {/* Results Metrics Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-[#60716E] block font-mono text-[10px] uppercase">
              Average Latency
            </span>
            <span className="text-xl font-bold tabular-data text-[#172A2B]">
              {averageReactionTime ? `${averageReactionTime} ms` : '—'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-[#60716E] block font-mono text-[10px] uppercase">
              Fastest Trial
            </span>
            <span className="text-xl font-bold tabular-data text-[#176B68]">
              {fastestTime ? `${fastestTime} ms` : '—'}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-[#60716E] block font-mono text-[10px] uppercase">
              Fatigue Lapses (&gt;500ms)
            </span>
            <span className="text-xl font-bold tabular-data text-[#A96617]">
              {lapsesCount}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]/70">
            <span className="text-[#60716E] block font-mono text-[10px] uppercase">
              Personal Baseline
            </span>
            <span className="text-xl font-bold tabular-data text-[#172A2B]">
              240 ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
