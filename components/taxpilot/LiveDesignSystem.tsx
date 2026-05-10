import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './theme';
import { typography } from './typography';
import Button from './Button';
import SmallButton from './SmallButton';
import SegmentedControl from './SegmentedControl';
import SelectionCard from './SelectionCard';
import SpinningLoader from './SpinningLoader';
import Toggle from './Toggle';
import TransactionRow, { type Transaction } from './TransactionRow';

// ── Layout chrome ───────────────────────────────────────────────────────────
const Stage: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = theme.colors.newsprint }) => (
  <View style={{ backgroundColor: bg, padding: 24, borderRadius: 12 }}>{children}</View>
);

// ── 8a. Color ───────────────────────────────────────────────────────────────
const SWATCHES: { name: string; hex: string; why: string }[] = [
  { name: 'Ink',         hex: '#0D0D0D', why: 'Text + primary surfaces. Off-black to soften contrast.' },
  { name: 'Newsprint',   hex: '#E3DFD5', why: 'Background. Warm paper tone, not a sterile gray.' },
  { name: 'Emerald',     hex: '#22C55F', why: 'Polarity / positive value. The only green allowed.' },
  { name: 'Surface',     hex: '#FFFFFF', why: 'Card surfaces.' },
  { name: 'Surface dim', hex: '#F5F5F0', why: 'Pressed states + secondary surfaces.' },
  { name: 'Amber',       hex: '#C2410C', why: 'Caution / pending status.' },
  { name: 'Red',         hex: '#DC2626', why: 'Destructive / error.' },
  { name: 'Blue',        hex: '#2563EB', why: 'Information / links.' },
];

export const ColorBlock: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {SWATCHES.map((s) => (
      <div key={s.name} className="border border-[#E8E8E8] bg-white overflow-hidden">
        <div className="h-24 w-full" style={{ background: s.hex }} />
        <div className="p-3">
          <p className="font-sans text-[13px] font-semibold text-[#111111]">{s.name}</p>
          <p className="font-mono text-[11px] text-[#999999] mt-0.5">{s.hex}</p>
          <p className="font-sans text-[12px] text-[#666666] mt-2 leading-snug">{s.why}</p>
        </div>
      </div>
    ))}
  </div>
);

// ── 8b. Typography ──────────────────────────────────────────────────────────
const RAMP: { key: keyof typeof typography; label: string; sample: string }[] = [
  { key: 'display',   label: 'Display 34',  sample: 'A tax position, on any day.' },
  { key: 'title1',    label: 'Title1 28',   sample: 'Last 30 days' },
  { key: 'title2',    label: 'Title2 22',   sample: 'Income & expenses' },
  { key: 'headline',  label: 'Headline 17', sample: 'You owe $4,128 in estimated tax.' },
  { key: 'body',      label: 'Body 17',     sample: 'TaxPilot pulls transactions from your bank in the background.' },
  { key: 'callout',   label: 'Callout 16',  sample: 'Tap a day to see what moved.' },
  { key: 'subhead',   label: 'Subhead 15',  sample: 'Categorized · 4 hours ago' },
  { key: 'footnote',  label: 'Footnote 13', sample: 'Plaid · auto-refreshed' },
  { key: 'caption1',  label: 'Caption1 12', sample: 'TUE · 14 MAR' },
];

export const TypographyBlock: React.FC = () => (
  <Stage bg="#FFFFFF">
    <View style={{ gap: 18 }}>
      {RAMP.map((r) => (
        <View key={r.key} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 24 }}>
          <Text style={[typography.caption2 as any, { width: 110, color: '#999' }]}>{r.label}</Text>
          <Text style={typography[r.key] as any}>{r.sample}</Text>
        </View>
      ))}
      <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 8 }} />
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 24 }}>
        <Text style={[typography.caption2 as any, { width: 110, color: '#999' }]}>Mono amount</Text>
        <Text style={typography.monoAmount as any}>$1,284.07</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 24 }}>
        <Text style={[typography.caption2 as any, { width: 110, color: '#999' }]}>Mono</Text>
        <Text style={typography.mono as any}>JetBrains Mono · 17</Text>
      </View>
    </View>
  </Stage>
);

// ── 8c. Spacing + radius ────────────────────────────────────────────────────
// Only the tokens actually referenced in the TaxPilot codebase.
// Cut: xxs(2) → merged into xs (2px wasn't distinct), 4xl(64) → 0 references.
const SPACING_STEPS: { name: string; v: number; note: string }[] = [
  { name: 'xs',  v: 4,  note: 'tight inline gaps' },
  { name: 'sm',  v: 8,  note: 'list rows · button gaps' },
  { name: 'md',  v: 12, note: 'card padding · form rows' },
  { name: 'lg',  v: 16, note: 'card-to-card · section blocks' },
  { name: 'xl',  v: 24, note: 'screen edges · top-level breathing' },
  { name: '2xl', v: 32, note: 'header → content · onboarding gaps' },
  { name: '3xl', v: 48, note: 'tab content padBottom · CTA padBottom' },
];
const RADIUS_STEPS: { name: string; v: number; note: string }[] = [
  { name: 'xs',     v: 4,    note: 'tight inner shapes (chips, dots)' },
  { name: 'sm',     v: 8,    note: 'onboarding cards · inputs' },
  { name: 'button', v: 12,   note: 'all buttons (RN convention)' },
  { name: 'md',     v: 16,   note: 'feature cards · sheets' },
  { name: 'lg',     v: 24,   note: 'hero cards · paywall' },
  { name: 'round',  v: 9999, note: 'pill — toggles, segmented control' },
];

const TILE = 32; // shared display size — keeps spacing + radius visually consistent

// ── Example cell: real UI + engineer-style annotation ───────────────────────
const ExampleCell: React.FC<{
  token: string;
  value: string;
  note: string;
  children: React.ReactNode;
}> = ({ token, value, note, children }) => (
  <div className="border border-[#E8E8E8] bg-white p-5 flex flex-col">
    <div className="flex items-baseline gap-2 mb-3">
      <span className="font-mono text-[12px] text-[#111] font-semibold">{token}</span>
      <span className="font-mono text-[11px] text-[#22C55F]">{value}</span>
    </div>
    <p className="font-sans text-[12px] text-[#666] mb-4 leading-snug">{note}</p>
    <div className="flex-1 flex items-center justify-center min-h-[120px] bg-[#F5F5F0] rounded-md p-6">
      {children}
    </div>
  </div>
);

// ── Engineer dimension annotations ──────────────────────────────────────────
const ANNOT = '#22C55F';

/** Horizontal dimension line with end caps + label.
 *  Renders to width = `length`, with a small chip label centered above. */
const HDim: React.FC<{ length: number; value: string; height?: number }> = ({
  length, value, height = 16,
}) => (
  <div style={{ position: 'relative', width: length, height: height + 8 }}>
    <svg width={length} height={height + 8} style={{ position: 'absolute', left: 0, top: 0 }}>
      {/* End caps */}
      <line x1={0.5} y1={2} x2={0.5} y2={height} stroke={ANNOT} strokeWidth={1} />
      <line x1={length - 0.5} y1={2} x2={length - 0.5} y2={height} stroke={ANNOT} strokeWidth={1} />
      {/* Center line */}
      <line x1={0.5} y1={height / 2 + 1} x2={length - 0.5} y2={height / 2 + 1} stroke={ANNOT} strokeWidth={1} />
      {/* Tiny arrow ticks */}
      <polygon points={`0,${height/2 + 1} 4,${height/2 - 2} 4,${height/2 + 4}`} fill={ANNOT} />
      <polygon points={`${length},${height/2 + 1} ${length - 4},${height/2 - 2} ${length - 4},${height/2 + 4}`} fill={ANNOT} />
    </svg>
    <span
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: height + 4,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
        color: ANNOT,
        background: '#F5F5F0',
        padding: '0 4px',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  </div>
);

/** Vertical dimension line with end caps + label. */
const VDim: React.FC<{ length: number; value: string; width?: number }> = ({
  length, value, width = 16,
}) => (
  <div style={{ position: 'relative', height: length, width: width + 24 }}>
    <svg width={width} height={length} style={{ position: 'absolute', left: 0, top: 0 }}>
      <line x1={2} y1={0.5} x2={width} y2={0.5} stroke={ANNOT} strokeWidth={1} />
      <line x1={2} y1={length - 0.5} x2={width} y2={length - 0.5} stroke={ANNOT} strokeWidth={1} />
      <line x1={width / 2 + 1} y1={0.5} x2={width / 2 + 1} y2={length - 0.5} stroke={ANNOT} strokeWidth={1} />
      <polygon points={`${width/2 + 1},0 ${width/2 - 2},4 ${width/2 + 4},4`} fill={ANNOT} />
      <polygon points={`${width/2 + 1},${length} ${width/2 - 2},${length - 4} ${width/2 + 4},${length - 4}`} fill={ANNOT} />
    </svg>
    <span
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: width + 4,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
        color: ANNOT,
        background: '#F5F5F0',
        padding: '0 4px',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  </div>
);

/** Radius arc + label at a corner. position is the corner of the parent. */
const RadiusAnnot: React.FC<{ r: number; value: string; corner?: 'tr' | 'br' }> = ({
  r, value, corner = 'tr',
}) => {
  const size = Math.min(r * 2 + 16, 56);
  const isPill = r >= 9999;
  const drawR = isPill ? size / 2 : r;
  // place at corner of parent (parent must be position: relative)
  const cornerStyle: React.CSSProperties =
    corner === 'tr'
      ? { top: -2, right: -2 }
      : { bottom: -2, right: -2 };
  return (
    <div
      style={{
        position: 'absolute',
        ...cornerStyle,
        width: size,
        height: size,
        pointerEvents: 'none',
      }}
    >
      <svg width={size} height={size}>
        {/* Arc indicating the corner radius */}
        <path
          d={
            corner === 'tr'
              ? `M ${size - drawR} 1 A ${drawR} ${drawR} 0 0 1 ${size - 1} ${drawR}`
              : `M ${size - 1} ${size - drawR} A ${drawR} ${drawR} 0 0 1 ${size - drawR} ${size - 1}`
          }
          stroke={ANNOT}
          strokeWidth={1.25}
          fill="none"
          strokeDasharray="3 2"
        />
        {/* Radius pointer line from arc midpoint inward */}
        {!isPill && (
          <line
            x1={corner === 'tr' ? size - drawR : size - drawR}
            y1={corner === 'tr' ? drawR : size - drawR}
            x2={corner === 'tr' ? size - drawR - 10 : size - drawR - 10}
            y2={corner === 'tr' ? drawR + 10 : size - drawR - 10}
            stroke={ANNOT}
            strokeWidth={1}
          />
        )}
      </svg>
      <span
        style={{
          position: 'absolute',
          [corner === 'tr' ? 'top' : 'bottom']: drawR + 2,
          right: drawR + 2,
          transform: 'translate(50%, 0)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          color: ANNOT,
          background: '#F5F5F0',
          padding: '0 4px',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  );
};

// ── Spacing zones — Figma-inspect-style highlighted gap ─────────────────────
const SpacingZone: React.FC<{
  size: number;
  axis: 'h' | 'v';
  value: string;
}> = ({ size, axis, value }) => {
  const showLabel = size >= 12;
  return (
    <div
      style={{
        position: 'relative',
        width: axis === 'h' ? size : '100%',
        height: axis === 'v' ? size : 'auto',
        alignSelf: axis === 'h' ? 'stretch' : 'stretch',
        backgroundColor: 'rgba(34, 197, 95, 0.18)',
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent 0 3px, rgba(34,197,95,0.4) 3px 4px)',
        outline: '1px dashed rgba(34, 197, 95, 0.7)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showLabel && (
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            fontWeight: 700,
            color: '#0E7E3F',
            background: '#fff',
            padding: '0 3px',
            borderRadius: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
};

// ── Real-screen fragments (anchored to actual files in taxpilot-app) ────────

// xs(4) — TransactionRow caption gap
// from: components/common/TransactionRow.tsx:83
const SpacingXsFragment: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 16,
        color: theme.colors.textPrimary,
      } as any}
    >
      Adobe Creative Cloud
    </Text>
    <SpacingZone size={4} axis="v" value="xs · 4" />
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 11,
        color: theme.colors.textMuted,
        fontWeight: '500',
      } as any}
    >
      $54.99 · Mar 13
    </Text>
  </div>
);

// sm(8) — pending pill on home (paddingVertical sm + gap sm)
// from: app/(tabs)/index.tsx:43-47
const SpacingSmFragment: React.FC = () => (
  <div
    style={{
      display: 'inline-flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: 'rgba(194, 65, 12, 0.1)',
      borderRadius: 9999,
    }}
  >
    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.amber }} />
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.amber,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      } as any}
    >
      3 pending
    </Text>
    <SpacingZone size={8} axis="h" value="sm · 8" />
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.amber,
        textDecorationLine: 'underline' as any,
      } as any}
    >
      Review
    </Text>
  </div>
);

// md(12) — stats grid: gap between two adjacent grid items
// from: app/(tabs)/index.tsx:237 (gap: md inside gridRow)
const SpacingMdFragment: React.FC = () => {
  const Item = ({ label, value }: { label: string; value: string }) => (
    <View
      style={{
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 9,
          fontWeight: '600',
          letterSpacing: 1.5,
          color: theme.colors.textSecondary,
          textTransform: 'uppercase',
          marginBottom: 4,
        } as any}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 18,
          fontWeight: '700',
          color: theme.colors.textPrimary,
        } as any}
      >
        {value}
      </Text>
    </View>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', width: '100%' }}>
      <Item label="Total income" value="$48,210" />
      <SpacingZone size={12} axis="h" value="md · 12" />
      <Item label="Deductible" value="$9,247" />
    </div>
  );
};

// lg(16) — hero card → stats grid vertical spacing
// from: app/(tabs)/index.tsx:277 (heroCard marginBottom: lg)
const SpacingLgFragment: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        backgroundColor: theme.colors.ink,
      }}
    >
      <Text
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 9,
          fontWeight: '600',
          letterSpacing: 1.5,
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          marginBottom: 4,
        } as any}
      >
        Estimated tax reduction
      </Text>
      <Text
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 28,
          fontWeight: '700',
          color: '#fff',
          letterSpacing: -0.5,
        } as any}
      >
        $9,247
      </Text>
    </View>
    <SpacingZone size={16} axis="v" value="lg · 16" />
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 12,
          color: theme.colors.textPrimary,
        } as any}
      >
        Stats grid →
      </Text>
    </View>
  </div>
);

// 2xl(32) — header → first content (e.g., loading screen header to cards)
// from: app/(auth)/loading.tsx:333 (header marginBottom: 2xl)
const Spacing2xlFragment: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
    <Text
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        textAlign: 'center',
        letterSpacing: -0.3,
      } as any}
    >
      Connecting your{'\n'}accounts
    </Text>
    <SpacingZone size={32} axis="v" value="2xl · 32" />
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 13,
          fontWeight: '600',
          color: theme.colors.textPrimary,
        } as any}
      >
        Chase Checking · 8821
      </Text>
    </View>
  </div>
);

// 3xl(48) — bottom CTA breathing room (tab list paddingBottom, sticky button)
// from: app/(tabs)/calendar.tsx:209 (paddingBottom: 3xl)
const Spacing3xlFragment: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Text
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 12,
          color: theme.colors.textPrimary,
        } as any}
      >
        … last transaction
      </Text>
    </View>
    <SpacingZone size={48} axis="v" value="3xl · 48" />
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.ink,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 14,
          fontWeight: '600',
          color: '#fff',
        } as any}
      >
        Start Analysis
      </Text>
    </View>
  </div>
);

// xl(24) — hero card padding (content inset from card edge)
// from: app/(tabs)/index.tsx:276 (heroCard padding: xl)
const SpacingXlFragment: React.FC = () => (
  <div
    style={{
      position: 'relative',
      borderRadius: 24,
      backgroundColor: theme.colors.ink,
      width: '100%',
      maxWidth: 280,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* dashed inner content boundary */}
    <div
      style={{
        position: 'absolute',
        inset: 24,
        outline: '1px dashed rgba(34, 197, 95, 0.7)',
        pointerEvents: 'none',
      }}
    />
    {/* xl label sitting in the padding zone */}
    <span
      style={{
        position: 'absolute',
        top: 4,
        left: 8,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9,
        fontWeight: 700,
        color: '#22C55F',
        background: theme.colors.ink,
        padding: '0 3px',
      }}
    >
      xl · 24
    </span>
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 9,
        fontWeight: '600',
        letterSpacing: 1.5,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'uppercase',
        marginBottom: 4,
      } as any}
    >
      Estimated tax reduction
    </Text>
    <Text
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: -0.5,
      } as any}
    >
      $9,247
    </Text>
  </div>
);

// ── Radius examples — actual components / contexts ──────────────────────────
const RadiusChipExample: React.FC = () => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: 'rgba(34, 197, 95, 0.1)',
    }}
  >
    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.green }} />
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 11,
        color: theme.colors.green,
        fontWeight: '600',
      }}
    >
      Confirmed
    </Text>
  </View>
);

const RadiusInputExample: React.FC = () => (
  <View
    style={{
      width: 180,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: '#fff',
    }}
  >
    <Text
      style={{
        fontFamily: '"Plus Jakarta Sans", sans-serif',
        fontSize: 13,
        color: theme.colors.textPrimary,
      }}
    >
      $1,284.07
    </Text>
  </View>
);

const RadiusFeatureCardExample: React.FC = () => (
  <View
    style={{
      width: 180,
      padding: 12,
      borderRadius: 16,
      backgroundColor: theme.colors.newsprint,
    }}
  >
    <Text
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9,
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}
    >
      Estimated tax
    </Text>
    <Text
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.textPrimary,
      }}
    >
      $4,128
    </Text>
  </View>
);

const RadiusHeroCardExample: React.FC = () => (
  <View
    style={{
      width: 200,
      padding: 16,
      borderRadius: 24,
      backgroundColor: theme.colors.ink,
    }}
  >
    <Text
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 9,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 8,
      }}
    >
      Pro plan
    </Text>
    <Text
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
      }}
    >
      $9 / mo
    </Text>
  </View>
);

export const SpacingBlock: React.FC = () => {
  const [t, setT] = useState(true);
  return (
    <Stage>
      <Text style={[typography.label as any, { marginBottom: 4 }]}>Spacing — 8pt grid</Text>
      <Text style={[typography.caption2 as any, { color: '#666', marginBottom: 20, maxWidth: 560 }]}>
        Seven steps. Started with nine — <Text style={{ fontFamily: '"JetBrains Mono", monospace' } as any}>xxs(2)</Text> merged into <Text style={{ fontFamily: '"JetBrains Mono", monospace' } as any}>xs(4)</Text> (2px wasn't distinct at body-text scale) and <Text style={{ fontFamily: '"JetBrains Mono", monospace' } as any}>4xl(64)</Text> cut (never referenced in production). Examples below are verbatim screen fragments.
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ExampleCell
          token="xs"
          value="4px"
          note="Caption gap inside TransactionRow."
        >
          <SpacingXsFragment />
        </ExampleCell>
        <ExampleCell
          token="sm"
          value="8px"
          note="Pending pill — gap between text + Review link."
        >
          <SpacingSmFragment />
        </ExampleCell>
        <ExampleCell
          token="md"
          value="12px"
          note="Stats grid — gap between adjacent metric cards."
        >
          <SpacingMdFragment />
        </ExampleCell>
        <ExampleCell
          token="lg"
          value="16px"
          note="Hero card → stats grid vertical."
        >
          <SpacingLgFragment />
        </ExampleCell>
        <ExampleCell
          token="xl"
          value="24px"
          note="Hero card padding — outer edge to content."
        >
          <SpacingXlFragment />
        </ExampleCell>
        <ExampleCell
          token="2xl"
          value="32px"
          note="Header → first content. Onboarding section gaps."
        >
          <Spacing2xlFragment />
        </ExampleCell>
        <ExampleCell
          token="3xl"
          value="48px"
          note="Bottom-of-screen CTA padding · tab list padBottom."
        >
          <Spacing3xlFragment />
        </ExampleCell>
      </div>

      <Text style={[typography.label as any, { marginTop: 36, marginBottom: 4 }]}>Radius</Text>
      <Text style={[typography.caption2 as any, { color: '#666', marginBottom: 20, maxWidth: 560 }]}>
        Six steps, each on the actual element. The dashed arc + value sits at the corner. <Text style={{ fontFamily: '"JetBrains Mono", monospace' } as any}>button(12)</Text> is a semantic alias — RN convention reserves a numeric step exclusively for touch targets.
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ExampleCell token="xs" value="4px" note="Confirmed status chip inside TransactionRow.">
          <div style={{ position: 'relative' }}>
            <RadiusChipExample />
            <RadiusAnnot r={4} value="4" />
          </div>
        </ExampleCell>
        <ExampleCell token="sm" value="8px" note="Stats grid card · text inputs · onboarding cards.">
          <div style={{ position: 'relative' }}>
            <RadiusInputExample />
            <RadiusAnnot r={8} value="8" />
          </div>
        </ExampleCell>
        <ExampleCell token="button" value="12px" note="Every Button. Reserved name for touch targets.">
          <div style={{ position: 'relative' }}>
            <Button title="Connect bank" onPress={() => {}} variant="primary" />
            <RadiusAnnot r={12} value="12" />
          </div>
        </ExampleCell>
        <ExampleCell token="md" value="16px" note="Feature cards, sheets.">
          <div style={{ position: 'relative' }}>
            <RadiusFeatureCardExample />
            <RadiusAnnot r={16} value="16" />
          </div>
        </ExampleCell>
        <ExampleCell token="lg" value="24px" note="Hero cards (home estimated-tax card), paywall.">
          <div style={{ position: 'relative' }}>
            <RadiusHeroCardExample />
            <RadiusAnnot r={24} value="24" />
          </div>
        </ExampleCell>
        <ExampleCell token="round" value="pill" note="Toggles, SegmentedControl — anything that reads as round.">
          <div style={{ position: 'relative' }}>
            <Toggle value={t} onValueChange={setT} />
            <RadiusAnnot r={9999} value="pill" />
          </div>
        </ExampleCell>
      </div>
    </Stage>
  );
};

// ── 8d. Component library ───────────────────────────────────────────────────
const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={styles.rowSlot}>{children}</View>
  </View>
);

// For intrinsic-width components (SmallButton etc.) that should not be stretched.
const InlineRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <View style={styles.rowSlotInline}>{children}</View>
  </View>
);

const Section: React.FC<{ title: string; source: string; children: React.ReactNode }> = ({
  title, source, children,
}) => (
  <details className="border border-[#E8E8E8] bg-white" open>
    <summary className="cursor-pointer flex items-baseline justify-between px-5 py-4 border-b border-[#E8E8E8]">
      <span className="font-sans text-[15px] font-semibold text-[#111111]">{title}</span>
      <span className="font-mono text-[11px] text-[#999999]">{source}</span>
    </summary>
    <div className="p-5">
      <Stage>{children}</Stage>
    </div>
  </details>
);

const tx = (over: Partial<Transaction>): Transaction => ({
  id: '0',
  merchant_name: 'Merchant',
  amount: 0,
  date: 'Mar 14',
  status: 'confirmed',
  is_income: false,
  ...over,
});

export const ComponentLibrary: React.FC = () => {
  type Range = 'daily' | 'weekly' | 'monthly';
  const [seg, setSeg] = useState<Range>('weekly');
  const [t1, setT1] = useState(true);
  const [t2, setT2] = useState(false);
  const [card, setCard] = useState(0);

  return (
    <div className="space-y-4">
      <Section title="Button" source="components/taxpilot/Button.tsx">
        <InlineRow label="primary">
          <Button title="Connect bank" onPress={() => {}} variant="primary" />
        </InlineRow>
        <InlineRow label="secondary">
          <Button title="Skip for now" onPress={() => {}} variant="secondary" />
        </InlineRow>
        <InlineRow label="outline">
          <Button title="View report" onPress={() => {}} variant="outline" />
        </InlineRow>
        <InlineRow label="ghost">
          <Button title="Cancel" onPress={() => {}} variant="ghost" />
        </InlineRow>
        <InlineRow label="destructive">
          <Button title="Disconnect" onPress={() => {}} variant="destructive" />
        </InlineRow>
        <InlineRow label="loading">
          <Button title="Connect bank" onPress={() => {}} variant="primary" loading />
        </InlineRow>
        <InlineRow label="disabled">
          <Button title="Connect bank" onPress={() => {}} variant="primary" disabled />
        </InlineRow>
      </Section>

      <Section title="SmallButton" source="components/taxpilot/SmallButton.tsx">
        <InlineRow label="default">
          <SmallButton title="Add receipt" onPress={() => {}} />
        </InlineRow>
        <InlineRow label="with icon">
          <SmallButton title="Edit" onPress={() => {}} icon="create-outline" />
        </InlineRow>
      </Section>

      <Section title="SegmentedControl" source="components/taxpilot/SegmentedControl.tsx">
        <SegmentedControl<Range>
          options={[
            { label: 'Daily',   value: 'daily' },
            { label: 'Weekly',  value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ]}
          value={seg}
          onChange={setSeg}
        />
      </Section>

      <Section title="Toggle" source="components/taxpilot/Toggle.tsx">
        <InlineRow label="on">
          <Toggle value={t1} onValueChange={setT1} />
        </InlineRow>
        <InlineRow label="off">
          <Toggle value={t2} onValueChange={setT2} />
        </InlineRow>
      </Section>

      <Section title="SelectionCard" source="components/taxpilot/SelectionCard.tsx">
        <View style={{ gap: 8 }}>
          {[
            { label: 'Freelancer',     description: '1099 income, project-based work.' },
            { label: 'Small business', description: 'You own an LLC or S-corp.' },
            { label: 'Side income',    description: 'Day job + occasional gigs.' },
          ].map((c, i) => (
            <SelectionCard
              key={c.label}
              label={c.label}
              description={c.description}
              selected={card === i}
              onPress={() => setCard(i)}
            />
          ))}
        </View>
      </Section>

      <Section title="SpinningLoader" source="components/taxpilot/SpinningLoader.tsx">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
          <SpinningLoader />
          <Text style={typography.body as any}>Loading transactions…</Text>
        </View>
      </Section>

      <Section title="TransactionRow" source="components/taxpilot/TransactionRow.tsx">
        <View style={{ gap: 0 }}>
          <TransactionRow
            item={tx({ id: '1', merchant_name: 'Stripe payout',         amount:  4280.00, date: 'Mar 14', status: 'confirmed', is_income: true  })}
          />
          <TransactionRow
            item={tx({ id: '2', merchant_name: 'Adobe Creative Cloud',  amount:    54.99, date: 'Mar 13', status: 'confirmed', is_income: false, suggested_branches: [{ category: 'Software' }] })}
          />
          <TransactionRow
            item={tx({ id: '3', merchant_name: 'Uber',                  amount:    18.42, date: 'Mar 12', status: 'pending',   is_income: false, suggested_branches: [{ category: 'Travel' }] })}
          />
          <TransactionRow
            item={tx({ id: '4', merchant_name: 'Whole Foods',           amount:    72.31, date: 'Mar 11', status: 'confirmed', is_income: false, suggested_branches: [{ category: 'Personal' }] })}
          />
        </View>
      </Section>
    </div>
  );
};

// ── Tabular figures comparison (used in §5a) ────────────────────────────────
const ROWS = [
  { m: 'Stripe payout',         a:  4280.00, c: 'Income · 1099' },
  { m: 'Adobe Creative Cloud',  a:   -54.99, c: 'Software · deductible' },
  { m: 'Uber',                  a:   -18.42, c: 'Transport' },
  { m: 'Whole Foods',           a:   -72.31, c: 'Groceries' },
  { m: 'AWS',                   a:  -129.00, c: 'Software · deductible' },
  { m: 'Client invoice — Acme', a:  1750.00, c: 'Income · 1099' },
];

const fmt = (n: number) => (n < 0 ? '-' : '+') + '$' + Math.abs(n).toFixed(2);

export const TabularFiguresDemo: React.FC<{ tabular: boolean }> = ({ tabular }) => (
  <div
    className="p-5 rounded-lg"
    style={{ background: theme.colors.newsprint }}
  >
    {ROWS.map((r, i) => (
      <div
        key={i}
        className="flex items-baseline justify-between py-3"
        style={{ borderBottom: i < ROWS.length - 1 ? `1px solid ${theme.colors.border}` : 'none' }}
      >
        <div>
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 15,
              fontWeight: 600,
              color: theme.colors.textPrimary,
              margin: 0,
            }}
          >
            {r.m}
          </p>
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 12,
              color: theme.colors.textSecondary,
              marginTop: 2,
              margin: 0,
            }}
          >
            {r.c}
          </p>
        </div>
        <span
          style={{
            fontFamily: tabular
              ? '"JetBrains Mono", ui-monospace, monospace'
              : '"Plus Jakarta Sans", sans-serif',
            fontSize: 15,
            fontWeight: 600,
            color: r.a > 0 ? theme.colors.emerald : theme.colors.textPrimary,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {fmt(r.a)}
        </span>
      </div>
    ))}
    <p
      style={{
        marginTop: 12,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
        color: theme.colors.textMuted,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}
    >
      {tabular ? 'JetBrains Mono · tabular' : 'Plus Jakarta Sans · proportional'}
    </p>
  </div>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 16,
  },
  rowLabel: {
    width: 100,
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 11,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  rowSlot: {
    flex: 1,
  },
  rowSlotInline: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
});
