'use client';

import React from 'react';
import Link from 'next/link';
import { APP_NAME } from '../../lib/branding';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  inverted?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  size = 'md',
  showSubtitle = false,
  inverted = false,
  className = '',
  href = '/'
}: LogoProps) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const px = iconSizes[size];

  const logoMark = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label={`${APP_NAME} logo`}
    >
      {/* Background circle badge */}
      <rect
        width="40"
        height="40"
        rx="10"
        className={inverted ? "fill-[#0F2A30]" : "fill-[#176B68]"}
      />
      {/* Orbit ellipse tilted */}
      <ellipse
        cx="20"
        cy="20"
        rx="14"
        ry="7"
        transform="rotate(-25 20 20)"
        stroke={inverted ? "#3FB6A8" : "#EAF0ED"}
        strokeWidth="1.6"
        strokeOpacity="0.85"
      />
      {/* Dot on the orbit representing spacecraft / celestial body */}
      <circle
        cx="32"
        cy="15"
        r="2"
        fill={inverted ? "#F2A65A" : "#FFFFFF"}
      />
      {/* Heartbeat / ECG pulse crossing horizontally */}
      <path
        d="M9 20h6l2.2-4.5 3.6 9 2.7-6 1.8 1.5H31"
        stroke={inverted ? "#FFFFFF" : "#F2A65A"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {logoMark}
      <div className="leading-none">
        <span
          className={`font-bold tracking-tight block ${textSizes[size]} ${
            inverted ? 'text-white' : 'text-[#172A2B]'
          }`}
        >
          {APP_NAME}
        </span>
        {showSubtitle && (
          <span
            className={`text-[10px] block mt-0.5 font-medium tracking-normal ${
              inverted ? 'text-[#A2BEB9]' : 'text-[#60716E]'
            }`}
          >
            AAHMS · Astronaut Health Monitor
          </span>
        )}
      </div>
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
