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

// ── Section nav ──────────────────────────────────────────────────────────────
const navItems = [
  { id: 'hero',         label: 'Overview' },
  { id: 'product',      label: 'Product' },
  { id: 'problem',      label: 'Problem' },
  { id: 'process',      label: 'Process' },
  { id: 'ia',           label: 'Information Architecture' },
  { id: 'architecture', label: 'Decisions' },
  { id: 'motion',       label: 'Motion' },
  { id: 'visual',       label: 'Visual Design' },
  { id: 'next',         label: 'Next' },
];

// ── Page ─────────────────────────────────────────────────────────────────────
const TaxPilotCaseStudyPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

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
              <p className="mt-6 font-sans text-[20px] md:text-[22px] leading-[1.5] text-[#111111] max-w-[44ch]">
                A tax app I designed, built, and shipped — solo.
              </p>
              <p className="mt-4 font-sans text-[15px] leading-[1.7] text-[#666666] max-w-[52ch]">
                Founding designer + sole engineer. From wireframe to production in 4 weeks. Every pixel, every animation, every line of React Native is mine.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-2 font-sans text-[12px] tracking-[0.04em] text-[#666666]">
                <span>Founding Designer + Design Engineer</span>
                <span className="text-[#CCCCCC]">·</span>
                <span>1 (me) + 1 founder</span>
                <span className="text-[#CCCCCC]">·</span>
                <span>React Native · Expo · TypeScript · Zustand · React Query</span>
              </div>

              {/* Pull quote */}
              <blockquote className="mt-12 border-l-2 border-[#22C55F] pl-6 max-w-[60ch]">
                <p className="font-serif text-[24px] md:text-[28px] leading-[1.35] text-[#111111] italic">
                  "I didn't design a system and then build the app. I built the app, and the system fell out of it."
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={120} className="mt-12 md:mt-14">
              <DemoStage source="components/taxpilot/screens/case1.tsx" autoLoopMs={6000}>
                <Case1Screen />
              </DemoStage>
            </Reveal>
          </section>

          <Rule />

          {/* ── PRODUCT ───────────────────────────────────────────────── */}
          <section id="product" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Product" title="Tax as an ambient surface, not an annual panic." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                TaxPilot is a mobile tax app for{' '}
                <span className="bg-[#FFF8C5] px-1 rounded-sm">[PLACEHOLDER — target user, e.g. US 1099 workers / freelancers / small business owners]</span>.
                It connects to bank accounts, automatically categorizes income and expenses, surfaces deductions in real time, and generates the numbers needed at filing time — without the user opening a spreadsheet.
              </p>
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

          {/* ── PROCESS ───────────────────────────────────────────────── */}
          <section id="process" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Process" title="An AI-native loop from wireframe to production code." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                Most designers hand off Figma. Most engineers hand off Jira tickets. I did neither. I used AI as a compiler between intent and production code, which collapsed the design–engineering loop from weeks to hours.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <ol className="mt-10 list-none pl-0">
                {[
                  { t: 'Founder wireframes as input', b: 'Low-fidelity wireframes describing the user flow. Not pixel-perfect mocks — just intent: what screens exist, what each screen has to do.' },
                  { t: 'Variant → code, immediately', b: 'Used Variant to generate React Native component code directly from visual intent, skipping the entire Figma → handoff → re-implement loop.' },
                  { t: 'Design system emerged from code', b: 'Most teams design tokens in Figma, then implement. I inverted this. By end of week 1: 3 brand colors, 3 type families, 8pt spacing scale, 7-step radius scale, full Apple-HIG-aligned type ramp.' },
                  { t: 'Iterate by editing production code', b: 'New colors and weights added during real screen design — not in a vacuum. Every token added was load-bearing.' },
                  { t: 'Icon system + UI states locked last', b: 'Systematized icons (one family per use) and audited every component for full state coverage: default / pressed / disabled / loading / error / empty.' },
                ].map((s, i, arr) => (
                  <li
                    key={s.t}
                    className="grid grid-cols-1 lg:grid-cols-[34%_66%] gap-6 lg:gap-10 items-start py-10 border-t border-dashed border-[#E8E8E8]"
                  >
                    <div className="relative lg:pr-8">
                      <div
                        className={`absolute left-[7px] top-6 w-px border-l border-dashed border-[#CCCCCC] ${i === arr.length - 1 ? 'h-0' : 'h-[calc(100%+2.5rem)]'}`}
                      />
                      <div className="relative flex items-start gap-4">
                        <span
                          className="mt-[3px] inline-flex h-[15px] w-[15px] shrink-0 border border-[#CCCCCC] bg-white items-center justify-center"
                          style={{ transform: 'rotate(45deg)' }}
                        >
                          <span className="h-[5px] w-[5px] bg-[#22C55F]" style={{ transform: 'rotate(-45deg)' }} />
                        </span>
                        <div>
                          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#767676] mb-1">Step {i + 1}</p>
                          <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#111111]">
                            {s.t}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="lg:pl-2">
                      <p className="text-[17px] leading-[1.75] text-[#666666] max-w-[60ch]">{s.b}</p>
                    </div>
                  </li>
                ))}
              </ol>
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

          {/* ── MOTION (philosophy summary; demos live with their arguments above) ── */}
          <section id="motion" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Motion" title="Motion as a state-management tool." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#444444] max-w-[64ch]">
                Every animation in TaxPilot earns its place by clarifying state, guiding attention, or absorbing latency. Built on React Native's built-in Animated API — no Reanimated, no third-party libraries. Constraint forces craft.
              </p>
              <p className="mt-4 font-sans text-[15px] leading-[1.7] text-[#666666] max-w-[64ch]">
                The demos for this argument live where the argument is made — Discovery in the hero, Calendar and Loading→Analyzing in <a href="#ia" className="underline decoration-[#CCC] hover:decoration-[#111]">Information Architecture</a>. The one below is the last: form motion you only notice if you remove it.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-10 lg:gap-16 items-start">
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
          </section>

          <Rule />

          {/* ── VISUAL DESIGN — Live design system ────────────────────── */}
          <section id="visual" className="scroll-mt-28">
            <Reveal>
              <SectionHeading label="Visual Design" title="The design system, live." />
              <p className="mt-8 font-sans text-[17px] leading-[1.75] text-[#666666] max-w-[64ch]">
                Every swatch and component below is the actual production code, imported and rendered. Hover, click, drag — these are not images.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8a. Color</h3>
              <ColorBlock />
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8b. Typography</h3>
              <TypographyBlock />
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8c. Spacing + radius</h3>
              <SpacingBlock />
            </Reveal>

            <Reveal delay={80} className="mt-12">
              <h3 className="font-sans text-[22px] font-semibold text-[#111111] mb-4">8d. Component library</h3>
              <p className="font-sans text-[15px] text-[#666666] leading-[1.7] max-w-[64ch] mb-6">
                Live mounts of production React Native components, rendered on the web via <code className="font-mono text-[13px] bg-[#F0EDE8] px-1 rounded-sm">react-native-web</code>. Each section discloses the real source path.
              </p>
              <ComponentLibrary />
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
    </div>
  );
};

export default TaxPilotCaseStudyPage;
