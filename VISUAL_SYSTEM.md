# Portfolio Visual System v1.1

> **Purpose:** Canonical style reference for all future iterations of holly-tang.com. Every typography, color, spacing, and font-family decision must trace back to a rule in this document.
>
> **Philosophy:** Restraint is the signal. Rachel Chen uses 1 typeface at 5–6 sizes and 3 text colors — that restraint reads as senior. This system enforces that discipline while preserving the DM Serif Display + Inter dual-typeface editorial identity and single mustard accent `#FFC83D`.

---

## Section 1 — Typography Scale (5 Levels)

**Only these 5 levels exist. Do not introduce any size outside this table.**

| Token | Size | Family | Leading | Color | Usage |
|---|---|---|---|---|---|
| `HERO` | `72px / 96px` | font-serif | `leading-[0.90]` | `#111111` | h1 only — "Patiently", "Structure is the product." |
| `DISPLAY` | `32px / 42px` | font-sans or font-serif | `leading-tight` | `#111111` | All section h2s (SectionHeading), all Decision h3s, punchline, pull-quote |
| `SUBHEAD` | `17px semibold` | font-sans | `leading-[1.6]` | `#111111` | Card headings, panel labels, sub-section titles, callout sentences |
| `BODY` | `15px` | font-sans | `leading-[1.7]` | `#666666` | All prose paragraphs |
| `LABEL` | `11px` | font-sans or font-mono | n/a | `#767676` | Kickers, chips, tags, captions, metadata, numeric indices, all UI micro-text |

### Key Rules

- **The gap between SUBHEAD (17px) and DISPLAY (32px) is intentional and enforced.** No sizes between 17px and 32px. If you feel the urge to add 18px, 20px, 22px, 24px, or 30px — collapse up to DISPLAY or down to SUBHEAD.
- **`SECTION-HEAD` is abolished.** SectionHeading h2s and Decision h3s now share the same `DISPLAY` level (32–42px). One unified display size.
- **`PUNCHLINE` is abolished.** The punchline ("Clinical noise. Structured knowledge.") is `font-sans font-semibold` at `DISPLAY` scale — no special serif punchline level.
- **`BODY-SM` (13px) is abolished.** Card body copy and captions are either BODY (15px prose) or LABEL (11px metadata). There is no in-between.
- **Responsive variants:** `text-[32px] md:text-[42px]` for DISPLAY. `text-[72px] md:text-[96px]` for HERO. No other responsive size pairs.
- **Metrics counters** (88, 1, 3×) use `font-sans` at `72px/84px` — registered exception in Section 6.

### Banned Sizes (do not use)

`9px`, `10px`, `12px`, `13px`, `14px`, `18px`, `19px`, `20px`, `22px`, `24px`, `28px`, `30px`, `36px`, `38px`, `40px`, `52px`, `58px`

Also banned as Tailwind scale classes: `text-4xl`, `text-5xl`, `text-6xl`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

---

## Section 2 — Color Tokens

### Text Colors (4 tokens — no others permitted)

```
--color-dark:       #111111    Headings, primary UI text, active states, all h1–h3
--color-secondary:  #666666    All prose paragraphs, body copy, descriptions
--color-label:      #767676    Kickers, chips, tags, captions, metadata, ghost text
--color-muted:      #CCCCCC    Separators, ghost indices, placeholder strokes
```

### Accent Color (1 token — only one)

```
Accent:   #FFC83D    Mustard — active indicators, accent bars, borders, dot markers, tags (global)
```

**`#C9A227` is abolished.** All warm-gold uses have been replaced with `#FFC83D`. There is now only one yellow in the system.

### Border / Divider Colors

```
--border-default:   #E8E8E8    All card borders, dividers, rule lines
--border-dark:      #1A1A1A    Dark-mode borders inside code mockups only
```

### Banned Colors (do not use)

`#121212`, `#2f2f2f`, `#333333`, `#444444` → use `#111111`
`#555555`, `#777`, `#777777` → use `#666666`
`#888888`, `#AAAAAA`, `#BBBBBB` → use `#767676`
`#DDDDDD`, `#E0E0E0` → use `#CCCCCC` (text) or `#E8E8E8` (border)
`#C9A227` → use `#FFC83D`
`text-gray-*`, `text-black`, `text-black/50` → always use explicit hex

---

## Section 3 — Font Family Rules

### font-serif (DM Serif Display) — 4 permitted locations only

1. **Patiently h1** — `"Patiently"` (HERO scale)
2. **Patiently pull-quote** — `"This is not a memory issue..."` (DISPLAY, italic)
3. **Decision 02 h3** — `"2 Tabs vs 3 Tabs"` (DISPLAY scale)
4. **Decision 03 h3** — `"Unified Context as Infrastructure"` (DISPLAY scale)

**Everything else is font-sans.** In particular:
- The punchline "Clinical noise. Structured knowledge." → `font-sans font-semibold`
- Metrics counter numbers → `font-sans`
- Hero subtitle → `font-sans`
- "We shipped the 3-tab model." → `font-sans font-semibold`
- All section h2s (SectionHeading) → `font-sans`
- Home h1 "Structure is the product." → font-serif (registered as exception, App.tsx)
- ContactSection h2, AboutPanel h2 → font-serif (registered as exception, App.tsx)
- GameTile project title → font-serif (registered as exception, App.tsx)

### font-serif — pending fixes in other files

| File | Element | Current | Should be |
|---|---|---|---|
| `CaseStudyPrimitives.tsx` | SectionWrapper h2 | `font-serif` | `font-sans font-bold` |
| `Footer.tsx` | "Tang Hub" brand name | `font-serif font-bold` | `font-mono font-bold` |
| `ProjectModal.tsx` | h2 heading | `font-serif` | `font-sans font-bold` *(separate pass)* |

### font-mono (system monospace) — permitted uses only

- Numeric indices: `01`, `02`, `03`, `04`
- Arrow glyphs: `→`, `↓`, `↑`
- Code display inside `ReasoningTraceSnippet`
- File/type badges: `[Audio]`, `[Text]`, `[ML]`, `[Taxonomy]`, `[Action]`
- HT monogram, date stamps, year chips
- System pipeline node type labels

**NOT permitted:**
- Any word label, sentence, or heading
- Flow node content text (use font-sans)
- Multi-word descriptive text

### italic — 2 permitted uses only

1. Pull-quote `font-serif italic` at DISPLAY scale — `"This is not a memory issue..."`
2. Decision 02 closing line `font-sans italic` at BODY scale — `"I chose alignment over preference..."`

All other italic usage is prohibited.

---

## Section 4 — Spacing Rules

### Container

```
max-w-6xl mx-auto px-6 md:px-8
```

**Exception:** `PatientlyCaseStudyPage.tsx` uses `max-w-[1100px] xl:pl-[200px]` to accommodate the fixed sidenav.

### Section Padding

| Type | Class |
|---|---|
| Standard content section | `py-10 md:py-12` |
| Hero section | `pt-12 pb-20` |
| Contact CTA | `py-28` (intentional breathing room) |
| ❌ Do NOT use | `py-8` (too tight), `py-16` (not in system) |

### Internal Rhythm

| Pattern | Value |
|---|---|
| Kicker → heading | `mb-3` on kicker, no `mt-*` on heading |
| Heading → body | `mt-4` to `mt-6` |
| Between cards in a grid | `gap-6` standard, `gap-4` tight clusters |
| Section rule (Rule component) | `my-24 md:my-28` |
| Prose max-width | `max-w-[72ch]` — never wider for paragraph columns |

### Border Radius

| Use case | Value |
|---|---|
| Cards, panels | `rounded-[12px]` |
| Mockup frames, screenshots | `rounded-xl` or `rounded-2xl` |
| Pill badges / chips | `rounded-full` |
| ❌ Do NOT use on new components | `rounded-3xl` |

---

## Section 5 — Do's & Don'ts

### DO

- Ask "HERO / DISPLAY / SUBHEAD / BODY / LABEL?" before writing any text class
- Use `text-[32px] md:text-[42px]` for every section heading and decision heading (same level)
- Use `text-[17px] font-semibold` for card headings and callout lines
- Use `text-[16px]` for all prose — never 13px
- Use `text-[12px]` for all labels, kickers, metadata, captions — never 9px, 10px, 12px
- Use `text-[#111111]` for headings and primary text
- Use `text-[#666666]` for prose paragraphs
- Use `text-[#767676]` for labels, kickers, captions, metadata
- Use `text-[#CCCCCC]` for separators, ghost indices, placeholders
- Use `border-[#E8E8E8]` for all card borders and dividers
- Use `#FFC83D` as the only accent color — never `#C9A227`
- Constrain prose to `max-w-[72ch]`

### DON'T

- ❌ Use any size outside 11px / 15px / 17px / 32px / 42px / 72px / 84px / 96px
- ❌ Use `text-gray-*`, `text-black`, `text-black/50` — always explicit hex
- ❌ Use `font-serif` outside the 4 permitted Patiently locations (or App.tsx registered exceptions)
- ❌ Use `font-mono` for any word label or prose text
- ❌ Use `italic` outside the 2 permitted uses
- ❌ Use `#C9A227` — it is abolished
- ❌ Use any banned color (see Section 2)
- ❌ Use any banned size (see Section 1)
- ❌ Add a PUNCHLINE or SECTION-HEAD level — they have been merged into DISPLAY
- ❌ Add a BODY-SM level — 13px does not exist; use BODY (15px) or LABEL (11px)
- ❌ Use section padding `py-8` or `py-16`

---

## Section 6 — Exceptions Register

| Pattern | Location | Why intentional |
|---|---|---|
| `font-serif` on Home h1, ContactSection h2, AboutPanel h2 | `App.tsx` | Intentional display serif in App-level components — distinct editorial contexts |
| GameTile title `font-serif` with `clamp()` | `App.tsx` / GameTile | Viewport-fluid project title at HERO scale |
| `clamp()` via inline style | Home h1, GameTile | Viewport-fluid scaling not achievable with a single Tailwind class |
| Metrics counters `font-sans text-[72px] md:text-[84px]` | `PatientlyCaseStudyPage.tsx` | Data-display numerics at HERO scale — `font-sans` (not serif as of v1.1) |
| `max-w-[1100px] xl:pl-[200px]` | `PatientlyCaseStudyPage.tsx` | Accommodates fixed sidenav offset |
| ReasoningTraceSnippet colors (`#FFB454`, `#8AD8FF`, `#6B7D94`, etc.) | `PatientlyCaseStudyPage.tsx` | Syntax highlight palette inside dark-mode code mockup — decorative artifact, not text tokens |
| StatusChip semantic colors (`#E8F5E9`, `#2E7D32`, amber, grey) | `CaseStudyPrimitives.tsx` | Status-semantic (success/warning/inactive) — not text tokens |
| `rounded-full` on Badge / chip | `CaseStudyPrimitives.tsx` | Pill badges are intentionally round |
| `ProjectModal.tsx` full system | `ProjectModal.tsx` | Legacy component — needs a separate alignment pass; treat as isolated |

---

## Appendix — Rachel Chen Benchmark

Rachel Chen's portfolio (rachelchen.tech/projects/openai) uses:
- **1 typeface** (Geist Sans) at **5–6 sizes**
- **2–3 text color roles**
- **No italic**, no serif/sans mixing, no decorative type variation

That restraint reads as "senior designer, not student." This system reaches that level while preserving the intentional DM Serif Display + Inter dual-typeface identity.

**The rule: if a font-family, font-size, italic, or color choice cannot be traced to a named token or registered exception in this document — it should not exist.**

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2025 | Initial system — 8 type levels, 4 text colors, `#C9A227` as secondary accent, font-serif at 10 locations |
| v1.1 | 2025 | **Radical simplification pass.** Collapsed 8 type levels → 5. Abolished PUNCHLINE, SECTION-HEAD, BODY-SM. Merged SectionHeading h2 into DISPLAY level. Removed `#C9A227` — single `#FFC83D` accent only. Reduced font-serif from 10 → 4 permitted locations in Patiently. Reduced italic from 9 → 2 uses. Collapsed all label sizes (9px, 10px, 12px, 13px) to LABEL (11px). Applied globally to `PatientlyCaseStudyPage.tsx`. |
