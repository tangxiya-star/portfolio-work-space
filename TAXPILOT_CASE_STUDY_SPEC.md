# TaxPilot Case Study — Build Spec

Single-page case study. Portfolio piece for a **Founding Product Designer + Design Engineer** application to **Allium** (onchain finance data infra). Narrative framework follows `PatientlyCaseStudyPage.tsx` but radically restructured for a **Design Engineer** positioning. It emphasizes code as the source of truth, an entirely AI-native workflow (zero Figma), and the seamless integration of design intent with engineering execution.

## Critical framing

- I am NOT a designer who codes "a little". I am a builder who uses code as my primary design tool.
- **100% AI-Native Workflow**: There are zero Figma files for this project. The design system, branding, motion, and layouts were entirely generated and iterated within the code editor using AI.
- Reads as proof-of-work, not marketing. Density over polish. Show the code next to the UI.
- Aesthetic reference: Linear changelog, Vercel case studies, Rauno's site. Tight typography, "Workbench" feel (exposing code snippets next to live components).

## Tech

- `react-native-web` so real production RN components mount inline.
- All interactive demos = LIVE components. No videos, no GIFs.
- Code blocks use a real syntax highlighter (JetBrains Mono) placed side-by-side with live UI mounts.

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

> Founding designer + sole engineer. From wireframe to production in 4 weeks. Zero Figma files. Every pixel, system, and animation was crafted directly in code using an AI-native workflow.

**Meta row** (small caps, mono):

- ROLE: Founding Designer + Design Engineer
- TEAM: 1 (me) + 1 founder
- STACK: React Native · Expo · TypeScript · Zustand · React Query
- WORKFLOW: 100% AI-Native (Cursor / Variant). No manual UI design tools.

---

## 2 — The Product: Tax as an ambient surface

`SectionHeading(label="The Product", title="Tax software shouldn't just exist in April.")`

> TaxPilot connects to bank accounts, automatically categorizes income and expenses, surfaces deductions in real time, and generates the numbers needed at filing time. By the time users usually open TurboTax, their data is cold. TaxPilot makes tax a daily, ambient surface.

**Live Mount**: A live home-screen mount sits below a tight, 4-step flow description (Connect → Categorize → See → Export). Let the user play with the product immediately.

---

## 3 — The Process: Zero-Figma, AI-Native Loop

`SectionHeading(label="Workflow", title="Skipping Figma. Code as the source of truth.")`

> Most designers hand off Figma. Most engineers hand off Jira tickets. I did neither. The entire app—branding, design system, motion, and UI—was built without a single manual design tool. By using AI as a compiler between intent and production code, I collapsed the design-engineering loop from weeks to hours.

**Step 1 — Founder wireframes as raw input**
Low-fidelity napkin sketches describing user flow. No pixel-perfect mocks, just pure intent.

**Step 2 — Prompting the UI**
Used Variant/Cursor to generate React Native component code directly from visual intent. I didn't design a button in Figma; I prompted a button in React Native and adjusted the props.

**Step 3 — System emerging from code**
Most teams design tokens in Figma, then implement. I inverted this. The first generated components told me what tokens I actually needed. The branding, colors, and typography were hallucinated by AI, refined by my taste, and locked directly in `theme.ts`.

---

## 4 — Crafting the Details (Design-Engineering Cases)

*This is the core of the portfolio. We don't separate "Design" and "Engineering"—we show how they enable each other. Every demo here features a "Workbench" layout: Live UI on one side, critical code snippets on the other.*

### Case A: Rendering Data Density

`SectionHeading(label="Information Architecture", title="Data density without losing legibility.")`

> A tax app is a dashboard in disguise. The challenge is plotting money against time on a 390pt-wide screen without thinning out the data.

**Live Demo**: Tabular figures comparison & The Calendar Component.
- **The UI**: Stack of TransactionRows and the Calendar showing dense per-day dots.
- **The Code**: Reveal the `fontVariant: ['tabular-nums']` style definition, and the rendering logic for the Calendar.
- **The Narrative**: Numbers get their own font. Tabular figures in JetBrains Mono mean amounts align vertically—this is an accuracy guarantee, not an aesthetic preference. The Calendar brings Bloomberg-level density to mobile by ranking what *must* be visible vs what reveals on tap.

### Case B: Motion & Spatial Interfaces

`SectionHeading(label="Motion & Interaction", title="Motion as state, not decoration.")`

> Motion here is not decoration; it's a state-management tool. I restricted myself entirely to React Native's built-in `Animated` API for maximum production reliability, proving that fluid, interruptible spatial motion doesn't require heavy external libraries.

**Live Demo 1: The Connected Accounts Stack**
- **The UI**: A stacked card interface (wallet style) for bank accounts that expands on tap with fluid spring animations.
- **The Code**: The `Animated.View` interpolation mapping `tapState` to `translateY` and `scale`. 
- **The Narrative**: A static list of bank accounts is boring. By turning them into a spatial stack, the UI feels tactile and premium. The math behind the stack (calculating offsets and scales) demonstrates a deep understanding of layout geometry and gesture-driven animations.

**Live Demo 2: Loading → Analyzing (State Machine)**
- **The UI**: Side-by-side state-machine demo with a toggle.
- **The Code**: The state definition (`type Status = 'idle' | 'loading' | 'analyzing'`) and the transition logic.
- **The Narrative**: Most apps treat fetch + compute as a single "loading" state. I split it into **loading** (fetching) and **analyzing** (computing). Different motion, different copy. Perceived speed is shaped more by granular state design than by actual query time.

### Case C: A Living Design System

`SectionHeading(label="Design System", title="Systems built from the bottom up.")`

> Because there was no Figma, the design system is strictly the component API. Every token was load-bearing. No bloated color palettes—just what the product strictly demanded.

**Live Demo**: Component API Workbench.
- **The UI**: Rendered buttons, SegmentedControls, and TransactionRows.
- **The Code**: `<Button variant="primary" loading={isAnalyzing} />` alongside `constants.ts` showing the extremely constrained 3-color palette.
- **The Narrative**: Emphasize the single green rule (`#22C55F`). Financial UI must not be ambiguous about polarity. We traded visual richness for absolute semantic clarity. 

---

## 5 — Architecture & Defended Decisions

`SectionHeading(label="Architecture", title="Decisions worth defending.")`

Three decision cards that show seniority in engineering and UX:

1. **Client vs. Server State**
   *Constraint*: Don't put server data in a global store—it lies.
   *Decision*: Zustand for pure client UI state, React Query for server state. Two systems to learn, but it eliminates an entire class of synchronization bugs.
2. **Logic-less Components**
   *Constraint*: AI-generated components can get messy fast.
   *Decision*: Strict separation. UI components take primitive props only. All business logic lives in custom hooks.
3. **Correcting the Founder's Flow**
   *Constraint*: The original wireframe flow was conceptually pure but practically clunky.
   *Decision*: [PLACEHOLDER - What you changed]. Defending user experience over initial specs.

---

## 6 — Next · "What an AI-native workflow taught me"

`SectionHeading(label="Takeaways", title="Taste is the new bottleneck.")`

Three short paragraphs:

> **AI relocates design judgment.** I didn't push pixels; I curated outputs. AI generated the components, but I decided which to keep, which tokens to lock, and what to throw away. The human taste is still the bottleneck—AI just moves it earlier in the pipeline.

> **Constraints sharpen taste.** Working alone without a visual design tool meant every "nice to have" got cut. The system has 3 colors not because 3 was the goal, but because no fourth color earned its place in the code.

> **Engineering is a design discipline.** The biggest UX win in TaxPilot wasn't a layout—it was deciding to split a boolean loading state into a multi-step state machine.

---

## 7 — Footer

> Built with React Native + Expo. Rendered on the web with react-native-web.
> Every component on this page is the production code.
> [name] · [email] · [github / linkedin]

---

# Build notes

- Single-page site. Sticky left nav. Smooth scroll.
- Section nav order: The Product · Workflow · Information Architecture · Motion & Performance · Design System · Architecture · Takeaways
- **CRITICAL VISUAL PATTERN**: The "Workbench". Whenever a live component is shown, it should be paired with its critical code snippet. This visually reinforces the Design Engineer positioning.
- Reuse `SectionHeading` and decision cards from `PatientlyCaseStudyPage.tsx` where possible.
