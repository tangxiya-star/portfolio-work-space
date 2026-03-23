
import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';

// ── Reveal on scroll ─────────────────────────────────────────────────────────
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children, className = '', delay = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0,0,0)' : 'translate3d(0,12px,0)',
        transitionProperty: 'opacity, transform',
        transitionDuration: '500ms',
        transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

const Rule = () => <hr className="my-24 md:my-28 border-0 border-t border-[#E8E8E8]" />;

// ── Pillar data ───────────────────────────────────────────────────────────────
const pillars = [
  {
    index: '01',
    label: 'Innovate',
    title: 'I Innovate with Strategy',
    body: 'I naturally uncover fundamental patterns and hidden opportunities others might miss. Through my strategic lens, every challenge becomes a canvas for innovation — I anticipate outcomes, play out scenarios, and craft data-driven decisions that push boundaries and create new possibilities.',
    traits: ['Strategic Mind', 'Visionary Lens', 'Analytical Depth', 'Boundless Innovation'],
  },
  {
    index: '02',
    label: 'Influence',
    title: 'I Influence Through Action',
    body: 'Innovation isn\'t just about ideas — it\'s about making them happen. I transform abstract concepts into exciting, tangible experiences. I move projects from "what if" to "what\'s next" with decisive energy, and turn strategic insights into solutions that inspire action.',
    traits: ['Catalytic Energy', 'Creative Execution', 'Purposeful Impact', 'Transformative Drive'],
  },
  {
    index: '03',
    label: 'Maximize',
    title: 'I Maximize Impact',
    body: 'I rally unique strengths into a shared vision. I craft dynamic spaces where creativity thrives and turn collaboration into transformation — building momentum that turns bold ideas into real-world impact. When the right minds come together, innovation isn\'t just possible — it\'s inevitable.',
    traits: ['Collective Synergy', 'Strategic Flow', 'Creative Alignment', 'Transformational Momentum'],
  },
];

// ── Projects that shaped philosophy ──────────────────────────────────────────
const shapeProjects = [
  {
    index: '01',
    title: 'In Bloom',
    desc: 'A modular crib system that grows with children from 0–12 years, embracing sustainability and emotional connection.',
  },
  {
    index: '02',
    title: 'Spark Time',
    desc: 'A collaboration with Autodesk that reimagines phone charging as a tool for focused time management.',
  },
  {
    index: '03',
    title: 'Sense Shield',
    desc: 'A forward-thinking concept for home-based breast health monitoring for women aged 25–40.',
  },
];

// ── About Page ────────────────────────────────────────────────────────────────
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#F7DA21] selection:text-black overflow-x-hidden">
      <Header />

      <main className="max-w-6xl mx-auto px-6 md:px-8 mt-14">

        {/* ── Hero ── */}
        <section className="pt-12 pb-20">
          <Reveal>
            <div className="border-t border-black/15 pt-3 mb-12 flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#767676]">About</span>
              <span className="font-mono text-[11px] text-[#CCCCCC]">·</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#767676]">Holly Tang</span>
            </div>
          </Reveal>

          <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20">
            {/* Left — headline + intro */}
            <div className="md:w-3/5">
              <Reveal>
                <h1
                  className="font-serif font-bold text-[#111111] leading-none tracking-[-0.02em] mb-6"
                  style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
                >
                  I create.<br />I influence.<br />I maximize.
                </h1>
              </Reveal>
              <Reveal delay={80}>
                <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[52ch] mb-8">
                  What sets me apart is my ability to blend deep strategic thinking with decisive execution. I naturally uncover hidden patterns others miss, then transform those insights into tangible innovations that inspire teams to action.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <div className="flex flex-wrap gap-3">
                  {['Product Design', 'Health AI', 'Design Systems', 'San Francisco'].map((tag) => (
                    <span
                      key={tag}
                      className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] border border-[#E8E8E8] px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right — portrait */}
            <div className="md:w-2/5 w-full">
              <Reveal delay={60}>
                <div className="aspect-[4/5] overflow-hidden bg-[#F0EDE8] rounded-[12px]">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                    alt="Holly Tang"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="h-[3px] bg-[#C9A96E] w-1/3 mt-0" />
              </Reveal>
            </div>
          </div>
        </section>

        <Rule />

        {/* ── Three Pillars ── */}
        <section className="py-10 md:py-12">
          <Reveal>
            <div className="mb-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676]">Philosophy</span>
            </div>
            <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight tracking-[-0.015em] mb-4">
              Three things I bring to every room.
            </h2>
            <div className="h-px w-12 bg-[#111111] mb-16" />
          </Reveal>

          <div className="space-y-0">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.index} delay={i * 60}>
                <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8 md:gap-16 py-10 border-t border-[#E8E8E8]">
                  {/* Left */}
                  <div>
                    <span className="font-mono text-[11px] text-[#CCCCCC] block mb-3">{pillar.index}</span>
                    <span
                      className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold px-3 py-1 border border-[#C9A96E] text-[#111111]"
                    >
                      {pillar.label}
                    </span>
                  </div>
                  {/* Right */}
                  <div>
                    <h3 className="font-sans text-[32px] font-semibold text-[#111111] leading-tight tracking-[-0.015em] mb-4">
                      {pillar.title}
                    </h3>
                    <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[56ch] mb-8">
                      {pillar.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.traits.map((trait) => (
                        <span
                          key={trait}
                          className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#767676] border border-[#E8E8E8] px-3 py-1.5 rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Rule />

        {/* ── Design as a Life Perspective ── */}
        <section className="py-10 md:py-12">
          <Reveal>
            <div className="mb-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676]">Background</span>
            </div>
            <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight tracking-[-0.015em] mb-4">
              Design as a life perspective.
            </h2>
            <div className="h-px w-12 bg-[#111111] mb-12" />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <Reveal delay={40}>
              <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[52ch]">
                Design permeates every aspect of my life. Long before I formally became a UX designer, I was already identifying problems in daily life and crafting innovative solutions. Whether designing digital or physical products, the essence remains constant: understanding user needs through research, identifying core problems, and solving them with forward-thinking approaches.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[52ch]">
                Good design transcends mediums — it's about identifying fundamental human needs and creating thoughtful solutions that enhance lives. Whether digital or physical, the essence of design remains the same: understanding deeply, thinking ahead, and creating meaningful impact.
              </p>
            </Reveal>
          </div>

          {/* Projects grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#E8E8E8]">
            {shapeProjects.map((p, i) => (
              <Reveal key={p.index} delay={i * 50}>
                <div className="border-r border-b border-[#E8E8E8] p-8">
                  <span className="font-mono text-[11px] text-[#CCCCCC] block mb-4">{p.index}</span>
                  <h3 className="font-sans text-[17px] font-semibold text-[#111111] mb-3">{p.title}</h3>
                  <p className="text-[15px] font-sans text-[#666666] leading-[1.7]">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Rule />

        {/* ── Global Heart ── */}
        <section className="py-10 md:py-12">
          <Reveal>
            <div className="mb-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676]">Perspective</span>
            </div>
            <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight tracking-[-0.015em] mb-4">
              A global heart.
            </h2>
            <div className="h-px w-12 bg-[#111111] mb-12" />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-10">
            <Reveal delay={40}>
              <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[52ch]">
                Growing up between different worlds has shaped who I am. My curiosity drives me beyond just visiting new places — it's about understanding the hearts and minds of people across cultures. From late-night conversations in Kosovo to sharing stories over Korean street food, each interaction adds a new dimension to how I see the world.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[52ch]">
                My global experiences have taught me that while change is constant, human connection remains our strongest anchor. This multicultural lens isn't just part of my toolkit — it's woven into who I am, driving me to build bridges between different cultures and ways of thinking.
              </p>
            </Reveal>
          </div>

          {/* Places strip */}
          <Reveal delay={60}>
            <div className="flex flex-wrap gap-2 mt-6">
              {['Beijing', 'San Francisco', 'Seoul', 'Kosovo', 'Zagreb', 'Berlin', 'Rochester'].map((place) => (
                <span
                  key={place}
                  className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] border border-[#E8E8E8] px-3 py-1.5 rounded-full"
                >
                  {place}
                </span>
              ))}
            </div>
          </Reveal>
        </section>

        <Rule />

        {/* ── Disciplines ── */}
        <section className="py-10 md:py-12 pb-24">
          <Reveal>
            <div className="mb-3">
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676]">Skills</span>
            </div>
            <h2 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight tracking-[-0.015em] mb-4">
              What I work with.
            </h2>
            <div className="h-px w-12 bg-[#111111] mb-12" />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#E8E8E8]">
            {[
              {
                label: 'Research & Design',
                items: ['User Research', 'Usability Testing', 'iOS & Android Native', 'Cross-platform Design', 'Storytelling', 'User Flow Mapping', 'Prototyping', 'Visual Design', 'Inclusive Design', 'UX Strategy', 'Design Systems'],
              },
              {
                label: 'Methods',
                items: ['Agile', 'Design Sprints', 'A/B Testing', 'Jobs-to-be-done', 'Accessibility', 'Design Hand-off', 'Design Decision Articulation'],
              },
              {
                label: 'Tools',
                items: ['Figma', 'Adobe Creative Suite', 'Midjourney', 'InVision', 'HTML / CSS', 'UserTesting', 'Jira', 'Gemini AI Studio', 'Claude', 'Replit'],
              },
            ].map((col, i) => (
              <Reveal key={col.label} delay={i * 50}>
                <div className="border-r border-b border-[#E8E8E8] p-8">
                  <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676] mb-6">{col.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {col.items.map((item) => (
                      <span
                        key={item}
                        className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#767676] border border-[#E8E8E8] px-3 py-1.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={80}>
            <div className="mt-16 flex flex-wrap gap-4 items-center">
              <a
                href="/"
                className="border border-[#111111] px-8 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-150 active:scale-95"
              >
                ← View Work
              </a>
              <a
                href="mailto:tangxiya9906@gmail.com"
                className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676] hover:text-[#111111] transition-colors duration-150 underline underline-offset-4 decoration-[#CCCCCC] hover:decoration-[#111111]"
              >
                Get in touch →
              </a>
            </div>
          </Reveal>
        </section>

      </main>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
