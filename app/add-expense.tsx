import { useState, useRef, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Animated, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { theme } from '../constants/theme'
import { typography } from '../constants/typography'
import { duration, easing } from '../constants/motion'
import Button from '../components/common/Button'

const SCREEN_HEIGHT = Dimensions.get('window').height

export default function AddExpenseScreen() {
  const [merchantName, setMerchantName] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [declaration, setDeclaration] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

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

  const amountNum = parseFloat(amount)
  const isAmountValid = amount.trim() !== '' && !isNaN(amountNum) && amountNum > 0
  const isDateValid = date.trim() !== '' && /^\d{2}\/\d{2}\/\d{4}$/.test(date.trim())
  const isMerchantValid = merchantName.trim() !== ''
  const isValid = isMerchantValid && isAmountValid && isDateValid

  const handleSubmit = () => {
    // Mark all fields as touched to show any remaining errors
    setTouched({ merchant: true, amount: true, date: true })
    if (!isValid) return

    setSubmitting(true)
    // Navigate after brief delay to show loading
    setTimeout(() => {
      setSubmitting(false)
      router.push({
        pathname: '/expense-confirm',
        params: {
          merchant: merchantName,
          amount,
          date,
          declaration,
        },
      })
    }, 300)
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
          <Text style={styles.headerTitle}>Manual Expense</Text>

        <Text style={styles.sectionTitle}>RECEIPT INFO</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.floatingLabel}>MERCHANT</Text>
          <View style={[styles.inputCard, touched.merchant && !isMerchantValid && styles.inputCardError]}>
            <Ionicons name="storefront-outline" size={18} color={theme.colors.textMuted} />
            <TextInput
              style={styles.inputText}
              value={merchantName}
              onChangeText={setMerchantName}
              onBlur={() => setTouched(p => ({ ...p, merchant: true }))}
              placeholder="e.g. Parking · Terminal A"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
          {touched.merchant && !isMerchantValid && (
            <Text style={styles.fieldError}>Merchant name is required</Text>
          )}
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>AMOUNT</Text>
            <View style={[styles.inputCard, touched.amount && !isAmountValid && styles.inputCardError]}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                style={styles.inputText}
                value={amount}
                onChangeText={setAmount}
                onBlur={() => setTouched(p => ({ ...p, amount: true }))}
                placeholder="0.00"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
            {touched.amount && !isAmountValid && (
              <Text style={styles.fieldError}>{amount.trim() === '' ? 'Required' : 'Invalid amount'}</Text>
            )}
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.floatingLabel}>DATE</Text>
            <View style={[styles.inputCard, touched.date && !isDateValid && styles.inputCardError]}>
              <Ionicons name="calendar-outline" size={18} color={theme.colors.textMuted} />
              <TextInput
                style={styles.inputText}
                value={date}
                onChangeText={setDate}
                onBlur={() => setTouched(p => ({ ...p, date: true }))}
                placeholder="03/12/2026"
                placeholderTextColor={theme.colors.textMuted}
              />
            </View>
            {touched.date && !isDateValid && (
              <Text style={styles.fieldError}>{date.trim() === '' ? 'Required' : 'Use MM/DD/YYYY'}</Text>
            )}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: theme.spacing.xl }]}>
          DECLARE PURPOSE
        </Text>
        <Text style={styles.sectionSubtitle}>You are responsible for this declaration</Text>

        <View style={styles.inputGroup}>
          <View style={[styles.inputCard, styles.declarationCard]}>
            <TextInput
              style={[styles.inputText, styles.declarationInput]}
              value={declaration}
              onChangeText={setDeclaration}
              placeholder="e.g. NYC business trip, 3-day airport parking"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        <Button
          title="Add Expense"
          onPress={handleSubmit}
          disabled={!isValid}
          loading={submitting}
          style={{ marginTop: theme.spacing['2xl'] }}
        />
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
    height: '60%',
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
  sectionTitle: {
    ...typography.sectionLabel,
    marginBottom: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  floatingLabel: {
    ...typography.fieldLabel,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.lg,
  },
  inputCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputCardError: {
    borderColor: theme.colors.red,
  },
  fieldError: {
    ...typography.fieldError,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.lg,
  },
  inputText: {
    flex: 1,
    fontSize: theme.fontSize.callout,
    color: theme.colors.textPrimary,
    padding: 0,
  },
  currencyPrefix: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textMuted,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  declarationCard: {
    minHeight: 56,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
  },
  declarationInput: {
    minHeight: 36,
    textAlignVertical: 'top',
  },
})