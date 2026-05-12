import React, { useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Animated, LayoutChangeEvent } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { theme } from './theme'
import { typography } from './typography'
import { spring } from './motion'
import Button from './Button'

// ── Public types ────────────────────────────────────────────────────────────

export type AccountItem = {
  account_id: string
  name: string
  mask: string
  subtype: string
  network?: string
  institutionName: string
  primaryColor?: string
  status: 'active' | 'reauth_required'
}

const NETWORK_LABELS: Record<string, string> = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
}

const CARD_PEEK = 55
const ACTION_HEIGHT = 52

// ── CardFace ────────────────────────────────────────────────────────────────

export function CardFace({ account }: { account: AccountItem }) {
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

// ── CardStack ───────────────────────────────────────────────────────────────

export function CardStack({ accounts }: { accounts: AccountItem[] }) {
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

// ── Styles (extracted verbatim from screens/profile.tsx) ────────────────────

const styles = StyleSheet.create({
  stackedCard: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
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
    marginBottom: theme.spacing.xs,
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
  accountActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
})

export default CardStack
