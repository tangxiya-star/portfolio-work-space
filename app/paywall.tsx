import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../constants/theme'
import { typography } from '../constants/typography'

type Plan = 'monthly' | 'annual'

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: Plan
  isSelected: boolean
  onSelect: () => void
}) {
  const isAnnual = plan === 'annual'

  return (
    <Pressable
      style={[styles.planCard, isSelected && styles.planCardSelected]}
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      {isAnnual && (
        <View style={styles.saveBadge}>
          <Text style={styles.saveBadgeText}>Save 25%</Text>
        </View>
      )}
      <Text style={styles.planLabel}>{isAnnual ? 'Annual' : 'Monthly'}</Text>
      <Text style={[typography.monoBold, styles.planPrice]}>
        ${isAnnual ? '179' : '19.99'}
      </Text>
      <Text style={styles.planUnit}>/{isAnnual ? 'year' : 'month'}</Text>
    </Pressable>
  )
}

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('annual')

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Text style={styles.trialText}>Your trial has ended</Text>
        <Text style={[typography.title1, styles.heroTitle]}>You've discovered</Text>
        <Text style={styles.heroAmount}>$?,???</Text>
        <Text style={styles.heroSubtitle}>in potential tax savings</Text>

        {/* Blurred preview cards */}
        <View style={styles.previewCard}>
          <View style={styles.blurLine} />
          <View style={[styles.blurLine, { width: '70%' }]} />
          <View style={[styles.blurLine, { width: '85%' }]} />
          <View style={styles.lockRow}>
            <Ionicons name="lock-closed" size={14} color={theme.colors.textTertiary} />
            <Text style={styles.lockText}>Subscribe to unlock all details</Text>
          </View>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.blurLine} />
          <View style={[styles.blurLine, { width: '55%' }]} />
          <View style={styles.lockRow}>
            <Ionicons name="lock-closed" size={14} color={theme.colors.textTertiary} />
            <Text style={styles.lockText}>? transactions awaiting review</Text>
          </View>
        </View>

        {/* Plan selection */}
        <View style={styles.planRow}>
          <PlanCard
            plan="annual"
            isSelected={selectedPlan === 'annual'}
            onSelect={() => setSelectedPlan('annual')}
          />
          <PlanCard
            plan="monthly"
            isSelected={selectedPlan === 'monthly'}
            onSelect={() => setSelectedPlan('monthly')}
          />
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}
          onPress={() => {
            // TODO: handle purchase
            router.back()
          }}
          accessibilityRole="button"
          accessibilityLabel="Subscribe"
        >
          <Text style={styles.ctaText}>Unlock All Tax Savings</Text>
        </Pressable>

        <Pressable style={styles.restoreBtn} onPress={() => {}} accessibilityRole="button" accessibilityLabel="Restore purchase">
          <Text style={styles.restoreText}>Restore purchase</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },

  // Hero
  trialText: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  heroAmount: {
    fontSize: theme.fontSize.feature,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textAlign: 'center',
    letterSpacing: theme.letterSpacing.snug,
  },
  heroSubtitle: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing['2xl'],
  },

  // Preview cards
  previewCard: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  blurLine: {
    height: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceDim,
    width: '100%',
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  lockText: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
  },

  // Plan selection
  planRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
  },
  planCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    overflow: 'visible',
  },
  planCardSelected: {
    borderColor: theme.colors.ink,
    borderWidth: 2,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: -1,
    backgroundColor: theme.colors.ink,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.radius.xs,
  },
  saveBadgeText: {
    fontSize: theme.fontSize.caption2,
    fontWeight: '700',
    color: theme.colors.surface,
  },
  planLabel: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xs,
  },
  planPrice: {
    fontSize: theme.fontSize.title2,
    color: theme.colors.textPrimary,
  },
  planUnit: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xxs,
  },

  // CTA
  ctaBtn: {
    width: '100%',
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  ctaText: {
    ...typography.bodyMedium,
    color: theme.colors.white,
    fontWeight: '700',
  },
  restoreBtn: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  restoreText: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
  },
})
