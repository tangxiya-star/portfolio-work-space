import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './theme';
import HomeScreen from './screens/home';
import AddExpenseScreen from './screens/addExpense';
import CalendarScreen from './screens/calendar';
import ReportScreen from './screens/report';
import ProfileScreen from './screens/profile';

// Mirrors the real RN tab bar from app/(tabs)/_layout.tsx:
//   newsprint background, no border, Ionicons outline icons,
//   active = ink, inactive = ink @ 50% (theme.colors.textMuted).
type TabKey = 'home' | 'calendar' | 'report' | 'profile';

interface TabBarProps {
  active: TabKey;
  onChange: (k: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home',     label: 'Home',     icon: 'home-outline' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar-outline' },
  { key: 'report',   label: 'Report',   icon: 'document-text-outline' },
  { key: 'profile',  label: 'Profile',  icon: 'person-outline' },
];

const TaxPilotTabBar: React.FC<TabBarProps> = ({ active, onChange }) => (
  <View style={tabStyles.bar}>
    {TABS.map((t) => {
      const isActive = active === t.key;
      const color = isActive ? theme.colors.textPrimary : theme.colors.textMuted;
      return (
        <Pressable
          key={t.key}
          onPress={() => onChange(t.key)}
          accessibilityRole="tab"
          accessibilityLabel={t.label}
          accessibilityState={{ selected: isActive }}
          style={tabStyles.tab}
        >
          <Ionicons name={t.icon} size={24} color={color} />
          <Text style={[tabStyles.label, { color }]}>{t.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const tabStyles = StyleSheet.create({
  bar: {
    height: 64,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

// ── Demo wrapper ───────────────────────────────────────────────────────────
// Composes HomeScreen + TabBar in a single column, then layers AddExpense
// (slide-up modal) and a brief "submitted" toast over the top.
const InteractiveHomeDemo: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('home');
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    if (path === '/add-expense' || path === '/add-income') setAddOpen(true);
  };

  const handleSubmitted = (p: { merchant: string; amount: string }) => {
    setAddOpen(false);
    setToast(`Saved · ${p.merchant} $${p.amount}`);
  };

  // Toast auto-dismiss
  const toastOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!toast) return;
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 250, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [toast, toastOpacity]);

  const ActiveScreen = (() => {
    switch (tab) {
      case 'home':     return <HomeScreen onNavigate={handleNavigate} />;
      case 'calendar': return <CalendarScreen />;
      case 'report':   return <ReportScreen />;
      case 'profile':  return <ProfileScreen />;
    }
  })();

  return (
    <View style={demoStyles.root}>
      <View style={demoStyles.screen}>{ActiveScreen}</View>
      <TaxPilotTabBar active={tab} onChange={setTab} />

      {/* AddExpense modal — layered absoluteFill so its scrim covers tab bar too */}
      {addOpen && (
        <View style={StyleSheet.absoluteFill as object} pointerEvents="box-none">
          <AddExpenseScreen
            initialMerchant="SFO Airport Parking"
            initialAmount="45.00"
            initialDate="03/12/2026"
            onDismiss={() => setAddOpen(false)}
            onSubmitted={handleSubmitted}
          />
        </View>
      )}

      {/* Submitted toast */}
      {toast && (
        <Animated.View style={[demoStyles.toast, { opacity: toastOpacity }]} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={16} color="#22C55F" />
          <Text style={demoStyles.toastText}>{toast}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const EmptyTab: React.FC<{ label: string; hint: string }> = ({ label, hint }) => (
  <View style={demoStyles.empty}>
    <Text style={demoStyles.emptyLabel}>{label}</Text>
    <Text style={demoStyles.emptyHint}>{hint}</Text>
  </View>
);

const demoStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
    position: 'relative',
  },
  screen: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  emptyHint: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  toast: {
    position: 'absolute',
    bottom: 88,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    left: 24,
    right: 24,
    justifyContent: 'center',
  },
  toastText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default InteractiveHomeDemo;
