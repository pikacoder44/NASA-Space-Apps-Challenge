'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartPulse, 
  Bell, 
  CheckSquare, 
  RefreshCw, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { APP_NAME } from '../../lib/branding';

interface TopBarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function TopBar({ mobileMenuOpen, setMobileMenuOpen }: TopBarProps) {
  const pathname = usePathname();
  const { overview, syncState, triggerSync } = useHealth();
  const { user } = useAuth();

  const isSyncing = syncState?.queueState === 'syncing';
  const alertCount = overview?.activeAlerts?.length || 0;

  // Format breadcrumb title based on pathname
  const getPageTitle = () => {
    if (pathname === '/app') return 'Mission Overview';
    if (pathname.includes('/check-in')) return 'Daily Log';
    if (pathname.includes('/indicators')) return 'Health Indicators';
    if (pathname.includes('/trends')) return 'Health Trends';
    if (pathname.includes('/alerts')) return 'Alerts & Guidance';
    if (pathname.includes('/body-map')) return 'Body Map';
    if (pathname.includes('/radiation')) return 'Radiation Tracker';
    if (pathname.includes('/exercise')) return 'Exercise & Activity';
    if (pathname.includes('/guides')) return 'Measurement Guides';
    if (pathname.includes('/ai-explanation')) return 'AI Explanation';
    if (pathname.includes('/records')) return 'Manual Records';
    if (pathname.includes('/consistency')) return 'Consistency & Badges';
    if (pathname.includes('/reaction-test')) return 'Reaction Test';
    if (pathname.includes('/log')) return 'Mission Log';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Health Monitoring';
  };

  const isPublicRoute = pathname === '/' || pathname === '/about' || pathname === '/demo';

  return (
    <header className="bg-white border-b border-[#D9E2DE] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Product branding & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {!isPublicRoute && (
            <button
              type="button"
              className="md:hidden p-2 -ml-2 text-[#172A2B] hover:bg-[#EAF0ED] rounded-lg transition-colors cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#176B68] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <HeartPulse size={18} className="stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#172A2B]">{APP_NAME}</span>
                <span className="hidden xs:inline text-[11px] px-1.5 py-0.5 rounded-full bg-[#DCEDEA] text-[#176B68] font-bold">
                  AAHMS
                </span>
              </div>
            </div>
          </Link>

          {!isPublicRoute && (
            <div className="hidden lg:flex items-center gap-1.5 text-sm text-[#60716E] ml-2 border-l border-[#D9E2DE] pl-3 truncate">
              <ChevronRight size={14} className="text-[#B6C6C2] shrink-0" />
              <span className="font-medium text-[#172A2B] truncate">{getPageTitle()}</span>
            </div>
          )}
        </div>

        {/* Center: Mission Context Chip (V3 §4: Inter 13–14px, not tiny monospace) */}
        {!isPublicRoute && (
          <div className="hidden sm:flex items-center gap-2 bg-[#F4F6F4] px-3.5 py-1 rounded-full border border-[#D9E2DE] text-sm font-medium text-[#172A2B] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#176B68] animate-pulse" aria-hidden="true" />
            <span className="font-semibold">Sol {overview?.missionDay || 90}</span>
            <span className="text-[#B6C6C2]">·</span>
            <span className="text-[#60716E]">Mars transit</span>
            <span className="text-[#B6C6C2]">·</span>
            <span className="font-semibold text-[#176B68]">{overview?.crewMember?.callsign || 'CDR-01'}</span>
          </div>
        )}

        {/* Right: Quick actions & sync */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isPublicRoute ? (
            <>
              {/* Sync Trigger button */}
              <button
                type="button"
                onClick={triggerSync}
                disabled={isSyncing}
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-[#D9E2DE] hover:bg-[#F4F6F4] text-[#172A2B] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Telemetry synchronization state"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#176B68]' : 'text-[#60716E]'} />
                <span className="hidden md:inline">{isSyncing ? 'Syncing...' : 'Sync DSN'}</span>
              </button>

              <ThemeToggle />

              {/* Alerts shortcut badge */}
              <Link
                href="/app/alerts"
                className={`relative p-2 rounded-lg border transition-colors ${
                  pathname.includes('/alerts')
                    ? 'bg-[#FBF0D9] border-[#EED8A7] text-[#8A520F]'
                    : alertCount > 0
                    ? 'bg-[#FBF0D9]/40 border-[#EED8A7] text-[#8A520F] hover:bg-[#FBF0D9]'
                    : 'border-[#D9E2DE] text-[#60716E] hover:bg-[#F4F6F4]'
                }`}
                aria-label={`${alertCount} active health alerts`}
              >
                <Bell size={16} />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A96617] text-white text-[10px] font-bold flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </Link>

              {/* Daily Check-In Primary Action */}
              <Link
                href="/app/check-in"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all ${
                  overview?.dailyCheckInDone
                    ? 'bg-[#E4F2E9] text-[#247A55] border border-[#BDE0CB] hover:bg-[#D5EBDE]'
                    : 'bg-[#176B68] text-white hover:bg-[#135754] active:scale-[0.98]'
                }`}
              >
                <CheckSquare size={14} />
                <span className="hidden xs:inline">{overview?.dailyCheckInDone ? 'Log Done' : 'Daily Log'}</span>
              </Link>

              {/* Mobile User Avatar */}
              <Link
                href="/app/settings"
                className="md:hidden w-8 h-8 rounded-full bg-[#176B68] text-white font-bold text-xs flex items-center justify-center shrink-0 ml-1"
                title={user?.name || 'Commander Sarah Walker'}
              >
                {user?.avatarInitials || 'SW'}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#172A2B] hover:text-[#176B68] px-3 py-1.5 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold text-white bg-[#176B68] hover:bg-[#135754] px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
