import React from 'react';
import { Text, type TextStyle } from 'react-native';
import ioniconsGlyphMap from 'react-native-vector-icons/glyphmaps/Ionicons.json';

type GlyphMap = Record<string, number>;
type IconComponent = React.FC<IconProps> & { glyphMap: GlyphMap };

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
}

const makeIcon = (
  family: string,
  glyphs: GlyphMap,
): IconComponent => {
  const C: React.FC<IconProps> = ({ name, size = 16, color = '#0D0D0D', style }) => {
    const code = glyphs[name];
    const glyph = code != null ? String.fromCharCode(code) : '·';
    return (
      <Text
        accessibilityLabel={name}
        style={[
          {
            fontFamily: family,
            fontSize: size,
            lineHeight: size * 1.1,
            color,
            includeFontPadding: false,
            textAlignVertical: 'center',
            fontStyle: 'normal',
            fontWeight: 'normal',
          } as TextStyle,
          style as TextStyle,
        ]}
      >
        {glyph}
      </Text>
    );
  };
  (C as IconComponent).glyphMap = glyphs;
  return C as IconComponent;
};

export const Ionicons = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);

// Keep other families as fallbacks (use Ionicons font, will render placeholder).
// If TaxPilot ever uses MaterialIcons / Feather etc., copy their TTFs into /public
// and load them here.
export const MaterialIcons = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);
export const Feather = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);
export const FontAwesome = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);
export const FontAwesome5 = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);
export const AntDesign = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);
export const Entypo = makeIcon('Ionicons', ioniconsGlyphMap as GlyphMap);

export default {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Entypo,
};
