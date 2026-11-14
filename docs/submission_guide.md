# 📤 Submission Guide — Manager / Submission Owner

**Mission:** Get the project submitted on time, complete, English-only, and with every link publicly accessible. **Saving is not submitting** — you must click **"Submit for Judging."**

---

## ⏰ Key Times

| Event | Time |
|-------|------|
| Submission opens | **Saturday, Nov 14, 9:00 a.m.** (local time of your Local Event) |
| Submission closes | **Sunday, Nov 15, 11:59 p.m.** (local time of your Local Event) |
| Deadline action | Click **"Submit for Judging"** before close |
| Certificates available | After submission — Profile → Participant Information |

> ⚠️ **Universal Event teams:** Same dates, but deadlines follow the **Team Owner's** local time zone. Local judging times may differ — check with your Local Lead.

---

## 🚪 Accessing Your Project Page

1. Click profile icon (top right) → **My Team**
2. Go to the **Project** tab *(only visible after Nov 14, 9:00 a.m. local)*
3. Click blue **Edit** button

### Editing Rules
- 💾 Click **Save Progress** often — you can save unlimited times
- 🔒 Toggle the **Lock** to ON while editing so teammates don't overwrite you
- 🧠 The Lock can be removed by teammates — stay in communication
- 👀 Saved changes are visible to your team only until you submit

---

## 📝 Form Field Instructions

### Project Name
Give your project a title that describes what you built.

**Example:**
> AstroTrack: Self-Service Health Monitoring for Deep Space Crews

---

### High-Level Project Summary (50–200 words suggested, max 1500 chars)

Answer:
- What did you develop?
- How does it address the challenge?
- Why is it important?

**Draft (adapt & shorten):**
> AstroTrack is a self-service health monitoring dashboard built for long-duration space missions. Astronauts log indicators such as heart rate, blood pressure, blood sugar, body temperature, sleep, and mood via keyboard, touch, or camera input. An interactive human body map shows each indicator's status with instant color coding — green (normal), yellow (watch), red (act now) — while dynamic charts reveal trends over time. Every reading comes with plain-language guidance: what it means, why it matters in space, and what action to take. A gamified routine system keeps crew engaged with check-ins. AstroTrack addresses NASA's five hazards of human spaceflight and reduces the burden of self-assessment when the nearest flight surgeon is minutes-to-hours away.

---

### Project Demonstration (public link required)

**Format:**
- 🎬 Video: **30 seconds or less**, OR
- 📊 Slide deck: **maximum 7 slides** (including title and intro slides)

**Hosting:**
- YouTube, Google Drive, GitHub, OneDrive, Dropbox, or similar
- Link must work **without login, password, or permission request**

**Test before submitting:**
- Open the link in an **incognito browser** or send to a teammate to confirm

**Language:**
- Video: any language, but **English subtitles required**
- Slides: must be in **English**

**If exceeded limits:** Not eligible for Global Awards.

---

### Project Link (public link required)

Where judges can access the final project. Options:
- Live website
- GitHub repo
- Cloud-hosted demo
- YouTube walkthrough
- Google Drive / Dropbox / OneDrive folder

**Rules:**
- No password, permission, or registration required
- Must be publicly accessible
- Format as full URL, e.g., `https://github.com/your-team/astrotrack`

**Website tip:** If you built a new website, request a [FortiGuard Web Filter Classification](https://fortiguard.com/webfilter) to ensure judges can reach it.
- Category: education / personal website / reference / web-based application
- Company Name: N/A

---

### Project Details

Answer these questions:

- **What does it do / how does it work?**
- **What benefits does it have?**
- **What is the intended impact?**
- **What tools, coding languages, hardware, or software did you use?**
- **How is your project creative?**
- **What factors did your team consider?**

**Starter draft (adapt):**

> **What it does:** AstroTrack lets astronauts self-monitor their health during long missions. They enter indicators (heart rate, blood pressure, blood sugar, body temperature, sleep, mood) via keyboard, touch, or camera. The app evaluates each reading and displays status with a color-coded interactive body map and dynamic trend charts.
>
> **How it works:** The Next.js frontend communicates with a FastAPI backend. When a reading is submitted, the backend's evaluation engine classifies it as normal / warning / critical against data-driven reference ranges stored in PostgreSQL. Guidance text (grounded in NASA HRP and CSA resources) is returned and displayed with a recommended action and a citation.
>
> **Benefits:** Reduces the burden of self-assessment on astronauts, surfaces trends before they become emergencies, keeps crew engaged via gamification, and works offline for deep-space scenarios.
>
> **Impact:** Directly supports NASA's Artemis and future Mars missions by giving crews an intuitive, scientifically grounded tool when the nearest flight surgeon is 22 light-minutes away.
>
> **Tools:** Next.js, TypeScript, Tailwind CSS, Recharts (frontend); Python, FastAPI, SQLAlchemy, Pydantic (backend); PostgreSQL (database); JWT (auth); Vercel + Render (deployment).
>
> **Creativity:** Clickable body map instead of flat lists; gamified routines to combat isolation; plain-language guidance for non-medical users.
>
> **Factors considered:** Offline-first design, accessibility (large type, high contrast), clear color coding, and every health claim backed by a NASA or Space Agency Partner source.

---

### Use of Super Intelligence (SI)

**This is a required field** (for data collection — not shown to judges, but judges *will see* SI-generated indicators in your project).

**Allowed:** Chatbots, LLMs, foundation models, image generation — to accelerate work.

**Not allowed:** Using SI to come up with your core idea.

**Never:** Use NASA logos, flags, or mission identifiers in SI-generated content.

**Disclosure requirements:**
- 🖼️ **Images and videos:** visible watermark marking SI generation
- 🔊 **Audio:** acknowledged in descriptive text + metadata
- 💻 **Code and data:** acknowledged in descriptive text + metadata

**Options to select:**
- ☑️ Chatbot / LLM for code assistance
- ☑️ Chatbot / LLM for documentation
- ☑️ Image generation (with watermark)
- ☑️ Other (specify)
- ☐ I did not use SI

**Draft disclosure text (adapt):**
> We used a large language model (chatbot) to assist with code scaffolding, README drafting, and UI copy suggestions. All SI-generated content was reviewed and adapted by the team. No NASA logos, flags, or mission identifiers were generated or used. No SI-generated images were included in the final project.

---

### NASA Data (required for Global Award eligibility)

Use the **Add New Link** button. **Link Text** = resource name, **Link URL** = full URL.

**Required links (from our challenge resources):**
- `5 Hazards of Human Spaceflight` → `https://www.nasa.gov/hrp/hazards/`
- `Risks of Human Spaceflight` → `https://www.nasa.gov/hrp/risks/`
- `Ongoing HRP Research in Space` → `https://www.nasa.gov/hrp/ongoing-hrp-research/`

> ⚠️ Missing or broken NASA data links = **not eligible for Global Awards.**

---

### Space Agency Partner & Other Data

List all other resources used (data, code, images, libraries — even if open source).

**Space Agency Partner links used:**
- `CSA: Monitoring Radiation for Astronaut Health` → `https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp`
- `CSA: Why Do We Conduct Science Experiments in Space?` → `https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp`

**Tools and libraries (add each as its own link):**
- Next.js → `https://nextjs.org`
- FastAPI → `https://fastapi.tiangolo.com`
- Recharts → `https://recharts.org`
- PostgreSQL → `https://www.postgresql.org`
- Tailwind CSS → `https://tailwindcss.com`
- Lucide Icons → `https://lucide.dev`
- *(Add anything else — stock icons, fonts, tutorials you followed, etc.)*

> ⚠️ **If you used copyrighted material, confirm you have permission** (e.g., a free-license font, an open-source library with a permissive license). If you didn't list it, don't use it.

---

## ✅ Pre-Submit Checklist

### Content
- [ ] Project Name is clear and descriptive
- [ ] Summary is 50–200 words and explains what / how / why
- [ ] Demo link is public (tested in incognito)
- [ ] Project link is public (tested in incognito)
- [ ] Details answer all 6 guiding questions
- [ ] SI disclosure filled — matches what's actually in the project
- [ ] SI-generated images have visible watermarks
- [ ] SI-generated audio noted in text + metadata
- [ ] SI-generated code/data noted in descriptive text
- [ ] NASA Data links added (all 3)
- [ ] Space Agency Partner links added (CSA links)
- [ ] All libraries/tools listed

### Quality
- [ ] All content is in **English**
- [ ] No copyrighted music, images, or text without permission
- [ ] No images or likeness of anyone **under 18** in the demo or project
- [ ] No NASA branding (logos, flags, mission identifiers) in SI content
- [ ] Demo ≤ **30 seconds** OR ≤ **7 slides** (title + intro included)

### Team & Eligibility
- [ ] All team members confirmed at the **same Local Event**
- [ ] If anyone was waitlisted — Local Lead has accepted them

---

## 🎬 Demo Storyboard — 30-Second Video

| Timestamp | Content |
|-----------|---------|
| **[0:00–0:02]** | Introduce yourself + team name |
| **[0:02–0:05]** | The challenge: Mars is far; astronauts must self-assess |
| **[0:05–0:10]** | Project name + tagline (short, punchy) |
| **[0:10–0:20]** | Live demo: enter reading → see color → body map → trend chart → guidance |
| **[0:20–0:25]** | Mention NASA + CSA resources used |
| **[0:25–0:30]** | Future vision: rover missions, planetary bases |

### Video Rules
- Must be ≤ 30 seconds
- Add **English subtitles** if not spoken in English
- Upload to YouTube (public/unlisted-with-link, **not private**), Drive, GitHub, etc.
- Test the link in incognito

---

## 📊 Demo Storyboard — 7-Slide Deck

| Slide | Content |
|-------|---------|
| 1 | Title slide — project name + tagline |
| 2 | The problem — long missions, 5 hazards, astronaut self-assessment |
| 3 | The solution — AstroTrack overview + screenshot |
| 4 | How it works — architecture diagram (Next.js → FastAPI → PostgreSQL) |
| 5 | Live screens — body map, charts, guidance panel |
| 6 | NASA + CSA data used (with citations) |
| 7 | Impact + future vision |

**Slide rules:**
- ≤ 7 slides total (title and intro count)
- English only
- Large readable fonts
- Include team name + member names on the intro slide
- Export to PDF or Google Slides; host publicly with no login

---

## 🏆 Judging Criteria — How We Score

| Criterion | What Judges Look For | Our Strength |
|-----------|---------------------|--------------|
| **Impact** | Real problem, real users | Astronauts on long missions, all 5 hazards |
| **Creativity** | Novel approach | Clickable body map + gamified health routines |
| **Validity** | Grounded in science | NASA HRP + CSA citations in every guidance text |
| **Relevance** | Uses NASA data | All 3 NASA HRP links directly drive indicators |
| **Presentation** | Clear, readable, compelling | Dark UI, strong color coding, tight demo |

---

## 🚨 Submit for Judging — Final Sequence

1. **Log in** and go to **My Team → Project tab**
2. Click blue **Edit** button
3. Scroll to the bottom **Project Submission Verification** section
4. Check both boxes:
   - ☑️ **Agree to Terms and Conditions**
   - ☑️ **Confirm All Work is Original**
5. Click the **"Submit for Judging"** button
6. Confirm the green success banner appears
7. Screenshot the banner as proof
8. Download participant certificates:
   - Profile → Participant Information
   - Click yellow **Download Participant Certificate**
   - Paper size: **Letter** (8.5×11 in / 215×297 mm)
   - Best done on desktop/laptop (not mobile)

> 💡 **Important Reminders:**
> - 🔄 You can edit and resubmit as many times as you like until the deadline.
> - 📌 Only your **last saved submission** is judged.
> - 🎫 Certificates appear only after **"Submit for Judging"** is clicked.

---

## 🛟 Troubleshooting

| Problem | Fix |
|---------|-----|
| "Submit for Judging" button is greyed out | All required fields not filled — scroll up and check for red "Incomplete" labels |
| Judges can't open the demo link | Set the file to "Anyone with link can view" (Drive) or "Public" (YouTube) |
| Judges can't open the project website | Request [FortiGuard Web Filter Classification](https://fortiguard.com/webfilter) |
| Team members edited at the same time and lost work | Toggle the **Lock** ON while editing; save often |
| Certificate not showing | Available only after clicking **Submit for Judging** — check back after a few minutes |
| Certificate PDF formatting broken | Download on desktop, set paper size to Letter |
| Can't submit near deadline | Submit early — do not wait until 11:55 p.m. |

---

## 📋 Copy-Paste Ready — Link Format Check

Every URL in the form must look like this:

- ✅ `https://www.nasa.gov/hrp/hazards/`
- ✅ `https://github.com/your-team/astrotrack`
- ✅ `https://youtu.be/abc123XYZ`

Avoid formats like:
- ❌ `nasa.gov/hrp/hazards`
- ❌ `www.youtube.com/...`
- ❌ `[link]`
- ❌ `See docs folder`

---

## 🎉 Post-Submission

1. Screenshot the confirmation banner (proof of submission)
2. Download all team member certificates
3. Post about the project on social media with **#SpaceApps**
4. Share the live link with your Local Lead
5. Rest. You did it. 🚀

---

## 🔗 Quick Links

- **NASA Space Apps:** [https://www.spaceappschallenge.org](https://www.spaceappschallenge.org)
- **Project Submission Guide:** NASA Space Apps Project Submission Guide 2026
- **Judging & Awards Guide:** 2026 Judging and Awards Guide
- **FortiGuard Web Filter:** [https://fortiguard.com/webfilter](https://fortiguard.com/webfilter)
- **Participant Support:** [info@spaceappschallenge.org](mailto:info@spaceappschallenge.org)
- **Web Tech Support:** [web@spaceappschallenge.org](mailto:web@spaceappschallenge.org)

---

*Submit early. Test links in incognito. Screenshot the banner. Celebrate responsibly.* 🚀🌕
