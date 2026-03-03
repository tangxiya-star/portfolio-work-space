
import React, { useState, useEffect } from 'react';

const ResumeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Full-screen overlay */}
      <div
        className="fixed inset-0 z-[80] flex flex-col bg-[#FAF9F6]"
        style={{ animation: 'resume-modal-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both' }}
        role="dialog"
        aria-modal="true"
        aria-label="Resume Preview"
      >
        <style>{`
          @keyframes resume-modal-in {
            from { opacity: 0; transform: scale(0.97) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#767676]">Resume</span>
            <span className="font-mono text-[11px] text-[#DDDDDD]">·</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#BBBBBB]">Holly Tang</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Download button */}
            <a
              href="/resume.pdf"
              download="Holly_Tang_Resume.pdf"
              className="flex items-center gap-2 bg-[#111111] text-white font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 hover:bg-[#333] transition-colors duration-150 active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download
            </a>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors duration-150 font-mono text-[13px]"
              aria-label="Close resume"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
            className="w-full h-full border-0"
            title="Holly Tang Resume"
          />
        </div>
      </div>
    </>
  );
};

const Header: React.FC<{ onAboutClick?: () => void; onWorkClick?: () => void; onLogoClick?: () => void }> = ({ onAboutClick, onWorkClick, onLogoClick }) => {
  const isCaseStudyRoute = window.location.pathname.startsWith('/case-studies/');
  const [resumeOpen, setResumeOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 56;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Work', id: 'work' },
    { label: 'About', action: 'about' },
    { label: 'Resume', action: 'resume' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] bg-[#FAF9F6] border-b border-black/12 h-14">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">

          {/* LEFT: Ink-wash Logo */}
          <a
            href="/"
            aria-label="Holly Tang — Home"
            className="flex items-center justify-center shrink-0 select-none group"
            onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick(); } : undefined}
          >
            <img
              src="/logo-ht.png"
              alt="Holly Tang"
              className="transition-all duration-300 group-hover:scale-105 group-hover:opacity-75"
              style={{ width: 48, height: 48, objectFit: 'contain', mixBlendMode: 'multiply' }}
            />
          </a>

          {/* CENTER: Nav links */}
          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const baseClass =
                'font-mono text-[12px] uppercase tracking-[0.22em] text-[#111111] px-4 py-2 hover:bg-black/5 transition-colors duration-150 focus:outline-none';

              if (item.action === 'resume') {
                return (
                  <button key={item.label} onClick={() => setResumeOpen(true)} className={baseClass}>
                    {item.label}
                  </button>
                );
              }

              if (item.action === 'about') {
                return (
                  <button key={item.label} onClick={() => onAboutClick?.()} className={baseClass}>
                    {item.label}
                  </button>
                );
              }

              if (item.id === 'work') {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (onWorkClick) {
                        // Close the overlay first, then scroll after it unmounts
                        onWorkClick();
                        setTimeout(() => {
                          const el = document.getElementById('work');
                          if (el) {
                            const offset = 56;
                            const top = el.getBoundingClientRect().top + window.scrollY - offset;
                            window.scrollTo({ top, behavior: 'smooth' });
                          }
                        }, 320);
                      } else if (isCaseStudyRoute) {
                        window.location.href = '/#work';
                      } else {
                        scrollToSection('work');
                      }
                    }}
                    className={baseClass}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id!)}
                  className={baseClass}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Date */}
          <div
            className="hidden md:block text-[9px] text-[#AAAAAA] tracking-[0.14em] uppercase select-none"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
          >
            {today}
          </div>

        </div>
      </header>

      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </>
  );
};

export default Header;
