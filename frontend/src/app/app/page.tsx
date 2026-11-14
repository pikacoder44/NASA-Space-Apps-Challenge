'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="p-8 text-center text-sm text-[#60716E]">
      Redirecting to AstroTrack Dashboard...
    </div>
  );
}
