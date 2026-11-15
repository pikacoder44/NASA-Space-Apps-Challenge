import React, { Suspense } from 'react';
import { IndicatorDetailView } from '@/components/health/IndicatorDetailView';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export function generateStaticParams() {
  return [
    { indicator: 'sleep' },
    { indicator: 'heart_rate' },
    { indicator: 'hrv' },
    { indicator: 'blood_pressure' },
    { indicator: 'skin_temperature' },
    { indicator: 'mood' },
    { indicator: 'fatigue' },
    { indicator: 'blood_glucose' },
    { indicator: 'radiation_dose' },
    { indicator: 'exercise' },
  ];
}

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ indicator: string }>;
}) {
  const { indicator } = await params;

  return (
    <ErrorBoundary widgetName="Indicator Detail View" variant="page">
      <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-[#60716E]">Loading indicator telemetry...</div>}>
        <IndicatorDetailView indicatorId={indicator} />
      </Suspense>
    </ErrorBoundary>
  );
}
