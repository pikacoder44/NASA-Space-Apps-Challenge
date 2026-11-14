'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Award, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Flame, 
  Star,
  Clock
} from 'lucide-react';
import type { RoutineTask } from '../lib/types';

interface RoutineListProps {
  tasks?: RoutineTask[];
  points?: number;
  streakDays?: number;
}

const DEFAULT_TASKS: RoutineTask[] = [
  { id: "task-1", title: "Morning Vitals & Pulse Oximetry", category: "Medical", completed: true, due_time: "07:30 UTC" },
  { id: "task-2", title: "ARED Resistive Countermeasure (60 min)", category: "Exercise", completed: true, due_time: "10:00 UTC" },
  { id: "task-3", title: "T2 Treadmill Aerobic Session (30 min)", category: "Exercise", completed: false, due_time: "16:00 UTC" },
  { id: "task-4", title: "Evening Subjective Check-in & Sleep Prep", category: "Mental Health", completed: false, due_time: "21:30 UTC" }
];

const CREW_BADGES = [
  {
    id: 'streak-7',
    name: '7-Day Streak',
    desc: 'Maintained uninterrupted telemetry logging for 7 consecutive sols.',
    icon: Flame,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    unlocked: true,
    progress: '7 / 7 Sols'
  },
  {
    id: 'readings-30',
    name: '30 Readings Logged',
    desc: 'Recorded 30+ physiological measurements in interplanetary transit.',
    icon: Star,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    unlocked: true,
    progress: '32 / 30 Readings'
  },
  {
    id: 'countermeasure-ared',
    name: 'ARED Compliance',
    desc: 'Zero missed resistive exercise cycles over orbital transit.',
    icon: ShieldCheck,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    unlocked: true,
    progress: '100% On-Schedule'
  }
];

export default function RoutineList({ 
  tasks = DEFAULT_TASKS, 
  points = 340, 
  streakDays = 7 
}: RoutineListProps) {
  const [taskList, setTaskList] = useState<RoutineTask[]>(tasks);
  const [currentPoints, setCurrentPoints] = useState<number>(points);

  const toggleTask = (id: string) => {
    setTaskList(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        setCurrentPoints(pts => nextCompleted ? pts + 25 : pts - 25);
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const completedCount = taskList.filter(t => t.completed).length;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-5 shadow-xs">
      {/* Top Header: Title, Streak and Points */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-brand" />
          <div>
            <h3 className="font-extrabold text-base text-main">Today&apos;s Health Routine</h3>
            <span className="text-xs text-muted">
              {completedCount} of {taskList.length} flight protocols completed
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-extrabold shadow-2xs">
            <Zap size={14} className="fill-amber-500" />
            <span>{streakDays}-Day Streak</span>
          </div>

          {/* Points Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand/30 bg-brand/10 text-brand text-xs font-extrabold shadow-2xs">
            <Award size={14} />
            <span>{currentPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Checklist items with interactive toggle */}
      <div className="space-y-2.5">
        {taskList.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggleTask(task.id)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
              task.completed 
                ? 'bg-surface-alt/40 border-border text-muted' 
                : 'bg-surface border-brand/30 hover:border-brand text-main shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                task.completed ? 'bg-[#22c55e] text-white' : 'border-2 border-border text-transparent'
              }`}>
                {task.completed ? '✓' : ''}
              </div>
              <div>
                <div className={`text-sm font-bold ${task.completed ? 'line-through text-muted' : 'text-main'}`}>
                  {task.title}
                </div>
                <div className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-brand/80">{task.category}</span>
                  {task.due_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>Due {task.due_time}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase ${
              task.completed ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#eab308]/10 text-[#eab308]'
            }`}>
              {task.completed ? 'COMPLETED' : 'PENDING'}
            </span>
          </button>
        ))}
      </div>

      {/* Crew Badges Section (7-Day Streak & 30 Readings) */}
      <div className="pt-3 border-t border-border/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted">
            Unlocked Crew Achievements
          </span>
          <span className="text-[11px] text-brand font-bold">Level 3 Crew Compliance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {CREW_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id}
                className={`p-3 rounded-xl border ${badge.color} flex flex-col justify-between space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-extrabold text-xs">
                    <Icon size={15} />
                    <span>{badge.name}</span>
                  </div>
                  <CheckCircle2 size={13} className="text-emerald-500" />
                </div>
                <p className="text-[11px] text-muted leading-tight line-clamp-2">
                  {badge.desc}
                </p>
                <div className="text-[10px] font-mono font-bold text-main/80 pt-1">
                  {badge.progress}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
