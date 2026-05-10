import React from 'react';
import { View, type ViewProps } from 'react-native';

type EdgeInsets = { top: number; right: number; bottom: number; left: number };
const ZERO: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export const SafeAreaView: React.FC<ViewProps & { edges?: readonly string[] }> = ({
  children, style, edges, ...rest
}) => (
  <View style={style} {...rest}>
    {children}
  </View>
);

export const SafeAreaProvider: React.FC<{ children?: React.ReactNode; style?: ViewProps['style'] }> = ({
  children,
}) => <>{children}</>;

export const useSafeAreaInsets = () => ZERO;

export default { SafeAreaView, SafeAreaProvider, useSafeAreaInsets };
