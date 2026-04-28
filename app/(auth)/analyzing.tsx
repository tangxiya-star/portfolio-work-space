import { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import { duration, easing, spring, preset } from '../../constants/motion'
import SpinningLoader from '../../components/common/SpinningLoader'

// ── Config ──────────────────────────────────────────────
const STEPS = [
  { label: 'Identifying deductible expenses', duration: 3000 },
  { label: 'Calculating potential tax savings', duration: 2500 },
  { label: 'Generating final report', duration: 2000 },
]

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

// ── Scanning Line ───────────────────────────────────────
function ScanLine() {
  const translateY = useRef(new Animated.Value(-2)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: duration.sweep,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [])

  return (
    <Animated.View
      style={[styles.scanLine, { transform: [{ translateY }] }]}
      pointerEvents="none"
    />
  )
}

// ── Step Card ───────────────────────────────────────────
type StepStatus = 'pending' | 'active' | 'completed'

function StepCard({
  label,
  stepNumber,
  status,
  index,
}: {
  label: string
  stepNumber: number
  status: StepStatus
  index: number
}) {
  // All JS-driven for color interpolation
  const anim = useRef(new Animated.Value(0)).current // 0=pending, 1=active, 2=completed
  const checkScale = useRef(new Animated.Value(0)).current
  const entranceAnim = useRef(new Animated.Value(0)).current

  const prevStatus = useRef<StepStatus>('pending')

  // Staggered entrance
  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      ...preset.cardEnterApple,
      delay: 400 + index * 100,
    }).start()
  }, [])

  useEffect(() => {
    if (status === 'active') {
      Animated.timing(anim, {
        toValue: 1,
        duration: duration.normal,
        easing: easing.apple,
        useNativeDriver: false,
      }).start()
    }

    if (prevStatus.current === 'active' && status === 'completed') {
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 2,
          duration: duration.slow,
          easing: easing.apple,
          useNativeDriver: false,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          ...spring.snappy,
          useNativeDriver: false,
        }),
      ]).start()
    }

    prevStatus.current = status
  }, [status])

  const cardOpacity = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.35, 1, 0.8],
  })

  const cardBg = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0)'],
  })

  const cardTranslateY = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, -4, 0],
  })

  const shadowOp = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 0.12, 0],
  })

  const entranceTranslateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })

  return (
    <Animated.View
      style={[
        styles.stepCard,
        {
          opacity: Animated.multiply(entranceAnim, cardOpacity),
          backgroundColor: cardBg,
          shadowOpacity: shadowOp,
          transform: [
            { translateY: Animated.add(entranceTranslateY, cardTranslateY) },
          ],
        },
      ]}
    >
      {/* Left: number + icon */}
      <View style={styles.stepLeft}>
        <View style={styles.stepIconWrap}>
          {status === 'active' ? (
            <SpinningLoader size={16} />
          ) : status === 'completed' ? (
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.green} />
            </Animated.View>
          ) : (
            <Text style={styles.stepNumber}>{stepNumber}</Text>
          )}
        </View>
      </View>

      {/* Center: label */}
      <View style={styles.stepCenter}>
        <Text
          style={[
            styles.stepLabel,
            status === 'active' && styles.stepLabelActive,
            status === 'completed' && styles.stepLabelCompleted,
          ]}
        >
          {label}
        </Text>
      </View>

    </Animated.View>
  )
}

// ── Main Screen ─────────────────────────────────────────
export default function AnalyzingScreen() {
  const [stepIndex, setStepIndex] = useState(0)
  const allDone = stepIndex >= STEPS.length

  // Header entrance
  const headerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      ...preset.headerEnterApple,
    }).start()
  }, [])

  // Sequential step progression
  useEffect(() => {
    if (stepIndex >= STEPS.length) return
    const timer = setTimeout(() => {
      setStepIndex((prev) => prev + 1)
    }, STEPS[stepIndex].duration)
    return () => clearTimeout(timer)
  }, [stepIndex])

  // Navigate after all done
  useEffect(() => {
    if (!allDone) return
    const timer = setTimeout(() => {
      router.replace('/(auth)/discovery')
    }, 800)
    return () => clearTimeout(timer)
  }, [allDone])

  const getStatus = (i: number): StepStatus => {
    if (i < stepIndex) return 'completed'
    if (i === stepIndex && !allDone) return 'active'
    return 'pending'
  }

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })

  return (
    <SafeAreaView style={styles.container}>
      {/* Scan line overlay */}
      <ScanLine />

      {/* Dot grid background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, row) => (
          <View key={row} style={styles.dotRow}>
            {Array.from({ length: 12 }).map((_, col) => (
              <View key={col} style={styles.dot} />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.content}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <Text style={styles.title}>Analyzing your{'\n'}transaction records</Text>
          <Text style={styles.range}>From January 2024 to now</Text>

        </Animated.View>

        {/* Step Cards */}
        <View style={styles.steps}>
          {STEPS.map((step, i) => (
            <StepCard
              key={step.label}
              label={step.label}
              stepNumber={i + 1}
              status={getStatus(i)}
              index={i}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: theme.colors.greenBg,
    zIndex: 10,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 18,
  },
  dot: {
    width: 1.5,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: theme.colors.dotBg,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  title: {
    fontSize: theme.fontSize.title1,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: theme.letterSpacing.snug,
    marginBottom: theme.spacing.sm,
  },
  range: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  steps: {
    gap: theme.spacing.sm,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 6,
  },
  stepLeft: {
    width: 24,
    alignItems: 'center',
  },
  stepIconWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
    fontWeight: '600',
  },
  stepCenter: {
    flex: 1,
  },
  stepLabel: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textTertiary,
    letterSpacing: theme.letterSpacing.snug,
  },
  stepLabelActive: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
})
