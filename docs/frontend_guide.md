# 🟢 Frontend Team Guidelines — Next.js

**Mission:** Build a beautiful, intuitive dashboard an exhausted astronaut can use in 30 seconds.

---

## 📌 Your Responsibilities
- Login/profile screens
- Dashboard with all health indicators + color status
- Interactive body map
- Data entry forms (with validation + units shown)
- Trend charts (Recharts)
- Guidance panel
- Routine/task prompts + gamification UI

---

## 📁 Structure to Follow

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Landing
│   ├── login/page.tsx
│   ├── dashboard/page.tsx        # Main view
│   ├── readings/
│   │   ├── new/page.tsx          # Data entry
│   │   └── [indicator]/page.tsx  # Trend chart per indicator
│   └── body-map/page.tsx         # Interactive figure
├── components/
│   ├── BodyMap.tsx
│   ├── IndicatorCard.tsx
│   ├── StatusBadge.tsx
│   ├── TrendChart.tsx
│   ├── GuidancePanel.tsx
│   └── RoutineList.tsx
├── lib/
│   ├── api.ts                    # API client (fetch wrapper)
│   ├── types.ts                  # Shared TS types (match backend schemas!)
│   └── colors.ts                 # Status → color mapping
└── public/
```

---

## 🎨 Design Principles

1. **Color = meaning.** Follow this everywhere, no exceptions:
   - 🟢 `#22c55e` → normal
   - 🟡 `#eab308` → warning
   - 🔴 `#ef4444` → critical
   - ⚪ gray → no data yet
2. **Big, readable type.** Astronauts may be tired, stressed, or on a small screen. Body text ≥ 16px.
3. **One screen, one job.** Dashboard shows status. Entry page enters data. Don't mix.
4. **Never show a number without context.** "Heart rate: 104 bpm" → add "🟡 Slightly high — monitor."
5. **Explain everything.** Every indicator has an ⓘ tooltip: what it is, why it matters in space, how to measure it.
6. **Dark theme first.** Spacecraft cockpits, low light, long shifts.
7. **Loading + empty + error states for every API call.** No blank screens.
8. **Mobile-responsive.** Assume a tablet in a spacecraft.

---

## 🔗 API Integration Rules

- All calls go through `lib/api.ts` — **never** call `fetch` directly in components.
- Define TypeScript types in `lib/types.ts` that **exactly match** backend Pydantic schemas. Update together.
- Use `NEXT_PUBLIC_API_URL` env variable — never hardcode `localhost`.
- Handle token storage (localStorage or httpOnly cookie — team decision, document it).

Example API client:

```typescript
// lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL;

export async function submitReading(data: NewReading) {
  const res = await fetch(`${API}/api/readings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## 📐 Shared Types (Must Match Backend)

```typescript
// lib/types.ts
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
  measured_at: string;   // ISO 8601 UTC
  message: string;
}
```

---

## 🎨 Color Mapping

```typescript
// lib/colors.ts
import type { Status } from "./types";

export const STATUS_COLORS: Record<Status | "empty", string> = {
  normal:   "#22c55e",   // green
  warning:  "#eab308",   // yellow
  critical: "#ef4444",   // red
  empty:    "#6b7280",   // gray
};

export const STATUS_LABEL: Record<Status | "empty", string> = {
  normal:   "🟢 Normal",
  warning:  "🟡 Watch",
  critical: "🔴 Act Now",
  empty:    "⚪ No Data",
};
```

---

## ✅ Frontend Rules

1. Components in `PascalCase.tsx`; files are small and single-purpose.
2. No inline hex colors — use `lib/colors.ts` + Tailwind tokens.
3. Every chart must show **units** and **time range**.
4. Test the build: `npm run build` must pass before every commit.
5. Commit messages: `feat(dashboard): add indicator cards with status colors`.

---

## 🧩 Key Screens

### Dashboard
- Grid of indicator cards (value + status color + sparkline)
- Body map thumbnail
- Today's routine tasks
- Quick "Add Reading" button

### Body Map
- SVG human figure
- Click body part → side panel with indicators for that part
- Colors follow status
- Tooltip on hover with indicator name

### Data Entry
- Big inputs with units shown inline (e.g., `bpm`, `mmHg`, `°C`)
- Validation (min/max ranges)
- Show evaluation result **before** submit
- Big "Submit" button
- Success toast after save

### Trend Chart
- Time range selector (7d / 30d / all)
- Line chart per indicator
- Horizontal bands: green / yellow / red zones
- Tooltip shows value + status + time

### Guidance Panel
- Appears after submitting a reading
- Title (e.g., "Your heart rate is slightly elevated")
- Explanation (what it means in space context)
- Action (what to do next)
- Citation link to NASA/CSA source

### Routine / Gamification
- Today's checklist of health tasks
- Points + streak counter
- Badges (7-day streak, 30 readings, etc.)

---

## 🧪 Testing

- Manually test every screen: empty, loading, error, success
- Verify `npm run build` locally before pushing
- Test on tablet-sized screen (768×1024)
- Check dark mode contrast (WCAG AA target)

---

## 🚀 Deploy

- Vercel (free) — connect GitHub repo
- Env var: `NEXT_PUBLIC_API_URL` → your deployed backend URL
- Preview deploys enabled per PR (useful for quick reviews)

---

## 🛟 Common Pitfalls

| Problem | Fix |
|---------|-----|
| CORS error on API call | Backend must whitelist frontend URL in CORS config |
| `undefined` reading values | Check types match backend response — log the raw JSON |
| Charts not rendering | Recharts needs explicit width/height or a `ResponsiveContainer` |
| Token lost on refresh | Store in `localStorage` and rehydrate on mount |
| Colors inconsistent | Never use raw hex — always import from `lib/colors.ts` |
| Build fails on Vercel | Check env vars are set in Vercel dashboard, not just `.env.local` |

---

## 📦 Recommended Packages

```bash
npm install recharts
npm install clsx tailwind-merge       # for conditional classes
npm install lucide-react              # icons
npm install zod                       # form validation
```

---

## 🔗 Links

- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Recharts:** [https://recharts.org](https://recharts.org)
- **Lucide Icons:** [https://lucide.dev](https://lucide.dev)

---

*Frontend mission: make health data feel simple, calm, and clear — even 225 million km from Earth.* 🌍🛰️
