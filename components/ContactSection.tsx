
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

        {/* Top rule — same weight as Hero and Selected Work */}
        <div className="border-t border-black/15 pt-3 mb-12">
          <span className="font-mono text-[12px] uppercase tracking-[0.28em] text-[#767676]">
            Get in touch
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#111111] leading-[1.05] tracking-[-0.02em] mb-6 max-w-2xl">
          Let's build something structured.
        </h2>

        {/* Email address — plain text, selectable/copyable */}
        <p
          className="font-sans text-[20px] md:text-[24px] text-[#111111] mb-10 select-all cursor-text"
          style={{ letterSpacing: '-0.01em' }}
        >
          {CONTACT_LINKS.email}
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Primary — outlined */}
          <a
            href={`mailto:${CONTACT_LINKS.email}`}
            className="inline-flex items-center gap-2 border border-[#111111] px-8 py-3 font-mono text-[12px] uppercase tracking-[0.22em] text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-150 group"
          >
            Send Email
            <ArrowUpRight size={11} strokeWidth={2} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* Secondary — text link */}
          <a
            href={CONTACT_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#767676] hover:text-[#111111] transition-colors duration-150 underline underline-offset-4 decoration-[#DDDDDD] hover:decoration-[#111111]"
          >
            LinkedIn →
          </a>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
