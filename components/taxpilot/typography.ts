import { TextStyle } from 'react-native'
import { theme } from './theme'

/**
 * Pre-composed text styles following Apple HIG.
 * Usage: <Text style={typography.title1}>Hello</Text>
 */
export const typography = {
  // ── Display ─────────────────────────────────
  hero: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSize.hero,
    lineHeight: theme.lineHeight.hero,
    fontWeight: '700',
    letterSpacing: theme.letterSpacing.tight,
    color: theme.colors.textPrimary,
  } as TextStyle,

  feature: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSize.feature,
    lineHeight: theme.lineHeight.feature,
    fontWeight: '700',
    letterSpacing: theme.letterSpacing.tight,
    color: theme.colors.textPrimary,
  } as TextStyle,

  display: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSize.display,
    lineHeight: theme.lineHeight.display,
    fontWeight: '700',
    letterSpacing: theme.letterSpacing.tight,
    color: theme.colors.textPrimary,
  } as TextStyle,

  metric: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSize.metric,
    lineHeight: theme.lineHeight.metric,
    fontWeight: '600',
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

  title3: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSize.title3,
    lineHeight: theme.lineHeight.title3,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.snug,
    color: theme.colors.textPrimary,
  } as TextStyle,

  // ── Body ────────────────────────────────────
  headline: {
    fontFamily: theme.fonts.bodySemibold,
    fontSize: theme.fontSize.headline,
    lineHeight: theme.lineHeight.headline,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  } as TextStyle,

  body: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  } as TextStyle,

  bodyMedium: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  } as TextStyle,

  callout: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.callout,
    lineHeight: theme.lineHeight.callout,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  } as TextStyle,

  calloutSemibold: {
    fontFamily: theme.fonts.bodySemibold,
    fontSize: theme.fontSize.callout,
    lineHeight: theme.lineHeight.callout,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  } as TextStyle,

  subhead: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.subhead,
    lineHeight: theme.lineHeight.subhead,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  } as TextStyle,

  footnoteSemibold: {
    fontFamily: theme.fonts.bodySemibold,
    fontSize: theme.fontSize.footnote,
    lineHeight: theme.lineHeight.footnote,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  } as TextStyle,

  footnoteBold: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.footnote,
    lineHeight: theme.lineHeight.footnote,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  } as TextStyle,

  calloutBold: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.callout,
    lineHeight: theme.lineHeight.callout,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  } as TextStyle,

  caption1Semibold: {
    fontFamily: theme.fonts.bodySemibold,
    fontSize: theme.fontSize.caption1,
    lineHeight: theme.lineHeight.caption1,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.wide,
    color: theme.colors.textSecondary,
  } as TextStyle,

  // ── Small ───────────────────────────────────
  footnote: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.footnote,
    lineHeight: theme.lineHeight.footnote,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  } as TextStyle,

  caption1: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.caption1,
    lineHeight: theme.lineHeight.caption1,
    fontWeight: '500',
    letterSpacing: theme.letterSpacing.wide,
    color: theme.colors.textSecondary,
  } as TextStyle,

  caption2: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.caption2,
    lineHeight: theme.lineHeight.caption2,
    fontWeight: '500',
    letterSpacing: theme.letterSpacing.wide,
    color: theme.colors.textMuted,
  } as TextStyle,

  // ── Semantic: Screen-level ───────────────────
  /** "1 / 3" step indicator on onboarding, progress text */
  screenProgress: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.footnote,
    lineHeight: theme.lineHeight.footnote,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  } as TextStyle,

  /** Onboarding question, form page title (title2 weight 700) */
  screenQuestion: {
    fontFamily: theme.fonts.heading,
    fontSize: theme.fontSize.title2,
    lineHeight: theme.lineHeight.title2,
    fontWeight: '700',
    letterSpacing: theme.letterSpacing.snug,
    color: theme.colors.textPrimary,
  } as TextStyle,

  /** "RECEIPT INFO", uppercase section dividers */
  sectionLabel: {
    fontFamily: theme.fonts.bodySemibold,
    fontSize: theme.fontSize.caption1,
    lineHeight: theme.lineHeight.caption1,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.wider,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
  } as TextStyle,

  /** Uppercase floating labels above inputs */
  fieldLabel: {
    fontFamily: theme.fonts.bodySemibold,
    fontSize: theme.fontSize.caption2,
    lineHeight: theme.lineHeight.caption2,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.wider,
    textTransform: 'uppercase',
    color: theme.colors.textTertiary,
  } as TextStyle,

  /** Center-header title on sheet/modal screens */
  sheetTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  } as TextStyle,

  /** Large mono amount display ($1,234.56) */
  monoAmount: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSize.jumbo,
    lineHeight: theme.lineHeight.jumbo,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  } as TextStyle,

  /** Inline validation error below a field */
  fieldError: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.caption1,
    lineHeight: theme.lineHeight.caption1,
    fontWeight: '400',
    color: theme.colors.red,
  } as TextStyle,

  // ── Special ─────────────────────────────────
  label: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.caption1,
    lineHeight: theme.lineHeight.caption1,
    fontWeight: '500',
    letterSpacing: theme.letterSpacing.wider,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
  } as TextStyle,

  micro: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.micro,
    lineHeight: theme.lineHeight.micro,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
  } as TextStyle,

  mono: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    fontWeight: '400',
    color: theme.colors.textPrimary,
  } as TextStyle,

  monoBold: {
    fontFamily: theme.fonts.monoBold,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  } as TextStyle,
} as const
