import React, { useEffect, useState } from 'react';
import GlassSpheres, { ALL_SPHERE_IMAGES } from './GlassSpheres';

export default function SphereFooter() {
  const [scrollRotation, setScrollRotation] = useState(0);

  useEffect(() => {
    let animId;
    let targetRotation = 0;
    let currentRotation = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = scrollY / maxScroll;
      targetRotation = progress * 0.8 * Math.PI;
    };

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = scrollY / maxScroll;
      targetRotation = progress * 0.8 * Math.PI + normX;
    };

    const loop = () => {
      currentRotation += (targetRotation - currentRotation) * 0.05;
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
    <footer className="relative h-[65svh] w-full overflow-hidden bg-scene select-none" data-footer-reveal="true">
      <div className="absolute inset-0 size-full pointer-events-none overflow-visible" data-sphere-footer="true">
        <GlassSpheres
          images={ALL_SPHERE_IMAGES}
          variant="field"
          scrollRotation={scrollRotation}
        />
      </div>
    </footer>
  );
}
