'use client';

import React, { useState } from 'react';
import { MEASUREMENT_GUIDES } from '@/data/mockData';
import { 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Search,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function MeasurementGuidesPage() {
  const [activeGuideId, setActiveGuideId] = useState<string>(MEASUREMENT_GUIDES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeGuide = MEASUREMENT_GUIDES.find((g) => g.id === activeGuideId) || MEASUREMENT_GUIDES[0];

  const filteredGuides = MEASUREMENT_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.overview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
              Standard Operating Procedures
            </span>
            <span className="text-xs font-mono text-[#60716E]">
              6 Flight Measurement Guides
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Flight Measurement & Protocol Guides
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Step-by-step instructions for sensor placement, flight cuff operation, capillary sample collection, and actigraphy logging.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-[#60716E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68]"
          />
        </div>
      </div>

      {/* Main Grid: Sidebar List of Guides (4 cols) & Active Guide Reader (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: List */}
        <div className="lg:col-span-4 space-y-2">
          {filteredGuides.map((guide) => {
            const isActive = guide.id === activeGuideId;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setActiveGuideId(guide.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white border-[#176B68] ring-1 ring-[#176B68] shadow-xs'
                    : 'bg-white/80 border-[#D9E2DE] hover:bg-white hover:border-[#B6C6C2]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#60716E] mb-1">
                  <span className="font-bold text-[#176B68]">{guide.system}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h3 className="text-xs font-bold text-[#172A2B] line-clamp-1">
                  {guide.title}
                </h3>
                <p className="text-[11px] text-[#60716E] line-clamp-2 mt-0.5">
                  {guide.overview}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right column: Guide Reader View */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#D9E2DE] space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#DCEDEA] text-[#176B68]">
                {activeGuide.system}
              </span>
              <span className="text-xs font-mono text-[#60716E] flex items-center gap-1">
                <Clock size={12} />
                Protocol Window: {activeGuide.readTime}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172A2B]">
              {activeGuide.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed">
              {activeGuide.overview}
            </p>
          </div>

          {/* Equipment Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase font-bold text-[#172A2B] flex items-center gap-1.5">
              <Wrench size={14} className="text-[#176B68]" />
              <span>Required Flight Kit & Hardware</span>
            </h3>
            <div className="p-3 rounded-lg bg-[#F4F6F4] text-xs text-[#172A2B]">
              {activeGuide.equipment}
            </div>
          </div>

          {/* Preparation Checklist */}
          {activeGuide.preparation && activeGuide.preparation.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase font-bold text-[#172A2B] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#176B68]" />
                <span>Pre-Measurement Calibration & Prep</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-[#172A2B]">
                {activeGuide.preparation.map((prep, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-[#F4F6F4] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#176B68] shrink-0 mt-1.5" />
                    <span>{prep}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sequential Step-by-Step Procedure */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase font-bold text-[#172A2B]">
              Sequential Protocol Execution Steps
            </h3>
            <div className="space-y-3">
              {activeGuide.steps.map((st, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-[#D9E2DE]/80 bg-[#FAFBFB]">
                  <span className="w-6 h-6 rounded-lg bg-[#176B68] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-[#172A2B] leading-relaxed">{st}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pitfalls & Hazards */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase font-bold text-[#8A520F] flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-[#8A520F]" />
              <span>Common Pitfalls & Data Integrity Hazards</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-[#172A2B]">
              {activeGuide.commonPitfalls.map((pitfall, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-[#FBF0D9]/40 border border-[#EED8A7]/70 leading-relaxed">
                  {pitfall}
                </li>
              ))}
            </ul>
          </div>

          {/* Troubleshooting */}
          <div className="p-4 rounded-xl bg-[#EAF0ED] border border-[#D9E2DE] space-y-1">
            <span className="text-xs font-bold font-mono uppercase text-[#172A2B] block">
              Troubleshooting & Signal Anomalies
            </span>
            <p className="text-xs text-[#60716E] leading-relaxed">
              {activeGuide.troubleshooting}
            </p>
          </div>

          {/* Quick link to log this measurement */}
          <div className="pt-3 border-t border-[#D9E2DE] flex items-center justify-between text-xs">
            <Link
              href="/app/check-in"
              className="px-4 py-2 rounded-lg bg-[#176B68] text-white font-bold hover:bg-[#135754] transition-colors"
            >
              Open Daily Log to Record This Measurement
            </Link>

            <span className="text-[11px] font-mono text-[#60716E]">
              SOP Reference: NASA-STD-3001
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
