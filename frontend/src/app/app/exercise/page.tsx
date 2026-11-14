'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useHealth } from '@/context/HealthContext';
import { ExerciseEntry } from '@/types/health';
import { 
  Dumbbell, 
  PlusCircle, 
  CheckCircle2, 
  Bone,
  Heart,
  Activity,
  Flame,
  ShieldCheck
} from 'lucide-react';

import { INITIAL_EXERCISE_LOG } from '@/data/mockData';

export default function ExerciseActivityPage() {
  const { overview, repository } = useHealth();
  const [entries, setEntries] = useState<ExerciseEntry[]>(INITIAL_EXERCISE_LOG);

  // New Exercise Form State
  const [showForm, setShowForm] = useState(false);
  const [activityType, setActivityType] = useState<ExerciseEntry['activityType']>('ARED Resistive');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [avgHeartRate, setAvgHeartRate] = useState(135);
  const [intensityScore, setIntensityScore] = useState<ExerciseEntry['intensityScore']>('high');
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ExerciseEntry = {
      id: `ex_${Date.now()}`,
      timestamp: new Date().toISOString(),
      missionDay: overview?.missionDay || 90,
      activityType,
      durationMinutes,
      avgHeartRate,
      intensityScore,
      notes: notes || 'Standard countermeasure workout completed.',
      origin: 'manual'
    };
    await repository.addExerciseEntry(newEntry);
    setEntries((prev) => [newEntry, ...prev]);
    setSaveSuccess(true);
    setShowForm(false);
    setNotes('');
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const totalMinutesThisWeek = entries
    .filter((e) => (overview?.missionDay || 90) - e.missionDay <= 7)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="space-y-6 text-[#172A2B]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Musculoskeletal Countermeasures
            </span>
            <span className="text-xs text-[#60716E]">
              ARED & T2 Exercise Operations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Exercise & Activity Logging
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Preserve cancellous bone density, cardiovascular stroke volume, and muscular endurance in zero-g.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <PlusCircle size={15} />
          <span>{showForm ? 'Hide Form' : 'Log Workout Session'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#E4F2E9] border border-[#BDE0CB] text-[#247A55] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Exercise workout recorded and +30 protocol points awarded to your crew profile!</span>
        </div>
      )}

      {/* NASA Context Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#176B68]" />
              <h2 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
                NASA Countermeasure Protocol (NASA-STD-3001)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#172A2B] leading-relaxed">
              Crew members on long-duration exploration missions perform 2.5 hours of daily scheduled physical exercise (combining resistive and aerobic modalities) to counter microgravity deconditioning and bone calcium loss.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]">
              <span className="text-[#60716E] block mb-0.5">Rolling 7-Sol Total</span>
              <span className="text-xl font-extrabold text-[#172A2B] tabular-data">{totalMinutesThisWeek} min</span>
              <span className="text-[10px] text-[#60716E] block">Target: 300+ min/wk</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]">
              <span className="text-[#60716E] block mb-0.5">ARED Adherence</span>
              <span className="text-xl font-extrabold text-[#247A55] tabular-data">94%</span>
              <span className="text-[10px] text-[#60716E] block">Nominal protocol status</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]">
              <span className="text-[#60716E] block mb-0.5">Mean Cardiac Load</span>
              <span className="text-xl font-extrabold text-[#176B68] tabular-data">138 bpm</span>
              <span className="text-[10px] text-[#60716E] block">Aerobic zone maintained</span>
            </div>
          </div>
        </div>

        {/* Right NASA Image Card */}
        <div className="lg:col-span-4 rounded-xl border border-[#D9E2DE] overflow-hidden bg-[#122B31] text-white relative min-h-[200px] flex flex-col justify-end p-5">
          <Image
            src="/images/nasa/iss-exercise-ared.jpg"
            alt="Koichi Wakata exercising on ARED aboard ISS"
            fill
            className="object-cover object-center opacity-65"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122B31] via-[#122B31]/60 to-transparent" />
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#84C2B4]">NASA / JAXA (iss038e002180)</span>
            <h3 className="text-sm font-bold text-white">Koichi Wakata on ARED</h3>
            <p className="text-xs text-[#A2BEB9] leading-relaxed">
              Advanced Resistive Exercise Device simulates terrestrial free-weight loading using vacuum cylinders.
            </p>
          </div>
        </div>
      </div>

      {/* New Workout Form Modal/Panel */}
      {showForm && (
        <form
          onSubmit={handleAddExercise}
          className="bg-white rounded-xl border border-[#176B68] p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
            <h3 className="text-sm font-bold text-[#172A2B] uppercase tracking-wide">
              Record Countermeasure Session
            </h3>
            <span className="text-xs text-[#176B68] font-bold">
              Sol {overview?.missionDay || 90}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Exercise Equipment / Type
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as ExerciseEntry['activityType'])}
                className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg bg-white font-medium"
              >
                <option value="ARED Resistive">ARED Resistive (Squat/Deadlift)</option>
                <option value="T2 Treadmill">T2 Treadmill (Bungee Harness)</option>
                <option value="Cycle Ergometer (CEVIS)">Cycle Ergometer (CEVIS)</option>
                <option value="EVA Mobility Drill">EVA Mobility / Suit Drill</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg font-bold tabular-data"
              />
            </div>

            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Average Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="60"
                max="210"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg font-bold tabular-data"
              />
            </div>

            <div>
              <label className="block font-bold text-[#172A2B] mb-1">
                Intensity Level
              </label>
              <select
                value={intensityScore}
                onChange={(e) => setIntensityScore(e.target.value as ExerciseEntry['intensityScore'])}
                className="w-full px-3 py-2 border border-[#D9E2DE] rounded-lg bg-white font-medium"
              >
                <option value="low">Low (Active Recovery)</option>
                <option value="moderate">Moderate</option>
                <option value="high">High (Prescribed Protocol)</option>
                <option value="rigorous">Rigorous / Peak Exertion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#172A2B] mb-1">
              Loading & Protocol Details
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Set resistance at 75% 1RM. Full range of motion achieved."
              className="w-full px-3 py-2 text-xs border border-[#D9E2DE] rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-[#D9E2DE] text-xs font-semibold hover:bg-[#F4F6F4] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] cursor-pointer"
            >
              Save Exercise Record
            </button>
          </div>
        </form>
      )}

      {/* Workout History Table */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172A2B]">Mission Countermeasure History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F4F6F4] text-[#172A2B] font-semibold border-b border-[#D9E2DE]">
              <tr>
                <th className="px-3 py-2.5">Mission Sol</th>
                <th className="px-3 py-2.5">Activity Modality</th>
                <th className="px-3 py-2.5">Duration</th>
                <th className="px-3 py-2.5">Mean Heart Rate</th>
                <th className="px-3 py-2.5">Intensity</th>
                <th className="px-3 py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E2DE]">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F9FBFA]">
                  <td className="px-3 py-2.5 font-bold">Sol {entry.missionDay}</td>
                  <td className="px-3 py-2.5 font-semibold text-[#172A2B]">{entry.activityType}</td>
                  <td className="px-3 py-2.5 tabular-data">{entry.durationMinutes} min</td>
                  <td className="px-3 py-2.5 tabular-data font-semibold text-[#176B68]">{entry.avgHeartRate} bpm</td>
                  <td className="px-3 py-2.5 capitalize">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      entry.intensityScore === 'high' || entry.intensityScore === 'rigorous'
                        ? 'bg-[#E4F2E9] text-[#247A55]'
                        : 'bg-[#F4F6F4] text-[#60716E]'
                    }`}>
                      {entry.intensityScore}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[#60716E] max-w-xs truncate">{entry.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
