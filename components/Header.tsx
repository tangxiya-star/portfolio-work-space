import React from 'react';

const Header: React.FC<{
  onAboutClick?: () => void;
  onWorkClick?: () => void;
  onLogoClick?: () => void;
}> = ({ onAboutClick, onWorkClick, onLogoClick }) => {
  const isCaseStudyRoute = window.location.pathname.startsWith('/case-studies/');
  const isAboutRoute = window.location.pathname === '/about';
  const isResumeRoute = window.location.pathname === '/resume';
  const isFunRoute = window.location.pathname === '/fun';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const linkClass =
    'px-4 py-2 text-[14px] font-medium text-[#222222] hover:text-black rounded-full hover:bg-black/[0.04] transition-colors duration-150 focus:outline-none';

  const handleWork = () => {
    if (onWorkClick) {
      onWorkClick();
      setTimeout(() => {
        const el = document.getElementById('work');
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 320);
    } else if (isCaseStudyRoute || isAboutRoute || isResumeRoute || isFunRoute) {
      window.location.href = '/#work';
    } else {
      scrollToSection('work');
    }
  };

  const handleAbout = () => {
    if (onAboutClick) onAboutClick();
    else window.location.href = '/about';
  };

  const handleContact = () => {
    const el = document.getElementById('contact');
    if (el) scrollToSection('contact');
    else window.location.href = '/#contact';
  };

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        boxShadow:
          '0 8px 24px rgba(20,20,30,0.10), 0 1px 3px rgba(20,20,30,0.06), inset 0 0 0 1px rgba(255,255,255,0.6)',
      }}
    >
      {/* Logo */}
      <a
        href="/"
        aria-label="Holly Tang — Home"
        className="flex items-center justify-center shrink-0 select-none group rounded-full hover:bg-black/[0.04] transition-colors duration-150"
        style={{ width: 40, height: 40 }}
        onClick={onLogoClick ? (e) => { e.preventDefault(); onLogoClick(); } : undefined}
      >
        <img
          src="/logo-ht.png"
          alt="Holly Tang"
          className="transition-transform duration-300 group-hover:scale-105"
          style={{ width: 30, height: 30, objectFit: 'contain', mixBlendMode: 'multiply' }}
        />
      </a>

      {/* Nav links */}
      <nav className="flex items-center gap-0.5 px-1">
        <button onClick={handleWork} className={linkClass}>Work</button>
        <button
          onClick={() => { window.location.href = '/fun'; }}
          className={linkClass}
        >
          Fun
        </button>
        <button onClick={handleAbout} className={linkClass}>About</button>
        <button
          onClick={() => { window.location.href = '/resume'; }}
          className={linkClass}
        >
          Resume
        </button>
      </nav>

      {/* Primary CTA — Contact pill */}
      <button
        onClick={handleContact}
        className="rounded-full bg-[#111111] text-white text-[13.5px] font-medium px-5 py-2.5 hover:bg-[#000000] transition-colors duration-150 shrink-0"
      >
        Contact
      </button>
    </header>
  );
};

export default Header;
