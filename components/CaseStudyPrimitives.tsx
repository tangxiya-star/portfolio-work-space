import React from 'react';

interface SectionWrapperProps {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, kicker, title, children }) => {
  return (
    <section id={id} className="py-12 border-t border-gray-200 scroll-mt-28">
      <div className="mb-5">
        <p className="font-sans text-[12px] font-black uppercase tracking-[0.24em] text-gray-400">{kicker}</p>
        <h2 className="mt-2 font-serif text-4xl md:text-5xl font-bold text-[#121212]">{title}</h2>
      </div>
      {children}
    </section>
  );
};

export const Divider: React.FC = () => <div className="h-px bg-gray-200 w-full" />;

export const Badge: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-flex bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
    {text}
  </span>
);

interface MediaPlaceholderProps {
  label: string;
  ratio: '16:9' | '4:3' | '3:2' | '1:1';
}

const ratioClassMap: Record<MediaPlaceholderProps['ratio'], string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  '1:1': 'aspect-square',
};

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({ label, ratio }) => (
  <div className={`w-full ${ratioClassMap[ratio]} bg-white border-[3px] border-[#121212]/10 rounded-2xl p-6 flex items-center justify-center`}>
    <div className="text-center">
      <p className="font-sans text-[12px] font-black uppercase tracking-[0.24em] text-gray-400">Image / Media</p>
      <p className="mt-2 font-serif text-2xl text-[#121212]">{label}</p>
    </div>
  </div>
);

type StatusChipVariant = 'shipped' | 'in-progress' | 'proposed';

const statusChipStyles: Record<StatusChipVariant, { bg: string; text: string; border: string; dot: string }> = {
  shipped: { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7', dot: '#43A047' },
  'in-progress': { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082', dot: '#FFB300' },
  proposed: { bg: '#F5F5F5', text: '#616161', border: '#BDBDBD', dot: '#9E9E9E' },
};

export const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const normalized = status.toLowerCase().replace(/\s+/g, '-') as StatusChipVariant;
  const style = statusChipStyles[normalized] ?? statusChipStyles['proposed'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        borderRadius: '3px',
        padding: '2px 7px',
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
};
