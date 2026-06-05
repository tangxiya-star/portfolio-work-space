import React, { useEffect, useState } from 'react';
import { Linkedin, Moon, Github } from 'lucide-react';

// Official X (post-Twitter) logo as inline SVG — lucide-react's Twitter icon is still the bird.
const XLogo: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const LOCATION = 'San Francisco';
const EMAIL = 'tangxiya9906@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/xiya-tang/?locale=en_US';
const TWITTER  = 'https://x.com/xytng479482';
const GITHUB   = 'https://github.com/tangxiya-star';

const formatTime = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
  });

const formatChangelog = () =>
  new Date().toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });

const Footer: React.FC = () => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const navLinkClass =
    'text-[15px] text-[#111111] hover:opacity-70 transition-opacity duration-150 text-left';

  const goToNav = (target: string) => () => {
    if (target === 'fun')    { window.location.href = '/fun';    return; }
    if (target === 'about')  { window.location.href = '/about';  return; }
    if (target === 'resume') { window.location.href = '/resume'; return; }
    if (target === 'work') {
      if (window.location.pathname === '/') {
        const el = document.getElementById('work');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      }
      window.location.href = '/#work';
    }
  };

  return (
    <footer className="mt-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        {/* 3-column block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">

          {/* LEFT — brand + location/time */}
          <div className="flex flex-col gap-3">
            <a href="/" className="inline-flex items-center gap-3 group">
              <img
                src="/logo-ht.png"
                alt=""
                aria-hidden="true"
                style={{ width: 28, height: 28, objectFit: 'contain', mixBlendMode: 'multiply' }}
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-[17px] font-medium text-[#111111] tracking-[-0.005em]">
                holly tang
              </span>
            </a>
            <div className="inline-flex items-center gap-2 text-[13px] text-[#111111]">
              <Moon size={13} strokeWidth={1.8} aria-hidden="true" />
              <span>{time}, {LOCATION}</span>
            </div>
          </div>

          {/* CENTER — nav */}
          <nav className="flex flex-col items-start gap-3 md:mx-auto w-fit">
            <button onClick={goToNav('work')}   className={navLinkClass}>Work</button>
            <button onClick={goToNav('fun')}    className={navLinkClass}>Fun</button>
            <button onClick={goToNav('about')}  className={navLinkClass}>About</button>
            <button onClick={goToNav('resume')} className={navLinkClass}>Resume</button>
          </nav>

          {/* RIGHT — contact + socials */}
          <div className="flex flex-col md:items-end gap-3">
            <span className="text-[13px] text-[#111111]">Let's work together!</span>
            <a
              href={`mailto:${EMAIL}`}
              className="text-[15px] font-medium text-[#111111] hover:text-black transition-colors duration-150"
            >
              {EMAIL}
            </a>
            <div className="flex items-center gap-3 mt-1">
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#111111] hover:text-[#111111] transition-colors duration-150"
              >
                <Linkedin size={18} strokeWidth={1.6} />
              </a>
              <a
                href={TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="text-[#111111] hover:text-[#111111] transition-colors duration-150"
              >
                <XLogo size={16} />
              </a>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[#111111] hover:text-[#111111] transition-colors duration-150"
              >
                <Github size={18} strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM — centered tagline + changelog */}
        <div className="mt-20 flex flex-col items-center gap-2">
          <p className="text-[13px] text-[#111111]">
            Built with React + TypeScript + Vite &amp; <span className="text-[#111111] font-medium">a lot of flat whites</span>. ☕
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
            Changelog · {formatChangelog()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
