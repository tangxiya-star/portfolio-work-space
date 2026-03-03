
import React from 'react';

interface BeanCharacterProps {
  className?: string;
  size?: number;
  mood?: 'happy' | 'thinking' | 'surprised';
}

const BeanCharacter: React.FC<BeanCharacterProps> = ({ className = '', size = 100 }) => {
  return (
    <div
      className={`relative inline-block transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo-ht.png"
        alt="Holly Tang"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          mixBlendMode: 'multiply',
          imageRendering: 'auto',
        }}
      />
    </div>
  );
};

export default BeanCharacter;
