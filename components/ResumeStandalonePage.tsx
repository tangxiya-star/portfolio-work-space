
import React from 'react';
import Header from './Header';
import ContactSection from './ContactSection';
import Footer from './Footer';

const ResumeStandalonePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-[#F7DA21] selection:text-black">
      <Header />

      {/* Sub-bar: label + download — fixed below the main nav */}
      <div className="fixed top-14 left-0 right-0 z-[50] flex items-center justify-between px-6 py-3 bg-[#FAF9F6] border-b border-black/10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#767676]">Resume</span>
          <span className="font-mono text-[11px] text-[#DDDDDD]">·</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#BBBBBB]">Holly Tang</span>
        </div>

        <a
          href="/resume.pdf"
          download="Holly_Tang_Resume.pdf"
          className="flex items-center gap-2 bg-[#111111] text-white font-mono text-[11px] uppercase tracking-[0.22em] px-4 py-2 hover:bg-[#333] transition-colors duration-150 active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download
        </a>
      </div>

      {/* PDF viewer — full viewport height, sits below both fixed bars */}
      <div style={{ paddingTop: '112px' /* 56px header + ~48px sub-bar */ }}>
        <iframe
          src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=1"
          className="w-full border-0"
          style={{ height: 'calc(100vh - 112px)', display: 'block' }}
          title="Holly Tang Resume"
        />
      </div>

      {/* Contact + Footer — scroll below the PDF */}
      <ContactSection />
      <Footer />
    </div>
  );
};

export default ResumeStandalonePage;
