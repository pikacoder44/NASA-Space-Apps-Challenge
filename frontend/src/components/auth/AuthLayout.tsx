'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { APP_NAME, APP_SUBTITLE } from '../../lib/branding';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  quote?: string;
  quoteAuthor?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#F4F6F4] flex flex-col justify-center items-center p-4 sm:p-6 text-[#172A2B]">
      <div className="w-full max-w-[440px] bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Header inside card: Logo, Title, Subtitle */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#176B68] text-white flex items-center justify-center font-bold shadow-xs">
              <HeartPulse size={20} className="stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-lg tracking-tight text-[#172A2B] block leading-none">
                {APP_NAME}
              </span>
              <span className="text-[11px] text-[#60716E] font-medium block">
                AAHMS Crew Terminal
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#172A2B] pt-1">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#60716E] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Form Body */}
        <div>
          {children}
        </div>

        {/* Prototype Disclaimer */}
        <p className="text-[11px] text-center text-[#60716E] pt-3 border-t border-[#D9E2DE]/70 leading-relaxed">
          Prototype, not a medical device · NASA Space Apps Challenge 2026
        </p>
      </div>
    </div>
  );
}
