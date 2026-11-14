'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  ArrowRight, 
  ShieldCheck, 
  Radio, 
  Activity, 
  Moon, 
  Heart, 
  Gauge, 
  Thermometer, 
  Smile, 
  BatteryMedium, 
  Droplets, 
  Dumbbell, 
  AlertTriangle,
  PlayCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
  Info,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Database,
  Lock,
  Award,
  Sliders,
  Compass,
  Zap,
  Globe2
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { HealthStatus } from '../types/health';

export default function HomePage() {
  // --- Section 5: NASA 5 Hazards State ---
  const [activeHazard, setActiveHazard] = useState(0);
  const hazards = [
    {
      id: 'radiation',
      title: 'Space Radiation',
      subtitle: 'Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE)',
      desc: 'Deep-space transit exposes astronauts to continuous penetrating ionizing radiation without Earth’s protective magnetosphere. Chronic accumulation increases long-term cancer risk and acute cardiovascular stress.',
      risk: 'Sub-lethal DNA damage, endothelial dysfunction, oxidative stress.',
      countermeasure: 'Real-time dosimeter telemetry integration, cumulative cruise dose forecasting, and protective storm shelter shelter-in-place alerts.',
      icon: Radio,
      badge: 'Cumulative 1.45 mSv/d'
    },
    {
      id: 'isolation',
      title: 'Isolation & Confinement',
      subtitle: 'Circadian Disruption & Behavioral Autonomy',
      desc: 'Six crew members living in a spacecraft volume the size of a shipping container for 1,000 days. Sleep desynchronization, sensory monotony, and interpersonal tension erode mission performance.',
      risk: 'Circadian drift, sleep fragmentation, acute fatigue, mood decrement.',
      countermeasure: 'Daily subjective Likert mood logging, sleep quality scoring, and automated behavioral support pacing.',
      icon: Moon,
      badge: 'Circadian Tracking'
    },
    {
      id: 'distance',
      title: 'Distance from Earth',
      subtitle: 'Communication Latency & Autonomous Triage',
      desc: 'At 140 million miles, light-speed communications delay reaches up to 22 minutes one-way. Earth Mission Control cannot provide real-time resuscitation guidance or immediate surgical consultation.',
      risk: 'Total dependence on on-board clinical diagnostic autonomy.',
      countermeasure: 'Offline-first edge rule engine, local AI synthesis, and store-and-forward asynchronous telemetry packet queues.',
      icon: Globe2,
      badge: '8–22 Min One-Way'
    },
    {
      id: 'gravity',
      title: 'Gravity Fields',
      subtitle: 'Microgravity Fluid Shifts & Musculoskeletal Atrophy',
      desc: 'Transitioning from 1G to 0G causes immediate cephalad fluid shifting (puffy-face syndrome, SANS eye pressure) followed by progressive bone demineralization and postural muscle degradation.',
      risk: 'Cardiovascular deconditioning, orthostatic intolerance, bone calcium loss.',
      countermeasure: 'Personalized resting heart rate baseline tracking, pneumatic cuff orthostatic assessment, and daily resistive exercise logging.',
      icon: Activity,
      badge: 'Cephalad Fluid Shift'
    },
    {
      id: 'environment',
      title: 'Hostile Closed Environments',
      subtitle: 'Atmospheric Balance & Acoustic Load',
      desc: 'The habitat ecosystem must continuously recycle air and water. Ambient CO2 fluctuations, high continuous acoustic fan decibels, and airborne particulate accumulation challenge crew homeostasis.',
      risk: 'CO2-induced headaches, cognitive slowing, skin irritation, mucosal dryness.',
      countermeasure: 'Multi-parameter symptom correlation, core/skin thermal flux checks, and environmental cross-referencing.',
      icon: Gauge,
      badge: 'Closed-Loop Life Support'
    }
  ];

  // --- Section 7: Interactive Baseline Widget State ---
  const [userBaselineRHR, setUserBaselineRHR] = useState(62);
  const [userCurrentRHR, setUserCurrentRHR] = useState(74);
  const [userBaselineSleep, setUserBaselineSleep] = useState(7.2);
  const [userRecentSleep, setUserRecentSleep] = useState(5.4);

  const rhrDeltaPercent = Math.round(((userCurrentRHR - userBaselineRHR) / userBaselineRHR) * 100);
  const sleepDeltaHours = (userRecentSleep - userBaselineSleep).toFixed(1);

  // Compute status based on personal baseline vs generic 60-100 population average
  const rhrStatus = rhrDeltaPercent > 15 ? 'yellow' : rhrDeltaPercent > 25 ? 'red' : 'green';
  const genericStatus = userCurrentRHR <= 100 && userCurrentRHR >= 60 ? 'green' : 'yellow';

  // --- Section 8: Core Capabilities Tabs ---
  const [activeCapabilityTab, setActiveCapabilityTab] = useState(0);
  const capabilities = [
    {
      title: 'Adaptive Baseline Engine',
      tagline: 'Personalized Norms Over Population Averages',
      summary: 'Every astronaut has a unique autonomic signature. An Olympic-caliber pilot may have a resting heart rate of 48 bpm, where 65 bpm already indicates acute stress. AAHMS calibrates all thresholds to a 60-day rolling personal baseline.',
      points: [
        'Eliminates clinical false positives and missed subtle degradations',
        'Dynamic multi-day exponential rolling smoothing',
        'Automatic tolerance bands calibrated to individual spaceflight history'
      ]
    },
    {
      title: 'Clinical AI & Explainable Telemetry',
      tagline: 'Transparent Reasoning via FastAPI Backend',
      summary: 'Astronauts and flight surgeons require auditable clinical logic. Our multi-layer architecture uses local deterministic clinical rules for immediate on-device triage, while detailed narrative syntheses are generated through our connected FastAPI backend powered by Gemini models.',
      points: [
        'Deterministic rule triggers evaluate instantly on this device',
        'Detailed AI narratives powered by Gemini through the FastAPI backend',
        'Automatic offline fallback with pre-computed rule summaries when unlinked'
      ]
    },
    {
      title: 'Offline-First & Resilient Store-and-Forward',
      tagline: 'Full Functionality During Telemetry Blackouts',
      summary: 'Deep space missions cannot depend on a cloud connection. AAHMS executes 100% locally on spacecraft avionics, caching telemetry in indexed local storage and dispatching compact micro-packets during DSN uplink windows.',
      points: [
        'Zero cloud dependency for daily logging, triage, and trend analysis',
        'Encrypted local cryptographic store with salted Web Crypto tokens',
        'Asynchronous uplink synchronizer handles 22-minute light delay'
      ]
    }
  ];

  // --- Section 9: Body Map Hotspot State ---
  const [activeHotspot, setActiveHotspot] = useState<'brain' | 'heart' | 'muscle' | 'radiation'>('heart');
  const hotspots = {
    brain: {
      name: 'Neurological & Ocular (SANS)',
      effects: 'Cephalad venous congestion elevates intracranial pressure, causing optic disc edema, hyperopic shifts, and subjective sleep fragmentation.',
      telemetry: 'Sleep efficiency: 71% · SANS vision acuity check · Mood scale: 3/5'
    },
    heart: {
      name: 'Cardiovascular & Autonomic Regulation',
      effects: 'Microgravity eliminates hydrostatic pressure gradients, causing central hypovolemia and compensatory autonomic sympathetic tone elevation.',
      telemetry: 'Resting HR: 74 bpm (+19.4% vs baseline) · HRV (rMSSD): 34 ms (-22.7%)'
    },
    muscle: {
      name: 'Musculoskeletal & Postural Core',
      effects: 'Without 1G axial loading, soleus/gastrocnemius volume degrades rapidly without rigorous countermeasure exercise.',
      telemetry: 'ARED resistive adherence: 94% · Sol 90 workout: Upper body resistance done'
    },
    radiation: {
      name: 'Whole-Body Radiation Dosimetry',
      effects: 'Galactic cosmic ray heavy ions produce continuous whole-body ionizing track structure damage across hematopoietic and epithelial tissues.',
      telemetry: 'Daily dose: 1.45 mSv/d · Sol 90 cumulative: 130.5 mSv (Reference: 600 mSv)'
    }
  };

  // --- Section 10: Sol 90 Scenario Stepper State ---
  const [selectedSolStep, setSelectedSolStep] = useState(4);
  const solSteps = [
    { sol: 'Sol 85', title: 'Nominal Baseline Cruise', status: 'green', desc: 'Sleep duration 7.1h, resting HR 62 bpm, HRV 45ms. All 10 physiological indicators within nominal personal calibration limits.' },
    { sol: 'Sol 87', title: 'Sleep Compression Begins', status: 'green', desc: 'Critical orbital maintenance and acoustic alarm testing in Node 2 reduces nocturnal sleep to 5.6 hours. Autonomic indicators begin subtle compensatory drift.' },
    { sol: 'Sol 88', title: 'Cumulative Fatigue & HRV Drop', status: 'yellow', desc: 'Second consecutive night under 5.5 hours. Resting heart rate increases to 69 bpm; HRV drops 18% below personal baseline. System registers early warning flag.' },
    { sol: 'Sol 89', title: 'Deep Space Link Intermittent', status: 'yellow', desc: 'Solar storm activity creates intermittent DSN packet loss. AAHMS falls back smoothly to offline cached baseline without interruption to crew monitoring.' },
    { sol: 'Sol 90', title: 'Current State: Proactive Countermeasure', status: 'yellow', desc: 'Resting HR reaches 74 bpm (+19.4%). Sleep debt hits 4.2h over 72h. AAHMS generates explainable advisory recommending 45-min sleep opportunity and hydration before scheduled EVA.' }
  ];

  // --- Section 14: FAQ Accordion State ---
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: 'Why does AAHMS use personalized baselines instead of standard medical ranges?',
      a: 'In clinical medicine, standard reference ranges (like 60–100 bpm for heart rate) are based on large terrestrial populations. However, astronaut baseline physiology is heavily conditioned: an astronaut with a baseline resting pulse of 52 bpm is already experiencing significant physiological strain at 72 bpm, yet a generic monitor would report everything as normal. AAHMS benchmarks each astronaut against their own pre-mission and rolling in-flight norms.'
    },
    {
      q: 'How does AAHMS function during deep-space communication blackouts?',
      a: 'AAHMS is engineered from the ground up as an offline-first system. All telemetry ingestion, time-series anomaly detection, body map correlation, and preliminary clinical guidance execute locally on spacecraft avionics without internet access. When deep-space telemetry windows open, updates are batched into compact store-and-forward packets.'
    },
    {
      q: 'Does AAHMS replace NASA flight surgeons?',
      a: 'No. AAHMS is designed as an autonomous decision-support tool that empowers the crew during communication delays while keeping Earth-based flight surgeons fully informed. It acts as an intelligent flight medical assistant that catches trends early, recommends non-invasive operational countermeasures, and structures data for physician review.'
    },
    {
      q: 'How does Gemini AI integrate with AAHMS, and what happens when offline?',
      a: 'Gemini health explanations are processed through our connected FastAPI backend service (POST /api/v1/health/ai-explanation). When the backend connection is active, it generates contextual syntheses incorporating multi-sol telemetry. When offline or disconnected, AAHMS falls back smoothly to deterministic, pre-computed rule summaries so the crew never encounters a broken interface.'
    },
    {
      q: 'What is the background of this project for NASA Space Apps 2026?',
      a: 'This project directly addresses the 2026 NASA Space Apps Challenge topic: "Create Health Monitoring Software for Astronauts on Space Missions". It translates published NASA Human Research Program (HRP) evidence-based findings and spaceflight standards (NASA-STD-3001) into an operational prototype for long-duration human exploration to Mars.'
    }
  ];

  const allTenIndicators = [
    { name: 'Sleep Duration & Architecture', unit: 'hours', icon: Moon, note: 'Polysomnography & actigraphy' },
    { name: 'Resting Heart Rate', unit: 'bpm', icon: Heart, note: 'Continuous nocturnal pulse sensor' },
    { name: 'Heart Rate Variability (rMSSD)', unit: 'ms', icon: Activity, note: 'Autonomic nervous recovery tone' },
    { name: 'Blood Pressure', unit: 'mmHg', icon: Gauge, note: 'Pneumatic oscillometric flight cuff' },
    { name: 'Core & Skin Temperature', unit: '°C', icon: Thermometer, note: 'Dual-sensor thermal flux sensor' },
    { name: 'Subjective Mood & Cognitive State', unit: '1-5 scale', icon: Smile, note: 'Standardized Likert assessment' },
    { name: 'Energy, Stamina & Fatigue', unit: '1-5 scale', icon: BatteryMedium, note: 'Daily subjective exertion log' },
    { name: 'Capillary Blood Glucose', unit: 'mg/dL', icon: Droplets, note: 'Manual flight cartridge assay' },
    { name: 'Radiation Dosimetry', unit: 'mSv/day', icon: Radio, note: 'GCR & solar particle dosimeter' },
    { name: 'Exercise Countermeasure Adherence', unit: 'minutes', icon: Dumbbell, note: 'ARED & T2 treadmill protocols' }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-[#172A2B] overflow-x-hidden">
      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D9E2DE] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[#176B68] text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
              <Activity size={20} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#172A2B] block leading-tight">
                AAHMS
              </span>
              <span className="text-[10px] tracking-wider text-[#60716E] uppercase font-semibold block">
                NASA Space Apps 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#60716E]">
            <a href="#overview" className="hover:text-[#176B68] transition-colors">Overview</a>
            <a href="#hazards" className="hover:text-[#176B68] transition-colors">5 Hazards</a>
            <a href="#capabilities" className="hover:text-[#176B68] transition-colors">Capabilities</a>
            <a href="#mars-scenario" className="hover:text-[#176B68] transition-colors">Sol 90 Mars</a>
            <a href="#challenge" className="hover:text-[#176B68] transition-colors">Challenge</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-lg border border-[#D9E2DE] text-xs font-semibold text-[#172A2B] hover:bg-[#F4F6F4] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 rounded-lg bg-[#176B68] hover:bg-[#135754] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>Get started</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="relative py-12 sm:py-20 border-b border-[#D9E2DE] overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DCEDEA]/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEDEA] text-[#176B68] text-xs font-semibold">
                <HeartPulse size={14} className="stroke-[2.5]" />
                <span>NASA Space Apps Challenge 2026 · Autonomous Health Monitoring</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172A2B] tracking-tight leading-[1.15]">
                Autonomous Astronaut Health Monitoring for Deep-Space Exploration.
              </h1>

              <p className="text-base sm:text-lg text-[#60716E] leading-relaxed max-w-2xl font-normal">
                An offline-first, baseline-calibrated medical intelligence platform engineered for long-duration interplanetary transit where Earth mission control is up to 22 light-minutes away.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/app"
                  className="px-6 py-3.5 rounded-xl bg-[#176B68] text-white text-sm font-bold hover:bg-[#135754] transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Sol 90 Interactive Demo</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="#capabilities"
                  className="px-5 py-3.5 rounded-xl bg-white border border-[#D9E2DE] text-[#172A2B] text-sm font-semibold hover:bg-[#F4F6F4] transition-all flex items-center gap-2"
                >
                  <span>Explore Architecture</span>
                  <ChevronDown size={16} className="text-[#60716E]" />
                </a>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-[#60716E]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#247A55] animate-pulse" />
                  <span className="font-medium text-[#172A2B]">Sol 90 Mars Transit Scenario Active</span>
                </div>
                <span>·</span>
                <span>CDR-01 Telemetry Online</span>
              </div>
            </div>

            {/* Hero Right: Live Floating Component Preview Card */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl border border-[#D9E2DE] p-6 shadow-xl space-y-4 relative"
              >
                {/* Header of preview card */}
                <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
                  <div>
                    <span className="text-xs text-[#60716E] font-medium">Flight Status Telemetry</span>
                    <h3 className="text-base font-bold text-[#172A2B]">Mission Sol 90 · Mars Transit</h3>
                  </div>
                  <StatusBadge status="yellow" size="sm" />
                </div>

                {/* Live indicators preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#60716E]">
                      <span className="flex items-center gap-1 font-medium">
                        <Heart size={13} className="text-[#176B68]" />
                        Resting HR
                      </span>
                      <span className="text-[10px] font-bold text-[#A96617] bg-[#FBF0D9] px-1.5 py-0.2 rounded">+19%</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-[#172A2B] tabular-data">74</span>
                      <span className="text-xs text-[#60716E]">bpm</span>
                    </div>
                    <p className="text-[10px] text-[#60716E]">Personal baseline: 62 bpm</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#60716E]">
                      <span className="flex items-center gap-1 font-medium">
                        <Moon size={13} className="text-[#176B68]" />
                        Sleep (Sol 89)
                      </span>
                      <span className="text-[10px] font-bold text-[#A96617] bg-[#FBF0D9] px-1.5 py-0.2 rounded">-28%</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-[#172A2B] tabular-data">5.2</span>
                      <span className="text-xs text-[#60716E]">hrs</span>
                    </div>
                    <p className="text-[10px] text-[#60716E]">Personal baseline: 7.2 hrs</p>
                  </div>
                </div>

                {/* Simulated AI explanation bubble */}
                <div className="p-3.5 rounded-xl bg-[#DCEDEA]/50 border border-[#B6D6D0] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B68]">
                    <Sparkles size={14} />
                    <span>Gemini Health Assistant Synthesis:</span>
                  </div>
                  <p className="text-xs text-[#172A2B] leading-relaxed">
                    Cumulative 4.2h sleep debt over 72 hours has triggered compensatory sympathetic elevation (+12 bpm). Advisory countermeasure recommended before scheduled EVA.
                  </p>
                </div>

                {/* Footer status link */}
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#60716E] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#176B68]" />
                    <span>DSN Link: 14m latency</span>
                  </span>
                  <Link href="/app" className="font-bold text-[#176B68] hover:underline flex items-center gap-1">
                    <span>Inspect Dashboard</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION STAT STRIP (4 METRICS) */}
      <section className="bg-white border-b border-[#D9E2DE] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#D9E2DE]">
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#176B68] tabular-data">10 Measures</p>
              <p className="text-xs text-[#60716E] mt-1 font-medium">Supported Physiological Indicators</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tabular-data">&lt; 60 s</p>
              <p className="text-xs text-[#60716E] mt-1 font-medium">Fast Daily Check-In Workflow</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tabular-data">3 Status Levels</p>
              <p className="text-xs text-[#60716E] mt-1 font-medium">Green, Yellow &amp; Red Triage</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#247A55] tabular-data">Offline-First</p>
              <p className="text-xs text-[#60716E] mt-1 font-medium">Local Logging On This Device</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE DEEP-SPACE PROBLEM SPLIT (LEO vs DEEP SPACE) */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              Mission Context Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
              Why Low-Earth Orbit Paradigms Break Down in Deep Space.
            </h2>
            <p className="text-sm sm:text-base text-[#60716E] leading-relaxed">
              Medical protocols developed on the International Space Station assume instant communications, rapid Earth evacuation, and continuous supply chains. Deep space demands total clinical self-sufficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEO / ISS Card */}
            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#EAF0ED] text-[#172A2B] flex items-center justify-center font-bold text-xs">
                    ISS
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#172A2B]">Low Earth Orbit (LEO)</h3>
                    <span className="text-xs text-[#60716E]">International Space Station Model</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[#EAF0ED] text-[#60716E] font-medium">Earth-Reliant</span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#60716E]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#60716E] shrink-0 mt-0.5" />
                  <span><strong>Distance:</strong> 250 miles above Earth (inside Van Allen magnetic shield)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#60716E] shrink-0 mt-0.5" />
                  <span><strong>Communication:</strong> Instantaneous 2-way audio, video & real-time telemetry</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#60716E] shrink-0 mt-0.5" />
                  <span><strong>Medical Support:</strong> 24/7 dedicated flight surgeon console in Houston/Munich</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#60716E] shrink-0 mt-0.5" />
                  <span><strong>Emergency Return:</strong> Soyus/Crew Dragon de-orbit abort in under 3 hours</span>
                </li>
              </ul>
            </div>

            {/* Mars Transit Card */}
            <div className="bg-white rounded-2xl border-2 border-[#176B68] p-6 sm:p-8 space-y-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#176B68] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-lg">
                AAHMS Operational Scope
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#DCEDEA] text-[#176B68] flex items-center justify-center font-bold text-xs">
                    MARS
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#172A2B]">Deep-Space Mars Transit</h3>
                    <span className="text-xs text-[#176B68] font-semibold">1,000-Day Exploration Mission</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[#172A2B]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#176B68] shrink-0 mt-0.5" />
                  <span><strong>Distance:</strong> Up to 140 million miles (unshielded interplanetary space)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#176B68] shrink-0 mt-0.5" />
                  <span><strong>Communication:</strong> 8 to 22 minutes one-way delay (impossible for live dialogue)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#176B68] shrink-0 mt-0.5" />
                  <span><strong>Medical Support:</strong> Crew Medical Officer must manage triage autonomously</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#176B68] shrink-0 mt-0.5" />
                  <span><strong>Emergency Return:</strong> Zero abort capability once transit trajectory is ignited</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NASA'S 5 HUMAN SPACEFLIGHT HAZARDS (INTERACTIVE TABS) */}
      <section id="hazards" className="py-16 sm:py-20 border-b border-[#D9E2DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              NASA Human Research Program (HRP)
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
              Engineering Against the 5 Hazards of Human Spaceflight.
            </h2>
            <p className="text-sm sm:text-base text-[#60716E]">
              NASA classifies long-duration exploration risks into five distinct hazards. AAHMS provides continuous digital countermeasures for each.
            </p>
          </div>

          {/* Hazard Tab Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#D9E2DE] pb-4">
            {hazards.map((h, i) => {
              const Icon = h.icon;
              const isActive = activeHazard === i;
              return (
                <button
                  key={h.id}
                  onClick={() => setActiveHazard(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#176B68] text-white shadow-xs'
                      : 'bg-[#F4F6F4] text-[#60716E] hover:text-[#172A2B] hover:bg-[#EAF0ED]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{h.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Hazard Card */}
          <div className="bg-[#F4F6F4] rounded-2xl border border-[#D9E2DE] p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9E2DE]">
              <div>
                <span className="text-xs font-bold text-[#176B68] uppercase tracking-wider">Hazard Classification</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#172A2B] mt-0.5">
                  {hazards[activeHazard].title}
                </h3>
                <p className="text-xs text-[#60716E] mt-0.5">{hazards[activeHazard].subtitle}</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#DCEDEA] text-[#176B68] self-start sm:self-auto">
                {hazards[activeHazard].badge}
              </span>
            </div>

            <p className="text-sm text-[#172A2B] leading-relaxed mt-4">
              {hazards[activeHazard].desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-white border border-[#D9E2DE] space-y-1.5">
                <span className="text-xs font-bold text-[#A96617]">Physiological & Psychological Risk</span>
                <p className="text-xs text-[#172A2B] leading-relaxed">
                  {hazards[activeHazard].risk}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#D9E2DE] space-y-1.5">
                <span className="text-xs font-bold text-[#176B68]">AAHMS Software Countermeasure</span>
                <p className="text-xs text-[#172A2B] leading-relaxed">
                  {hazards[activeHazard].countermeasure}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW AAHMS WORKS: 4-STEP ANIMATED TIMELINE */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
              How AAHMS Operates: The 4-Stage Autonomous Pipeline.
            </h2>
            <p className="text-sm sm:text-base text-[#60716E]">
              From pre-flight baseline profiling to real-time offline triage and asynchronous mission control synchronization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCEDEA] text-[#176B68] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Baseline Calibration</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                60-day pre-launch and early cruise profiling establishes rolling individual tolerances for resting HR, HRV, sleep structure, and blood pressure.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCEDEA] text-[#176B68] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Multi-Modal Logging</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Continuous wearable telemetry streams merge with guided daily astronaut check-ins (sleep hours, Likert mood, physical symptoms, and exercise).
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCEDEA] text-[#176B68] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Local Edge Inference</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Deterministic rule engine pairs with edge AI to detect subtle downward trajectories, isolating acute fatigue and cardiac drift before clinical impairment.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#DCEDEA] text-[#176B68] flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Autonomous Triage</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Generates explainable operational countermeasures for the crew, while bundling high-priority compressed telemetry for Earth DSN uplink windows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE PERSONAL BASELINE WIDGET (MICRO-APP) */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              Live Interactive Engine Demonstration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tracking-tight">
              Test the Adaptive Baseline Engine in Real Time.
            </h2>
            <p className="text-sm text-[#60716E] max-w-2xl mx-auto leading-relaxed">
              Standard medical dashboards use fixed population averages (60–100 bpm) that miss dangerous personal deviations. Adjust the sliders below to see how AAHMS calculates personalized clinical alerts.
            </p>
          </div>

          {/* Interactive Widget Box */}
          <div className="bg-[#F4F6F4] rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sliders Column */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#172A2B] mb-2">
                    <span>Astronaut Personal Baseline RHR</span>
                    <span className="text-[#176B68] font-mono text-sm">{userBaselineRHR} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="48"
                    max="78"
                    value={userBaselineRHR}
                    onChange={(e) => setUserBaselineRHR(Number(e.target.value))}
                    className="w-full accent-[#176B68] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#60716E] mt-1">
                    <span>48 bpm (Athletic pilot)</span>
                    <span>78 bpm (Higher baseline)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#172A2B] mb-2">
                    <span>Observed In-Flight Heart Rate</span>
                    <span className="text-[#172A2B] font-mono text-sm">{userCurrentRHR} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={userCurrentRHR}
                    onChange={(e) => setUserCurrentRHR(Number(e.target.value))}
                    className="w-full accent-[#176B68] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#60716E] mt-1">
                    <span>50 bpm</span>
                    <span>95 bpm (Significant tachycardia)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D9E2DE]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#172A2B] mb-2">
                    <span>Recent 3-Sol Sleep Average</span>
                    <span className="text-[#176B68] font-mono text-sm">{userRecentSleep} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="8.5"
                    step="0.1"
                    value={userRecentSleep}
                    onChange={(e) => setUserRecentSleep(Number(e.target.value))}
                    className="w-full accent-[#176B68] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#60716E] mt-1">
                    <span>4.0 hrs (Severe debt)</span>
                    <span>8.5 hrs (Full recovery)</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Outcome Comparison Column */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#172A2B]">AAHMS Baseline Model</span>
                    <StatusBadge status={rhrStatus} size="sm" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#172A2B]">
                      {rhrDeltaPercent > 0 ? `+${rhrDeltaPercent}%` : `${rhrDeltaPercent}%`}
                    </span>
                    <span className="text-xs text-[#60716E]">deviation from rolling baseline</span>
                  </div>
                  <p className="text-xs text-[#172A2B] leading-relaxed">
                    {rhrStatus === 'green' && 'Nominal autonomic tone. No physiological countermeasure required.'}
                    {rhrStatus === 'yellow' && 'Early autonomic strain detected. AAHMS triggers sleep & hydration advisory.'}
                    {rhrStatus === 'red' && 'Acute baseline divergence (>25%). Rest protocol & flight surgeon packet flagged.'}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#D9E2DE] p-4 space-y-2 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#60716E]">Generic Hospital Bracket (60–100 bpm)</span>
                    <StatusBadge status={genericStatus} size="sm" />
                  </div>
                  <p className="text-xs text-[#60716E] leading-relaxed">
                    {genericStatus === 'green'
                      ? `At ${userCurrentRHR} bpm, a generic monitor reports "Normal" because it falls within standard 60–100 bpm, completely missing that this astronaut is +${rhrDeltaPercent}% above their personal baseline!`
                      : `Generic threshold triggered only after extreme deviation (${userCurrentRHR} bpm), losing days of early preventative warning.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CORE CAPABILITIES (3-TAB SHOWCASE) */}
      <section id="capabilities" className="py-16 sm:py-20 border-b border-[#D9E2DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
              Three Pillars of Autonomous Deep-Space Health.
            </h2>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center border-b border-[#D9E2DE]">
            <div className="inline-flex gap-2 pb-2 overflow-x-auto max-w-full">
              {capabilities.map((c, i) => (
                <button
                  key={c.title}
                  onClick={() => setActiveCapabilityTab(i)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeCapabilityTab === i
                      ? 'bg-[#176B68] text-white shadow-xs'
                      : 'text-[#60716E] hover:text-[#172A2B]'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-10 max-w-4xl mx-auto shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold text-[#176B68] uppercase tracking-wider">
                {capabilities[activeCapabilityTab].tagline}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#172A2B] mt-1">
                {capabilities[activeCapabilityTab].title}
              </h3>
              <p className="text-sm text-[#60716E] mt-3 leading-relaxed">
                {capabilities[activeCapabilityTab].summary}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#172A2B] uppercase tracking-wider">Key Technical Attributes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {capabilities[activeCapabilityTab].points.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] text-xs text-[#172A2B] font-medium leading-relaxed">
                    {pt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE ANATOMICAL BODY MAP TEASER */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
                Physiological Spatial Mapping
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
                Interactive Anatomical Body Map.
              </h2>
              <p className="text-sm sm:text-base text-[#60716E] leading-relaxed">
                Rather than reviewing isolated numbers on a spreadsheet, astronauts can visually inspect physiological systems affected by microgravity, cephalad fluid shifts, and space radiation.
              </p>

              {/* Hotspot Pills */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#172A2B]">Select an anatomical system to inspect:</p>
                <div className="flex flex-wrap gap-2">
                  {(['heart', 'brain', 'muscle', 'radiation'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveHotspot(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                        activeHotspot === key
                          ? 'bg-[#176B68] text-white shadow-xs'
                          : 'bg-[#F4F6F4] text-[#60716E] hover:text-[#172A2B]'
                      }`}
                    >
                      {hotspots[key].name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Hotspot Preview */}
              <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-2">
                <h4 className="text-xs font-bold text-[#172A2B]">{hotspots[activeHotspot].name}</h4>
                <p className="text-xs text-[#60716E] leading-relaxed">{hotspots[activeHotspot].effects}</p>
                <div className="text-[11px] font-mono text-[#176B68] pt-1 border-t border-[#D9E2DE]">
                  {hotspots[activeHotspot].telemetry}
                </div>
              </div>

              <div>
                <Link
                  href="/app/body-map"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all shadow-xs"
                >
                  <span>Launch Full Interactive Body Map</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-[#122B31] rounded-2xl overflow-hidden p-6 flex flex-col justify-between text-white shadow-lg">
                <div className="flex items-center justify-between text-xs text-[#A2BEB9]">
                  <span className="font-mono">ANATOMICAL SCAN // SOL 90</span>
                  <span className="px-2 py-0.5 rounded bg-[#176B68] text-white text-[10px] font-bold">ACTIVE</span>
                </div>

                {/* Body Silhouette SVG Illustration */}
                <div className="relative flex items-center justify-center my-auto">
                  <svg viewBox="0 0 200 300" className="w-48 h-64 text-[#A2BEB9]/40 stroke-current fill-none stroke-2">
                    {/* Head */}
                    <circle cx="100" cy="40" r="25" />
                    {/* Neck */}
                    <path d="M92 65 L92 80 M108 65 L108 80" />
                    {/* Torso */}
                    <path d="M70 85 L130 85 L120 180 L80 180 Z" />
                    {/* Arms */}
                    <path d="M70 85 L40 160 L45 220" />
                    <path d="M130 85 L160 160 L155 220" />
                    {/* Legs */}
                    <path d="M85 180 L80 280" />
                    <path d="M115 180 L120 280" />
                  </svg>

                  {/* Pulsing Hotspots */}
                  <div className={`absolute top-12 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all cursor-pointer ${
                    activeHotspot === 'brain' ? 'bg-[#176B68] ring-4 ring-[#84C2B4]/50 scale-125' : 'bg-white/40'
                  }`} onClick={() => setActiveHotspot('brain')} title="Brain / SANS" />

                  <div className={`absolute top-24 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all cursor-pointer ${
                    activeHotspot === 'heart' ? 'bg-[#A96617] ring-4 ring-[#F5C2B8]/50 scale-125' : 'bg-white/40'
                  }`} onClick={() => setActiveHotspot('heart')} title="Heart / Cardiovascular" />

                  <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full transition-all cursor-pointer ${
                    activeHotspot === 'muscle' ? 'bg-[#176B68] ring-4 ring-[#84C2B4]/50 scale-125' : 'bg-white/40'
                  }`} onClick={() => setActiveHotspot('muscle')} title="Musculoskeletal / Legs" />
                </div>

                <div className="text-center text-[11px] text-[#A2BEB9]">
                  Click hotspots to inspect autonomic cardiovascular, ocular, and musculoskeletal stress
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. DAY 90 MARS TRANSIT SCENARIO TIMELINE */}
      <section id="mars-scenario" className="py-16 sm:py-20 border-b border-[#D9E2DE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              Mission Case Study
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tracking-tight">
              Day 90 Mars Transit: Telemetry Evolution Scrubber.
            </h2>
            <p className="text-sm text-[#60716E] max-w-2xl mx-auto">
              Follow how an astronaut’s physiological state subtly drifted from nominal baseline to early advisory status over six mission days.
            </p>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-5 gap-2 border-b border-[#D9E2DE] pb-4">
            {solSteps.map((s, idx) => (
              <button
                key={s.sol}
                onClick={() => setSelectedSolStep(idx)}
                className={`p-2.5 rounded-xl text-center transition-all cursor-pointer ${
                  selectedSolStep === idx
                    ? 'bg-[#176B68] text-white shadow-xs font-bold'
                    : 'bg-white text-[#60716E] hover:bg-[#F4F6F4] font-semibold'
                }`}
              >
                <div className="text-xs">{s.sol}</div>
                <div className="text-[10px] hidden sm:block truncate">{s.title.split(' ')[0]}</div>
              </button>
            ))}
          </div>

          {/* Active Step Card */}
          <div className="bg-white rounded-2xl border border-[#D9E2DE] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9E2DE]">
              <div>
                <span className="text-xs font-bold text-[#176B68]">{solSteps[selectedSolStep].sol} Operational Log</span>
                <h3 className="text-lg font-bold text-[#172A2B]">{solSteps[selectedSolStep].title}</h3>
              </div>
              <StatusBadge status={solSteps[selectedSolStep].status as HealthStatus} size="sm" />
            </div>

            <p className="text-sm text-[#172A2B] leading-relaxed">
              {solSteps[selectedSolStep].desc}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs text-[#60716E]">
              <span>Scenario Focus: Early autonomic intervention prevents task failure</span>
              <Link href="/app" className="font-bold text-[#176B68] hover:underline flex items-center gap-1">
                <span>Experience Sol 90 in Console</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. 10 TRACKED INDICATORS GRID */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              Full Telemetry Spectrum
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
              10 Physiological & Behavioral Indicators Tracked.
            </h2>
            <p className="text-sm text-[#60716E]">
              Calibrated to NASA Human Research Program flight countermeasure recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {allTenIndicators.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.name} className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-2 hover:border-[#176B68] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#176B68] flex items-center justify-center shadow-2xs">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#172A2B] line-clamp-1">{ind.name}</h3>
                    <span className="text-[11px] font-mono text-[#60716E]">{ind.unit}</span>
                  </div>
                  <p className="text-[11px] text-[#60716E] leading-tight pt-1 border-t border-[#D9E2DE]">
                    {ind.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. PROTOCOL ADHERENCE & CONSISTENCY TEASER */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#122B31] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-4 max-w-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-[#84C2B4] bg-[#176B68]/40 px-3 py-1 rounded-full border border-[#84C2B4]/30">
                Behavioral Habit Engineering
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Combatting Logging Fatigue Over Multi-Year Missions.
              </h2>
              <p className="text-sm text-[#A2BEB9] leading-relaxed">
                Astronauts experience survey fatigue when asked to enter repetitive health data. AAHMS incorporates non-punitive streak rewards, milestone insignias, and gamified adherence tracking that motivate complete Sol logging.
              </p>
              <div className="pt-2">
                <Link
                  href="/app/consistency"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B68] text-white text-xs font-bold hover:bg-[#135754] transition-all"
                >
                  <span>Explore Streak Mechanics</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-6 w-full max-w-xs space-y-4 text-center shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#176B68] text-white flex items-center justify-center mx-auto shadow-md">
                <Award size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-white">14 Sols</p>
                <p className="text-xs text-[#A2BEB9]">Current Active Check-in Streak</p>
              </div>
              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-[#A2BEB9]">
                <span>280 Total Points</span>
                <span className="text-[#84C2B4] font-bold">Level 3 Pilot</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. OFFLINE-FIRST ARCHITECTURE CALLOUT */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#176B68] flex items-center justify-center shadow-xs">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Edge Compute Native</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                All baseline divergence algorithms, threshold calculations, and interactive visualizations run entirely on the client without invoking external APIs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#176B68] flex items-center justify-center shadow-xs">
                <Database size={20} />
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Local Storage Caching</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Indexed telemetry records and check-ins persist safely in local browser storage, ensuring session permanence even during complete power cycles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F6F4] border border-[#D9E2DE] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#176B68] flex items-center justify-center shadow-xs">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-base text-[#172A2B]">Salted Web Crypto</h3>
              <p className="text-xs text-[#60716E] leading-relaxed">
                Crew authentication tokens are derived using Web Crypto SHA-256 with unique local salt generation, upholding aerospace cybersecurity standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="py-16 sm:py-20 border-b border-[#D9E2DE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#176B68] bg-[#DCEDEA] px-3 py-1 rounded-full">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172A2B] tracking-tight">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-white rounded-xl border border-[#D9E2DE] overflow-hidden transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#172A2B]">{f.q}</span>
                    <ChevronDown size={18} className={`text-[#60716E] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#60716E] leading-relaxed border-t border-[#D9E2DE]/50">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 15. TEAM & SPACE APPS CHALLENGE BLOCK */}
      <section id="challenge" className="py-16 sm:py-20 border-b border-[#D9E2DE] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCEDEA] text-[#176B68] text-xs font-bold">
            <Activity size={14} />
            <span>NASA Space Apps Challenge 2026</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#172A2B] tracking-tight">
            Built for Astronaut Autonomy on the Journey to Mars.
          </h2>

          <p className="text-sm sm:text-base text-[#60716E] max-w-3xl mx-auto leading-relaxed">
            AAHMS was architected for the 2026 NASA Space Apps Challenge under the topic <strong>“Create Health Monitoring Software for Astronauts on Space Missions.”</strong> Our cross-disciplinary engineering pairs aerospace physiology standards with high-resilience human factors design.
          </p>

          <div className="p-4 rounded-xl bg-[#F4F6F4] border border-[#D9E2DE] max-w-2xl mx-auto text-xs text-[#60716E] space-y-1">
            <p className="font-bold text-[#172A2B]">Operational Research Prototype</p>
            <p>
              Simulated telemetry models calibrated against NASA Human Research Program literature (MSL RAD transit radiation data, Barger et al. sleep studies, NASA Twins Study).
            </p>
          </div>
        </div>
      </section>

      {/* 16. FINAL LAUNCH CTA & 4-COLUMN FOOTER */}
      <section className="bg-[#122B31] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to explore the Sol 90 Mars transit console?
          </h2>
          <p className="text-sm sm:text-base text-[#A2BEB9] max-w-xl mx-auto">
            Experience the complete interactive dashboard, daily check-in logging, anatomical body map, and AI health synthesis.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#176B68] text-white font-bold text-sm hover:bg-[#135754] transition-all shadow-lg"
            >
              <span>Launch Sol 90 Mission Console</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 4-Column Footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pt-12 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[#A2BEB9]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#176B68] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-bold text-white text-sm">AAHMS</span>
            </div>
            <p className="leading-relaxed">
              Autonomous Astronaut Health Monitoring System for long-duration interplanetary spaceflight.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Mission Console</h4>
            <ul className="space-y-1.5">
              <li><Link href="/app" className="hover:text-white">Overview Dashboard</Link></li>
              <li><Link href="/app/body-map" className="hover:text-white">Anatomical Body Map</Link></li>
              <li><Link href="/app/check-in" className="hover:text-white">Daily Sol Check-in</Link></li>
              <li><Link href="/app/indicators" className="hover:text-white">10 Vitals & Metrics</Link></li>
              <li><Link href="/app/radiation" className="hover:text-white">Dosimetry Timeline</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Authentication</h4>
            <ul className="space-y-1.5">
              <li><Link href="/login" className="hover:text-white">Terminal Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white">Create Profile</Link></li>
              <li><Link href="/forgot-password" className="hover:text-white">Passcode Recovery</Link></li>
              <li><Link href="/demo" className="hover:text-white">Demo Scenarios</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">NASA Reference</h4>
            <ul className="space-y-1.5">
              <li><a href="https://www.spaceappschallenge.org" target="_blank" rel="noreferrer" className="hover:text-white">Space Apps Challenge 2026</a></li>
              <li><a href="https://www.nasa.gov/hrp" target="_blank" rel="noreferrer" className="hover:text-white">Human Research Program</a></li>
              <li><a href="https://images.nasa.gov" target="_blank" rel="noreferrer" className="hover:text-white">NASA Image Archives</a></li>
              <li><Link href="/about" className="hover:text-white">About & Disclaimers</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A2BEB9]/70 gap-2">
          <span>AAHMS Prototype · Developed for 2026 NASA Space Apps Challenge</span>
          <span>Not an FDA-cleared clinical medical device · Public domain NASA imagery</span>
        </div>
      </section>
    </div>
  );
}
