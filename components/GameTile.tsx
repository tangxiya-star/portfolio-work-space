
import React, { useState, useEffect, useRef } from 'react';
import UnicornScene from 'unicornstudio-react';
import { Project } from '../types';

// Wrapper that measures its parent and passes pixel dims into UnicornScene.
// unicornstudio-react needs explicit width/height, so we track the container size
// via ResizeObserver and re-render whenever it changes.
const UnicornBackdrop: React.FC<{ projectId: string }> = ({ projectId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {size.w > 0 && size.h > 0 && (
        <UnicornScene production={true} projectId={projectId} width={size.w} height={size.h} />
      )}
    </div>
  );
};

interface GameTileProps {
  project: Project;
  onClick: (project: Project) => void;
  index: number;
}

// Ken Burns stagger per card — different phase + origin so they move independently
const KB_CONFIG = [
  { origin: 'center center', delay: '0s'   },
  { origin: '35% 45%',       delay: '-4s'  },
  { origin: '60% 50%',       delay: '-8s'  },
  { origin: '40% 30%',       delay: '-11s' },
];

const KEYWORD_MAP: Record<string, string[]> = {
  'Patiently':   ['Health Structuring', 'Decision Architecture', 'AI UX'],
  'Superworld':  ['Cross-platform Design', 'Agile / Scrum', 'MVP Launch'],
  'Uniwell':     ['PMF Validation', 'UX Strategy', 'Mobile Design'],
  '2D Moon':     ['Innovative Design', 'Data-driven Design', 'End-to-end Ownership'],
};

// Editorial one-liner per project — caption-style, must stay under ~6 words.
const SHORT_TAGLINE: Record<string, string> = {
  'taxpilot':              'AI tax tracker for freelancers.',
  'scanreason-ai':         'AI radiology reasoning copilot.',
  'spelling-bee-redesign': 'AI scribe for medical visits.',
  'superworld':            'AR real estate, mapped.',
  'uniwell':               'Mental health for students.',
  '2d-moon':               'NFT collectors, social.',
};

// Mono right-side meta — type · year, kept terse.
const META_LABEL: Record<string, string> = {
  'taxpilot':              'Shipped · 2026',
  'scanreason-ai':         'Hackathon Winner · 2026',
  'spelling-bee-redesign': 'Shipped · 2026',
  'superworld':            'AR · Mobile · 2024',
  'uniwell':               'Mobile · UX · 2024',
  '2d-moon':               'Web · NFT · 2023',
};

// ── Patiently frame images — served from /public/ ──────────────────────────
const buildPatientlyFrames = (_placeholderSrc: string): string[] => [
  '/patiently-frame-0.jpg',
  '/patiently-frame-1.jpg',
  '/patiently-frame-2.jpg',
  '/patiently-frame-3.jpg',
];

const monoStyle = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  textTransform: 'uppercase' as const,
};

const GameTile: React.FC<GameTileProps> = ({ project, onClick, index }) => {
  const isPatientlyCard = project.title === 'Patiently';
  const isTaxPilotCard = project.id === 'taxpilot';
  const isScanReasonCard = project.id === 'scanreason-ai';
  const isPlaceholderCard = false;
  const isNonInteractive = false;
  const cardKeywords = KEYWORD_MAP[project.title] ?? project.skills ?? [];
  const leadTag = cardKeywords.length > 0 ? cardKeywords[0] : project.category;
  const yearLabel = isPatientlyCard ? '2026' : isTaxPilotCard ? '2026' : isScanReasonCard ? '2026' : project.title === '2D Moon' ? '2023' : '2024';
  const statusLabel = isTaxPilotCard
    ? 'Case Study'
    : isScanReasonCard
    ? 'Hackathon Winner'
    : (project.title === 'Uniwell' || project.title === '2D Moon') ? 'Case Study' : 'Shipped';
  const description = project.description;
  const kb = KB_CONFIG[index % KB_CONFIG.length];

  // Derive case study + live product URLs from project id
  const caseStudyUrl = (() => {
    switch (project.id) {
      case 'spelling-bee-redesign': return '/case-studies/patiently';
      case 'superworld': return 'https://hollytanguxlab.framer.website/superworld';
      case 'uniwell': return 'https://hollytanguxlab.framer.website/uniwell';
      case '2d-moon': return 'https://hollytanguxlab.framer.website/2d-moon';
      default: return null;
    }
  })();

  const appStoreUrl = (() => {
    switch (project.id) {
      case 'spelling-bee-redesign': return 'https://apps.apple.com/us/app/patiently-medical-ai-notes/id6748413070';
      case 'superworld': return 'https://map.superworldapp.com/map/?latitude=40.751&longitude=-73.978&zoom=11.8';
      default: return null;
    }
  })();

  const appStoreLabel = project.id === 'spelling-bee-redesign' ? 'Try the App ↗' : 'Try the Product ↗';

  // ── Crossfade animation state — Patiently card only ───────────────────────
  const [activeFrame, setActiveFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isPatientlyCard || prefersReducedMotion) return;
    intervalRef.current = setInterval(() => {
      setActiveFrame(f => (f + 1) % 4);
    }, 1200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPatientlyCard, prefersReducedMotion]);

  const patientlyFrames = isPatientlyCard
    ? buildPatientlyFrames(project.coverImage)
    : [];

  return (
    <article
      className={`group ${isNonInteractive ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={() => {
        if (isNonInteractive) return;
        if (isScanReasonCard) {
          window.open('https://scan-reason-ai.vercel.app', '_blank', 'noopener,noreferrer');
          return;
        }
        onClick(project);
      }}
    >
      {/* ── Banner — rounded frosted-glass card containing the visual ── */}
      <div
        className="relative w-full overflow-hidden rounded-[22px] transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          aspectRatio: '4/3',
          background: 'rgba(255,255,255,0.42)',
          backdropFilter: 'blur(22px) saturate(140%)',
          WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.6) inset, 0 10px 30px -12px rgba(20,20,30,0.18), 0 2px 8px -2px rgba(20,20,30,0.08)',
          border: '1px solid rgba(255,255,255,0.55)',
        }}
      >
        {isPlaceholderCard ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                'repeating-linear-gradient(135deg, #F4F1EA 0 14px, #EDE8DE 14px 28px)',
            }}
          >
            <span
              className="text-[#8A7B5C]"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '11px',
                letterSpacing: '0.28em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {isScanReasonCard ? 'Placeholder · Case Study Coming' : 'Placeholder · In Progress'}
            </span>
          </div>
        ) : isTaxPilotCard ? (
          <div className="absolute inset-0 bg-[#0A0A0A]">
            {/* UnicornStudio animated backdrop */}
            <UnicornBackdrop projectId="erpu4mAlEe8kmhaGKYe9" />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* iPhone bezel — black body with rounded corners */}
              <div
                className="relative"
                style={{
                  height: '94%',
                  aspectRatio: '630 / 1346',
                  padding: '6px',
                  background: '#0D0D0D',
                  borderRadius: 26,
                  boxShadow:
                    '0 18px 40px rgba(0,0,0,0.28), 0 2px 6px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.05) inset',
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{ borderRadius: 20, background: '#000' }}
                >
                  <video
                    src="/taxpilot/taxpilot-hero.mp4"
                    autoPlay loop muted playsInline preload="metadata"
                    onLoadedMetadata={(e) => { (e.currentTarget as HTMLVideoElement).playbackRate = 0.55; }}
                    className="block w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : isScanReasonCard ? (
          <video
            src="/scanreason-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : isPatientlyCard ? (
          patientlyFrames.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${project.title} — frame ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: activeFrame === i ? 1 : 0,
                transition: prefersReducedMotion ? 'none' : 'opacity 400ms ease-in-out',
                willChange: 'opacity',
              }}
            />
          ))
        ) : (
          <img
            src={project.coverImage}
            alt={project.title}
            className="ken-burns absolute inset-0 w-full h-full object-cover"
            style={{
              transformOrigin: kb.origin,
              animationDelay: kb.delay,
            }}
          />
        )}

        {/* Always-on vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Hover overlay — stronger dark gradient + centered CTA */}
        {!isNonInteractive && (
          <>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                transition: 'opacity 180ms ease',
                background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
              }}
            />
            <div
              className="absolute inset-0 flex items-end justify-start px-5 pb-5 opacity-0 group-hover:opacity-100"
              style={{ transition: 'opacity 180ms ease' }}
            >
              <span
                className="text-white"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                }}
              >
                {isScanReasonCard ? 'Try the Product ↗' : 'View Case Study →'}
              </span>
            </div>
          </>
        )}

        {/* Name pill — floating top-left, project title only */}
        <div
          className="absolute top-5 left-5 inline-flex items-center rounded-full px-4 py-1.5"
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px) saturate(1.1)',
            WebkitBackdropFilter: 'blur(8px) saturate(1.1)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
          }}
        >
          <h3
            className="text-[#111111] leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(13px, 1.05vw, 15px)', fontWeight: 500, letterSpacing: '-0.005em' }}
          >
            {project.title}
          </h3>
        </div>
      </div>

      {/* ── Caption row: one short editorial line + mono meta ───────── */}
      <div className="px-1 pt-4 pb-2 flex items-baseline justify-between gap-6">
        <p className="font-sans text-[#111111] text-[15px] leading-[1.4] truncate">
          {SHORT_TAGLINE[project.id] ?? description}
        </p>
        <p
          className="text-[#555] shrink-0"
          style={{ ...monoStyle, fontSize: '12px', letterSpacing: '0.22em', fontWeight: 600 }}
        >
          {META_LABEL[project.id] ?? yearLabel}
        </p>
      </div>

    </article>
  );
};

export default GameTile;
