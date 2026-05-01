
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';

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
  const isPlaceholderCard = isTaxPilotCard;
  const isNonInteractive = isTaxPilotCard;
  const cardKeywords = KEYWORD_MAP[project.title] ?? project.skills ?? [];
  const leadTag = cardKeywords.length > 0 ? cardKeywords[0] : project.category;
  const yearLabel = isPatientlyCard ? '2026' : isTaxPilotCard ? '2026' : isScanReasonCard ? '2026' : project.title === '2D Moon' ? '2023' : '2024';
  const statusLabel = isTaxPilotCard
    ? 'Coming Soon'
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
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16/10' }}
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

        {/* Category chip — top left */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1"
            style={{
              ...monoStyle,
              fontSize: '9px',
              letterSpacing: '0.16em',
              fontWeight: 700,
              color: '#111111',
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            {leadTag}
          </span>
        </div>
      </div>

      {/* ── Text block: below the image ────────────────────────────── */}
      <div className="pt-4 pb-6 px-1">

        {/* Title + shipped badge inline */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3
            className="font-serif font-normal text-[#111111] leading-[1.1] group-hover:text-[#333333] transition-colors duration-200"
            style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: '-0.01em' }}
          >
            {project.title}
          </h3>
          {isScanReasonCard ? (
            <span className="inline-flex items-center gap-1 shrink-0">
              <span
                className="px-2 py-1"
                style={{
                  ...monoStyle,
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  border: '1.5px solid #111111',
                  color: '#111111',
                  backgroundColor: 'transparent',
                }}
              >
                Hackathon
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-1"
                style={{
                  ...monoStyle,
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                  background: 'linear-gradient(180deg, #F7DA21 0%, #E5B800 100%)',
                  color: '#111111',
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                }}
              >
                <span aria-hidden style={{ fontSize: '11px', letterSpacing: 0 }}>🏆</span>
                Winner
              </span>
            </span>
          ) : (
            <span
              className="shrink-0 px-1.5 py-0.5"
              style={{
                ...monoStyle,
                fontSize: '8px',
                letterSpacing: '0.14em',
                fontWeight: 700,
                backgroundColor:
                  statusLabel === 'Shipped' ? '#D1FAE5'
                  : statusLabel === 'Coming Soon' ? '#FEF3C7'
                  : '#EDE9FE',
                color:
                  statusLabel === 'Shipped' ? '#065F46'
                  : statusLabel === 'Coming Soon' ? '#92400E'
                  : '#5B21B6',
              }}
            >
              {statusLabel}
            </span>
          )}
        </div>

        {/* Year */}
        <p className="text-[#CCCCCC] mb-2" style={{ ...monoStyle, fontSize: '9px', letterSpacing: '0.18em' }}>
          {yearLabel}
        </p>

        {/* Description */}
        <p className="font-sans text-[#777] leading-[1.6] text-[13px] mb-4">
          {description}
        </p>

        {/* CTAs — same row */}
        {(caseStudyUrl || appStoreUrl) && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {caseStudyUrl && (
              <a
                href={caseStudyUrl}
                target={caseStudyUrl?.startsWith('/') ? '_self' : '_blank'}
                rel={caseStudyUrl?.startsWith('/') ? undefined : 'noopener noreferrer'}
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-4 py-2 transition-all duration-150 hover:brightness-95 active:scale-95"
                style={{
                  backgroundColor: '#F7DA21',
                  boxShadow: '0 2px 8px rgba(247,218,33,0.45), 0 1px 3px rgba(0,0,0,0.1)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#111111',
                }}
              >
                View Case Study →
              </a>
            )}
            {appStoreUrl && (
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-4 py-2 transition-all duration-150 hover:bg-black/5 active:scale-95"
                style={{
                  border: '1px solid #DDDDDD',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#777777',
                }}
              >
                {appStoreLabel}
              </a>
            )}
          </div>
        )}

        {/* Tags — very quiet, clearly secondary */}
        {cardKeywords.length > 0 && (
          <p
            className="text-[#C8C8C8]"
            style={{ ...monoStyle, fontSize: '8px', letterSpacing: '0.1em' }}
          >
            {cardKeywords.join(' · ')}
          </p>
        )}
      </div>

      {/* ── Thin separator line ─────────────────────────────────────── */}
      <div className="h-px w-full bg-black/8" />
    </article>
  );
};

export default GameTile;
