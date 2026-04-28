import { View, Text, StyleSheet, Animated } from 'react-native'
import { useRef, useEffect, useCallback } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../../constants/theme'
import { preset, duration, easing, stagger, distance } from '../../../constants/motion'
import { mockDiscoveryAllPending } from '../../../mocks/data'
import Button from '../../../components/common/Button'

export default function Case3Screen() {
  const data = mockDiscoveryAllPending

  // Parent container
  const parentOpacity = useRef(new Animated.Value(0)).current
  const parentTranslateY = useRef(new Animated.Value(distance.md)).current

  // Staggered children (5 elements)
  const childAnims = useRef(
    Array.from({ length: 5 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(distance.xs),
    }))
  ).current

  // Exit anims
  const exitOpacity = useRef(new Animated.Value(1)).current
  const exitScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Parent entrance
    Animated.parallel([
      Animated.timing(parentOpacity, { toValue: 1, ...preset.cardEnter }),
      Animated.timing(parentTranslateY, { toValue: 0, ...preset.cardEnter }),
    ]).start(() => {
      // Staggered children
      const childAnimations = childAnims.flatMap((child, i) => [
        Animated.timing(child.opacity, {
          toValue: 1,
          delay: i * stagger.offset,
          ...preset.staggerChild,
        }),
        Animated.timing(child.translateY, {
          toValue: 0,
          delay: i * stagger.offset,
          ...preset.staggerChild,
        }),
      ])
      Animated.parallel(childAnimations).start()
    })
  }, [])

  const handleStartConfirming = useCallback(() => {
    Animated.parallel([
      Animated.timing(exitOpacity, { toValue: 0, ...preset.screenExit }),
      Animated.timing(exitScale, { toValue: 0.95, ...preset.screenExit }),
    ]).start(() => {
      router.replace('/(tabs)')
    })
  }, [exitOpacity, exitScale])

  return (
    <Animated.View style={[styles.exitWrap, { opacity: exitOpacity, transform: [{ scale: exitScale }] }]}>
      <Animated.View style={[styles.screen, { opacity: parentOpacity, transform: [{ translateY: parentTranslateY }] }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            {/* Child 0: Intro */}
            <Animated.View style={{ opacity: childAnims[0].opacity, transform: [{ translateY: childAnims[0].translateY }] }}>
              <Text style={styles.intro}>
                In the past 14 months we found
              </Text>
            </Animated.View>

            {/* Child 1: Count */}
            <Animated.View style={{ opacity: childAnims[1].opacity, transform: [{ translateY: childAnims[1].translateY }] }}>
              <Text style={styles.count}>{data.pending_count} items</Text>
            </Animated.View>

            {/* Child 2: Subtitle */}
            <Animated.View style={{ opacity: childAnims[2].opacity, transform: [{ translateY: childAnims[2].translateY }] }}>
              <Text style={styles.subtitle}>
                Potential deduction opportunities that need your confirmation
              </Text>
            </Animated.View>

            {/* Child 3: Placeholder card */}
            <Animated.View style={{ opacity: childAnims[3].opacity, transform: [{ translateY: childAnims[3].translateY }] }}>
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderAmount}>$???</Text>
                <Text style={styles.placeholderNote}>
                  We can calculate your exact tax savings once you confirm them
                </Text>
              </View>
            </Animated.View>

            {/* Child 4: CTA explanation + button */}
            <Animated.View style={{ opacity: childAnims[4].opacity, transform: [{ translateY: childAnims[4].translateY }] }}>
              <Text style={styles.explainText}>
                Tell me the purpose of each expense and I'll determine if it's deductible
              </Text>
              <Button
                title="Start Confirming"
                onPress={handleStartConfirming}
              />
            </Animated.View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  exitWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    ...theme.card,
    marginHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  intro: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
  },
  count: {
    fontSize: theme.fontSize.jumbo,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.callout,
    marginBottom: theme.spacing.lg,
  },
  placeholderCard: {
    backgroundColor: theme.colors.surfaceDim,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  placeholderAmount: {
    fontSize: theme.fontSize.feature,
    fontWeight: '700',
    color: theme.colors.amber,
    marginBottom: theme.spacing.sm,
  },
  placeholderNote: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textTertiary,
    lineHeight: theme.lineHeight.footnote,
    textAlign: 'center',
  },
  explainText: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.callout,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
})
