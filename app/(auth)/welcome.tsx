import { View, Text, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'
import GoogleIcon from '../../components/GoogleIcon'
import Logo from '../../components/Logo'

export default function WelcomeScreen() {
  const handleAppleSignIn = () => {
    // TODO: Implement Apple Sign In
    router.push('/(auth)/onboarding/step1')
  }

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign In
    router.push('/(auth)/onboarding/step1')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Logo size={64} />
        <Text style={[typography.caption2, styles.brand]}>TAXPILOT</Text>
        <Text style={[typography.title1, styles.headline]}>
          Save up to{'\n'}
          <Text style={[typography.display, styles.greenText]}>$4,890</Text>{'\n'}
          on taxes this year
        </Text>
        <Text style={[typography.callout, styles.subtext]}>
          We scan your bank transactions,{'\n'}
          find every deductible expense,{'\n'}
          and tell you exactly how much to claim.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable 
          style={({ pressed }) => [styles.appleButton, pressed && styles.pressed]} 
          onPress={handleAppleSignIn}
          accessibilityRole="button"
          accessible={true}
        >
          <View style={styles.buttonInner}>
            <Text style={[typography.calloutSemibold, styles.appleButtonText]}>Continue with Apple</Text>
            <View style={styles.iconWrap}>
              <Ionicons name="logo-apple" size={20} color={theme.colors.textInverse} />
            </View>
          </View>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]} 
          onPress={handleGoogleSignIn}
          accessibilityRole="button"
          accessible={true}
        >
          <View style={styles.buttonInner}>
            <Text style={[typography.calloutSemibold, styles.googleButtonText]}>Continue with Google</Text>
            <View style={styles.iconWrap}>
              <GoogleIcon size={18} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => {}} accessibilityRole="link" accessible={true}>
          <Text style={[typography.footnote, styles.loginLink]}>Already have an account? <Text style={styles.loginAction}>Log in</Text></Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  headline: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  greenText: {
    color: theme.colors.green,
  },
  subtext: {
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.callout,
    textAlign: 'center',
  },
  actions: {
    paddingBottom: theme.spacing['2xl'],
    gap: theme.spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  appleButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 48,
  },
  appleButtonText: {
    color: theme.colors.textInverse,
    width: 180,
    textAlign: 'left',
  },
  googleButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 48,
  },
  googleButtonText: {
    color: theme.colors.textPrimary,
    width: 180,
    textAlign: 'left',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconWrap: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLink: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    paddingVertical: theme.spacing.sm,
    minHeight: 44, // increase touch target
  },
  loginAction: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
})
