import React from 'react';
import { View } from 'react-native';
import { theme } from './theme';

interface PhoneFrameProps {
  children: React.ReactNode;
  /** Logical iPhone width in px. Default 390 (iPhone 14/15). */
  width?: number;
  /** Logical iPhone height in px. Default 844 (iPhone 14/15 — matches the real device the app targets). */
  height?: number;
  /** Optional uniform scale; everything inside scales down proportionally. */
  scale?: number;
}

/**
 * Minimal phone frame in Rauno-style chrome:
 * 1px hairline outer, 36px notch indent, no decoration. Background = newsprint
 * to match the in-app surface so the screen content reads as itself, not a chrome demo.
 */
const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  width = 390,
  height = 844,
  scale = 0.66,
}) => {
  const displayedWidth = width * scale;
  const displayedHeight = height * scale;
  return (
    <div
      style={{
        width: displayedWidth,
        height: displayedHeight,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: 40,
          border: '1px solid rgba(0,0,0,0.12)',
          background: theme.colors.newsprint,
          overflow: 'hidden',
        }}
      >
        <View style={{ flex: 1, height: '100%' }}>
          {children}
        </View>
      </div>
    </div>
  );
};

export default PhoneFrame;
