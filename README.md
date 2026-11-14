# 🚀 AstroTrack — Astronaut Health Monitoring System

> **NASA Space Apps Challenge 2026 · Challenge: Create Health Monitoring Software for Astronauts on Space Missions**

---

## 📖 What Is This Project? (Read This First — 2 Minutes)

Imagine you're an astronaut on a 3-year mission to Mars. There's no hospital. No doctor down the hall. The nearest flight surgeon is **225 million kilometers away**, and a message takes up to **22 minutes** to reach Earth.

On long missions, astronauts must **check their own health** — blood pressure, heart rate, sleep, mood, bone density, and more — and decide: *"Am I okay? Should I tell the crew? Should I take action now?"*

**AstroTrack** is the software that helps them do exactly that.

Think of it as a **fitness app + doctor's checklist + dashboard** designed for space. The astronaut:

1. **Enters health data** (typed numbers, clicks, or camera input)
2. **Sees it visualized** on an interactive human body map with color coding (🟢 normal, 🟡 watch, 🔴 act now)
3. **Gets plain-language guidance** — what the reading means, why it matters in space, and what to do next
4. **Tracks trends over time** with dynamic charts
5. **Earns points for completing health tasks** (gamification keeps them engaged)

### Why Does This Matter?

Long-duration spaceflight exposes astronauts to **NASA's Five Hazards of Human Spaceflight**:

| # | Hazard | Health Risk It Causes |
|---|--------|----------------------|
| 1 | ☢️ **Space Radiation** | Immune changes, cell damage |
| 2 | 🧘 **Isolation & Confinement** | Depression, sleep problems, mood changes |
| 3 | 📡 **Distance from Earth** | Can't rely on doctors — must self-assess |
| 4 | 🌍 **Gravity Fields** (microgravity/partial g) | Bone loss, muscle loss, cardiovascular deconditioning |
| 5 | 🏠 **Hostile Closed Environment** | Nutrition issues, infection risk, immune changes |

Our tool turns these risks into **measurable indicators** an astronaut can check anytime.

---

## 🎯 Project Goal

Build a **visual, easy-to-use health monitoring tool** that:

- ✅ Gathers health indicators (blood pressure, heart rate, blood sugar, body temperature, sleep hours, mood, and more)
- ✅ Helps astronauts **evaluate** their health status at a glance
- ✅ Provides **actionable guidance** on treatments and improvements
- ✅ Works for **different environments**: spacecraft, space station, rover, or planetary base
- ✅ Requires **no medical expertise** — the tool explains everything

---

## 🧩 Core Features

| Feature | Description |
|---------|-------------|
| **Interactive Body Map** | Clickable human figure — click a body part to see its health indicators and status |
| **Health Indicator Input** | Keyboard, mouse, and camera input for measurements |
| **Color-Coded Status** | 🟢 Normal / 🟡 Needs Attention / 🔴 Act Now — understandable in one glance |
| **Dynamic Charts** | Graphs showing each indicator's trend over time |
| **Smart Guidance** | Plain-language explanations: what the reading means, space-related risks, and recommended actions |
| **Mission Routine Prompts** | Reminds astronauts when it's time to take measurements or do health tasks |
| **Gamification** | Points, streaks, and badges for completing health check-ins |
| **Measurement Instructions** | Step-by-step "how to measure" guides for every indicator |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (React) + TypeScript + Tailwind CSS + Recharts (charts) |
| **Backend** | Python + FastAPI |
| **Database** | PostgreSQL (primary) + SQLite (local/offline fallback) |
| **Auth** | JWT-based astronaut profiles |
| **Deployment** | Vercel (frontend) + Render/Railway (backend) + Supabase/Neon (database) |

---

## 📚 NASA & Partner Resources We Use

These are the **required references** for the challenge. Every team member should skim at least the first two links.

### NASA Resources
- **[5 Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards/)** — The foundation of our health risk model
- **[Risks of Human Spaceflight](https://www.nasa.gov/hrp/risks/)** — Risk-to-indicator mapping
- **[Ongoing HRP Research in Space](https://www.nasa.gov/hrp/ongoing-hrp-research/)** — Scientific grounding

### Space Agency Partner Resources
- **[CSA: Monitoring Radiation for Astronaut Health](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)** — Radiation exposure tracking
- **[CSA: Why Do We Conduct Science Experiments in Space?](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)** — Context on space health research

> ⚠️ **These links must be listed in the final NASA Space Apps submission form** under "NASA Data" and "Space Agency Partner & Other Data."

---

## 📁 Repository Structure
astrotrack/
├── frontend/ # Next.js application
│ ├── app/
│ ├── components/
│ ├── lib/
│ └── public/
├── backend/ # FastAPI application
│ ├── app/
│ │ ├── main.py
│ │ ├── routers/
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── services/
│ │ └── core/
│ ├── tests/
│ └── requirements.txt
├── database/ # Migrations, seeds, ERD
│ ├── migrations/
│ ├── seeds/
│ └── ERD.md
├── docs/ # Design docs, API contract
├── docker-compose.yml
└── README.md # ← This file



---

## 🚦 Quick Start (For Developers)

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL 15+ (or Docker)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/your-team/astrotrack.git
cd astrotrack

2. Backend setup
bash

cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in DATABASE_URL and SECRET_KEY
uvicorn app.main:app --reload --port 8000

API docs available at http://localhost:8000/docs (FastAPI auto-generates Swagger UI).
3. Frontend setup
bash

cd frontend
npm install
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev

App available at http://localhost:3000.
4. Database setup
bash

cd database
psql -U postgres -c "CREATE DATABASE astrotrack;"
psql -U postgres -d astrotrack -f migrations/001_initial.sql
psql -U postgres -d astrotrack -f seeds/health_reference_ranges.sql

5. Or just use Docker 🐳
bash

docker-compose up --build

