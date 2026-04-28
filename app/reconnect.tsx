import { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, Image, Animated, Easing } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { theme } from '../constants/theme'
import { typography } from '../constants/typography'
import { duration, easing as motionEasing, spring, preset } from '../constants/motion'
import Button from '../components/common/Button'
import SpinningLoader from '../components/common/SpinningLoader'
import { useTaxStore } from '../store/taxStore'

type Step = 'prompt' | 'processing' | 'success' | 'failed'

// ── Processing View (matches onboarding/loading.tsx) ───
function ProcessingView({ accountName, institutionName, onDone, onError }: {
  accountName: string
  institutionName: string
  onDone: () => void
  onError: () => void
}) {
  const [status, setStatus] = useState<'loading' | 'completed'>('loading')
  const cardAnim = useRef(new Animated.Value(0)).current
  const checkScale = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1, ...preset.headerEnterApple,
    }).start()

    Animated.timing(cardAnim, {
      toValue: 1, ...preset.cardEnterApple, delay: 200,
    }).start()

    const timer = setTimeout(() => {
      setStatus('completed')
      Animated.spring(checkScale, {
        toValue: 1, ...spring.snappy, useNativeDriver: false,
      }).start()
      setTimeout(onDone, 800)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const cardOpacity = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] })
  const cardTranslateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] })
  const headerTranslateY = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] })

  return (
    <View style={styles.processingContainer}>
      <Animated.View style={[styles.processingHeader, {
        opacity: headerAnim, transform: [{ translateY: headerTranslateY }],
      }]}>
        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed" size={10} color={theme.colors.green} />
          <Text style={styles.secureBadgeText}>SECURED BY PLAID</Text>
        </View>
        <Text style={[typography.title1, styles.processingTitle]}>Re-connecting{'\n'}your account</Text>
        <Text style={[typography.footnote, styles.processingSubtitle]}>
          Read-only access · Cannot move money
        </Text>
      </Animated.View>

      <Animated.View style={[styles.processingCard, {
        opacity: cardOpacity, transform: [{ translateY: cardTranslateY }],
      }]}>
        <View style={[styles.pIconCircle, status === 'completed' && styles.pIconCircleDone]}>
          <Text style={[styles.pIconInitial, status === 'completed' && { color: theme.colors.textInverse }]}>
            {institutionName.charAt(0)}
          </Text>
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={[typography.calloutSemibold, { color: theme.colors.textPrimary }]}>{accountName}</Text>
          <Text style={[typography.caption1, { color: theme.colors.textSecondary }]}>{institutionName}</Text>
        </View>
        <View style={styles.pStatusIcon}>
          {status === 'loading' && <SpinningLoader color={theme.colors.textSecondary} />}
          {status === 'completed' && (
            <Animated.View style={[styles.pCheckCircle, { transform: [{ scale: checkScale }] }]}>
              <Ionicons name="checkmark" size={14} color={theme.colors.white} />
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

export default function ReconnectScreen() {
  const { itemId, institutionName = 'Bank', accountName = 'Account' } = useLocalSearchParams<{
    itemId: string
    institutionName: string
    accountName: string
  }>()

  const [step, setStep] = useState<Step>('prompt')
  const markReconnected = useTaxStore((s) => s.markReconnected)

  const handleReconnect = () => {
    setStep('processing')
  }

  const handleSuccess = () => {
    if (itemId) markReconnected(String(itemId))
    setStep('success')
  }

  if (step === 'processing') {
    return (
      <SafeAreaView style={styles.container}>
        <ProcessingView
          accountName={String(accountName)}
          institutionName={String(institutionName)}
          onDone={handleSuccess}
          onError={() => setStep('failed')}
        />
      </SafeAreaView>
    )
  }

  if (step === 'failed') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[typography.headline, styles.headerTitle]}>Reconnect Account</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.body}>
          <View style={[styles.iconCircle, styles.iconCircleFailed]}>
            <Ionicons name="close" size={40} color={theme.colors.red} />
          </View>
          <Text style={[typography.title2, styles.failedTitle]}>Connection Failed</Text>
          <Text style={[typography.body, styles.bodyText]}>
            We couldn't reconnect to {institutionName}.{'\n'}Please try again.
          </Text>
        </View>
        <View style={styles.footer}>
          <Button title="Try Again" onPress={() => setStep('processing')} fullWidth />
        </View>
      </SafeAreaView>
    )
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[typography.headline, styles.headerTitle]}>Reconnect Account</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Success Content */}
        <View style={styles.body}>
          <View style={[styles.iconCircle, styles.iconCircleSuccess]}>
            <Ionicons name="checkmark" size={40} color={theme.colors.green} />
          </View>
          <Text style={[typography.title2, styles.successTitle]}>Reconnected</Text>
          <Text style={[typography.body, styles.bodyText]}>
            {institutionName} data sync has resumed.{'\n'}All historical records are preserved.
          </Text>
        </View>

        {/* Bottom Button */}
        <View style={styles.footer}>
          <Button title="Back to Home" onPress={() => router.replace('/(tabs)')} fullWidth />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={[typography.headline, styles.headerTitle]}>Reconnect Account</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Prompt Content */}
      <View style={styles.body}>
        <Image
          source={require('../assets/plaid-logo.png')}
          style={styles.plaidLogo}
          resizeMode="contain"
        />
        <Text style={[typography.title2, styles.promptTitle]}>
          {institutionName} Requires Re-verification
        </Text>
        <Text style={[typography.body, styles.bodyText]}>
          Your bank requires periodic re-authorization.{'\n'}This is a standard security measure.
        </Text>
        <Text style={[typography.calloutSemibold, styles.reassurance]}>
          Data will auto-restore after reconnecting.{'\n'}No historical records will be lost.
        </Text>
      </View>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        <Button title="Reconnect Account" onPress={handleReconnect} fullWidth />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Processing
  processingContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },
  processingHeader: {
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
    ...typography.micro,
    color: theme.colors.green,
  },
  processingTitle: {
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  processingSubtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  processingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...theme.shadow.md,
  },
  pIconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surfaceDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pIconCircleDone: {
    backgroundColor: theme.colors.ink,
  },
  pIconInitial: {
    ...typography.headline,
    fontWeight: '700',
    color: theme.colors.textTertiary,
  },
  pStatusIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },

  // Body
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing['2xl'],
  },
  plaidLogo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.round,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconCircleSuccess: {
    borderColor: theme.colors.green,
  },
  iconCircleFailed: {
    borderColor: theme.colors.red,
  },
  failedTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  promptTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  bodyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  reassurance: {
    textAlign: 'center',
    color: theme.colors.amber,
  },

  // Footer
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  footerHint: {
    color: theme.colors.textTertiary,
  },
})
