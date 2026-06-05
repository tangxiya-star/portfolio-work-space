import React from 'react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';

interface FunItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'Hackathon' | 'Capstone' | 'Industry';
  event: string;
  hackathon?: string;
  img: string;
  video?: string;
  link: string | null;
}

const FUN_ITEMS: FunItem[] = [
  {
    id: '01', title: 'Firesight', subtitle: 'Best agentic mission control.',
    type: 'Hackathon', event: 'Winner',
    hackathon: 'SenAI XR Hackathon · Founders Inc, SF',
    img: '/fun-firesight.jpg', video: '/fun-firesight.mp4',
    link: 'https://alfredsjoqvist.com/firesight/',
  },
  {
    id: '02', title: 'UniWell', subtitle: 'Campus health navigator for college students.',
    type: 'Hackathon', event: "WiCHacks '24",
    img: '/fun-uniwell.jpg',
    link: 'https://devpost.com/software/uniwell',
  },
  {
    id: '03', title: 'Brain in Unity', subtitle: 'MRI → 3D brain reconstruction → interactive exploration in Unity.',
    type: 'Capstone', event: 'Grad Thesis',
    img: '/fun-brain.jpg', link: null,
  },
  {
    id: '04', title: 'CES × Even Realities', subtitle: "The best AR interaction design I've touched. Went to CES to find out why.",
    type: 'Industry', event: 'CES 2025',
    img: '/fun-ces.jpg', link: null,
  },
];

const typePill: Record<string, string> = {
  'Hackathon': 'border-[#C9A96E] text-[#111111]',
  'Capstone':  'border-[#111111] text-[#111111]',
  'Industry':  'border-[#767676] text-[#767676]',
};

const FunStandalonePage: React.FC = () => {
  return (
    <div className="page-geist min-h-screen pb-24 selection:bg-[#F7DA21] selection:text-black overflow-x-hidden">
      <Header />

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-32">
        <div className="border-t border-black/15 pt-3 mb-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#767676]">Fun</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <h1 className="font-sans text-[32px] md:text-[42px] font-semibold text-[#111111] leading-tight">
            I build what I'm curious about.
          </h1>
          <p className="text-[13px] font-sans text-[#767676] max-w-[36ch] leading-[1.6] md:text-right shrink-0">
            When something doesn't exist yet — or exists badly — I go make it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FUN_ITEMS.map((item) => {
            const Wrapper = item.link ? 'a' : 'div';
            const wrapperProps = item.link
              ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Wrapper
                key={item.id}
                {...wrapperProps}
                className={`group flex flex-col transition-transform duration-300 ${item.link ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="overflow-hidden bg-[#F0EDE8] mb-4 rounded-[10px]" style={{ aspectRatio: '4/3' }}>
                  {item.video ? (
                    <video
                      src={item.video}
                      autoPlay muted loop playsInline
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <img
                      src={item.img} alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.parentElement!.style.background = '#F0EDE8';
                        el.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-semibold border px-2 py-0.5 ${typePill[item.type] ?? 'border-[#CCCCCC] text-[#767676]'}`}>
                    {item.type}
                  </span>
                  {item.event === 'Winner' ? (
                    <span className="winner-pill font-sans text-[10px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5">
                      🏆 Winner
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-[#CCCCCC] uppercase tracking-[0.16em]">{item.event}</span>
                  )}
                </div>
                {item.hackathon && (
                  <p className="font-mono text-[10px] text-[#999999] tracking-[0.04em] mb-1">{item.hackathon}</p>
                )}
                <p className="font-sans text-[17px] font-semibold text-[#111111] leading-snug mb-1">{item.title}</p>
                <p className="font-sans text-[13px] text-[#666666] leading-[1.6]">{item.subtitle}</p>
                {item.link && (
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#767676] group-hover:text-[#111111] transition-colors duration-150">
                    View →
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default FunStandalonePage;
