/**
 * TaxPilot Motion System
 * Unified animation tokens for consistent, purposeful motion.
 *
 * Principles:
 * - Entrances are slightly slower than exits (users need time to orient)
 * - Spring for playful / organic (logo, toggles); timing for UI transitions
 * - Every animation uses useNativeDriver: true
 */
import { Easing } from 'react-native'

// ── Duration ────────────────────────────────────────────
export const duration = {
  /** Micro-interactions: button press, icon swap */
  instant: 150,
  /** Standard UI feedback: fade, color change */
  fast: 250,
  /** Page-level transitions: slide, fade in/out */
  normal: 400,
  /** Emphasis: hero card entrance, onboarding reveals */
  slow: 600,
  /** Splash / intro-only — never use in regular UI */
  dramatic: 900,
  /** Spinner / loader rotation cycle */
  spinner: 800,
  /** Long sequential processes (bank connect, scan) */
  sequence: 1800,
  /** Very long animations (scan line traversal) */
  sweep: 3000,
} as const

// ── Easing ──────────────────────────────────────────────
export const easing = {
  /** Elements entering the screen — fast start, gentle settle */
  enter: Easing.out(Easing.cubic),
  /** Elements leaving the screen — gentle start, fast finish */
  exit: Easing.in(Easing.cubic),
  /** On-screen movement (resize, reposition) */
  standard: Easing.inOut(Easing.cubic),
  /** Apple-style fast overshoot settle — card entrances, staggered reveals */
  apple: Easing.bezier(0.16, 1, 0.3, 1),
} as const

// ── Spring ──────────────────────────────────────────────
export const spring = {
  /** Snappy bounce — toggles, small icons */
  snappy: { tension: 300, friction: 20 },
  /** Gentle bounce — logo, hero elements */
  gentle: { tension: 20, friction: 6 },
  /** Button reveal — slightly underdamped */
  reveal: { tension: 120, friction: 14 },
  /** Card stack — smooth, damped */
  card: { tension: 65, friction: 8 },
} as const

// ── Stagger ─────────────────────────────────────────────
export const stagger = {
  /** Delay between sibling items in a list/cascade */
  offset: 80,
} as const

// ── Transform Distances ─────────────────────────────────
export const distance = {
  /** Subtle shift for child items */
  xs: 12,
  /** Standard card / section entrance */
  md: 40,
} as const

// ── Common Presets (Animated.timing configs) ────────────
// Spread into Animated.timing() — caller still provides toValue.
export const preset = {
  fadeIn: {
    duration: duration.fast,
    easing: easing.enter,
    useNativeDriver: true as const,
  },
  fadeOut: {
    duration: duration.fast,
    easing: easing.exit,
    useNativeDriver: true as const,
  },
  slideEnter: {
    duration: duration.normal,
    easing: easing.enter,
    useNativeDriver: true as const,
  },
  slideExit: {
    duration: duration.normal,
    easing: easing.exit,
    useNativeDriver: true as const,
  },
  cardEnter: {
    duration: duration.slow,
    easing: easing.enter,
    useNativeDriver: true as const,
  },
  staggerChild: {
    duration: duration.normal,
    easing: easing.enter,
    useNativeDriver: true as const,
  },
  /** Screen exit on CTA press (fade + scale) */
  screenExit: {
    duration: duration.normal,
    easing: easing.exit,
    useNativeDriver: true as const,
  },
  /** Apple-style card/section entrance (slightly slower, apple easing) */
  cardEnterApple: {
    duration: duration.slow,
    easing: easing.apple,
    useNativeDriver: false as const,
  },
  /** Apple-style header entrance */
  headerEnterApple: {
    duration: duration.slow,
    easing: easing.apple,
    useNativeDriver: true as const,
  },
} as const

// ── Convenience ─────────────────────────────────────────
export const motion = {
  duration,
  easing,
  spring,
  stagger,
  distance,
  preset,
} as const

export default motion
