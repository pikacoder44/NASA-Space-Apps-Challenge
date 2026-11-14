'use client';

import React from 'react';
import { Calendar, CheckCircle2, Award, Zap } from 'lucide-react';
import type { RoutineTask } from '../lib/types';

interface RoutineListProps {
  tasks: RoutineTask[];
  points?: number;
  streakDays?: number;
}

export default function RoutineList({ tasks, points = 340, streakDays = 7 }: RoutineListProps) {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-brand" />
          <h3 className="font-bold text-base text-main">Daily Protocol Checklist</h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
            <Zap size={13} />
            <span>{streakDays} Sol Streak</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-brand bg-brand/10 px-2 py-0.5 rounded">
            <Award size={13} />
            <span>{points} pts</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              task.completed 
                ? 'bg-surface-alt/40 border-border text-muted' 
                : 'bg-surface border-brand/20 text-main shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                task.completed ? 'bg-[#22c55e] text-white' : 'border border-border text-transparent'
              }`}>
                {task.completed ? '✓' : ''}
              </div>
              <div>
                <div className={`text-sm font-bold ${task.completed ? 'line-through text-muted' : 'text-main'}`}>
                  {task.title}
                </div>
                <div className="text-[11px] text-muted flex items-center gap-2">
                  <span>{task.category}</span>
                  {task.due_time && <span>· Due {task.due_time}</span>}
                </div>
              </div>
            </div>

            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
              task.completed ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#eab308]/10 text-[#eab308]'
            }`}>
              {task.completed ? 'DONE' : 'PENDING'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
