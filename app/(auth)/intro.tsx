import { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { router } from 'expo-router'
import { theme } from '../../constants/theme'
import { duration, spring as motionSpring } from '../../constants/motion'
import Svg, { Rect, G, Path, Line, ClipPath, Defs } from 'react-native-svg'

const AnimatedG = Animated.createAnimatedComponent(G)

export default function IntroScreen() {
  const scale = useRef(new Animated.Value(0.3)).current
  const opacity = useRef(new Animated.Value(0)).current
  const arrowTranslate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration.instant,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.15,
        ...motionSpring.gentle,
        useNativeDriver: true,
      }),
      Animated.timing(arrowTranslate, {
        toValue: 1,
        duration: duration.dramatic,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.replace('/(auth)/welcome')
      }, 500)
    })
  }, [])

  // Arrow slides from bottom-left to top-right, staying inside brackets
  const arrowX = arrowTranslate.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 0],
  })
  const arrowY = arrowTranslate.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  })

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Svg width={160} height={160} viewBox="0 0 200 200">
          <Defs>
            <ClipPath id="logoClip">
              <Rect width="200" height="200" rx="16" />
            </ClipPath>
            {/* Clip arrow to bracket interior only */}
            <ClipPath id="bracketClip">
              <Rect x="60" y="52" width="80" height="96" />
            </ClipPath>
          </Defs>
          <Rect width="200" height="200" rx="16" fill={theme.colors.ink} />
          <G transform="translate(40, 40)" clipPath="url(#logoClip)">
            {/* Brackets - static */}
            <Path
              d="M 40 20 L 20 20 L 20 100 L 40 100"
              fill="none"
              stroke={theme.colors.newsprint}
              strokeWidth="16"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <Path
              d="M 80 20 L 100 20 L 100 100 L 80 100"
              fill="none"
              stroke={theme.colors.newsprint}
              strokeWidth="16"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </G>
          {/* Green arrow - animated, clipped to bracket interior */}
          <G clipPath="url(#bracketClip)">
            <AnimatedG
              style={{
                transform: [
                  { translateX: arrowX },
                  { translateY: arrowY },
                ],
              }}
            >
              <G transform="translate(40, 40)">
                {/* Diagonal line */}
                <Line
                  x1="30"
                  y1="90"
                  x2="70"
                  y2="30"
                  stroke={theme.colors.emerald}
                  strokeWidth="16"
                  strokeLinecap="square"
                />
                {/* Arrow head */}
                <Path
                  d="M 40 30 L 70 30 L 70 60"
                  fill="none"
                  stroke={theme.colors.emerald}
                  strokeWidth="16"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </G>
            </AnimatedG>
          </G>
        </Svg>
        <Text style={styles.brand}>TAXPILOT</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  brand: {
    color: theme.colors.newsprint,
    fontSize: theme.fontSize.footnote,
    fontWeight: '600',
    letterSpacing: theme.letterSpacing.wider,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
