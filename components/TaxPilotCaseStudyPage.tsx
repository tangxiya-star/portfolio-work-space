import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { MediaPlaceholder } from './CaseStudyPrimitives';
import {
  ColorBlock,
  TypographyBlock,
  SpacingBlock,
  ComponentLibrary,
  TabularFiguresDemo,
} from './taxpilot/LiveDesignSystem';
import PhoneFrame from './taxpilot/PhoneFrame';
import DemoStage from './taxpilot/DemoStage';
import Case1Screen from './taxpilot/screens/case1';
import LoadingScreen from './taxpilot/screens/loading';
import AnalyzingScreen from './taxpilot/screens/analyzing';
import CalendarScreen from './taxpilot/screens/calendar';
import AddExpenseDemo from './taxpilot/AddExpenseDemo';
import { View } from 'react-native';
import Toggle from './taxpilot/Toggle';
import SegmentedControl from './taxpilot/SegmentedControl';
import TransactionRow from './taxpilot/TransactionRow';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ── Local primitives (mirror Patiently's vocabulary) ─────────────────────────
const LayerLabel: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-2 font-sans text-[12px] uppercase tracking-[0.2em] text-[#767676]">{text}</p>
);

const SectionHeading: React.FC<{ label: string; title: string }> = ({ label, title }) => (
  <div className="group w-fit">
    <LayerLabel text={label} />
    <h2 className="font-sans text-[32px] md:text-[42px] font-semibold tracking-[-0.015em] leading-[1.05] text-[#111111]">{title}</h2>
    <div className="mt-4 relative h-1 flex items-center">
      <span className="h-px w-12 bg-[#111111] transition-all duration-200 ease-out group-hover:w-[72px]" />
      <span className="ml-2 h-1 w-1 bg-[#C9A96E] opacity-0 transition-all duration-200 ease-out group-hover:opacity-100" />
    </div>
  </div>
);

const Rule = () => <hr className="my-24 md:my-28 border-0 border-t border-[#E8E8E8]" />;

// Rauno-style demo card: hairline rule on top, tight mono caption, content below.
// No chrome, no shadows, no rounded card. The screen is the content.
const DemoCard: React.FC<{
  n: string;
  title: string;
  description: string;
  source: string;
  children: React.ReactNode;
}> = ({ n, title, description, source, children }) => (
  <div>
    <div className="border-t border-[#111111] pt-4 mb-8 flex items-baseline justify-between">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
        Demo {n}
      </p>
      <p className="font-mono text-[10px] text-[#999999] hover:text-[#111111] transition-colors">
        {source}
      </p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-start">
      <div className="max-w-[44ch]">
        <h3 className="font-sans text-[26px] md:text-[30px] font-semibold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-4">
          {title}
        </h3>
        <p className="font-sans text-[15px] text-[#444444] leading-[1.7]">
          {description}
        </p>
      </div>
      <div className="flex justify-start lg:justify-end">{children}</div>
    </div>
  </div>
);

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
        transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// ── Motion micro-interaction strip ──────────────────────────────────────────
// Surfaces the small, easy-to-miss motion proofs (Toggle on/off, Row press)
// at top-level so they don't get buried inside the collapsed Full system.
const MotionMicroStrip: React.FC = () => {
  const [t1, setT1] = useState(true);
  const [t2, setT2] = useState(false);
  const [year, setYear] = useState<number>(2026);
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-4">
      {/* Left col — two micro-interactions stacked */}
      <div className="grid grid-rows-2 gap-4">
        <div className="border border-[#E8E8E8] bg-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22C55F] mb-4">
            Toggle
          </p>
          <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <Toggle value={t1} onValueChange={setT1} />
            <Toggle value={t2} onValueChange={setT2} />
          </View>
        </div>
        <div className="border border-[#E8E8E8] bg-white p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22C55F] mb-4">
            Segmented control
          </p>
          <View style={{ height: 56, alignItems: 'center', justifyContent: 'center' }}>
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
          </View>
        </div>
      </div>

      {/* Right col — TransactionRow at phone-native width (390pt), centered */}
      <div className="border border-[#E8E8E8] bg-white p-5">
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22C55F]">
            Row · press feedback <span className="text-[#999] normal-case tracking-normal ml-2">↓ tap any row</span>
          </p>
          <p className="font-mono text-[10px] text-[#999999]">
            rendered at 390pt — native iPhone width
          </p>
        </div>
        <View style={{ width: 360, alignSelf: 'center', backgroundColor: '#E3DFD5', padding: 12, borderRadius: 8 }}>
          <TransactionRow
            item={{
              id: '1', merchant_name: 'Stripe payout', amount: 4280.00,
              date: 'Mar 14', status: 'confirmed', is_income: true,
            } as any}
            onPress={() => {}}
          />
          <TransactionRow
            item={{
              id: '2', merchant_name: 'Adobe Creative Cloud', amount: 54.99,
              date: 'Mar 13', status: 'confirmed', is_income: false,
              suggested_branches: [{ category: 'Software' }],
            } as any}
            onPress={() => {}}
          />
          <TransactionRow
            item={{
              id: '3', merchant_name: 'Uber', amount: 18.42,
              date: 'Mar 12', status: 'pending', is_income: false,
              suggested_branches: [{ category: 'Travel' }],
            } as any}
            onPress={() => {}}
          />
        </View>
        <p className="font-sans text-[12px] text-[#666666] leading-[1.55] mt-4">
          Subtle scale + background on press. Tabular figures keep the amount column aligned across rows. Three states — income, confirmed expense, pending review.
        </p>
        <p className="font-mono text-[10px] text-[#999999] mt-2">components/taxpilot/TransactionRow.tsx</p>
      </div>
    </div>
  );
};

// ── Compiler diagram — scroll-driven assembly ────────────────────────────────
// Three movements, all hairline:
//   A — scanline reveal on the output home screen
//   B — diamond markers fill in sequence as the section enters
//   C — blinking caret at the end of the prompt sentence
// Compact horizontal diagram: 3 real inputs (variant.png / wireframe.png / palette)
// connected via a bracket into a single `claude` node, then arrow to home screen.
// No card chrome — just mono labels, real images, hairlines.
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
    i: number;
    n: string;
    label: string;
    hint: string;
    img?: string;
    custom?: React.ReactNode;
  }> = ({ i, n, label, hint, img, custom }) => (
    <div style={itemStyle(i)} className="flex items-start gap-5">
      {img ? (
        <button
          type="button"
          onClick={() => onZoom(img)}
          aria-label={`Enlarge ${label}`}
          className="block w-[200px] shrink-0 border border-[#E8E8E8] bg-white overflow-hidden cursor-zoom-in group"
        >
          <img
            src={img}
            alt=""
            aria-hidden="true"
            className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>
      ) : (
        <div className="w-[200px] shrink-0 border border-[#E8E8E8] bg-white py-6 flex items-center justify-center gap-3">
          {custom}
        </div>
      )}
      <div className="pt-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#999999] mb-1">
          {n} · Input
        </p>
        <h4 className="font-sans text-[15px] font-semibold text-[#111111] leading-tight mb-1">
          {label}
        </h4>
        <p className="font-sans text-[13px] text-[#666666] leading-[1.55]">{hint}</p>
      </div>
    </div>
  );

  return (
    <div ref={rootRef}>
      <style>{`
        @keyframes tpCaretBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        /* Reveal animation crops edges in the final state to hide black borders on the source PNG */
        @keyframes tpScanReveal { from { clip-path: inset(7% 1.5% 100% 1.5%); } to { clip-path: inset(7% 1.5% 1.5% 1.5%); } }
        @media (prefers-reduced-motion: reduce) {
          .tp-caret { animation: none !important; opacity: 1 !important; }
          .tp-scan-img { animation: none !important; clip-path: inset(7% 1.5% 1.5% 1.5%) !important; }
          .tp-stroke { stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(120px,180px)_minmax(0,1fr)] items-center gap-8 lg:gap-6">
        {/* LEFT — three inputs, larger + clickable */}
        <div className="flex flex-col gap-7">
          <InputCard i={0} n="01" label="Variant"       hint="Visual grammar — typography, rhythm, components."
            img="/taxpilot/02-variant.png" />
          <InputCard i={1} n="02" label="Wireframe"     hint="Flow + screen intent. Not pixel-perfect — just shape."
            img="/taxpilot/01-wireframe.png" />
          <InputCard i={2} n="03" label="Brand palette" hint="Ink · Newsprint · Emerald. Every accent had to earn its place."
            custom={
              <>
                {[
                  { hex: '#0D0D0D', name: 'Ink' },
                  { hex: '#E3DFD5', name: 'Newsprint' },
                  { hex: '#22C55F', name: 'Emerald' },
                ].map((c) => (
                  <span
                    key={c.hex}
                    title={`${c.name} ${c.hex}`}
                    className="inline-block w-9 h-9 rounded-full"
                    style={{ background: c.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)' }}
                  />
                ))}
              </>
            }
          />
        </div>

        {/* CENTER — bracket + claude node + outbound line */}
        <div className="relative w-full self-stretch flex items-center justify-center min-h-[260px]">
          <svg
            viewBox="0 0 180 260"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {/* three bracket arms from left edge → trunk at x=50 */}
            {[44, 130, 216].map((y, i) => (
              <line
                key={y}
                x1="0" y1={y} x2="50" y2={y}
                stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3 3"
                className="tp-stroke"
                style={{
                  strokeDasharray: '70',
                  strokeDashoffset: started ? 0 : 70,
                  transition: `stroke-dashoffset 500ms ease-out ${260 + i * 110}ms`,
                }}
              />
            ))}
            {/* vertical trunk */}
            <line
              x1="50" y1="44" x2="50" y2="216"
              stroke="#CCCCCC" strokeWidth="1" strokeDasharray="3 3"
              className="tp-stroke"
              style={{
                strokeDasharray: '200',
                strokeDashoffset: started ? 0 : 200,
                transition: `stroke-dashoffset 500ms ease-out ${260 + 3 * 110}ms`,
              }}
            />
            {/* trunk → claude (left side) */}
            <line
              x1="50" y1="130" x2="78" y2="130"
              stroke="#111111" strokeWidth="1"
              className="tp-stroke"
              style={{
                strokeDasharray: '40',
                strokeDashoffset: started ? 0 : 40,
                transition: `stroke-dashoffset 350ms ease-out ${260 + 3 * 110 + 200}ms`,
              }}
            />
            {/* claude → output (right side, beyond the pill) */}
            <line
              x1="118" y1="130" x2="180" y2="130"
              stroke="#111111" strokeWidth="1"
              className="tp-stroke"
              style={{
                strokeDasharray: '70',
                strokeDashoffset: started ? 0 : 70,
                transition: `stroke-dashoffset 450ms ease-out ${260 + 3 * 110 + 600}ms`,
              }}
            />
            {/* arrow head at right edge */}
            <path
              d="M 174 126 L 180 130 L 174 134"
              fill="none" stroke="#111111" strokeWidth="1"
              style={{
                opacity: started ? 1 : 0,
                transition: `opacity 200ms ease-out ${260 + 3 * 110 + 1000}ms`,
              }}
            />
          </svg>
          {/* claude pill — centered horizontally in the center column, on the trunk row */}
          <div
            className="relative z-10 bg-white border border-[#111111] px-2.5 py-1.5"
            style={{
              opacity: started ? 1 : 0,
              transform: `scale(${started ? 1 : 0.9})`,
              transition: 'opacity 280ms ease-out 850ms, transform 280ms cubic-bezier(0.2,0.7,0.2,1) 850ms',
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#111111] leading-none whitespace-nowrap">
              claude
              <span
                aria-hidden="true"
                className="tp-caret inline-block align-[-1px] ml-[2px] w-[1.5px] h-[10px] bg-[#22C55F]"
                style={{
                  animation: 'tpCaretBlink 1.05s steps(1) infinite',
                  animationDelay: '1200ms',
                  opacity: started ? undefined : 0,
                }}
              />
            </p>
          </div>
        </div>

        {/* RIGHT — output home screen */}
        <button
          type="button"
          onClick={() => onZoom('/taxpilot/03-app.png')}
          className="relative block w-full max-w-[260px] justify-self-start cursor-zoom-in group"
          aria-label="Enlarge home screen output"
          style={{
            opacity: started ? 1 : 0,
            transform: started ? 'translateX(0)' : 'translateX(8px)',
            transition: 'opacity 400ms ease-out 1100ms, transform 400ms ease-out 1100ms',
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22C55F] mb-2">
            Output · Home screen
          </p>
          {/* Wrapper crops black edges of the source PNG via overflow + clipPath */}
          <div className="relative w-full overflow-hidden border border-[#E8E8E8] bg-white">
            <img
              src="/taxpilot/03-app.png"
              alt="First TaxPilot home screen, composed by Claude from Variant JSX, wireframe, and brand palette."
              className="tp-scan-img w-full h-auto block transition-transform duration-300 group-hover:scale-[1.005]"
              style={{
                clipPath: started ? 'inset(7% 1.5% 1.5% 1.5%)' : 'inset(7% 1.5% 100% 1.5%)',
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

// ── Section nav ──────────────────────────────────────────────────────────────
const navItems = [
  { id: 'hero',         label: 'Overview' },
  { id: 'product',      label: 'Product' },
  { id: 'problem',      label: 'Problem' },
  { id: 'build',        label: 'How it was built' },
  { id: 'ia',           label: 'Information Architecture' },
  { id: 'architecture', label: 'Decisions' },
  { id: 'system',       label: 'Full system' },
  { id: 'next',         label: 'Next' },
];

// ── Page ─────────────────────────────────────────────────────────────────────
const TaxPilotCaseStudyPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [lightbox, setLightbox] = useState<string | null>(null);

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
    <div className="taxpilot-case min-h-screen pb-24 selection:bg-[#E8E8E8] selection:text-black overflow-x-hidden bg-[#FAFAF8] text-[#111111]">
      {/* Scroll progress */}
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px] pointer-events-none">
        <div
          className="h-full bg-[#111111] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
      <Header />

      {/* Sticky left nav */}
      <aside className="hidden xl:flex flex-col fixed left-6 2xl:left-10 top-1/2 -translate-y-1/2 z-50 w-[180px]">
        <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#767676] mb-4">Contents</p>
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
                    <span
                      className="shrink-0 h-px transition-all duration-200"
                      style={{ width: isActive ? '16px' : '8px', background: isActive ? '#111111' : '#D0D0D0' }}
                    />
                    <span
                      className="font-sans text-[12px] tracking-[0.06em] leading-tight transition-colors duration-200"
                      style={{ color: isActive ? '#111111' : '#767676' }}
                    >
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
          {/* ── HERO ──────────────────────────────────────────────────── */}
          <section id="hero" className="scroll-mt-28 pt-10 pb-20 md:pb-24">
            <Reveal>
              <div className="mb-10 flex items-center gap-6">
                <div className="h-px flex-1 bg-[#111111]" />
                <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#767676]">Case Study 02 — Onchain-adjacent · Mobile · 2026</p>
                <div className="h-px w-8 bg-[#E8E8E8]" />
              </div>

              <div className="mb-6 h-10 w-1 bg-[#22C55F]" />
              <h1 className="font-serif text-[72px] md:text-[96px] leading-[0.90] text-[#111111]">TaxPilot</h1>
              <p className="mt-6 font-sans text-[17px] leading-[1.6] text-[#666666] max-w-[48ch]">
                Tax as an ambient surface, not an annual panic.
              </p>

              {/* Editorial byline dateline */}
              <div className="mt-8 flex flex-wrap items-center gap-2 font-sans text-[12px] tracking-[0.04em] text-[#666666]">
                <span>Founding Designer + Design Engineer</span>
                <span className="text-[#CCCCCC]">·</span>
                <span>Me + 1 founder</span>
                <span className="text-[#CCCCCC]">·</span>
                <span>Mobile Tax · React Native · 2026</span>
              </div>

              <p className="mt-10 font-sans text-[17px] leading-[1.7] text-[#444444] max-w-[58ch]">
                A mobile tax app for{' '}
                <span className="bg-[#FFF8C5] px-1 rounded-sm">[PLACEHOLDER — US 1099 workers / freelancers]</span>{' '}
                — auto-categorizes every bank transaction and shows your tax position any day of the year.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-12 md:mt-14">
              <div className="flex flex-col gap-4">
                {/* Hero stage — wide Patiently-style composition.
                    Soft single-tone gradient backdrop, phone mock centered. */}
                <div
                  className="relative w-full overflow-hidden rounded-[12px] flex items-center justify-center"
                  style={{ aspectRatio: '3 / 2' }}
                >
                  {/* Backdrop — metallic emerald (deeper saturation + chrome-like sheen bands).
                      Layered: conic sheen → radial highlight → emerald base. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background: '#0F5F3A',
                      backgroundImage: [
                        // top-left specular highlight
                        'radial-gradient(120% 80% at 22% 14%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 42%)',
                        // bottom-right cool fall-off
                        'radial-gradient(110% 90% at 86% 96%, rgba(4,40,24,0.65) 0%, rgba(4,40,24,0) 55%)',
                        // chrome-like sheen bands
                        'conic-gradient(from 210deg at 55% 50%, #1E8C58 0deg, #3CC080 70deg, #0A4A2E 150deg, #2BA670 230deg, #0F5F3A 320deg, #1E8C58 360deg)',
                      ].join(', '),
                    }}
                  />
                  {/* Subtle film-grain to break gradient banding */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.18]"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                    }}
                  />
                  {/* Phone mock — designed iPhone shape wrapping the video */}
                  <div
                    className="relative"
                    style={{
                      height: '92%',
                      aspectRatio: '630 / 1346',
                      padding: '10px',
                      background: '#0D0D0D',
                      borderRadius: 36,
                      boxShadow:
                        '0 24px 60px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.04) inset',
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{ borderRadius: 28, background: '#000' }}
                    >
                      <video
                        src="/taxpilot/taxpilot-hero.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label="TaxPilot product walkthrough — onboarding through connect-bank flow"
                        className="block w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#999999]">
                  Onboarding
                </p>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── PRODUCT ───────────────────────────────────────────────── */}
          <section id="product" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Product" title="Four steps, no spreadsheet." />
            </Reveal>

            {/* 4 flows — hairline rows, no cards */}
            <Reveal delay={80}>
              <ol className="mt-12 list-none pl-0 border-t border-[#E8E8E8]">
                {[
                  { n: '01', t: 'Connect',    d: 'Bank connection via Plaid → auto-pulled transactions.' },
                  { n: '02', t: 'Categorize', d: 'On-device categorization → income vs expense vs deductible.' },
                  { n: '03', t: 'See',        d: 'Calendar + report views → tax position any day of the year.' },
                  { n: '04', t: 'Export',     d: 'Year-end → numbers ready for filing.' },
                ].map((f) => (
                  <li
                    key={f.n}
                    className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_minmax(0,200px)_1fr] gap-4 md:gap-8 items-baseline py-6 border-b border-[#E8E8E8]"
                  >
                    <span className="font-mono text-[11px] text-[#CCCCCC] tracking-[0.06em]">{f.n}</span>
                    <h3 className="font-sans text-[18px] font-semibold text-[#111111]">{f.t}</h3>
                    <p className="font-sans text-[14px] text-[#666666] leading-[1.65] col-span-2 md:col-span-1">{f.d}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={120} className="mt-12">
              <MediaPlaceholder label="Live mount — TaxPilot home screen (app/(tabs)/index.tsx)" ratio="16:9" />
            </Reveal>
          </section>

          <Rule />

          {/* ── PROBLEM ───────────────────────────────────────────────── */}
          <section id="problem" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Market Problem" title="Tax software is built around April. Users live the other 11 months blind." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                Tax software today is built around April. The rest of the year, users have no idea where they stand. By the time they open TurboTax, the data is cold, the categorization is guesswork, and deductions are lost. TaxPilot makes tax a daily, ambient surface.
              </p>
            </Reveal>
          </section>

          <Rule />

          {/* ── HOW IT WAS BUILT — the AI-native compile loop ─────────── */}
          <section id="build" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="How it was built" title="An AI-native compile loop, not a handoff." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                Most designers hand off Figma. Most engineers hand off Jira tickets. I did neither. I used AI as a compiler between intent and production code — the design system, the screens, and the components all emerged from the same loop, in the same repo, in the same week.
              </p>
              <p className="mt-4 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                The system isn't a Figma file. It's <code className="font-mono text-[14px] bg-[#F0EDE8] px-1.5 py-0.5 rounded-sm">import &#123; Button &#125; from './Button'</code>. Every swatch, type ramp, and component lower on this page is the actual production code, imported and rendered live.
              </p>
            </Reveal>

            {/* Origin — variant flow + logo construction. The first concrete output of the loop. */}
            <Reveal delay={80} className="mt-16">
              <div className="border-t border-[#111111] pt-4 mb-8 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
                  Origin
                </p>
                <p className="font-mono text-[10px] text-[#999999]">
                  one prompt · five variants · one kept
                </p>
              </div>
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[60ch] mb-8">
                The brand wasn't picked from a swatch library. I prompted in plain English — <em>"change the arrow to green, more related to money, calmer"</em> — and locked the system around the first variant that came back. Every color and component token elsewhere on this page was then justified against this one image, not the other way around.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <figure>
                  <button
                    type="button"
                    onClick={() => setLightbox('/taxpilot/variant-flow.png')}
                    className="block w-full border border-[#E8E8E8] bg-white overflow-hidden cursor-zoom-in group"
                    aria-label="Enlarge variant flow screenshot"
                  >
                    <img
                      src="/taxpilot/variant-flow.png"
                      alt="AI design tool transcript: orange logo variant on the left, emerald-green final variant on the right, with the prompt that drove the change."
                      className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </button>
                  <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#999999]">
                    Variant 01 · kept — emerald #22C55E, locked from this turn forward
                  </figcaption>
                </figure>
                <figure>
                  <button
                    type="button"
                    onClick={() => setLightbox('/taxpilot/logo-construction.png')}
                    className="block w-full border border-[#E8E8E8] bg-white overflow-hidden cursor-zoom-in group"
                    aria-label="Enlarge logo construction sheet"
                  >
                    <img
                      src="/taxpilot/logo-construction.png"
                      alt="TaxPilot logo construction sheet: symbol geometry, primary typeface Anton, core palette pills."
                      className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </button>
                  <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#999999]">
                    Construction sheet — symbol geometry, primary typeface, core palette
                  </figcaption>
                </figure>
              </div>
            </Reveal>

            {/* The compiler — three inputs, one screen (absorbs the earlier triptych) */}
            <Reveal delay={80} className="mt-16">
              <div className="border-t border-[#111111] pt-4 mb-10 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
                  The compiler
                </p>
                <p className="font-mono text-[10px] text-[#999999]">
                  three inputs · one turn · production code
                </p>
              </div>

              <p className="font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[60ch] mb-16">
                Once Variant returned a screen with the right grammar, I copied the JSX into Claude alongside the wireframe and the three colors that had earned their place. One prompt, one turn — Claude composed it into the first home screen.
              </p>

              <CompilerDiagram onZoom={setLightbox} />
            </Reveal>

            <Reveal delay={80}>
              <div className="mt-20 border-t border-[#111111] pt-4 mb-10 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
                  Division of labor
                </p>
                <p className="font-mono text-[10px] text-[#999999]">
                  founder → me
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-stretch">
                {/* Inputs — what the founder provided */}
                <div className="border border-[#E8E8E8] bg-white p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#999999] mb-5">
                    Founder · inputs
                  </p>
                  <ul className="list-none pl-0 space-y-3 font-sans text-[15px] text-[#222222]">
                    {['Wireframes', 'Information architecture', 'Tech stack'].map((x) => (
                      <li key={x} className="flex items-center gap-3">
                        <span className="h-px w-4 bg-[#CCCCCC]" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center">
                  <span className="font-mono text-[22px] text-[#22C55F]">→</span>
                </div>

                {/* Outputs — what I delivered */}
                <div className="border border-[#111111] bg-white p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22C55F] mb-5">
                    Me · outputs
                  </p>
                  <ul className="list-none pl-0 space-y-3 font-sans text-[15px] text-[#111111]">
                    {[
                      'React Native screens',
                      'Design system (tokens, type, spacing)',
                      'Icon system + full state coverage',
                      'UX rework where flows broke',
                    ].map((x) => (
                      <li key={x} className="flex items-center gap-3">
                        <span className="h-px w-4 bg-[#22C55F]" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── INFORMATION ARCHITECTURE — Allium core hit ─────────────── */}
          <section id="ia" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Information Architecture" title="Data density without losing legibility." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                A tax app is a dashboard in disguise. Every screen is a dense table of money plotted against time. Three decisions made the data legible without thinning it out.
              </p>
            </Reveal>

            {/* 5a Tabular figures */}
            <Reveal delay={80} className="mt-16">
              <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-3">5a. Tabular figures — the smallest decision that mattered most</h3>
              <p className="font-sans text-[15px] text-[#666666] leading-[1.7] max-w-[64ch] mb-6">
                Numbers get their own font. Tabular figures in JetBrains Mono mean amounts align vertically across rows — table scanning becomes effortless. This is not aesthetic preference; it's an accuracy guarantee.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#22C55F] mb-2">Tabular figures · JetBrains Mono</p>
                  <TabularFiguresDemo tabular={true} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999] mb-2">Proportional · Plus Jakarta Sans</p>
                  <TabularFiguresDemo tabular={false} />
                </div>
              </div>
            </Reveal>

            {/* 5b Calendar */}
            <Reveal delay={80} className="mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-start">
                <div className="max-w-[44ch]">
                  <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-3">5b. Calendar — data × time, dense</h3>
                  <p className="font-sans text-[15px] text-[#666666] leading-[1.7] mb-4">
                    The page closest in spirit to a Bloomberg / Allium dashboard. Financial data plotted against time, at desktop-trading-tool density adapted to a 390pt-wide phone screen.
                  </p>
                  <ul className="font-sans text-[15px] text-[#666666] leading-[1.8] list-disc pl-5">
                    <li><span className="bg-[#FFF8C5] px-1 rounded-sm">[PLACEHOLDER — what was kept always visible]</span></li>
                    <li><span className="bg-[#FFF8C5] px-1 rounded-sm">[PLACEHOLDER — what reveals on tap]</span></li>
                    <li><span className="bg-[#FFF8C5] px-1 rounded-sm">[PLACEHOLDER — what was cut to keep readable]</span></li>
                  </ul>
                </div>
                <DemoStage source="components/taxpilot/screens/calendar.tsx">
                  <CalendarScreen />
                </DemoStage>
              </div>
            </Reveal>

            {/* 5c Loading vs Analyzing */}
            <Reveal delay={80} className="mt-16">
              <div className="max-w-[64ch] mb-10">
                <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-3">5c. Loading vs Analyzing — perceived performance in read-heavy products</h3>
                <p className="font-sans text-[15px] text-[#666666] leading-[1.7]">
                  Most apps treat fetch + compute as a single "loading" state. I split it: <strong>loading</strong> (we're fetching) vs <strong>analyzing</strong> (we have data, we're computing). Different motion, different copy. In any read-heavy product — TaxPilot, Bloomberg, Allium — perceived speed is shaped more by loading-state design than by actual query time.
                </p>
              </div>
              <div className="flex flex-row flex-wrap gap-10">
                <DemoStage kicker="Loading" source="components/taxpilot/screens/loading.tsx" autoLoopMs={8000}>
                  <LoadingScreen />
                </DemoStage>
                <DemoStage kicker="Analyzing" source="components/taxpilot/screens/analyzing.tsx" autoLoopMs={8000}>
                  <AnalyzingScreen />
                </DemoStage>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── ARCHITECTURE — Decisions ──────────────────────────────── */}
          <section id="architecture" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Architecture" title="Decisions worth defending." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                Two kinds of decisions shaped this app: visual / system decisions, and flow decisions. I owned both.
              </p>
            </Reveal>

            {/* 6a UI / system — hairline rows */}
            <Reveal delay={80} className="mt-16">
              <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#767676] mb-6">6a — System decisions</p>
              <div className="border-t border-[#111111]">
                {[
                  { t: 'Tabular figures for all numbers',           c: 'Users compare amounts down a column. Misalignment introduces ambiguity.', tr: 'Adds JetBrains Mono to the bundle. Pays for itself in scanning accuracy.' },
                  { t: 'One green only — #22C55F',                  c: 'Financial UI must not be ambiguous about polarity.', tr: 'Loses some visual richness. Gains semantic clarity.' },
                  { t: 'Split loading into loading + analyzing',    c: 'Perceived performance > actual performance.', tr: 'Two states to design instead of one.' },
                  { t: 'Zustand for client, React Query for server', c: "Don't put server data in a global store — it lies.", tr: 'Two state systems to learn. Worth it; the alternative is bugs.' },
                  { t: 'No business logic in components',           c: 'Components must be composable and testable.', tr: 'More files. Faster iteration, clearer reviews.' },
                  { t: 'No Reanimated, only Animated API',          c: 'Production reliability + bundle size on mobile.', tr: 'Harder to author complex motion. Forces simpler motion that ships reliably.' },
                ].map((d, i) => (
                  <div
                    key={d.t}
                    className="grid grid-cols-1 md:grid-cols-[40px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-8 py-6 border-b border-[#E8E8E8] items-baseline"
                  >
                    <span className="font-mono text-[11px] text-[#CCCCCC] tracking-[0.06em]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="font-sans text-[17px] font-semibold text-[#111111] leading-snug">
                      {d.t}
                    </h4>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] mb-1">Constraint</p>
                      <p className="font-sans text-[14px] text-[#444444] leading-[1.6]">{d.c}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] mb-1">Tradeoff</p>
                      <p className="font-sans text-[14px] text-[#666666] leading-[1.6]">{d.tr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* 6a.1 — Motion-as-state demo. The "no Reanimated" decision in flesh. */}
            <Reveal delay={80} className="mt-16">
              <div className="border-t border-[#111111] pt-4 mb-8 flex items-baseline justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
                  Motion, in evidence
                </p>
                <p className="font-mono text-[10px] text-[#999999]">
                  RN Animated API · no third-party libraries
                </p>
              </div>
              <p className="font-sans text-[17px] text-[#444444] leading-[1.7] max-w-[60ch] mb-10">
                Every animation earns its place by clarifying state or absorbing latency. Built on React Native's built-in Animated API — no Reanimated, no third-party libraries. Constraint forces craft. Try the live components below; they're the production source, not recordings.
              </p>

              {/* Micro-interaction strip — small live mounts, three at a time */}
              <MotionMicroStrip />

              {/* Add-expense — the longest, fullest motion proof */}
              <div className="mt-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-start">
                <div className="max-w-[44ch]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111] mb-3">Add-expense flow</p>
                  <p className="font-sans text-[15px] text-[#444444] leading-[1.7]">
                    Numeric keypad, category selection, fast keyboard interaction. The motion here is invisible unless you remove it — every micro-interaction exists to make the form feel responsive at native-app speed. This is the "power-user UX" demo: dense input, no wasted taps.
                  </p>
                </div>
                <DemoStage
                  source="components/taxpilot/screens/{index,addExpense}.tsx"
                  autoLoopMs={5000}
                >
                  <AddExpenseDemo />
                </DemoStage>
              </div>
            </Reveal>

            {/* 6b UX / flow — hairline rows */}
            <Reveal delay={80} className="mt-16">
              <p className="font-sans text-[12px] uppercase tracking-[0.2em] text-[#767676] mb-6">6b — Flow decisions</p>
              <p className="font-sans text-[15px] text-[#666666] leading-[1.7] max-w-[64ch] mb-8">
                My founder gave me a wireframe flow as the starting point. As I built the screens, I found places where the original flow didn't match how a user would actually move through the product. I changed them — and defended the changes.
              </p>
              <div className="border-t border-[#111111]">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 md:gap-8 py-6 border-b border-[#E8E8E8] items-baseline"
                  >
                    <span className="font-mono text-[11px] text-[#CCCCCC] tracking-[0.06em]">
                      {String(i).padStart(2, '0')}
                    </span>
                    {(['Original flow', 'What I changed', 'Why', 'Outcome'] as const).map((label) => (
                      <div key={label}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#999999] mb-1">{label}</p>
                        <p className="font-sans text-[14px] text-[#444444] leading-[1.6]">
                          <span className="bg-[#FFF8C5] px-1 rounded-sm">[PLACEHOLDER]</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── FULL SYSTEM — collapsed by default; the receipts ─────── */}
          <section id="system" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Full system" title="Receipts, on tap." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                The complete production design system — color, type, spacing, radius, every component — is mounted live below. Collapsed by default because the case study isn't about the system; it's about how it got built. Open it if you want the receipts.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-10">
              <details className="group border-t border-[#111111]">
                <summary className="cursor-pointer list-none flex items-baseline justify-between py-5 hover:bg-[#F5F2EC] transition-colors -mx-2 px-2">
                  <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#111111] flex items-center gap-3">
                    <span className="inline-block transition-transform duration-200 group-open:rotate-90">▸</span>
                    Explore the full system
                  </span>
                  <span className="font-mono text-[10px] text-[#999999] tracking-[0.14em]">
                    color · type · spacing · radius · components
                  </span>
                </summary>

                <div className="pt-4 pb-8 border-t border-[#E8E8E8]">
                  <div className="mt-8">
                    <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8a. Color</h3>
                    <ColorBlock />
                  </div>

                  <div className="mt-16">
                    <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8b. Typography</h3>
                    <TypographyBlock />
                  </div>

                  <div className="mt-16">
                    <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8c. Spacing + radius</h3>
                    <SpacingBlock />
                  </div>

                  <div className="mt-16">
                    <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8d. Component library</h3>
                    <p className="font-sans text-[15px] text-[#666666] leading-[1.7] max-w-[64ch] mb-6">
                      Live mounts of production React Native components, rendered on the web via <code className="font-mono text-[13px] bg-[#F0EDE8] px-1 rounded-sm">react-native-web</code>. Each section discloses the real source path.
                    </p>
                    <ComponentLibrary />
                  </div>
                </div>
              </details>
            </Reveal>
          </section>

          <Rule />

          {/* ── NEXT — What I learned ─────────────────────────────────── */}
          <section id="next" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Next" title="What shipping solo taught me." />
            </Reveal>
            <Reveal delay={80} className="mt-10 space-y-8 max-w-[64ch]">
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444]">
                <strong className="text-[#111111]">Constraints sharpen taste.</strong> Working alone with a fixed timeline, every "nice to have" gets cut. What survives is what mattered. The system has 3 colors not because 3 was the goal, but because no fourth color earned its place.
              </p>
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444]">
                <strong className="text-[#111111]">Motion is a state-management tool, not a finish.</strong> The biggest motion win in TaxPilot wasn't an animation — it was deciding to split loading into two states. The second-biggest was deciding which transitions did <em>not</em> need motion.
              </p>
              <p className="font-sans text-[17px] leading-[1.75] text-[#444444]">
                <strong className="text-[#111111]">AI doesn't replace design judgment, it relocates it.</strong> Variant generated the components. I decided which to keep, which tokens to lock, what to throw away. The taste is still the bottleneck. AI just moves it earlier in the pipeline.
              </p>
            </Reveal>
          </section>

          <Rule />

          {/* ── Footer line ───────────────────────────────────────────── */}
          <section className="pb-16">
            <p className="font-mono text-[12px] text-[#999999] tracking-[0.04em] leading-[1.7]">
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

export default TaxPilotCaseStudyPage;
