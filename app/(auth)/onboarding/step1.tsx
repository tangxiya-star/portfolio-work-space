import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../../constants/theme'
import { typography } from '../../../constants/typography'
import Button from '../../../components/common/Button'
import SelectionCard from '../../../components/common/SelectionCard'
import { useOnboardingStep1 } from '../../../hooks/useOnboardingStep1'

const INCOME_OPTIONS = [
  { key: '1099', label: 'Self-employed income (1099)' },
  { key: 'side', label: 'Side income' },
  { key: 'W2', label: 'W-2 Salary' },
  { key: 'K1', label: 'K-1 Distribution' },
  { key: 'rental', label: 'Rental income' },
]

const ENTITY_OPTIONS = [
  { key: 'LLC', label: 'LLC (Single Member)' },
  { key: 'individual', label: 'Individual (No Entity)' },
  { key: 'S-Corp', label: 'S-Corp' },
  { key: 'partnership', label: 'Multi-member LLC / Partnership' },
]

const OCCUPATION_OPTIONS = [
  { key: '54', label: 'Professional Services (Consulting / Legal / Engineering)' },
  { key: '51', label: 'Information / Media / Software' },
  { key: '52', label: 'Finance / Insurance / Real Estate' },
  { key: '62', label: 'Healthcare / Health Services' },
  { key: '23', label: 'Construction' },
  { key: '31', label: 'Manufacturing' },
  { key: '44', label: 'Wholesale / Retail' },
  { key: '48', label: 'Transportation / Warehousing' },
  { key: '71', label: 'Arts / Entertainment / Food Service' },
  { key: '61', label: 'Education / Training' },
  { key: '11', label: 'Agriculture / Forestry / Fishing' },
  { key: '81', label: 'Other Services' },
]

export default function Step1Screen() {
  const {
    selectedIncome,
    selectedEntity,
    selectedOccupation,
    isValid,
    toggleIncome,
    setSelectedEntity,
    setSelectedOccupation,
    handleContinue,
  } = useOnboardingStep1()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.progress}>1 / 3</Text>

        <Text style={styles.question}>Income sources? (Select all)</Text>
        <View style={styles.optionGroup}>
          {INCOME_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.key}
              label={opt.label}
              selected={selectedIncome.includes(opt.key)}
              onPress={() => toggleIncome(opt.key)}
              mode="checkbox"
            />
          ))}
        </View>

        <Text style={styles.question}>What's your business type?</Text>
        <View style={styles.optionGroup}>
          {OCCUPATION_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.key}
              label={opt.label}
              selected={selectedOccupation === opt.key}
              onPress={() => setSelectedOccupation(opt.key)}
            />
          ))}
        </View>

        <Text style={styles.question}>Entity type?</Text>
        <View style={styles.optionGroup}>
          {ENTITY_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.key}
              label={opt.label}
              selected={selectedEntity === opt.key}
              onPress={() => setSelectedEntity(opt.key)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
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
  scroll: {
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
    marginBottom: theme.spacing.lg,
  },
  optionGroup: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing['2xl'],
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
})
