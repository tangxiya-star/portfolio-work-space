
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CONTACT_LINKS = {
  email: 'tangxiya9906@gmail.com',
  linkedin: 'https://www.linkedin.com/in/xiya-tang/?locale=en_US',
};

const ContactSection: React.FC = () => {
  return (
    <section id="contact">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-28">

        {/* Eyebrow */}
        <div className="mb-12">
          <span className="font-sans text-[12px] uppercase tracking-[0.22em] text-[#767676]">
            Get in touch
          </span>
        </div>

        {/* Headline — sans (inherits Geist on homepage via .page-geist) */}
        <h2
          className="font-sans text-[#111111] leading-tight tracking-[-0.02em] mb-6 whitespace-nowrap"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500 }}
        >
          Let's build something structured.
        </h2>

        {/* Email — selectable plain text */}
        <p
          className="font-sans text-[#111111] mb-10 select-all cursor-text"
          style={{ fontSize: 'clamp(18px, 1.6vw, 22px)', letterSpacing: '-0.005em' }}
        >
          {CONTACT_LINKS.email}
        </p>

        {/* CTA row — pill-style buttons matching the nav */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Primary — filled dark pill */}
          <a
            href={`mailto:${CONTACT_LINKS.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] text-white px-6 py-3 text-[14px] font-medium hover:bg-black transition-colors duration-150 group"
          >
            Send Email
            <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Secondary — glass pill */}
          <a
            href={CONTACT_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium text-[#111111] transition-colors duration-150 group"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(8px) saturate(140%)',
              WebkitBackdropFilter: 'blur(8px) saturate(140%)',
              boxShadow: 'inset 0 0 0 1px rgba(17,17,17,0.12)',
            }}
          >
            LinkedIn
            <ArrowUpRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
