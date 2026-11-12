import React, { useEffect, useState } from 'react';

const ALL_TEXTURES = [
  '/images/sphere-textures/vaulted-library.webp',
  '/images/sphere-textures/botanical-specimen.webp',
  '/images/sphere-textures/garden-sculpture.webp',
  '/images/sphere-textures/quiet-gallery.webp',
  '/images/sphere-textures/hillside-studio.webp',
  '/images/sphere-textures/midnight-water.webp',
  '/images/sphere-textures/alpine-basin.webp',
  '/images/sphere-textures/industrial-hall.webp',
  '/images/sphere-textures/rocky-horizon.webp',
  '/images/sphere-textures/columned-undercroft.webp',
  '/images/sphere-textures/concrete-exhibition.webp',
  '/images/sphere-textures/steaming-crater.webp',
  '/images/sphere-textures/canyon-house.webp',
  '/images/sphere-textures/skylit-corridor.webp',
  '/images/sphere-textures/ivory-sand.webp',
  '/images/sphere-textures/cyan-terminals.webp',
  '/images/sphere-textures/colorful-facade.webp',
  '/images/sphere-textures/neon-alley.webp',
  '/images/sphere-textures/concrete-street.webp',
  '/images/sphere-textures/folded-mesh.webp',
  '/images/sphere-textures/isometric-linework.webp',
  '/images/sphere-textures/curtain-sofa.webp',
  '/images/sphere-textures/garden-terminals.webp',
  '/images/sphere-textures/skyward-grid.webp',
];

// Precomputed stable randomized positions across footer
const FOOTER_SPHERES = ALL_TEXTURES.map((src, i) => {
  const seed = (i * 37 + 13) % 100;
  const xPercent = (i * 4.1 + seed * 0.15) % 94 + 3;
  const yPercent = (Math.sin(i * 1.7) * 0.4 + 0.5) * 80 + 10;
  const size = 44 + ((i * 17) % 55); // 44px to 99px
  const blur = (i % 5 === 0) ? 'blur-[1.5px]' : '';
  const opacity = 0.85 + (i % 3) * 0.05;
  return { src, xPercent, yPercent, size, blur, opacity, id: i };
});

export default function SphereFooter() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <footer className="relative h-[65svh] w-full overflow-hidden bg-scene select-none" data-footer-reveal="true">
      <div className="absolute inset-0 size-full pointer-events-none">
        {FOOTER_SPHERES.map((sphere) => {
          const depth = (sphere.size / 100);
          const offsetX = mouse.x * depth;
          const offsetY = mouse.y * depth;

          return (
            <div
              key={sphere.id}
              className={`absolute rounded-full pointer-events-auto transition-transform duration-500 ease-out hover:scale-110 cursor-pointer ${sphere.blur}`}
              style={{
                left: `calc(${sphere.xPercent}% + ${offsetX}px)`,
                top: `calc(${sphere.yPercent}% + ${offsetY}px)`,
                width: `${sphere.size}px`,
                height: `${sphere.size}px`,
                opacity: sphere.opacity,
                filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.12))',
              }}
            >
              <div className="relative size-full rounded-full overflow-hidden bg-zinc-300">
                <img
                  src={sphere.src}
                  alt=""
                  draggable="false"
                  className="size-full object-cover select-none"
                />
                {/* 3D Glass refraction overlay */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 35%, rgba(0,0,0,0.5) 100%)',
                    boxShadow:
                      'inset 2px 3px 5px rgba(255,255,255,0.8), inset -2px -3px 6px rgba(0,0,0,0.4)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </footer>
  );
}

