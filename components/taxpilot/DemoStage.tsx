import React, { useEffect, useRef, useState } from 'react';
import PhoneFrame from './PhoneFrame';

interface DemoStageProps {
  /** Real source path shown in mono — proves the mount is the production file. */
  source: string;
  /** Optional kicker label (e.g., "Loading", "Analyzing"). Mono uppercase. */
  kicker?: string;
  /** Phone-frame scale. Defaults to PhoneFrame's own default. */
  scale?: number;
  /** When set, auto-replay every N ms while in viewport. Pauses when scrolled away. */
  autoLoopMs?: number;
  /** The screen to mount inside the frame. Remounted on Replay via `key`. */
  children: React.ReactNode;
}

/**
 * Rauno-style demo stage:
 * - mono source path on top
 * - PhoneFrame (no card chrome)
 * - bottom toolbar with a Replay control that bumps a key,
 *   forcing the screen to unmount/remount so motion plays again from t=0
 * - optional autoLoopMs: replay automatically while visible, pause when not.
 */
const DemoStage: React.FC<DemoStageProps> = ({
  source, kicker, scale, autoLoopMs, children,
}) => {
  const [version, setVersion] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Track viewport visibility so auto-loops only run when on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!autoLoopMs || !visible) return;
    const id = window.setInterval(
      () => setVersion((v) => v + 1),
      autoLoopMs
    );
    return () => window.clearInterval(id);
  }, [autoLoopMs, visible]);

  return (
    <div ref={ref} className="flex flex-col items-start gap-3">
      <div className="flex items-baseline gap-3">
        {kicker && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#111111]">
            {kicker}
          </span>
        )}
        <span className="font-mono text-[10px] text-[#999999]">{source}</span>
      </div>

      <PhoneFrame scale={scale} key={version}>
        {children}
      </PhoneFrame>

      <button
        type="button"
        onClick={() => setVersion((v) => v + 1)}
        className="group flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999] hover:text-[#111111] transition-colors"
        aria-label="Replay demo"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          aria-hidden="true"
          className="transition-transform group-hover:-rotate-45"
        >
          <path
            d="M9 3.5A4 4 0 1 0 9 7.5"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path d="M9 1v3H6" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
        <span>Replay</span>
      </button>
    </div>
  );
};

export default DemoStage;
