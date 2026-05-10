import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './screens/home';
import AddExpenseScreen from './screens/addExpense';

/**
 * Layered demo: HomeScreen renders behind, AddExpenseScreen modal slides up
 * over it. Uses RN <View> + absoluteFill so flex propagates correctly under
 * react-native-web (a div block parent breaks flex:1 on the modal overlay).
 *
 * Form is seeded with a valid expense so the primary CTA isn't sitting in a
 * disabled state — the demo shows the slide-up motion, not a broken form.
 */
const AddExpenseDemo: React.FC = () => (
  <View style={styles.root}>
    <View style={StyleSheet.absoluteFill as object}>
      <HomeScreen />
    </View>
    <View style={StyleSheet.absoluteFill as object}>
      <AddExpenseScreen
        initialMerchant="SFO Airport Parking"
        initialAmount="45.00"
        initialDate="03/12/2026"
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
});

export default AddExpenseDemo;
