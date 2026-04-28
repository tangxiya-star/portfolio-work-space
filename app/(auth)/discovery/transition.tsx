import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native'
import { useRef, useEffect, useCallback } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../../constants/theme'
import { preset, easing, stagger, distance } from '../../../constants/motion'
import { mockDiscovery } from '../../../mocks/data'
import Button from '../../../components/common/Button'

export default function TransitionScreen() {
  const deadlineDays = mockDiscovery.tax_deadline_days
  const isBeforeDeadline = deadlineDays > 0
  const isDeadlineDay = deadlineDays === 0

  // Parent entrance
  const parentOpacity = useRef(new Animated.Value(0)).current
  const parentTranslateY = useRef(new Animated.Value(distance.md)).current

  // Staggered children: title, subtitle, card1, card2, button
  const childAnims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(distance.xs),
    }))
  ).current

  // Exit
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(parentOpacity, { toValue: 1, ...preset.cardEnter }),
      Animated.timing(parentTranslateY, { toValue: 0, ...preset.cardEnter }),
    ]).start(() => {
      const animations = childAnims.flatMap((child, i) => [
        Animated.timing(child.opacity, { toValue: 1, delay: i * stagger.offset, ...preset.staggerChild }),
        Animated.timing(child.translateY, { toValue: 0, delay: i * stagger.offset, ...preset.staggerChild }),
      ])
      Animated.parallel(animations).start()
    })
  }, [])

  const handleStartTracking = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, ...preset.screenExit }),
      Animated.timing(scaleAnim, { toValue: 1.05, ...preset.screenExit }),
    ]).start(() => {
      router.replace('/(tabs)')
    })
  }, [fadeAnim, scaleAnim])

  return (
    <Animated.View style={[styles.animatedWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
    <Animated.View style={{ flex: 1, opacity: parentOpacity, transform: [{ translateY: parentTranslateY }] }}>
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Child 0: Title */}
        <Animated.View style={{ opacity: childAnims[0].opacity, transform: [{ translateY: childAnims[0].translateY }] }}>
          <Text style={styles.title}>How to get{'\n'}it back?</Text>
        </Animated.View>

        {/* Child 1: Subtitle */}
        <Animated.View style={{ opacity: childAnims[1].opacity, transform: [{ translateY: childAnims[1].translateY }] }}>
          <Text style={styles.subtitle}>
            {isBeforeDeadline || isDeadlineDay
              ? "We've identified two paths to recover your tax savings based on your history."
              : 'Your past deductions can still be recovered through amended returns.'}
          </Text>
        </Animated.View>

        {isBeforeDeadline || isDeadlineDay ? (
          <>
            {/* Child 2: 2025 card */}
            <Animated.View style={{ opacity: childAnims[2].opacity, transform: [{ translateY: childAnims[2].translateY }] }}>
              <View style={[styles.card2025, isDeadlineDay && styles.card2025Urgent]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.card2025Label}>2025 DEDUCTIONS</Text>
                  <View style={[styles.activeBadge, isDeadlineDay && styles.urgentBadge]}>
                    <Text style={[styles.activeBadgeText, isDeadlineDay && styles.urgentBadgeText]}>
                      {isDeadlineDay ? 'LAST DAY' : 'ACTIVE PATH'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.card2025Title}>
                  Claim directly on this year's tax return
                </Text>
                <Text style={styles.card2025Description}>
                  You can include these deductions in your current filing to reduce your tax bill immediately.
                </Text>

                <View style={styles.card2025Divider} />

                <Text style={[styles.deadlineDays, isDeadlineDay && styles.deadlineDaysUrgent]}>
                  {isDeadlineDay ? 'Today is the deadline' : `${deadlineDays} days left`}
                </Text>
                <Text style={styles.cardNote}>Deadline: April 15, 2026</Text>
              </View>
            </Animated.View>

            {/* Child 3: 2024 card */}
            <Animated.View style={{ opacity: childAnims[3].opacity, transform: [{ translateY: childAnims[3].translateY }] }}>
              <View style={styles.card2024}>
                <Text style={styles.cardLabel}>2024 AND EARLIER</Text>
                <Text style={styles.cardTitle}>
                  Recover via 1040–X amended return
                </Text>
                <Text style={styles.cardDescription}>
                  For past expenses, the IRS allows you to amend previous returns up to 3 years back to claim missed deductions.
                </Text>
                <Pressable onPress={() => {}}>
                  <Text style={styles.guideLink}>View step-by-step guide</Text>
                </Pressable>
              </View>
            </Animated.View>
          </>
        ) : (
          /* Post-deadline: both cards downgraded to 1040-X path */
          <>
            {/* Child 2: 2025 expired card */}
            <Animated.View style={{ opacity: childAnims[2].opacity, transform: [{ translateY: childAnims[2].translateY }] }}>
              <View style={styles.card2024}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardLabel}>2025 DEDUCTIONS</Text>
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredBadgeText}>DEADLINE PASSED</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>
                  Recover via 1040–X amended return
                </Text>
                <Text style={styles.cardDescription}>
                  The April 15 filing deadline has passed. You can still claim these deductions by filing an amended return (1040-X).
                </Text>
                <Pressable onPress={() => {}}>
                  <Text style={styles.guideLink}>View step-by-step guide</Text>
                </Pressable>
              </View>
            </Animated.View>

            {/* Child 3: 2024 card */}
            <Animated.View style={{ opacity: childAnims[3].opacity, transform: [{ translateY: childAnims[3].translateY }] }}>
              <View style={styles.card2024}>
                <Text style={styles.cardLabel}>2024 AND EARLIER</Text>
                <Text style={styles.cardTitle}>
                  Recover via 1040–X amended return
                </Text>
                <Text style={styles.cardDescription}>
                  For past expenses, the IRS allows you to amend previous returns up to 3 years back to claim missed deductions.
                </Text>
                <Pressable onPress={() => {}}>
                  <Text style={styles.guideLink}>View step-by-step guide</Text>
                </Pressable>
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>

      <Animated.View style={[styles.footer, { opacity: childAnims[4].opacity, transform: [{ translateY: childAnims[4].translateY }] }]}>
        <Button
          title="Start Tracking"
          onPress={handleStartTracking}
        />
      </Animated.View>
    </SafeAreaView>
    </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  animatedWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.jumbo,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.lineHeight.jumbo,
  },
  subtitle: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.callout,
    marginBottom: theme.spacing.xl,
  },
  card2025: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.ink,
    overflow: 'hidden',
  },
  card2025Urgent: {
    backgroundColor: theme.colors.redDark,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  activeBadge: {
    backgroundColor: theme.colors.greenBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },
  activeBadgeText: {
    ...theme.microLabel,
    color: theme.colors.green,
  },
  urgentBadge: {
    backgroundColor: theme.colors.redBg,
  },
  urgentBadgeText: {
    color: theme.colors.red,
  },
  expiredBadge: {
    backgroundColor: theme.colors.grayBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },
  expiredBadgeText: {
    ...theme.microLabel,
    color: theme.colors.textTertiary,
  },
  card2025Label: {
    ...theme.microLabel,
    color: theme.colors.textInverseTertiary,
    marginBottom: theme.spacing.sm,
  },
  card2025Title: {
    fontSize: theme.fontSize.title2,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.lineHeight.title2,
  },
  card2025Description: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textInverseSecondary,
    lineHeight: theme.lineHeight.footnote,
    marginBottom: theme.spacing.lg,
  },
  card2025Divider: {
    height: 1,
    backgroundColor: theme.colors.borderInverse,
    marginBottom: theme.spacing.md,
  },
  deadlineDays: {
    fontSize: theme.fontSize.headline,
    fontWeight: '700',
    color: theme.colors.green,
    marginBottom: theme.spacing.xs,
  },
  deadlineDaysUrgent: {
    color: theme.colors.red,
  },
  cardNote: {
    fontSize: theme.fontSize.caption2,
    color: theme.colors.textInverseQuaternary,
    lineHeight: theme.lineHeight.caption1,
  },
  card2024: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    ...theme.shadow.md,
  },
  cardLabel: {
    ...theme.microLabel,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.title2,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.lineHeight.title2,
  },
  cardDescription: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.footnote,
    marginBottom: theme.spacing.md,
  },
  guideLink: {
    fontSize: theme.fontSize.callout,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
})
