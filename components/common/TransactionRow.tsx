import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'

export interface Transaction {
  id: string
  merchant_name: string
  amount: number
  date: string
  status: string
  is_income: boolean
  account?: { name: string; mask: string }
  card?: { category: string } | null
  suggested_branches?: { category: string }[]
}

const categoryIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Software': 'laptop-outline',
  'Meals': 'restaurant-outline',
  'Travel': 'airplane-outline',
  'Office': 'briefcase-outline',
  'Personal': 'cart-outline',
  'Income': 'cash-outline',
}

function getCategoryInfo(item: Transaction) {
  if (item.is_income) {
    return { icon: 'cash-outline' as keyof typeof Ionicons.glyphMap, label: 'Income' }
  }
  const category = item.card?.category
    ?? item.suggested_branches?.[0]?.category
    ?? 'Uncategorized'
  const icon = categoryIconMap[category] ?? 'help-circle-outline'
  return { icon: icon as keyof typeof Ionicons.glyphMap, label: category }
}

interface Props {
  item: Transaction
  subtitle?: string
  variant?: 'standard' | 'compact'
  onPress?: () => void
}

export default function TransactionRow({ 
  item, 
  subtitle, 
  variant = 'standard',
  onPress
}: Props) {
  const cat = getCategoryInfo(item)
  const isPending = item.status === 'pending'

  const defaultSubtitle = `$${Math.abs(item.amount).toFixed(2)} · ${item.date}`
  const displaySubtitle = subtitle || defaultSubtitle

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.push({ pathname: '/detail', params: { id: item.id } })
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.txRow, pressed && styles.txRowPressed]}
      onPress={handlePress}
      accessibilityRole="button"
      accessible={true}
    >
      {variant !== 'compact' && (
        <View style={styles.txIcon}>
          <Ionicons name={cat.icon} size={20} color={theme.colors.textSecondary} />
        </View>
      )}
      
      <View style={styles.txLeft}>
        <Text style={typography.callout}>
          {item.merchant_name}
        </Text>
        <Text style={[typography.caption2, { marginTop: theme.spacing.xxs }]}>
          {variant === 'compact' ? item.date : displaySubtitle}
        </Text>
      </View>

      {variant === 'standard' && (
        isPending ? (
          <View style={styles.reviewButton}>
            <Text style={[typography.caption1, { fontWeight: '600', color: theme.colors.amber, textDecorationLine: 'underline' }]}>
              Review
            </Text>
            <Ionicons name="chevron-forward" size={12} color={theme.colors.amber} />
          </View>
        ) : (
          <View style={styles.confirmedRow}>
            <View style={styles.greenDot} />
            <Text style={[typography.caption1, { color: theme.colors.green }]}>
              Confirmed
            </Text>
          </View>
        )
      )}

      {variant === 'compact' && (
        <Text style={[typography.mono, { fontWeight: '600', color: theme.colors.textPrimary }]}>
          ${Math.abs(item.amount).toFixed(2)}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    borderRadius: theme.radius.sm,
    minHeight: 56, // Accessible row height
  },
  txRowPressed: {
    backgroundColor: theme.colors.borderLight,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.round,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  txLeft: {
    flex: 1,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.green,
  },
})
