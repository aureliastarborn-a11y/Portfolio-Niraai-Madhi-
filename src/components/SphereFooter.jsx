import React, { useEffect, useState } from 'react';
import GlassSpheres, { ALL_SPHERE_IMAGES } from './GlassSpheres';

export default function SphereFooter() {
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });

  useEffect(() => {
    let animId;
    let targetYaw = 0;
    let targetPitch = 0;
    let currentYaw = 0;
    let currentPitch = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = scrollY / maxScroll;
      targetYaw = progress * 0.8 * Math.PI;
    };

    const handleMouseMove = (e) => {
      // Horizontal rotation (yaw) from left/right cursor
      const normX = (e.clientX / window.innerWidth - 0.5) * 1.8;
      // Vertical rotation (pitch) from up/down cursor - rolling the sphere up & down
      const normY = (e.clientY / window.innerHeight - 0.5) * 1.8;

      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = scrollY / maxScroll;

      targetYaw = progress * 0.8 * Math.PI + normX;
      targetPitch = -normY;
    };

    const loop = () => {
      currentYaw += (targetYaw - currentYaw) * 0.06;
      currentPitch += (targetPitch - currentPitch) * 0.06;
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
    <footer className="relative h-[65svh] w-full overflow-hidden bg-transparent select-none" data-footer-reveal="true">
      <div className="absolute inset-0 size-full pointer-events-none overflow-visible" data-sphere-footer="true">
        <GlassSpheres
          images={ALL_SPHERE_IMAGES}
          variant="field"
          scrollRotation={rotation}
        />
      </div>
    </footer>
  );
}
