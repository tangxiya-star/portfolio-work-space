import { useRef } from 'react'
import { View, Text, StyleSheet, Pressable, SectionList, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'
import { duration, spring as motionSpring } from '../../constants/motion'
import { mockTransactions } from '../../mocks/data'
import TransactionRow, { Transaction } from '../../components/common/TransactionRow'
import { useCalendar, formatDateKey, formatSectionDate } from '../../hooks/useCalendar'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const allTransactions = mockTransactions.transactions

// ── Animated Day Cell ──────────────────────────────────
function DayCell({
  day,
  dateKey,
  isToday,
  isSelected,
  hasTxns,
  hasPending,
  onPress,
}: {
  day: number
  dateKey: string
  isToday: boolean
  isSelected: boolean
  hasTxns: boolean
  hasPending: boolean
  onPress: (key: string) => void
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.85,
      duration: duration.instant,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      ...motionSpring.snappy,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable
      style={styles.dayCell}
      onPress={() => onPress(dateKey)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={`${day}`}
    >
      <Animated.View
        style={[
          styles.dayCircle,
          isSelected && styles.dayCircleSelected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={[
          styles.dayText,
          hasTxns && styles.dayTextBold,
          isToday && !isSelected && styles.dayTextToday,
          isSelected && styles.dayTextSelected,
        ]}>
          {day}
        </Text>
      </Animated.View>
      <View style={styles.dotRow}>
        {hasPending && <View style={styles.amberDot} />}
        {hasTxns && !hasPending && <View style={styles.greenDotSmall} />}
      </View>
    </Pressable>
  )
}

// ── Main Screen ────────────────────────────────────────
export default function CalendarScreen() {
  const {
    currentYear,
    currentMonth,
    monthName,
    selectedDate,
    listKey,
    todayKey,
    calendarDays,
    dateMap,
    sections,
    listSubtitle,
    totalCount,
    handlePrevMonth,
    handleNextMonth,
    handleDayPress,
    handleResetFilter,
  } = useCalendar(allTransactions)

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        key={listKey}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            {/* Month header — tappable to reset */}
            <View style={styles.monthHeader}>
              <Pressable onPress={handleResetFilter} accessibilityRole="button" accessible={true} accessibilityLabel="Reset to today">
                <Text style={[typography.title2, styles.monthTitle]}>
                  {monthName} {currentYear}
                </Text>
              </Pressable>
              <View style={styles.monthNav}>
                <Pressable onPress={handlePrevMonth} style={styles.navButton} accessibilityRole="button" accessible={true} accessibilityLabel="Previous month">
                  <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
                </Pressable>
                <Pressable onPress={handleNextMonth} style={styles.navButton} accessibilityRole="button" accessible={true} accessibilityLabel="Next month">
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textPrimary} />
                </Pressable>
              </View>
            </View>

            {/* Weekday headers */}
            <View style={styles.weekRow}>
              {WEEKDAYS.map((d) => (
                <Text key={d} style={styles.weekDay}>{d}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <View key={`empty-${i}`} style={styles.dayCell} />
                }
                const dateKey = formatDateKey(currentYear, currentMonth, day)
                return (
                  <DayCell
                    key={dateKey}
                    day={day}
                    dateKey={dateKey}
                    isToday={dateKey === todayKey}
                    isSelected={dateKey === selectedDate}
                    hasTxns={Boolean(dateMap[dateKey])}
                    hasPending={dateMap[dateKey]?.some((t) => t.status === 'pending') ?? false}
                    onPress={handleDayPress}
                  />
                )
              })}
            </View>

            {/* Dynamic subtitle + Show all */}
            <View style={styles.listHeader}>
              <View>
                <Text style={[typography.calloutSemibold, styles.sectionTitle]}>{listSubtitle}</Text>
                <Text style={[typography.caption1, styles.listCount]}>{totalCount} transaction{totalCount !== 1 ? 's' : ''}</Text>
              </View>
              {selectedDate && (
                <Pressable onPress={handleResetFilter} accessibilityRole="button" accessible={true} accessibilityLabel="Show all transactions">
                  <Text style={[typography.micro, { color: theme.colors.amber }]}>SHOW ALL</Text>
                  <View style={styles.showAllUnderline} />
                </Pressable>
              )}
            </View>
          </>
        }
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => {
          // When showing all, display date group headers
          // When filtered to one date, skip the redundant header
          if (selectedDate) return null
          return <Text style={[typography.footnote, styles.dateGroupTitle]}>{formatSectionDate(section.title)}</Text>
        }}
        renderItem={({ item }) => {
          const subtitle = `$${Math.abs(item.amount).toFixed(2)} · ${item.account?.name || 'Unknown'}`
          return (
            <TransactionRow
              item={item as Transaction}
              subtitle={subtitle}
              variant="standard"
            />
          )
        }}
        ListEmptyComponent={
          <Text style={[typography.footnote, styles.emptyText]}>No transactions this month</Text>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
  },
  // Month header
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  monthTitle: {
    color: theme.colors.textPrimary,
  },
  monthNav: {
    flexDirection: 'row',
    gap: theme.spacing.md, // increased gap for target
  },
  navButton: {
    width: 44, // 44px for WCAG touch bounds
    height: 44,
    borderRadius: theme.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Weekdays
  weekRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  weekDay: {
    ...typography.caption1,
    flex: 1,
    textAlign: 'center',
    color: theme.colors.textTertiary,
    fontWeight: '500',
  },
  // Calendar grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    minHeight: 48,
  },
  dayCircle: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayText: {
    ...typography.subhead,
    color: theme.colors.textPrimary,
  },
  dayTextBold: {
    fontWeight: '700',
  },
  dayTextToday: {
    color: theme.colors.green,
    fontWeight: '700',
  },
  dayTextSelected: {
    color: theme.colors.textInverse,
    fontWeight: '700',
  },
  dotRow: {
    height: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xxs,
  },
  amberDot: {
    width: 5,
    height: 5,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.amber,
  },
  greenDotSmall: {
    width: 5,
    height: 5,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.green,
  },
  // List header area
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
  },
  listCount: {
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xxs,
  },
  showAllUnderline: {
    height: 2,
    backgroundColor: theme.colors.amber,
    marginTop: theme.spacing.xs,
  },
  // Date group headers
  dateGroupTitle: {
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing['2xl'],
  },
})
