import React from 'react';
import BeanCharacter from './BeanCharacter';

const Footer: React.FC = () => {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 mt-20">
      <a href="/" className="flex items-center space-x-4 mb-6 md:mb-0">
        <BeanCharacter size={40} />
        <span className="font-serif font-bold text-xl text-[#121212]">Tang Hub</span>
      </a>
      <div className="flex flex-col md:items-end gap-1 text-center md:text-right">
        <a
          href="mailto:tangxiya9906@gmail.com"
          className="font-mono text-[11px] text-[#AAAAAA] hover:text-[#111111] transition-colors duration-150 tracking-[0.1em]"
        >
          tangxiya9906@gmail.com
        </a>
        <div className="text-[11px] font-mono text-[#CCCCCC] uppercase tracking-[0.2em]">
          © 2025 Holly Tang
        </div>
      </div>
    </footer>
  );
};

export default Footer;
