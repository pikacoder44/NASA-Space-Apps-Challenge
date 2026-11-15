'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Layers, 
  AlertTriangle, 
  MoreHorizontal,
  X
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { SidebarNavigation } from './SidebarNavigation';

export function BottomTabBar() {
  const pathname = usePathname();
  const { overview } = useHealth();
  const [moreOpen, setMoreOpen] = useState(false);

  const isAuth = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password';
  const isPublic = pathname === '/' || pathname === '/about' || pathname === '/demo';

  if (isAuth || isPublic) {
    return null;
  }

  const alertCount = overview?.activeAlerts?.length || 0;

  const tabs = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Record', href: '/readings/new', icon: CheckSquare },
    { name: 'Body Map', href: '/body-map', icon: Layers },
    { name: 'Alerts', href: '/app/alerts', icon: AlertTriangle, count: alertCount }
  ];

  return (
    <>
      {/* Fixed bottom navigation for mobile screens (<768px) */}
      <nav
        aria-label="Mobile Navigation Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D9E2DE] px-2 py-1 shadow-lg"
      >
        <div className="grid grid-cols-5 items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-colors relative tap-target ${
                  isActive ? 'text-[#176B68]' : 'text-[#60716E] hover:text-[#172A2B]'
                }`}
              >
                <div className="relative">
                  <Icon size={18} />
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-[#A96617] text-white text-[8px] font-bold flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </div>
                <span className="mt-0.5 tracking-tight">{tab.name}</span>
              </Link>
            );
          })}

          {/* More tab button */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-colors tap-target ${
              moreOpen ? 'text-[#176B68]' : 'text-[#60716E] hover:text-[#172A2B]'
            }`}
          >
            <MoreHorizontal size={18} />
            <span className="mt-0.5 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Sheet Modal for Mobile */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex items-end"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl p-4 max-h-[80dvh] overflow-y-auto shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#D9E2DE]">
              <span className="font-bold text-sm text-[#172A2B]">Extended Tools & Exploration</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="p-1 rounded text-[#60716E] hover:bg-[#EAF0ED]"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarNavigation onItemClick={() => setMoreOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
