'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  CheckSquare,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { APP_NAME } from '../../lib/branding';

interface TopBarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const SCENARIO_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  day90_yellow:      { label: 'Day 90 Yellow', color: '#8A520F', bg: '#FBF0D9' },
  nominal_green:     { label: 'Nominal Green',  color: '#1a6b40', bg: '#E4F2E9' },
  insufficient_data: { label: 'Degraded Link',  color: '#4B5563', bg: '#F1F5F9' },
};

export function TopBar({ mobileMenuOpen, setMobileMenuOpen }: TopBarProps) {
  const pathname = usePathname();
  const { overview, syncState, triggerSync, activeScenario, setScenario, loading } = useHealth();
  const { user } = useAuth();
  const [showScenarioPicker, setShowScenarioPicker] = useState(false);

  const isSyncing = syncState?.queueState === 'syncing';
  const alertCount = overview?.activeAlerts?.length || 0;

  const getPageTitle = () => {
    if (pathname === '/app' || pathname === '/dashboard') return 'Dashboard';
    if (pathname.includes('/readings/new')) return 'Record Reading';
    if (pathname.includes('/readings')) return 'Trends';
    if (pathname.includes('/body-map')) return 'Body Map';
    if (pathname.includes('/check-in')) return 'Daily Log';
    if (pathname.includes('/trends')) return 'Health Trends';
    if (pathname.includes('/alerts')) return 'Alerts';
    if (pathname.includes('/radiation')) return 'Radiation';
    if (pathname.includes('/exercise')) return 'Exercise';
    if (pathname.includes('/guides')) return 'Guides';
    if (pathname.includes('/ai-explanation')) return 'AI Explanation';
    if (pathname.includes('/records')) return 'Records';
    if (pathname.includes('/consistency')) return 'Consistency';
    if (pathname.includes('/reaction-test')) return 'Reaction Test';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Health Monitoring';
  };

  const isAuthRoute =
    pathname === '/login' || pathname === '/signup' ||
    pathname === '/forgot-password' || pathname === '/reset-password';
  if (isAuthRoute) return null;

  const isPublicRoute = pathname === '/' || pathname === '/about' || pathname === '/demo';
  const scenario = SCENARIO_LABELS[activeScenario || 'day90_yellow'] ?? SCENARIO_LABELS['day90_yellow'];

  /* ── PUBLIC nav ─────────────────────────────────────── */
  if (isPublicRoute) {
    return (
      <header className="bg-white border-b border-[#D9E2DE] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#176B68] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={17} />
            </div>
            <div className="leading-none">
              <span className="text-base font-extrabold tracking-tight text-[#172A2B] block">{APP_NAME}</span>
              <span className="text-[10px] text-[#60716E] font-medium block">AAHMS</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-[#172A2B] hover:text-[#176B68] px-3 py-1.5 rounded-lg transition-colors">Log in</Link>
            <Link href="/signup" className="text-sm font-bold text-white bg-[#176B68] hover:bg-[#135754] px-3.5 py-1.5 rounded-lg transition-colors shadow-xs">Get started</Link>
          </div>
        </div>
      </header>
    );
  }

  /* ── AUTHENTICATED cockpit nav ─────────────────────── */
  return (
    <header className="bg-white border-b border-[#D9E2DE] sticky top-0 z-30">
      <div className="max-w-full px-3 sm:px-5 h-14 flex items-center justify-between gap-2">

        {/* LEFT: hamburger + logo + page title */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="md:hidden p-2 -ml-1 text-[#172A2B] hover:bg-[#EAF0ED] rounded-lg transition-colors cursor-pointer shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-[#176B68] text-white flex items-center justify-center shadow-xs group-hover:bg-[#135754] transition-colors">
              <ShieldCheck size={17} />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="text-[15px] font-extrabold tracking-tight text-[#172A2B] block leading-tight">{APP_NAME}</span>
              <span className="text-[10px] text-[#60716E] font-medium block leading-none">AAHMS</span>
            </div>
          </Link>

          {/* Page title */}
          <span className="hidden md:block text-[#D9E2DE] text-lg font-light mx-1 select-none">|</span>
          <span className="hidden md:block text-sm font-semibold text-[#172A2B] truncate">{getPageTitle()}</span>
        </div>

        {/* CENTER: scenario + mission chip */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {/* Sim pill */}
          <span className="inline-flex items-center gap-1 bg-[#122B31] text-[#EAF0ED] px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0">
            <Sparkles size={10} aria-hidden="true" />
            Sim
          </span>

          {/* Scenario selector */}
          <div className="relative">
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowScenarioPicker((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer transition-colors"
              style={{ color: scenario.color, background: scenario.bg, borderColor: scenario.color + '44' }}
              title="Click to change scenario"
            >
              {scenario.label}
              <Info size={11} className="opacity-60" />
            </button>
            {showScenarioPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#D9E2DE] rounded-xl shadow-lg p-1.5 z-50 min-w-[160px]">
                {Object.entries(SCENARIO_LABELS).map(([key, s]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setScenario(key as 'day90_yellow' | 'nominal_green' | 'insufficient_data');
                      setShowScenarioPicker(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#F4F6F4] transition-colors cursor-pointer"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mission chip */}
          <div className="flex items-center gap-1.5 bg-[#F4F6F4] px-3 py-1 rounded-full border border-[#D9E2DE] text-[12px] font-medium text-[#172A2B] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B68] animate-pulse" aria-hidden="true" />
            <span className="font-semibold">Sol {overview?.missionDay || 90}</span>
            <span className="text-[#B6C6C2]">·</span>
            <span className="text-[#60716E]">Mars transit</span>
            <span className="text-[#B6C6C2]">·</span>
            <span className="font-bold text-[#176B68]">{overview?.crewMember?.callsign || 'CDR-01'}</span>
          </div>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={triggerSync}
            disabled={isSyncing}
            className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#D9E2DE] hover:bg-[#F4F6F4] text-[#172A2B] text-xs font-semibold transition-colors cursor-pointer items-center gap-1.5"
            title="Telemetry synchronisation"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-[#176B68]' : 'text-[#60716E]'} />
            <span className="hidden lg:inline">{isSyncing ? 'Syncing…' : 'Sync DSN'}</span>
          </button>

          <ThemeToggle />

          <Link
            href="/app/alerts"
            className={`relative p-2 rounded-lg border transition-colors ${
              alertCount > 0
                ? 'bg-[#FBF0D9]/60 border-[#EED8A7] text-[#8A520F] hover:bg-[#FBF0D9]'
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

          <Link
            href="/app/check-in"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all ${
              overview?.dailyCheckInDone
                ? 'bg-[#E4F2E9] text-[#247A55] border border-[#BDE0CB] hover:bg-[#D5EBDE]'
                : 'bg-[#176B68] text-white hover:bg-[#135754] active:scale-[0.98]'
            }`}
          >
            <CheckSquare size={14} />
            <span className="hidden xs:inline">{overview?.dailyCheckInDone ? 'Done' : 'Daily Log'}</span>
          </Link>

          <Link
            href="/app/settings"
            className="md:hidden w-8 h-8 rounded-full bg-[#176B68] text-white font-bold text-xs flex items-center justify-center shrink-0"
            title={user?.name || 'Crew Member (demo)'}
          >
            {user?.avatarInitials || 'CM'}
          </Link>
        </div>
      </div>
    </header>
  );
}
