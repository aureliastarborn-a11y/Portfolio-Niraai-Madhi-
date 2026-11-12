import React, { useEffect, useState, useRef } from 'react';

const RING_TEXTURES = [
  '/images/sphere-textures/rocky-horizon.webp',
  '/images/sphere-textures/canyon-house.webp',
  '/images/sphere-textures/vaulted-library.webp',
  '/images/sphere-textures/garden-sculpture.webp',
  '/images/sphere-textures/botanical-specimen.webp',
  '/images/sphere-textures/isometric-linework.webp',
  '/images/sphere-textures/concrete-street.webp',
  '/images/sphere-textures/curtain-sofa.webp',
];

export default function SphereRing() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const total = RING_TEXTURES.length;
  // Radius calculation from template logic
  const ringRadius = Math.min(280, Math.max(160, dimensions.width * 0.28));
  const sphereSize = Math.max(68, Math.min(108, ringRadius * 0.38));
  const scrollRotation = (scrollY / 800) * Math.PI * 0.8;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 size-full pointer-events-none overflow-visible select-none"
      aria-hidden="true"
    >
      {RING_TEXTURES.map((texture, i) => {
        const baseAngle = (i / total) * Math.PI * 2 - Math.PI / 2;
        const currentAngle = baseAngle + scrollRotation;
        const cx = dimensions.width / 2 + Math.cos(currentAngle) * ringRadius + mousePos.x * 25;
        const cy = dimensions.height / 2 + Math.sin(currentAngle) * ringRadius + mousePos.y * 25;

        // Subtle 3D scale and float based on position
        const depthScale = 0.88 + 0.14 * Math.sin(currentAngle + 1);

        return (
          <div
            key={i}
            className="absolute rounded-full pointer-events-auto cursor-pointer transition-transform duration-300 ease-out"
            style={{
              width: `${sphereSize}px`,
              height: `${sphereSize}px`,
              left: `${cx - sphereSize / 2}px`,
              top: `${cy - sphereSize / 2}px`,
              transform: `scale(${depthScale})`,
              filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.12))',
            }}
          >
            {/* Texture */}
            <div className="relative size-full rounded-full overflow-hidden bg-zinc-200">
              <img
                src={texture}
                alt=""
                draggable="false"
                className="size-full object-cover select-none transition-transform duration-700 hover:scale-115"
                style={{
                  transform: `rotate(${-(currentAngle * 180) / Math.PI}deg)`,
                }}
              />

              {/* Realistic 3D glass gloss & refraction overlay */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 28%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.45) 100%)',
                  boxShadow:
                    'inset 2px 3px 6px rgba(255,255,255,0.85), inset -2px -4px 8px rgba(0,0,0,0.45)',
                }}
              />

              {/* Specular highlight rim */}
              <div
                className="absolute top-1 left-2 w-3.5 h-2 rounded-full bg-white/70 blur-[0.5px] pointer-events-none"
                style={{ transform: 'rotate(-25deg)' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
