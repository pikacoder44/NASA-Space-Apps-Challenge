'use client';

import React, { useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const nextQuery = encodeURIComponent(pathname);
      router.replace(`/login?next=${nextQuery}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F4] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-[#D9E2DE] p-8 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#DCEDEA] text-[#176B68] flex items-center justify-center mx-auto">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#172A2B]">Authenticating Crew Session</h2>
            <p className="text-xs text-[#60716E] mt-1">Verifying encrypted local authorization tokens...</p>
          </div>
          <div className="w-full bg-[#EAF0ED] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#176B68] h-full rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
