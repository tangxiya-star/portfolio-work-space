import { View, Text, StyleSheet, Pressable } from 'react-native'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'

interface SelectionCardProps {
  label: string
  /** Optional secondary text shown after the label */
  description?: string
  selected: boolean
  onPress: () => void
  /** 'radio' for single-select, 'checkbox' for multi-select */
  mode?: 'radio' | 'checkbox'
}

/**
 * Shared selection card for onboarding, forms, and option lists.
 * Renders a bordered card with a radio/checkbox indicator and label.
 */
export default function SelectionCard({
  label,
  description,
  selected,
  onPress,
  mode = 'radio',
}: SelectionCardProps) {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      accessibilityRole={mode === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <View style={[styles.indicator, selected && styles.indicatorSelected]} />
      <Text style={styles.label}>
        {label}
        {description ? <Text style={styles.description}> ({description})</Text> : null}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: theme.radius.round,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
  },
  indicatorSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  label: {
    ...typography.callout,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  description: {
    ...typography.footnote,
    color: theme.colors.textSecondary,
  },
})
