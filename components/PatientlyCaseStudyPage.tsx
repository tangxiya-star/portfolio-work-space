import React, { useEffect, useRef, useState } from 'react';
import { Mail, ClipboardList, Pill, Bandage, Stethoscope } from 'lucide-react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';
import { Badge, MediaPlaceholder, StatusChip } from './CaseStudyPrimitives';

const scrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const phases = [
  {
    title: 'Capture',
    quarter: 'Q1 2025',
    status: 'Shipped',
    text: 'We established recording, transcript, and summary reliability first, because guidance quality depends on capture fidelity.',
  },
  {
    title: 'Structure',
    quarter: 'Q1 2025',
    status: 'Shipped',
    text: 'Flat topic dumps caused overload; we shifted to categorized topics aligned to patient mental models.',
  },
  {
    title: 'Friction',
    quarter: 'Q2 2025',
    status: 'Shipped',
    text: 'We shipped a 3-tab model for discoverability, while framing a clear A/B path for embedded follow-up.',
  },
  {
    title: 'Context',
    quarter: 'Q2 2025',
    status: 'Proposed',
    text: 'Family-member switching exposed a system gap; we designed persistent context as a cross-feature state pattern.',
  },
  {
    title: 'Trust',
    quarter: 'Q3 2025',
    status: 'In Progress',
    text: 'We introduced article explainability and citations so users could evaluate and act on AI outputs with confidence.',
  },
];

// --- Decision A image components (before/after phone screenshots) ---
const DecisionABeforeImage: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const candidates = ['/decision-a-before.png', '/decision-a-before.jpg'];
  if (failed) return (
    <div className="w-full bg-[#F7F7F5] border border-[#E8E8E8] py-16 flex items-center justify-center">
      <p className="font-sans text-[12px] text-[#CCCCCC] uppercase tracking-[0.18em]">Before — screenshot</p>
    </div>
  );
  return (
    <img src={candidates[idx]} alt="Before — Flat Topic Extraction" className="w-full h-auto block rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/5"
      onError={() => { idx < candidates.length - 1 ? setIdx(v => v + 1) : setFailed(true); }} />
  );
};

const DecisionAAfterImage: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const candidates = ['/decision-a-after.png', '/decision-a-after.jpg'];
  if (failed) return (
    <div className="w-full bg-[#F7F7F5] border border-[#E8E8E8] py-16 flex items-center justify-center">
      <p className="font-sans text-[12px] text-[#CCCCCC] uppercase tracking-[0.18em]">After — screenshot</p>
    </div>
  );
  return (
    <img src={candidates[idx]} alt="After — Categorized Health Model" className="w-full h-auto block rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/5"
      onError={() => { idx < candidates.length - 1 ? setIdx(v => v + 1) : setFailed(true); }} />
  );
};

// --- Decision B image components (before/after article preview screenshots) ---
const DecisionBBeforeImage: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const candidates = ['/decision-b-before.png', '/decision-b-before.jpg'];
  if (failed) return (
    <div className="w-full bg-[#F7F7F5] border border-[#E8E8E8] py-16 flex items-center justify-center">
      <p className="font-sans text-[12px] text-[#CCCCCC] uppercase tracking-[0.18em]">Before — screenshot</p>
    </div>
  );
  return (
    <img src={candidates[idx]} alt="Before — Low Context Preview" className="w-full h-auto block rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/5"
      onError={() => { idx < candidates.length - 1 ? setIdx(v => v + 1) : setFailed(true); }} />
  );
};

const DecisionBAfterImage: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const candidates = ['/decision-b-after.png', '/decision-b-after.jpg'];
  if (failed) return (
    <div className="w-full bg-[#F7F7F5] border border-[#E8E8E8] py-16 flex items-center justify-center">
      <p className="font-sans text-[12px] text-[#CCCCCC] uppercase tracking-[0.18em]">After — screenshot</p>
    </div>
  );
  return (
    <img src={candidates[idx]} alt="After — Contextual Preview Model" className="w-full h-auto block rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/5"
      onError={() => { idx < candidates.length - 1 ? setIdx(v => v + 1) : setFailed(true); }} />
  );
};

const DECISION_NAV_ITEMS = [
  { id: 'decision-a', label: 'Decision A', subtitle: 'Topic categorization' },
  { id: 'decision-b', label: 'Decision B', subtitle: 'Preview density' },
] as const;

const DecisionNavigator: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    DECISION_NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.25, rootMargin: '-15% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="mb-10">
      <nav
        className="flex overflow-x-auto border border-[#CCCCCC] bg-white"
        aria-label="Decision deep-dive sections"
        style={{ scrollbarWidth: 'none' }}
      >
        {DECISION_NAV_ITEMS.map(({ id, label, subtitle }, i) => {
          const isActive = activeId === id;
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={[
                'group relative flex-1 min-w-[160px] text-left px-5 py-4 cursor-pointer',
                'transition-colors duration-150',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-inset',
                i < DECISION_NAV_ITEMS.length - 1 ? 'border-r border-[#E8E8E8]' : '',
                isActive ? 'bg-[#FFFDF5]' : 'hover:bg-[#F7F6F3]',
              ].join(' ')}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* bottom accent bar — active indicator */}
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-150"
                style={{ background: isActive ? '#C9A96E' : 'transparent' }}
              />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={`font-sans text-[12px] uppercase tracking-[0.18em] leading-none mb-[5px] font-semibold ${isActive ? 'text-[#111111]' : 'text-[#767676] group-hover:text-[#111111]'}`}>
                    {label}
                  </p>
                  <p className={`font-sans text-[12px] leading-snug ${isActive ? 'text-[#666666]' : 'text-[#767676] group-hover:text-[#666666]'}`}>
                    {subtitle}
                  </p>
                </div>
                <span className={`font-mono text-[12px] shrink-0 transition-transform duration-150 group-hover:translate-x-[3px] ${isActive ? 'text-[#C9A96E]' : 'text-[#767676] group-hover:text-[#666666]'}`}>→</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const coreFlows = [
  {
    id: 'record',
    index: '01',
    title: 'Record a conversation',
    desc: 'Patient and doctor talk. Patiently listens in the background — capturing every word without interrupting the visit.',
    bgBase: '#C8A882',
    orbs: [
      { color: '#D4956A', size: '70%', top: '-10%', left: '-15%', opacity: 0.85 },
      { color: '#A67C52', size: '55%', top: '40%',  left: '50%',  opacity: 0.7  },
      { color: '#8FA67C', size: '45%', top: '55%',  left: '-5%',  opacity: 0.5  },
      { color: '#E8C99A', size: '40%', top: '-5%',  left: '55%',  opacity: 0.6  },
    ],
    src: '/flow-record.mp4',
  },
  {
    id: 'summarize',
    index: '02',
    title: 'Get a visit summary',
    desc: 'Complex medical conversation turned into conditions, medications, procedures, and follow-up actions — structured and scannable.',
    bgBase: '#7BA8C4',
    orbs: [
      { color: '#4A8FB5', size: '65%', top: '-15%', left: '-10%', opacity: 0.8  },
      { color: '#A8C8E0', size: '50%', top: '45%',  left: '45%',  opacity: 0.65 },
      { color: '#5B7FA6', size: '45%', top: '50%',  left: '-8%',  opacity: 0.55 },
      { color: '#C5DFF0', size: '38%', top: '-8%',  left: '52%',  opacity: 0.5  },
    ],
    src: '/flow-summarize.mp4',
  },
  {
    id: 'followup',
    index: '03',
    title: 'Follow up',
    desc: 'Ask questions after the visit ends. Every answer is grounded in what the doctor actually said — not a generic search result.',
    bgBase: '#B5A882',
    orbs: [
      { color: '#C4A85A', size: '68%', top: '-12%', left: '-12%', opacity: 0.8  },
      { color: '#7CA67C', size: '52%', top: '42%',  left: '48%',  opacity: 0.65 },
      { color: '#A6946A', size: '44%', top: '52%',  left: '-6%',  opacity: 0.55 },
      { color: '#D4C89A', size: '36%', top: '-6%',  left: '54%',  opacity: 0.5  },
    ],
    src: '/flow-followup.mp4',
  },
  {
    id: 'foryou',
    index: '04',
    title: 'For You',
    desc: 'A health feed built from your visit history. Relevant articles surface based on your conditions, medications, and care context.',
    bgBase: '#A8A0C0',
    orbs: [
      { color: '#7A6FA6', size: '66%', top: '-14%', left: '-12%', opacity: 0.8  },
      { color: '#C4B8E0', size: '50%', top: '44%',  left: '46%',  opacity: 0.65 },
      { color: '#8C7AB5', size: '44%', top: '50%',  left: '-8%',  opacity: 0.55 },
      { color: '#E0D8F0', size: '38%', top: '-6%',  left: '52%',  opacity: 0.5  },
    ],
    src: '/flow-foryou.mp4',
  },
];

const decisions = [
  {
    title: '100+ topics, unsorted. I introduced categories.',
    problemShort: 'AI output returned a flat list of 100+ topics — no hierarchy, no orientation. Users had to impose structure themselves at the moment of highest cognitive load.',
    problem: `Early AI output generated a flat list — often exceeding 100 items with no hierarchy or orientation cues. Information existed, but meaning did not.\n\nUsers scan in mental buckets: Conditions, Medications, Procedures, Symptoms. Orientation precedes engagement. A flat list forced users to impose structure themselves at the moment of highest cognitive load.`,
    decision: '',
    subDecisions: [
      {
        label: 'A — Topic Categorization',
        headline: 'Flat list → grouped categories',
        body: 'Aligned to patient mental models. Categories introduced scan anchors — users could orient before reading. Not visual cleanup. A shift in how the system communicated relevance.',
      },
    ],
    whyMatters: `AI output surfaces information. Architecture makes it navigable.`,
    status: 'Shipped',
    visual: 'Decision Visual — Flat to Categorized Topics (16:9)',
  },
  {
    title: 'One tab in blind. I added a preview.',
    problemShort: 'Article cards showed a title and nothing else. Users had no way to judge relevance before tabbing — creating a loop of open, scan, back, repeat.',
    problem: 'Article cards showed only a title. Users had no signal of relevance, credibility, or topic fit before committing to a tab.',
    decision: '',
    subDecisions: [
      {
        label: 'B — Preview Density',
        headline: 'Expand summaries + show sources',
        body: 'Users needed enough context to judge relevance before tabbing. Reducing friction required more information per item, not less.',
      },
    ],
    whyMatters: 'Relevance judgment before tabbing reduces the open–scan–back loop.',
    status: 'Shipped',
    visual: 'Decision Visual — Preview Density (16:9)',
  },
  {
    title: "We shipped 3 tabs. I'd have shipped 2.",
    problemShort: 'A dedicated follow-up tab added visibility — but also a step. The debate was whether that extra tab was worth the clarity it bought.',
    problem: 'The core trade-off was clarity versus discoverability: fewer tabs simplify structure, while a dedicated follow-up tab increases action visibility.',
    decision: 'Ship three tabs in the current release and preserve an A/B path for an embedded follow-up model.',
    whyMatters: 'This reduced early-stage action friction while keeping structural simplification testable.',
    status: 'Shipped',
    visual: 'Decision Visual — 2 vs 3 Tab Comparison (16:9)',
  },
  {
    title: 'Users need to see why AI said what it said.',
    problemShort: 'Dense source material and uncited AI responses made healthcare guidance feel opaque at critical moments.',
    problem: 'Dense source material and uncited AI responses made healthcare guidance feel opaque at critical moments.',
    decision: 'Design article explainability layers and citation-aware AI responses.',
    whyMatters: 'Transparent reasoning builds user confidence where consequences are high.',
    status: 'In Progress',
    visual: 'Decision Visual — Explainability + Citations (16:9)',
  },
];

const PhaseRow: React.FC<{ title: string; quarter: string; status: string; text: string; isLast: boolean; index: number }> = ({ title, quarter, status, text, isLast, index }) => (
  <li className="grid grid-cols-1 lg:grid-cols-[34%_66%] gap-6 lg:gap-10 items-start py-10 border-t border-dashed border-[#E8E8E8]">
    <div className="relative lg:pr-8">
      <div className={`absolute left-[7px] top-6 w-px border-l border-dashed border-[#CCCCCC] ${isLast ? 'h-0' : 'h-[calc(100%+2.5rem)]'}`} />
      <div className="relative flex items-start gap-4">
        <span className="mt-[3px] inline-flex h-[15px] w-[15px] shrink-0 border border-[#CCCCCC] bg-white items-center justify-center" style={{ transform: 'rotate(45deg)' }}>
          <span className="h-[5px] w-[5px] bg-[#767676]" style={{ transform: 'rotate(-45deg)' }} />
        </span>
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#767676] mb-1">{quarter}</p>
          <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#111111]">
            Phase {index + 1} — {title}
          </h3>
        </div>
      </div>
    </div>
    <div className="lg:pl-2 flex justify-between items-start gap-4">
      <p className="text-[17px] leading-[1.75] text-[#666666] max-w-[60ch]">{text}</p>
      <div className="hidden lg:block shrink-0 pt-0.5">
        <StatusChip status={status} />
      </div>
    </div>
  </li>
);

const Rule = () => <hr className="my-24 md:my-28 border-0 border-t border-[#E8E8E8]" />;
const ImageCaption: React.FC<{ text: string }> = ({ text }) => (
  <p className="mt-3 text-[12px] tracking-[0.08em] uppercase text-[#767676]">{text}</p>
);
const LayerLabel: React.FC<{ text: string }> = ({ text }) => (
  <p className="mb-2 font-sans text-[12px] uppercase tracking-[0.2em] text-[#767676]">{text}</p>
);
const SectionHeading: React.FC<{ label: string; title: string }> = ({ label, title }) => (
  <div className="group w-fit">
    <LayerLabel text={label} />
    <h2 className="font-sans text-[32px] md:text-[42px] font-semibold tracking-[-0.015em] leading-[1.05] text-[#111111]">{title}</h2>
    <div className="mt-4 relative h-1 flex items-center">
      <span className="h-px w-12 bg-[#111111] transition-all duration-200 ease-out group-hover:w-[72px] group-focus-within:w-[72px]" />
      <span className="ml-2 h-1 w-1 bg-[#C9A96E] opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 group-focus-within:opacity-100 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5" />
    </div>
  </div>
);
const CognitiveGapsSystemDiagram: React.FC = () => (
  <div className="w-full max-w-[760px] mx-auto">
    <CognitiveGapsSystemImage />
  </div>
);

const CognitiveGapsSystemImage: React.FC = () => {
  const candidates = [
    '/cognitive-gaps-system-map-v1.png',
    '/cognitive-gaps-system-map-v1.jpg',
    '/cognitive-gaps-system-map.png',
    '/cognitive-gaps-system-map.jpg',
    '/cognitive-gaps-system-map.webp',
  ];
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const currentSrc = candidates[index];
  const hasNext = index < candidates.length - 1;

  return (
    <figure>
      <img
        src={currentSrc}
        alt="Cognitive Gaps System Map"
        className="h-auto w-full"
        onError={() => {
          if (hasNext) {
            setIndex((v) => v + 1);
            return;
          }
          setFailed(true);
        }}
      />
      <figcaption className="mt-3 text-[12px] uppercase tracking-[0.14em] text-[#767676]">Cognitive Gaps System Map</figcaption>
      {failed && (
        <p className="mt-2 text-[12px] text-[#767676]">
          Image not found. Put file in <code>public/</code> and name it <code>cognitive-gaps-system-map-v1.png</code>.
        </p>
      )}
    </figure>
  );
};
const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
};
const ParallaxWrap: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (reducedMotion) return;
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    setEnabled(finePointer && wide);
  }, [reducedMotion]);
  return (
    <div
      className={className}
      onMouseMove={(e) => {
        if (!enabled) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setXy({ x: px * 3.5, y: py * 3.5 });
      }}
      onMouseLeave={() => setXy({ x: 0, y: 0 })}
      style={{
        transform: enabled ? `translate3d(${xy.x}px, ${xy.y}px, 0)` : 'none',
        transition: 'transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
};
const ReasoningTraceSnippet: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [replayTick, setReplayTick] = useState(-1);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  useEffect(() => {
    if (reducedMotion || hasAutoPlayed) return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReplayTick((v) => v + 1);
          setHasAutoPlayed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, hasAutoPlayed]);
  const lines: Array<{ no: string; delay: number; content: React.ReactNode }> = [
    {
      no: '01',
      delay: 0,
      content: <><span className="trace-comment">// INPUT → ASSUMPTION → PREDICTED OUTCOME</span></>,
    },
    { no: '02', delay: 1, content: <>&nbsp;</> },
    {
      no: '03',
      delay: 2,
      content: (
        <>
          <span className="trace-keyword">const</span>
          <span className="trace-symbol"> </span>
          <span className="trace-variable">INPUT</span>
          <span className="trace-symbol"> = </span>
          <span className="trace-string">&quot;Medical conversations are dense and difficult to retain.&quot;</span>
        </>
      ),
    },
    { no: '04', delay: 3, content: <>&nbsp;</> },
    {
      no: '05',
      delay: 4,
      content: (
        <>
          <span className="trace-keyword">const</span>
          <span className="trace-symbol"> </span>
          <span className="trace-variable">ASSUMPTION</span>
          <span className="trace-symbol"> = </span>
          <span className="trace-string">&quot;Structured categorization improves comprehension.&quot;</span>
        </>
      ),
    },
    { no: '06', delay: 5, content: <>&nbsp;</> },
    {
      no: '07',
      delay: 6,
      content: (
        <>
          <span className="trace-keyword">const</span>
          <span className="trace-symbol"> </span>
          <span className="trace-variable">PREDICTED_OUTCOME</span>
          <span className="trace-symbol"> = [</span>
        </>
      ),
    },
    {
      no: '08',
      delay: 7,
      content: (
        <>
          <span className="trace-symbol">  </span>
          <span className="trace-string">
            &quot;Understanding <span className="trace-arrow" style={{ ['--pulse-delay' as string]: '940ms' }}>↑</span>&quot;,
          </span>
        </>
      ),
    },
    {
      no: '09',
      delay: 8,
      content: (
        <>
          <span className="trace-symbol">  </span>
          <span className="trace-string">
            &quot;Engagement <span className="trace-arrow" style={{ ['--pulse-delay' as string]: '1060ms' }}>↑</span>&quot;,
          </span>
        </>
      ),
    },
    { no: '10', delay: 9, content: <span className="trace-symbol">]</span> },
  ];

  return (
    <div ref={rootRef} className="w-full rounded-[18px] overflow-hidden border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.22)] bg-gradient-to-b from-[#0B1220] to-[#0F1A2B]">
      <style>{`
        .trace-line {
          opacity: 0;
          transform: translateY(8px);
          animation: traceLineIn 360ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: calc(var(--line-delay) * 120ms);
          position: relative;
        }
        .trace-line::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 4px;
          height: 28px;
          background: linear-gradient(90deg, rgba(255,200,61,0) 0%, rgba(255,200,61,0.10) 45%, rgba(255,200,61,0) 100%);
          transform: translateX(-105%);
          animation: traceScan 520ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: calc(var(--line-delay) * 120ms);
          pointer-events: none;
        }
        .trace-arrow {
          color: #C9A96E;
          animation: traceArrowPulse 220ms ease-out forwards;
          animation-delay: var(--pulse-delay, 0ms);
        }
        .trace-keyword { color: #FFB454; }
        .trace-variable { color: #8AD8FF; }
        .trace-comment { color: #6B7D94; }
        .trace-symbol { color: #9FB3C8; }
        .trace-string { color: #C9D6E2; }
        @keyframes traceLineIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes traceScan {
          to { transform: translateX(105%); }
        }
        @keyframes traceArrowPulse {
          0% { color: #C9A96E; }
          45% { color: #D4BC8A; }
          100% { color: #C9A96E; }
        }
        @media (prefers-reduced-motion: reduce) {
          .trace-line {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
          .trace-line::after, .trace-arrow {
            animation: none !important;
          }
        }
        .trace-static .trace-line {
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
        }
        .trace-static .trace-line::after, .trace-static .trace-arrow {
          animation: none !important;
        }
      `}</style>
      <div className="h-12 bg-[#111C2E] border-b border-white/10 px-4 flex items-center justify-between">
        <span className='font-mono text-[12px] text-[#9FB3C8] tracking-[0.01em]'>reasoning.trace.ts</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReplayTick((v) => v + 1)}
            className="h-7 px-3 rounded-full bg-white/5 text-[#9FB3C8] text-[12px] font-sans transition-colors hover:text-[#B9CCE0]"
          >
            Run
          </button>
          <button type="button" aria-label="Copy snippet" className="h-7 w-7 rounded border border-white/20 flex items-center justify-center group">
            <span className="relative block h-3 w-3">
              <span className="absolute inset-0 border border-[#7F96B3] rounded-[1px] group-hover:border-[#B9CCE0]" />
              <span className="absolute -right-1 -top-1 h-3 w-3 border border-[#7F96B3] rounded-[1px] bg-transparent group-hover:border-[#B9CCE0]" />
            </span>
          </button>
        </div>
      </div>
      <div className="px-6 py-[22px] pb-[26px] overflow-x-auto">
        <pre key={replayTick} className={`m-0 min-w-[760px] font-mono text-[16px] leading-[1.9] text-[#C9D6E2] ${replayTick < 0 ? 'trace-static' : ''}`}>
          {lines.map((line) => (
            <div key={`${line.no}-${line.delay}`} className="trace-line grid grid-cols-[44px_1fr] gap-3" style={{ ['--line-delay' as string]: String(line.delay) }}>
              <span className="text-white/30 select-none">{line.no}</span>
              <code>{line.content}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,10px,0)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '480ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

const CountUpMetric: React.FC<{ value: number; suffix?: string; durationMs?: number; className?: string }> = ({
  value,
  suffix = '',
  durationMs = 1300,
  className = '',
}) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(value * eased));
          if (t < 1) {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs, reducedMotion]);

  return <span ref={ref} className={className}>{display}{suffix}</span>;
};

const navItems = [
  { id: 'hero',      label: 'Overview'   },
  { id: 'flows',     label: 'Core Flows' },
  { id: 'summary',   label: 'Summary'    },
  { id: 'metrics',   label: 'Impact'     },
  { id: 'decisions', label: 'Decisions'  },
  { id: 'pivot',          label: 'Pivot'         },
  { id: 'visual-design',  label: 'Visual Design' },
  { id: 'closing',   label: 'Closing'    },
];

// ── Patiently Hero Frames — same 4-frame crossfade as the home page card ─────
const PATIENTLY_HERO_FRAMES = [
  '/patiently-frame-0.jpg',
  '/patiently-frame-1.jpg',
  '/patiently-frame-2.jpg',
  '/patiently-frame-3.jpg',
];

const PatientlyHeroFrames: React.FC = () => {
  const [activeFrame, setActiveFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) return;
    intervalRef.current = setInterval(() => {
      setActiveFrame(f => (f + 1) % 4);
    }, 2400);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [prefersReducedMotion]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.10)] transition-transform duration-500 ease-out hover:-translate-y-1"
      style={{ aspectRatio: '4/3', background: '#7B6B9E' }}
    >
      {PATIENTLY_HERO_FRAMES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Patiently — frame ${i + 1}`}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: activeFrame === i ? 1 : 0,
            transition: prefersReducedMotion ? 'none' : 'opacity 800ms ease-in-out',
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  );
};

const PatientlyCaseStudyPage: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
      setProgress(ratio * 100);

      // Determine active section
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

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="patiently-case min-h-screen pb-24 selection:bg-[#E8E8E8] selection:text-black overflow-x-hidden bg-[#FAFAF8] text-[#111111]">
      <style>{`
        .patiently-case {
          --bg: #FAFAF8;
          --text: #111111;
          --muted: #666666;
          --label: #767676;
          --rule: #E8E8E8;
          --accent: #C9A96E;
        }
        .ambient-blob {
          animation: ambientDrift 14s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate;
        }
        .ambient-blob.cool {
          animation-duration: 18s;
        }
        @keyframes ambientDrift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          100% { transform: translate3d(22px, -12px, 0) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ambient-blob { animation: none !important; }
        }
      `}</style>
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px] pointer-events-none">
        <div
          className="h-full bg-[#111111] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
      <Header />

      {/* ── Fixed sidenav — only on xl+ ─────────────────── */}
      <aside className="hidden xl:flex flex-col fixed left-6 2xl:left-10 top-1/2 -translate-y-1/2 z-50 w-[140px]">
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
                    className="group flex items-center gap-2.5 w-full text-left py-[6px] transition-colors"
                  >
                    <span
                      className="shrink-0 h-px transition-all duration-200"
                      style={{
                        width: isActive ? '16px' : '8px',
                        background: isActive ? '#111111' : '#D0D0D0',
                      }}
                    />
                    <span
                      className="font-sans text-[12px] tracking-[0.06em] transition-colors duration-200 leading-none"
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

      {/* ── Main content — left-padded on xl to clear fixed nav ── */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 xl:pl-[200px] 2xl:pl-[180px] mt-10">
        <main>
          <section id="hero" className="scroll-mt-28 pt-10 pb-20 md:pb-24 relative">
            <div className="pointer-events-none absolute -top-6 -left-10 h-52 w-52 rounded-full blur-3xl ambient-blob" style={{ background: 'radial-gradient(circle, rgba(255,200,61,0.10) 0%, rgba(255,200,61,0) 72%)' }} />
            <div className="pointer-events-none absolute top-20 right-0 h-56 w-56 rounded-full blur-3xl ambient-blob cool" style={{ background: 'radial-gradient(circle, rgba(111,168,255,0.10) 0%, rgba(111,168,255,0) 72%)' }} />
            <Reveal>
              <div>
                {/* Editorial top rule */}
                <div className="mb-10 flex items-center gap-6">
                  <div className="h-px flex-1 bg-[#111111]" />
                  <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#767676]">Case Study 01 — Health AI · 2025</p>
                  <div className="h-px w-8 bg-[#E8E8E8]" />
                </div>

                <div className="mb-6 h-10 w-1 bg-[#C9A96E]" />
                <h1 className="font-serif text-[72px] md:text-[96px] leading-[0.90] text-[#111111]">Patiently</h1>
                <p className="mt-6 font-sans text-[17px] leading-[1.6] text-[#666666] max-w-[48ch]">
                  Doctor conversations, turned into structured action.
                </p>

                {/* Editorial byline dateline */}
                <div className="mt-8 flex flex-wrap items-center gap-2 font-sans text-[12px] tracking-[0.04em] text-[#666666]">
                  <span>Founding Product Designer</span>
                  <span className="text-[#CCCCCC]">·</span>
                  <span>Founder + 2 Engineers</span>
                  <span className="text-[#CCCCCC]">·</span>
                  <span>Early-stage Health AI</span>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    onClick={() => scrollTo('decisions')}
                    className="bg-[#111111] text-white px-8 py-4 rounded-xl font-semibold hover:bg-black transition-all shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 font-sans uppercase tracking-[0.14em] text-xs"
                  >
                    Jump to Key Decisions
                  </button>
                  <a
                    href="https://apps.apple.com/us/app/patiently-medical-ai-notes/id6748413070"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#CCCCCC] text-[#444444] px-8 py-4 rounded-xl font-semibold hover:border-[#999999] hover:text-[#111111] transition-all font-sans uppercase tracking-[0.14em] text-xs"
                  >
                    View on App Store
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-12 md:mt-14">
              <PatientlyHeroFrames />
            </Reveal>
          </section>

          <Rule />

          {/* ── Core Flows ── */}
          <section id="flows" className="scroll-mt-28 py-10 md:py-12">
            <Reveal>
              <SectionHeading label="Product" title="Four flows. One visit." />
            </Reveal>

            <div className="mt-16 space-y-0">
              {coreFlows.map((flow, fi) => (
                <Reveal key={flow.id} delay={fi * 60}>
                  <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 py-8 ${fi < coreFlows.length - 1 ? 'border-b border-[#E8E8E8]' : ''}`}>
                    {/* Left — bokeh bg + phone frame */}
                    <div className="shrink-0 w-full md:w-[50%]">
                      <div
                        className="relative w-full overflow-hidden rounded-[12px] flex items-center justify-center"
                        style={{ aspectRatio: '1/1', backgroundColor: flow.bgBase }}
                      >
                        {/* Bokeh orbs */}
                        {flow.orbs.map((orb, oi) => (
                          <div
                            key={oi}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                              width: orb.size, height: orb.size,
                              top: orb.top, left: orb.left,
                              backgroundColor: orb.color,
                              opacity: orb.opacity,
                              filter: 'blur(48px)',
                            }}
                          />
                        ))}
                        {/* iPhone frame */}
                        <div className="relative z-10" style={{ width: '42%' }}>
                          <div
                            className="relative w-full overflow-hidden"
                            style={{
                              aspectRatio: '9/19.5',
                              borderRadius: '12.5% / 5.77%',
                              background: '#1A1A1A',
                              boxShadow: '0 0 0 1.5px #3A3A3A, 0 24px 48px rgba(0,0,0,0.45), 0 8px 16px rgba(0,0,0,0.3)',
                              padding: '1.5%',
                            }}
                          >
                            <div className="relative w-full h-full overflow-hidden bg-black" style={{ borderRadius: '11% / 5.1%' }}>
                              {flow.src ? (
                                <video src={flow.src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">{flow.index}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Side buttons */}
                          <div className="absolute right-[-3%] top-[22%] w-[2%] h-[8%] bg-[#2A2A2A] rounded-full" />
                          <div className="absolute left-[-3%] top-[18%] w-[2%] h-[5%] bg-[#2A2A2A] rounded-full" />
                          <div className="absolute left-[-3%] top-[26%] w-[2%] h-[7%] bg-[#2A2A2A] rounded-full" />
                          <div className="absolute left-[-3%] top-[36%] w-[2%] h-[7%] bg-[#2A2A2A] rounded-full" />
                        </div>
                      </div>
                    </div>
                    {/* Right — text */}
                    <div className="w-full md:w-[50%]">
                      <p className="font-mono text-[11px] tracking-[0.18em] text-[#CCCCCC] mb-4">{flow.index}</p>
                      <h3 className="font-sans text-[32px] font-semibold text-[#111111] leading-[1.1] tracking-[-0.02em]">{flow.title}</h3>
                      <p className="mt-4 font-sans text-[15px] leading-[1.7] text-[#666666] max-w-[32ch]">{flow.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <Rule />

          <section id="summary" className="scroll-mt-28 py-10 md:py-12">
            <Reveal>
              <SectionHeading label="Market Problem" title="The visit ends. The complexity begins." />
              {/* Pull-quote */}
              <p className="mt-8 font-serif italic text-[32px] md:text-[42px] leading-[1.2] text-[#111111] max-w-[20ch]">
                "This is not a memory issue. It is a knowledge architecture failure."
              </p>
              <p className="mt-6 max-w-[52ch] font-sans text-[15px] leading-[1.7] text-[#666666]">
                Patients leave appointments carrying dense clinical information — diagnoses, medications, next steps — with no system to hold it. Memory fades. Terminology confuses. Follow-up fragments.
              </p>
              <hr className="mt-12 border-0 border-t border-[#E8E8E8]" />
            </Reveal>

            {/* Cognitive gaps diagram */}
            <Reveal delay={40}>
              <div className="mt-10 overflow-hidden rounded-[12px]" style={{ background: '#111111' }}>
                <div className="px-6 py-4 border-b" style={{ borderColor: '#2A2A2A' }}>
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: '#767676' }}>Cognitive Gaps</p>
                </div>
                <div className="px-6 py-10">
                  {/* Central node + 4 spokes layout */}
                  <div className="flex flex-col items-center gap-8">

                    {/* Top row — 2 gaps */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-[640px]">
                      {[
                        { n: '01', label: 'Memory Decay', sub: 'Patients retain <50% of clinical info' },
                        { n: '02', label: 'Terminology Ambiguity', sub: 'A1C. eGFR. LDL-C. Opaque by default' },
                      ].map(({ n, label, sub }) => (
                        <div key={n} className="px-4 py-4" style={{ border: '1px solid #2A2A2A', background: '#1A1A1A' }}>
                          <p className="font-mono text-[11px] mb-2" style={{ color: '#C9A96E' }}>{n}</p>
                          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: '#FFFFFF' }}>{label}</p>
                          <p className="font-sans text-[11px]" style={{ color: '#767676' }}>{sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Converging lines → center node */}
                    <div className="flex flex-col items-center gap-0 w-full max-w-[640px] relative">
                      {/* Lines from top cards */}
                      <svg width="100%" height="40" viewBox="0 0 640 40" preserveAspectRatio="none" className="block">
                        <line x1="160" y1="0" x2="320" y2="40" stroke="#2A2A2A" strokeWidth="1"/>
                        <line x1="480" y1="0" x2="320" y2="40" stroke="#2A2A2A" strokeWidth="1"/>
                      </svg>

                      {/* Center node */}
                      <div className="px-8 py-3 z-10" style={{ border: '1px solid #C9A96E', background: '#1A1A1A' }}>
                        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#C9A96E' }}>Care Conversation</p>
                      </div>

                      {/* Lines to bottom cards */}
                      <svg width="100%" height="40" viewBox="0 0 640 40" preserveAspectRatio="none" className="block">
                        <line x1="320" y1="0" x2="160" y2="40" stroke="#2A2A2A" strokeWidth="1"/>
                        <line x1="320" y1="0" x2="480" y2="40" stroke="#2A2A2A" strokeWidth="1"/>
                      </svg>
                    </div>

                    {/* Bottom row — 2 gaps */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-[640px]">
                      {[
                        { n: '03', label: 'Search Reconstruction', sub: 'Google, Reddit, WebMD — conflicting, outdated' },
                        { n: '04', label: 'Fragmented Coordination', sub: 'Same cycle repeated across every appointment' },
                      ].map(({ n, label, sub }) => (
                        <div key={n} className="px-4 py-4" style={{ border: '1px solid #2A2A2A', background: '#1A1A1A' }}>
                          <p className="font-mono text-[11px] mb-2" style={{ color: '#C9A96E' }}>{n}</p>
                          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: '#FFFFFF' }}>{label}</p>
                          <p className="font-sans text-[11px]" style={{ color: '#767676' }}>{sub}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </Reveal>

            {/* Landscape gap — B2B covered, consumer missing */}
            <Reveal delay={80}>
              <div className="mt-10 border border-[#E8E8E8] rounded-[12px] overflow-hidden">
                <div className="px-6 py-5 border-b border-[#E8E8E8]">
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676]">Existing Landscape</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E8E8E8]">
                  {/* B2B side */}
                  <div className="px-6 py-6">
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] mb-4">Clinician-Side · B2B</p>
                    <div className="space-y-3">
                      {[
                        { name: 'Abridge',    src: '/logo-abridge.png' },
                        { name: 'Suki',       src: '/logo-suki.png' },
                        { name: 'Nuance DAX', src: '/logo-nuance-dax.png' },
                        { name: 'Nabla',      src: '/logo-nabla.png' },
                      ].map(({ name, src }) => (
                        <div key={name} className="flex items-center gap-3">
                          <img src={src} alt={name} className="w-[28px] h-[28px] rounded-[6px] object-cover shrink-0" />
                          <span className="font-sans text-[15px] text-[#666666]">{name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676]">Optimized for physician workflow. Patient is a data source, not a user.</p>
                  </div>
                  {/* Consumer gap */}
                  <div className="px-6 py-6 bg-[#FAFAF8]">
                    <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] mb-4">Patient-Side · Consumer</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] shrink-0" />
                      <span className="font-sans text-[15px] text-[#111111] font-semibold">Patiently</span>
                    </div>
                    <div className="space-y-2">
                      {['Notes apps', 'Google Search', 'Reddit, WebMD'].map(name => (
                        <div key={name} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8E8E8] shrink-0" />
                          <span className="font-sans text-[15px] text-[#CCCCCC]">{name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676]">No structured consumer product existed. This is the gap.</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Solution thesis */}
            <Reveal delay={60}>
              <div className="mt-10 relative rounded-[12px] border border-[#111111] bg-[#111111] p-8 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A96E]" />
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-white/40 mb-4">Patiently's Answer</p>
                <p className="font-sans text-[17px] font-semibold leading-[1.6] text-white max-w-[42ch]">
                  Capture the conversation. Structure the knowledge. Give patients something to return to.
                </p>
              </div>
            </Reveal>
          </section>


          <section id="metrics" className="scroll-mt-28 py-10 md:py-12">
            <Reveal>
              <SectionHeading label="Impact" title="88 users. One doctor interview that changed everything." />
            </Reveal>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-0">
              <Reveal delay={30}>
                <article className="pt-8 pb-10 md:pr-10 md:border-r border-t border-[#111111]">
                  <ParallaxWrap className="inline-block">
                    <p className="font-sans text-[72px] md:text-[84px] leading-none text-[#111111]">
                      <CountUpMetric value={88} />
                      {/* Wordle-tile accent */}
                      <span className="ml-3 inline-block w-4 h-4 bg-[#C9A96E] align-middle" style={{ marginBottom: '8px' }} />
                    </p>
                  </ParallaxWrap>
                  <p className="mt-1 font-sans text-[12px] tracking-[0.12em] text-[#767676] uppercase">Early Adopters · 2025</p>
                  <div className="mt-4 h-px w-full bg-[#E8E8E8]" />
                  <p className="mt-4 text-[16px] leading-[1.7] text-[#666666] max-w-[22ch]">Organic App Store downloads following initial launch. No paid acquisition.</p>
                </article>
              </Reveal>
              <Reveal delay={110}>
                <article className="pt-8 pb-10 md:px-10 md:border-r border-t border-[#111111]">
                  <ParallaxWrap className="inline-block">
                    <p className="font-sans text-[72px] md:text-[84px] leading-none text-[#111111]"><CountUpMetric value={1} /></p>
                  </ParallaxWrap>
                  <p className="mt-1 font-sans text-[12px] tracking-[0.12em] text-[#767676] uppercase">Physician Interview · Q2 2025</p>
                  <div className="mt-4 h-px w-full bg-[#E8E8E8]" />
                  <p className="mt-4 text-[16px] leading-[1.7] text-[#666666] max-w-[22ch]">Challenged core assumption around recording acceptance. Triggered strategic repositioning of recording from primary feature to optional tool.</p>
                </article>
              </Reveal>
              <Reveal delay={190}>
                <article className="pt-8 pb-10 md:pl-10 border-t border-[#111111]">
                  <ParallaxWrap className="inline-block">
                    <p className="font-sans text-[72px] md:text-[84px] leading-none text-[#111111]"><CountUpMetric value={3} />×</p>
                  </ParallaxWrap>
                  <p className="mt-1 font-sans text-[12px] tracking-[0.12em] text-[#767676] uppercase">Directional Observation · Internal Testing</p>
                  <div className="mt-4 h-px w-full bg-[#E8E8E8]" />
                  <p className="mt-4 text-[16px] leading-[1.7] text-[#666666] max-w-[22ch]">Improved topic scan efficiency in structured layout versus flat transcript flow. Based on internal usability walkthroughs. Instrumentation ongoing.</p>
                </article>
              </Reveal>
            </div>
          </section>


          <Rule />


          <section id="decisions" className="scroll-mt-28 py-10 md:py-12">
            <Reveal>
              <SectionHeading label="Architecture" title="Four decisions that shaped the product." />
            </Reveal>
            <div className="mt-16 space-y-0">
              {decisions.map((decision, index) => (
                <Reveal key={decision.title} delay={index * 90}>
                  <article className="relative pt-10 pb-14 border-t border-[#E8E8E8]">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-6 mb-2">
                      <div>
                        <p className="font-mono text-[12px] tracking-[0.18em] text-[#CCCCCC] mb-3">— {String(index + 1).padStart(2, '0')} —</p>
                        <h3 className="font-serif text-[36px] md:text-[44px] font-normal text-[#111111] leading-tight" style={{ letterSpacing: '-0.01em' }}>
                          {decision.title}
                        </h3>
                      </div>
                      <div className="shrink-0 pt-1">
                        <StatusChip status={decision.status} />
                      </div>
                    </div>
                    {/* problemShort shown inline for Decision 01 & 02 only; Decision 04 embeds it in the grid below */}
                    {'problemShort' in decision && decision.problemShort && decision.title !== 'Users need to see why AI said what it said.' && (
                      <div className="mb-8">
                        <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA] mb-2">Problem</p>
                        <p className="font-sans text-[18px] text-[#444444] leading-[1.6] max-w-[38ch]">{decision.problemShort}</p>
                      </div>
                    )}

                    {/* Sub-decisions (rich cards) or single decision text */}
                    {decision.title === '100+ topics, unsorted. I introduced categories.' ? (
                      <>
                        {/* Decision A — Before / After diagram */}
                        <div className="mb-10">
                          <div className="w-full border border-[#E8E8E8]">
                            {/* Title row */}
                            <div className="px-6 py-4 border-b border-[#E8E8E8]">
                              <p className="font-sans text-[17px] font-semibold text-[#111111]">Categories that match how patients think</p>
                            </div>

                            {/* Screenshots — Before / After — 2-col aligned with header */}
                            <div className="grid grid-cols-2">

                              {/* LEFT — Before */}
                              <div className="px-8 pt-6 pb-8 relative">
                                <p className="font-sans text-[11px] uppercase tracking-[0.18em] mb-1 text-[#AAAAAA]">Before</p>
                                <p className="font-sans text-[13px] font-semibold mb-5 text-[#111111]">Flat Topic Extraction</p>
                                <div className="max-w-[280px] mx-auto drop-shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
                                  <DecisionABeforeImage />
                                </div>
                                {/* Arrow on the divider line */}
                                <div className="absolute top-1/2 -right-[10px] -translate-y-1/2 flex items-center gap-0 z-10">
                                  <div className="h-px w-4 bg-[#C9A96E]" />
                                  <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #C9A96E' }} />
                                </div>
                              </div>

                              {/* RIGHT — After */}
                              <div className="px-8 pt-6 pb-8 border-l border-[#E8E8E8]">
                                <p className="font-sans text-[11px] uppercase tracking-[0.18em] mb-1 text-[#AAAAAA]">After</p>
                                <p className="font-sans text-[13px] font-semibold mb-5 text-[#111111]">Categorized Health Model</p>
                                <div className="max-w-[280px] mx-auto drop-shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
                                  <DecisionAAfterImage />
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>

                      </>
                    ) : decision.title === 'One tab in blind. I added a preview.' ? (
                      /* ── DECISION 02 — Preview Density ── */
                      <>
                        {/* Before/After screenshot card */}
                        <div className="w-full border border-[#E8E8E8]">

                          {/* Screenshots — Before / After */}
                          <div className="grid grid-cols-2 border-b border-[#E8E8E8]">
                            <div className="px-8 pt-6 pb-8 relative">
                              <p className="font-sans text-[11px] uppercase tracking-[0.18em] mb-1 text-[#AAAAAA]">Before</p>
                              <p className="font-sans text-[13px] font-semibold mb-5 text-[#111111]">Low Context Preview</p>
                              <div className="max-w-[280px] mx-auto drop-shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
                                <DecisionBBeforeImage />
                              </div>
                              <div className="absolute top-1/2 -right-[10px] -translate-y-1/2 flex items-center z-10">
                                <div className="h-px w-4 bg-[#C9A96E]" />
                                <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #C9A96E' }} />
                              </div>
                            </div>
                            <div className="px-8 pt-6 pb-8 border-l border-[#E8E8E8]">
                              <p className="font-sans text-[11px] uppercase tracking-[0.18em] mb-1 text-[#AAAAAA]">After</p>
                              <p className="font-sans text-[13px] font-semibold mb-5 text-[#111111]">Contextual Preview Model</p>
                              <div className="max-w-[280px] mx-auto drop-shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
                                <DecisionBAfterImage />
                              </div>
                            </div>
                          </div>

                          {/* Friction → Outcome */}
                          <div className="grid grid-cols-2 divide-x divide-[#E8E8E8]">
                            <div className="px-6 py-6">
                              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#AAAAAA] mb-4">Before</p>
                              <div className="space-y-3">
                                {[
                                  'Title alone cannot signal relevance.',
                                  'Relevance unresolvable before tabbing.',
                                  'Credibility suppressed at card level.',
                                ].map(text => (
                                  <div key={text} className="flex items-start gap-2.5">
                                    <span className="mt-[7px] w-1 h-1 rounded-full bg-[#CCCCCC] shrink-0" />
                                    <p className="font-sans text-[14px] text-[#666666] leading-[1.6]">{text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="px-6 py-6">
                              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#AAAAAA] mb-4">After</p>
                              <div className="space-y-3">
                                {[
                                  'Relevance judgment possible before tabbing.',
                                  'Credibility visible at card level.',
                                  'Informed evaluation becomes the default state.',
                                ].map(text => (
                                  <div key={text} className="flex items-start gap-2.5">
                                    <span className="mt-[7px] w-1 h-1 rounded-full bg-[#C9A96E] shrink-0" />
                                    <p className="font-sans text-[14px] text-[#666666] leading-[1.6]">{text}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                        </div>
                      </>
                    ) : decision.title === 'We shipped 3 tabs. I\'d have shipped 2.' ? (
                      /* ── DECISION 02 ── */
                      <div className="w-full py-2">

                        <div className="h-px w-full mb-10" style={{ background: 'linear-gradient(to right, #C9A96E 48px, #E8E8E8 48px)' }} />

                        {/* ── Conflict — two voices ── */}
                        <div className="mb-12 grid grid-cols-2 gap-10">

                          {/* My Proposal */}
                          <div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#AAAAAA] mb-3">My Proposal</p>
                            <p className="font-sans text-[28px] font-semibold text-[#111111] leading-none mb-4">2 tabs.</p>
                            <p className="font-sans text-[14px] text-[#767676] leading-[1.7] max-w-[28ch]">Fewer surfaces, less friction. Users reach their goal without unnecessary confirmation steps.</p>
                          </div>

                          {/* Founder Concern */}
                          <div>
                            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#AAAAAA] mb-3">Founder Concern</p>
                            <p className="font-sans text-[28px] font-semibold text-[#111111] leading-none mb-4">3 tabs.</p>
                            <p className="font-sans text-[14px] text-[#767676] leading-[1.7] max-w-[28ch]">Users need to see what they're committing to before they confirm — especially in a medical context.</p>
                          </div>

                        </div>

                        {/* What Shipped */}
                        <div className="flex items-start gap-4 mb-12">
                          <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-[#C9A96E] shrink-0 mt-0.5">What Shipped</span>
                          <div className="w-px h-4 bg-[#E8E8E8] shrink-0 mt-0.5" />
                          <p className="font-sans text-[14px] text-[#444444] leading-[1.7]">3-tab version. The founder's position held — structural transparency won over speed.</p>
                        </div>

                        {/* Reflection — first-person, honest */}
                        <div className="border-l-2 border-[#C9A96E] pl-6 mb-14">
                          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] mb-3">Reflection</p>
                          <p className="font-sans text-[15px] leading-[1.75] text-[#666666] max-w-[56ch]">
                            In hindsight, the 3-tab version improved transparency — users understood what they were confirming. But it also introduced cognitive load at the exact moment users were already processing dense medical information. The right answer was probably somewhere in between: fewer tabs, more inline context.
                          </p>
                        </div>

                        {/* Screenshots */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

                          {/* LEFT — 2-Tab */}
                          <div className="mx-auto w-full max-w-[320px] md:max-w-none md:w-[78%]">
                            <div className="flex items-baseline gap-3 mb-7">
                              <h5 className="font-sans text-[17px] font-semibold text-[#111111]">2-Tab Flow</h5>
                              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#767676]">My Proposal</span>
                            </div>
                            <div className="flex flex-col gap-5">
                              {([
                                { label: 'Step 1', src: '/decision-02-2tab-step1.png' },
                                { label: 'Step 2', src: '/decision-02-2tab-step2.png' },
                                { label: 'Step 3', src: '/decision-02-2tab-step3.png' },
                              ] as const).map(({ label, src }) => (
                                <div key={label}>
                                  <div className="w-full overflow-hidden" style={{ borderRadius: '16px', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)', border: '1px solid #E8E8E8' }}>
                                    <img src={src} alt={`2-tab flow ${label}`} className="w-full h-auto block" />
                                  </div>
                                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#CCCCCC] mt-2.5 ml-1">{label}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* RIGHT — 3-Tab */}
                          <div className="mx-auto w-full max-w-[320px] md:max-w-none md:w-[78%]">
                            <div className="flex items-baseline gap-3 mb-7">
                              <h5 className="font-sans text-[17px] font-semibold text-[#111111]">3-Tab Flow</h5>
                              <span className="font-sans text-[11px] uppercase tracking-[0.14em]" style={{ color: '#C9A96E' }}>Shipped</span>
                            </div>
                            <div className="flex flex-col gap-5">
                              {([
                                { label: 'Step 1', src: '/decision-02-3tab-step1.png' },
                                { label: 'Step 2', src: '/decision-02-3tab-step2.png' },
                                { label: 'Step 3', src: '/decision-02-3tab-step3.png' },
                              ] as const).map(({ label, src }) => (
                                <div key={label}>
                                  <div className="w-full overflow-hidden" style={{ borderRadius: '16px', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)', border: '1px solid #C9A96E' }}>
                                    <img src={src} alt={`3-tab flow ${label}`} className="w-full h-auto block" style={{ marginTop: '-11%' }} />
                                  </div>
                                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#CCCCCC] mt-2.5 ml-1">{label}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>

                      </div>
                    ) : (
                      /* ── Generic fallback for Decision 04+ ── */
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-14 items-start mb-8">
                          {/* Left — Problem */}
                          {'problemShort' in decision && decision.problemShort && (
                            <div>
                              <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA] mb-2">Problem</p>
                              <p className="font-sans text-[18px] text-[#444444] leading-[1.6]">{decision.problemShort}</p>
                            </div>
                          )}
                          {/* Right — Solution + Why It Matters */}
                          <div className="border-l-2 border-[#C9A96E] pl-6 lg:pl-8">
                            <p className="font-sans text-[17px] font-medium leading-[1.75] text-[#111111] mb-6">{decision.decision}</p>
                            <div className="border-t border-[#F0F0F0] pt-4">
                              <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#CCCCCC] mb-2">Why It Matters</p>
                              <p className="text-[16px] leading-[1.7] text-[#666666]">{decision.whyMatters}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-10">
                          {decision.visual === 'Decision Visual — Explainability + Citations (16:9)' ? (
                            /* ── Three-Layer Evidence Flow Diagram ── */
                            <div className="w-full border border-[#E8E8E8] bg-[#FAFAF8] rounded-[4px] overflow-hidden">
                              {/* Header */}
                              <div className="px-8 pt-8 pb-6 border-b border-[#E8E8E8]">
                                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#AAAAAA] mb-2">Design System</p>
                                <p className="font-sans text-[20px] font-semibold text-[#111111] mb-1">From AI output to primary evidence</p>
                                <p className="font-sans text-[13px] text-[#767676]">Three layers of context, revealed on demand.</p>
                              </div>
                              {/* 3-col diagram */}
                              <div className="px-8 py-10">
                                <div className="grid grid-cols-[1fr_48px_1fr_48px_1fr] items-start max-w-[660px] mx-auto">
                                  {/* Layer 1 — Card screenshot */}
                                  <div className="flex flex-col gap-3">
                                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA]">Layer 1 — Card</p>
                                    <div className="rounded-[10px] overflow-hidden border border-[#E8E8E8]" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                      <img src="/evidence-layer-1-card.png.png" alt="Layer 1 — Article card" className="w-full h-auto block" />
                                    </div>
                                    <div className="space-y-2 pt-1">
                                      {['Title only — no context', 'Source name, no credibility signal', 'No date or review status'].map(t => (
                                        <div key={t} className="flex items-start gap-2">
                                          <span className="mt-[5px] w-1 h-1 rounded-full bg-[#CCCCCC] shrink-0" />
                                          <p className="font-sans text-[11px] text-[#999999] leading-snug">{t}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {/* Arrow 1 */}
                                  <div className="flex items-center justify-center" style={{ paddingTop: '52px' }}>
                                    <div className="flex items-center">
                                      <div className="h-px w-6 bg-[#C9A96E]" />
                                      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #C9A96E' }} />
                                    </div>
                                  </div>
                                  {/* Layer 2 — Sources screenshot */}
                                  <div className="flex flex-col gap-3">
                                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA]">Layer 2 — Sources</p>
                                    <div className="rounded-[10px] overflow-hidden border border-[#E8E8E8]" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                      <img src="/evidence-layer-2-sources.png.png" alt="Layer 2 — Sources sheet" className="w-full h-auto block" />
                                    </div>
                                    <div className="space-y-2 pt-1">
                                      {['Ranked sources list', 'Credibility signal per source', 'Publication date visible'].map(t => (
                                        <div key={t} className="flex items-start gap-2">
                                          <span className="mt-[5px] w-1 h-1 rounded-full bg-[#C9A96E] shrink-0" />
                                          <p className="font-sans text-[11px] text-[#999999] leading-snug">{t}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  {/* Arrow 2 */}
                                  <div className="flex items-center justify-center" style={{ paddingTop: '52px' }}>
                                    <div className="flex items-center">
                                      <div className="h-px w-6 bg-[#C9A96E]" />
                                      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #C9A96E' }} />
                                    </div>
                                  </div>
                                  {/* Layer 3 — Article screenshot */}
                                  <div className="flex flex-col gap-3">
                                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA]">Layer 3 — Article</p>
                                    <div className="rounded-[10px] overflow-hidden border border-[#E8E8E8]" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                      <img src="/evidence-layer-3-article.png.png" alt="Layer 3 — Primary source article" className="w-full h-auto block" />
                                    </div>
                                    <div className="space-y-2 pt-1">
                                      {['Actual article page', 'Medically reviewed', 'Full source context'].map(t => (
                                        <div key={t} className="flex items-start gap-2">
                                          <span className="mt-[5px] w-1 h-1 rounded-full bg-[#C9A96E] shrink-0" />
                                          <p className="font-sans text-[11px] text-[#999999] leading-snug">{t}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Footer */}
                              <div className="border-t border-[#E8E8E8] px-8 py-4 text-center">
                                <p className="font-sans text-[12px] text-[#AAAAAA]">Confidence increases as depth increases.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="transition-transform duration-500 ease-out hover:-translate-y-1">
                              <MediaPlaceholder label={decision.visual} ratio="16:9" />
                            </div>
                          )}
                          <ImageCaption text={`${decision.title} — supporting visual`} />
                        </div>
                      </>
                    )}
                  </article>
                </Reveal>
              ))}
            </div>
          </section>



          <Rule />

          {/* ── Pivot ── */}
          <section id="pivot" className="scroll-mt-28 py-10 md:py-12">
            <Reveal className="max-w-[980px] mx-auto">
              <SectionHeading label="Research Impact" title="Research that changed direction" />
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                {/* Left — photo */}
                <div className="flex flex-col gap-3">
                  <img src="/pivot-testing-1.jpg" alt="User testing session" className="w-full rounded-[8px] object-cover" />
                  <p className="font-sans text-[11px] text-[#AAAAAA]">User testing with two medical professionals</p>
                </div>
                {/* Right — narrative */}
                <div className="flex flex-col gap-8">
                  {/* Finding */}
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA] mb-3">The finding</p>
                    <p className="font-sans text-[17px] leading-[1.7] text-[#333333]">Neither physician would consent to being recorded. Liability concerns from medical training made it a non-starter.</p>
                  </div>
                  <div className="border-t border-[#EEEEEE]" />
                  {/* Feedback loop */}
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA] mb-3">The feedback loop</p>
                    <p className="font-sans text-[15px] leading-[1.7] text-[#666666]">I flagged this to the founder. It wasn't new — the same friction kept surfacing from doctors and users alike.</p>
                  </div>
                  <div className="border-t border-[#EEEEEE]" />
                  {/* Pivot */}
                  <div className="border-l-2 border-[#C9A96E] pl-5">
                    <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA] mb-3">The pivot</p>
                    <p className="font-sans text-[15px] leading-[1.7] text-[#666666]">Record stays, but it's no longer the center. The product is shifting focus to For You — health management built from visit history.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          <Rule />

          {/* ── Visual Design ── */}
          <section id="visual-design" className="scroll-mt-28 py-10 md:py-12">
            <Reveal className="max-w-[980px] mx-auto">
              <SectionHeading label="Visual Design" title="Design work" />
              <div className="mt-10 flex flex-col gap-10">
                {/* Topic Tag design system */}
                <div className="flex flex-col gap-3">
                  <img src="/visual-topic-tag.png" alt="Topic Tag Component Spec" className="w-full rounded-[8px]" />
                  <p className="font-sans text-[13px] text-[#666666]">Component spec for Health Topics tag — states, spacing, color tokens, and interaction behavior.</p>
                </div>
                {/* App Icons */}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-5 gap-6 w-full bg-[#F0EFED] rounded-[8px] px-10 py-10">
                    {[
                      { src: '/icon-default.png',     label: 'Default'      },
                      { src: '/icon-dark.png',         label: 'Dark'         },
                      { src: '/icon-tinted-dark.png',  label: 'Tinted Dark'  },
                      { src: '/icon-clear-light.png',  label: 'Clear Light'  },
                      { src: '/icon-clear-dark.png',   label: 'Clear Dark'   },
                    ].map(({ src, label }) => (
                      <div key={label} className="flex flex-col items-center gap-4">
                        <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#AAAAAA] text-center">{label}</p>
                        <img src={src} alt={label} className="w-20 h-20 rounded-[22%] shadow-md" />
                        <img src={src} alt={label} className="w-12 h-12 rounded-[22%] shadow-sm" />
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-[13px] text-[#666666]">App icon — all variants.</p>
                </div>

                {/* Onboarding */}
                <div className="flex flex-col gap-3">
                  <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#767676]">Onboarding</p>
                  <div
                    className="relative w-full overflow-hidden rounded-[16px] flex items-center justify-center"
                    style={{ aspectRatio: '16/9', backgroundColor: '#7B6B9E' }}
                  >
                    {[
                      { color: '#9B7EC8', size: '65%', top: '-15%', left: '-10%', opacity: 0.85 },
                      { color: '#C4B8E0', size: '55%', top: '45%',  left: '48%',  opacity: 0.65 },
                      { color: '#6A5A9E', size: '48%', top: '50%',  left: '-8%',  opacity: 0.55 },
                      { color: '#E0D8F0', size: '40%', top: '-8%',  left: '55%',  opacity: 0.5  },
                      { color: '#B59ADA', size: '35%', top: '30%',  left: '25%',  opacity: 0.4  },
                    ].map((orb, oi) => (
                      <div key={oi} className="absolute rounded-full pointer-events-none"
                        style={{ width: orb.size, height: orb.size, top: orb.top, left: orb.left, backgroundColor: orb.color, opacity: orb.opacity, filter: 'blur(56px)' }}
                      />
                    ))}
                    <div className="relative z-10" style={{ height: '82%' }}>
                      <div className="relative h-full overflow-visible" style={{ aspectRatio: '9/19.5' }}>
                        <div className="relative w-full h-full overflow-hidden"
                          style={{ borderRadius: '12.5% / 5.77%', background: '#1A1A1A', boxShadow: '0 0 0 1.5px #3A3A3A, 0 32px 64px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.35)', padding: '1.5%' }}
                        >
                          <div className="absolute left-1/2 -translate-x-1/2 bg-black z-10"
                            style={{ top: '1.8%', width: '28%', height: '3.2%', borderRadius: '999px' }}
                          />
                          <div className="relative w-full h-full overflow-hidden bg-black" style={{ borderRadius: '11% / 5.1%' }}>
                            <video src="/flow-onboarding.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="absolute right-[-3%] top-[22%] w-[2%] h-[9%] bg-[#2A2A2A] rounded-full" />
                        <div className="absolute left-[-3%] top-[15%] w-[2%] h-[4%] bg-[#2A2A2A] rounded-full" />
                        <div className="absolute left-[-3%] top-[23%] w-[2%] h-[7%] bg-[#2A2A2A] rounded-full" />
                        <div className="absolute left-[-3%] top-[33%] w-[2%] h-[7%] bg-[#2A2A2A] rounded-full" />
                      </div>
                    </div>
                  </div>
                  <p className="font-sans text-[13px] text-[#666666]">Onboarding flow — first-run experience guiding users to their first recorded visit.</p>
                </div>
              </div>
            </Reveal>
          </section>

          <Rule />

          <section id="closing" className="scroll-mt-28 py-10 md:py-12 pb-24">
            <Reveal className="max-w-[720px] mx-auto">
              <SectionHeading label="Next" title="What's still open." />
              <div className="mt-8 space-y-4">
                {[
                  { index: '01', text: 'Instrument the full funnel from recording to follow-up completion.' },
                  { index: '02', text: 'A/B test embedded vs. tabbed follow-up entry points.' },
                  { index: '03', text: 'Prioritize topics by urgency to reduce post-visit decision latency.' },
                  { index: '04', text: 'Add source-quality and uncertainty cues for high-risk content.' },
                  { index: '05', text: 'Extend family workflows with shared reminders and care coordination.' },
                ].map(({ index, text }) => (
                  <div key={index} className="flex items-baseline gap-5 border-t border-[#E8E8E8] pt-4">
                    <span className="font-mono text-[11px] text-[#CCCCCC] shrink-0">{index}</span>
                    <p className="font-sans text-[15px] text-[#444444] leading-[1.7]">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <a
                  href="mailto:tangxiya9906@gmail.com"
                  className="inline-flex items-center gap-3 bg-[#111111] text-white px-8 py-4 rounded-xl font-semibold hover:bg-black transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 font-sans uppercase tracking-[0.14em] text-xs"
                >
                  <Mail size={16} />
                  <span>Contact</span>
                </a>
              </div>
            </Reveal>
          </section>
        </main>
      </div>{/* end content wrapper */}

      <ContactSection />
      <Footer />
    </div>
  );
};

export default PatientlyCaseStudyPage;
