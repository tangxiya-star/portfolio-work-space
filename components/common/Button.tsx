import { ActivityIndicator, Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { typography } from '../../constants/typography'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size = 'small' | 'medium' | 'large'

/**
 * Layout-only style overrides allowed on Button.
 * Visual properties (colors, borders, radius, shadows) are locked to the design system.
 */
type LayoutStyle = Pick<ViewStyle,
  | 'margin' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight'
  | 'marginHorizontal' | 'marginVertical'
  | 'flex' | 'flexGrow' | 'flexShrink' | 'flexBasis'
  | 'alignSelf'
  | 'width' | 'maxWidth' | 'minWidth'
>

interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  variant?: Variant
  size?: Size
  icon?: keyof typeof Ionicons.glyphMap
  fullWidth?: boolean
  /** Layout-only overrides (margin, flex, alignSelf). Visual styles are locked. */
  style?: LayoutStyle
}

const HEIGHT: Record<Size, number> = {
  small: 36,
  medium: 44,
  large: 48,
}

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'large',
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        { minHeight: HEIGHT[size] },
        size === 'small' && styles.paddingSmall,
        variantStyles[variant],
        pressed && !isDisabled && pressedStyles[variant],
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style as ViewStyle,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessible={true}
    >
      {({ pressed }) => (
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variant === 'primary' || variant === 'destructive'
                ? theme.colors.white
                : theme.colors.textPrimary}
            />
          ) : (
            <>
              {icon && (
                <Ionicons
                  name={icon}
                  size={size === 'small' ? 14 : 16}
                  color={getTextColor(variant, pressed && !isDisabled)}
                />
              )}
              <Text
                style={[
                  size === 'small' ? typography.footnoteSemibold : typography.calloutSemibold,
                  { color: getTextColor(variant, pressed && !isDisabled) },
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      )}
    </Pressable>
  )
}

function getTextColor(variant: Variant, pressed: boolean): string {
  switch (variant) {
    case 'primary':
      return theme.colors.textInverse
    case 'destructive':
      return theme.colors.red
    case 'ghost':
      return theme.colors.textPrimary
    case 'outline':
      return pressed ? theme.colors.textInverse : theme.colors.textPrimary
    case 'secondary':
      return theme.colors.textPrimary
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paddingSmall: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.3,
  },
  fullWidth: {
    width: '100%',
  },
})

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.textPrimary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
})

const pressedStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.ink,
    opacity: 0.85,
  },
  secondary: {
    backgroundColor: theme.colors.surfaceDim,
  },
  outline: {
    backgroundColor: theme.colors.ink,
  },
  ghost: {
    backgroundColor: theme.colors.surfaceDim,
  },
  destructive: {
    backgroundColor: theme.colors.redBg,
  },
})
