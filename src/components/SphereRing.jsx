import React, { useEffect, useState } from 'react';
import GlassSpheres, { HERO_RING_IMAGES } from './GlassSpheres';

export default function SphereRing() {
  const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });

  useEffect(() => {
    let animId = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let currentYaw = 0;
    let currentPitch = 0;
    let isVisible = true;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      targetYaw = progress * 0.75 * Math.PI;
    };

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      const normY = (e.clientY / window.innerHeight - 0.5) * 0.7;
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
      targetYaw = progress * 0.75 * Math.PI + normX;
      targetPitch = -normY;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const normX = (touch.clientX / window.innerWidth - 0.5) * 0.8;
        const normY = (touch.clientY / window.innerHeight - 0.5) * 0.7;
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
        targetYaw = progress * 0.75 * Math.PI + normX;
        targetPitch = -normY;
      }
    };

    const loop = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      const dYaw = targetYaw - currentYaw;
      const dPitch = targetPitch - currentPitch;
      currentYaw += dYaw * 0.08;
      currentPitch += dPitch * 0.08;

      if (Math.abs(dYaw) > 0.0003 || Math.abs(dPitch) > 0.0003) {
        setRotation({ yaw: currentYaw, pitch: currentPitch });
      }
      animId = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(loop);
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      },
      { threshold: 0.05 }
    );

    const heroEl = document.getElementById('top');
    if (heroEl) observer.observe(heroEl);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animId) cancelAnimationFrame(animId);
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
