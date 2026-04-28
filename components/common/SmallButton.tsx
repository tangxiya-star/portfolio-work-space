import { Pressable, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'

interface SmallButtonProps {
  title: string
  onPress: () => void
  icon?: keyof typeof Ionicons.glyphMap
  accessibilityLabel?: string
}

/** Visual hitSlop expands the touch target to ~44px without changing visual size */
const HIT_SLOP = { top: 6, bottom: 6, left: 4, right: 4 }

export default function SmallButton({
  title,
  onPress,
  icon,
  accessibilityLabel,
}: SmallButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      {icon && (
        <Ionicons name={icon} size={16} color={theme.colors.textPrimary} />
      )}
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  pressed: {
    backgroundColor: theme.colors.surfaceDim,
  },
  label: {
    ...typography.footnoteSemibold,
    color: theme.colors.textPrimary,
  },
})
