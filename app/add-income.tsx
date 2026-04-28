import { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Animated, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { theme } from '../constants/theme'
import { typography } from '../constants/typography'
import { duration, easing } from '../constants/motion'
import Button from '../components/common/Button'

const SCREEN_HEIGHT = Dimensions.get('window').height

type IncomeType = 'k1' | 'cash' | 'other'

const INCOME_TYPES: { value: IncomeType; label: string; description: string }[] = [
  { value: 'k1', label: 'K-1 Distribution', description: 'Partnership / S-Corp / LLC' },
  { value: 'cash', label: 'Cash / Check Income', description: '' },
  { value: 'other', label: 'Other Platform Income', description: 'No 1099 issued' },
]

export default function AddIncomeScreen() {
  const scrimOpacity = useRef(new Animated.Value(0)).current
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scrimOpacity, {
        toValue: 1,
        duration: duration.fast,
        easing: easing.enter,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: duration.normal,
        easing: easing.enter,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(scrimOpacity, {
        toValue: 0,
        duration: duration.fast,
        easing: easing.exit,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: duration.normal,
        easing: easing.exit,
        useNativeDriver: true,
      }),
    ]).start(() => router.back())
  }, [])

  const [incomeType, setIncomeType] = useState<IncomeType>('k1')

  // K-1 fields
  const [sourceName, setSourceName] = useState('')
  const [taxYear, setTaxYear] = useState('2025')
  const [ordinaryIncome, setOrdinaryIncome] = useState('')
  const [rentalIncome, setRentalIncome] = useState('')
  const [interestIncome, setInterestIncome] = useState('')
  const [capitalGains, setCapitalGains] = useState('')

  // Cash/Other fields
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const isK1Valid = sourceName.trim() !== '' && ordinaryIncome.trim() !== '' && !isNaN(parseFloat(ordinaryIncome))
  const isCashValid = description.trim() !== '' && amount.trim() !== '' && !isNaN(parseFloat(amount)) && date.trim() !== ''
  const isValid = incomeType === 'k1' ? isK1Valid : isCashValid

  const handleSubmit = () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      // TODO: replace with real API call; on failure set setSubmitError('message')
      dismiss()
    }, 800)
  }

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, { opacity: scrimOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
        <View style={styles.grabber} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headerTitle}>Add Income</Text>

          {/* Income Type Selection */}
          <Text style={styles.sectionLabel}>Income Type</Text>
          {INCOME_TYPES.map((type) => {
            const isSelected = incomeType === type.value
            return (
              <Pressable
                key={type.value}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => setIncomeType(type.value)}
              >
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <View style={styles.typeContent}>
                  <Text style={styles.typeLabel}>{type.label}</Text>
                  {type.description !== '' && (
                    <Text style={styles.typeDescription}>({type.description})</Text>
                  )}
                </View>
              </Pressable>
            )
          })}

          {/* K-1 Form */}
          {incomeType === 'k1' && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: theme.spacing.xl }]}>
                K-1 Basic Info
              </Text>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Source Entity</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={sourceName}
                  onChangeText={setSourceName}
                  placeholder="Hawky LLC"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Tax Year</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={taxYear}
                  onChangeText={setTaxYear}
                  placeholder="2025"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="number-pad"
                />
              </View>

              <Text style={[styles.sectionLabel, { marginTop: theme.spacing.xl }]}>
                Income / Loss (fill in applicable fields)
              </Text>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Ordinary Business Income</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={ordinaryIncome}
                  onChangeText={setOrdinaryIncome}
                  placeholder="$0"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Net Rental Income</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={rentalIncome}
                  onChangeText={setRentalIncome}
                  placeholder="Optional"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Interest Income</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={interestIncome}
                  onChangeText={setInterestIncome}
                  placeholder="Optional"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Capital Gains</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={capitalGains}
                  onChangeText={setCapitalGains}
                  placeholder="Optional"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>
            </>
          )}

          {/* Cash / Other Form */}
          {incomeType !== 'k1' && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: theme.spacing.xl }]}>
                Income Details
              </Text>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Source Description</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g. Freelance design fee"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Amount</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="$0.00"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>Date</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="Mar 12, 2026"
                  placeholderTextColor={theme.colors.textMuted}
                />
              </View>
            </>
          )}

          {submitError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{submitError}</Text>
              <Pressable onPress={() => setSubmitError(null)}>
                <Text style={styles.errorBannerDismiss}>Dismiss</Text>
              </Pressable>
            </View>
          )}

          <Button
            title="Add Income"
            onPress={handleSubmit}
            disabled={!isValid}
            loading={submitting}
            style={{ marginTop: theme.spacing['2xl'] }}
          />
          <Text style={styles.submitNote}>Report updates in real time after submission</Text>
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    height: '85%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    ...typography.sheetTitle,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
  },
  sectionLabel: {
    ...typography.footnote,
    marginBottom: theme.spacing.md,
  },

  // Type selection
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  typeCardSelected: {
    borderColor: theme.colors.ink,
    borderWidth: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.button,
    borderWidth: 1.5,
    borderColor: theme.colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.ink,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  typeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  typeLabel: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
  },
  typeDescription: {
    ...typography.footnote,
    marginLeft: theme.spacing.xs,
  },

  // Fields
  fieldCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    ...typography.footnote,
    minWidth: 80,
  },
  fieldInput: {
    flex: 1,
    ...typography.footnoteSemibold,
    color: theme.colors.textPrimary,
    textAlign: 'right',
    padding: 0,
  },

  submitNote: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  errorBanner: {
    backgroundColor: theme.colors.redBg,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  errorBannerText: {
    ...typography.footnote,
    color: theme.colors.red,
    flex: 1,
  },
  errorBannerDismiss: {
    ...typography.footnoteSemibold,
    color: theme.colors.red,
    marginLeft: theme.spacing.md,
  },
})
