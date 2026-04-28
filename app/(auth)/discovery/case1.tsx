import { useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../../constants/theme'
import { preset, stagger, distance } from '../../../constants/motion'
import { mockDiscoveryAllClear } from '../../../mocks/data'
import Button from '../../../components/common/Button'

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Software: 'laptop-outline',
  Travel: 'airplane-outline',
  Office: 'briefcase-outline',
  Meals: 'restaurant-outline',
  Equipment: 'hardware-chip-outline',
  Marketing: 'megaphone-outline',
  Utilities: 'flash-outline',
  Insurance: 'shield-outline',
}

function StaggerItem({ index, children }: { index: number; children: React.ReactNode }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(distance.xs)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        ...preset.staggerChild,
        delay: index * stagger.offset,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        ...preset.staggerChild,
        delay: index * stagger.offset,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {children}
    </Animated.View>
  )
}

export default function Case1Screen() {
  const data = mockDiscoveryAllClear
  const cardAnim = useRef(new Animated.Value(distance.md)).current
  const cardFade = useRef(new Animated.Value(0)).current
  const exitOpacity = useRef(new Animated.Value(1)).current
  const exitScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, { toValue: 1, ...preset.cardEnter }),
      Animated.timing(cardAnim, { toValue: 0, ...preset.cardEnter }),
    ]).start()
  }, [])

  const handleViewDetails = useCallback(() => {
    Animated.parallel([
      Animated.timing(exitOpacity, { toValue: 0, ...preset.screenExit }),
      Animated.timing(exitScale, { toValue: 0.95, ...preset.screenExit }),
    ]).start(() => {
      router.push('/(auth)/discovery/transition')
    })
  }, [exitOpacity, exitScale])

  return (
    <Animated.View style={[styles.exitWrap, { opacity: exitOpacity, transform: [{ scale: exitScale }] }]}>
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.card,
            { opacity: cardFade, transform: [{ translateY: cardAnim }] },
          ]}
        >
          {/* Hero */}
          <StaggerItem index={0}>
            <Text style={styles.heroLabel}>
              Found it! In the past 14 months you have
            </Text>
            <Text style={styles.amount}>
              ${data.confirmed_amount.toLocaleString()}
            </Text>
            <Text style={styles.label}>
              POTENTIAL DEDUCTIBLE EXPENSES NOT YET RECORDED
            </Text>
          </StaggerItem>

          {/* Breakdown */}
          <StaggerItem index={1}>
            <View style={styles.categories}>
              {data.categories.map((cat, i) => (
                <StaggerItem key={cat.name} index={2 + i}>
                  <View style={styles.catRow}>
                    <View style={styles.catLeft}>
                      <View style={styles.catIcon}>
                        <Ionicons
                          name={CATEGORY_ICONS[cat.name] ?? 'ellipsis-horizontal-outline'}
                          size={18}
                          color={theme.colors.textSecondary}
                        />
                      </View>
                      <Text style={styles.catName}>{cat.name}</Text>
                    </View>
                    <Text style={styles.catAmount}>
                      ${cat.amount.toLocaleString()}
                    </Text>
                  </View>
                </StaggerItem>
              ))}
            </View>
          </StaggerItem>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Savings */}
          <StaggerItem index={6}>
            <Text style={styles.savingsLabel}>
              ESTIMATED TAX REDUCTION
            </Text>
            <Text style={styles.savingsAmount}>
              ${data.estimated_tax_savings.toLocaleString()}
            </Text>
          </StaggerItem>

          {/* Button */}
          <StaggerItem index={7}>
            <Button
              title="View Details"
              onPress={handleViewDetails}
            />
          </StaggerItem>
        </Animated.View>
      </SafeAreaView>
    </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  exitWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    ...theme.card,
    marginHorizontal: theme.spacing.lg,
    gap: theme.spacing['2xl'],
  },
  heroLabel: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  amount: {
    fontSize: theme.fontSize.feature,
    fontWeight: '700',
    color: theme.colors.green,
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.microLabel,
    color: theme.colors.textSecondary,
  },
  categories: {
    gap: theme.spacing.md,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {
    fontSize: theme.fontSize.headline,
    color: theme.colors.textPrimary,
  },
  catAmount: {
    fontSize: theme.fontSize.headline,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  savingsLabel: {
    ...theme.microLabel,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  savingsAmount: {
    fontSize: theme.fontSize.display,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
})
