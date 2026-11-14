import { redirect } from 'next/navigation';

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

export default async function IndicatorLegacyRedirect({
  params,
}: {
  params: Promise<{ indicator: string }>;
}) {
  const { indicator } = await params;
  redirect(`/app/indicators/${indicator}`);
}
