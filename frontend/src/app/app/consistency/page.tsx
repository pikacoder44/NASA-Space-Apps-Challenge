'use client';

import React from 'react';
import { useHealth } from '@/context/HealthContext';
import { 
  Award, 
  Flame, 
  ShieldCheck, 
  BookOpen, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ConsistencyRewardsPage() {
  const { overview } = useHealth();

  if (!overview) return null;

  const gam = overview.gamification;

  const getBadgeIcon = (name: string) => {
    switch (name) {
      case 'Flame': return Flame;
      case 'Award': return Award;
      case 'BookOpen': return BookOpen;
      case 'Activity': return Activity;
      case 'Shield': return ShieldCheck;
      case 'Zap': return Zap;
      default: return Award;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
              Crew Protocol Adherence
            </span>
            <span className="text-xs text-[#60716E]">
              Non-Competitive Engagement System
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Consistency & Achievement Milestones
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Encourages daily logging discipline, measurement guide learning, and continuous self-awareness.
          </p>
        </div>

        <Link
          href="/app/check-in"
          className="px-4 py-2 rounded-lg bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all flex items-center gap-1.5 shadow-xs"
        >
          <CheckCircle2 size={15} />
          <span>Complete Daily Log</span>
        </Link>
      </div>

      {/* Ethical Gamification Banner (PRD Section 9.13 Non-punitive rules) */}
      <div className="p-4 rounded-xl bg-[#EAF0ED] border border-[#D9E2DE] text-xs text-[#172A2B] flex items-start gap-2.5">
        <Info size={16} className="text-[#176B68] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Medical Safety & Ethical Incentive Guarantee</p>
          <p className="text-[#60716E] leading-relaxed">
            Gamification in AAHMS rewards <em>logging consistency and protocol education</em>, never &quot;good health&quot; or a Green score. Crew members are never penalized for reporting fatigue, symptoms, or receiving Yellow/Red health advisories.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#60716E] mb-1">
            <span className="font-mono uppercase font-bold">Current Active Streak</span>
            <Flame size={16} className="text-[#A96617]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#172A2B]">
              {gam.currentStreakDays}
            </span>
            <span className="text-xs font-mono text-[#60716E]">Consecutive Sols</span>
          </div>
          <div className="w-full bg-[#EAF0ED] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#A96617] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (gam.currentStreakDays / 30) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-[#60716E] block mt-1">Goal: 30-Day Milestone</span>
        </div>

        {/* Best Streak */}
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#60716E] mb-1">
            <span className="font-mono uppercase font-bold">Personal Best Streak</span>
            <Award size={16} className="text-[#176B68]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#172A2B]">
              {gam.bestStreakDays}
            </span>
            <span className="text-xs font-mono text-[#60716E]">Sols Record</span>
          </div>
          <span className="text-[10px] text-[#247A55] font-semibold block mt-4">
            Achieved during Transit Leg 1
          </span>
        </div>

        {/* Protocol Points */}
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#60716E] mb-1">
            <span className="font-mono uppercase font-bold">Protocol Points</span>
            <Sparkles size={16} className="text-[#176B68]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#176B68]">
              {gam.totalPoints}
            </span>
            <span className="text-xs font-mono text-[#60716E]">pts</span>
          </div>
          <span className="text-[10px] text-[#60716E] block mt-4">
            Earned from 88 completed logs
          </span>
        </div>

        {/* Guides Completed */}
        <div className="bg-white rounded-xl border border-[#D9E2DE] p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#60716E] mb-1">
            <span className="font-mono uppercase font-bold">Educational SOPs</span>
            <BookOpen size={16} className="text-[#176B68]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-data text-[#172A2B]">
              {gam.guidesCompletedCount} / 6
            </span>
            <span className="text-xs font-mono text-[#60716E]">Reviewed</span>
          </div>
          <span className="text-[10px] text-[#247A55] font-semibold block mt-4">
            All primary guides certified
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
          <div>
            <h2 className="text-base font-bold text-[#172A2B]">
              Mission Protocol Badges
            </h2>
            <p className="text-xs text-[#60716E]">
              Awarded for diligence, adherence to countermeasures, and SOP mastery.
            </p>
          </div>
          <span className="text-xs font-mono text-[#176B68] font-bold">
            {gam.badges.filter(b => b.isUnlocked).length} of {gam.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gam.badges.map((badge) => {
            const Icon = getBadgeIcon(badge.iconName);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  badge.isUnlocked
                    ? 'bg-white border-[#BDE0CB] shadow-xs'
                    : 'bg-[#F9FBFA] border-[#D9E2DE]/70 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.isUnlocked
                        ? 'bg-[#DCEDEA] text-[#176B68]'
                        : 'bg-[#EAF0ED] text-[#60716E]'
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#172A2B]">
                        {badge.title}
                      </h3>
                      {badge.isUnlocked && (
                        <CheckCircle2 size={14} className="text-[#247A55]" />
                      )}
                    </div>
                    <p className="text-xs text-[#60716E] leading-relaxed">
                      {badge.description}
                    </p>

                    {!badge.isUnlocked && (
                      <div className="pt-2">
                        <div className="w-full bg-[#EAF0ED] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#176B68] h-full rounded-full"
                            style={{ width: `${badge.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-[#60716E] block mt-1">
                          Progress: {badge.progressPercent}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
