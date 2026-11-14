'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { IndicatorCard } from '@/components/health/IndicatorCard';
import { Activity, Search } from 'lucide-react';

export default function HealthIndicatorsPage() {
  const { overview } = useHealth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!overview) return null;

  const categories = [
    { id: 'all', label: 'All Indicators' },
    { id: 'cardiovascular', label: 'Cardiovascular' },
    { id: 'behavioral', label: 'Behavioral & Sleep' },
    { id: 'vital', label: 'Vitals & Thermal' },
    { id: 'environmental', label: 'Environmental / Radiation' },
    { id: 'musculoskeletal', label: 'Musculoskeletal / Exercise' },
    { id: 'laboratory', label: 'Laboratory Diagnostics' }
  ];

  const filteredIndicators = overview.keyIndicators.filter((ind) => {
    const matchesCategory = selectedCategory === 'all' || ind.category === selectedCategory;
    const matchesSearch =
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
              Physiological Telemetry
            </span>
            <span className="text-xs text-[#60716E]">
              {overview.keyIndicators.length} Supported Measures
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B] mt-1">
            Health Indicators & Baselines
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] mt-0.5">
            Compare real-time and self-reported observations against calibrated personal baseline envelopes.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-[#60716E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indicators..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D9E2DE] rounded-lg focus:ring-1 focus:ring-[#176B68]"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Filter Indicators by Category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#176B68] text-white shadow-xs'
                : 'bg-white text-[#172A2B] hover:bg-[#EAF0ED] border border-[#D9E2DE]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of indicators */}
      {filteredIndicators.length > 0 ? (
        <div className="card-grid">
          {filteredIndicators.map((ind) => (
            <IndicatorCard key={ind.id} indicator={ind} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-[#D9E2DE] text-[#60716E]">
          <Activity size={32} className="mx-auto mb-2 text-[#B6C6C2]" />
          <p className="text-sm font-semibold">No health indicators match your filter criteria.</p>
          <button
            type="button"
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-3 text-xs font-bold text-[#176B68] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
