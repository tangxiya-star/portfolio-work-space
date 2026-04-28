import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Redirect, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '../../../constants/theme'
import { mockDiscovery } from '../../../mocks/data'

const DEV_CASES = [
  { key: 'case1', label: 'Case 1 — All Clear', href: '/(auth)/discovery/case1' },
  { key: 'case2', label: 'Case 2 — Partial (Most Common)', href: '/(auth)/discovery/case2' },
  { key: 'case3', label: 'Case 3 — All Pending', href: '/(auth)/discovery/case3' },
  { key: 'case4', label: 'Case 4 — No History', href: '/(auth)/discovery/case4' },
  { key: 'transition', label: 'Transition — How to Get It Back', href: '/(auth)/discovery/transition' },
] as const

export default function DiscoveryIndex() {
  // In dev mode, show a switcher
  if (__DEV__) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Discovery Cases</Text>
        <Text style={styles.subtitle}>Dev-only switcher</Text>
        <View style={styles.list}>
          {DEV_CASES.map((item) => (
            <Pressable
              key={item.key}
              style={styles.item}
              onPress={() => router.push(item.href as never)}
            >
              <Text style={styles.itemText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    )
  }

  // Production: route based on discovery case
  const discoveryCase = mockDiscovery.case

  switch (discoveryCase) {
    case 'case1':
      return <Redirect href="/(auth)/discovery/case1" />
    case 'case2':
      return <Redirect href="/(auth)/discovery/case2" />
    case 'case3':
      return <Redirect href="/(auth)/discovery/case3" />
    case 'case4':
      return <Redirect href="/(auth)/discovery/case4" />
    default:
      return <Redirect href="/(auth)/discovery/case2" />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceDim,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing['2xl'],
  },
  title: {
    fontSize: theme.fontSize.title1,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.footnote,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing['2xl'],
  },
  list: {
    gap: theme.spacing.md,
  },
  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.button,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadow.sm,
  },
  itemText: {
    fontSize: theme.fontSize.callout,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
})
