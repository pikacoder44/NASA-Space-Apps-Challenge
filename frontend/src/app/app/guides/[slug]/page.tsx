import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MEASUREMENT_GUIDES } from '@/data/mockData';
import {
  ArrowLeft,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export function generateStaticParams() {
  return [
    { slug: 'heart_rate' },
    { slug: 'blood_pressure' },
    { slug: 'blood_glucose' },
    { slug: 'skin_temperature' },
    { slug: 'sleep_logging' },
    { slug: 'mood_energy' }
  ];
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = MEASUREMENT_GUIDES.find((g) => g.id === slug);

  if (!guide) {
    notFound();
  }

  const guideImages: Record<string, { src: string; alt: string; caption: string }> = {
    heart_rate: {
      src: '/images/nasa/iss-exercise-ared.jpg',
      alt: 'Astronaut countermeasure monitoring on ISS',
      caption: 'Continuous cardiovascular telemetry calibration during operational duty'
    },
    blood_pressure: {
      src: '/images/nasa/iss-exercise-ared.jpg',
      alt: 'Brachial cuff monitoring aboard spacecraft',
      caption: 'Standardized pneumatic cuff calibration at heart level'
    },
    sleep_logging: {
      src: '/images/nasa/iss-crew-sleep.jpg',
      alt: 'Astronaut sleep quarters aboard ISS',
      caption: 'Sound-dampened crew berth actigraphy and circadian rest logging'
    },
    mood_energy: {
      src: '/images/nasa/iss-crew-meal.jpg',
      alt: 'Crew meal and behavioral equilibrium in space',
      caption: 'Behavioral health and psychological support during long-duration flight'
    }
  };

  const imageInfo = guideImages[guide.id] || {
    src: '/images/nasa/iss-cupola-earth.jpg',
    alt: 'Spaceflight flight hardware telemetry guide',
    caption: 'Operational flight hardware protocol guide'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#172A2B]">
      {/* Back button */}
      <div>
        <Link
          href="/app/guides"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#176B68] hover:underline"
        >
          <ArrowLeft size={14} />
          <span>Back to All Measurement Guides</span>
        </Link>
      </div>

      {/* Guide Header Banner with NASA Context Image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#122B31] border border-[#D9E2DE] shadow-xs">
        <div className="relative h-44 sm:h-56 w-full">
          <Image
            src={imageInfo.src}
            alt={imageInfo.alt}
            fill
            priority
            className="object-cover object-center brightness-75 contrast-110"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#122B31] via-[#122B31]/70 to-[#122B31]/40" />
        </div>

        <div className="p-6 sm:p-8 space-y-2 relative z-10 -mt-16 sm:-mt-20">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#176B68] text-white text-xs font-bold uppercase tracking-wider">
              {guide.system}
            </span>
            <span className="text-xs text-[#A2BEB9] flex items-center gap-1">
              <Clock size={12} />
              <span>{guide.readTime}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {guide.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#A2BEB9] max-w-2xl leading-relaxed">
            {guide.overview}
          </p>
        </div>
      </div>

      {/* Required Equipment */}
      <div className="p-5 rounded-xl bg-white border border-[#D9E2DE] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#172A2B] uppercase tracking-wide">
          <Wrench size={15} className="text-[#176B68]" />
          <span>Required Flight Equipment</span>
        </div>
        <p className="text-xs sm:text-sm text-[#172A2B] leading-relaxed">
          {guide.equipment}
        </p>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white rounded-xl border border-[#D9E2DE] p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#172A2B] pb-3 border-b border-[#D9E2DE]">
          Standard Operating Execution Steps
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-[#176B68] uppercase mb-2">Phase 1: Pre-Measurement Calibration</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#172A2B]">
              {guide.preparation.map((prep, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#DCEDEA] text-[#176B68] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{prep}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[#D9E2DE]">
            <h3 className="text-xs font-bold text-[#176B68] uppercase mb-2">Phase 2: Procedure & Logging</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#172A2B]">
              {guide.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#247A55] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Common Pitfalls & Troubleshooting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pitfalls */}
        <div className="p-5 rounded-xl bg-white border border-[#D9E2DE] shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A96617] uppercase tracking-wide">
              <AlertTriangle size={15} />
              <span>Common Spaceflight Pitfalls</span>
            </div>
            <ul className="space-y-2 text-xs text-[#172A2B]">
              {guide.commonPitfalls.map((pitfall, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-[#FBF0D9]/50 border border-[#EED8A7] leading-relaxed">
                  {pitfall}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="p-5 rounded-xl bg-white border border-[#D9E2DE] shadow-xs space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#176B68] uppercase tracking-wide">
              <HelpCircle size={15} />
              <span>Hardware Troubleshooting</span>
            </div>
            <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed p-3 rounded-lg bg-[#F4F6F4] border border-[#D9E2DE]">
              {guide.troubleshooting}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/app/check-in"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176B68] hover:underline"
            >
              <span>Record measurement in Daily Log</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
