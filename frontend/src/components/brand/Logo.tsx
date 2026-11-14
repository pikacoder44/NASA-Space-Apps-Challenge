'use client';

import React from 'react';
import Link from 'next/link';
import { APP_NAME } from '../../lib/branding';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  inverted?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  size = 'md',
  inverted = false,
  className = '',
  href = '/'
}: LogoProps) {
  const iconPx = size === 'sm' ? 24 : size === 'lg' ? 40 : 36;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  const logoMark = (
    <svg
      width={iconPx}
      height={iconPx}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label={`${APP_NAME} logo`}
    >
      {/* 36px rounded square mark in solid teal */}
      <rect
        width="36"
        height="36"
        rx="9"
        fill="#176B68"
      />
      {/* Crisp white orbit ellipse */}
      <ellipse
        cx="18"
        cy="18"
        rx="12.5"
        ry="6.5"
        transform="rotate(-22 18 18)"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        strokeOpacity="0.9"
      />
      {/* Single celestial dot */}
      <circle
        cx="28"
        cy="13.5"
        r="1.8"
        fill="#F2A65A"
      />
      {/* Bold single heartbeat pulse line crossing the orbit */}
      <path
        d="M7 18h6l2-4 3.5 8 2.5-5 1.5 1H29"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {logoMark}
      <span
        className={`font-semibold tracking-tight leading-none ${textSize} ${
          inverted ? 'text-white' : 'text-[#172A2B]'
        }`}
      >
        {APP_NAME}
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#176B68] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
