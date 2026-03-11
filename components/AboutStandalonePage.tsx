
import React from 'react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';

const pillars = [
  {
    index: '01', label: 'Innovate', title: 'I Innovate with Strategy',
    body: 'I naturally uncover fundamental patterns and hidden opportunities others might miss. Through my strategic lens, every challenge becomes a canvas for innovation — I anticipate outcomes, play out scenarios, and craft data-driven decisions that push boundaries.',
    traits: ['Strategic Mind', 'Visionary Lens', 'Analytical Depth', 'Boundless Innovation'],
  },
  {
    index: '02', label: 'Influence', title: 'I Influence Through Action',
    body: 'Innovation isn\'t just about ideas — it\'s about making them happen. I transform abstract concepts into tangible experiences, move projects from "what if" to "what\'s next" with decisive energy, and turn strategic insights into solutions that inspire action.',
    traits: ['Catalytic Energy', 'Creative Execution', 'Purposeful Impact', 'Transformative Drive'],
  },
  {
    index: '03', label: 'Maximize', title: 'I Maximize Impact',
    body: 'I rally unique strengths into a shared vision. I craft dynamic spaces where creativity thrives and turn collaboration into transformation — building momentum that turns bold ideas into real-world impact.',
    traits: ['Collective Synergy', 'Strategic Flow', 'Creative Alignment', 'Transformational Momentum'],
  },
];

const AboutStandalonePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#F7DA21] selection:text-black overflow-x-hidden">
      <Header />

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-14 pb-16 space-y-24">

        {/* ── Hero: photo left + headline right ── */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start pt-8">
          <div className="md:w-2/5 w-full shrink-0">
            <div className="w-full overflow-hidden rounded-[12px]" style={{ aspectRatio: '4/5' }}>
              <img
                src="/about-hero.jpg"
                alt="Holly Tang"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-[3px] bg-[#FFC83D] w-1/3" />
          </div>
          <div className="md:w-3/5">
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676] mb-4">Holly Tang · Product Designer</p>
            <h2 className="font-serif text-[32px] md:text-[42px] font-bold text-[#111111] leading-tight mb-6">
              I create.<br />I influence.<br />I maximize.
            </h2>
            <p className="text-[15px] font-sans text-[#666666] leading-[1.7] max-w-[48ch] mb-8">
              What sets me apart is my ability to blend deep strategic thinking with decisive execution. I naturally uncover hidden patterns others miss, then transform those insights into tangible innovations that inspire teams to action.
            </p>
            <div className="border-t border-[#E8E8E8] pt-6 space-y-4">
              {[
                { label: 'Role', value: 'Founding Product Designer' },
                { label: 'Location', value: 'San Francisco, CA' },
                { label: 'Focus', value: 'Health AI · Design Systems · Strategy' },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-6">
                  <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] w-20 shrink-0">{label}</span>
                  <span className="font-sans text-[15px] text-[#111111]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Three pillars ── */}
        <div>
          <div className="border-t border-black/15 pt-3 mb-12">
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676]">Philosophy</span>
          </div>
          <div className="space-y-0">
            {pillars.map((p) => (
              <div key={p.index} className="border-t border-[#E8E8E8] py-10 grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-8 md:gap-12 items-start">
                <div className="flex md:flex-col items-center md:items-start gap-3">
                  <span className="font-mono text-[11px] text-[#CCCCCC]">{p.index}</span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold border border-[#FFC83D] px-2 py-0.5 text-[#111111]">{p.label}</span>
                </div>
                <h3 className="font-sans text-[32px] font-semibold text-[#111111] leading-tight">{p.title}</h3>
                <p className="text-[15px] font-sans text-[#666666] leading-[1.7]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Design as life ── */}
        <div>
          <div className="border-t border-black/15 pt-3 mb-12">
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676]">Background</span>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 mb-12">
            <div className="md:w-1/2">
              <h3 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight mb-6">Design as a life perspective.</h3>
            </div>
            <div className="md:w-1/2">
              <p className="text-[15px] font-sans text-[#666666] leading-[1.7]">
                Design permeates every aspect of my life. Long before I formally became a UX designer, I was already identifying problems in daily life and crafting innovative solutions. Understanding user needs, identifying core problems, and solving them with forward-thinking approaches.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#E8E8E8]">
            {[
              { index: '01', title: 'In Bloom', desc: 'A modular crib system that grows with children from 0–12 years.', img: '/about-project-bloom.jpg' },
              { index: '02', title: 'Spark Time', desc: 'A collaboration with Autodesk reimagining phone charging as focused time management.', img: '/about-project-spark.jpg' },
              { index: '03', title: 'Sense Shield', desc: 'A forward-thinking concept for home-based breast health monitoring.', img: '/about-project-sense.jpg' },
            ].map((item) => (
              <div key={item.index} className="border-r border-b border-[#E8E8E8] flex flex-col">
                <div className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="font-mono text-[11px] text-[#CCCCCC] block mb-2">{item.index}</span>
                  <p className="font-sans text-[17px] font-semibold text-[#111111] mb-2">{item.title}</p>
                  <p className="text-[15px] font-sans text-[#666666] leading-[1.7]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Global heart ── */}
        <div>
          <div className="border-t border-black/15 pt-3 mb-12">
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676]">Perspective</span>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 mb-12">
            <div className="md:w-1/2">
              <h3 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight mb-0">A global heart.</h3>
            </div>
            <div className="md:w-1/2">
              <p className="text-[15px] font-sans text-[#666666] leading-[1.7] mb-6">
                Growing up between different worlds has shaped who I am. My curiosity drives me beyond just visiting new places — it's about understanding the hearts and minds of people across cultures. Each interaction adds a new dimension to how I see the world.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Beijing', 'San Francisco', 'Seoul', 'Kosovo', 'Zagreb', 'Berlin'].map((place) => (
                  <span key={place} className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#767676] border border-[#E8E8E8] px-3 py-1.5 rounded-full">{place}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: '/about-global-1.jpg', alt: 'Travel photo 1' },
              { src: '/about-global-2.jpg', alt: 'Travel photo 2' },
              { src: '/about-global-3.jpg', alt: 'Travel photo 3' },
              { src: '/about-global-4.jpg', alt: 'Travel photo 4' },
            ].map((photo) => (
              <div key={photo.src} className="overflow-hidden rounded-[12px] bg-[#F0EDE8]" style={{ aspectRatio: '3/4' }}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Fun / Side Projects ── */}
        <div>
          <div className="border-t border-black/15 pt-3 mb-3">
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676]">Fun</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <h3 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight">
              I build what I'm curious about.
            </h3>
            <p className="text-[13px] font-sans text-[#767676] max-w-[36ch] leading-[1.6] md:text-right shrink-0">
              When something doesn't exist yet — or exists badly — I go make it.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: '01', title: 'UniWell', subtitle: 'Campus health navigator for college students.',
                type: 'Hackathon', event: "WiCHacks '24", img: '/fun-uniwell.jpg',
                link: 'https://devpost.com/software/uniwell',
              },
              {
                id: '02', title: 'Brain in Unity', subtitle: 'MRI → 3D brain reconstruction → interactive exploration in Unity.',
                type: 'Capstone', event: 'Grad Thesis', img: '/fun-brain.jpg', link: null,
              },
              {
                id: '03', title: 'CES × Even Realities', subtitle: "The best AR interaction design I've touched. Went to CES to find out why.",
                type: 'Industry', event: 'CES 2025', img: '/fun-ces.jpg', link: null,
              },
            ].map((item) => {
              const typePill: Record<string, string> = {
                'Hackathon': 'border-[#FFC83D] text-[#111111]',
                'Capstone':  'border-[#111111] text-[#111111]',
                'Industry':  'border-[#767676] text-[#767676]',
              };
              return (
                <div key={item.id} className="group flex flex-col">
                  <div className="overflow-hidden bg-[#F0EDE8] mb-4" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={item.img} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.parentElement!.style.background = '#F0EDE8';
                        el.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-semibold border px-2 py-0.5 ${typePill[item.type] ?? 'border-[#CCCCCC] text-[#767676]'}`}>
                      {item.type}
                    </span>
                    <span className="font-mono text-[10px] text-[#CCCCCC] uppercase tracking-[0.16em]">{item.event}</span>
                  </div>
                  <p className="font-sans text-[17px] font-semibold text-[#111111] leading-snug mb-1">{item.title}</p>
                  <p className="font-sans text-[13px] text-[#666666] leading-[1.6]">{item.subtitle}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#767676] hover:text-[#111111] transition-colors duration-150">
                      View →
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Back ── */}
        <div className="border-t border-[#E8E8E8] pt-10 pb-8">
          <a
            href="/"
            className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676] hover:text-[#111111] transition-colors duration-150 underline underline-offset-4 decoration-[#CCCCCC] hover:decoration-[#111111]"
          >
            ← Back to work
          </a>
        </div>

      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default AboutStandalonePage;
