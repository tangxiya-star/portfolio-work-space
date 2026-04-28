import { View, Text, StyleSheet, Animated } from 'react-native'
import { useRef, useEffect, useCallback } from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../../constants/theme'
import { preset, easing, stagger, distance } from '../../../constants/motion'
import Button from '../../../components/common/Button'

export default function Case4Screen() {
  // Parent container
  const parentOpacity = useRef(new Animated.Value(0)).current
  const parentTranslateY = useRef(new Animated.Value(distance.md)).current

  // Staggered children (2 elements: title, subtitle)
  const childAnims = useRef(
    Array.from({ length: 2 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(distance.xs),
    }))
  ).current

  // Exit anims
  const exitOpacity = useRef(new Animated.Value(1)).current
  const exitScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(parentOpacity, { toValue: 1, ...preset.cardEnter }),
      Animated.timing(parentTranslateY, { toValue: 0, ...preset.cardEnter }),
    ]).start(() => {
      const childAnimations = childAnims.flatMap((child, i) => [
        Animated.timing(child.opacity, {
          toValue: 1,
          delay: i * stagger.offset,
          ...preset.staggerChild,
        }),
        Animated.timing(child.translateY, {
          toValue: 0,
          delay: i * stagger.offset,
          ...preset.staggerChild,
        }),
      ])
      Animated.parallel(childAnimations).start()
    })
  }, [])

  const handleStartTracking = useCallback(() => {
    Animated.parallel([
      Animated.timing(exitOpacity, { toValue: 0, ...preset.screenExit }),
      Animated.timing(exitScale, { toValue: 0.95, ...preset.screenExit }),
    ]).start(() => {
      router.replace('/(tabs)')
    })
  }, [exitOpacity, exitScale])

  return (
    <Animated.View style={[styles.exitWrap, { opacity: exitOpacity, transform: [{ scale: exitScale }] }]}>
      <Animated.View style={[styles.container, { opacity: parentOpacity, transform: [{ translateY: parentTranslateY }] }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.textWrap}>
              {/* Child 0: Title */}
              <Animated.View style={{ opacity: childAnims[0].opacity, transform: [{ translateY: childAnims[0].translateY }] }}>
                <Text style={styles.title}>
                  Your tracking{'\n'}starts today
                </Text>
              </Animated.View>

              {/* Child 1: Subtitle */}
              <Animated.View style={{ opacity: childAnims[1].opacity, transform: [{ translateY: childAnims[1].translateY }] }}>
                <Text style={styles.subtitle}>
                  From now on, every business expense{'\n'}
                  is recorded and identified.{'\n'}
                  Not a single dollar missed.
                </Text>
              </Animated.View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Start Tracking"
              onPress={handleStartTracking}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  exitWrap: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrap: {
    width: '80%',
  },
  title: {
    fontSize: theme.fontSize.jumbo,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    lineHeight: theme.lineHeight.jumbo,
  },
  subtitle: {
    fontSize: theme.fontSize.callout,
    color: theme.colors.textSecondary,
    lineHeight: theme.lineHeight.callout,
  },
  footer: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['2xl'],
  },
})
