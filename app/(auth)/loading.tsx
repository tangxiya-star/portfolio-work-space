import { useEffect, useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import { duration, easing, spring, preset } from '../../constants/motion'
import Button from '../../components/common/Button'
import SpinningLoader from '../../components/common/SpinningLoader'

// ── Config ──────────────────────────────────────────────
const MOCK_ACCOUNTS = [
  { name: 'Chase Checking', last4: '8821', type: 'PERSONAL', institution: 'Chase' },
  { name: 'Chase Sapphire', last4: '4402', type: 'CREDIT', institution: 'Chase' },
  { name: 'Business Checking', last4: '1190', type: 'BUSINESS', institution: 'Chase' },
]

const CONNECT_DURATION = duration.sequence
const INITIAL_DELAY = duration.spinner
const POST_COMPLETE_DELAY = duration.slow

type AccountStatus = 'pending' | 'loading' | 'completed'

// ── Account Card ────────────────────────────────────────
function AccountCard({
  account,
  status,
  index,
}: {
  account: typeof MOCK_ACCOUNTS[0]
  status: AccountStatus
  index: number
}) {
  // All JS-driven (useNativeDriver: false) because we animate colors & shadowOpacity
  const anim = useRef(new Animated.Value(0)).current // 0=pending, 1=loading, 2=completed
  const checkScale = useRef(new Animated.Value(0)).current
  const entranceAnim = useRef(new Animated.Value(0)).current

  const prevStatus = useRef<AccountStatus>('pending')

  // Card entrance stagger
  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      ...preset.cardEnterApple,
      delay: index * 120,
    }).start()
  }, [])

  // Status transitions
  useEffect(() => {
    if (status === 'loading') {
      Animated.timing(anim, {
        toValue: 1,
        duration: duration.normal,
        easing: easing.apple,
        useNativeDriver: false,
      }).start()
    }

    if (prevStatus.current === 'loading' && status === 'completed') {
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

  // Interpolations from single anim value
  const cardOpacity = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.4, 1, 1],
  })

  const cardScale = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [1, 1.02, 1],
  })

  const shadowOp = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 0.15, 0.05],
  })

  const iconBg = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [theme.colors.surfaceDim, theme.colors.ink, theme.colors.ink],
  })

  const iconTint = anim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      'rgba(13,13,13,0.5)',
      'rgba(255,255,255,1)',
      'rgba(255,255,255,1)',
    ],
  })

  const entranceTranslateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: Animated.multiply(entranceAnim, cardOpacity),
          transform: [
            { scale: Animated.multiply(entranceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }), cardScale) },
            { translateY: entranceTranslateY },
          ],
          shadowOpacity: shadowOp,
        },
      ]}
    >
      {/* Left: Institution initial */}
      <Animated.View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Animated.Text style={[styles.iconInitial, { color: iconTint }]}>
          {account.institution.charAt(0)}
        </Animated.Text>
      </Animated.View>

      {/* Center: Text */}
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle}>{account.name}</Text>
        <Text style={styles.cardSubtitle}>
          {account.type} · ···· {account.last4}
        </Text>
      </View>

      {/* Right: Status indicator */}
      <View style={styles.statusIcon}>
        {status === 'loading' && (
          <SpinningLoader color={theme.colors.textSecondary} />
        )}
        {status === 'completed' && (
          <Animated.View
            style={[
              styles.checkCircle,
              { transform: [{ scale: checkScale }] },
            ]}
          >
            <Ionicons name="checkmark" size={14} color={theme.colors.white} />
          </Animated.View>
        )}
      </View>
    </Animated.View>
  )
}

// ── Main Screen ─────────────────────────────────────────
export default function LoadingScreen() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const allDone = activeIndex >= MOCK_ACCOUNTS.length

  const buttonAnim = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(0)).current

  // Header entrance
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      ...preset.headerEnterApple,
    }).start()
  }, [])

  // Start chain
  useEffect(() => {
    const timer = setTimeout(() => setActiveIndex(0), INITIAL_DELAY)
    return () => clearTimeout(timer)
  }, [])

  // Sequential chain
  useEffect(() => {
    if (activeIndex < 0 || activeIndex >= MOCK_ACCOUNTS.length) return
    const timer = setTimeout(() => {
      setActiveIndex((prev) => prev + 1)
    }, CONNECT_DURATION)
    return () => clearTimeout(timer)
  }, [activeIndex])

  // Button reveal
  useEffect(() => {
    if (!allDone) return
    const timer = setTimeout(() => {
      Animated.spring(buttonAnim, {
        toValue: 1,
        ...spring.reveal,
        useNativeDriver: true,
      }).start()
    }, POST_COMPLETE_DELAY)
    return () => clearTimeout(timer)
  }, [allDone])

  const getStatus = useCallback(
    (i: number): AccountStatus => {
      if (i < activeIndex) return 'completed'
      if (i === activeIndex) return 'loading'
      return 'pending'
    },
    [activeIndex]
  )

  const handleStart = () => {
    router.replace('/(auth)/analyzing')
  }

  const headerTranslateY = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  })

  const buttonTranslateY = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  })

  return (
    <SafeAreaView style={styles.container}>
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
          <View style={styles.secureBadge}>
            <Ionicons name="lock-closed" size={10} color={theme.colors.green} />
            <Text style={styles.secureBadgeText}>SECURED BY PLAID</Text>
          </View>
          <Text style={styles.title}>Connecting your{'\n'}accounts</Text>
          <Text style={styles.subtitle}>
            Read-only access · Cannot move money
          </Text>
        </Animated.View>

        {/* Account Cards */}
        <View style={styles.cards}>
          {MOCK_ACCOUNTS.map((account, i) => (
            <AccountCard
              key={account.name}
              account={account}
              status={getStatus(i)}
              index={i}
            />
          ))}
        </View>

        {/* Bottom CTA */}
        <Animated.View
          style={[
            styles.buttonWrap,
            {
              opacity: buttonAnim,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
          pointerEvents={allDone ? 'auto' : 'none'}
        >
          <Button
            title="Start Analysis"
            onPress={handleStart}
            icon="arrow-forward"
          />
        </Animated.View>
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
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.greenBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
    marginBottom: theme.spacing.lg,
  },
  secureBadgeText: {
    fontSize: theme.fontSize.micro,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.wider,
    color: theme.colors.green,
  },
  title: {
    fontSize: theme.fontSize.title1,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: theme.letterSpacing.snug,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  cards: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing['3xl'],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: theme.colors.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInitial: {
    fontSize: theme.fontSize.headline,
    fontWeight: '700',
  },
  cardTextWrap: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  cardTitle: {
    fontSize: theme.fontSize.callout,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    letterSpacing: theme.letterSpacing.snug,
  },
  cardSubtitle: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textSecondary,
  },
  statusIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrap: {
    paddingHorizontal: theme.spacing.sm,
  },
})
