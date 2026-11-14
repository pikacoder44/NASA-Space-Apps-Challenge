'use client';

import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { DemoScenarioBanner } from '../ui/DemoScenarioBanner';
import { TopBar } from './TopBar';
import { SidebarNavigation } from './SidebarNavigation';
import { BottomTabBar } from './BottomTabBar';
import { AuthGate } from '../auth/AuthGate';
import Link from 'next/link';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aahms_sidebar_collapsed');
        if (stored !== null) return stored === 'true';
      } catch {
        // ignore
      }
    }
    return false;
  });
  const pathname = usePathname();

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('aahms_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Auth pages have their own art-directed split layout
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';

  if (isAuthRoute) {
    return (
      <main className="min-h-screen bg-[#F4F6F4] text-[#172A2B] flex flex-col">
        {children}
      </main>
    );
  }

  // Public routes (Landing, About, Demo)
  const isPublicRoute = pathname === '/' || pathname === '/about' || pathname === '/demo';

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col text-[#172A2B]">
        <main className="flex-1 w-full min-w-0">
          <Suspense fallback={<div className="p-8 text-center text-sm text-[#60716E]">Loading content...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    );
  }

  // Protected application cockpit routes (/app/...)
  return (
    <AuthGate>
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col text-[#172A2B]">
        {/* 1. Global Demo Scenario Banner */}
        <Suspense fallback={<div className="h-8 bg-[#122B31]" />}>
          <DemoScenarioBanner />
        </Suspense>

        {/* 2. Top Application Bar */}
        <Suspense fallback={<div className="h-14 sm:h-16 bg-white border-b border-[#D9E2DE]" />}>
          <TopBar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        </Suspense>

        {/* 3. Main Body Container with Responsive Sidebar */}
        <div className="flex-1 w-full flex">
          {/* Desktop Sidebar: 264px desktop / 72px icon rail (V3 §4) */}
          <aside
            className={`hidden md:block shrink-0 border-r border-[#D9E2DE] bg-white transition-all duration-200 z-20 ${
              isSidebarCollapsed ? 'w-[72px]' : 'w-[264px]'
            }`}
          >
            <div className="sticky top-16 h-[calc(100vh-64px)] p-3">
              <Suspense fallback={<div className="p-4 text-xs text-[#60716E]">Loading navigation...</div>}>
                <SidebarNavigation
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={handleToggleCollapse}
                />
              </Suspense>
            </div>
          </aside>

          {/* Mobile Navigation Drawer Modal */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="w-4/5 max-w-xs bg-white h-full p-4 overflow-y-auto shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE] mb-2">
                  <span className="font-bold text-base text-[#172A2B]">AAHMS Navigation</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#60716E] p-1.5 rounded-lg hover:bg-[#EAF0ED] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1">
                  <Suspense fallback={<div className="p-4 text-xs text-[#60716E]">Loading...</div>}>
                    <SidebarNavigation
                      isMobileDrawer
                      onItemClick={() => setMobileMenuOpen(false)}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-24 sm:pb-10">
            <Suspense fallback={<div className="p-8 text-center text-sm text-[#60716E]">Loading telemetry...</div>}>
              {children}
            </Suspense>
          </main>
        </div>

        {/* 4. Mobile Bottom Tab Bar */}
        <BottomTabBar />

        {/* 5. Scientific Disclaimer Footer */}
        <footer className="hidden sm:block border-t border-[#D9E2DE] bg-white py-4 px-6 text-xs text-[#60716E]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-center md:text-left">
              <ShieldCheck size={16} className="text-[#176B68] shrink-0" />
              <p>
                <strong>AAHMS Research Prototype</strong> — NASA Space Apps Challenge 2026. Informed by NASA HRP & CSA literature. Not an official medical device.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <Link href="/app/guides" className="hover:text-[#176B68] transition-colors">
                Measurement Guides
              </Link>
              <Link href="/app/alerts" className="hover:text-[#176B68] transition-colors">
                Alert Criteria
              </Link>
              <a
                href="https://www.nasa.gov/hrp/hazards/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#176B68] transition-colors"
              >
                NASA HRP 5 Hazards <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </AuthGate>
  );
}
