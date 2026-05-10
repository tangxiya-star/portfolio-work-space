import React from 'react';
import { View, type ViewProps } from 'react-native';

interface LinearGradientProps extends ViewProps {
  colors: readonly string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: readonly number[];
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  locations,
  style,
  children,
  ...rest
}) => {
  const angleRad = Math.atan2(end.y - start.y, end.x - start.x);
  const angleDeg = (angleRad * 180) / Math.PI + 90;
  const stops = colors
    .map((c, i) => {
      const loc = locations?.[i];
      return loc != null ? `${c} ${loc * 100}%` : c;
    })
    .join(', ');
  return (
    <View
      {...rest}
      style={[
        style,
        // @ts-expect-error react-native-web allows backgroundImage
        { backgroundImage: `linear-gradient(${angleDeg}deg, ${stops})` },
      ]}
    >
      {children}
    </View>
  );
};

export default LinearGradient;
