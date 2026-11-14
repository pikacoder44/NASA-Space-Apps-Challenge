'use client';

import React from 'react';
import { Logo } from '../brand/Logo';

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
          <div className="flex justify-center mb-1">
            <Logo size="md" href="/" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#172A2B] pt-1">
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
