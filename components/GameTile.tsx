
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
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

const PATIENTLY_KEYWORDS = ['Health Structuring', 'Decision Architecture', 'AI UX'];
const KEYWORD_MAP: Record<string, string[]> = {
  'Patiently':   ['Health Structuring', 'Decision Architecture', 'AI UX'],
  'Superworld':  ['Cross-platform Design', 'Agile / Scrum', 'MVP Launch'],
  'Uniwell':     ['PMF Validation', 'UX Strategy', 'Mobile Design'],
  '2D Moon':     ['Innovative Design', 'Data-driven Design', 'End-to-end Ownership'],
};

// ── Patiently frame images — served from /public/ ──────────────────────────
// Frame order: 0 → 1 → 2 → 3 → 0 (loops continuously)
const buildPatientlyFrames = (_placeholderSrc: string): string[] => [
  '/patiently-frame-0.jpg', // Frame 0
  '/patiently-frame-1.jpg', // Frame 1
  '/patiently-frame-2.jpg', // Frame 2
  '/patiently-frame-3.jpg', // Frame 3
];

const GameTile: React.FC<GameTileProps> = ({ project, onClick, index }) => {
  const isPatientlyCard = project.title === 'Patiently';
  const cardKeywords = KEYWORD_MAP[project.title] ?? [];
  const leadTag = cardKeywords.length > 0 ? cardKeywords[0] : project.category;
  const yearLabel = isPatientlyCard ? '2026' : project.title === '2D Moon' ? '2023' : '2024';
  const description = project.description;
  const kb = KB_CONFIG[index % KB_CONFIG.length];

  // ── Crossfade animation state — Patiently card only ───────────────────────
  const [activeFrame, setActiveFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Respect prefers-reduced-motion — detect once on mount
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Only run the interval for the Patiently card, and only if motion is allowed
    if (!isPatientlyCard || prefersReducedMotion) return;

    // Start cycling frames: 0 → 1 → 2 → 3 → 0 → …
    intervalRef.current = setInterval(() => {
      setActiveFrame(f => (f + 1) % 4);
    }, 2400); // Change frame every 2400ms

    // Clean up on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPatientlyCard, prefersReducedMotion]);
  // ─────────────────────────────────────────────────────────────────────────

  const patientlyFrames = isPatientlyCard
    ? buildPatientlyFrames(project.coverImage)
    : [];

  return (
    <article
      className="group cursor-pointer"
      onClick={() => onClick(project)}
    >
      {/* ── Image area ─────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16/10' }}
      >

        {isPatientlyCard ? (
          // ── Patiently: 4 stacked frames, crossfade via opacity ──────
          // All 4 imgs are always mounted so the browser preloads them all.
          // Only the active frame is opaque; the rest are invisible.
          patientlyFrames.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${project.title} — frame ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: activeFrame === i ? 1 : 0,
                // Crossfade: smooth opacity transition unless motion is reduced
                transition: prefersReducedMotion ? 'none' : 'opacity 800ms ease-in-out',
                willChange: 'opacity',
              }}
            />
          ))
        ) : (
          // ── All other cards: original Ken Burns single image ─────────
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

        {/* Very subtle always-on vignette — just enough to pop the chip */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.12) 100%)',
          }}
        />

        {/* Hover: gentle darkening */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'rgba(0,0,0,0.14)' }}
        />

        {/* Category chip — top left */}
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
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

        {/* View Case Study — bottom right, slides up on hover */}
        <div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300 ease-out"
        >
          <span
            className="inline-flex items-center gap-1.5 bg-white text-[#111111] px-3 py-1.5"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 700,
            }}
          >
            View Case Study
            <ArrowUpRight size={10} strokeWidth={2.5} />
          </span>
        </div>
      </div>

      {/* ── Text block: below the image ────────────────────────────── */}
      <div className="pt-4 pb-6 px-1">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <h3
            className="font-serif font-normal text-[#111111] leading-[1.1] group-hover:text-[#333333] transition-colors duration-200"
            style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: '-0.01em' }}
          >
            {project.title}
          </h3>
          {/* Year + Status — right-aligned */}
          <div className="shrink-0 text-right pt-1 flex flex-col items-end gap-1.5">
            <p
              className="text-[#AAAAAA]"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}
            >
              {yearLabel}
            </p>
            <span
              className="bg-[#111111] text-white px-2 py-0.5"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
              }}
            >
              {(project.title === 'Uniwell' || project.title === '2D Moon') ? 'Case Study' : 'Shipped'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="font-sans text-[#777] leading-[1.6] mt-2"
          style={{ fontSize: '13px' }}
        >
          {description}
        </p>

        {/* Patiently keyword chips — below description */}
        {cardKeywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cardKeywords.map(kw => (
              <span
                key={kw}
                className="border border-[#DDDDDD] text-[#767676] px-2 py-0.5"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Thin separator line ─────────────────────────────────────── */}
      <div className="h-px w-full bg-black/8" />
    </article>
  );
};

export default GameTile;
