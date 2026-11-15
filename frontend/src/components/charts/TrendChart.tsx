'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { TrendDataPoint } from '../../data/trendData';
import { Table, BarChart2, Info } from 'lucide-react';

interface TrendChartProps {
  data: TrendDataPoint[];
  title: string;
  unit: string;
  baselineLabel: string;
  activeRange: '7d' | '30d' | 'mission';
  onRangeChange: (range: '7d' | '30d' | 'mission') => void;
}

export function TrendChart({
  data,
  title,
  unit,
  baselineLabel,
  activeRange,
  onRangeChange
}: TrendChartProps) {
  const [showTableView, setShowTableView] = useState(false);

  const baselineValue = data.length > 0 ? data[0].baseline : 0;
  const baselineLower = data.length > 0 ? data[0].baselineLower : undefined;
  const baselineUpper = data.length > 0 ? data[0].baselineUpper : undefined;

  // Calculate dynamic Y domain to ensure readability
  const numericValues = data.map((d) => d.value).filter((v): v is number => v !== null);
  const minVal = numericValues.length > 0 ? Math.min(...numericValues, baselineLower ?? baselineValue) : 0;
  const maxVal = numericValues.length > 0 ? Math.max(...numericValues, baselineUpper ?? baselineValue) : 100;
  const padding = (maxVal - minVal) * 0.15 || 5;
  const yDomain = [Math.floor(minVal - padding), Math.ceil(maxVal + padding)];

  return (
    <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 sm:p-6 shadow-xs">
      {/* Chart Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#172A2B] truncate" title={title}>{title}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-[#DCEDEA] text-[#176B68] font-bold shrink-0">
              {unit}
            </span>
          </div>
          <p className="text-xs text-[#60716E] mt-0.5 flex items-center gap-1 truncate">
            <Info size={12} className="text-[#176B68] shrink-0" />
            <span className="truncate">{baselineLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Table / Chart view toggle for accessibility */}
          <button
            type="button"
            onClick={() => setShowTableView(!showTableView)}
            className="p-1.5 rounded-lg border border-[#D9E2DE] text-[#60716E] hover:bg-[#F4F6F4] text-xs font-medium flex items-center gap-1 cursor-pointer"
            title={showTableView ? 'Switch to graphic chart' : 'Switch to accessible tabular view'}
            aria-label={showTableView ? 'Show chart view' : 'Show table view'}
          >
            {showTableView ? <BarChart2 size={15} /> : <Table size={15} />}
            <span className="hidden md:inline">{showTableView ? 'Chart' : 'Table'}</span>
          </button>

          {/* Range Controls: 7D · 30D · Mission on one line */}
          <div className="inline-flex rounded-lg border border-[#D9E2DE] p-0.5 bg-[#F4F6F4]" role="group" aria-label="Trend Time Range">
            <button
              type="button"
              onClick={() => onRangeChange('7d')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeRange === '7d'
                  ? 'bg-white text-[#176B68] shadow-xs'
                  : 'text-[#60716E] hover:text-[#172A2B]'
              }`}
            >
              7D
            </button>
            <button
              type="button"
              onClick={() => onRangeChange('30d')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeRange === '30d'
                  ? 'bg-white text-[#176B68] shadow-xs'
                  : 'text-[#60716E] hover:text-[#172A2B]'
              }`}
            >
              30D
            </button>
            <button
              type="button"
              onClick={() => onRangeChange('mission')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeRange === 'mission'
                  ? 'bg-white text-[#176B68] shadow-xs'
                  : 'text-[#60716E] hover:text-[#172A2B]'
              }`}
            >
              Mission
            </button>
          </div>
        </div>
      </div>

      {/* Chart Body or Table View */}
      <div className="mt-4">
        {showTableView ? (
          <div className="overflow-x-auto max-h-80 border border-[#D9E2DE] rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F4F6F4] text-[#172A2B] font-semibold border-b border-[#D9E2DE] sticky top-0">
                <tr>
                  <th scope="col" className="px-3 py-2">Mission Sol</th>
                  <th scope="col" className="px-3 py-2">Measurement</th>
                  <th scope="col" className="px-3 py-2">Personal Baseline</th>
                  <th scope="col" className="px-3 py-2">Origin</th>
                  <th scope="col" className="px-3 py-2">Data Quality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E2DE]">
                {data.map((point) => (
                  <tr key={point.missionDay} className="hover:bg-[#F9FBFA]">
                    <td className="px-3 py-2 font-mono">{point.dateStr}</td>
                    <td className="px-3 py-2 font-bold tabular-data">
                      {point.value !== null ? `${point.value} ${unit}` : <span className="text-amber-700 italic">Missing telemetry</span>}
                    </td>
                    <td className="px-3 py-2 text-[#60716E] font-mono">{point.baseline} {unit}</td>
                    <td className="px-3 py-2 capitalize">{point.origin}</td>
                    <td className="px-3 py-2 capitalize">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        point.quality === 'valid' ? 'bg-[#E4F2E9] text-[#247A55]' : 'bg-[#FBF0D9] text-[#8A520F]'
                      }`}>
                        {point.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 28, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EAF0ED" vertical={false} />
                <XAxis
                  dataKey="missionDay"
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2DE' }}
                  tick={{ fontSize: 11, fill: '#60716E' }}
                  interval="preserveStartEnd"
                  tickFormatter={(val) => `Sol ${val}`}
                />
                <YAxis
                  domain={yDomain}
                  tickLine={false}
                  axisLine={{ stroke: '#D9E2DE' }}
                  tick={{ fontSize: 11, fill: '#60716E' }}
                  unit={` ${unit}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as TrendDataPoint;
                      return (
                        <div className="bg-[#122B31] text-white p-2.5 rounded-lg shadow-lg border border-[#1E434C] text-xs space-y-1">
                          <p className="text-[#A2BEB9] font-bold">{d.dateStr}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm tabular-data">
                              {d.value !== null ? `${d.value} ${unit}` : 'Missing Observation'}
                            </span>
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-medium bg-[#176B68]">
                              {d.origin}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#C0D1CE] border-t border-[#1E434C] pt-1">
                            Baseline: {d.baseline} {unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Baseline reference tolerance band */}
                {baselineLower !== undefined && baselineUpper !== undefined && (
                  <ReferenceArea
                    y1={baselineLower}
                    y2={baselineUpper}
                    fill="#176B68"
                    fillOpacity={0.06}
                  />
                )}

                {/* Baseline reference target line */}
                <ReferenceLine
                  y={baselineValue}
                  stroke="#176B68"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Baseline: ${baselineValue}`,
                    position: 'insideTopRight',
                    fill: '#176B68',
                    fontSize: 11
                  }}
                />

                {/* Actual Telemetry Line (connectNulls=false to preserve gaps for missing observations) */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#172A2B"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#172A2B', strokeWidth: 1, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#176B68', stroke: '#FFFFFF', strokeWidth: 2 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#60716E]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#172A2B]" />
            <span>Recorded Observation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-[#176B68]" />
            <span>Personal Baseline Target</span>
          </div>
        </div>
        <span className="italic">Gaps represent missing/unrecorded telemetry</span>
      </div>
    </div>
  );
}
