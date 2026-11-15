# 🟢 AstroTrack Frontend Documentation & Design Guidelines

**System:** AstroTrack — Autonomous Astronaut Health Monitoring System (AAHMS)
**Technology Stack:** Next.js 16.4.6 (App Router), React 19.3.0, TypeScript, Tailwind CSS 4.3.3, Recharts, Lucide Icons
**Target Audience:** Frontend Engineers, UI/UX Designers, Product Leads, and Space Operations Crew
**Document Path:** `docs/frontend/frontend_guide.md` (Companion: `docs/frontend/README.md`)
**Core Mission:** Make astronaut health telemetry immediately understandable to an ordinary person with no medical or technical background — especially an exhausted astronaut operating under deep-space delay.

---

## Table of Contents

1. [Executive Philosophy: The 30-Second Rule](#1-executive-philosophy-the-30-second-rule)
2. [Plain-Language Communication Standards](#2-plain-language-communication-standards)
   - [Core Language Rules](#core-language-rules)
   - [Plain-English Translation Glossary](#plain-english-translation-glossary)
   - [The 7 Physiological Indicators in Plain English](#the-7-physiological-indicators-in-plain-english)
   - [Status Labels & Human Meanings](#status-labels--human-meanings)
3. [Dashboard Design Guidelines](#3-dashboard-design-guidelines)
   - [Visual Hierarchy & Layout Zones](#visual-hierarchy--layout-zones)
   - [Overall Mission Health Banner](#overall-mission-health-banner)
   - [Health Indicator Cards](#health-indicator-cards)
   - [Charts & Trend Visualizations](#charts--trend-visualizations)
   - [Warning & Critical Alert Treatments](#warning--critical-alert-treatments)
   - [Empty, Loading & Error States](#empty-loading--error-states)
   - [Information Density & Cognitive Load](#information-density--cognitive-load)
4. [Sidebar & Navigation Guidelines](#4-sidebar--navigation-guidelines)
   - [Information Architecture & Menu Grouping](#information-architecture--menu-grouping)
   - [Navigation Item Standards](#navigation-item-standards)
   - [Active State & Visual Feedback](#active-state--visual-feedback)
   - [Responsive Navigation (Desktop, Tablet, Mobile)](#responsive-navigation-desktop-tablet-mobile)
5. [Accessibility & Usability (WCAG 2.1 AA)](#5-accessibility--usability-wcag-21-aa)
   - [Dual-Coding: Never Rely on Color Alone](#dual-coding-never-rely-on-color-alone)
   - [Contrast & Typography Scale](#contrast--typography-scale)
   - [Interactive Targets & Keyboard Navigation](#interactive-targets--keyboard-navigation)
   - [Helpful Error & Validation Messaging](#helpful-error--validation-messaging)
6. [Design Consistency & Tokens](#6-design-consistency--tokens)
   - [Color Tokens & Roles](#color-tokens--roles)
   - [Typography Hierarchy](#typography-hierarchy)
   - [Spacing & 4px Baseline Grid](#spacing--4px-baseline-grid)
   - [Surfaces, Borders, Shadows & Radii](#surfaces-borders-shadows--radii)
   - [Buttons & Form Controls](#buttons--form-controls)
   - [Iconography Standards](#iconography-standards)
   - [Reusable Component Registry](#reusable-component-registry)
7. [Architecture, Types & API Integration](#7-architecture-types--api-integration)
   - [Dual-Mode Architecture (Demo vs. API)](#dual-mode-architecture-demo-vs-api)
   - [Backend API Contract & Schemas](#backend-api-contract--schemas)
   - [Distinguishing Existing Code vs. Proposed Improvements](#distinguishing-existing-code-vs-proposed-improvements)

---

## 1. Executive Philosophy: The 30-Second Rule

Astronauts on long-duration interplanetary missions (such as transit to Mars, Sol 90) work under extreme environmental stress: microgravity fluid shifts, cumulative sleep disruption, heavy physical countermeasure routines, and communication delays of up to 22 minutes to Earth ground medical teams.

> **The 30-Second Rule:**
> An exhausted crew member glancing at any AstroTrack screen must know **within 30 seconds**:
> 1. **Am I okay right now?** (Overall health condition)
> 2. **What changed, if anything?** (Specific metric and direction of change)
> 3. **What concrete action should I take next?** (Practical next step: drink water, rest 45 minutes, re-check reading, or contact crew doctor)

To achieve this:
- **No medical degrees required:** The UI must be as easy to read as a consumer fitness app or household weather report.
- **No mystery scores:** Never show an opaque aggregate "Health Index: 78/100" without explaining which factors influenced it.
- **No decorative fluff:** Strictly avoid unnecessary animations, gratuitous gradients, heavy glassmorphism, floating drop-shadows, or complex multi-layer nested menus. Prioritize calm clarity over visual gimmicks.

---

## 2. Plain-Language Communication Standards

### Core Language Rules

1. **Speak to a human, not an engineer or physician.**
   Write UI copy as if explaining health to a friend. Avoid clinical jargon, laboratory acronyms, and statistical terminology.
2. **Explain unfamiliar concepts immediately inline.**
   If an indicator or space-specific factor is shown (such as fluid shift or space fever), explain what it means in one plain sentence right next to it or in an accessible ⓘ info popup.
3. **Always pair every number with three things:**
   - The **plain name** of the metric.
   - The **unit of measurement** (e.g., `bpm`, `mmHg`, `°C`, `hours`).
   - A **one-sentence takeaway** answering *"Why should I care?"* and *"What does this mean for me right now?"*
4. **Spell out abbreviations on first use.**
   Replace technical shorthand with recognizable terms (`Resting Heart Rate` instead of `RHR`, `Millisieverts` or `Radiation Dose` instead of bare `mSv`, `Upper / Lower Blood Pressure` instead of unlabelled `Sys/Dia`).
5. **Focus on everyday symptoms and actions, not pathology.**
   Instead of diagnosing "Orthostatic intolerance secondary to hypovolemia", state: *"You may feel lightheaded when standing up because fluids have shifted in zero gravity. Drink 500 mL of electrolyte water and rest."*

### Plain-English Translation Glossary

Use this table across all dashboard cards, tooltips, guidance panels, and notifications:

| Complex / Medical / Technical Term | What It Actually Means | Recommended Plain-English Replacement |
| :--- | :--- | :--- |
| **"Baseline deviation: +2 SD"** | Value is higher than typical personal range | *"Your reading is higher than your usual level."* |
| **"Telemetry ingestion"** | Entering or receiving vitals | *"Health data" / "Record your reading"* |
| **"Anomalous reading"** | Measurement outside expected boundary | *"Unusual reading"* |
| **"Cephalic fluid redistribution"** | Bodily fluid moving up toward head in zero gravity | *"Fluid shifting toward your upper body"* |
| **"Baroreflex adaptation"** | Blood vessel tension adjusting to zero-g | *"Blood pressure adjusting to zero gravity"* |
| **"Circadian desynchrony"** | Disrupted sleep-wake body clock | *"Body clock rhythm disrupted"* |
| **"Cumulative sleep debt"** | Missing sleep across multiple days | *"Built-up lack of sleep"* |
| **"Oscillometric brachial cuff"** | Arm blood pressure strap | *"Arm blood pressure cuff"* |
| **"Continuous photoplethysmography"** | Heart rate optical sensor | *"Heart rate sensor"* |
| **"Non-diagnostic prototype"** | Prototype disclaimer | *"For health tracking, not medical diagnosis"* |
| **"Autonomic recovery deficit"** | Body is fatigued and needs recovery | *"Your body needs more rest to recharge"* |
| **"Operational countermeasure"** | Workout or self-care routine | *"Recommended exercise or rest routine"* |
| **"Radiation dosimetry accumulation"**| Total radiation absorbed so far | *"Total radiation exposure so far"* |
| **"Post-absorptive blood glucose"** | Blood sugar between meals | *"Blood sugar (between meals)"* |
| **"Nominal"** | Normal, within safe limits | *"Normal" / "Expected"* |
| **"Variance / Delta"** | Difference from normal baseline | *"Difference from your typical level"* |
| **"Tachycardia / Bradycardia"** | Fast / slow resting heart rate | *"Fast heart rate" / "Low heart rate"* |
| **"Pyrexia / Space fever"** | Higher body temperature in space | *"Elevated body temperature"* |

### The 7 Physiological Indicators in Plain English

Every indicator card, detail view, and reading form must follow this standardized plain-language template:

#### 1. Resting Heart Rate (`heart_rate`)
- **Plain Label:** Resting Heart Rate
- **Unit:** beats per minute (`bpm`)
- **What it measures:** How many times your heart beats in one minute while you are resting quietly.
- **Why you should care:** In zero gravity, blood and fluids shift toward your chest and head, meaning your heart does not have to work as hard against gravity. If your resting pulse rises, it is an early indicator of dehydration, physical fatigue, or stress.
- **Status Thresholds:**
  - 🟢 **Normal (60–100 bpm):** Your heart is beating comfortably at rest.
  - 🟡 **Watch (50–59 or 101–120 bpm):** Slightly high or low. Check your water intake and take a short rest break.
  - 🔴 **Act Now (<50 or >120 bpm):** Significantly outside your normal zone. Stop strenuous activity and contact the crew medical officer.

#### 2. Systolic Blood Pressure (`blood_pressure_systolic`)
- **Plain Label:** Blood Pressure (Upper Number)
- **Unit:** millimeters of mercury (`mmHg`)
- **What it measures:** The maximum pressure inside your blood vessels while your heart muscle pumps blood.
- **Why you should care:** Fluid shifts in space can increase pressure in your head and chest, causing headaches, sinus fullness, or puffy facial tissue.
- **Status Thresholds:**
  - 🟢 **Normal (90–120 mmHg):** Optimal pumping pressure.
  - 🟡 **Watch (80–89 or 121–139 mmHg):** Slightly outside typical range. Monitor for headaches and re-check after resting.
  - 🔴 **Act Now (<80 or ≥140 mmHg):** Blood pressure is unusually high or low. Alert flight support.

#### 3. Diastolic Blood Pressure (`blood_pressure_diastolic`)
- **Plain Label:** Blood Pressure (Lower Number)
- **Unit:** millimeters of mercury (`mmHg`)
- **What it measures:** The resting pressure inside your blood vessels between heartbeats.
- **Why you should care:** Shows how relaxed your blood vessels remain while resting as your circulatory system adapts to spaceflight.
- **Status Thresholds:**
  - 🟢 **Normal (60–80 mmHg):** Healthy resting vessel pressure.
  - 🟡 **Watch (50–59 or 81–89 mmHg):** Mild variance. Re-check reading after 15 minutes of rest.
  - 🔴 **Act Now (<50 or ≥90 mmHg):** Potential lightheadedness or excess pressure. Rest immediately.

#### 4. Body Temperature (`body_temp`)
- **Plain Label:** Core Body Temperature
- **Unit:** degrees Celsius (`°C`)
- **What it measures:** Your internal body heat.
- **Why you should care:** In an enclosed spacecraft cabin, air does not circulate naturally without gravity and sweat does not evaporate easily. Astronauts can develop mild "space fever" during heavy exercise, or an infection may be developing.
- **Status Thresholds:**
  - 🟢 **Normal (36.1°C – 37.2°C):** Healthy thermal equilibrium.
  - 🟡 **Watch (35.5°C – 36.0°C or 37.3°C – 37.9°C):** Slightly elevated warmth or feeling cold. Drink cool liquids and check cabin airflow.
  - 🔴 **Act Now (<35.5°C or ≥38.0°C):** High fever or hypothermia risk. Medical attention required.

#### 5. Blood Sugar (`blood_sugar`)
- **Plain Label:** Blood Sugar (Glucose)
- **Unit:** milligrams per deciliter (`mg/dL`)
- **What it measures:** The amount of energy (sugar) circulating in your blood.
- **Why you should care:** Spaceflight can change how your body processes nutrition and insulin. Low blood sugar makes you shaky, tired, and slow to react; high sugar indicates metabolic stress.
- **Status Thresholds:**
  - 🟢 **Normal (70–140 mg/dL):** Balanced, steady energy supply.
  - 🟡 **Watch (60–69 or 141–180 mg/dL):** Blood sugar is slightly low or running high. Have a nutritious snack or verify meal timing.
  - 🔴 **Act Now (<60 or >180 mg/dL):** Dangerously low or high. Immediate nutritional check required.

#### 6. Sleep Duration (`sleep_hours`)
- **Plain Label:** Sleep Duration
- **Unit:** hours (`hrs`)
- **What it measures:** How many hours of restful sleep you got during your last rest period.
- **Why you should care:** Spacecraft are noisy, cramped, and see 16 sunrises per day. Missing sleep impairs your reaction speed, clouds critical thinking, and weakens your immune system.
- **Status Thresholds:**
  - 🟢 **Normal (7.0 – 9.0 hours):** Full, restorative night of sleep.
  - 🟡 **Watch (5.5 – 6.9 hours):** Minor sleep debt accumulated. Plan a 30–45 minute recovery rest before critical tasks.
  - 🔴 **Act Now (<5.5 hours):** Severe sleep debt. High risk of cognitive mistakes. Do not perform EVA or complex docking tasks.

#### 7. Mood & Well-being Score (`mood_score`)
- **Plain Label:** Well-being & Mood Score
- **Unit:** score on a 1–10 scale (`1–10`)
- **What it measures:** Your daily self-reported level of mental energy, focus, and morale (1 = completely drained and stressed, 10 = calm, energetic, and fully focused).
- **Why you should care:** Confinement, isolation, and high workloads can lead to burnout. Tracking your mood helps catch emotional fatigue early before it affects team performance.
- **Status Thresholds:**
  - 🟢 **Normal (7–10):** High morale and mental resilience.
  - 🟡 **Watch (4–6):** Mild mental fatigue or feeling stressed. Take time for recreational downtime or chat with family/crew.
  - 🔴 **Act Now (1–3):** Severe distress or exhaustion. Contact psychological support.

### Status Labels & Human Meanings

Never display raw technical codes or bare colors without text. Every status label must have a clear human explanation:

| Status Code | Display Label | Accessible Icon | Human Meaning | What the User Should Do |
| :--- | :--- | :--- | :--- | :--- |
| `normal` | **Normal** | 🟢 CheckCircle2 | Everything is within your expected personal baseline and safe flight limits. | Continue your daily mission routine as scheduled. |
| `warning` | **Watch** | 🟡 AlertTriangle | A reading has drifted slightly away from your typical healthy baseline. | Pay attention. Read the suggested self-care tip (e.g. hydration, rest). |
| `critical`| **Act Now** | 🔴 AlertOctagon | A reading has moved significantly outside safe limits. | Pause non-essential tasks, review emergency guidance, and alert medical support. |
| `empty` / `unknown` | **No Data** | ⚪ HelpCircle | No measurement has been recorded yet for today's mission day. | Take a quick reading when convenient. |

---

## 3. Dashboard Design Guidelines

### Visual Hierarchy & Layout Zones

The main cockpit (`/dashboard`) must follow an orderly, vertical progression that respects the user's cognitive bandwidth:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Header Row: Sol / Mission Day, Crew Member Profile, Quick Actions   │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Mission Readiness Assessment Banner (Overall Health Status + Tip)   │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Key Physiological Indicators (Responsive Card Grid, 260px min-width)│
├────────────────────────────────────────────────────────────────────────┤
│ 4. Multi-Day Trajectory Analysis (Recharts Trend Chart with Bands)     │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Bottom Split: Today's Routine Checklist (2/3) + AI/Radiation (1/3)  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Header Row:** Displays mission context (`Sol 90 · Mars Transit`), crew identity (`Crew Member CDR-01`), and primary quick action buttons (`[+ Record Reading]` and `[Body Map]`).
2. **Mission Health Banner:** Top-level answer to *"Am I okay today?"*
3. **Indicator Card Grid:** Fast visual scan of all 7 vitals.
4. **Trajectory Chart:** Mid-range context showing 7-day, 30-day, or full mission trends.
5. **Action & Routine Split:** Daily tasks to complete, alongside AI summary and radiation tracking.

### Overall Mission Health Banner

- **Purpose:** Provide an unambiguous summary of the astronaut's overall state in one glance.
- **Card Structure:**
  - Header: `"Mission Readiness Assessment"` with mission day chip (`Sol 90`) and overall status badge (`Watch` in yellow or `Normal` in green).
  - Left column: **Recommended Next Step** (e.g., *"Schedule a 45-minute sleep recovery extension before scheduled EVA activity."*).
  - Right column: **Doctor / Ground Telemetry Status** (e.g., *"Ground Telemedicine Escalation: Not Required. Telemetry reflects cumulative operational fatigue rather than acute medical emergency."*) + Link to `[Explain Status with AI →]`.
- **Rule:** Never use alarming red borders unless overall status is truly `critical`. A `warning` state uses warm amber tinting (`bg-[#FEF8EC] border-[#F3DB9A]`), creating awareness without panic.

### Health Indicator Cards

Each indicator card must follow a strict, standardized layout:

```text
┌──────────────────────────────────────────────┐
│ [Heart Icon]  Resting Heart Rate  (ⓘ)  [Normal] │ ← Top row: Name, Info button, Status
├──────────────────────────────────────────────┤
│  74  bpm                                     │ ← Large value + unit
│  ──────/\/\/\────── (Sparkline)              │ ← Mini trend sparkline
│  Within your normal resting range.           │ ← 1-sentence plain takeaway
├──────────────────────────────────────────────┤
│  View 30-day trend                        →  │ ← Direct drill-down link
└──────────────────────────────────────────────┘
```

- **Dimensions & Responsive Grid:**
  ```css
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 20px;
  ```
- **Value Typography:** 28–32px monospace bold font (`font-mono font-extrabold text-[#172A2B]`).
- **Unit Placement:** Inline to the right of the value in 12–14px muted font (`text-[#60716E]`).
- **Sparkline:** SVG polyline 28px high showing recent points, colored by status.
- **Context Sentence:** Always present. Never leave an astronaut wondering if 74 bpm is good or bad.
- **Protocol Drawer (ⓘ Tooltip):** Clicking ⓘ toggles an accessible overlay drawer answering:
  - **What it is:** (1 plain sentence)
  - **Why in space:** (1 plain sentence)
  - **How to measure:** (1 plain sentence with device name)
  - Includes an explicit `[Dismiss Protocol]` close button.

### Charts & Trend Visualizations

Charts must turn raw numbers into clear, reassuring stories:

- **Library:** Recharts (`ResponsiveContainer`, `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ReferenceArea`).
- **Explicit Units & Titles:** Every chart must display the metric title, unit badge (e.g. `[bpm]`), and baseline explanation directly in the header.
- **Color Bands (Reference Areas):**
  - Shaded green area (`fill="#22c55e" fillOpacity={0.08}`) represents the astronaut's healthy personal baseline.
  - If a data point leaves the green band into the yellow zone, the visual relationship is immediately obvious without reading numbers.
- **Axes & Grids:**
  - Y-axis: Clear integer step labels with appropriate dynamic min/max padding (15% headroom).
  - X-axis: Clear Sol or date markers (`Sol 84`, `Sol 85`... `Sol 90`).
  - Grid: Subtle, dashed horizontal guides (`stroke="#E2E8F0" strokeDasharray="3 3"`).
- **Time Range Selectors:** Segmented controls for `7D`, `30D`, and `Mission`.
- **Accessible Table Toggle:** Every chart card must include a view switcher button allowing the user to toggle between graphical chart and accessible HTML table.

### Warning & Critical Alert Treatments

- **Subtle vs. Critical Urgency:**
  - **Watch Alerts (Yellow):** Background `#FBF0D9`, border `#EED8A7`, text `#8A520F`. Tone is calm and proactive.
  - **Critical Alerts (Red):** Background `#F9E7E5`, border `#F1BCB7`, text `#B33C3C`. Tone is direct and prioritizes crew safety.
- **Alert Anatomy:**
  1. Status Badge + Time elapsed (`"Triggered 2 hours ago"`).
  2. Clear Plain-English Title (`"Resting heart rate elevated during sleep"`).
  3. Why it happened (`"Your heart rate averaged 82 bpm over the last two nights, which is 12 bpm above your typical resting level."`).
  4. Suggested Actions (`"Drink 500 mL water"`, `"Take a 30-minute rest"`).
  5. One-click **Acknowledge** button to confirm the crew member has seen the advice.

### Empty, Loading & Error States

- **No Blank Screens:** Every component communicating with APIs or repositories must handle 3 fundamental states:
  - **Loading:** Render animated skeleton placeholder blocks matching the exact shape of cards and charts (`bg-[#EAF0ED] animate-pulse rounded-2xl`).
  - **Empty State:** When no telemetry exists, show a friendly illustration or icon, a clear plain message (`"No readings logged yet for Sol 90"`), and a primary call-to-action button (`[Record First Reading]`).
  - **Error State:** If an API call fails, explain the issue simply (`"Could not load latest telemetry. Your saved data remains safe on this device."`) with a `[Try Again]` button.
- **Offline / Degraded Link Indicator:** When deep-space communication is delayed or offline, show a subtle amber chip in the header:
  `[📻 Cached Sol 89 Data — Offline Mode Active]`.

### Information Density & Cognitive Load

- Avoid dashboard clutter. Keep maximum visible indicator cards to 7 core vitals.
- Secondary specialized tools (Radiation timeline, Exercise logs, Reaction tests) belong in dedicated views linked cleanly from the dashboard, not crammed into the main cockpit.
- Spacing must breathe: maintain 16px to 24px padding within cards and 20px gap between layout blocks.

---

## 4. Sidebar & Navigation Guidelines

### Information Architecture & Menu Grouping

The sidebar groups application destinations into three logical, recognizable categories:

```text
MONITOR (Daily Core)
├── Dashboard        (/dashboard)       → Main cockpit view
├── Record Reading   (/readings/new)    → Data entry with live evaluation
├── Trends           (/app/trends)      → Longitudinal vital analytics
└── Alerts           (/app/alerts)      → Active advisories & acknowledgements

EXPLORE (Context & Environment)
├── Body Map         (/body-map)        → Interactive anatomical zone explorer
├── Radiation        (/app/radiation)   → Cumulative dosimetry & shelter status
├── Exercise         (/app/exercise)    → ARED resistive & treadmill countermeasure logs
└── Guides           (/app/guides)      → Plain-language self-assessment protocols

TOOLS (Support & Crew Utilities)
├── AI Explanation   (/app/ai-explanation) → Gemini clinical reasoning & self-care
├── Manual Records   (/app/records)     → Raw historical log book
├── Consistency      (/app/consistency) → Daily streaks, points, and mission badges
└── Reaction Test    (/app/reaction-test)  → Psychomotor vigilance test
```

### Navigation Item Standards

- **Item Height:** 36px (`h-9`) with 8px horizontal padding (`px-2.5`).
- **Icons:** Standard 18px Lucide icon placed on the left.
- **Labels:** Title case, max 2 words (e.g., `Record Reading`, `Body Map`).
- **Badges:**
  - Count badges for active alerts: Amber pill showing number of unread alerts (`bg-[#FBF0D9] text-[#8A520F]`).
  - Contextual tags: e.g., `"Gemini"` tag on AI Explanation (`bg-[#DCEDEA] text-[#176B68]`).
  - Status badges: `"New"` or `"Done"`.

### Active State & Visual Feedback

- **Active Link:** Solid brand background (`bg-[#176B68] text-white font-semibold shadow-xs`). The icon turns white.
- **Inactive Link:** Clean dark ink (`text-[#172A2B] font-medium hover:bg-[#EAF0ED] hover:text-[#176B68]`).
- **Sub-Route Matching:** If the current path is `/readings/new`, the `Record Reading` nav item is marked active.

### Responsive Navigation (Desktop, Tablet, Mobile)

AstroTrack must work reliably across spacecraft laptops, bulkhead-mounted tablets, and handheld devices:

1. **Desktop / Large Screens (≥1024px):**
   - Fixed full-height sidebar (`w-[260px]`).
   - Collapsible to compact 72px icon rail with collapse toggle button (`<` / `>`).
   - Collapsed rail displays tooltip on hover and keeps badge counters visible.
2. **Tablet Screens (768px – 1023px):**
   - Sidebar defaults to collapsed 72px rail to preserve main content width.
   - Touching the top menu toggle expands a drawer overlay.
3. **Mobile Screens (<768px):**
   - Fixed bottom tab bar (`BottomTabBar`) with 5 primary thumb-reachable targets:
     - `Dashboard`
     - `Record`
     - `Body Map`
     - `Alerts` (with badge counter)
     - `More` (opens a slide-up drawer containing Explore and Tools links).
   - Top bar contains a hamburger button triggering a full mobile navigation drawer.
   - All interactive touch targets are at least 44×44px.

---

## 5. Accessibility & Usability (WCAG 2.1 AA)

### Dual-Coding: Never Rely on Color Alone

Color vision deficiencies and low-light cockpit environments make color-only status dangerous. Every health status indicator must use **three simultaneous cues**:

```text
Status: Warning
├── 1. Color:   Warm amber (#eab308 background / border)
├── 2. Shape:   AlertTriangle icon
└── 3. Text:    Explicit label "Watch"
```

In charts, do not rely on line color alone: use distinct line patterns (solid for current reading, dashed for baseline) and text tooltips specifying status explicitly.

### Contrast & Typography Scale

- **Contrast Ratios:**
  - Main body text (`#172A2B`) on canvas (`#F4F6F4`) or surface (`#FFFFFF`) exceeds **12:1** (far surpassing the WCAG AA 4.5:1 requirement).
  - Status badges use dark accessible text on tinted backgrounds (never light text on light backgrounds):
    - Green badge: text `#247A55` on `#E4F2E9` (contrast > 5.5:1).
    - Yellow badge: text `#8A520F` on `#FBF0D9` (contrast > 6.0:1).
    - Red badge: text `#B33C3C` on `#F9E7E5` (contrast > 5.2:1).
- **Minimum Font Sizes:**
  - Body text: minimum 14px (`text-sm`), preferred 16px (`text-base`).
  - Monospace telemetry numbers: 28px to 36px.
  - Micro-labels and tags: minimum 11px to 12px (`text-xs`), never smaller than 10px.

### Interactive Targets & Keyboard Navigation

- **Touch Target Size:** Buttons, form inputs, and navigation links must provide at least 40×40px (desktop) and 44×44px (mobile/tablet) clickable area.
- **Focus Indicators:** Every focusable element must have a clear focus ring:
  ```css
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176B68] focus-visible:ring-offset-2
  ```
- **Modal & Dialog Accessibility:**
  - Info protocol drawers and popups must include `role="dialog"`, `aria-modal="true"`, and an accessible title (`aria-labelledby`).
  - Users must be able to close drawers using the `Escape` key or an explicit visible close button (`X`).

### Helpful Error & Validation Messaging

- When entering a new reading in `/readings/new`, show real-time input guidance:
  - Display expected unit inline inside the input box (`bpm`, `mmHg`, `°C`).
  - If a number is outside physiological range (e.g., Heart Rate = 280), explain why in plain language:
    - ❌ Poor: *"Invalid input: value > MAX_SAFE_INT"*
    - ✅ Good: *"Heart rate cannot be higher than 220 bpm. Please double-check your reading."*
- Form submit buttons must clearly state what will happen:
  `[Save Reading & View Status]` instead of bare `[Submit]`.

---

## 6. Design Consistency & Tokens

### Color Tokens & Roles

AstroTrack uses a calm, clinical space palette inspired by NASA cockpit displays and modern healthcare interfaces:

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| `--canvas` | `#F4F6F4` | App background canvas (calm, low-glare off-white) |
| `--surface` | `#FFFFFF` | Card surfaces, modals, top bar, sidebar |
| `--surface-alt`| `#F8FAFC` | Secondary panel backgrounds, table headers |
| `--main` / `--ink` | `#172A2B` | Primary headings, values, and strong text |
| `--muted` / `--ink-muted` | `#60716E` | Secondary descriptions, units, timestamps, borders |
| `--border` / `--line` | `#D9E2DE` | Subtle card borders, dividers, table borders |
| `--brand` | `#176B68` | Primary interactive brand color (deep space teal) |
| `--brand-hover` | `#125553` | Button hover and active state |
| `--brand-soft` | `#DCEDEA` | Brand tinted tag backgrounds, active pills |
| `--status-normal` | `#22c55e` | Status normal green |
| `--normal-bg` | `#E4F2E9` | Normal badge background |
| `--normal-text` | `#247A55` | Normal badge accessible dark green text |
| `--status-warning` | `#eab308` | Status warning / watch amber |
| `--warning-bg` | `#FBF0D9` | Warning badge background |
| `--warning-text` | `#8A520F` | Warning badge accessible dark amber text |
| `--status-critical` | `#ef4444` | Status critical / act now red |
| `--critical-bg` | `#F9E7E5` | Critical badge background |
| `--critical-text` | `#B33C3C` | Critical badge accessible dark red text |
| `--status-empty` | `#6b7280` | Gray for no data / unknown |
| `--empty-bg` | `#EEF1F0` | Gray badge background |
| `--empty-text` | `#556865` | Gray badge accessible text |

*Dark mode support is defined via CSS variables in `src/app/globals.css` using `[data-theme="dark"]` overrides.*

### Typography Hierarchy

- **Font Stack:** Clean, legible sans-serif system font stack (`Inter`, `Geist Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`).
- **Telemetry Numbers Font:** Monospaced font (`Geist Mono`, `JetBrains Mono`, `Consolas`, `monospace`) so numbers align vertically and do not jitter when values update.
- **Hierarchy Scale:**
  - Page Title: `text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172A2B]`
  - Section Header: `text-lg sm:text-xl font-bold text-[#172A2B]`
  - Card Metric Value: `text-3xl font-extrabold font-mono text-[#172A2B]`
  - Body Copy: `text-sm leading-relaxed text-[#172A2B]`
  - Secondary / Supporting: `text-xs text-[#60716E]`
  - Smallest Label / Badge: `text-[11px] font-bold`

### Spacing & 4px Baseline Grid

Stick strictly to multiples of 4px using Tailwind classes:

- `gap-1` (4px), `gap-2` (8px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px).
- Card padding: `p-4 sm:p-5` for standard cards, `p-6` for major overview banners.
- Space between major page sections: `space-y-6` (24px).

### Surfaces, Borders, Shadows & Radii

- **Card Border:** `border border-[#D9E2DE]`
- **Corner Radii:**
  - Buttons, inputs, small badges: `rounded-lg` (8px) or `rounded-xl` (12px).
  - Cards, panels, modals: `rounded-2xl` (16px).
- **Shadows:** Minimal and soft. Use Tailwind `shadow-xs` or `shadow-sm`. Avoid heavy floating dropshadows or 3D skeuomorphism.
- **Hover Transitions:** `hover:border-[#176B68]/40 hover:shadow-md transition-all duration-150`.

### Buttons & Form Controls

- **Primary Action Button:**
  `bg-[#176B68] text-white hover:bg-[#125553] font-bold text-sm px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2`
- **Secondary / Ghost Button:**
  `bg-white hover:bg-[#F4F6F4] text-[#172A2B] border border-[#D9E2DE] font-bold text-sm px-4 py-2 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2`
- **Danger / Destructive Action:**
  `text-[#60716E] hover:text-[#B33C3C] hover:bg-[#F9E7E5] rounded-lg transition-colors p-2`
- **Inputs:**
  `bg-white border border-[#D9E2DE] rounded-xl px-3.5 py-2.5 text-sm text-[#172A2B] focus:border-[#176B68] focus:ring-1 focus:ring-[#176B68]`

### Iconography Standards

- **Icon Set:** Lucide React (`lucide-react`).
- **Sizing:**
  - Button and badge icons: 14px to 16px.
  - Section header icons: 18px to 20px.
  - Main hero / empty state icons: 32px to 48px.
- **Consistency Rule:** Always pair an icon with a text label or an `aria-label` attribute. Do not invent custom floating icons when a standard Lucide icon exists.

### Reusable Component Registry

When building or updating pages, use existing shared components rather than re-creating UI:

1. **`StatusBadge`** (`src/components/ui/StatusBadge.tsx`):
   - Standardized status chip supporting `compact` and `full` variants, displaying color, icon, and label.
2. **`IndicatorCard`** (`src/components/health/IndicatorCard.tsx`):
   - Reusable card rendering latest vital measurement, trend arrow, baseline diff, and status badge.
3. **`TrendChart`** (`src/components/charts/TrendChart.tsx`):
   - Recharts-based multi-day line chart with baseline band shading, dynamic Y domains, time range toggles, and table view switcher.
4. **`RoutineList`** (`src/components/RoutineList.tsx`):
   - Interactive daily checklist component with points, streak counter, and mission completion badges.
5. **`GuidancePanel`** (`src/components/GuidancePanel.tsx`):
   - Structured guidance display showing Title, Space Context Explanation, Practical Action, and NASA/CSA citation.
6. **`BodyMapInteractive`** (`src/components/body/BodyMapInteractive.tsx`):
   - Interactive anatomical zone selector linking body zones to physiological indicators.
7. **`AppShell`** (`src/components/layout/AppShell.tsx`):
   - Responsive layout container wrapping `SidebarNavigation`, `TopBar`, and `BottomTabBar`.

---

## 7. Architecture, Types & API Integration

### Dual-Mode Architecture (Demo vs. API)

AstroTrack operates in two distinct operational environments:

```text
                    ┌─────────────────────────┐
                    │ AstroTrack Next.js App  │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
  [Demo Mode (Offline)]                      [Live API Mode]
  NEXT_PUBLIC_USE_API=false                  NEXT_PUBLIC_USE_API=true
  • 100% offline-ready                       • Centralized in src/lib/api.ts
  • PBKDF2 local salted auth                 • JWT Bearer Auth in localStorage
  • Sol 90 canned telemetry scenarios       • FastAPI endpoints (/api/*)
```

- **Demo Mode:** Allows offline testing and exhibition presentations without requiring a running PostgreSQL or FastAPI server.
- **Live API Mode:** Connects to the team's FastAPI backend using JWT tokens and REST endpoints.

### Backend API Contract & Schemas

All frontend types in `src/lib/types.ts` must align with the backend FastAPI Pydantic models:

```typescript
// src/lib/types.ts
export type Status = "normal" | "warning" | "critical";

export type Indicator =
  | "heart_rate"
  | "blood_pressure_systolic"
  | "blood_pressure_diastolic"
  | "body_temp"
  | "blood_sugar"
  | "sleep_hours"
  | "mood_score";

export interface Reading {
  indicator: Indicator;
  value: number;
  unit: string;
  status: Status;
  measured_at: string; // ISO 8601 UTC
  message: string;
}

export interface NewReading {
  indicator: Indicator;
  value: number;
  unit?: string;
  measured_at?: string;
}

export interface DashboardSummary {
  overall_status: Status;
  mission_day?: number;
  astronaut_id?: string;
  astronaut?: {
    name?: string;
    role?: string;
    mission_day?: number;
  };
  disclaimer?: string;
  pending_tasks_count?: number;
  indicators: Array<{
    indicator: Indicator;
    name: string;
    value: number;
    latest_value?: number;
    unit: string;
    status: Status;
    trend: "up" | "down" | "stable";
    trend_7d?: number[];
    reason?: string;
    message?: string;
    mode?: "baseline" | "reference";
    measured_at?: string;
  }>;
}

export interface GuidanceData {
  title: string;
  explanation: string;
  action: string;
  citation: string;
  citation_url?: string;
}
```

### Distinguishing Existing Code vs. Proposed Improvements

To maintain engineering clarity, the team distinguishes what is **currently implemented** from **proposed design improvements**:

| Feature / Area | Currently Implemented in Code | Proposed / Documented Guideline |
| :--- | :--- | :--- |
| **Indicator Tooltip Drawer** | Implemented with clinical explanations (`"Frequency of cardiac contractions..."`) | **Guideline:** Replace clinical copy with plain-English definitions, space reasons, and measurement instructions. |
| **Status Labels** | Short badges (`Normal`, `Watch`, `Act now`) present | **Guideline:** Ensure every badge always pairs color + icon + text across all screens without exception. |
| **Chart Accessibility** | Recharts graphic line chart with baseline bands | **Guideline:** Preserve accessible table view toggle button (`<Table />`) for screen readers. |
| **Dashboard Layout** | Single unified page with header, assessment banner, indicator grid, trend chart, and routine split | **Guideline:** Standardize card heights and 260px min-width grid across all views. |
| **Navigation** | Responsive sidebar with 3 groups (`Monitor`, `Explore`, `Tools`) + bottom mobile bar | **Guideline:** Maintain 3 groups; ensure labels remain simple, recognizable, and free of medical jargon. |
| **Error Handling** | Basic try/catch with fallback text | **Guideline:** Implement friendly, actionable error cards explaining that data is saved locally offline. |

---

*Summary rule for all AstroTrack frontend contributors:*
**Keep it simple. Keep it calm. Explain every number. An astronaut's life and focus depend on clear, effortless communication.** 🚀🛰️
