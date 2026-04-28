import Svg, { Rect, G, Path, Line } from 'react-native-svg'
import { theme } from '../constants/theme'

export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Rect width="200" height="200" rx="16" fill={theme.colors.ink} />
      <G transform="translate(40, 40) scale(1)">
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
        <Line
          x1="30"
          y1="90"
          x2="70"
          y2="30"
          stroke={theme.colors.emerald}
          strokeWidth="16"
          strokeLinecap="square"
        />
        <Path
          d="M 40 30 L 70 30 L 70 60"
          fill="none"
          stroke={theme.colors.emerald}
          strokeWidth="16"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </G>
    </Svg>
  )
}
