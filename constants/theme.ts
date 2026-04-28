/**
 * TaxPilot Design System
 * Colors from taxpilot.live, typography iOS-optimized (Apple HIG)
 */

// ── Helpers ──────────────────────────────────────────────
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
    textTertiary: hexToRgba(brand.ink, 0.65),
    textMuted: hexToRgba(brand.ink, 0.5),
    textInverse: brand.white,
    textInverseMuted: hexToRgba(brand.white, 0.8),
    textInverseSecondary: hexToRgba(brand.white, 0.6),
    textInverseTertiary: hexToRgba(brand.white, 0.5),
    textInverseQuaternary: hexToRgba(brand.white, 0.4),

    // Borders
    border: hexToRgba(brand.ink, 0.1),
    borderLight: hexToRgba(brand.ink, 0.05),
    borderInverse: hexToRgba(brand.white, 0.1),

    // Dot grid
    dotBg: 'rgba(0, 0, 0, 0.06)',

    // Status – green
    green: brand.emerald,
    greenBg: hexToRgba(brand.emerald, 0.1),

    // Status – amber
    amber: '#C2410C',
    amberBg: 'rgba(194, 65, 12, 0.1)',
    amberBorder: '#C2410C',

    // Status – red
    red: '#DC2626',
    redBg: 'rgba(220, 38, 38, 0.1)',
    redDark: '#1A0505',

    // Status – gray
    grayBg: 'rgba(156, 163, 175, 0.12)',

    // Status – blue
    blue: '#2563EB',
    blueBg: 'rgba(37, 99, 235, 0.1)',

    // Status – red (light, for dark backgrounds)
    redLight: '#FCA5A5',

    // Card
    cardChipGold: '#D4AF37',
    cardGloss1: 'rgba(255, 255, 255, 0.25)',
    cardGloss2: 'rgba(255, 255, 255, 0.05)',
    cardGloss3: 'rgba(255, 255, 255, 0)',
    cardGloss4: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.15)',
    cardNameText: 'rgba(255, 255, 255, 0.7)',
    cardNetworkText: 'rgba(255, 255, 255, 0.8)',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.4)',
    overlayDark: 'rgba(0, 0, 0, 0.3)',
    overlayChipLine: 'rgba(0, 0, 0, 0.2)',
  },

  // ── Font Families ────────────────────────────────────
  fonts: {
    display: 'SpaceGrotesk_700Bold',
    heading: 'SpaceGrotesk_600SemiBold',
    body: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodySemibold: 'PlusJakartaSans_600SemiBold',
    bodyBold: 'PlusJakartaSans_700Bold',
    mono: 'JetBrainsMono_400Regular',
    monoBold: 'JetBrainsMono_700Bold',
  },

  // ── Font Scale (iOS HIG) ────────────────────────────
  fontSize: {
    hero: 52,       // home hero amount
    feature: 48,    // discovery confirmed amount
    jumbo: 40,      // large display titles
    display: 34,
    title1: 28,
    metric: 24,     // grid stat values
    title2: 22,
    title3: 20,
    headline: 17,
    body: 17,
    callout: 16,
    subhead: 15,
    footnote: 13,
    caption1: 12,
    caption2: 11,
    micro: 9,       // badge text
  },

  lineHeight: {
    hero: 56,
    feature: 52,
    jumbo: 44,
    display: 41,
    title1: 34,
    metric: 30,
    title2: 28,
    title3: 25,
    headline: 22,
    body: 22,
    callout: 21,
    subhead: 20,
    footnote: 18,
    caption1: 16,
    caption2: 13,
    micro: 12,
  },

  letterSpacing: {
    tight: -0.5,    // display
    snug: -0.3,     // titles
    normal: 0,      // body
    wide: 0.2,      // captions
    wider: 1.5,     // all-caps labels
  },

  // ── Spacing (8pt grid) ──────────────────────────────
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
    '4xl': 64,
  },

  // ── Border Radius ───────────────────────────────────
  radius: {
    xs: 4,
    sm: 8,
    button: 12,
    md: 16,
    lg: 24,
    xl: 40,
    '2xl': 48,
    round: 9999,
  },

  // ── Shadows ─────────────────────────────────────────
  shadow: {
    sm: {
      shadowColor: brand.ink,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: brand.ink,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: brand.ink,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 6,
    },
  },

  // ── Component Presets ──────────────────────────────────
  card: {
    backgroundColor: brand.white,
    borderRadius: 40,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },

  microLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
} as const

export type Theme = typeof theme
