import React, { useEffect, useRef, useState, useMemo } from 'react';

// Classical museum art color themes for generating miniature painting sprites
const SPRITE_THEMES = [
  // Dutch Golden Age / Chiaroscuro Portraits
  { frame: '#C5A059', bg: '#1c1512', sky: '#2e1e17', ground: '#543d2c', highlight: '#f3d9b1', type: 'portrait' },
  { frame: '#2c221e', bg: '#181412', sky: '#231c19', ground: '#423326', highlight: '#e8cbb0', type: 'portrait' },
  { frame: '#FAF7F2', bg: '#2b231d', sky: '#3d3027', ground: '#6a513d', highlight: '#ffebcd', type: 'portrait' },
  { frame: '#8C7355', bg: '#14171a', sky: '#20262b', ground: '#3e3832', highlight: '#d9c2a7', type: 'portrait' },
  { frame: '#3A2E2B', bg: '#241b16', sky: '#362820', ground: '#5e4334', highlight: '#e6c8a2', type: 'portrait' },

  // Impressionist & Classical Landscapes
  { frame: '#FAF7F2', bg: '#7aa3be', sky: '#9ec4db', ground: '#48633b', highlight: '#eef6fa', type: 'landscape' },
  { frame: '#C5A059', bg: '#607d8b', sky: '#90a4ae', ground: '#37474f', highlight: '#cfd8dc', type: 'landscape' },
  { frame: '#2c221e', bg: '#8d6e63', sky: '#d7ccc8', ground: '#4e342e', highlight: '#efebe9', type: 'landscape' },
  { frame: '#A89F91', bg: '#556b2f', sky: '#87ceeb', ground: '#2e471b', highlight: '#fff8dc', type: 'landscape' },
  { frame: '#1E1E1E', bg: '#4682b4', sky: '#b0c4de', ground: '#2f4f4f', highlight: '#f0f8ff', type: 'landscape' },

  // Renaissance & Classical Allegories
  { frame: '#C5A059', bg: '#3a2022', sky: '#5a3538', ground: '#78494c', highlight: '#f7d5c8', type: 'allegory' },
  { frame: '#FAF7F2', bg: '#212d40', sky: '#364156', ground: '#7d4e57', highlight: '#d66853', type: 'allegory' },
  { frame: '#8C7355', bg: '#33261d', sky: '#4e3b2e', ground: '#70543e', highlight: '#e8cb9e', type: 'allegory' },
  { frame: '#1E1E1E', bg: '#1b2a47', sky: '#2c426b', ground: '#4a6b82', highlight: '#c4d7e0', type: 'allegory' },

  // Still Lifes & Interiors
  { frame: '#C5A059', bg: '#2b1d14', sky: '#3d281a', ground: '#66422a', highlight: '#d4af37', type: 'still_life' },
  { frame: '#FAF7F2', bg: '#242424', sky: '#363636', ground: '#4f4f4f', highlight: '#ffffff', type: 'still_life' },
  { frame: '#2c221e', bg: '#1f2a24', sky: '#2d3d34', ground: '#486153', highlight: '#b8d8c8', type: 'still_life' },
  { frame: '#8C7355', bg: '#38221f', sky: '#543430', ground: '#784742', highlight: '#f0b2aa', type: 'still_life' },

  // Parchment Sketches & Architectural Studies
  { frame: '#FAF7F2', bg: '#f4ede2', sky: '#ede2d0', ground: '#d9c7ad', highlight: '#3a3228', type: 'sketch' },
  { frame: '#8C7355', bg: '#e8dcce', sky: '#ddcebd', ground: '#c2ab95', highlight: '#2b221a', type: 'sketch' },
  { frame: '#2c221e', bg: '#eee6d8', sky: '#e2d6c3', ground: '#ccba9f', highlight: '#42372c', type: 'sketch' },
];

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    velX: 0,
    velY: 0,
    rotY: 0.4,
    rotX: -0.15,
    mouseX: 0,
    mouseY: 0,
    hoveredTileIdx: -1,
  });

  const [hoveredInfo, setHoveredInfo] = useState(null);

  // Generate high-resolution pre-rendered miniature artwork sprites
  const sprites = useMemo(() => {
    if (typeof document === 'undefined') return [];

    const generated = [];
    const dpr = 2; // high-resolution offscreen canvas

    SPRITE_THEMES.forEach((theme, index) => {
      // Create variations in aspect ratio
      const aspectVariants = [
        { w: 20, h: 26 }, // Portrait
        { w: 26, h: 20 }, // Landscape
        { w: 22, h: 22 }, // Square
      ];

      aspectVariants.forEach((aspect, vIdx) => {
        const offCanvas = document.createElement('canvas');
        const width = aspect.w;
        const height = aspect.h;
        offCanvas.width = width * dpr;
        offCanvas.height = height * dpr;
        const ctx = offCanvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        // 1. Frame / Mount (Gilded gold, walnut wood, or ivory mat)
        ctx.fillStyle = theme.frame;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 1.5);
        ctx.fill();

        // 2. Inner Artwork Canvas
        const border = 1.4;
        const innerW = width - border * 2;
        const innerH = height - border * 2;
        ctx.fillStyle = theme.bg;
        ctx.fillRect(border, border, innerW, innerH);

        // 3. Artistic composition based on type
        if (theme.type === 'portrait') {
          // Dark moody background, subtle head silhouette, bright lace collar/face highlight
          ctx.fillStyle = theme.sky;
          ctx.fillRect(border, border, innerW, innerH * 0.6);
          // Shoulder / garment
          ctx.fillStyle = theme.ground;
          ctx.beginPath();
          ctx.ellipse(width * 0.5, height * 0.85, innerW * 0.45, innerH * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
          // Face / flesh tone
          ctx.fillStyle = theme.highlight;
          ctx.beginPath();
          ctx.ellipse(width * 0.5, height * 0.42, innerW * 0.22, innerH * 0.24, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme.type === 'landscape') {
          // Atmospheric sky with gradient
          const skyGrad = ctx.createLinearGradient(0, border, 0, height * 0.55);
          skyGrad.addColorStop(0, theme.sky);
          skyGrad.addColorStop(1, theme.highlight);
          ctx.fillStyle = skyGrad;
          ctx.fillRect(border, border, innerW, innerH * 0.55);

          // Rolling hills / horizon
          ctx.fillStyle = theme.ground;
          ctx.beginPath();
          ctx.moveTo(border, height * 0.55);
          ctx.lineTo(width * 0.4, height * 0.48);
          ctx.lineTo(width * 0.8, height * 0.56);
          ctx.lineTo(width - border, height * 0.52);
          ctx.lineTo(width - border, height - border);
          ctx.lineTo(border, height - border);
          ctx.closePath();
          ctx.fill();
        } else if (theme.type === 'sketch') {
          // Parchment paper with delicate charcoal / sepia linework
          ctx.fillStyle = theme.bg;
          ctx.fillRect(border, border, innerW, innerH);

          ctx.strokeStyle = theme.highlight;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(width * 0.25, height * 0.35);
          ctx.lineTo(width * 0.75, height * 0.35);
          ctx.moveTo(width * 0.3, height * 0.5);
          ctx.lineTo(width * 0.7, height * 0.5);
          ctx.moveTo(width * 0.35, height * 0.65);
          ctx.lineTo(width * 0.65, height * 0.65);
          ctx.stroke();
        } else {
          // Still life / Allegory composition
          ctx.fillStyle = theme.sky;
          ctx.fillRect(border, border, innerW, innerH * 0.45);
          ctx.fillStyle = theme.ground;
          ctx.fillRect(border, border + innerH * 0.45, innerW, innerH * 0.55);

          // Highlight centerpiece (fruit bowl, candle, goblet)
          ctx.fillStyle = theme.highlight;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.52, innerW * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        generated.push({
          canvas: offCanvas,
          width,
          height,
          type: theme.type,
        });
      });
    });

    return generated;
  }, []);

  // Generate 720 3D particles on a Fibonacci sphere
  const particles = useMemo(() => {
    const COUNT = 740;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    const baseRadius = 265; // Base radius of the 3D globe

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere distribution: evenly spaced across sphere surface
      const y = 1 - (i / (COUNT - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // Volumetric depth: 80% on outer shell, 20% slightly nested inside
      const isInner = i % 5 === 0;
      const r = isInner ? (baseRadius * 0.82 + (i % 7) * 4) : (baseRadius + ((i % 5) - 2) * 4);

      const x = Math.cos(theta) * radiusAtY * r;
      const z = Math.sin(theta) * radiusAtY * r;
      const yPos = y * r;

      items.push({
        id: i,
        x,
        y: yPos,
        z,
        spriteIdx: i % Math.max(1, SPRITE_THEMES.length * 3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.8,
      });
    }

    return items;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || sprites.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    // Interactive pointer drag controls
    const onMouseDown = (e) => {
      mouseRef.current.isDown = true;
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      mouseRef.current.mouseX = mouseX;
      mouseRef.current.mouseY = mouseY;

      if (mouseRef.current.isDown) {
        const deltaX = e.clientX - mouseRef.current.prevX;
        const deltaY = e.clientY - mouseRef.current.prevY;
        mouseRef.current.velX = deltaX * 0.004;
        mouseRef.current.velY = deltaY * 0.004;
        mouseRef.current.rotY += mouseRef.current.velX;
        mouseRef.current.rotX -= mouseRef.current.velY;
        mouseRef.current.prevX = e.clientX;
        mouseRef.current.prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        mouseRef.current.isDown = true;
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (mouseRef.current.isDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - mouseRef.current.prevX;
        const deltaY = e.touches[0].clientY - mouseRef.current.prevY;
        mouseRef.current.velX = deltaX * 0.005;
        mouseRef.current.velY = deltaY * 0.005;
        mouseRef.current.rotY += mouseRef.current.velX;
        mouseRef.current.rotX -= mouseRef.current.velY;
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Main 3D render loop
    const render = () => {
      time += 0.016;

      // Ensure canvas sizing matches display pixels
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Physics damping & continuous elegant ambient rotation
      if (!mouseRef.current.isDown) {
        mouseRef.current.velX *= 0.94;
        mouseRef.current.velY *= 0.94;
        mouseRef.current.rotY += mouseRef.current.velX + 0.0022; // subtle continuous spin
        mouseRef.current.rotX += mouseRef.current.velY;
      }

      // Restrict pitch angle to avoid flipping upside down
      mouseRef.current.rotX = Math.max(-0.85, Math.min(0.85, mouseRef.current.rotX));

      const curRotY = mouseRef.current.rotY;
      const curRotX = mouseRef.current.rotX;

      const cosY = Math.cos(curRotY);
      const sinY = Math.sin(curRotY);
      const cosX = Math.cos(curRotX);
      const sinX = Math.sin(curRotX);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const fov = 680;

      // Project all 3D points
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Micro-flutter to simulate organic suspension
        const flutter = Math.sin(time * p.wobbleSpeed + p.wobble) * 1.5;
        const px = p.x;
        const py = p.y + flutter;
        const pz = p.z;

        // Y-axis rotation
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        // X-axis rotation
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective scale & projection
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        projected.push({
          p,
          projX,
          projY,
          projZ: z2,
          scale,
        });
      }

      // Sort by depth (back to front) for accurate 3D layering
      projected.sort((a, b) => a.projZ - b.projZ);

      // Check hover proximity on front-facing tiles
      const mouseX = mouseRef.current.mouseX;
      const mouseY = mouseRef.current.mouseY;
      let closestHoverIdx = -1;
      let minDistance = 22;

      for (let i = projected.length - 1; i >= Math.floor(projected.length * 0.5); i--) {
        const item = projected[i];
        const dist = Math.hypot(mouseX - item.projX, mouseY - item.projY);
        if (dist < minDistance) {
          closestHoverIdx = item.p.id;
          minDistance = dist;
          break;
        }
      }
      mouseRef.current.hoveredTileIdx = closestHoverIdx;

      // Render each artwork tile
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const { p, projX, projY, projZ, scale } = item;
        const sprite = sprites[p.spriteIdx % sprites.length];
        if (!sprite) continue;

        const isHovered = p.id === closestHoverIdx;
        const hoverScale = isHovered ? 1.75 : 1.0;

        const w = sprite.width * scale * hoverScale * 0.72;
        const h = sprite.height * scale * hoverScale * 0.72;
        const x = projX - w * 0.5;
        const y = projY - h * 0.5;

        // Depth cueing: back tiles are softly translucent, front tiles are 100% crisp
        const depthNorm = (projZ + 270) / 540; // 0 (back) to 1 (front)
        const alpha = isHovered ? 1.0 : Math.min(1.0, Math.max(0.22, 0.2 + depthNorm * 0.8));

        ctx.globalAlpha = alpha;

        // Realistic museum drop shadow for foreground tiles
        if (projZ > -50 || isHovered) {
          ctx.shadowColor = isHovered ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.14)';
          ctx.shadowBlur = isHovered ? 14 : 5 * scale;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = isHovered ? 6 : 2.5 * scale;
        } else {
          ctx.shadowColor = 'transparent';
        }

        // Draw miniature artwork tile
        ctx.drawImage(sprite.canvas, x, y, w, h);

        // Highlight ring if hovered
        if (isHovered) {
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [particles, sprites]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full flex flex-col items-center justify-center py-6 sm:py-10 select-none overflow-visible"
      aria-label="Interactive 3D Artwork Provenance Globe"
    >
      {/* ── 3D ARTWORK GLOBE (CENTERED IN VIEWPORT) ── */}
      <div className="relative w-full max-w-[760px] h-[580px] sm:h-[680px] lg:h-[740px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="size-full block cursor-grab active:cursor-grabbing touch-none select-none"
          title="Click and drag to spin the artwork globe"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Ambient subtle center glow behind globe */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="size-[380px] sm:size-[480px] rounded-full bg-radial from-amber-500/[0.04] via-zinc-500/[0.02] to-transparent blur-3xl" />
        </div>
      </div>
    </div>
  );
}
