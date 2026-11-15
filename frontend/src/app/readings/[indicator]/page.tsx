import React from 'react';
import { Indicator } from '../../../lib/types';
import ReadingIndicatorClient from './ReadingIndicatorClient';

const VALID_INDICATORS: Indicator[] = [
  'heart_rate',
  'blood_pressure_systolic',
  'blood_pressure_diastolic',
  'body_temp',
  'blood_sugar',
  'sleep_hours',
  'mood_score'
];

export function generateStaticParams() {
  return VALID_INDICATORS.map((indicator) => ({
    indicator
  }));
}

export default async function ReadingIndicatorPage({
  params
}: {
  params: Promise<{ indicator: string }>;
}) {
  const resolved = await params;
  return <ReadingIndicatorClient indicatorKey={resolved.indicator as Indicator} />;
}
