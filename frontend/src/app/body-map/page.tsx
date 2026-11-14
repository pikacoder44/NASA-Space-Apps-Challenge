'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';
import { BodyMapInteractive } from '../../components/body/BodyMapInteractive';

export default function DirectBodyMapPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-main transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </Link>
        <span className="text-xs text-muted">AstroTrack Anatomical Mapping</span>
      </div>

      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Compass size={20} className="text-brand" />
          <h1 className="text-2xl font-extrabold text-main tracking-tight">Interactive Astronaut Body Map</h1>
        </div>
        <p className="text-xs text-muted">
          Click any physiological zone (Head, Heart, Torso, Spine, Lower Limbs) to inspect targeted vital signs, symptoms, and localized microgravity adaptations.
        </p>
      </div>

      <BodyMapInteractive />
    </div>
  );
}
