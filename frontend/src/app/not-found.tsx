'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#D9E2DE] p-8 text-center shadow-sm space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-[#DCEDEA] text-[#176B68] flex items-center justify-center mx-auto shadow-xs">
          <Compass size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-2.5 py-0.5 rounded">
            Error 404
          </span>
          <h1 className="text-2xl font-extrabold text-[#172A2B] tracking-tight">
            Trajectory Lost
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed">
            The requested flight module or telemetry telemetry endpoint cannot be located on this local flight terminal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            href="/app"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#176B68] hover:bg-[#135754] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard size={14} />
            <span>Mission Console</span>
          </Link>
          <Link
            href="/"
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#D9E2DE] text-[#172A2B] text-xs font-semibold hover:bg-[#F4F6F4] transition-colors flex items-center justify-center gap-1.5"
          >
            <Home size={14} />
            <span>Public Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
