
import React from 'react';

const Header: React.FC<{ onAboutClick?: () => void; onWorkClick?: () => void; onLogoClick?: () => void }> = ({ onAboutClick, onWorkClick, onLogoClick }) => {
  const isCaseStudyRoute = window.location.pathname.startsWith('/case-studies/');
  const isAboutRoute = window.location.pathname === '/about';
  const isResumeRoute = window.location.pathname === '/resume';

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

  const baseClass =
    'font-mono text-[12px] uppercase tracking-[0.22em] text-[#111111] px-4 py-2 hover:bg-black/5 transition-colors duration-150 focus:outline-none';

  return (
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

            if (item.action === 'resume') {
              return (
                <button
                  key={item.label}
                  onClick={() => { window.location.href = '/resume'; }}
                  className={baseClass}
                >
                  {item.label}
                </button>
              );
            }

            if (item.action === 'about') {
              return (
                <button key={item.label} onClick={() => {
                  if (onAboutClick) {
                    onAboutClick();
                  } else {
                    window.location.href = '/about';
                  }
                }} className={baseClass}>
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
                      onWorkClick();
                      setTimeout(() => {
                        const el = document.getElementById('work');
                        if (el) {
                          const offset = 56;
                          const top = el.getBoundingClientRect().top + window.scrollY - offset;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }, 320);
                    } else if (isCaseStudyRoute || isAboutRoute || isResumeRoute) {
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
                onClick={() => {
                  // If the section exists on this page, scroll to it; otherwise go to homepage anchor
                  const el = document.getElementById(item.id!);
                  if (el) {
                    scrollToSection(item.id!);
                  } else {
                    window.location.href = `/#${item.id}`;
                  }
                }}
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
  );
};

export default Header;
