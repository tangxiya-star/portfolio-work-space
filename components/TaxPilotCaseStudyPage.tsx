import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';
import {
  ColorBlock,
  TypographyBlock,
  SpacingBlock,
  ComponentLibrary,
  TabularFiguresDemo,
} from './taxpilot/LiveDesignSystem';
import PhoneFrame from './taxpilot/PhoneFrame';
import DemoStage from './taxpilot/DemoStage';
import { View } from 'react-native';

import Case1Screen from './taxpilot/screens/case1';
import Case2Screen from './taxpilot/screens/case2';
import Case3Screen from './taxpilot/screens/case3';
import Case4Screen from './taxpilot/screens/case4';
import TransitionScreen from './taxpilot/screens/transition';
import LoadingScreen from './taxpilot/screens/loading';
import AnalyzingScreen from './taxpilot/screens/analyzing';
import CalendarScreen from './taxpilot/screens/calendar';
import { CardStack, type AccountItem } from './taxpilot/CardStack';

import InteractiveHomeDemo from './taxpilot/InteractiveHomeDemo';
import Toggle from './taxpilot/Toggle';
import SegmentedControl from './taxpilot/SegmentedControl';
import SelectionCard from './taxpilot/SelectionCard';
import SpinningLoader from './taxpilot/SpinningLoader';
import TransactionRow from './taxpilot/TransactionRow';

// ──────────────────────────────────────────────────────────────────────────────
//  Local primitives (mirror Patiently's vocabulary)
// ──────────────────────────────────────────────────────────────────────────────

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const LayerLabel: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#999999]">{text}</p>
);

const SectionHeading: React.FC<{ label: string; title: string }> = ({ label, title }) => (
  <div className="group w-fit">
    <div className="flex items-center gap-2 mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55F]" />
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#999999] m-0 leading-none">{label}</p>
    </div>
    <h2 className="font-sans text-[30px] md:text-[40px] font-semibold tracking-[-0.025em] leading-[1.05] text-[#222222]">{title}</h2>
  </div>
);

const Rule = () => <hr className="my-24 md:my-28 border-0 h-px" style={{ background: 'rgba(0,0,0,0.06)' }} />;

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
//  CodeBlock — dark, JetBrains-Mono pane with token-level coloring.
//  No external highlighter dependency. Lines are passed as token arrays so
//  each span can be colored explicitly (kw / type / str / fn / com / num / plain).
// ──────────────────────────────────────────────────────────────────────────────

type TokenKind = 'kw' | 'type' | 'str' | 'fn' | 'com' | 'num' | 'plain' | 'punct' | 'attr' | 'tag';
type Token = { k: TokenKind; t: string };
type Line = Token[];

// Pristine light-mode syntax palette — restrained editorial colors.
// Drawn from the Linear / Stripe docs aesthetic: muted, high-readability,
// no candy-bright accents. Ink is the body color; tokens lift only the
// semantically meaningful identifiers.
const TOKEN_COLOR: Record<TokenKind, string> = {
  kw:    '#6B7280', // soft slate — keywords
  type:  '#7B9BB5', // faint blue — types
  str:   '#9DB89A', // pale green — strings
  fn:    '#B8A07A', // muted sand — fn / JSX components
  com:   '#C4C4C4', // whisper grey — comments
  num:   '#A89BB5', // faded violet — numbers
  punct: '#A0A0A0', // soft grey — punctuation
  attr:  '#B8A07A', // muted sand — attrs
  tag:   '#7B9BB5', // faint blue — tags
  plain: '#444444', // ink — identifiers
};

const CodeBlock: React.FC<{
  filename: string;
  language?: string;
  lines: Line[];
  caption?: string;
}> = ({ filename, language = 'tsx', lines, caption }) => (
  <div
    className="rounded-[10px] overflow-hidden bg-white"
    style={{
      fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
    }}
  >
    <div
      className="flex items-center justify-between px-4 py-2.5 bg-white"
      style={{ boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.03)' }}
    >
      <span className="text-[11px] text-[#888888] tracking-[0.01em]">{filename}</span>
      <span className="text-[10px] uppercase tracking-[0.22em] text-[#BBBBBB]">{language}</span>
    </div>
    <pre className="px-4 py-5 m-0 text-[12.5px] leading-[1.75] overflow-x-auto bg-white">
      <code style={{ fontFamily: 'inherit' }}>
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            <span className="inline-block w-7 select-none text-right pr-3 text-[#DDDDDD]">{i + 1}</span>
            {line.map((tok, j) => (
              <span key={j} style={{ color: TOKEN_COLOR[tok.k] }}>{tok.t}</span>
            ))}
          </div>
        ))}
      </code>
    </pre>
    {caption && (
      <div
        className="px-4 py-3 bg-white text-[12px] text-[#888888] leading-[1.6]"
        style={{ boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)' }}
      >
        {caption}
      </div>
    )}
  </div>
);

// Quick helpers to make token lines a bit less noisy to author.
const k  = (t: string): Token => ({ k: 'kw', t });
const ty = (t: string): Token => ({ k: 'type', t });
const s  = (t: string): Token => ({ k: 'str', t });
const f  = (t: string): Token => ({ k: 'fn', t });
const c  = (t: string): Token => ({ k: 'com', t });
const n  = (t: string): Token => ({ k: 'num', t });
const p  = (t: string): Token => ({ k: 'punct', t });
const a  = (t: string): Token => ({ k: 'attr', t });
const tg = (t: string): Token => ({ k: 'tag', t });
const x  = (t: string): Token => ({ k: 'plain', t });

// ──────────────────────────────────────────────────────────────────────────────
//  Workbench — 2-col layout: LIVE on one side, CODE on the other.
//  Mono kicker labels above each pane. Stacks at small width.
// ──────────────────────────────────────────────────────────────────────────────

// Ultra-smooth easing curve — applied to anything that animates inside
// Workbench panels or live demos. Tuned for "expensive feel" (Linear/Vercel).
const EASE_OUT_EXPO = 'cubic-bezier(0.22, 1, 0.36, 1)';

const Workbench: React.FC<{
  live: React.ReactNode;
  code: React.ReactNode;
  liveKicker?: string;
  codeKicker?: string;
  caption?: string;
  /** when true, swap left/right so code can sit on the left for variety */
  reverse?: boolean;
}> = ({ live, code, liveKicker = 'Live', codeKicker = 'Code', caption, reverse = false }) => (
  <div>
    <div className={`grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 ${reverse ? 'lg:[&>div:first-child]:order-2' : ''}`}>
      {/* LIVE pane */}
      <div
        className="rounded-[10px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.04)] hover:scale-[1.005]"
        style={{
          background: '#FAFAFA',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
          transitionTimingFunction: EASE_OUT_EXPO,
        }}
      >
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.03)' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#22C55F] opacity-70" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22C55F]">{liveKicker}</span>
          </div>
          <span className="font-mono text-[10px] text-[#BBBBBB]">react-native-web</span>
        </div>
        <div className="flex-1 p-7 flex items-center justify-center">
          {live}
        </div>
      </div>

      {/* CODE pane */}
      <div className="flex flex-col">
        <div className="px-1 mb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#888888]">{codeKicker}</span>
          <span className="font-mono text-[10px] text-[#BBBBBB]">production</span>
        </div>
        <div className="flex-1">{code}</div>
      </div>
    </div>
    {caption && (
      <p className="font-sans text-[13px] text-[#666666] leading-[1.6] mt-4 max-w-[64ch]">{caption}</p>
    )}
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
//  DiscoveryLoop — auto-cycles through the four onboarding cases + transition
//  inside a PhoneFrame. Scrub bar underneath; pauses when off-screen.
// ──────────────────────────────────────────────────────────────────────────────

const DISCOVERY_FRAMES: { label: string; render: () => React.ReactNode }[] = [
  { label: 'Case 1 · Freelancer',     render: () => <Case1Screen /> },
  { label: 'Case 2 · Side income',    render: () => <Case2Screen /> },
  { label: 'Case 3 · Small business', render: () => <Case3Screen /> },
  { label: 'Case 4 · Activation',     render: () => <Case4Screen /> },
  { label: 'Transition',              render: () => <TransitionScreen /> },
];

const FRAME_MS = 3500;

const DiscoveryLoop: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % DISCOVERY_FRAMES.length);
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, [visible]);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-4">
      <PhoneFrame key={idx}>
        {DISCOVERY_FRAMES[idx].render()}
      </PhoneFrame>
      <div className="w-full max-w-[260px] flex flex-col gap-2">
        <div className="flex gap-1">
          {DISCOVERY_FRAMES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Jump to ${DISCOVERY_FRAMES[i].label}`}
              onClick={() => setIdx(i)}
              className="flex-1 h-[3px] bg-[#E5E2DA] hover:bg-[#CFCAB9] transition-colors relative overflow-hidden"
            >
              <span
                className="absolute inset-y-0 left-0 bg-[#111111] transition-all"
                style={{
                  width: i < idx ? '100%' : i === idx ? '100%' : '0%',
                  transitionDuration: i === idx ? `${FRAME_MS}ms` : '300ms',
                  transitionTimingFunction: 'linear',
                }}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999]">
            {DISCOVERY_FRAMES[idx].label}
          </span>
          <span className="font-mono text-[10px] text-[#CCCCCC]">
            {String(idx + 1).padStart(2, '0')} / {String(DISCOVERY_FRAMES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
//  CompilerDiagram — three inputs → claude → output home screen.
//  Kept from the previous build, lightly trimmed.
// ──────────────────────────────────────────────────────────────────────────────

const CompilerDiagram: React.FC<{ onZoom: (src: string) => void }> = ({ onZoom }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setStarted(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const itemStyle = (i: number): React.CSSProperties => ({
    opacity: started ? 1 : 0,
    transform: started ? 'translateX(0)' : 'translateX(-6px)',
    transition: `opacity 400ms ease-out ${i * 110}ms, transform 400ms ease-out ${i * 110}ms`,
  });

  const InputCard: React.FC<{
    i: number; n: string; label: string; hint: string;
    img?: string; custom?: React.ReactNode;
  }> = ({ i, n, label, hint, img, custom }) => (
    <div style={itemStyle(i)} className="flex items-start gap-5">
      {img ? (
        <button
          type="button"
          onClick={() => onZoom(img)}
          aria-label={`Enlarge ${label}`}
          className="block w-[200px] shrink-0 border border-black/[0.04] bg-white overflow-hidden cursor-zoom-in group"
        >
          <img src={img} alt="" aria-hidden="true" className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]" />
        </button>
      ) : (
        <div className="w-[200px] shrink-0 border border-black/[0.04] bg-white py-6 flex items-center justify-center gap-3">
          {custom}
        </div>
      )}
      <div className="pt-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#999999] mb-1">{n} · Input</p>
        <h4 className="font-sans text-[15px] font-semibold text-[#222222] leading-tight mb-1">{label}</h4>
        <p className="font-sans text-[13px] text-[#666666] leading-[1.55]">{hint}</p>
      </div>
    </div>
  );

  return (
    <div ref={rootRef}>
      <style>{`
        @keyframes tpCaretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes tpScanReveal { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0 0 0 0); } }
        @media (prefers-reduced-motion: reduce) {
          .tp-caret { animation: none !important; opacity: 1 !important; }
          .tp-scan-img { animation: none !important; clip-path: inset(0 0 0 0) !important; }
          .tp-stroke { stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(120px,180px)_minmax(0,1fr)] items-center gap-8 lg:gap-6">
        <div className="flex flex-col gap-7">
          <InputCard i={0} n="01" label="Wireframe"     hint="Founder sketch — flow + screen intent, not pixels."
            img="/taxpilot/01-wireframe.png" />
          <InputCard i={1} n="02" label="Variant"       hint="Visual grammar — typography, rhythm, components."
            img="/taxpilot/02-variant.png" />
          <InputCard i={2} n="03" label="Brand palette" hint="Ink · Newsprint · Emerald. Every accent earned its place."
            custom={
              <>
                {[
                  { hex: '#0D0D0D', name: 'Ink' },
                  { hex: '#E3DFD5', name: 'Newsprint' },
                  { hex: '#22C55F', name: 'Emerald' },
                ].map((c) => (
                  <span key={c.hex} title={`${c.name} ${c.hex}`} className="inline-block w-9 h-9 rounded-full" style={{ background: c.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }} />
                ))}
              </>
            }
          />
        </div>

        <div className="relative w-full self-stretch flex items-center justify-center min-h-[260px]">
          <svg viewBox="0 0 180 260" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
            {[44, 130, 216].map((y, i) => (
              <line key={y} x1="0" y1={y} x2="50" y2={y} stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3 3"
                className="tp-stroke"
                style={{
                  strokeDasharray: '70',
                  strokeDashoffset: started ? 0 : 70,
                  transition: `stroke-dashoffset 500ms ease-out ${260 + i * 110}ms`,
                }}
              />
            ))}
            <line x1="50" y1="44" x2="50" y2="216" stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3 3"
              className="tp-stroke"
              style={{
                strokeDasharray: '200',
                strokeDashoffset: started ? 0 : 200,
                transition: `stroke-dashoffset 500ms ease-out ${260 + 3 * 110}ms`,
              }}
            />
            <line x1="50" y1="130" x2="78" y2="130" stroke="#111111" strokeWidth="1"
              className="tp-stroke"
              style={{
                strokeDasharray: '40',
                strokeDashoffset: started ? 0 : 40,
                transition: `stroke-dashoffset 350ms ease-out ${260 + 3 * 110 + 200}ms`,
              }}
            />
            <line x1="118" y1="130" x2="180" y2="130" stroke="#111111" strokeWidth="1"
              className="tp-stroke"
              style={{
                strokeDasharray: '70',
                strokeDashoffset: started ? 0 : 70,
                transition: `stroke-dashoffset 450ms ease-out ${260 + 3 * 110 + 600}ms`,
              }}
            />
            <path d="M 174 126 L 180 130 L 174 134" fill="none" stroke="#111111" strokeWidth="1"
              style={{ opacity: started ? 1 : 0, transition: `opacity 200ms ease-out ${260 + 3 * 110 + 1000}ms` }}
            />
          </svg>
          <div
            className="relative z-10 bg-white border border-[#111111] px-2.5 py-1.5"
            style={{
              opacity: started ? 1 : 0,
              transform: `scale(${started ? 1 : 0.9})`,
              transition: 'opacity 280ms ease-out 850ms, transform 280ms cubic-bezier(0.2,0.7,0.2,1) 850ms',
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#222222] leading-none whitespace-nowrap">
              claude
              <span aria-hidden="true" className="tp-caret inline-block align-[-1px] ml-[2px] w-[1.5px] h-[10px] bg-[#22C55F]"
                style={{ animation: 'tpCaretBlink 1.05s steps(1) infinite', animationDelay: '1200ms', opacity: started ? undefined : 0 }}
              />
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onZoom('/taxpilot/03-app.png')}
          className="relative block w-full cursor-zoom-in group"
          aria-label="Enlarge home screen output"
          style={{
            opacity: started ? 1 : 0,
            transform: started ? 'translateX(0)' : 'translateX(8px)',
            transition: 'opacity 400ms ease-out 1100ms, transform 400ms ease-out 1100ms',
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#888888] mb-2">
            Output · Home screen
          </p>
          <div className="relative w-full overflow-hidden border border-black/[0.04] bg-white" style={{ aspectRatio: '9 / 18' }}>
            <img
              src="/taxpilot/03-app.png"
              alt="First TaxPilot home screen, composed by Claude from variant JSX, wireframe, and brand palette."
              className="tp-scan-img absolute inset-0 w-full h-full block transition-transform duration-300 group-hover:scale-[1.005]"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 100%',
                clipPath: started ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                animation: started ? 'tpScanReveal 900ms cubic-bezier(0.2,0.6,0.2,1) 1300ms forwards' : 'none',
              }}
            />
          </div>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#999999]">
            First turn — production RN
          </p>
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
//  Motion micro-interaction grid — 2×2 + spanning row of live components.
// ──────────────────────────────────────────────────────────────────────────────

const MicroCell: React.FC<{
  label: string;
  source?: string;
  minH?: number;
  spanCols?: 1 | 2;
  children: React.ReactNode;
}> = ({ label, source, minH = 240, spanCols = 1, children }) => (
  <div
    className={`relative bg-white rounded-[10px] flex flex-col overflow-hidden transition-all duration-500 hover:scale-[1.005] hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.04)] ${spanCols === 2 ? 'md:col-span-2' : ''}`}
    style={{ minHeight: minH, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
  >
    <div className="flex-1 flex items-center justify-center px-8 py-10" style={{ background: '#FAFAFA' }}>
      {children}
    </div>
    <div className="px-7 flex items-center justify-between bg-white" style={{ height: 48, boxShadow: 'inset 0 1px 0 rgba(0,0,0,0.03)' }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#888888] whitespace-nowrap">{label}</p>
      {source && <p className="font-mono text-[10px] text-[#BBBBBB] truncate ml-4">{source}</p>}
    </div>
  </div>
);

const MotionMicroStrip: React.FC = () => {
  const [t1, setT1] = useState(true);
  const [t2, setT2] = useState(false);
  const [year, setYear] = useState<number>(2026);
  const [selected, setSelected] = useState<string>('side');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MicroCell label="Toggle" source="components/taxpilot/Toggle.tsx">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 36 }}>
          <Toggle value={t1} onValueChange={setT1} />
          <Toggle value={t2} onValueChange={setT2} />
        </View>
      </MicroCell>

      <MicroCell label="Segmented control" source="components/taxpilot/SegmentedControl.tsx">
        <View style={{ backgroundColor: '#E3DFD5', padding: 6, borderRadius: 999, alignSelf: 'center' }}>
          <SegmentedControl
            options={[
              { label: '2026', value: 2026 },
              { label: '2025', value: 2025 },
              { label: '2024', value: 2024 },
            ]}
            value={year}
            onChange={setYear}
          />
        </View>
      </MicroCell>

      <MicroCell label="Selection card" source="components/taxpilot/SelectionCard.tsx">
        <View style={{ width: '100%', maxWidth: 320, gap: 8 }}>
          {[
            { value: 'freelancer',     label: 'Freelancer',     description: '1099 income.' },
            { value: 'small-business', label: 'Small business', description: 'LLC or S-corp.' },
            { value: 'side',           label: 'Side income',    description: 'Day job + gigs.' },
          ].map((opt) => (
            <SelectionCard
              key={opt.value}
              label={opt.label}
              description={opt.description}
              selected={selected === opt.value}
              onPress={() => setSelected(opt.value)}
            />
          ))}
        </View>
      </MicroCell>

      <MicroCell label="Spinning loader" source="components/taxpilot/SpinningLoader.tsx">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <SpinningLoader />
          <span style={{ fontSize: 15, color: '#111', fontFamily: 'system-ui, sans-serif' }}>Loading transactions…</span>
        </View>
      </MicroCell>

      <MicroCell label="Transaction row" source="components/taxpilot/TransactionRow.tsx" spanCols={2}>
        <View style={{ width: '100%', maxWidth: 520 }}>
          <TransactionRow
            item={{ id: '1', merchant_name: 'Stripe payout', amount: 4280.00, date: 'Mar 14', status: 'confirmed', is_income: true } as any}
            onPress={() => {}}
          />
          <TransactionRow
            item={{ id: '2', merchant_name: 'Adobe Creative Cloud', amount: 54.99, date: 'Mar 13', status: 'confirmed', is_income: false, suggested_branches: [{ category: 'Software' }] } as any}
            onPress={() => {}}
          />
          <TransactionRow
            item={{ id: '3', merchant_name: 'Uber', amount: 18.42, date: 'Mar 12', status: 'pending', is_income: false, suggested_branches: [{ category: 'Travel' }] } as any}
            onPress={() => {}}
          />
        </View>
      </MicroCell>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
//  Section nav
// ──────────────────────────────────────────────────────────────────────────────

// Three sample accounts for the CardStack demo in §Motion B.2.
// Same shape the production profile screen feeds in; one needs reauth so both
// action-row branches in CardStack render across taps.
const CARD_STACK_DEMO_ACCOUNTS: AccountItem[] = [
  { account_id: '1', name: 'Personal Checking', mask: '8821', subtype: 'checking', network: 'visa',       institutionName: 'Chase', primaryColor: '#1B6CFA', status: 'active' },
  { account_id: '2', name: 'Sapphire Reserve',  mask: '4402', subtype: 'credit',   network: 'visa',       institutionName: 'Chase', primaryColor: '#1B345E', status: 'active' },
  { account_id: '3', name: 'Business Checking', mask: '9021', subtype: 'checking', network: 'mastercard', institutionName: 'Chase', primaryColor: '#1F4D2E', status: 'reauth_required' },
];

const navItems = [
  { id: 'hero',         label: 'Overview' },
  { id: 'product',      label: 'The Product' },
  { id: 'workflow',     label: 'Workflow' },
  { id: 'ia',           label: 'Information Architecture' },
  { id: 'motion',       label: 'Motion & Performance' },
  { id: 'system',       label: 'Design System' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'next',         label: 'Takeaways' },
];

// ──────────────────────────────────────────────────────────────────────────────
//  Code snippets — realistic excerpts paraphrased from the actual repo.
// ──────────────────────────────────────────────────────────────────────────────

const CODE_TABULAR: Line[] = [
  [c('// components/taxpilot/typography.ts')],
  [],
  [k('export'), x(' '), k('const'), x(' typography '), p('='), x(' '), p('{')],
  [x('  '), x('metric'), p(':'), x(' '), p('{')],
  [x('    '), x('fontFamily'), p(':'), x(' '), s("'JetBrains Mono'"), p(',')],
  [x('    '), x('fontSize'), p(':'), x(' '), n('28'), p(',')],
  [x('    '), x('fontWeight'), p(':'), x(' '), s("'600'"), p(' '), k('as'), x(' '), ty("const"), p(',')],
  [x('    '), c('// the actual reason this file exists:')],
  [x('    '), x('fontVariant'), p(':'), x(' '), p('['), s("'tabular-nums'"), p('] '), k('as'), x(' '), ty('any'), p(',')],
  [x('  '), p('},')],
  [x('  '), c('// …')],
  [p('}')],
];

const CODE_STATE_MACHINE: Line[] = [
  [c('// One boolean would have been a lie. Two states are honest:')],
  [c('// loading = we are fetching · analyzing = we have data, we are thinking.')],
  [],
  [k('type'), x(' '), ty('Status'), x(' '), p('='), x(' '), s("'idle'"), x(' '), p('|'), x(' '), s("'loading'"), x(' '), p('|'), x(' '), s("'analyzing'"), x(' '), p('|'), x(' '), s("'ready'"), p(';')],
  [],
  [k('const'), x(' '), p('['), x('status'), p(','), x(' setStatus'), p(']'), x(' '), p('='), x(' '), f('useState'), p('<'), ty('Status'), p('>('), s("'idle'"), p(');')],
  [],
  [k('useEffect'), p('('), p('('), p(')'), x(' '), p('=>'), x(' '), p('{')],
  [x('  '), f('setStatus'), p('('), s("'loading'"), p(');')],
  [x('  '), f('fetchTx'), p('()'), p('.'), f('then'), p('('), p('('), x('tx'), p(')'), x(' '), p('=>'), x(' '), p('{')],
  [x('    '), f('setStatus'), p('('), s("'analyzing'"), p(');')],
  [x('    '), k('return'), x(' '), f('categorize'), p('('), x('tx'), p(');')],
  [x('  '), p('})'), p('.'), f('then'), p('('), p('('), p(')'), x(' '), p('=>'), x(' '), f('setStatus'), p('('), s("'ready'"), p(')); ')],
  [p('}, []);')],
];

const CODE_THEME: Line[] = [
  [c('// components/taxpilot/theme.ts — the entire color contract.')],
  [],
  [k('export'), x(' '), k('const'), x(' theme '), p('='), x(' '), p('{')],
  [x('  '), x('colors'), p(':'), x(' '), p('{')],
  [x('    '), x('ink'), p(':'), x('       '), s("'#0D0D0D'"), p(','), x('  '), c('// text + dark surfaces')],
  [x('    '), x('newsprint'), p(':'), x(' '), s("'#E3DFD5'"), p(','), x('  '), c('// the app background')],
  [x('    '), x('green'), p(':'), x('     '), s("'#22C55F'"), p(','), x('  '), c('// the only green allowed')],
  [x('    '), x('amber'), p(':'), x('     '), s("'#C2410C'"), p(','), x('  '), c('// caution / pending decision')],
  [x('    '), x('red'), p(':'), x('       '), s("'#DC2626'"), p(','), x('  '), c('// owed / destructive')],
  [x('  '), p('},')],
  [x('  '), c('// spacing, radius, typography follow…')],
  [p('}'), x(' '), k('as'), x(' '), ty('const'), p(';')],
];

// ──────────────────────────────────────────────────────────────────────────────
//  Page
// ──────────────────────────────────────────────────────────────────────────────

const TaxPilotCaseStudyPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [systemExpanded, setSystemExpanded] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox]);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, top / max)) * 100 : 0);

      let current = 'hero';
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = item.id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="taxpilot-case min-h-screen pb-24 selection:bg-[#E8E8E8] selection:text-black overflow-x-hidden bg-[#FFFFFF] text-[#222222] font-sans" style={{ fontFamily: '"Inter", "Space Grotesk", ui-sans-serif, system-ui, sans-serif' }}>
      {/* Scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px] pointer-events-none">
        <div className="h-full bg-[#111111] transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} aria-hidden="true" />
      </div>
      <Header />

      {/* Sticky left nav */}
      <aside className="hidden xl:flex flex-col fixed left-6 2xl:left-10 top-1/2 -translate-y-1/2 z-50 w-[180px]">
        <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#888888] mb-4">Contents</p>
        <nav>
          <ul className="space-y-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className="group flex items-center gap-2.5 w-full text-left py-[6px]"
                  >
                    <span className="shrink-0 h-px transition-all duration-200"
                      style={{ width: isActive ? '16px' : '8px', background: isActive ? '#111111' : '#D0D0D0' }} />
                    <span className="font-sans text-[12px] tracking-[0.06em] leading-tight transition-colors duration-200"
                      style={{ color: isActive ? '#111111' : '#767676' }}>
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 xl:pl-[240px] 2xl:pl-[220px] mt-10">
        <main>
          {/* ── HERO ────────────────────────────────────────────────────── */}
          <section id="hero" className="scroll-mt-28 pt-10 pb-20 md:pb-24">
            <Reveal>
              <div className="mb-10 flex items-center gap-6">
                <div className="h-px flex-1 bg-[#111111]" />
                <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#888888]">Case Study 02 — AI-Native · Mobile · 2026</p>
                <div className="h-px w-8 bg-[#E8E8E8]" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-start">
                <div>
                  <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#999999]">TaxPilot</p>
                  <h1 className="font-sans text-[72px] md:text-[96px] font-semibold tracking-[-0.045em] leading-[0.92] text-[#222222]">TaxPilot</h1>
                  <p className="mt-6 font-sans text-[22px] md:text-[24px] leading-[1.4] text-[#333333] max-w-[34ch] font-medium tracking-[-0.01em]">
                    A mobile tax app for U.S. freelancers and small business owners — track expenses, estimate quarterly taxes, file with confidence.
                  </p>
                  <p className="mt-5 font-sans text-[16px] leading-[1.65] text-[#444444] max-w-[56ch]">
                    Founding designer + sole engineer. From wireframe to production in 4 weeks.
                    Zero Figma files. Every pixel, system, and animation was crafted directly in code
                    using an AI-native workflow.
                  </p>

                  <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-[56ch] border-t border-[#E8E8E8] pt-6">
                    {[
                      ['Role',     'Founding Designer + Design Engineer'],
                      ['Team',     'Me + 1 founder'],
                      ['Stack',    'React Native · Expo · TypeScript · Zustand · React Query'],
                      ['Workflow', '100% AI-native — VSCode + Claude API. No Figma.'],
                    ].map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[64px_1fr] items-baseline gap-3">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#999999]">{label}</dt>
                        <dd className="font-sans text-[13px] text-[#222222] leading-[1.55]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="justify-self-center lg:justify-self-end">
                  <DiscoveryLoop />
                </div>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── 2 — THE PRODUCT ─────────────────────────────────────────── */}
          <section id="product" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="The Product" title="Tax software shouldn't just exist in April." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                TaxPilot connects to bank accounts, automatically categorizes income and expenses,
                surfaces deductions in real time, and generates the numbers needed at filing time.
                By the time users usually open TurboTax, their data is cold. TaxPilot makes tax a
                daily, ambient surface — for solo founders, 1099 freelancers, and side-income earners.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <ol className="mt-12 list-none pl-0 border-t border-[#E8E8E8]">
                {[
                  { n: '01', t: 'Connect',    d: 'Bank connection via Plaid → auto-pulled transactions.' },
                  { n: '02', t: 'Categorize', d: 'On-device categorization → income vs expense vs deductible.' },
                  { n: '03', t: 'See',        d: 'Calendar + report views → your tax position any day of the year.' },
                  { n: '04', t: 'Export',     d: 'Year-end → numbers ready for filing.' },
                ].map((f) => (
                  <li key={f.n}
                    className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_minmax(0,200px)_1fr] gap-4 md:gap-8 items-baseline py-6 border-b border-black/[0.05]"
                  >
                    <span className="font-mono text-[11px] text-[#CCCCCC] tracking-[0.06em]">{f.n}</span>
                    <h3 className="font-sans text-[18px] font-semibold text-[#222222]">{f.t}</h3>
                    <p className="font-sans text-[14px] text-[#666666] leading-[1.65] col-span-2 md:col-span-1">{f.d}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={120} className="mt-12">
              <div className="border-t border-black/[0.08] pt-4 mb-8 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#222222]">
                  Live mount
                </p>
                <p className="font-mono text-[10px] text-[#999999]">
                  components/taxpilot/InteractiveHomeDemo.tsx
                </p>
              </div>
              <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[62ch] mb-8">
                The actual production app, mounted via <code className="font-mono text-[13px] bg-black/[0.04] px-1 rounded-sm">react-native-web</code>.
                Tap the tab bar to move between Home, Calendar, Report, and Profile — every screen
                is the same RN code shipping to the App Store.
              </p>
              <div className="flex justify-center">
                <PhoneFrame>
                  <InteractiveHomeDemo />
                </PhoneFrame>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── 3 — WORKFLOW ────────────────────────────────────────────── */}
          <section id="workflow" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Workflow" title="Skipping Figma. Code as the source of truth." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[66ch]">
                Most designers hand off Figma. Most engineers hand off Jira tickets. I did neither.
                The entire app — branding, design system, motion, and UI — was built without a single
                manual design tool. By using AI as a compiler between intent and production code, I
                collapsed the design-engineering loop from weeks to hours.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-16">
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { n: '01', t: 'Founder wireframes as raw input',
                    d: 'Low-fidelity napkin sketches describing user flow. No pixel-perfect mocks, just pure intent.' },
                  { n: '02', t: 'Prompting the UI in production code',
                    d: 'Drove Claude directly from VSCode to generate React Native component code from visual intent. I didn\'t design a button in Figma — I prompted a button in React Native and adjusted props.' },
                  { n: '03', t: 'A system that emerged from code',
                    d: 'Most teams design tokens in Figma, then implement. I inverted this. The first generated components told me what tokens I actually needed. Branding, colors, and typography were hallucinated by AI, refined by my taste, locked into theme.ts.' },
                ].map((step) => (
                  <li key={step.n} className="border-t border-black/[0.08] pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#888888] mb-3">{step.n} · Step</p>
                    <h3 className="font-sans text-[17px] font-semibold text-[#222222] leading-snug mb-2">{step.t}</h3>
                    <p className="font-sans text-[14px] text-[#666] leading-[1.65]">{step.d}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={120} className="mt-16">
              <div className="border-t border-black/[0.08] pt-4 mb-8 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#222222]">The compiler</p>
                <p className="font-mono text-[10px] text-[#999999]">three inputs · one turn · production code</p>
              </div>
              <p className="font-sans text-[16px] leading-[1.75] text-[#444444] max-w-[60ch] mb-12">
                Once the variant returned a screen with the right grammar, I pasted it into Claude
                alongside the wireframe and the three colors that had earned their place. One prompt,
                one turn — Claude composed the first home screen.
              </p>
              <CompilerDiagram onZoom={setLightbox} />
            </Reveal>
          </section>

          <Rule />

          {/* ── 4A — INFORMATION ARCHITECTURE ───────────────────────────── */}
          <section id="ia" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Information Architecture" title="Data density without losing legibility." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                A tax app is a dashboard in disguise. The challenge is plotting money against time on
                a 390pt-wide screen without thinning out the data. Two decisions did most of the work.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-14">
              <h3 className="font-sans text-[20px] font-semibold text-[#222222] mb-2">A.1 — Tabular figures</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[62ch] mb-8">
                Numbers get their own font. Tabular figures in JetBrains Mono mean amounts align
                vertically — this is an accuracy guarantee, not an aesthetic preference. Misalignment
                is a bug.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#888888] mb-2">Tabular · JetBrains Mono</p>
                  <TabularFiguresDemo tabular={true} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999] mb-2">Proportional · Plus Jakarta Sans</p>
                  <TabularFiguresDemo tabular={false} />
                </div>
              </div>
              <p className="font-sans text-[13px] text-[#666666] leading-[1.6] mt-4 max-w-[64ch]">
                One CSS hint — <code className="font-mono text-[12px] bg-black/[0.04] px-1 rounded-sm">fontVariant: ['tabular-nums']</code> — is the entire substance of the decision.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-20">
              <h3 className="font-sans text-[20px] font-semibold text-[#222222] mb-2">A.2 — The Calendar</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[62ch] mb-8">
                A month of transactions on one screen, plotted against time. The point isn't to summarize —
                it's to surface the rows that still need a human decision, and let the user resolve them
                without leaving the calendar.
              </p>
              <ul className="font-sans text-[15px] text-[#666] leading-[1.8] list-disc pl-5 space-y-2 mb-10 max-w-[62ch]">
                <li><strong className="text-[#222222]">Always visible:</strong> every transaction in the month, color-coded by status — green for auto-categorized deductibles, amber for ones the model couldn't confidently classify.</li>
                <li><strong className="text-[#222222]">On tap:</strong> amber rows open a Review sheet — pick personal vs. business and set the deductible percentage. One tap, one decision, back to the calendar.</li>
                <li><strong className="text-[#222222]">Cut:</strong> category pie charts, weekly trend lines, year-over-year comparisons. The calendar resolves ambiguity; reports live elsewhere.</li>
              </ul>
              <div className="border border-black/[0.04] rounded-[8px] overflow-hidden bg-white">
                <div className="px-4 py-2.5 border-b border-black/[0.04] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#222222] flex items-center"><span className="inline-block w-[6px] h-[6px] rounded-full bg-[#C9A96E] mr-2" />Live</span>
                  <span className="font-mono text-[10px] text-[#999999]">components/taxpilot/screens/calendar.tsx</span>
                </div>
                <div className="p-8 flex items-center justify-center bg-[#FAFAFA]">
                  <PhoneFrame scale={0.6}>
                    <CalendarScreen />
                  </PhoneFrame>
                </div>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── 4B — MOTION & PERFORMANCE ───────────────────────────────── */}
          <section id="motion" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Motion & Performance" title="Perceived speed through state granularity." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                Motion here is not decoration. It's a state-management tool used to absorb latency.
                I restricted myself entirely to React Native's built-in <code className="font-mono text-[14px] bg-black/[0.04] px-1 rounded-sm">Animated</code> API
                for production reliability and bundle size.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-14">
              <h3 className="font-sans text-[20px] font-semibold text-[#222222] mb-2">B.1 — Loading vs Analyzing</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[62ch] mb-8">
                Most apps treat fetch + compute as a single "loading" state. I split it:
                <strong className="text-[#222222]"> loading</strong> (we're fetching) vs
                <strong className="text-[#222222]"> analyzing</strong> (we have data, we're computing).
                Different motion, different copy. In any read-heavy product, perceived speed is shaped
                more by loading-state design than by actual query time.
              </p>
              {/* Stacked Workbench — live demos on top, code beneath */}
              <div className="space-y-4">
                <div className="border border-black/[0.04] rounded-[8px] overflow-hidden bg-white">
                  <div className="px-4 py-2.5 border-b border-black/[0.04] flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#222222] flex items-center"><span className="inline-block w-[6px] h-[6px] rounded-full bg-[#C9A96E] mr-2" />Live</span>
                    <span className="font-mono text-[10px] text-[#999999]">react-native-web</span>
                  </div>
                  <div className="p-8 flex flex-row flex-wrap gap-10 justify-center items-start bg-[#FAFAFA]">
                    <DemoStage kicker="Loading" source="screens/loading.tsx" autoLoopMs={4000} scale={0.55}>
                      <LoadingScreen />
                    </DemoStage>
                    <DemoStage kicker="Analyzing" source="screens/analyzing.tsx" autoLoopMs={5000} scale={0.55}>
                      <AnalyzingScreen />
                    </DemoStage>
                  </div>
                </div>
                <div>
                  <div className="px-1 mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#222222] flex items-center"><span className="inline-block w-[6px] h-[6px] rounded-full bg-[#C9A96E] mr-2" />Code</span>
                    <span className="font-mono text-[10px] text-[#999999]">production</span>
                  </div>
                  <CodeBlock
                    filename="src/state/status.ts"
                    lines={CODE_STATE_MACHINE}
                    caption="One boolean would have been a lie. Four states are honest — and each gets its own copy and motion."
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={80} className="mt-20">
              <h3 className="font-sans text-[20px] font-semibold text-[#222222] mb-2">B.2 — Card stack, Wallet-style</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[62ch] mb-8">
                Connected accounts live in an Apple-Wallet-style stack. Tap a card and the others
                slide out of the way to make room for actions on the selected one — pure
                <code className="font-mono text-[13px] bg-black/[0.04] px-1 rounded-sm"> Animated.spring </code>
                physics, no third-party libraries.
              </p>
              <div className="border border-black/[0.04] rounded-[8px] overflow-hidden bg-white">
                <div className="px-4 py-2.5 border-b border-black/[0.04] flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#222222] flex items-center"><span className="inline-block w-[6px] h-[6px] rounded-full bg-[#C9A96E] mr-2" />Live</span>
                  <span className="font-mono text-[10px] text-[#999999]">components/taxpilot/CardStack.tsx</span>
                </div>
                <div className="px-8 pt-10 pb-12 flex justify-center" style={{ background: '#E3DFD5' }}>
                  <View style={{ width: 340 }}>
                    <CardStack accounts={CARD_STACK_DEMO_ACCOUNTS} />
                  </View>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80} className="mt-20">
              <h3 className="font-sans text-[20px] font-semibold text-[#222222] mb-2">B.3 — Micro-interactions, live</h3>
              <p className="font-sans text-[15px] text-[#666] leading-[1.7] max-w-[62ch] mb-8">
                Every primitive below is the production RN component, imported from <code className="font-mono text-[13px] bg-black/[0.04] px-1 rounded-sm">components/taxpilot/</code> and
                rendered live. Press anything — the timing curves and state changes are the ones shipping in the app.
              </p>
              <MotionMicroStrip />
            </Reveal>
          </section>

          <Rule />

          {/* ── 4C — DESIGN SYSTEM ──────────────────────────────────────── */}
          <section id="system" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Design System" title="Systems built from the bottom up." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                Because there was no Figma, the design system is strictly the component API.
                Every token was load-bearing. No bloated color palettes — just what the product strictly demanded.
              </p>
              <p className="mt-4 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                The headline rule: <strong className="text-[#222222]">one green only</strong> — <code className="font-mono text-[13px] bg-black/[0.04] px-1 rounded-sm">#22C55F</code>. Financial UI cannot be ambiguous about polarity.
                I traded visual richness for absolute semantic clarity.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-14">
              <Workbench
                live={
                  <div className="flex flex-col gap-6 w-full max-w-[440px]">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { hex: '#0D0D0D', name: 'Ink',       role: 'Text · dark surfaces' },
                        { hex: '#E3DFD5', name: 'Newsprint', role: 'App background' },
                        { hex: '#22C55F', name: 'Emerald',   role: 'Positive · brand' },
                      ].map((c) => (
                        <div key={c.hex} className="flex flex-col">
                          <div
                            className="w-full"
                            style={{
                              aspectRatio: '1 / 1.15',
                              background: c.hex,
                              borderRadius: 6,
                              border: c.hex === '#E3DFD5' ? '1px solid #D8D3C5' : 'none',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                            }}
                          />
                          <p className="font-sans text-[13px] font-semibold text-[#222222] mt-3 leading-none">{c.name}</p>
                          <p className="font-mono text-[11px] text-[#999] mt-1.5 leading-none">{c.hex}</p>
                          <p className="font-sans text-[11px] text-[#999] mt-2 leading-snug">{c.role}</p>
                        </div>
                      ))}
                    </div>
                    <div className="font-sans text-[13px] text-[#666] leading-[1.7]">
                      Three colors. Anything else has to earn its place in <span className="font-mono text-[12px]">theme.ts</span>.
                    </div>
                  </div>
                }
                code={
                  <CodeBlock
                    filename="components/taxpilot/theme.ts"
                    lines={CODE_THEME}
                    caption="The entire color contract. Anything else has to earn its place in this file before it can ship."
                  />
                }
                caption="Three colors. The component API is the spec — props stay primitive, the call site never reaches into theme.ts."
              />
            </Reveal>

            <Reveal delay={80} className="mt-16">
              <div className="border-t border-black/[0.08] pt-4 mb-8 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#222222]">
                  The full system
                </p>
                <p className="font-mono text-[10px] text-[#999999] tracking-[0.14em]">
                  color · type · spacing · radius · components
                </p>
              </div>

              {/* Preview: Color is always visible. Everything below sits in a
                  Medium-style fade-clipped container revealed by the toggle. */}
              <div>
                <h4 className="font-sans text-[20px] font-semibold text-[#222222] mb-4">Color</h4>
                <ColorBlock />
              </div>

              <div className="relative mt-16">
                <div
                  style={{
                    maxHeight: systemExpanded ? 9999 : 320,
                    overflow: 'hidden',
                    transition: `max-height 700ms ${EASE_OUT_EXPO}`,
                  }}
                >
                  <div>
                    <h4 className="font-sans text-[20px] font-semibold text-[#222222] mb-4">Typography</h4>
                    <TypographyBlock />
                  </div>
                  <div className="mt-16">
                    <h4 className="font-sans text-[20px] font-semibold text-[#222222] mb-4">Spacing + radius</h4>
                    <SpacingBlock />
                  </div>
                  <div className="mt-16">
                    <h4 className="font-sans text-[20px] font-semibold text-[#222222] mb-4">Component library</h4>
                    <p className="font-sans text-[14px] text-[#666] leading-[1.7] max-w-[62ch] mb-6">
                      Live mounts of the production React Native components, rendered on the web via <code className="font-mono text-[13px] bg-black/[0.04] px-1 rounded-sm">react-native-web</code>.
                    </p>
                    <ComponentLibrary />
                  </div>
                </div>

                {/* Fade gradient — only visible when collapsed */}
                {!systemExpanded && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[180px]"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 55%, #FFFFFF 100%)',
                    }}
                  />
                )}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setSystemExpanded((v) => !v)}
                  className="group inline-flex items-center gap-2.5 border border-[#111111] px-5 py-2.5 bg-white"
                  style={{ transition: `background 400ms ${EASE_OUT_EXPO}, transform 400ms ${EASE_OUT_EXPO}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#111111'; (e.currentTarget.querySelector('span:first-child') as HTMLElement).style.color = '#FFFFFF'; (e.currentTarget.querySelector('span:last-child') as HTMLElement).style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#FFFFFF'; (e.currentTarget.querySelector('span:first-child') as HTMLElement).style.color = '#111111'; (e.currentTarget.querySelector('span:last-child') as HTMLElement).style.color = '#111111'; }}
                >
                  <span
                    className="font-mono text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: '#111', transition: `color 400ms ${EASE_OUT_EXPO}` }}
                  >
                    {systemExpanded ? 'Show less' : 'Show the rest of the system'}
                  </span>
                  <span
                    className="inline-block"
                    style={{
                      color: '#111',
                      transform: systemExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: `transform 400ms ${EASE_OUT_EXPO}, color 400ms ${EASE_OUT_EXPO}`,
                    }}
                  >
                    ↓
                  </span>
                </button>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── 5 — ARCHITECTURE ────────────────────────────────────────── */}
          <section id="architecture" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Architecture" title="Decisions worth defending." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                Three decisions where the engineering choice was also the UX choice.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DecisionCard
                  n="01"
                  title="Client vs server state"
                  constraint="Don't put server data in a global store — it lies."
                  decision="Zustand for pure client UI state. React Query for server state. Two systems to learn — and the entire class of stale-store sync bugs goes away."
                  chip="2 stores"
                  visual={
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-black/[0.04] rounded-[6px] px-3 py-3 bg-[#FAFAFA]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#888888]">Zustand</p>
                        <p className="font-sans text-[12px] text-[#666] leading-snug mt-1">Client UI · toggles, filters, transient view state.</p>
                      </div>
                      <div className="border border-black/[0.04] rounded-[6px] px-3 py-3 bg-[#FAFAFA]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#888888]">React Query</p>
                        <p className="font-sans text-[12px] text-[#666] leading-snug mt-1">Server truth · cache, invalidation, retry.</p>
                      </div>
                    </div>
                  }
                />
                <DecisionCard
                  n="02"
                  title="Logic-less components"
                  constraint="AI-generated components can get messy fast."
                  decision="Strict separation. UI components take primitive props only. All business logic lives in custom hooks. Reviews are faster; AI suggestions are easier to keep clean."
                  chip="pure UI"
                  visual={
                    <div className="flex items-center gap-3">
                      <div className="flex-1 border border-black/[0.04] rounded-[6px] px-3 py-3 bg-[#FAFAFA]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#999]">Hook</p>
                        <p className="font-sans text-[12px] text-[#222222] leading-snug mt-1">useTransactionReview()</p>
                        <p className="font-sans text-[11px] text-[#999] leading-snug mt-0.5">all the policy</p>
                      </div>
                      <span className="font-mono text-[14px] text-[#CCC]">→</span>
                      <div className="flex-1 border border-black/[0.04] rounded-[6px] px-3 py-3 bg-[#FAFAFA]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#999]">Component</p>
                        <p className="font-sans text-[12px] text-[#222222] leading-snug mt-1">&lt;ReviewSheet count=&#123;n&#125; /&gt;</p>
                        <p className="font-sans text-[11px] text-[#999] leading-snug mt-0.5">primitive props only</p>
                      </div>
                    </div>
                  }
                />
              </div>

              <div className="mt-6 border border-black/[0.04] rounded-[8px] bg-white p-6 lg:p-8">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-[11px] text-[#CCC] tracking-[0.06em]">03</span>
                  <h3 className="font-sans text-[19px] font-semibold text-[#222222]">Correcting the founder's flow</h3>
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-[#999]">defended</span>
                </div>
                <p className="font-sans text-[14px] text-[#666] leading-[1.7] max-w-[64ch] mb-3">
                  <strong className="text-[#222222]">Constraint:</strong> the original wireframe flow was conceptually pure but practically clunky — onboarding asked users to label their income type before connecting any bank, which left them guessing without context.
                </p>
                <p className="font-sans text-[14px] text-[#666] leading-[1.7] max-w-[64ch]">
                  <strong className="text-[#222222]">Decision:</strong> connect the bank first, then run discovery (the four onboarding cases in the hero) against the actual transactions. The user labels what they see, not what they remember. Defending UX over initial specs is part of the design engineer's job.
                </p>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── 6 — TAKEAWAYS ───────────────────────────────────────────── */}
          <section id="next" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Takeaways" title="Taste is the new bottleneck." />
            </Reveal>
            <Reveal delay={80} className="mt-10 space-y-8 max-w-[64ch]">
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444]">
                <strong className="text-[#222222]">AI relocates design judgment.</strong> I didn't push pixels; I curated outputs.
                AI generated the components, but I decided which to keep, which tokens to lock, and what to throw away.
                Human taste is still the bottleneck — AI just moves it earlier in the pipeline.
              </p>
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444]">
                <strong className="text-[#222222]">Constraints sharpen taste.</strong> Working alone without a visual design tool
                meant every "nice to have" got cut. The system has 3 colors not because 3 was the goal, but because no
                fourth color earned its place in the code.
              </p>
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444]">
                <strong className="text-[#222222]">Engineering is a design discipline.</strong> The biggest UX win in TaxPilot
                wasn't a layout — it was deciding to split a boolean loading state into a multi-step state machine.
              </p>
            </Reveal>
          </section>

          <Rule />

          {/* ── Footer line ─────────────────────────────────────────────── */}
          <section className="pb-16">
            <p className="font-mono text-[12px] text-[#999999] tracking-[0.04em] leading-[1.8]">
              Built with React Native + Expo. Rendered on the web with react-native-web.<br />
              Every component on this page is the production code.
            </p>
          </section>
        </main>
      </div>

      <ContactSection />
      <Footer />

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image preview"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 md:p-12 cursor-zoom-out"
        >
          <button
            type="button"
            aria-label="Close preview"
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl leading-none flex items-center justify-center transition-colors"
          >
            ×
          </button>
          <img
            src={lightbox}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain cursor-default"
          />
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
//  DecisionCard — used in §Architecture
// ──────────────────────────────────────────────────────────────────────────────

const DecisionCard: React.FC<{
  n: string;
  title: string;
  constraint: string;
  decision: string;
  chip: string;
  visual?: React.ReactNode;
}> = ({ n, title, constraint, decision, chip, visual }) => (
  <div
    className="rounded-[10px] bg-white p-6 lg:p-7 flex flex-col transition-all duration-500 hover:scale-[1.01] hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.04)]"
    style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
  >
    <div className="flex items-baseline gap-3 mb-3">
      <span className="font-mono text-[10px] text-[#BBBBBB] tracking-[0.06em]">{n}</span>
      <h3 className="font-sans text-[18px] font-semibold tracking-[-0.015em] text-[#222222] leading-snug">{title}</h3>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[#888888] whitespace-nowrap">{chip}</span>
    </div>
    <p className="font-sans text-[14px] text-[#666666] leading-[1.7] mb-2">
      <strong className="text-[#333333] font-semibold">Constraint:</strong> {constraint}
    </p>
    <p className="font-sans text-[14px] text-[#666666] leading-[1.7] mb-4">
      <strong className="text-[#333333] font-semibold">Decision:</strong> {decision}
    </p>
    {visual && <div className="mt-auto pt-2">{visual}</div>}
  </div>
);

export default TaxPilotCaseStudyPage;
