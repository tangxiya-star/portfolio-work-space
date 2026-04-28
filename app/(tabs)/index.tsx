import { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'
import { mockTaxSummaryByYear, mockTransactions, mockPlaidItems } from '../../mocks/data'
import SegmentedControl from '../../components/common/SegmentedControl'
import TransactionRow, { Transaction } from '../../components/common/TransactionRow'
import ReauthBanner from '../../components/common/ReauthBanner'
import SmallButton from '../../components/common/SmallButton'
import { useTaxStore } from '../../store/taxStore'

const AMBER = theme.colors.amber

function PendingPill({ count }: { count: number }) {
  return (
    <Pressable 
      style={({ pressed }) => [pendingStyles.pill, pressed && pendingStyles.pillPressed]}
      accessibilityRole="button"
      accessible={true}
    >
      {({ pressed }) => (
        <>
          <Ionicons name="alert-circle" size={16} color={pressed ? theme.colors.white : AMBER} />
          <Text style={[typography.footnote, pendingStyles.text, pressed && pendingStyles.textPressed]}>
            {count} items awaiting confirmation
          </Text>
          <Ionicons name="chevron-forward" size={14} color={pressed ? theme.colors.white : theme.colors.textTertiary} />
        </>
      )}
    </Pressable>
  )
}

const pendingStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    borderRadius: theme.radius.round,
    gap: theme.spacing.sm,
  },
  pillPressed: {
    backgroundColor: theme.colors.ink,
  },
  text: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  textPressed: {
    color: theme.colors.white,
  },
})

export default function HomeScreen() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const summary = mockTaxSummaryByYear[selectedYear] ?? mockTaxSummaryByYear[2026]
  const transactions = mockTransactions.transactions

  const reconnectedItemIds = useTaxStore((s) => s.reconnectedItemIds)

  const reauthAccounts = mockPlaidItems.items
    .filter((item) => item.status === 'reauth_required' && !reconnectedItemIds.includes(item.item_id))
    .map((item) => ({
      itemId: item.item_id,
      institutionName: item.institution_name,
      accountName: item.accounts[0]?.name ?? '',
    }))

  const yearOptions = [
    { label: '2026', value: 2026 },
    { label: '2025', value: 2025 },
    { label: '2024', value: 2024 },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[typography.micro, styles.pageLabel]}>TAX YEAR</Text>
              <View style={styles.headerRow}>
                <SegmentedControl
                  options={yearOptions}
                  value={selectedYear}
                  onChange={setSelectedYear}
                  variant="light"
                />
                <SmallButton
                  title="Add"
                  icon="add"
                  onPress={() => setShowAddMenu((v) => !v)}
                  accessibilityLabel="Add transaction"
                />
              </View>
            </View>

            {/* Reauth Banner */}
            <ReauthBanner accounts={reauthAccounts} />

            {/* Hero Card */}
            <View style={styles.heroCard}>
              <Text style={[typography.micro, styles.heroLabel]}>ESTIMATED TAX REDUCTION</Text>
              <Text style={[typography.display, styles.heroAmount]}>
                ${summary.estimated_tax_reduction.toLocaleString()}
              </Text>
              {summary.pending_count > 0 && (
                <PendingPill count={summary.pending_count} />
              )}
            </View>

            {/* Stats Grid */}
            <View style={styles.grid}>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={[typography.micro, styles.gridLabel]}>TOTAL INCOME</Text>
                  <Text style={[typography.title2, styles.gridValue]}>
                    ${summary.total_income.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[typography.micro, styles.gridLabel]}>DEDUCTIBLE</Text>
                  <Text style={[typography.title2, styles.gridValue]}>
                    ${summary.total_deductible.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridItem}>
                  <Text style={[typography.micro, styles.gridLabel]}>TAXABLE INCOME</Text>
                  <Text style={[typography.title2, styles.gridValue]}>
                    ${summary.taxable_income.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={[typography.micro, styles.gridLabel]}>STATUS</Text>
                  {reauthAccounts.length > 0 ? (
                    <View style={styles.statusRow}>
                      <Ionicons name="alert-circle" size={18} color={theme.colors.amber} />
                      <Text style={[typography.calloutSemibold, { color: theme.colors.amber }]}>Sync paused</Text>
                    </View>
                  ) : (
                    <View style={styles.statusRow}>
                      <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.green} />
                      <Text style={[typography.calloutSemibold, styles.statusText]}>Real-time</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <Text style={[typography.calloutSemibold, styles.sectionTitle]}>Recent Transactions</Text>
          </>
        }
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionRow item={item as Transaction} variant="standard" />
        )}
        contentContainerStyle={styles.listContent}
      />

      {showAddMenu && (
        <>
          <Pressable
            style={styles.overlay}
            onPress={() => setShowAddMenu(false)}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
          />
          <View style={styles.dropdown}>
            <Pressable
              style={({ pressed }) => [styles.dropdownItem, pressed && styles.dropdownItemPressed]}
              onPress={() => {
                setShowAddMenu(false)
                router.push('/add-expense')
              }}
              accessibilityRole="menuitem"
            >
              <Ionicons name="receipt-outline" size={18} color={theme.colors.textPrimary} />
              <Text style={styles.dropdownText}>Manual Expense</Text>
            </Pressable>
            <View style={styles.dropdownDivider} />
            <Pressable
              style={({ pressed }) => [styles.dropdownItem, pressed && styles.dropdownItemPressed]}
              onPress={() => {
                setShowAddMenu(false)
                router.push('/add-income')
              }}
              accessibilityRole="menuitem"
            >
              <Ionicons name="cash-outline" size={18} color={theme.colors.textPrimary} />
              <Text style={styles.dropdownText}>Add Income</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },

  // Header
  header: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  pageLabel: {
    color: theme.colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  dropdown: {
    position: 'absolute',
    top: 100,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    ...theme.shadow.lg,
    minWidth: 200,
    overflow: 'hidden',
    zIndex: 51,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 44,
  },
  dropdownItemPressed: {
    backgroundColor: theme.colors.surfaceDim,
  },
  dropdownText: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textPrimary,
  },
  dropdownDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
  // Hero
  heroCard: {
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  heroLabel: {
    color: theme.colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  heroAmount: {
    fontSize: theme.fontSize.hero,
    lineHeight: theme.lineHeight.hero,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },

  // Grid
  grid: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  gridRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  gridItem: {
    flex: 1,
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  gridLabel: {
    color: theme.colors.textInverseMuted,
    textTransform: 'uppercase',
    letterSpacing: theme.letterSpacing.wider,
    marginBottom: theme.spacing.sm,
  },
  gridValue: {
    fontSize: theme.fontSize.metric,
    color: theme.colors.white,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusText: {
    color: theme.colors.green,
  },

  // Transactions
  sectionTitle: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

})
