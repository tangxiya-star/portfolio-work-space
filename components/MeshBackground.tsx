import React, { useEffect, useState } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

/**
 * Fullscreen animated mesh-gradient backdrop (Paper Design shader).
 * Sits fixed behind page content with a soft veil overlay so text stays legible.
 */
const MeshBackground: React.FC = () => {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <MeshGradient
        width={size.w}
        height={size.h}
        colors={['#72b9bb', '#b5d9d9', '#ffd1bd', '#ffebe0', '#8cc5b8', '#dbf4a4']}
        distortion={0.8}
        swirl={0.6}
        grainMixer={0}
        grainOverlay={0}
        speed={0.42}
        offsetX={0.08}
      />
      {/* Soft veil so text stays legible over the gradient */}
      <div className="absolute inset-0 bg-white/25" />
    </div>
  );
};

export default MeshBackground;
