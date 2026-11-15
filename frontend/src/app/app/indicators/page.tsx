'use client';

import React, { useState } from 'react';
import { useHealth } from '@/context/HealthContext';
import { IndicatorCard } from '@/components/health/IndicatorCard';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Activity, Search, AlertTriangle, RefreshCw } from 'lucide-react';

export default function HealthIndicatorsPage() {
  const { overview, loading, error, refreshOverview } = useHealth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Indicators' },
    { id: 'cardiovascular', label: 'Cardiovascular' },
    { id: 'behavioral', label: 'Behavioral & Sleep' },
    { id: 'vital', label: 'Vitals & Thermal' },
    { id: 'environmental', label: 'Environmental / Radiation' },
    { id: 'musculoskeletal', label: 'Musculoskeletal / Exercise' },
    { id: 'laboratory', label: 'Laboratory Diagnostics' }
  ];

  if (loading && !overview) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-[#EAF0ED] rounded-xl w-1/3" />
        <div className="h-8 bg-[#EAF0ED] rounded-lg w-2/3" />
        <div className="card-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-white border border-[#D9E2DE] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="p-8 max-w-xl mx-auto my-8 bg-white border border-[#D9E2DE] rounded-2xl shadow-xs text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF8EC] border border-[#F3DB9A] flex items-center justify-center text-[#8A520F]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-[#172A2B]">Indicators Data Offline</h2>
          <p className="text-xs text-[#60716E]">
            Could not retrieve physiological telemetry from the flight computer or cache.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refreshOverview()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#176B68] text-white hover:bg-[#125553] shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  if (!overview) return null;

  const filteredIndicators = (overview.keyIndicators || []).filter((ind) => {
    const matchesCategory = selectedCategory === 'all' || ind.category === selectedCategory;
    const matchesSearch =
      ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ind.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ErrorBoundary widgetName="Health Indicators Catalog" variant="page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2 py-0.5 rounded">
                Physiological Telemetry
              </span>
              <span className="text-xs text-[#60716E]">
                {overview.keyIndicators?.length || 0} Supported Measures
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

        {/* Grid of indicators protected with ErrorBoundary */}
        {filteredIndicators.length > 0 ? (
          <div className="card-grid">
            {filteredIndicators.map((ind) => (
              <ErrorBoundary key={ind.id} widgetName={ind.name} variant="compact">
                <IndicatorCard indicator={ind} />
              </ErrorBoundary>
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
    </ErrorBoundary>
  );
}
