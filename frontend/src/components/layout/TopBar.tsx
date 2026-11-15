'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../brand/Logo';
import {
  Bell,
  CheckSquare,
  RefreshCw,
  Menu,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

interface TopBarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const SCENARIO_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  day90_yellow:      { label: 'Sol 90 · Attention', color: '#8A520F', bg: '#FBF0D9' },
  nominal_green:     { label: 'Sol 90 · Nominal',  color: '#1a6b40', bg: '#E4F2E9' },
  insufficient_data: { label: 'Sol 90 · Degraded Link',  color: '#4B5563', bg: '#F1F5F9' },
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
    if (pathname.includes('/readings')) return 'Health Trends';
    if (pathname.includes('/body-map')) return 'Body Map';
    if (pathname.includes('/check-in')) return 'Daily Log';
    if (pathname.includes('/trends')) return 'Health Trends';
    if (pathname.includes('/alerts')) return 'Health Alerts';
    if (pathname.includes('/radiation')) return 'Radiation Tracker';
    if (pathname.includes('/exercise')) return 'Exercise Routine';
    if (pathname.includes('/guides')) return 'How-To Guides';
    if (pathname.includes('/ai-explanation')) return 'AI Health Assistant';
    if (pathname.includes('/records')) return 'History Log';
    if (pathname.includes('/consistency')) return 'Streaks & Badges';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Logo size="md" href="/" />
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-[#172A2B] hover:text-[#176B68] px-3.5 py-2 rounded-lg transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold text-white bg-[#176B68] hover:bg-[#135754] px-4 py-2 rounded-xl transition-colors shadow-xs">
              Get started
            </Link>
          </div>
        </div>
      </header>
    );
  }

  /* ── AUTHENTICATED cockpit nav (starts to right of sidebar) ── */
  return (
    <header className="bg-white border-b border-[#D9E2DE] sticky top-0 z-20 h-16">
      <div className="w-full px-4 sm:px-6 h-full flex items-center justify-between gap-4">

        {/* LEFT: Page title only on desktop. Mobile has hamburger + Logo mark + title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -ml-2 text-[#172A2B] hover:bg-[#EAF0ED] rounded-lg transition-colors cursor-pointer shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile Logo Mark (hidden on desktop because sidebar already shows it!) */}
          <div className="md:hidden shrink-0">
            <Logo size="sm" href="/dashboard" />
          </div>

          {/* Page Title */}
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#172A2B] truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* CENTER: Scenario pill + Mission chip */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Sim pill */}
          <span className="inline-flex items-center gap-1 bg-[#12343B] text-[#EAF0ED] px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0">
            <Sparkles size={11} aria-hidden="true" />
            Sim
          </span>

          {/* Scenario selector */}
          <div className="relative">
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowScenarioPicker((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border cursor-pointer transition-colors"
              style={{ color: scenario.color, background: scenario.bg, borderColor: scenario.color + '44' }}
              title="Click to change scenario"
            >
              {scenario.label}
              <Info size={12} className="opacity-60" />
            </button>
            {showScenarioPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-[#D9E2DE] rounded-xl shadow-xl p-1.5 z-50 min-w-[170px]">
                {Object.entries(SCENARIO_LABELS).map(([key, s]) => (
                  <button
                    key={key}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      setScenario(key as 'day90_yellow' | 'nominal_green' | 'insufficient_data');
                      setShowScenarioPicker(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#F4F6F4] transition-colors cursor-pointer"
                    style={{ color: s.color }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mission chip */}
          <div className="flex items-center gap-2 bg-[#F4F6F4] px-3.5 py-1 rounded-full border border-[#D9E2DE] text-xs font-medium text-[#172A2B] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#176B68] animate-pulse" aria-hidden="true" />
            <span className="font-semibold">Sol {overview?.missionDay || 90}</span>
            <span className="text-[#B6C6C2]">·</span>
            <span className="text-[#60716E]">Mars transit</span>
            <span className="text-[#B6C6C2]">·</span>
            <span className="font-bold text-[#176B68]">{overview?.crewMember?.callsign || 'CDR-01'}</span>
          </div>
        </div>

        {/* RIGHT: Quick actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={triggerSync}
            disabled={isSyncing}
            className="hidden sm:flex p-2 rounded-lg border border-[#D9E2DE] hover:bg-[#F4F6F4] text-[#172A2B] text-xs font-semibold transition-colors cursor-pointer items-center gap-1.5"
            title="Telemetry synchronization"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#176B68]' : 'text-[#60716E]'} />
            <span className="hidden lg:inline">{isSyncing ? 'Syncing…' : 'Sync DSN'}</span>
          </button>

          <ThemeToggle />

          <Link
            href="/app/alerts"
            className={`relative p-2 rounded-lg border transition-colors ${
              alertCount > 0
                ? 'bg-[#FBF0D9]/70 border-[#EED8A7] text-[#8A520F] hover:bg-[#FBF0D9]'
                : 'border-[#D9E2DE] text-[#60716E] hover:bg-[#F4F6F4]'
            }`}
            aria-label={`${alertCount} active health alerts`}
          >
            <Bell size={17} />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A96617] text-white text-[10px] font-bold flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </Link>

          <Link
            href="/app/check-in"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all ${
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
