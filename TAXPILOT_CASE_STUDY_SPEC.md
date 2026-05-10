# TaxPilot Case Study — Build Spec

Single-page case study. Portfolio piece for a **Founding Product Designer + Design Engineer** application to **Allium** (onchain finance data infra). Narrative framework follows `PatientlyCaseStudyPage.tsx` (Hero → Product → Problem → Process → … → Next), reweighted for Allium's signals: data density, information architecture, dashboards, power-user UX, design systems built from scratch, design-engineer proof-of-work.

## Critical framing

- I am NOT a designer who codes "a little". I am the founding designer who solo-shipped the entire mobile app — design system, components, motion, and React Native production code.
- Reads as proof-of-work, not marketing. Density over polish.
- Aesthetic reference: Linear changelog, Vercel case studies, Rauno's site. Tight typography, generous whitespace between sections but dense within sections.
- Reuse Patiently's section rhythm: `SectionHeading(label, title)` + content block. Sticky left nav. Smooth scroll.

## Tech

- `react-native-web` so real production RN components mount inline.
- All interactive demos = LIVE components. No videos, no GIFs.
- Code blocks use a real syntax highlighter.

## Design tokens (used by the site itself)

- Brand ink: `#0D0D0D`
- Newsprint: `#E3DFD5`
- Emerald: `#22C55F` (only green allowed)
- Display: Space Grotesk · Body: Plus Jakarta Sans · Numbers/code: JetBrains Mono
- 8pt spacing grid

---

# Page structure (in order)

## 1 — Hero

Layout: full viewport. Left = text. Right = phone frame mounting the live discovery sequence (cases 1–4 + transition) on auto-loop, with a scrub bar.

**Headline**

> TaxPilot
> A tax app I designed, built, and shipped — solo.

**Subhead**

> Founding designer + sole engineer. From wireframe to production in 4 weeks. Every pixel, every animation, every line of React Native is mine.

**Pull quote (place near hero, not at end)**

> "I didn't design a system and then build the app. I built the app, and the system fell out of it."

**Meta row** (small caps, mono):

- ROLE: Founding Designer + Design Engineer
- TEAM: 1 (me) + 1 founder
- STACK: React Native · Expo · TypeScript · Zustand · React Query
- TIMELINE: Design system locked in week 1. App shipped in week 4.

---

## 2 — Product · "What TaxPilot does"

`SectionHeading(label="Product", title="Tax as an ambient surface, not an annual panic.")`

Opening paragraph:

> TaxPilot is a mobile tax app for [PLACEHOLDER — target user, e.g. US 1099 workers]. It connects to bank accounts, automatically categorizes income and expenses, surfaces deductions in real time, and generates the numbers needed at filing time — without the user opening a spreadsheet.

Four flow cards (mirror Patiently's `flows` pattern at [PatientlyCaseStudyPage.tsx:17](components/PatientlyCaseStudyPage.tsx#L17)):

1. **Connect** — Bank connection via Plaid → auto-pulled transactions
2. **Categorize** — On-device categorization → income vs expense vs deductible
3. **See** — Calendar + report views → tax position any day of the year
4. **Export** — Year-end → numbers ready for filing

A live home-screen mount sits below the flows so the reader sees the product before reading about how it was built.

---

## 3 — Problem · "The visit ends. The complexity begins." analogue

`SectionHeading(label="Market Problem", title="Tax software is built around April. Users live the other 11 months blind.")`

> Tax software today is built around April. The rest of the year, users have no idea where they stand. By the time they open TurboTax, the data is cold, the categorization is guesswork, and deductions are lost. TaxPilot makes tax a daily, ambient surface.

(Short. One paragraph. Patiently's problem section is also tight — match that rhythm.)

---

## 4 — Process · "How it shipped, solo, in 4 weeks"

`SectionHeading(label="Process", title="An AI-native loop from wireframe to production code.")`

This section replaces Patiently's "Impact" slot. TaxPilot has no user-data impact yet; the proof is the *process* — solo design-engineer ownership, end to end. Use a `PhaseRow`-style numbered timeline (mirror [PatientlyCaseStudyPage.tsx:296](components/PatientlyCaseStudyPage.tsx#L296)).

Opening:

> Most designers hand off Figma. Most engineers hand off Jira tickets. I did neither. I used AI as a compiler between intent and production code, which collapsed the design–engineering loop from weeks to hours.

**Step 1 — Founder wireframes as input**
Low-fidelity wireframes describing user flow. Not pixel-perfect mocks — just intent: what screens exist, what each has to do.

**Step 2 — Variant → code, immediately**
Used Variant to generate React Native component code from visual intent, skipping the Figma → handoff → re-implement loop entirely.

**Step 3 — Design system emerged from the code, not before it**
Most teams design tokens in Figma, then implement. I inverted this. The first generated components told me what tokens I actually needed. By end of week 1, locked: 3 brand colors, 3 type families, 8pt spacing scale, 7-step radius scale, full Apple-HIG-aligned type ramp.

**Step 4 — Iterate by editing production code**
New colors and typography weights added during real screen design, not in a vacuum. Every token added was load-bearing.

**Step 5 — Icon system + UI states locked last**
Systematized icons (`@expo/vector-icons`, one family per use) and audited every component for full state coverage: default / pressed / disabled / loading / error / empty.

---

## 5 — Data density · "Dense, but readable" 【ALLIUM CORE HIT】

`SectionHeading(label="Information Architecture", title="Data density without losing legibility.")`

This section is new — Patiently doesn't have it. **It is the most important section for Allium.** Every example below maps directly to a JD signal: "dense-but-readable layouts", "turn intricate data into intuitive charts", "power-user UX".

Subtitle:

> A tax app is a dashboard in disguise. Every screen is a dense table of money plotted against time. Three decisions made the data legible without thinning it out.

### 5a — Tabular figures (the smallest decision that mattered most)

Live mount: a stack of TransactionRows showing real amounts. Beside it, the same rows in a proportional font for contrast.

Decision callout:

> **Numbers get their own font.** Tabular figures in JetBrains Mono mean amounts align vertically across rows — table scanning becomes effortless. This is not aesthetic preference; it's an accuracy guarantee. In any product where users compare numbers down a column, this is non-negotiable.

### 5b — Calendar (data × time, dense)

Live mount: the production Calendar component. Per-day transaction dots, amount preview on tap, animated month transitions.

> The page closest in spirit to a Bloomberg / Allium dashboard. Financial data plotted against time, at a density that is normally only seen in desktop trading tools — adapted to a 390pt-wide phone screen by ranking what *must* be visible vs what reveals on tap.

What was cut to keep it readable, what stayed (3–4 bullets — fill in from the actual component decisions).

### 5c — Loading vs Analyzing (perceived performance in read-heavy products)

Live mount: side-by-side state-machine demo with a toggle.

Decision callout:

> Most apps treat fetch + compute as a single "loading" state. I split it: **loading** (we're fetching) vs **analyzing** (we have data, we're computing). Different motion, different copy. Users feel progress instead of waiting.
>
> **Why this matters for data products:** in any read-heavy product — TaxPilot, Bloomberg, Allium — perceived speed is shaped more by loading-state design than by actual query time. Granular states feel faster than coarse ones.

---

## 6 — Decisions · "Decisions worth defending"

`SectionHeading(label="Architecture", title="Decisions worth defending.")`

Mirror Patiently's Architecture cards (`decisions` array at [PatientlyCaseStudyPage.tsx:111](components/PatientlyCaseStudyPage.tsx#L111)). Each decision = card with three labels: **THE DECISION / THE CONSTRAINT / THE TRADEOFF**.

**Order them by Allium relevance, most relevant first.**

### 6a — System decisions (UI / engineering)

1. **One green only — `#22C55F`**
   Constraint: Financial UI must not be ambiguous about polarity.
   Tradeoff: Loses some visual richness. Gains semantic clarity.

2. **Zustand for client state, React Query for server state**
   Constraint: Don't put server data in a global store — it lies.
   Tradeoff: Two state systems to learn. Worth it; the alternative is bugs.

3. **Split loading into loading + analyzing**
   Constraint: Perceived performance > actual performance.
   Tradeoff: Two states to design instead of one.

4. **Design system emerges from code, not from Figma**
   Constraint: Single operator. No handoff loop possible.
   Tradeoff: Less upfront polish. Faster convergence on what's real.

5. **No business logic in components**
   Constraint: Components must be composable and testable.
   Tradeoff: More files. Faster iteration, clearer reviews.

6. **No Reanimated, only Animated API**
   Constraint: Production reliability + bundle size.
   Tradeoff: Harder to author complex motion. Forces simpler motion that ships reliably.

### 6b — Flow decisions (UX / divergence from spec)

Lead-in:

> My founder gave me a wireframe flow as the starting point. As I built the screens, I found places where the original flow didn't match how a user would actually move through the product. I changed them — and defended the changes.

**[PLACEHOLDER — UX decision #1]**
- Original flow:
- What I changed:
- Why:
- Outcome:

**[PLACEHOLDER — UX decision #2]**
- Original flow:
- What I changed:
- Why:
- Outcome:

**[PLACEHOLDER — UX decision #3]**
- Original flow:
- What I changed:
- Why:
- Outcome:

(4 lines max per field. The point is to show flow-level judgment.)

---

## 7 — Motion · "Motion as state, not decoration"

`SectionHeading(label="Motion", title="Motion as a state-management tool.")`

Four live demos. Each in its own card: phone frame + scrub bar + annotated breakdown + source path disclosure. Frame the section around *state, attention, and perceived latency* — not motion polish — so it stays load-bearing for an Allium reader.

Opening:

> Every animation in TaxPilot earns its place by clarifying state, guiding attention, or absorbing latency. Built entirely on React Native's built-in Animated API — no Reanimated, no third-party motion libraries. Constraint forces craft.

**Demo 1 — Discovery sequence (cases 1–4 + transition)**
4 onboarding screens that explain abstract tax concepts through motion. Each case isolates one idea and animates it into legibility. Transitions between cases carry narrative weight — they are not page turns.

**Demo 2 — Loading → Analyzing (state-machine motion)**
The most underrated decision in the app. Split a single "loading" state into **loading** (fetching) and **analyzing** (computing). Different motion, different copy. Users feel progress instead of waiting.
*Why this matters for data products:* in any read-heavy product — TaxPilot, Bloomberg, Allium — perceived speed is shaped more by loading-state design than by actual query time. Granular states feel faster than coarse ones.

**Demo 3 — Calendar (data × time, dense)**
Financial data plotted against a calendar. Per-day transaction dots, amount previews on tap, animated month transitions. The page closest in spirit to a Bloomberg / Allium dashboard — utility, not marketing.

**Demo 4 — Add-expense flow (power-user input)**
Numeric input, category selection, fast keyboard interaction. The motion here is invisible unless you remove it — every micro-interaction exists to make the form feel responsive at native-app speed. This is the "power-user UX" demo: dense input, no wasted taps.

Note on overlap with section 5: Calendar and Loading→Analyzing also appear in *Information Architecture* as data-density examples. Here they get the motion-side treatment (curves, timing, copy transitions). The duplication is intentional — same component, two different lenses.

---

## 8 — Design system, live

`SectionHeading(label="Visual Design", title="The design system, live.")`

Subtitle:

> Every swatch and component below is the actual production code, imported and rendered. Hover, click, drag — these are not images.

### 8a — Color
Swatches: ink `#0D0D0D`, newsprint `#E3DFD5`, emerald `#22C55F`, plus iterated additions. Each: name, hex, one-line "why this color exists".

### 8b — Typography
Live ramp: Display 34 / Title1 28 / Title2 22 / Body 17 / Callout 16 / Footnote 13 / Caption 12 / Caption2 11. All three families in actual usage context.

### 8c — Spacing + radius
Visualize 8pt grid (4/8/12/16/24/32/48) and radius scale (4/8/16/24/40/9999) as rendered boxes.

### 8d — Component library (live mounts)
Mount production components with state matrix:
- Button (primary/secondary/destructive × default/pressed/disabled/loading)
- SmallButton
- SegmentedControl
- Toggle
- SelectionCard
- SpinningLoader
- TransactionRow

Each component has a "view source" disclosure with the real TypeScript file path.

---

## 9 — Next · "What shipping solo taught me"

`SectionHeading(label="Next", title="What shipping solo taught me.")`

Three short paragraphs:

> **Constraints sharpen taste.** Working alone with a fixed timeline, every "nice to have" gets cut. What survives is what mattered. The system has 3 colors not because 3 was the goal, but because no fourth color earned its place.

> **Motion is a state-management tool, not a finish.** The biggest motion win in TaxPilot wasn't an animation — it was deciding to split loading into two states. The second-biggest was deciding which transitions did NOT need motion.

> **AI doesn't replace design judgment, it relocates it.** Variant generated the components. I decided which to keep, which tokens to lock, what to throw away. The taste is still the bottleneck. AI just moves it earlier in the pipeline.

---

## 10 — Footer

> Built with React Native + Expo. Rendered on the web with react-native-web.
> Every component on this page is the production code.
> [name] · [email] · [github / linkedin]

---

# Build notes

- Single-page site. Sticky left nav. Smooth scroll.
- Section nav order: Product · Problem · Process · Information Architecture · Architecture · Motion · Visual Design · Next
- Components must render live (react-native-web). Phone frames around mobile demos. Real source paths visible.
- Don't add features not in this spec.
- Reuse `SectionHeading`, `PhaseRow`, decision card, and flow card components from `PatientlyCaseStudyPage.tsx` where possible — visual consistency across the portfolio matters.
