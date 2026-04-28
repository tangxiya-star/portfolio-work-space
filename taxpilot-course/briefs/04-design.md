# Module 4: The Design Engine

### Teaching Arc
- **Metaphor:** A style guide at a fashion house — instead of every designer picking their own colours and fonts, one master document defines everything. Every outfit (screen) must use only approved colours, approved fabrics (fonts), and approved silhouettes (spacing/radius). Deviating gets flagged immediately.
- **Opening hook:** "TaxPilot's entire visual identity — every green, every font, every rounded corner — flows from a single 196-line file called theme.ts. Change one number there and the whole app changes."
- **Key insight:** A design system in code (design tokens + typography presets + StyleSheet.create) is how you achieve visual consistency at scale without manually updating every screen.
- **"Why should I care?":** When you ask AI to "make this screen look better," it needs to know: use only colors from theme.ts, only font styles from typography.ts, never hardcode hex values. Knowing this rule saves hours of debugging visual inconsistency.

### Code Snippets (pre-extracted)

File: constants/theme.ts (lines 14-65, brand + semantic colors)
```ts
// ── Brand Colors ─────────────────────────────────────────
const brand = {
  ink: '#0D0D0D',
  newsprint: '#E3DFD5',
  emerald: '#22C55F',
  white: '#FFFFFF',
  black: '#000000',
} as const

// ── Theme ────────────────────────────────────────────────
export const theme = {
  colors: {
    // Brand
    ...brand,

    // Semantic
    primary: brand.ink,
    accent: brand.emerald,
    background: brand.newsprint,
    surface: brand.white,
    surfaceDim: '#F5F5F0',

    // Text
    textPrimary: brand.ink,
    textSecondary: hexToRgba(brand.ink, 0.6),
    textTertiary: hexToRgba(brand.ink, 0.5),
    textMuted: hexToRgba(brand.ink, 0.4),
    textInverse: brand.white,
    textInverseMuted: hexToRgba(brand.white, 0.8),

    // Borders
    border: hexToRgba(brand.ink, 0.1),
    borderLight: hexToRgba(brand.ink, 0.05),

    // Status – green
    green: brand.emerald,
    greenBg: hexToRgba(brand.emerald, 0.1),

    // Status – amber
    amber: '#C2410C',
    amberBg: 'rgba(194, 65, 12, 0.1)',
    amberBorder: '#C2410C',
  },
```

File: constants/typography.ts (lines 8-45, display + titles)
```ts
export const typography = {
  // ── Display ─────────────────────────────────
  display: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSize.display,
    lineHeight: theme.lineHeight.display,
    fontWeight: '700',
    letterSpacing: theme.letterSpacing.tight,
    color: theme.colors.textPrimary,
  } as TextStyle,

  // ── Titles ──────────────────────────────────
  title1: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSize.title1,
    lineHeight: theme.lineHeight.title1,
    fontWeight: '700',
    letterSpacing: theme.letterSpacing.snug,
    color: theme.colors.textPrimary,
  } as TextStyle,

  title2: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSize.title2,
    lineHeight: theme.lineHeight.title2,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.snug,
    color: theme.colors.textPrimary,
  } as TextStyle,
```

File: app/(tabs)/index.tsx (lines 33-55, PendingPill with StyleSheet)
```tsx
const pendingStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    borderRadius: theme.radius.round,
    gap: theme.spacing.sm,
  },
  pillPressed: {
    backgroundColor: theme.colors.ink,
  },
  text: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  textPressed: {
    color: theme.colors.white,
  },
})
```

### Screens (4 screens)

**Screen 1: The Colour Pyramid**
- Visual: 3-tier pyramid diagram
  - Top tier (smallest): Brand primitives — `ink`, `newsprint`, `emerald`, `white`
  - Middle tier: Semantic tokens — `textPrimary`, `background`, `surface`, `accent`, `border`
  - Bottom tier (widest): Usage in components — every screen uses semantic, not primitive
- Text: "The 3 primitives (ink, newsprint, emerald) never change. The semantic tokens give them meaning ('textPrimary' knows to use 'ink'). Screens only ever reference semantic names."
- Callout: "💡 Rule from CLAUDE.md: 'Colors from theme only — never hardcode hex values.' If AI writes '#0D0D0D' in a component, flag it — should be theme.colors.ink."
- Code ↔ English of brand + semantic colors section

**Screen 2: Typography — Font Styles as Variables**
- Code ↔ English of typography.ts (display + title1 + title2)
- Right side: "display = 34px, bold, tight letter-spacing — used for the $4,890 headline. title1 = 28px — used for section headers. typography.title1 is a pre-built style object you drop in: `<Text style={typography.title1}>`"
- Pattern cards showing font scale: display(34) → title1(28) → title2(22) → body(17) → footnote(13) → caption(12) — each with a live example sentence at that size

**Screen 3: StyleSheet.create — Styles as Objects**
- Code ↔ English of the PendingPill `StyleSheet.create` block
- Right: "StyleSheet.create() is like a CSS class in React Native. Each property maps to a CSS concept: flexDirection='row' = display:flex, paddingHorizontal = padding-left + padding-right, borderRadius=theme.radius.round makes it a perfect pill shape."
- Callout: "💡 minHeight: 44 — Apple's HIG (Human Interface Guidelines) says touch targets must be at least 44×44 points. This prevents accessibility issues."
- Glossary tooltips: StyleSheet, flexDirection, SafeAreaView, HIG, design token, semantic color

**Screen 4: One Change, Whole App Changes**
- Interactive "what if?" scenario:
  - Show 3 before/after cards: "What if we changed brand.emerald to #FF6B35 (orange)?" → shows which elements would change across the app (hero card, confirmed badges, year indicator, etc.)
  - "What if we changed theme.spacing.lg from 16 to 24?" → shows padding changes everywhere
- Quiz (3 questions at end)

### Interactive Elements

- [x] **Code↔English translation** — theme.ts colors (brand + semantic), typography.ts (display/title styles), StyleSheet.create PendingPill
- [x] **Pattern cards** — font scale visualization (display → caption with live example text at each size)
- [x] **Quiz** — 3 questions:
  Q1: "AI wrote: `color: '#0D0D0D'` directly in a component. What's the problem, and what should it be?" Options: That color doesn't exist (wrong) / Hardcoded hex breaks the design system — should be `theme.colors.ink` (correct) / It works fine for now / Should be `theme.colors.black`
  Q2: "You want to add a new 'warning' colour to TaxPilot. Where do you define it?" Options: In the component that uses it (wrong) / In theme.ts under the colors object (correct) / In each screen's StyleSheet / In a new colors.ts file
  Q3: "A screen uses `typography.title1`. Which font and size does that resolve to?" Options: Plus Jakarta Sans, 22px (wrong) / Space Grotesk Bold, 28px (correct — SpaceGrotesk_700Bold at fontSize.title1=28) / JetBrains Mono, 28px / DM Sans, 34px
- [x] **Glossary tooltips** — design token, semantic color, StyleSheet, flexDirection, SafeAreaView, HIG, letterSpacing, typography scale

### Reference Files to Read
- `references/interactive-elements.md` → "Code ↔ English Translation Blocks", "Multiple-Choice Quizzes", "Pattern/Feature Cards", "Callout Boxes", "Glossary Tooltips"
- `references/content-philosophy.md` → full file
- `references/gotchas.md` → full file

### Connections
- **Previous module:** "How Data Travels" — showed data flowing between layers. This module shifts focus to the visual layer.
- **Next module:** "Built to Scale" — covers file-based routing, strict TypeScript, and how to add features safely.
- **Tone/style notes:** Accent = forest green. Module background: `--color-bg-warm`. Fashion house metaphor — "style guide", "master document". Don't mix with postal or TV metaphors from earlier modules.
