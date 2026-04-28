import { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'
import { duration } from '../../constants/motion'
import { mockTaxReportByYear, mockTaxSummaryByYear } from '../../mocks/data'
import SegmentedControl from '../../components/common/SegmentedControl'
import Button from '../../components/common/Button'
import TransactionRow, { type Transaction } from '../../components/common/TransactionRow'

const categoryIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Software': 'laptop-outline',
  'Meals': 'restaurant-outline',
  'Travel': 'airplane-outline',
  'Office': 'briefcase-outline',
  'Personal': 'cart-outline',
  'Income': 'cash-outline',
}

// ── Local micro-interactions (retained) ───────────────
function ScalePress({
  onPress,
  style,
  children,
}: {
  onPress: () => void
  style?: object | object[]
  children: React.ReactNode
}) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} accessibilityRole="button">
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

function ExpandSection({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: duration.fast,
      useNativeDriver: true,
    }).start()
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  )
}

export default function ReportScreen() {
  const [selectedYear, setSelectedYear] = useState(2026)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const report = mockTaxReportByYear[selectedYear] ?? mockTaxReportByYear[2026]
  const summary = mockTaxSummaryByYear[selectedYear] ?? mockTaxSummaryByYear[2026]

  const yearOptions = [
    { label: '2026', value: 2026 },
    { label: '2025', value: 2025 },
    { label: '2024', value: 2024 },
  ]

  const toggleCategory = (name: string) => {
    setExpandedCategory((prev) => (prev === name ? null : name))
  }

  const filteredCategories = report.categories.filter(
    (cat) => cat.name !== 'Pending'
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SegmentedControl
          options={yearOptions}
          value={selectedYear}
          onChange={setSelectedYear}
          variant="light"
        />

        {/* Hero Card */}
        <View style={styles.heroContainer}>
          <Text style={[typography.monoBold, styles.heroAmount]}>
            ${summary.estimated_tax_reduction.toLocaleString()}
          </Text>
          <Text style={styles.heroLabel}>Estimated Tax Reduction</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[typography.calloutSemibold, styles.sectionTitle]}>
              Spending by Category
            </Text>
          </View>

          {filteredCategories.map((cat) => {
            const iconName = categoryIconMap[cat.name] || 'help-circle-outline'
            const isExpanded = expandedCategory === cat.name
            return (
              <View key={cat.name}>
                <ScalePress onPress={() => toggleCategory(cat.name)} style={styles.categoryRow}>
                  <View style={styles.categoryIconContainer}>
                    <Ionicons name={iconName} size={20} color={theme.colors.textSecondary} />
                  </View>
                  <View style={styles.categoryLeft}>
                    <Text style={[typography.callout, styles.categoryName]}>
                      {cat.name} · {cat.transaction_count} items
                    </Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={[typography.mono, styles.categoryAmount]}>
                      ${cat.total_amount.toLocaleString()}
                    </Text>
                    <Text style={[typography.caption1, styles.categorySavings]}>
                      Saved ${Math.round(cat.tax_savings).toLocaleString()}
                    </Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-forward'}
                    size={16}
                    color={theme.colors.textTertiary}
                    style={styles.categoryChevron}
                  />
                </ScalePress>

                <ExpandSection visible={isExpanded}>
                  <View style={styles.expandedSection}>
                    {cat.transactions.length > 0 ? (
                      cat.transactions.map((txn) => (
                        <TransactionRow
                          key={txn.id}
                          item={txn as Transaction}
                          variant="compact"
                        />
                      ))
                    ) : (
                      <Text style={styles.expandedEmpty}>
                        {cat.transaction_count} transactions in this category
                      </Text>
                    )}
                  </View>
                </ExpandSection>
              </View>
            )
          })}
        </View>

        {/* Tax Calculation */}
        <View style={[styles.section, { marginTop: theme.spacing['2xl'] }]}>
          <Text style={[typography.calloutSemibold, styles.sectionTitle]}>Tax Calculation</Text>

          <View style={styles.calcContent}>
          <CalcRow
            label="Total Income"
            value={`$${report.total_income.toLocaleString()}`}
          />
          <CalcRow
            label="Deductible Expenses"
            value={`-$${report.total_deductible.toLocaleString()}`}
            valueColor={theme.colors.green}
          />

          <View style={styles.calcDivider} />

          <CalcRow
            label="Taxable Income"
            value={`$${report.taxable_income.toLocaleString()}`}
            medium
          />

          {/* Tax Breakdown */}
          <Text style={styles.calcSubheading}>Tax Breakdown</Text>

          <CalcRow
            label={`Federal Tax ${report.federal_rate}`}
            value={`$${report.federal_tax.toLocaleString()}`}
          />
          <CalcRow
            label={`Self-Employment Tax ${report.se_rate}`}
            value={`$${report.self_employment_tax.toLocaleString()}`}
          />
          <CalcRow
            label={`${report.state} State Tax ${report.state_rate}`}
            value={`$${report.state_tax.toLocaleString()}`}
          />

          <View style={styles.calcDividerBold} />

          <CalcRow
            label="Estimated Annual Tax"
            value={`$${report.estimated_total.toLocaleString()}`}
            bold
          />
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          To claim prior-year deductions, file an amended return via Form 1040-X.
        </Text>

        {/* Filing Guide */}
        <ScalePress onPress={() => {}} style={styles.guideCard}>
          <View style={styles.guideContent}>
            <Text style={[typography.calloutSemibold, styles.guideTitle]}>Self-Filing Guide</Text>
            <Text style={[typography.footnote, styles.guideText]}>
              Schedule C · Schedule SE · Schedule 1 line references
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.amber}
          />
        </ScalePress>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Export PDF"
            variant="secondary"
            onPress={() => {}}
            style={styles.actionBtn}
          />
          <Button
            title="Share with CPA"
            variant="primary"
            onPress={() => {}}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function CalcRow({
  label,
  value,
  bold,
  medium,
  valueColor,
}: {
  label: string
  value: string
  bold?: boolean
  medium?: boolean
  valueColor?: string
}) {
  const labelStyle = bold
    ? [typography.callout, { color: theme.colors.textPrimary }]
    : medium
    ? [typography.callout, { color: theme.colors.textPrimary }]
    : [typography.footnote, styles.calcLabel]

  const valueStyle = bold
    ? [typography.monoBold, styles.calcValueBold]
    : medium
    ? [typography.mono, styles.calcValueMedium]
    : [typography.mono, styles.calcValue]

  return (
    <View style={[styles.calcRow, bold && styles.calcRowBold]}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={[valueStyle, valueColor ? { color: valueColor } : undefined]}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },
  heroContainer: {
    marginTop: theme.spacing.xl,
  },
  heroAmount: {
    fontSize: theme.fontSize.jumbo,
    lineHeight: theme.lineHeight.jumbo,
    color: theme.colors.green,
  },
  heroLabel: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  categoryLeft: {
    flex: 1,
  },
  categoryName: {
    color: theme.colors.textPrimary,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  categorySavings: {
    color: theme.colors.green,
    marginTop: theme.spacing.xxs,
  },
  categoryChevron: {
    marginLeft: theme.spacing.sm,
  },
  expandedSection: {
    paddingLeft: 44 + theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  expandedEmpty: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
    paddingVertical: theme.spacing.md,
  },
  calcContent: {
    paddingLeft: theme.spacing.lg,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: theme.spacing.sm,
  },
  calcRowBold: {
    paddingVertical: theme.spacing.md,
  },
  calcLabel: {
    color: theme.colors.textSecondary,
  },
  calcValue: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textPrimary,
  },
  calcValueMedium: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textPrimary,
  },
  calcValueBold: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textPrimary,
  },
  calcSubheading: {
    ...typography.label,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  calcDivider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing.xs,
  },
  calcDividerBold: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: theme.spacing.sm,
  },
  note: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
    lineHeight: theme.lineHeight.caption1,
    marginBottom: theme.spacing.xl,
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.amberBg,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.amberBorder,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    color: theme.colors.amber,
    marginBottom: theme.spacing.xs,
  },
  guideText: {
    color: theme.colors.amber,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
})
