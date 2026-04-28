import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../constants/theme'
import { typography } from '../constants/typography'
import Button from '../components/common/Button'
import { mockTransactions } from '../mocks/data'

export default function ExpenseConfirmScreen() {
  const { merchant, amount, date, declaration } = useLocalSearchParams<{
    merchant: string
    amount: string
    date: string
    declaration: string
  }>()

  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = () => {
    if (submitting) return
    setSubmitting(true)
    // Create a new transaction entry
    const newId = `txn_manual_${Date.now()}`
    const newTxn = {
      id: newId,
      merchant_name: merchant || '',
      amount: -(Number(amount) || 0),
      date: date || '',
      source: 'manual' as const,
      status: 'confirmed' as const,
      is_income: false,
      plaid_transaction_id: `manual_${newId}`,
      account: { name: 'Manual Entry', mask: '0000' },
      card: {
        category: 'Pending',
        deductible_pct: 0,
        deductible_amount: 0,
        judgment_source: 'user' as const,
        user_declaration: declaration || null,
        irs_publication: null,
        irs_description: 'Pending AI classification',
        confidence: 'low' as const,
        submit_status: 'pending_submit' as const,
      },
    }

    // Add to mock data (in real app this would be an API call)
    mockTransactions.transactions.unshift(newTxn as typeof mockTransactions.transactions[number])

    // Dismiss all modals then navigate to the new transaction detail
    router.dismissAll()
    setTimeout(() => {
      router.push({ pathname: '/detail', params: { id: newId } })
    }, 100)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Expense</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.merchantName}>{merchant}</Text>
          <Text style={styles.amount}>${Number(amount).toFixed(2)}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        {/* Evidence Chain */}
        <Text style={styles.sectionTitle}>EVIDENCE CHAIN</Text>

        <View style={styles.evidenceNode}>
          <View style={styles.evidenceDot} />
          <View style={styles.evidenceContent}>
            <Text style={styles.evidenceLabel}>Entry Source</Text>
            <Text style={styles.evidenceText}>
              {merchant} · ${amount} · {date} · Manual Entry
            </Text>
          </View>
        </View>
        <View style={styles.evidenceLine} />

        <View style={styles.evidenceNode}>
          <View style={styles.evidenceDot} />
          <View style={styles.evidenceContent}>
            <Text style={styles.evidenceLabel}>User Declaration</Text>
            <Text style={styles.evidenceTextHighlight}>
              &quot;{declaration}&quot;
            </Text>
          </View>
        </View>
        <View style={styles.evidenceLine} />

        <View style={styles.evidenceNode}>
          <View style={styles.evidenceDot} />
          <View style={styles.evidenceContent}>
            <Text style={styles.evidenceLabel}>IRS Reference</Text>
            <Text style={styles.evidenceTextMuted}>
              Will be matched by AI after submission
            </Text>
          </View>
        </View>

        <Button
          title="Submit Expense"
          onPress={handleConfirm}
          loading={submitting}
          style={{ marginTop: theme.spacing['2xl'] }}
        />

        <Pressable onPress={() => router.back()} style={styles.editLink}>
          <Text style={styles.editLinkText}>Edit Details</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },

  // Summary
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
    alignItems: 'center',
  },
  merchantName: {
    ...typography.title3,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    ...typography.monoAmount,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
  },

  // Evidence
  sectionTitle: {
    ...typography.sectionLabel,
    color: theme.colors.amber,
    marginBottom: theme.spacing.xl,
  },
  evidenceNode: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  evidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.xs,
  },
  evidenceContent: {
    flex: 1,
  },
  evidenceLabel: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xxs,
  },
  evidenceText: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textPrimary,
    lineHeight: theme.lineHeight.footnote,
  },
  evidenceTextHighlight: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.amber,
    fontStyle: 'italic',
    lineHeight: theme.lineHeight.footnote,
  },
  evidenceTextMuted: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textTertiary,
    lineHeight: theme.lineHeight.footnote,
  },
  evidenceLine: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.xs,
    marginVertical: theme.spacing.sm,
  },

  // Actions
  editLink: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  editLinkText: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
  },
})
