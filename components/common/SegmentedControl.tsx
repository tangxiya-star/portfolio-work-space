import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'

export interface SegmentOption<T> {
  label: string
  value: T
}

interface Props<T> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  variant?: 'light' | 'dark'
}

export default function SegmentedControl<T>({ options, value, onChange, variant = 'light' }: Props<T>) {
  const isDark = variant === 'dark'

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((opt, i) => {
        const isActive = value === opt.value
        return (
          <Pressable
            key={i}
            style={[
              styles.pill,
              isDark ? styles.pillDark : styles.pillLight,
              isActive && (isDark ? styles.pillDarkActive : styles.pillLightActive)
            ]}
            onPress={() => onChange(opt.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessible={true}
          >
            <Text
              style={[
                isActive ? typography.caption1Semibold : typography.caption1,
                isDark ? styles.textDark : styles.textLight,
                isActive && (isDark ? styles.textDarkActive : styles.textLightActive)
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: theme.radius.round,
    borderWidth: 1,
  },
  pillLight: {
    borderColor: theme.colors.borderLight,
    backgroundColor: 'transparent',
  },
  pillLightActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  pillDark: {
    borderColor: theme.colors.borderInverse,
    backgroundColor: 'transparent',
  },
  pillDarkActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  textLight: {
    color: theme.colors.textSecondary,
  },
  textLightActive: {
    color: theme.colors.textInverse,
  },
  textDark: {
    color: theme.colors.textInverseMuted,
  },
  textDarkActive: {
    color: theme.colors.textInverse,
  },
})
