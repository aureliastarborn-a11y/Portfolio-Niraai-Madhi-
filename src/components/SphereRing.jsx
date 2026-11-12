import React, { useEffect, useState } from 'react';
import GlassSpheres, { HERO_RING_IMAGES } from './GlassSpheres';

export default function SphereRing() {
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });

  useEffect(() => {
    let animId;
    let targetYaw = 0;
    let targetPitch = 0;
    let currentYaw = 0;
    let currentPitch = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      targetYaw = progress * 0.75 * Math.PI;
    };

    const handleMouseMove = (e) => {
      // Left/Right cursor movement rotates ring around center
      const normX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      // Up/Down cursor movement tilts/pitches the ring in 3D perspective
      const normY = (e.clientY / window.innerHeight - 0.5) * 0.7;

      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.75;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));

      targetYaw = progress * 0.75 * Math.PI + normX;
      targetPitch = -normY;
    };

    const loop = () => {
      currentYaw += (targetYaw - currentYaw) * 0.08;
      currentPitch += (targetPitch - currentPitch) * 0.08;
      setRotation({ yaw: currentYaw, pitch: currentPitch });
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
        scrollRotation={rotation}
      />
    </div>
  );
}
