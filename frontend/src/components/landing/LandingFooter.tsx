'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#0A1A1F] text-[#A2BEB9] border-t border-[#1E373C] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info (5/12) */}
          <div className="md:col-span-5 space-y-4">
            <Logo size="md" showSubtitle inverted />
            <p className="text-sm text-[#829994] max-w-sm leading-relaxed">
              Autonomous physiological baseline monitoring cockpit designed for long-duration deep space exploration missions.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#3FB6A8]">
              <span className="w-2 h-2 rounded-full bg-[#3FB6A8]" />
              <span>NASA Space Apps Challenge 2026 Prototype</span>
            </div>
          </div>

          {/* Links Column 1: Application (2/12) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Application
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/readings/new" className="hover:text-white transition-colors">
                  Record Reading
                </Link>
              </li>
              <li>
                <Link href="/body-map" className="hover:text-white transition-colors">
                  Interactive Body Map
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors">
                  Sol 90 Walkthrough
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Architecture & Guides (2/12) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Research & Protocols
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/app/guides" className="hover:text-white transition-colors">
                  Measurement Guides
                </Link>
              </li>
              <li>
                <Link href="/app/radiation" className="hover:text-white transition-colors">
                  Radiation Shelter
                </Link>
              </li>
              <li>
                <Link href="/app/exercise" className="hover:text-white transition-colors">
                  Countermeasures (ARED)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Team & Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: NASA Literature (3/12) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Official Space Agency Sources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.nasa.gov/hrp/hazards/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>NASA HRP: 5 Hazards</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.nasa.gov/hrp/risks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>NASA HRP: Spaceflight Risks</span>
                  <ExternalLink size={10} />
                </a>
              </li>
              <li>
                <a
                  href="https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 transition-colors"
                >
                  <span>CSA: Radiation Monitoring</span>
                  <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 border-t border-[#1E373C] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[#829994]">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#3FB6A8] shrink-0" />
            <p>
              Prototype built for <strong>NASA Space Apps Challenge 2026</strong>. Not a medical device. Not affiliated with or endorsed by NASA or CSA.
            </p>
          </div>
          <p>© 2026 AstroTrack Team. Open source research prototype.</p>
        </div>

      </div>
    </footer>
  );
}
