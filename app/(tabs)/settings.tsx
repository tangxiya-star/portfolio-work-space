import { useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Animated, LayoutChangeEvent, Linking } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'
import { mockUser, mockTaxSettings, mockPlaidItems } from '../../mocks/data'
import { useTaxStore } from '../../store/taxStore'
import Toggle from '../../components/common/Toggle'
import SmallButton from '../../components/common/SmallButton'
import Button from '../../components/common/Button'
import { spring } from '../../constants/motion'

// ── Row Components ─────────────────────────────────────
function SettingRow({
  icon,
  label,
  value,
  onPress,
  toggle,
  onToggle,
}: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value?: string
  onPress?: () => void
  toggle?: boolean
  onToggle?: (v: boolean) => void
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && !toggle && styles.rowPressed]}
      onPress={toggle !== undefined ? undefined : onPress}
      disabled={toggle !== undefined || !onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={24} color={theme.colors.textSecondary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      {toggle !== undefined ? (
        <Toggle
          value={toggle}
          onValueChange={onToggle!}
        />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue} numberOfLines={1}>{value}</Text> : null}
          {onPress && (
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          )}
        </View>
      )}
    </Pressable>
  )
}

const NETWORK_LABELS: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
}

// ── Card Stack (Apple Wallet style) ───────────────────
const CARD_PEEK = 55
const ACTION_HEIGHT = 52

type AccountItem = {
  account_id: string
  name: string
  mask: string
  subtype: string
  network?: string
  institutionName: string
  primaryColor?: string
  status: 'active' | 'reauth_required'
}

function CardStack({ accounts }: { accounts: AccountItem[] }) {
  const count = accounts.length
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [cardHeight, setCardHeight] = useState(0)
  const animValues = useRef(accounts.map(() => new Animated.Value(0))).current
  const containerAnim = useRef(new Animated.Value(0)).current

  const collapsedHeight = cardHeight > 0
    ? cardHeight + CARD_PEEK * (count - 1)
    : 0
  const expandedHeight = cardHeight + theme.spacing.sm + ACTION_HEIGHT

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    if (cardHeight === 0) {
      setCardHeight(e.nativeEvent.layout.height)
    }
  }, [cardHeight])

  const animateTo = useCallback((index: number | null) => {
    const cardAnims = accounts.map((_, i) => {
      const toValue = index === null ? 0 : index === i ? 1 : -1
      return Animated.spring(animValues[i], {
        toValue,
        ...spring.card,
        useNativeDriver: true,
      })
    })

    const heightAnim = Animated.spring(containerAnim, {
      toValue: index === null ? 0 : 1,
      ...spring.card,
      useNativeDriver: false,
    })

    Animated.parallel([...cardAnims, heightAnim]).start()
    setSelectedIndex(index)
  }, [accounts, animValues, containerAnim])

  const handleCardPress = useCallback((i: number) => {
    if (selectedIndex === i) {
      animateTo(null)
    } else {
      animateTo(i)
    }
  }, [selectedIndex, animateTo])

  if (cardHeight === 0) {
    // Render one card invisibly to measure height
    return (
      <View style={{ opacity: 0 }} onLayout={handleLayout}>
        <CardFace account={accounts[0]} />
      </View>
    )
  }

  const animatedHeight = containerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedHeight, expandedHeight],
  })

  return (
    <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
      {accounts.map((acc, i) => {
        const translateY = animValues[i].interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [cardHeight + 20, i * CARD_PEEK, 0],
        })
        const scale = animValues[i].interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.95, 1, 1],
        })
        const opacity = animValues[i].interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 1, 1],
        })
        const actionOpacity = animValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        })

        const isSelected = selectedIndex === i
        const zIndex = isSelected ? count + 1 : i

        return (
          <Animated.View
            key={acc.account_id}
            style={[
              styles.stackedCard,
              {
                zIndex,
                transform: [{ translateY }, { scale }],
                opacity,
              },
            ]}
          >
            <Pressable
              onPress={() => handleCardPress(i)}
              accessibilityRole="button"
              accessibilityLabel={acc.name}
            >
              <CardFace account={acc} />
            </Pressable>

            {isSelected && (
              <Animated.View style={[styles.accountActions, { opacity: actionOpacity }]}>
                {acc.status === 'reauth_required' ? (
                  <Button title="Reconnect" variant="primary" size="medium" fullWidth onPress={() => {}} />
                ) : (
                  <>
                    <Button title="Disconnect" variant="destructive" size="medium" onPress={() => {}} style={{ flex: 1 }} />
                    <Button title="Pause sync" variant="secondary" size="medium" onPress={() => {}} style={{ flex: 1 }} />
                  </>
                )}
              </Animated.View>
            )}
          </Animated.View>
        )
      })}
    </Animated.View>
  )
}

function CardFace({ account }: { account: AccountItem }) {
  const cardBg = account.primaryColor ?? theme.colors.primary
  const needsReauth = account.status === 'reauth_required'

  return (
    <View style={[styles.cardFace, { backgroundColor: cardBg }]}>
      <LinearGradient
        colors={[
          theme.colors.cardGloss1,
          theme.colors.cardGloss2,
          theme.colors.cardGloss3,
          theme.colors.cardGloss4,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardTopRow}>
        <Text style={styles.cardInstitution}>{account.institutionName}</Text>
        {needsReauth && (
          <View style={styles.cardStatusBadge}>
            <Ionicons name="warning" size={12} color={theme.colors.redLight} />
            <Text style={styles.cardStatusText}>Reauth</Text>
          </View>
        )}
      </View>
      <View style={styles.cardChip}>
        <View style={styles.chipLineH} />
        <View style={styles.chipLineH} />
        <View style={styles.chipLineH} />
        <View style={styles.chipLineV} />
      </View>
      <View style={styles.cardBottomRow}>
        <View>
          <Text style={styles.cardName}>{account.name}</Text>
          <Text style={styles.cardMask}>•••• {account.mask}</Text>
        </View>
        {account.network && (
          <Text style={styles.cardNetwork}>{NETWORK_LABELS[account.network] ?? account.network}</Text>
        )}
      </View>
    </View>
  )
}

// ── Field Options ──────────────────────────────────────
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
]

type FieldKey = 'income_source' | 'entity_type' | 'tax_start_year' | 'state' | 'filing_status'

const FIELD_OPTIONS: Record<FieldKey, { title: string; options: Array<{ label: string; value: string }>; multiSelect?: boolean }> = {
  income_source: {
    title: 'Income Source',
    multiSelect: true,
    options: [
      { label: 'Self-employed (1099)', value: '1099' },
      { label: 'Side hustle', value: 'side' },
      { label: 'W-2 Employee', value: 'w2' },
    ],
  },
  entity_type: {
    title: 'Entity Type',
    options: [
      { label: 'Sole Proprietor', value: 'Sole Proprietor' },
      { label: 'LLC', value: 'LLC' },
      { label: 'S-Corp', value: 'S-Corp' },
      { label: 'C-Corp', value: 'C-Corp' },
      { label: 'Partnership', value: 'Partnership' },
    ],
  },
  tax_start_year: {
    title: 'Tax Start Year',
    options: [
      { label: '2026', value: '2026' },
      { label: '2025', value: '2025' },
      { label: '2024', value: '2024' },
      { label: '2023', value: '2023' },
      { label: '2022', value: '2022' },
    ],
  },
  state: {
    title: 'State',
    options: US_STATES.map((s) => ({ label: s, value: s })),
  },
  filing_status: {
    title: 'Filing Status',
    options: [
      { label: 'Single', value: 'single' },
      { label: 'Married filing jointly', value: 'married_jointly' },
      { label: 'Married filing separately', value: 'married_separately' },
      { label: 'Head of household', value: 'head_of_household' },
    ],
  },
}

// ── Bottom Sheet ───────────────────────────────────────
function SettingsSheet({
  fieldKey,
  currentValue,
  onClose,
  onSave,
}: {
  fieldKey: FieldKey
  currentValue: string
  onClose: () => void
  onSave: (key: FieldKey, values: string[]) => void
}) {
  const config = FIELD_OPTIONS[fieldKey]
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentValue.split(','))
  )

  const handleSelect = (value: string) => {
    if (config.multiSelect) {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(value)) next.delete(value)
        else next.add(value)
        return next
      })
    } else {
      setSelected(new Set([value]))
    }
  }

  const isLongList = config.options.length > 10

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <Pressable
          style={[styles.sheetContent, isLongList && styles.sheetContentTall]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>{config.title}</Text>
          {config.multiSelect && (
            <Text style={styles.sheetHint}>Select all that apply</Text>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroll}
          >
            {config.options.map((opt, i) => {
              const isSelected = selected.has(opt.value)
              return (
                <View key={opt.value}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.sheetOption,
                      pressed && styles.sheetOptionPressed,
                    ]}
                    onPress={() => handleSelect(opt.value)}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.sheetOptionText, isSelected && styles.sheetOptionTextSelected]}>
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={theme.colors.ink} />
                    )}
                  </Pressable>
                  {i < config.options.length - 1 && <View style={styles.sheetSeparator} />}
                </View>
              )
            })}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [styles.sheetConfirm, pressed && { opacity: 0.85 }]}
            onPress={() => {
              onSave(fieldKey, Array.from(selected).filter(Boolean))
              onClose()
            }}
            accessibilityRole="button"
            accessibilityLabel="Confirm selection"
          >
            <Text style={styles.sheetConfirmText}>Confirm</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

// ── Helpers ─────────────────────────────────────────────
function formatIncomeTypes(types: string[]): string {
  const map: Record<string, string> = {
    '1099': 'Self-employed',
    side: 'Side hustle',
    w2: 'W-2',
  }
  return types.map((t) => map[t] ?? t).join(' + ')
}

function formatFilingStatus(status: string): string {
  const map: Record<string, string> = {
    single: 'Single',
    married_jointly: 'Married filing jointly',
    married_separately: 'Married filing separately',
    head_of_household: 'Head of household',
  }
  return map[status] ?? status
}

// ── Main Screen ────────────────────────────────────────
export default function SettingsScreen() {
  const user = mockUser
  const [settings, setSettings] = useState(mockTaxSettings)

  const handleSheetSave = useCallback((key: FieldKey, values: string[]) => {
    setSettings((prev) => {
      switch (key) {
        case 'income_source':
          return { ...prev, income_types: values }
        case 'entity_type':
          return { ...prev, entity_type: values[0] ?? prev.entity_type }
        case 'tax_start_year':
          return { ...prev, tax_start_year: Number(values[0]) || prev.tax_start_year }
        case 'state':
          return { ...prev, state: values[0] ?? prev.state }
        case 'filing_status':
          return { ...prev, filing_status: values[0] ?? prev.filing_status }
        default:
          return prev
      }
    })
  }, [])
  const reconnectedItemIds = useTaxStore((s) => s.reconnectedItemIds)
  const plaidItems = mockPlaidItems.items.map((item) =>
    reconnectedItemIds.includes(item.item_id) ? { ...item, status: 'active' as const } : item
  )
  const [activeSheet, setActiveSheet] = useState<FieldKey | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [faceIdEnabled, setFaceIdEnabled] = useState(true)
  const [txnAlerts, setTxnAlerts] = useState(true)
  const [deadlineAlerts, setDeadlineAlerts] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [showExportSheet, setShowExportSheet] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV'>('PDF')

  // Flatten all accounts with their parent item status
  const accounts = plaidItems.flatMap((item) =>
    item.accounts.map((acc) => ({
      ...acc,
      status: item.status as 'active' | 'reauth_required',
      institutionName: item.institution_name,
      primaryColor: item.primary_color,
    }))
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {user.email.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profilePlan}>Active · Pro Plan</Text>
        </View>

        {/* Tax Profile */}
        <Text style={styles.sectionLabel}>Tax Profile</Text>
        <SettingRow
          icon="cash-outline"
          label="Income Source"
          value={formatIncomeTypes(settings.income_types)}
          onPress={() => setActiveSheet('income_source')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="business-outline"
          label="Entity Type"
          value={settings.entity_type}
          onPress={() => setActiveSheet('entity_type')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="calendar-outline"
          label="Tax Start Year"
          value={String(settings.tax_start_year)}
          onPress={() => setActiveSheet('tax_start_year')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="location-outline"
          label="State"
          value={settings.state}
          onPress={() => setActiveSheet('state')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="people-outline"
          label="Filing Status"
          value={formatFilingStatus(settings.filing_status)}
          onPress={() => setActiveSheet('filing_status')}
        />

        {/* Connected Accounts */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionLabel, { marginTop: 0, marginBottom: 0 }]}>Connected Accounts</Text>
          <SmallButton
            title="Add"
            icon="add"
            onPress={() => {}}
            accessibilityLabel="Add account"
          />
        </View>
        <CardStack accounts={accounts} />

        {/* Security */}
        <Text style={styles.sectionLabel}>Security</Text>
        <SettingRow
          icon="finger-print-outline"
          label="Face ID / Touch ID"
          toggle={faceIdEnabled}
          onToggle={setFaceIdEnabled}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => {}}
        />

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <SettingRow
          icon="receipt-outline"
          label="Transaction Alerts"
          toggle={txnAlerts}
          onToggle={setTxnAlerts}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="alarm-outline"
          label="Tax Deadline Reminders"
          toggle={deadlineAlerts}
          onToggle={setDeadlineAlerts}
        />

        {/* Subscription */}
        <Text style={styles.sectionLabel}>Subscription</Text>
        <SettingRow
          icon="card-outline"
          label="Current Plan"
          value="$19.99/mo"
          onPress={() => router.push('/paywall')}
        />

        {/* Export */}
        <Text style={styles.sectionLabel}>Data</Text>
        <SettingRow
          icon="download-outline"
          label="Export Tax Report"
          value={exportFormat}
          onPress={() => setShowExportSheet(true)}
        />

        {/* Help & Support */}
        <Text style={styles.sectionLabel}>Support</Text>
        <SettingRow
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => Linking.openURL('https://taxpilot.app/help')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="chatbubble-outline"
          label="Contact Support"
          onPress={() => Linking.openURL('mailto:support@taxpilot.app')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="star-outline"
          label="Rate TaxPilot"
          onPress={() => {}}
        />

        {/* Legal */}
        <Text style={styles.sectionLabel}>Legal</Text>
        <SettingRow
          icon="document-text-outline"
          label="Terms of Service"
          onPress={() => Linking.openURL('https://taxpilot.app/terms')}
        />
        <View style={styles.separator} />
        <SettingRow
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => Linking.openURL('https://taxpilot.app/privacy')}
        />

        {/* Account */}
        <Text style={styles.sectionLabel}>Account</Text>
        <Pressable
          style={({ pressed }) => [styles.deleteRow, pressed && styles.rowPressed]}
          onPress={() => setShowDeleteConfirm(true)}
          accessibilityRole="button"
          accessibilityLabel="Delete account and data"
        >
          <Text style={styles.deleteLabel}>Delete account & data</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
        </Pressable>

        {/* Log Out */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.85 }]}
          onPress={() => setShowLogoutConfirm(true)}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        {/* Version */}
        <Text style={styles.versionText}>TaxPilot v1.0.0 (1)</Text>

      </ScrollView>

      {activeSheet && (
        <SettingsSheet
          fieldKey={activeSheet}
          currentValue={
            activeSheet === 'income_source'
              ? settings.income_types.join(',')
              : activeSheet === 'tax_start_year'
              ? String(settings.tax_start_year)
              : activeSheet === 'filing_status'
              ? settings.filing_status
              : activeSheet === 'entity_type'
              ? settings.entity_type
              : settings.state
          }
          onClose={() => setActiveSheet(null)}
          onSave={handleSheetSave}
        />
      )}

      {showDeleteConfirm && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowDeleteConfirm(false)}>
          <Pressable style={styles.sheetOverlay} onPress={() => setShowDeleteConfirm(false)}>
            <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Delete Account</Text>
              <Text style={styles.deleteDescription}>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </Text>
              <Pressable
                style={({ pressed }) => [styles.deleteConfirmBtn, pressed && { opacity: 0.85 }, deleting && { opacity: 0.5 }]}
                onPress={() => {
                  if (deleting) return
                  setDeleting(true)
                  // TODO: call delete API
                  setTimeout(() => {
                    setDeleting(false)
                    setShowDeleteConfirm(false)
                  }, 1500)
                }}
                disabled={deleting}
                accessibilityRole="button"
                accessibilityLabel="Delete Account"
              >
                <Text style={styles.deleteConfirmText}>{deleting ? 'Deleting...' : 'Delete Account'}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.deleteCancelBtn, pressed && { opacity: 0.85 }]}
                onPress={() => !deleting && setShowDeleteConfirm(false)}
                disabled={deleting}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={[styles.deleteCancelText, deleting && { opacity: 0.3 }]}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
      {showLogoutConfirm && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowLogoutConfirm(false)}>
          <Pressable style={styles.sheetOverlay} onPress={() => setShowLogoutConfirm(false)}>
            <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Log Out</Text>
              <Text style={styles.deleteDescription}>
                Are you sure you want to log out?
              </Text>
              <Pressable
                style={({ pressed }) => [styles.deleteConfirmBtn, pressed && { opacity: 0.85 }, loggingOut && { opacity: 0.5 }]}
                onPress={() => {
                  if (loggingOut) return
                  setLoggingOut(true)
                  // TODO: call logout API, navigate to auth
                  setTimeout(() => {
                    setLoggingOut(false)
                    setShowLogoutConfirm(false)
                  }, 800)
                }}
                disabled={loggingOut}
                accessibilityRole="button"
                accessibilityLabel="Log Out"
              >
                <Text style={styles.deleteConfirmText}>{loggingOut ? 'Logging out...' : 'Log Out'}</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.deleteCancelBtn, pressed && { opacity: 0.85 }]}
                onPress={() => !loggingOut && setShowLogoutConfirm(false)}
                disabled={loggingOut}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={[styles.deleteCancelText, loggingOut && { opacity: 0.3 }]}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {showExportSheet && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowExportSheet(false)}>
          <Pressable style={styles.sheetOverlay} onPress={() => setShowExportSheet(false)}>
            <Pressable style={styles.sheetContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Export Tax Report</Text>
              <Text style={styles.exportHint}>Choose a format to export your 2026 tax report.</Text>

              <Pressable
                style={({ pressed }) => [styles.exportOption, pressed && styles.exportOptionPressed, exporting && { opacity: 0.5 }]}
                onPress={() => {
                  if (exporting) return
                  setExporting(true)
                  setExportFormat('PDF')
                  setTimeout(() => { setExporting(false); setShowExportSheet(false) }, 1000)
                }}
                disabled={exporting}
                accessibilityRole="button"
                accessibilityLabel="Export as PDF"
              >
                <View style={styles.exportOptionLeft}>
                  <Ionicons name="document-outline" size={24} color={theme.colors.textPrimary} />
                  <View>
                    <Text style={styles.exportOptionTitle}>PDF</Text>
                    <Text style={styles.exportOptionSub}>Formatted report, ready to print or share</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </Pressable>

              <View style={styles.separator} />

              <Pressable
                style={({ pressed }) => [styles.exportOption, pressed && styles.exportOptionPressed, exporting && { opacity: 0.5 }]}
                onPress={() => {
                  if (exporting) return
                  setExporting(true)
                  setExportFormat('CSV')
                  setTimeout(() => { setExporting(false); setShowExportSheet(false) }, 1000)
                }}
                disabled={exporting}
                accessibilityRole="button"
                accessibilityLabel="Export as CSV"
              >
                <View style={styles.exportOptionLeft}>
                  <Ionicons name="grid-outline" size={24} color={theme.colors.textPrimary} />
                  <View>
                    <Text style={styles.exportOptionTitle}>CSV</Text>
                    <Text style={styles.exportOptionSub}>Spreadsheet data for Excel or Google Sheets</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  )
}

// ── Styles ─────────────────────────────────────────────
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

  // Profile
  profileSection: {
    alignItems: 'center',
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.xl,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  profileInitial: {
    ...typography.title1,
    color: theme.colors.surface,
  },
  profileEmail: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xxs,
  },
  profilePlan: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
  },
  subtitle: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xl,
  },

  // Sections
  sectionLabel: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.md,
  },
  // Setting Row
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md, // ensures left and right never fully collide
  },
  rowPressed: {
    backgroundColor: theme.colors.surfaceDim,
    marginHorizontal: -theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
    flexShrink: 0,
  },
  rowRight: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.xs,
  },
  rowValue: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    flexShrink: 1,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },

  // Card stack
  stackedCard: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  // Credit-card face (standard 1.586:1 ratio, compact)
  cardFace: {
    aspectRatio: 1.586,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.cardBorder,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInstitution: {
    ...typography.headline,
    color: theme.colors.textInverse,
    fontWeight: '700',
  },
  cardStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.overlayDark,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },
  cardStatusText: {
    ...typography.caption2,
    color: theme.colors.redLight,
    fontWeight: '600',
  },
  cardChip: {
    width: 40,
    height: 28,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.cardChipGold,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.xs,
    overflow: 'hidden',
  },
  chipLineH: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.overlayChipLine,
  },
  chipLineV: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.overlayChipLine,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardName: {
    ...typography.footnote,
    color: theme.colors.cardNameText,
    marginBottom: theme.spacing.xxs,
  },
  cardMask: {
    ...typography.body,
    color: theme.colors.textInverse,
    fontFamily: theme.fonts.mono,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.wider,
  },
  cardNetwork: {
    ...typography.callout,
    color: theme.colors.cardNetworkText,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  // Actions below card
  accountActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.surfaceDim,
  },
  actionBtnText: {
    ...typography.subhead,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  actionBtnTextDanger: {
    ...typography.subhead,
    fontWeight: '600',
    color: theme.colors.red,
  },

  // Section Header Row
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing['2xl'],
    marginBottom: theme.spacing.md,
  },
  addAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  addAccountBtnPressed: {
    backgroundColor: theme.colors.surfaceDim,
  },
  addAccountBtnText: {
    ...typography.footnote,
    color: theme.colors.textPrimary,
  },

  // Delete
  deleteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  deleteLabel: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
  },
  deleteRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  deleteText: {
    fontSize: theme.fontSize.footnote,
    fontWeight: '600',
    color: theme.colors.red,
  },

  // Footer
  email: {
    fontSize: theme.fontSize.caption1,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing['2xl'],
  },

  // Bottom Sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
    maxHeight: '60%',
  },
  sheetContentTall: {
    maxHeight: '80%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  sheetTitle: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  sheetHint: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },
  sheetScroll: {
    flexGrow: 0,
  },
  sheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  sheetOptionPressed: {
    backgroundColor: theme.colors.surfaceDim,
    marginHorizontal: -theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  sheetOptionText: {
    ...typography.body,
    color: theme.colors.textPrimary,
  },
  sheetOptionTextSelected: {
    fontWeight: '600',
  },
  sheetSeparator: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  sheetConfirm: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  sheetConfirmText: {
    ...typography.calloutSemibold,
    color: theme.colors.textInverse,
  },

  // Delete confirmation
  deleteDescription: {
    ...typography.body,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.body,
    marginBottom: theme.spacing.xl,
  },
  deleteConfirmBtn: {
    backgroundColor: theme.colors.red,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  deleteConfirmText: {
    ...typography.calloutSemibold,
    color: theme.colors.textInverse,
  },
  deleteCancelBtn: {
    backgroundColor: theme.colors.surfaceDim,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  deleteCancelText: {
    ...typography.calloutSemibold,
    color: theme.colors.textPrimary,
  },

  // Log out
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginTop: theme.spacing['2xl'],
    borderRadius: theme.radius.button,
    backgroundColor: theme.colors.ink,
  },
  logoutText: {
    ...typography.bodyMedium,
    color: theme.colors.textInverse,
  },

  // Version
  versionText: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },

  // Export sheet
  exportHint: {
    ...typography.footnote,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xl,
  },
  exportOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  exportOptionPressed: {
    backgroundColor: theme.colors.surfaceDim,
    marginHorizontal: -theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  exportOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  exportOptionTitle: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
  },
  exportOptionSub: {
    ...typography.caption1,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xxs,
  },
})
