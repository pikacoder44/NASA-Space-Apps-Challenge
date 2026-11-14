'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';

const emptySubscribe = () => () => {};
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Activity, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  ShieldAlert, 
  Dumbbell, 
  ClipboardList, 
  Award, 
  Zap, 
  Settings,
  History,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarNavigationProps {
  onItemClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileDrawer?: boolean;
}

export function SidebarNavigation({
  onItemClick,
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false
}: SidebarNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { overview } = useHealth();
  const { user, signOut } = useAuth();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const groups = [
    {
      title: 'AstroTrack Cockpit',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Record Reading', href: '/readings/new', icon: CheckSquare, badge: 'New' },
        { name: 'Body Map', href: '/body-map', icon: Layers },
        { name: 'Overview (Sol 90)', href: '/app', icon: Activity },
        { name: 'Trends', href: '/app/trends', icon: TrendingUp },
        { name: 'Alerts', href: '/app/alerts', icon: AlertTriangle, count: overview?.activeAlerts?.length || 0 }
      ]
    },
    {
      title: 'Explore',
      items: [
        { name: 'Body Map', href: '/app/body-map', icon: Layers },
        { name: 'Radiation', href: '/app/radiation', icon: ShieldAlert },
        { name: 'Exercise', href: '/app/exercise', icon: Dumbbell },
        { name: 'Guides', href: '/app/guides', icon: BookOpen }
      ]
    },
    {
      title: 'Tools',
      items: [
        { name: 'AI Explanation', href: '/app/ai-explanation', icon: Sparkles, tag: 'Gemini' },
        { name: 'Manual Records', href: '/app/records', icon: ClipboardList },
        { name: 'Consistency', href: '/app/consistency', icon: Award },
        { name: 'Reaction Test', href: '/app/reaction-test', icon: Zap }
      ]
    },
    {
      title: 'Utility',
      items: [
        { name: 'Mission Log', href: '/app/log', icon: History },
        { name: 'Settings', href: '/app/settings', icon: Settings },
        { name: 'Public Landing', href: '/', icon: Home }
      ]
    }
  ];

  const handleLogout = async () => {
    if (onItemClick) onItemClick();
    await signOut();
    router.push('/');
  };

  const renderLink = (item: {
    name: string;
    href: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    badge?: string;
    count?: number;
    tag?: string;
  }) => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href ||
      (item.href !== '/' && item.href !== '/app' && pathname.startsWith(item.href)) ||
      (item.href === '/app' && (pathname === '/app' || pathname === '/'));

    if (isCollapsed && !isMobileDrawer) {
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          title={item.name}
          className={`flex items-center justify-center h-11 w-11 mx-auto rounded-xl transition-all relative group ${
            isActive
              ? 'bg-[#176B68] text-white shadow-xs'
              : 'text-[#60716E] hover:bg-[#EAF0ED] hover:text-[#172A2B]'
          }`}
        >
          <Icon size={20} className={isActive ? 'text-white' : 'text-[#60716E] group-hover:text-[#172A2B]'} />
          {item.count !== undefined && item.count > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#A96617] text-white text-[10px] font-bold flex items-center justify-center">
              {item.count}
            </span>
          )}
          {/* Accessible hover tooltip for icon rail */}
          <span className="sr-only">{item.name}</span>
        </Link>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onItemClick}
        className={`flex items-center justify-between h-11 px-3 rounded-xl text-base transition-colors ${
          isActive
            ? 'bg-[#176B68] text-white font-semibold shadow-xs'
            : 'text-[#172A2B] font-medium hover:bg-[#EAF0ED] hover:text-[#176B68]'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          <Icon size={20} className={`shrink-0 ${isActive ? 'text-white' : 'text-[#60716E]'}`} />
          <span className="truncate">{item.name}</span>
        </div>

        {item.count !== undefined && item.count > 0 && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              isActive ? 'bg-white text-[#176B68]' : 'bg-[#FBF0D9] text-[#8A520F]'
            }`}
          >
            {item.count}
          </span>
        )}

        {item.badge && (
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              item.badge === 'Done'
                ? isActive ? 'bg-white/20 text-white' : 'bg-[#E4F2E9] text-[#247A55]'
                : isActive ? 'bg-white/20 text-white' : 'bg-[#FBF0D9] text-[#A96617]'
            }`}
          >
            {item.badge}
          </span>
        )}

        {item.tag && (
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
              isActive ? 'bg-white/20 text-white' : 'bg-[#DCEDEA] text-[#176B68]'
            }`}
          >
            {item.tag}
          </span>
        )}
      </Link>
    );
  };

  const displayName = user?.name || 'Sarah Walker';
  const displayRole = user?.role || 'Commander (CDR-01)';
  const displayInitials = user?.avatarInitials || 'SW';

  return (
    <aside className="flex flex-col justify-between h-full select-none">
      {/* 1. Header / Logo Block (V3 §4: 44px mark + AAHMS 20px + 12px subtitle) */}
      {!isMobileDrawer && (
        <div className="flex items-center justify-between pb-3 pt-1 border-b border-[#D9E2DE] mb-2 px-1">
          <Link href="/app" className="flex items-center gap-2.5 truncate">
            <div className="w-10 h-10 rounded-xl bg-[#176B68] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck size={22} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-xl font-extrabold tracking-tight text-[#172A2B] block leading-none">
                  AAHMS
                </span>
                <span className="text-xs text-[#60716E] font-medium block truncate mt-0.5">
                  Astronaut Health Monitoring
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Rail Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-lg text-[#60716E] hover:bg-[#EAF0ED] hover:text-[#172A2B] transition-colors"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>
      )}

      {/* 2. Navigation Groups */}
      <nav className="flex-1 space-y-4 py-1 overflow-y-auto" aria-label="Dashboard Navigation">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-[#60716E]">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map(renderLink)}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Bottom User Card & Logout (V3 §4) */}
      <div className="pt-3 border-t border-[#D9E2DE] mt-2">
        {mounted && (
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-white border border-[#D9E2DE] shadow-xs ${
              isCollapsed && !isMobileDrawer ? 'justify-center p-2' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#176B68] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {displayInitials}
              </div>
              {(!isCollapsed || isMobileDrawer) && (
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#172A2B] block truncate leading-tight">
                    {displayName}
                  </span>
                  <span className="text-xs text-[#60716E] block truncate">
                    {displayRole}
                  </span>
                </div>
              )}
            </div>

            {/* Logout button */}
            {(!isCollapsed || isMobileDrawer) ? (
              <button
                type="button"
                onClick={handleLogout}
                title="Log out session"
                className="p-2 rounded-lg text-[#60716E] hover:text-[#B33C3C] hover:bg-[#F9E7E5] transition-colors cursor-pointer"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                title="Log out session"
                className="sr-only"
              >
                Log out
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
