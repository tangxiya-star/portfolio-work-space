import { useEffect, useRef } from 'react'
import { Animated, Easing } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../constants/theme'
import { duration } from '../../constants/motion'

interface SpinningLoaderProps {
  /** Icon color. Defaults to textSecondary */
  color?: string
  size?: number
}

/**
 * Shared spinning reload icon used in loading/processing screens.
 * Uses the motion system's spinner duration for consistent timing.
 */
export default function SpinningLoader({
  color = theme.colors.textSecondary,
  size = 18,
}: SpinningLoaderProps) {
  const spin = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: duration.spinner,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    )
    loop.start()
    return () => loop.stop()
  }, [])

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Ionicons name="reload-outline" size={size} color={color} />
    </Animated.View>
  )
}
