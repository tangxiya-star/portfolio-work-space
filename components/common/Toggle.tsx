import { useRef, useEffect } from 'react'
import { Pressable, Animated, StyleSheet } from 'react-native'
import { theme } from '../../constants/theme'
import { spring } from '../../constants/motion'

const TRACK_W = 48
const TRACK_H = 28
const THUMB_SIZE = 22
const THUMB_OFFSET = 3
const TRAVEL = TRACK_W - THUMB_SIZE - THUMB_OFFSET * 2

interface ToggleProps {
  value: boolean
  onValueChange: (v: boolean) => void
}

export default function Toggle({ value, onValueChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      ...spring.snappy,
      useNativeDriver: false,
    }).start()
  }, [value])

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.border, theme.colors.green],
  })

  const thumbX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_OFFSET, THUMB_OFFSET + TRAVEL],
  })

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: theme.radius.round,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.white,
    ...theme.shadow.sm,
  },
})
