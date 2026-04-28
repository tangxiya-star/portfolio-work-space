import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'
import Button from '../../components/common/Button'

export default function ConnectScreen() {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = () => {
    if (connecting) return
    setConnecting(true)
    setError(null)
    // TODO: Implement Plaid Link — on success navigate, on failure show error
    setTimeout(() => {
      setConnecting(false)
      // Simulating success; replace with real Plaid flow
      router.push('/(auth)/loading')
    }, 1200)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Image
            source={require('../../assets/plaid-logo.png')}
            style={styles.plaidLogo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Connect Bank Accounts</Text>
        <Text style={styles.description}>
          Read-only access to transactions.{'\n'}
          Cannot transfer or move money.{'\n'}
          Disconnect anytime.
        </Text>

        <Text style={styles.hint}>
          Please connect all business-related accounts{'\n'}
          including personal cards and business accounts.
        </Text>
      </View>

      <View style={styles.footer}>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => setError(null)}>
              <Text style={styles.errorDismiss}>Dismiss</Text>
            </Pressable>
          </View>
        )}
        <Button
          title={error ? 'Try Again' : 'Connect Bank Account'}
          onPress={handleConnect}
          loading={connecting}
          style={{ marginBottom: theme.spacing.lg }}
        />

        <View style={styles.badges}>
          <Text style={styles.badge}>256-bit encryption</Text>
          <Text style={styles.badge}>Read-only</Text>
          <Text style={styles.badge}>Disconnect anytime</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrap: {
    marginBottom: theme.spacing.xl,
  },
  plaidLogo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: theme.fontSize.title2,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: theme.lineHeight.footnote,
    marginBottom: theme.spacing.xl,
  },
  hint: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.amber,
    textAlign: 'center',
    lineHeight: theme.lineHeight.footnote,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    marginBottom: theme.spacing['3xl'],
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  errorBanner: {
    backgroundColor: theme.colors.redBg,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    ...typography.footnote,
    color: theme.colors.red,
    flex: 1,
  },
  errorDismiss: {
    ...typography.footnoteSemibold,
    color: theme.colors.red,
    marginLeft: theme.spacing.md,
  },
  badge: {
    fontSize: theme.fontSize.micro,
    color: theme.colors.textSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.round,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
})
