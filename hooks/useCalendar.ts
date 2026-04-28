import { useState, useMemo, useCallback } from 'react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function formatDateKey(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

export function formatSectionDate(dateStr: string) {
  const [, m, d] = dateStr.split('-')
  const monthIdx = parseInt(m, 10) - 1
  const day = parseInt(d, 10)
  return `${MONTH_NAMES[monthIdx]} ${day}`
}

interface TransactionLike {
  date: string
  status: string
}

export function useCalendar<T extends TransactionLike>(allTransactions: T[]) {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [listKey, setListKey] = useState(0)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth)
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  const monthName = MONTH_NAMES[currentMonth]

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    return days
  }, [currentYear, currentMonth, firstDay, daysInMonth])

  const dateMap = useMemo(() => {
    const map: Record<string, T[]> = {}
    for (const txn of allTransactions) {
      if (!map[txn.date]) map[txn.date] = []
      map[txn.date].push(txn)
    }
    return map
  }, [allTransactions])

  const sections = useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
    const monthTxns = allTransactions.filter((t) => t.date.startsWith(monthPrefix))

    const grouped: Record<string, T[]> = {}
    for (const txn of monthTxns) {
      if (!grouped[txn.date]) grouped[txn.date] = []
      grouped[txn.date].push(txn)
    }

    const dates = selectedDate
      ? Object.keys(grouped).filter((d) => d === selectedDate)
      : Object.keys(grouped)

    return dates
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({
        title: date,
        data: grouped[date],
      }))
  }, [currentYear, currentMonth, selectedDate, allTransactions])

  const handlePrevMonth = useCallback(() => {
    setSelectedDate(null)
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setListKey((k) => k + 1)
  }, [currentMonth])

  const handleNextMonth = useCallback(() => {
    setSelectedDate(null)
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setListKey((k) => k + 1)
  }, [currentMonth])

  const handleDayPress = useCallback((dateKey: string) => {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey))
    setListKey((k) => k + 1)
  }, [])

  const handleResetFilter = useCallback(() => {
    setSelectedDate(null)
    setListKey((k) => k + 1)
  }, [])

  const listSubtitle = selectedDate
    ? `Transactions on ${formatSectionDate(selectedDate)}`
    : 'All Transactions'

  const totalCount = sections.reduce((sum, s) => sum + s.data.length, 0)

  return {
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
  }
}
