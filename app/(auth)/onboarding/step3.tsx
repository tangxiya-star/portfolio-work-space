import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../../constants/theme'
import { typography } from '../../../constants/typography'
import Button from '../../../components/common/Button'
import SelectionCard from '../../../components/common/SelectionCard'

const YEAR_OPTIONS = [
  { key: 2024, label: '2024 or earlier' },
  { key: 2025, label: '2025' },
  { key: 2026, label: '2026 (just started)' },
]

export default function Step3Screen() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const handleFinish = () => {
    // TODO: POST /users/tax-settings with all onboarding data
    router.push('/(auth)/connect')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.progress}>3 / 3</Text>

        <Text style={styles.question}>
          When did you start filing{'\n'}with this status?
        </Text>
        <Text style={styles.helper}>
          Used to determine the starting point for historical data analysis
        </Text>

        <View style={styles.optionGroup}>
          {YEAR_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.key}
              label={opt.label}
              selected={selectedYear === opt.key}
              onPress={() => setSelectedYear(opt.key)}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Complete Setup"
          onPress={handleFinish}
          disabled={selectedYear === null}
        />
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
  },
  progress: {
    ...typography.screenProgress,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  question: {
    ...typography.screenQuestion,
    marginBottom: theme.spacing.md,
  },
  helper: {
    ...typography.footnote,
    marginBottom: theme.spacing.xl,
  },
  optionGroup: {
    gap: theme.spacing.sm,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
})
