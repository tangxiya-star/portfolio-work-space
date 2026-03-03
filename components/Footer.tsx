import React from 'react';
import BeanCharacter from './BeanCharacter';

const Footer: React.FC = () => {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 mt-20">
      <a href="/" className="flex items-center space-x-4 mb-6 md:mb-0">
        <BeanCharacter size={40} />
        <span className="font-serif font-bold text-xl text-[#121212]">Tang Hub</span>
      </a>
      <div className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.3em]">
        © 2024 Holly Tang • Made with Curiosity & Strategy
      </div>
    </footer>
  );
};

export default Footer;
