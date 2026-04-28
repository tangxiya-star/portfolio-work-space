# TaxPilot — Design System

> Last updated: 2026-03-25 v2.0
> Source of truth: `constants/theme.ts` + `constants/typography.ts`

---

## Typography

### Font Families

| Role | Font | Tokens | Weight |
|------|------|--------|--------|
| **Display / Headings** | Space Grotesk | `display`, `heading` | 700 Bold, 600 SemiBold |
| **Body / UI** | Plus Jakarta Sans | `body`, `bodyMedium`, `bodySemibold`, `bodyBold` | 400, 500, 600, 700 |
| **Monospace / Numbers** | JetBrains Mono | `mono`, `monoBold` | 400, 700 |

### iOS / Expo Integration

```typescript
// Load via expo-font in app/_layout.tsx
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans'
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono'
```

### Font Scale (Apple HIG)

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `hero` | 52 | 56 | — | Home hero amount |
| `feature` | 48 | 52 | — | Discovery confirmed amount |
| `jumbo` | 40 | 44 | — | Large display titles |
| `display` | 34 | 41 | -0.5 (tight) | Hero headlines |
| `title1` | 28 | 34 | -0.3 (snug) | Page titles |
| `metric` | 24 | 30 | — | Grid stat values |
| `title2` | 22 | 28 | -0.3 (snug) | Section headings |
| `title3` | 20 | 25 | -0.3 (snug) | Sub-section headings |
| `headline` | 17 | 22 | 0 | Emphasized body |
| `body` | 17 | 22 | 0 | Default body text |
| `callout` | 16 | 21 | 0 | Buttons, prominent UI |
| `subhead` | 15 | 20 | 0 | Supporting text |
| `footnote` | 13 | 18 | 0 | Secondary labels |
| `caption1` | 12 | 16 | 0.2 (wide) | Captions |
| `caption2` | 11 | 13 | 0.2 (wide) | Micro labels |
| `micro` | 9 | 12 | — | Badge text |

### Pre-composed Text Styles (`typography.ts`)

| Style | Font | Size | Weight | Color |
|-------|------|------|--------|-------|
| `display` | Space Grotesk | 34 | 700 | textPrimary |
| `title1` | Space Grotesk | 28 | 700 | textPrimary |
| `title2` | Space Grotesk | 22 | 600 | textPrimary |
| `title3` | Space Grotesk | 20 | 600 | textPrimary |
| `headline` | Plus Jakarta Sans | 17 | 600 | textPrimary |
| `body` | Plus Jakarta Sans | 17 | 400 | textPrimary |
| `bodyMedium` | Plus Jakarta Sans | 17 | 500 | textPrimary |
| `callout` | Plus Jakarta Sans | 16 | 400 | textPrimary |
| `calloutSemibold` | Plus Jakarta Sans | 16 | 600 | textPrimary |
| `subhead` | Plus Jakarta Sans | 15 | 400 | textSecondary |
| `footnote` | Plus Jakarta Sans | 13 | 400 | textSecondary |
| `caption1` | Plus Jakarta Sans | 12 | 500 | textSecondary |
| `caption2` | Plus Jakarta Sans | 11 | 500 | textMuted |
| `label` | Plus Jakarta Sans | 12 | 500 | textSecondary (uppercase, wider tracking) |
| `mono` | JetBrains Mono | 17 | 400 | textPrimary |
| `monoBold` | JetBrains Mono | 17 | 700 | textPrimary |

### Micro Label Preset

```typescript
// theme.microLabel
fontSize: 10, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase'
```

---

## Colors

### Brand Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#0D0D0D` | Brand black |
| `newsprint` | `#E3DFD5` | Brand warm grey |
| `emerald` | `#22C55F` | Brand green (the only green allowed) |
| `white` | `#FFFFFF` | — |
| `black` | `#000000` | — |

### Semantic Aliases

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#0D0D0D` (ink) | Primary actions |
| `accent` | `#22C55F` (emerald) | Accent highlights |
| `background` | `#E3DFD5` (newsprint) | Page background |
| `surface` | `#FFFFFF` | Cards, inputs |
| `surfaceDim` | `#F5F5F0` | Subtle surface variation |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `textPrimary` | `#0D0D0D` | Headings, primary content |
| `textSecondary` | `rgba(13,13,13,0.5)` | Labels, descriptions |
| `textTertiary` | `rgba(13,13,13,0.35)` | Hints |
| `textMuted` | `rgba(13,13,13,0.3)` | Placeholders, disabled |
| `textInverse` | `#FFFFFF` | Text on dark backgrounds |

### Border Colors

| Token | Value | Usage |
|-------|-------|-------|
| `border` | `rgba(13,13,13,0.1)` | Default borders |
| `borderLight` | `rgba(13,13,13,0.05)` | Subtle dividers |

### Status Colors

| Token | Foreground | Background | Usage |
|-------|-----------|-----------|-------|
| Green | `#22C55F` | `rgba(34,197,95,0.1)` | Savings, positive |
| Amber | `#C2410C` | `rgba(194,65,12,0.1)` | Pending, warnings |
| Red | `#DC2626` | `rgba(220,38,38,0.1)` | Errors |
| Blue | `#2563EB` | `rgba(37,99,235,0.1)` | Info, links |

---

## Layout & Alignment

| Page Type | Alignment | Rationale |
|-----------|-----------|-----------|
| **Welcome / Splash** | Center | Brand presentation, single-action focus |
| **Onboarding forms (Step 1–3)** | Left | Reading efficiency, form input patterns |
| **Connect / Loading** | Center | Single-action focus, status display |
| **Discovery** | Left | Data-heavy, category lists |
| **Main tabs (Home, Calendar, Savings, Report)** | Left | Information density, scan-ability |

**Rule:** If a screen has one primary message and no form inputs → center. If it has lists, forms, or data → left.

---

## Spacing (8pt grid)

| Token | Value |
|-------|-------|
| `xxs` | 2 |
| `xs` | 4 |
| `sm` | 8 |
| `md` | 12 |
| `lg` | 16 |
| `xl` | 24 |
| `2xl` | 32 |
| `3xl` | 48 |
| `4xl` | 64 |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4 | Checkboxes, small elements |
| `sm` | 8 | Tags, small cards |
| `button` | 12 | Buttons |
| `md` | 16 | Cards, inputs |
| `lg` | 24 | Large cards, modals |
| `xl` | 40 | Feature cards |
| `2xl` | 48 | Panels |
| `round` | 9999 | Pills, avatars |

---

## Shadows

| Token | Offset Y | Opacity | Blur | Elevation (Android) | Usage |
|-------|----------|---------|------|---------------------|-------|
| `sm` | 1 | 0.05 | 2 | 1 | Subtle lift |
| `md` | 4 | 0.08 | 12 | 3 | Cards |
| `lg` | 8 | 0.12 | 24 | 6 | Modals, popovers |

All shadows use `#0D0D0D` (ink) as shadowColor.

---

## Cards & Surfaces

The application uses three distinct semantic card surfaces to build visual hierarchy.

### 1. White Card (`theme.card` / `theme.colors.surface`)
- **Usage:** **Default content container**.
- **When to use:** Use for 90% of the app's content. Standard data lists, forms, onboarding sections, discovery reports, and any generic grouping of information.

### 2. Green Card (`theme.colors.green`)
- **Usage:** **Success & Hero Highlight**.
- **When to use:** Used strictly to celebrate the user's progress or show a massive positive outcome (e.g., the top "Estimated Tax Reduction" hero card in `index.tsx`). Use extremely sparingly. It should be the single focal point of a screen.

### 3. Black Card (`theme.colors.ink`)
- **Usage:** **Data Metrics & High Contrast**.
- **When to use:** Used to group dense data stats or secondary metrics (like "Total Income" / "Taxable Income" in the dashboard grid). It provides sharp contrast against the `newsprint` background without fighting for attention with the green hero.

### Standard White Card Preset

```typescript
// theme.card
backgroundColor: '#FFFFFF'
borderRadius: 40
padding: 32
shadow: { offset: {0, 4}, opacity: 0.08, blur: 24, elevation: 8 }
```

---

*Last updated: 2026-03-25 v2.0*
