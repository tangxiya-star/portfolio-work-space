import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../../constants/theme'
import { typography } from '../../../constants/typography'
import Button from '../../../components/common/Button'
import SelectionCard from '../../../components/common/SelectionCard'

const FILING_STATUS_OPTIONS = [
  { key: 'single', label: 'Single' },
  { key: 'married_joint', label: 'Married Filing Jointly' },
  { key: 'married_separate', label: 'Married Filing Separately' },
]

// TODO: Full US states list
const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
]

export default function Step2Screen() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showStatePicker, setShowStatePicker] = useState(false)

  const isValid = selectedState !== null && selectedStatus !== null

  const handleContinue = () => {
    router.push('/(auth)/onboarding/step3')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessible={true}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>

        <Text style={styles.progress}>2 / 3</Text>

        <Text style={styles.question}>State + Filing Status</Text>

        <Text style={styles.label}>State</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowStatePicker(!showStatePicker)}
          accessibilityRole="button"
          accessibilityLabel="Select state"
        >
          <Text style={[styles.dropdownText, !selectedState && styles.dropdownPlaceholder]}>
            {selectedState ?? 'Select state'}
          </Text>
          <Ionicons
            name={showStatePicker ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
        {showStatePicker && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {STATES.map((state) => (
                <Pressable
                  key={state}
                  style={[styles.stateRow, selectedState === state && styles.stateRowSelected]}
                  onPress={() => {
                    setSelectedState(state)
                    setShowStatePicker(false)
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={state}
                >
                  <Text style={[styles.stateText, selectedState === state && styles.stateTextSelected]}>
                    {state}
                  </Text>
                  {selectedState === state && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.textPrimary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.label}>Filing Status</Text>
        <View style={styles.optionGroup}>
          {FILING_STATUS_OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.key}
              label={opt.label}
              selected={selectedStatus === opt.key}
              onPress={() => setSelectedStatus(opt.key)}
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
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    marginLeft: -theme.spacing.sm,
  },
  progress: {
    ...typography.screenProgress,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  question: {
    ...typography.screenQuestion,
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...typography.footnote,
    marginBottom: theme.spacing.sm,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  dropdownText: {
    ...typography.callout,
    color: theme.colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: theme.colors.textTertiary,
  },
  dropdownList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    marginBottom: theme.spacing.xl,
    marginTop: -theme.spacing.lg,
  },
  dropdownScroll: {
    maxHeight: 250,
  },
  optionGroup: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing['2xl'],
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  stateRowSelected: {
    backgroundColor: theme.colors.surfaceDim,
  },
  stateText: {
    ...typography.callout,
    color: theme.colors.textPrimary,
  },
  stateTextSelected: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
  },
})
