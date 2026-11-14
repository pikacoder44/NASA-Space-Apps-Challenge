'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to local telemetry console
    console.error('AAHMS Operational Exception:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#F5C2B8] p-8 text-center shadow-sm space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#FDF0ED] text-[#9A2215] flex items-center justify-center mx-auto shadow-xs">
          <AlertOctagon size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#9A2215] bg-[#FDF0ED] px-2.5 py-0.5 rounded">
            Avionics Interface Fault
          </span>
          <h1 className="text-2xl font-extrabold text-[#172A2B] tracking-tight">
            Component State Exception
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed">
            An unexpected error occurred while rendering telemetry components. Local cached flight state remains secure.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#176B68] hover:bg-[#135754] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Component</span>
          </button>
          <Link
            href="/app"
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#D9E2DE] text-[#172A2B] text-xs font-semibold hover:bg-[#F4F6F4] transition-colors flex items-center justify-center gap-1.5"
          >
            <Home size={14} />
            <span>Return to Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
