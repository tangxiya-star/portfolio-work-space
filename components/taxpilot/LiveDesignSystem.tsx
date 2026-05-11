import React, { useState } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { theme } from './theme';
import { typography } from './typography';
import Button, { BUTTON_HEIGHT, BUTTON_SPEC } from './Button';
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
// Reference layout: 3 primary anchors as large swatches, then secondary
// status colors as smaller swatches with grouping by intent.
const PRIMARY: { name: string; hex: string; why: string }[] = [
  { name: 'Ink',       hex: '#0D0D0D', why: 'Text + primary buttons. Off-black to soften contrast against newsprint.' },
  { name: 'Newsprint', hex: '#E3DFD5', why: 'App background. Warm paper tone — the brand canvas.' },
  { name: 'Emerald',   hex: '#22C55F', why: 'Brand mark + positive polarity. Locked in from the first logo variant the AI workflow produced — every other accent had to earn its place against it.' },
];

const SECONDARY_GROUPS: { title: string; intent: string; swatches: { hex: string; role: string }[] }[] = [
  {
    title: 'Status',
    intent: 'Communicate polarity, urgency, and information state.',
    swatches: [
      { hex: '#22C55F', role: 'Positive · gains, confirmed' },
      { hex: '#C2410C', role: 'Caution · pending, due soon' },
      { hex: '#DC2626', role: 'Destructive · errors, owed' },
      { hex: '#2563EB', role: 'Information · links' },
    ],
  },
  {
    title: 'Surface',
    intent: 'Layered backgrounds — separation without strong contrast.',
    swatches: [
      { hex: '#FFFFFF', role: 'Surface · cards' },
      { hex: '#F5F5F0', role: 'Surface dim · pressed states' },
      { hex: '#E3DFD5', role: 'Newsprint · app bg' },
    ],
  },
];

export const ColorBlock: React.FC = () => (
  <div className="space-y-12">
    <div>
      <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#111] pb-3 border-b border-[#111] mb-8">Primary</p>
      <p className="font-sans text-[15px] text-[#666] leading-[1.65] max-w-[68ch] mb-8">
        Ink on newsprint, with emerald as the brand mark. The green wasn't picked from a swatch library — it was the first logo variant my AI-native workflow returned, and the system was then built outward from that single color decision. Every other accent has to earn its place against these three.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRIMARY.map((s) => (
          <div key={s.name}>
            <div
              className="h-48 w-full rounded-md"
              style={{
                background: s.hex,
                border: s.hex === '#FFFFFF' ? '1px solid #111' : 'none',
              }}
            />
            <p className="font-sans text-[18px] font-semibold text-[#111] mt-4">{s.name}</p>
            <p className="font-mono text-[13px] text-[#999] mt-1">{s.hex}</p>
            <p className="font-sans text-[13px] text-[#666] mt-3 leading-[1.6] max-w-[34ch]">{s.why}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#111] pb-3 border-b border-[#111] mb-8">Secondary</p>
      <div className="space-y-10">
        {SECONDARY_GROUPS.map((g) => (
          <div key={g.title}>
            <p className="font-sans text-[20px] font-semibold text-[#111]">{g.title}</p>
            <p className="font-sans text-[14px] text-[#666] mt-1 mb-5">{g.intent}</p>
            <div className="flex flex-wrap gap-6">
              {g.swatches.map((sw) => (
                <div key={sw.hex} className="w-[120px]">
                  <div
                    className="h-[88px] w-[88px] rounded-md"
                    style={{
                      background: sw.hex,
                      border: sw.hex === '#FFFFFF' ? '1px solid #DDD' : 'none',
                    }}
                  />
                  <p className="font-mono text-[12px] text-[#666] mt-3">{sw.hex}</p>
                  <p className="font-sans text-[12px] text-[#999] mt-1 leading-snug">{sw.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 8b. Typography ──────────────────────────────────────────────────────────
// Reference (sample · name · family · weight · size · line-height) — pulls
// from the actual `typography` styles so anything that drifts here would
// surface a real drift in the app.
const weightLabel = (w?: TextStyle['fontWeight']): string => {
  switch (String(w)) {
    case '300': return 'Light';
    case '400': return 'Regular';
    case '500': return 'Medium';
    case '600': return 'Semibold';
    case '700': return 'Bold';
    case '800': return 'ExtraBold';
    default: return 'Regular';
  }
};

const RAMP: { key: keyof typeof typography; label: string; sample: string }[] = [
  { key: 'display',    label: 'Display',  sample: 'Display' },
  { key: 'title1',     label: 'Title 1',  sample: 'Title 1' },
  { key: 'title2',     label: 'Title 2',  sample: 'Title 2' },
  { key: 'headline',   label: 'Headline', sample: 'Headline' },
  { key: 'body',       label: 'Body',     sample: 'Body' },
  { key: 'callout',    label: 'Callout',  sample: 'Callout' },
  { key: 'subhead',    label: 'Subhead',  sample: 'Subhead' },
  { key: 'footnote',   label: 'Footnote', sample: 'Footnote' },
  { key: 'caption1',   label: 'Caption',  sample: 'Caption' },
  { key: 'monoAmount', label: 'Amount',   sample: '$1,284.07' },
  { key: 'mono',       label: 'Mono',     sample: '0123456789' },
];

const TypeRow: React.FC<{ row: typeof RAMP[number] }> = ({ row }) => {
  const s = typography[row.key] as TextStyle;
  return (
    <div className="grid grid-cols-[1fr_140px_110px_70px_90px] items-center gap-6 py-6 border-b border-[#EEEEEE]">
      <div className="min-w-0">
        <Text style={[s as any, { color: '#111' }]} numberOfLines={1}>
          {row.sample}
        </Text>
      </div>
      <div>
        <p className="font-sans text-[13px] text-[#111]">{row.label}</p>
        <p className="font-mono text-[10px] text-[#999] mt-0.5">{s.fontFamily}</p>
      </div>
      <p className="font-sans text-[13px] text-[#444]">{weightLabel(s.fontWeight)}</p>
      <p className="font-mono text-[13px] text-[#444] tabular-nums">{s.fontSize}</p>
      <p className="font-mono text-[13px] text-[#444] tabular-nums">{s.lineHeight}</p>
    </div>
  );
};

export const TypographyBlock: React.FC = () => (
  <Stage bg="#FFFFFF">
    <div className="grid grid-cols-[1fr_140px_110px_70px_90px] items-center gap-6 pb-3 border-b border-[#111]">
      <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#111]">Sample</p>
      <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#111]">Name / Family</p>
      <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#111]">Weight</p>
      <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#111]">Size</p>
      <p className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#111]">Line&nbsp;Height</p>
    </div>
    {RAMP.map((r) => <TypeRow key={r.key} row={r} />)}
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
  return (
    <Stage bg="#FFFFFF">
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

      <div className="mt-16 mb-10">
        <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#111] pb-3 border-b border-[#111] mb-6">Border Radius</p>
        <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[64ch]">
          Corner radius scales with surface size: small for chips and inputs, larger for cards and sheets. Each step has one job — the alias <span className="font-mono text-[13px]">button</span> reserves 12px exclusively for touch targets, so a stray <span className="font-mono text-[13px]">md</span> never lands on a tappable element.
        </p>
      </div>
      <div className="mx-auto max-w-[900px] grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-14 justify-items-center">
        {RADIUS_TILES.map((r) => (
          <div key={r.label} className="flex flex-col items-start w-[200px]">
            <div className="relative w-[200px] h-[200px]">
              {/* White tile */}
              <div
                className="relative w-full h-full bg-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                style={{ borderRadius: r.preview }}
              >
                <span className="font-sans text-[22px] font-medium text-[#111] tabular-nums">{r.label}</span>
              </div>
              {/* Magnifier — glass lens on top of the corner. Mostly transparent
                  so the rounded corner of the tile reads through it. */}
              <div
                aria-hidden="true"
                className="absolute left-4 top-4 w-[96px] h-[96px] rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 80%)',
                  border: '1.5px solid rgba(255,255,255,0.85)',
                  boxShadow:
                    '0 8px 24px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -10px 18px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(1.5px) saturate(105%)',
                  WebkitBackdropFilter: 'blur(1.5px) saturate(105%)',
                  transform: 'translate(-30%, -30%)',
                }}
              />
            </div>
            <p className="font-sans text-[14px] text-[#111] mt-5">
              <span className="font-mono text-[12px] text-[#22C55F] mr-2">{r.token}</span>
              {r.use}
            </p>
          </div>
        ))}
      </div>
    </Stage>
  );
};

const RADIUS_TILES: { token: string; label: string; preview: number; use: string }[] = [
  { token: 'xs',     label: '4px',  preview: 8,  use: 'Status chips inside TransactionRow.' },
  { token: 'sm',     label: '8px',  preview: 16, use: 'Inputs · onboarding cards · stats grid.' },
  { token: 'button', label: '12px', preview: 24, use: 'All touch targets. Reserved alias.' },
  { token: 'md',     label: '16px', preview: 32, use: 'Feature cards · sheets.' },
  { token: 'lg',     label: '24px', preview: 48, use: 'Hero cards · paywall surface.' },
  { token: 'round',  label: 'pill', preview: 9999, use: 'Toggles · SegmentedControl.' },
];

// ── Button reference (Button Scale + Basic States) ──────────────────────────
// All values pulled from `BUTTON_SPEC` / `BUTTON_HEIGHT` in Button.tsx, so the
// spec table is locked to the real component — change Button.tsx and these
// swatches change with it.
type RealVariant = keyof typeof BUTTON_SPEC.variants;
type ButtonState = 'default' | 'pressed' | 'disabled';
type RealSize = keyof typeof BUTTON_HEIGHT;

const VARIANT_KEYS: RealVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'destructive'];
const SIZE_KEYS: RealSize[] = ['small', 'medium', 'large'];

const SIZE_PADDING_X: Record<RealSize, number> = { small: 12, medium: 16, large: 16 };
const SIZE_FONT: Record<RealSize, number> = { small: 13, medium: 16, large: 16 };

/** Engineering-style vertical dimension annotation. Renders a line that exactly
 *  matches the target height with arrowhead caps at top and bottom, plus the
 *  numeric value centered to the left. */
const DimVertical: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-2">
    <span className="font-mono text-[11px] text-[#111] tabular-nums">{value}</span>
    <svg width="10" height={value} viewBox={`0 0 10 ${value}`} fill="none" aria-hidden="true">
      {/* top cap */}
      <line x1="2" y1="1" x2="8" y2="1" stroke="#111" strokeWidth="1" />
      {/* arrowhead top */}
      <path d={`M5 1 L2 6 M5 1 L8 6`} stroke="#111" strokeWidth="1" />
      {/* shaft */}
      <line x1="5" y1="1" x2="5" y2={value - 1} stroke="#111" strokeWidth="1" />
      {/* arrowhead bottom */}
      <path d={`M5 ${value - 1} L2 ${value - 6} M5 ${value - 1} L8 ${value - 6}`} stroke="#111" strokeWidth="1" />
      {/* bottom cap */}
      <line x1="2" y1={value - 1} x2="8" y2={value - 1} stroke="#111" strokeWidth="1" />
    </svg>
  </div>
);

const SpecBtn: React.FC<{
  variant: RealVariant;
  state: ButtonState;
  size?: RealSize;
  icon?: 'left' | 'right';
}> = ({ variant, state, size = 'medium', icon }) => {
  const v = BUTTON_SPEC.variants[variant];
  const p = BUTTON_SPEC.pressed[variant];
  const isPressed = state === 'pressed';
  const isDisabled = state === 'disabled';

  const bg = isPressed ? p.bg : v.bg;
  const text = isPressed ? p.text : v.text;
  const border = v.border;
  const opacity = isDisabled ? BUTTON_SPEC.disabledOpacity : isPressed ? p.opacity : 1;

  const style: React.CSSProperties = {
    height: BUTTON_HEIGHT[size],
    padding: `0 ${SIZE_PADDING_X[size]}px`,
    borderRadius: BUTTON_SPEC.radius,
    background: bg,
    color: text,
    border: border === 'transparent' ? '1px solid transparent' : `1px solid ${border}`,
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: SIZE_FONT[size],
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    opacity,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none',
  };

  return (
    <button type="button" style={style} disabled={isDisabled} onFocus={(e) => e.currentTarget.blur()}>
      {icon === 'left' && <span aria-hidden="true">●</span>}
      Button Text
      {icon === 'right' && <span aria-hidden="true">→</span>}
    </button>
  );
};

const ButtonReference: React.FC = () => (
  <div>
    {/* Button Scale — values from BUTTON_HEIGHT in Button.tsx */}
    <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#111] pb-3 border-b border-[#111] mb-2">Button Scale</p>
    <p className="font-sans text-[12px] text-[#999] mb-10">
      components/taxpilot/Button.tsx · sizes from <span className="font-mono">BUTTON_HEIGHT</span>
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
      {SIZE_KEYS.map((sz) => (
        <div key={sz} className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <DimVertical value={BUTTON_HEIGHT[sz]} />
            <SpecBtn variant="primary" state="default" size={sz} />
          </div>
          <p className="font-sans text-[14px] text-[#111] mt-5 capitalize">{sz}</p>
          <p className="font-mono text-[11px] text-[#999] mt-1">size=&quot;{sz}&quot;</p>
        </div>
      ))}
    </div>

    {/* Basic States matrix — values from BUTTON_SPEC.variants + BUTTON_SPEC.pressed */}
    <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#111] pb-3 border-b border-[#111] mb-2">Basic States</p>
    <p className="font-sans text-[12px] text-[#999] mb-8">
      All cells render from <span className="font-mono">BUTTON_SPEC</span> — the 5 real variants × 3 mobile states
    </p>
    <div className="bg-white rounded-[12px] p-6">
      <div
        className="grid gap-y-6 gap-x-3 items-center"
        style={{ gridTemplateColumns: `80px repeat(${VARIANT_KEYS.length}, minmax(0, 1fr))` }}
      >
        <div />
        {VARIANT_KEYS.map((v) => (
          <p key={v} className="font-sans text-[12px] text-[#111] text-center capitalize">{v}</p>
        ))}
        {(['default', 'pressed', 'disabled'] as ButtonState[]).map((state) => (
          <React.Fragment key={state}>
            <p className="font-sans text-[12px] text-[#111] capitalize">{state}</p>
            {VARIANT_KEYS.map((v) => (
              <div key={v} className="flex items-center justify-center min-w-0">
                <SpecBtn variant={v} state={state} size="small" />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <p className="font-sans text-[12px] text-[#999] mt-8">
        Mobile-only — no hover state. Pressed is the active feedback when a touch is held.
      </p>
    </div>
  </div>
);

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
      <ButtonReference />

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
