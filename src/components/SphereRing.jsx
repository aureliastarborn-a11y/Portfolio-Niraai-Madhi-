import React, { useEffect, useState } from 'react';
import GlassSpheres, { HERO_RING_IMAGES } from './GlassSpheres';

export default function SphereRing() {
  const [scrollRotation, setScrollRotation] = useState(0);

  useEffect(() => {
    let animId;
    let targetRotation = 0;
    let currentRotation = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      targetRotation = progress * 0.75 * Math.PI;
    };

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 0.25;
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      targetRotation = progress * 0.75 * Math.PI + normX;
    };

    const loop = () => {
      currentRotation += (targetRotation - currentRotation) * 0.08;
      setScrollRotation(currentRotation);
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 size-full pointer-events-none overflow-visible select-none" aria-hidden="true">
      <GlassSpheres
        images={HERO_RING_IMAGES}
        variant="ring"
        scrollRotation={scrollRotation}
      />
    </div>
  );
}
