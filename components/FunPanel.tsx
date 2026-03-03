
import React, { useEffect } from 'react';
import Header from './Header';

const funItems = [
  {
    id: '01',
    title: 'UniWell',
    subtitle: 'Campus health navigator for college students.',
    type: 'Hackathon',
    event: 'WiCHacks \'24',
    img: '/fun-uniwell.jpg',
    link: 'https://devpost.com/software/uniwell',
    span: 'col-span-1',
  },
  {
    id: '02',
    title: 'Brain in Unity',
    subtitle: 'MRI → 3D brain reconstruction → interactive exploration in Unity.',
    type: 'Capstone',
    event: 'Grad Thesis',
    img: '/fun-brain.jpg',
    link: null,
    span: 'col-span-1',
  },
  {
    id: '03',
    title: 'CES × Even Realities',
    subtitle: 'The best AR interaction design I\'ve touched. Went to CES to find out why.',
    type: 'Industry',
    event: 'CES 2025',
    img: '/fun-ces.jpg',
    link: null,
    span: 'col-span-1',
  },
];

const typePill: Record<string, string> = {
  'Hackathon': 'border-[#FFC83D] text-[#111111]',
  'Capstone':  'border-[#111111] text-[#111111]',
  'Industry':  'border-[#767676] text-[#767676]',
};

const FunPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
      <style>{`
        @keyframes fun-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[80] bg-[#FAF9F6] overflow-y-auto"
        style={{ animation: 'fun-fade-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both' }}
        role="dialog" aria-modal="true" aria-label="Fun — Holly Tang"
      >
        <Header onAboutClick={onClose} onWorkClick={onClose} onLogoClick={onClose} />

        <button
          onClick={onClose}
          className="fixed top-3 right-6 z-[90] w-8 h-8 flex items-center justify-center bg-black/6 hover:bg-black/12 transition-colors duration-150 font-mono text-[13px]"
          aria-label="Close"
        >✕</button>

        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-20 pb-24">

          {/* ── Header ── */}
          <div className="border-t border-black/15 pt-3 mb-3">
            <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676]">Fun</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <h2 className="font-sans text-[42px] md:text-[56px] font-bold text-[#111111] leading-tight">
              I build what I'm curious about.
            </h2>
            <p className="text-[13px] font-sans text-[#767676] max-w-[36ch] leading-[1.6] md:text-right shrink-0">
              When something doesn't exist yet — or exists badly — I go make it.
            </p>
          </div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {funItems.map((item) => {
              const card = (
                <div key={item.id} className={`group flex flex-col ${item.span}`}>
                  {/* Image */}
                  <div className="overflow-hidden bg-[#F0EDE8] mb-4" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.parentElement!.style.background = '#F0EDE8';
                        el.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-semibold border px-2 py-0.5 ${typePill[item.type] ?? 'border-[#CCCCCC] text-[#767676]'}`}>
                      {item.type}
                    </span>
                    <span className="font-mono text-[10px] text-[#CCCCCC] uppercase tracking-[0.16em]">{item.event}</span>
                  </div>

                  {/* Title */}
                  <p className="font-sans text-[17px] font-semibold text-[#111111] leading-snug mb-1">
                    {item.title}
                  </p>

                  {/* One-liner */}
                  <p className="font-sans text-[13px] text-[#666666] leading-[1.6]">
                    {item.subtitle}
                  </p>

                  {/* Link */}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#767676] hover:text-[#111111] transition-colors duration-150"
                    >
                      View →
                    </a>
                  )}
                </div>
              );
              return card;
            })}
          </div>

          {/* ── Back ── */}
          <div className="border-t border-[#E8E8E8] pt-10 mt-16">
            <button
              onClick={onClose}
              className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#767676] hover:text-[#111111] transition-colors duration-150 underline underline-offset-4 decoration-[#CCCCCC] hover:decoration-[#111111]"
            >
              ← Back to work
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default FunPanel;
