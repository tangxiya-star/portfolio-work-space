import { useState, useRef } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../constants/theme'
import { typography } from '../constants/typography'
import { mockTransactions } from '../mocks/data'
import Button from '../components/common/Button'

type Transaction = typeof mockTransactions.transactions[number]

// ── Header ──────────────────────────────────────────────
function DetailHeader({ isPending }: { isPending: boolean }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
      </Pressable>
      <Text style={styles.headerTitle}>
        {isPending ? 'Pending Expense' : 'Expense Detail'}
      </Text>
      <View style={{ width: 60 }} />
    </View>
  )
}

// ── Transaction Summary ─────────────────────────────────
function TransactionSummary({ txn }: { txn: Transaction }) {
  return (
    <View style={styles.summary}>
      <Text style={styles.merchantName}>{txn.merchant_name}</Text>
      <Text style={styles.amount}>
        ${Math.abs(txn.amount).toFixed(2)}
      </Text>
      <Text style={styles.meta}>
        {txn.date} · {txn.account?.name} ****{txn.account?.mask}
      </Text>
    </View>
  )
}

// ── Tax Classification Cards (Confirmed) ───────────────
function TaxClassificationCards({
  txn,
  selectedIndex,
  onSelect,
}: {
  txn: Transaction
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  const card = txn.card
  if (!card) return null

  // Build dynamic branches from the confirmed card data
  const branches: Array<{
    category: string
    deductible_pct: number
    deductible_amount: number
    tax_savings: number
    irs_publication: string | null
    irs_description: string
  }> = [
    {
      category: card.category,
      deductible_pct: card.deductible_pct,
      deductible_amount: card.deductible_amount,
      tax_savings: card.deductible_amount * 0.24,
      irs_publication: card.irs_publication,
      irs_description: card.irs_description,
    },
    {
      category: 'Personal',
      deductible_pct: 0,
      deductible_amount: 0,
      tax_savings: 0,
      irs_publication: null,
      irs_description: 'Personal expense — not deductible',
    },
  ]

  const isUserDeclared = card.judgment_source === 'user'

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>What type of expense is this?</Text>
      {branches.map((branch, i) => {
        const isSelected = selectedIndex === i
        const hasSavings = branch.tax_savings > 0
        return (
          <Pressable
            key={branch.category}
            style={[
              styles.branchCard,
              isSelected && styles.branchCardSelected,
            ]}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
          >
            <View style={styles.branchHeader}>
              <Text style={[styles.branchCategory, isSelected && styles.branchCategorySelected]}>
                {branch.category}
              </Text>
              {hasSavings && (
                <Text style={styles.branchSavings}>
                  Save ${branch.tax_savings.toFixed(2)}
                </Text>
              )}
            </View>
            <Text style={styles.branchDescription}>
              {hasSavings
                ? `Deductible $${branch.deductible_amount.toFixed(2)} · ${branch.deductible_pct}%`
                : branch.irs_description}
            </Text>
            {hasSavings && branch.irs_publication && (
              <Text style={styles.branchIrs}>
                {branch.irs_publication} · {branch.irs_description}
              </Text>
            )}
          </Pressable>
        )
      })}

      {isUserDeclared && (
        <Text style={styles.userDeclaredHint}>
          You classified this expense manually.
        </Text>
      )}
    </View>
  )
}

// ── Evidence Chain (Confirmed) ──────────────────────────
function EvidenceChain({ txn }: { txn: Transaction }) {
  const card = txn.card
  if (!card) return null

  const isUserDeclared = card.judgment_source === 'user'
  const hasPendingChanges = 'pending_changes' in card && card.pending_changes

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Evidence Chain</Text>

      {/* Layer 1: Bank Record */}
      <View style={styles.evidenceNode}>
        <View style={styles.evidenceDot} />
        <View style={styles.evidenceContent}>
          <Text style={styles.evidenceLabel}>Bank Record</Text>
          <Text style={styles.evidenceText}>
            {txn.account?.name} ****{txn.account?.mask} · {txn.plaid_transaction_id}
          </Text>
        </View>
      </View>
      <View style={styles.evidenceLine} />

      {/* Layer 2: AI / User Classification */}
      <View style={styles.evidenceNode}>
        <View style={styles.evidenceDot} />
        <View style={styles.evidenceContent}>
          <Text style={styles.evidenceLabel}>
            {isUserDeclared
              ? hasPendingChanges
                ? 'User Declaration (Modified)'
                : 'User Declaration'
              : 'AI Classification'}
          </Text>
          <Text style={[styles.evidenceText, isUserDeclared && styles.evidenceHighlight]}>
            {isUserDeclared
              ? `"${card.user_declaration}"`
              : `${txn.merchant_name} → ${card.category} → ${card.deductible_pct}% business expense`}
          </Text>
        </View>
      </View>
      <View style={styles.evidenceLine} />

      {/* Layer 3: IRS Reference */}
      <View style={styles.evidenceNode}>
        <View style={styles.evidenceDot} />
        <View style={styles.evidenceContent}>
          <Text style={styles.evidenceLabel}>IRS Reference</Text>
          <Text style={styles.evidenceText}>
            {card.irs_publication} · {card.irs_description}
          </Text>
        </View>
      </View>
    </View>
  )
}

// ── Edit Confirm ──────────────────────────────────────
function EditConfirm({
  txn,
  category,
  deductiblePct,
  declaration,
  onConfirm,
  onBack,
}: {
  txn: Transaction
  category: string
  deductiblePct: number
  declaration: string
  onConfirm: () => void
  onBack: () => void
}) {
  const [saving, setSaving] = useState(false)
  const absAmount = Math.abs(txn.amount)
  const deductibleAmount = absAmount * (deductiblePct / 100)
  const taxSavings = deductibleAmount * 0.24

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Review Changes</Text>

      <View style={styles.confirmCard}>
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Category</Text>
          <Text style={styles.confirmValue}>{category}</Text>
        </View>
        <View style={styles.confirmDivider} />
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Deductible</Text>
          <Text style={styles.confirmValue}>{deductiblePct}% · ${deductibleAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.confirmDivider} />
        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>Est. Tax Savings</Text>
          <Text style={[styles.confirmValue, { color: theme.colors.green }]}>${taxSavings.toFixed(2)}</Text>
        </View>
        {declaration !== '' && (
          <>
            <View style={styles.confirmDivider} />
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Your reason</Text>
              <Text style={styles.confirmValue} numberOfLines={2}>{declaration}</Text>
            </View>
          </>
        )}
      </View>

      <Text style={styles.confirmDisclaimer}>
        You are responsible for the accuracy of this classification. Changes are logged in the evidence chain.
      </Text>

      <Button
        title="Save"
        onPress={() => {
          if (saving) return
          setSaving(true)
          // Simulate API delay; real app would await here
          setTimeout(() => {
            setSaving(false)
            onConfirm()
          }, 600)
        }}
        loading={saving}
        style={{ marginTop: theme.spacing.lg }}
      />
      <Pressable onPress={onBack} style={styles.cancelButton} disabled={saving}>
        <Text style={[styles.cancelText, saving && { opacity: 0.3 }]}>Go Back</Text>
      </Pressable>
    </View>
  )
}

// ── Edit Form (Confirmed) ──────────────────────────────
const CATEGORY_OPTIONS = ['Software', 'Travel', 'Meals', 'Office', 'Advertising', 'Insurance', 'Utilities', 'Other']

function EditForm({
  txn,
  onSave,
  onCancel,
}: {
  txn: Transaction
  onSave: (category: string, pct: number) => void
  onCancel: () => void
}) {
  const card = txn.card
  const absAmount = Math.abs(txn.amount)

  const [category, setCategory] = useState(card?.category ?? '')
  const [deductiblePct, setDeductiblePct] = useState(card?.deductible_pct ?? 100)
  const [declaration, setDeclaration] = useState(card?.user_declaration ?? '')
  const [step, setStep] = useState<'edit' | 'confirm'>('edit')

  const pctOptions = [100, 50, 0]
  const deductibleAmount = absAmount * (deductiblePct / 100)

  // Track if any field changed from its initial value
  const isDirty = category !== (card?.category ?? '') ||
    deductiblePct !== (card?.deductible_pct ?? 100) ||
    declaration !== (card?.user_declaration ?? '')

  const handleCancel = () => {
    if (!isDirty) { onCancel(); return }
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes that will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onCancel },
      ]
    )
  }

  if (step === 'confirm') {
    return (
      <EditConfirm
        txn={txn}
        category={category}
        deductiblePct={deductiblePct}
        declaration={declaration}
        onConfirm={() => {
          // TODO: call API to update classification
          onSave(category, deductiblePct)
        }}
        onBack={() => setStep('edit')}
      />
    )
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Edit Classification</Text>

      {/* Category */}
      <Text style={styles.editFieldLabel}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContainer}
      >
        {CATEGORY_OPTIONS.map((opt) => (
          <Pressable
            key={opt}
            style={[styles.chip, category === opt && styles.chipSelected]}
            onPress={() => setCategory(opt)}
            accessibilityRole="button"
          >
            <Text style={[styles.chipText, category === opt && styles.chipTextSelected]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Deductible % */}
      <Text style={styles.editFieldLabel}>Deductible %</Text>
      <View style={styles.pctRow}>
        {pctOptions.map((pct) => (
          <Pressable
            key={pct}
            style={[styles.pctChip, deductiblePct === pct && styles.pctChipSelected]}
            onPress={() => setDeductiblePct(pct)}
          >
            <Text style={[styles.pctChipText, deductiblePct === pct && styles.pctChipTextSelected]}>
              {pct}%
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.editHint}>
        Deductible: ${deductibleAmount.toFixed(2)}
      </Text>

      {/* Declaration */}
      <Text style={styles.editFieldLabel}>Your reason (optional)</Text>
      <TextInput
        style={styles.declarationInput}
        value={declaration}
        onChangeText={setDeclaration}
        placeholder="e.g. Client dinner for Q2 contract"
        placeholderTextColor={theme.colors.textTertiary}
        multiline
        numberOfLines={2}
      />

      {/* Actions */}
      <Button
        title="Review"
        onPress={() => setStep('confirm')}
        style={{ marginTop: theme.spacing.xl }}
      />
      <Pressable onPress={handleCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  )
}

// ── Branch Selection (Pending) ──────────────────────────
function BranchSelection({
  txn,
  selectedBranch,
  onSelect,
}: {
  txn: Transaction
  selectedBranch: number | null
  onSelect: (index: number) => void
}) {
  const branches = (txn as { suggested_branches?: Array<{
    category: string
    deductible_pct: number
    deductible_amount: number
    tax_savings: number
    irs_publication: string | null
    irs_description: string
  }> }).suggested_branches
  if (!branches) return null

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>What type of expense is this?</Text>
      {branches.map((branch, i) => {
        const isSelected = selectedBranch === i
        const hasSavings = branch.tax_savings > 0
        return (
          <Pressable
            key={branch.category}
            style={[
              styles.branchCard,
              isSelected && styles.branchCardSelected,
            ]}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
          >
            <View style={styles.branchHeader}>
              <Text style={[styles.branchCategory, isSelected && styles.branchCategorySelected]}>
                {branch.category === 'Travel' ? 'Business Travel' : branch.category}
              </Text>
              {hasSavings && (
                <Text style={styles.branchSavings}>
                  Save ${branch.tax_savings.toFixed(2)}
                </Text>
              )}
            </View>
            <Text style={styles.branchDescription}>
              {hasSavings
                ? `Deductible $${branch.deductible_amount.toFixed(2)} · ${branch.deductible_pct}% · ${branch.irs_publication}`
                : branch.irs_description}
            </Text>
          </Pressable>
        )
      })}

      <Button
        title="Confirm"
        onPress={() => {
          // TODO: Submit selection via API
          router.back()
        }}
        disabled={selectedBranch === null}
        style={{ marginTop: theme.spacing.xl }}
      />
    </View>
  )
}

// ── Main Screen ─────────────────────────────────────────
export default function TransactionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [confirmedSelection, setConfirmedSelection] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState<{ category: string; pct: number } | null>(null)

  const txn = mockTransactions.transactions.find((t) => t.id === id)
  if (!txn) {
    return (
      <SafeAreaView style={styles.container}>
        <DetailHeader isPending={false} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const isPending = txn.status === 'pending'
  const isIncome = txn.is_income

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successScreen}>
          <Ionicons name="checkmark-circle" size={64} color={theme.colors.green} />
          <Text style={styles.successTitle}>Classification Updated</Text>
          <Text style={styles.successSubtitle}>
            {showSuccess.category} · {showSuccess.pct}% deductible
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <DetailHeader isPending={isPending} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TransactionSummary txn={txn} />

        {isPending ? (
          <BranchSelection
            txn={txn}
            selectedBranch={selectedBranch}
            onSelect={setSelectedBranch}
          />
        ) : isIncome ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Type</Text>
            <View style={styles.incomeTag}>
              <Text style={styles.incomeTagText}>Income</Text>
            </View>
          </View>
        ) : (
          <>
            {isEditing ? (
              <EditForm
                txn={txn}
                onSave={(cat, pct) => {
                  setShowSuccess({ category: cat, pct })
                  setTimeout(() => {
                    setShowSuccess(null)
                    setIsEditing(false)
                  }, 1500)
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                <TaxClassificationCards
                  txn={txn}
                  selectedIndex={confirmedSelection}
                  onSelect={setConfirmedSelection}
                />
                <EvidenceChain txn={txn} />
                <Button
                  title="Save Changes"
                  onPress={() => setIsEditing(true)}
                  style={{ marginTop: theme.spacing.lg }}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// ── Styles ──────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
  },

  // Summary
  summary: {
    marginBottom: theme.spacing['2xl'],
  },
  merchantName: {
    ...typography.title1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    ...typography.monoAmount,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
  },

  // Section
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    ...typography.footnoteSemibold,
    color: theme.colors.amber,
    marginBottom: theme.spacing.md,
  },

  // Evidence Chain
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
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xxs,
  },
  evidenceText: {
    ...typography.footnote,
    color: theme.colors.textPrimary,
    lineHeight: theme.lineHeight.footnote,
  },
  evidenceHighlight: {
    color: theme.colors.amber,
    fontStyle: 'italic',
  },
  evidenceLine: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
  },

  // Branch Selection (Pending)
  branchCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  branchCardSelected: {
    borderColor: theme.colors.ink,
    borderWidth: 2,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  branchCategory: {
    ...typography.calloutBold,
    color: theme.colors.textPrimary,
  },
  branchCategorySelected: {
    color: theme.colors.textPrimary,
  },
  branchSavings: {
    ...typography.footnoteBold,
    color: theme.colors.green,
  },
  branchDescription: {
    ...typography.caption1,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.caption1,
  },
  branchIrs: {
    ...typography.caption2,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xxs,
    lineHeight: theme.lineHeight.caption2,
  },
  userDeclaredHint: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },

  // Edit Form
  editFieldLabel: {
    ...typography.caption1Semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  chipScroll: {
    marginBottom: theme.spacing.xs,
  },
  chipContainer: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.xl,
  },
  chip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  chipText: {
    ...typography.footnote,
    color: theme.colors.textPrimary,
  },
  chipTextSelected: {
    color: theme.colors.surface,
  },
  pctRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pctChip: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  pctChipSelected: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  pctChipText: {
    ...typography.footnoteSemibold,
    color: theme.colors.textPrimary,
  },
  pctChipTextSelected: {
    color: theme.colors.surface,
  },
  editHint: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
  declarationInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textPrimary,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  cancelText: {
    ...typography.callout,
    color: theme.colors.textSecondary,
  },

  // Confirm
  confirmCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  confirmLabel: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
  },
  confirmValue: {
    ...typography.footnoteSemibold,
    color: theme.colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  confirmDivider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  confirmDisclaimer: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
  },
  successScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    ...typography.headline,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  successSubtitle: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
  },

  // Income
  incomeTag: {
    backgroundColor: theme.colors.greenBg,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xs,
  },
  incomeTagText: {
    ...typography.footnoteSemibold,
    color: theme.colors.green,
  },
})
