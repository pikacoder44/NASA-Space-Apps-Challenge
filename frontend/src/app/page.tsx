'use client';

import React from 'react';
import { ScrollProgress } from '../components/motion/MotionHelpers';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ChallengeSection } from '../components/landing/ChallengeSection';
import { HazardsPentagon } from '../components/landing/HazardsPentagon';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { IndicatorsListSection } from '../components/landing/IndicatorsListSection';
import { BaselineDemoSection } from '../components/landing/BaselineDemoSection';
import { ScenarioScrubberSection } from '../components/landing/ScenarioScrubberSection';
import { BodyMapTeaserSection } from '../components/landing/BodyMapTeaserSection';
import { RoutineStreakSection } from '../components/landing/RoutineStreakSection';
import { SourcesSection } from '../components/landing/SourcesSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#172A2B] selection:bg-[#F2A65A]/30 selection:text-[#172A2B]">
      {/* 1. Thin Scroll Progress Bar */}
      <ScrollProgress color="#F2A65A" />

      {/* 2. Sticky Glass Landing Navbar */}
      <LandingNavbar />

      {/* 3. Main Landing Sections */}
      <main id="main-content">
        {/* Section 1: Hero (full viewport, 225M km, stats, floating preview) */}
        <HeroSection />

        {/* Section 2: The Challenge (asymmetrical split, NASA quote, 5 points) */}
        <ChallengeSection />

        {/* Section 3: The 5 NASA Hazards (Dark section, interactive SVG pentagon) */}
        <HazardsPentagon />

        {/* Section 4: How It Works (4-step interactive selector: Log, Compare, Understand, Act) */}
        <HowItWorksSection />

        {/* Section 5: Six Indicators (editorial wide list, hover highlight, sparklines) */}
        <IndicatorsListSection />

        {/* Section 6: Interactive Baseline Demo (personal vs population sliders) */}
        <BaselineDemoSection />

        {/* Section 7: Sol 84 -> Sol 90 Scenario Scrubber (Mars background, timeline) */}
        <ScenarioScrubberSection />

        {/* Section 8: Body Map Teaser (line-art figure, 4 clickable hotspots) */}
        <BodyMapTeaserSection />

        {/* Section 9: Routine & Streaks (animated ring, points, compliance) */}
        <RoutineStreakSection />

        {/* Section 10: Official Sources (01-05 big numerals with NASA/CSA links) */}
        <SourcesSection />

        {/* Section 11: FAQ Accordion (5 core questions answered) */}
        <FaqSection />

        {/* Section 12: Final CTA (Earth from Cupola, dual actions) */}
        <FinalCtaSection />
      </main>

      {/* 4. Complete Footer */}
      <LandingFooter />
    </div>
  );
}
