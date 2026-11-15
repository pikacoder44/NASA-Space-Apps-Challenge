'use client';

import React, { useState } from 'react';
import { BODY_SYSTEMS } from '../../data/mockData';
import { BodySystemInfo } from '../../types/health';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Heart,
  Brain,
  Bone,
  Eye,
  ShieldAlert,
  BookOpen,
  TrendingUp,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface BodyMapInteractiveProps {
  initialSystemId?: string;
  onSelectSystem?: (system: BodySystemInfo) => void;
}

export function BodyMapInteractive({ initialSystemId = 'cardiovascular', onSelectSystem }: BodyMapInteractiveProps) {
  const [selectedId, setSelectedId] = useState<string>(initialSystemId);

  const selectedSystem = BODY_SYSTEMS.find((b) => b.id === selectedId) || BODY_SYSTEMS[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const sys = BODY_SYSTEMS.find((b) => b.id === id);
    if (sys && onSelectSystem) onSelectSystem(sys);
  };

  const getSystemIcon = (id: string) => {
    switch (id) {
      case 'cardiovascular': return Heart;
      case 'brain_behavioral': return Brain;
      case 'musculoskeletal': return Bone;
      case 'sensory_vision': return Eye;
      case 'immune_environmental': return ShieldAlert;
      default: return Heart;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#60716E]">
              Anatomical Systems Explorer
            </span>
            <span className="text-xs font-mono text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded font-bold">
              Spaceflight Physiology
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#172A2B] mt-0.5">
            Interactive Body Systems Map
          </h2>
        </div>

        {/* Status legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-[#60716E]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#247A55]" /> Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A96617]" /> Watch
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: SVG Human Body Diagram with Interactive Hotspots (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE]/80 relative min-h-[440px]">
          <div className="text-xs text-[#60716E] mb-3 text-center font-medium">Click any body area to inspect spaceflight adaptations</div>

          {/* Scientific SVG Human Figure */}
          <svg
            viewBox="0 0 280 480"
            className="w-full max-w-[340px] h-auto drop-shadow-sm select-none"
            aria-label="Interactive Human Body Anatomy Map"
          >
            <defs>
              <linearGradient id="bodyOutlineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#CBD7D3" />
                <stop offset="100%" stopColor="#B2C2BE" />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Anatomical Body Silhouette Silhouette */}
            <path
              d="M 140 32
                 C 148 32, 155 38, 155 48
                 C 155 58, 150 64, 148 70
                 C 156 74, 168 82, 172 96
                 C 176 110, 184 165, 188 200
                 C 190 215, 192 245, 190 252
                 C 188 258, 182 258, 180 250
                 C 176 230, 170 190, 166 175
                 C 165 195, 166 220, 164 245
                 C 162 270, 164 330, 162 380
                 C 160 420, 160 450, 155 460
                 C 150 468, 142 468, 141 458
                 C 140 435, 140 380, 140 320
                 C 140 380, 140 435, 139 458
                 C 138 468, 130 468, 125 460
                 C 120 450, 120 420, 118 380
                 C 116 330, 118 270, 116 245
                 C 114 220, 115 195, 114 175
                 C 110 190, 104 230, 100 250
                 C 98 258, 92 258, 90 252
                 C 88 245, 90 215, 92 200
                 C 96 165, 104 110, 108 96
                 C 112 82, 124 74, 132 70
                 C 130 64, 125 58, 125 48
                 C 125 38, 132 32, 140 32 Z"
              fill="#E3ECE9"
              stroke="#B2C2BE"
              strokeWidth="2"
            />

            {/* Anatomical Hotspot 1: Brain & Cognitive Region */}
            <g
              onClick={() => handleSelect('brain_behavioral')}
              className="cursor-pointer group"
              tabIndex={0}
              role="button"
              aria-label="Select Brain and Behavioral Health"
              onKeyDown={(e) => e.key === 'Enter' && handleSelect('brain_behavioral')}
            >
              <circle
                cx="140"
                cy="50"
                r={selectedId === 'brain_behavioral' ? 20 : 16}
                fill={selectedId === 'brain_behavioral' ? '#A96617' : '#DCEDEA'}
                fillOpacity={selectedId === 'brain_behavioral' ? 0.35 : 0.8}
                stroke={selectedId === 'brain_behavioral' ? '#A96617' : '#176B68'}
                strokeWidth={selectedId === 'brain_behavioral' ? 3 : 1.5}
                filter={selectedId === 'brain_behavioral' ? 'url(#glowEffect)' : undefined}
                className="transition-all duration-200 group-hover:scale-110"
              />
              <circle cx="140" cy="50" r="4" fill="#A96617" />
              <text x="170" y="48" fontSize="14" fontWeight="600" fill="#172A2B">
                Brain & Sleep
              </text>
              <line x1="156" y1="50" x2="166" y2="50" stroke="#172A2B" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Anatomical Hotspot 2: Sensory & Vision (SANS) */}
            <g
              onClick={() => handleSelect('sensory_vision')}
              className="cursor-pointer group"
              tabIndex={0}
              role="button"
              aria-label="Select Sensory and Vision"
              onKeyDown={(e) => e.key === 'Enter' && handleSelect('sensory_vision')}
            >
              <circle
                cx="140"
                cy="62"
                r={selectedId === 'sensory_vision' ? 12 : 9}
                fill={selectedId === 'sensory_vision' ? '#247A55' : '#DCEDEA'}
                fillOpacity={selectedId === 'sensory_vision' ? 0.35 : 0.8}
                stroke={selectedId === 'sensory_vision' ? '#247A55' : '#176B68'}
                strokeWidth={selectedId === 'sensory_vision' ? 2.5 : 1.5}
                className="transition-all duration-200 group-hover:scale-110"
              />
              <circle cx="140" cy="62" r="2.5" fill="#247A55" />
              <text x="80" y="66" fontSize="13" fontWeight="600" fill="#172A2B" textAnchor="end">
                Vision (SANS)
              </text>
              <line x1="86" y1="63" x2="131" y2="63" stroke="#60716E" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Anatomical Hotspot 3: Heart & Cardiovascular Center */}
            <g
              onClick={() => handleSelect('cardiovascular')}
              className="cursor-pointer group"
              tabIndex={0}
              role="button"
              aria-label="Select Cardiovascular System"
              onKeyDown={(e) => e.key === 'Enter' && handleSelect('cardiovascular')}
            >
              <circle
                cx="144"
                cy="124"
                r={selectedId === 'cardiovascular' ? 24 : 18}
                fill={selectedId === 'cardiovascular' ? '#A96617' : '#DCEDEA'}
                fillOpacity={selectedId === 'cardiovascular' ? 0.35 : 0.8}
                stroke={selectedId === 'cardiovascular' ? '#A96617' : '#176B68'}
                strokeWidth={selectedId === 'cardiovascular' ? 3 : 1.5}
                filter={selectedId === 'cardiovascular' ? 'url(#glowEffect)' : undefined}
                className="transition-all duration-200 group-hover:scale-110"
              />
              <circle cx="144" cy="124" r="5" fill="#A96617" />
              <text x="175" y="127" fontSize="14" fontWeight="600" fill="#172A2B">
                Cardiovascular
              </text>
              <line x1="162" y1="124" x2="172" y2="124" stroke="#172A2B" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Anatomical Hotspot 4: Musculoskeletal & Spine / Bones */}
            <g
              onClick={() => handleSelect('musculoskeletal')}
              className="cursor-pointer group"
              tabIndex={0}
              role="button"
              aria-label="Select Musculoskeletal System"
              onKeyDown={(e) => e.key === 'Enter' && handleSelect('musculoskeletal')}
            >
              <rect
                x="134"
                y="155"
                width="12"
                height="80"
                rx="6"
                fill={selectedId === 'musculoskeletal' ? '#247A55' : '#DCEDEA'}
                fillOpacity={selectedId === 'musculoskeletal' ? 0.4 : 0.8}
                stroke={selectedId === 'musculoskeletal' ? '#247A55' : '#176B68'}
                strokeWidth={selectedId === 'musculoskeletal' ? 2.5 : 1.5}
                className="transition-all duration-200 group-hover:scale-105"
              />
              <circle cx="140" cy="195" r="3" fill="#247A55" />
              <text x="80" y="198" fontSize="13" fontWeight="600" fill="#172A2B" textAnchor="end">
                BONES & MUSCLE
              </text>
              <line x1="86" y1="195" x2="132" y2="195" stroke="#60716E" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Anatomical Hotspot 5: Immune & Radiation Environment */}
            <g
              onClick={() => handleSelect('immune_environmental')}
              className="cursor-pointer group"
              tabIndex={0}
              role="button"
              aria-label="Select Immune and Environmental Health"
              onKeyDown={(e) => e.key === 'Enter' && handleSelect('immune_environmental')}
            >
              <circle
                cx="140"
                cy="270"
                r={selectedId === 'immune_environmental' ? 22 : 16}
                fill={selectedId === 'immune_environmental' ? '#247A55' : '#DCEDEA'}
                fillOpacity={selectedId === 'immune_environmental' ? 0.35 : 0.8}
                stroke={selectedId === 'immune_environmental' ? '#247A55' : '#176B68'}
                strokeWidth={selectedId === 'immune_environmental' ? 2.5 : 1.5}
                className="transition-all duration-200 group-hover:scale-110"
              />
              <circle cx="140" cy="270" r="4" fill="#247A55" />
              <text x="170" y="274" fontSize="13" fontWeight="600" fill="#172A2B">
                Radiation & Immune
              </text>
              <line x1="156" y1="270" x2="166" y2="270" stroke="#60716E" strokeWidth="1" strokeDasharray="2 2" />
            </g>
          </svg>
        </div>

        {/* Right column: System Details Panel & Accessible Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Accessible Tabs / List-based selection buttons */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#60716E] mb-2 block">
              Direct System Selector (Accessibility List)
            </label>
            <div className="flex flex-wrap gap-1.5" role="tablist">
              {BODY_SYSTEMS.map((sys) => {
                const Icon = getSystemIcon(sys.id);
                const isSelected = sys.id === selectedId;
                return (
                  <button
                    key={sys.id}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(sys.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#176B68] text-white shadow-xs'
                        : 'bg-[#F4F6F4] text-[#172A2B] hover:bg-[#EAF0ED] border border-[#D9E2DE]'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-white' : 'text-[#60716E]'} />
                    <span>{sys.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Detail Card */}
          <div className="p-5 rounded-xl border border-[#D9E2DE] bg-[#F9FBFA] space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D9E2DE]">
              <div>
                <span className="text-xs font-mono text-[#176B68] font-bold uppercase">
                  Selected Anatomical System
                </span>
                <h3 className="text-lg font-bold text-[#172A2B]">
                  {selectedSystem.name}
                </h3>
                <p className="text-xs text-[#60716E] mt-0.5">
                  {selectedSystem.shortDescription}
                </p>
              </div>

              <StatusBadge status={selectedSystem.currentStatus} size="md" />
            </div>

            {/* Current Flight Telemetry Status */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-[#60716E] mb-1">
                Current Operational Telemetry Status
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-[#172A2B] p-2.5 rounded-lg bg-white border border-[#D9E2DE]">
                {selectedSystem.statusSummary}
              </p>
            </div>

            {/* Spaceflight Physiological Relevance */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-[#60716E] mb-1">
                Spaceflight Physiological Mechanisms
              </h4>
              <p className="text-xs text-[#172A2B] leading-relaxed">
                {selectedSystem.spaceflightRelevance}
              </p>
            </div>

            {/* Microgravity Effects List */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-[#60716E] mb-1.5">
                Observed Microgravity Dynamics
              </h4>
              <ul className="space-y-1 text-xs text-[#172A2B]">
                {selectedSystem.microgravityEffects.map((effect, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#176B68] font-bold mt-0.5">•</span>
                    <span>{effect}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related AAHMS Indicators & Links */}
            <div className="pt-3 border-t border-[#D9E2DE] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[#60716E] font-medium">Related Indicators:</span>
                {selectedSystem.relatedIndicatorIds.map((id) => (
                  <Link
                    key={id}
                    href={`/app/indicators/${id}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#D9E2DE] text-[#176B68] font-semibold hover:border-[#176B68] transition-colors"
                  >
                    <span>{id.replace('_', ' ')}</span>
                    <TrendingUp size={11} />
                  </Link>
                ))}
              </div>

              <Link
                href="/app/guides"
                className="inline-flex items-center gap-1 font-semibold text-[#176B68] hover:underline"
              >
                <BookOpen size={13} />
                <span>Measurement Guides</span>
              </Link>
            </div>

            {/* Educational Disclaimer & Research Citation */}
            <div className="pt-2 text-[11px] text-[#60716E] border-t border-[#D9E2DE]/60 space-y-1">
              <p className="flex items-center gap-1">
                <Info size={12} className="shrink-0 text-[#176B68]" />
                <span>Research citation: {selectedSystem.researchCitation}</span>
              </p>
              <p className="italic">
                Notice: Physiological mapping is educational context based on published aerospace medicine, not an in-flight diagnostic imaging test.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
