import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'

interface ReauthAccount {
  itemId: string
  institutionName: string
  accountName: string
}

interface ReauthBannerProps {
  accounts: ReauthAccount[]
}

export default function ReauthBanner({ accounts }: ReauthBannerProps) {
  if (accounts.length === 0) return null

  return (
    <View style={styles.container}>
      {accounts.map((account) => (
        <Pressable
          key={account.itemId}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() =>
            router.push({
              pathname: '/reconnect',
              params: {
                itemId: account.itemId,
                institutionName: account.institutionName,
                accountName: account.accountName,
              },
            })
          }
          accessibilityRole="button"
          accessibilityLabel={`Reconnect ${account.institutionName} ${account.accountName}`}
        >
          <View style={styles.content}>
            <Text style={[typography.calloutSemibold, styles.title]}>
              {account.institutionName} {account.accountName} requires re-verification
            </Text>
            <Text style={[typography.footnote, styles.subtitle]}>
              Sync paused for this account
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.amber} />
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.amberBg,
    borderWidth: 1,
    borderColor: theme.colors.amberBorder,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.amber,
  },
  subtitle: {
    color: theme.colors.amber,
    opacity: 0.8,
  },
  cardPressed: {
    opacity: 0.7,
  },
})
