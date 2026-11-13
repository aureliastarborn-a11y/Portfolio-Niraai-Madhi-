import React, { useEffect, useRef, useMemo } from 'react';

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

  // Dynamic mouse & rotation state
  const stateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    dragVelX: 0,
    dragVelY: 0,
    ambientRotY: 0.2,
    ambientRotX: -0.05,
    mouseTargetY: 0,
    mouseTargetX: 0,
    mouseNormX: 0,
    mouseNormY: 0,
    currentRotY: 0.2,
    currentRotX: -0.05,
    hoveredTileId: -1,
  });

  // 1. Generate high-resolution pre-rendered miniature artwork sprites
  const sprites = useMemo(() => {
    if (typeof document === 'undefined') return [];

    const generated = [];
    const dpr = 2; // High-resolution offscreen canvas

    SPRITE_THEMES.forEach((theme) => {
      const aspectVariants = [
        { w: 18, h: 24 }, // Portrait
        { w: 24, h: 18 }, // Landscape
        { w: 20, h: 20 }, // Square
      ];

      aspectVariants.forEach((aspect) => {
        const offCanvas = document.createElement('canvas');
        const width = aspect.w;
        const height = aspect.h;
        offCanvas.width = width * dpr;
        offCanvas.height = height * dpr;
        const ctx = offCanvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        // Frame mount (gilded gold, antique wood, ivory)
        ctx.fillStyle = theme.frame;
        ctx.beginPath();
        ctx.roundRect(0, 0, width, height, 1.2);
        ctx.fill();

        // Inner painting canvas
        const border = 1.3;
        const innerW = width - border * 2;
        const innerH = height - border * 2;
        ctx.fillStyle = theme.bg;
        ctx.fillRect(border, border, innerW, innerH);

        // Painting content
        if (theme.type === 'portrait') {
          ctx.fillStyle = theme.sky;
          ctx.fillRect(border, border, innerW, innerH * 0.58);
          ctx.fillStyle = theme.ground;
          ctx.beginPath();
          ctx.ellipse(width * 0.5, height * 0.85, innerW * 0.44, innerH * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = theme.highlight;
          ctx.beginPath();
          ctx.ellipse(width * 0.5, height * 0.42, innerW * 0.22, innerH * 0.24, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (theme.type === 'landscape') {
          const skyGrad = ctx.createLinearGradient(0, border, 0, height * 0.55);
          skyGrad.addColorStop(0, theme.sky);
          skyGrad.addColorStop(1, theme.highlight);
          ctx.fillStyle = skyGrad;
          ctx.fillRect(border, border, innerW, innerH * 0.55);

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
          ctx.fillStyle = theme.bg;
          ctx.fillRect(border, border, innerW, innerH);
          ctx.strokeStyle = theme.highlight;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(width * 0.25, height * 0.35);
          ctx.lineTo(width * 0.75, height * 0.35);
          ctx.moveTo(width * 0.3, height * 0.5);
          ctx.lineTo(width * 0.7, height * 0.5);
          ctx.moveTo(width * 0.35, height * 0.65);
          ctx.lineTo(width * 0.65, height * 0.65);
          ctx.stroke();
        } else {
          ctx.fillStyle = theme.sky;
          ctx.fillRect(border, border, innerW, innerH * 0.45);
          ctx.fillStyle = theme.ground;
          ctx.fillRect(border, border + innerH * 0.45, innerW, innerH * 0.55);
          ctx.fillStyle = theme.highlight;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.52, innerW * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }

        generated.push({
          canvas: offCanvas,
          width,
          height,
        });
      });
    });

    return generated;
  }, []);

  // 2. Generate ~820 particles along Fibonacci sphere
  const particles = useMemo(() => {
    const COUNT = 820;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // Volumetric sphere layering
      const isInner = i % 5 === 0;
      const baseR = 1.0;
      const rMult = isInner ? (0.84 + (i % 7) * 0.02) : (0.97 + ((i % 5) - 2) * 0.015);

      const nx = Math.cos(theta) * radiusAtY * rMult;
      const nz = Math.sin(theta) * radiusAtY * rMult;
      const ny = y * rMult;

      items.push({
        id: i,
        nx,
        ny,
        nz,
        spriteIdx: i % Math.max(1, SPRITE_THEMES.length * 3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 0.8,
      });
    }

    return items;
  }, []);

  // 3. Generate 115 hollow floating background frames in 3D parallax space
  const bgFrames = useMemo(() => {
    const COUNT = 115;
    const items = [];

    // Seeded random distribution to keep stable positions
    for (let i = 0; i < COUNT; i++) {
      const u = (i * 1.6180339887) % 1;
      const v = ((i + 0.3819) * 2.7182818) % 1;

      // Aspect ratios (portrait, landscape, square)
      const type = i % 3;
      let w = 42;
      let h = 54;
      if (type === 0) { // Landscape
        w = 54 + (i % 6) * 6;
        h = 36 + (i % 4) * 5;
      } else if (type === 1) { // Portrait
        w = 38 + (i % 4) * 5;
        h = 52 + (i % 6) * 6;
      } else { // Square
        w = 46 + (i % 5) * 4;
        h = w;
      }

      // 3D Parallax depth layers (0.35 to 1.35)
      const depth = 0.35 + ((i % 7) / 6) * 1.0;
      const alpha = 0.055 + (depth / 1.35) * 0.045; // Subtle stroke alpha

      items.push({
        id: i,
        u, // 0..1 relative horizontal pos
        v, // 0..1 relative vertical pos
        w,
        h,
        depth,
        alpha,
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

    // Track mouse across the window for smooth continuous globe & background response
    const handleWindowMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      stateRef.current.mouseNormX = normX;
      stateRef.current.mouseNormY = normY;
      stateRef.current.mouseTargetY = normX * 0.65;
      stateRef.current.mouseTargetX = -normY * 0.45;

      if (stateRef.current.isDown) {
        const deltaX = e.clientX - stateRef.current.prevX;
        const deltaY = e.clientY - stateRef.current.prevY;
        stateRef.current.dragVelX = deltaX * 0.0035;
        stateRef.current.dragVelY = deltaY * 0.0035;
        stateRef.current.ambientRotY += stateRef.current.dragVelX;
        stateRef.current.ambientRotX -= stateRef.current.dragVelY;
        stateRef.current.prevX = e.clientX;
        stateRef.current.prevY = e.clientY;
      }
    };

    const handleMouseDown = (e) => {
      stateRef.current.isDown = true;
      stateRef.current.prevX = e.clientX;
      stateRef.current.prevY = e.clientY;
    };

    const handleMouseUp = () => {
      stateRef.current.isDown = false;
    };

    // Touch events for mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        stateRef.current.isDown = true;
        stateRef.current.prevX = e.touches[0].clientX;
        stateRef.current.prevY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (stateRef.current.isDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - stateRef.current.prevX;
        const deltaY = e.touches[0].clientY - stateRef.current.prevY;
        stateRef.current.dragVelX = deltaX * 0.004;
        stateRef.current.dragVelY = deltaY * 0.004;
        stateRef.current.ambientRotY += stateRef.current.dragVelX;
        stateRef.current.ambientRotX -= stateRef.current.dragVelY;
        stateRef.current.prevX = e.touches[0].clientX;
        stateRef.current.prevY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      stateRef.current.isDown = false;
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Main 3D Animation Loop
    const render = () => {
      time += 0.016;

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

      // Continuous ambient rotation + mouse following
      stateRef.current.ambientRotY += 0.0018; // smooth constant rotation

      if (!stateRef.current.isDown) {
        stateRef.current.dragVelX *= 0.94;
        stateRef.current.dragVelY *= 0.94;
        stateRef.current.ambientRotY += stateRef.current.dragVelX;
        stateRef.current.ambientRotX += stateRef.current.dragVelY;
      }

      // Smooth interpolation towards mouse orientation
      const targetY = stateRef.current.ambientRotY + stateRef.current.mouseTargetY;
      const targetX = Math.max(-0.6, Math.min(0.6, stateRef.current.ambientRotX + stateRef.current.mouseTargetX));

      stateRef.current.currentRotY += (targetY - stateRef.current.currentRotY) * 0.055;
      stateRef.current.currentRotX += (targetX - stateRef.current.currentRotX) * 0.055;

      const curRotY = stateRef.current.currentRotY;
      const curRotX = stateRef.current.currentRotX;

      const cosY = Math.cos(curRotY);
      const sinY = Math.sin(curRotY);
      const cosX = Math.cos(curRotX);
      const sinX = Math.sin(curRotX);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // ── 1. RENDER BACKGROUND HOLLOW FRAMES (PARALLAX FIELD) ──
      // The background moves inversely and in sync with the globe movement / mouse cursor
      ctx.lineWidth = 1;

      for (let i = 0; i < bgFrames.length; i++) {
        const frame = bgFrames[i];
        
        // Multi-depth parallax offset
        const parallaxX = (curRotY * 110 + stateRef.current.mouseNormX * 45) * frame.depth;
        const parallaxY = (curRotX * 90 + stateRef.current.mouseNormY * 35) * frame.depth;

        // Base screen position mapped across width & height
        let screenX = (frame.u * width - parallaxX) % width;
        let screenY = (frame.v * height - parallaxY) % height;

        if (screenX < -frame.w) screenX += width + frame.w * 2;
        if (screenX > width + frame.w) screenX -= width + frame.w * 2;
        if (screenY < -frame.h) screenY += height + frame.h * 2;
        if (screenY > height + frame.h) screenY -= height + frame.h * 2;

        ctx.strokeStyle = `rgba(0, 0, 0, ${frame.alpha})`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

        ctx.beginPath();
        ctx.rect(screenX - frame.w * 0.5, screenY - frame.h * 0.5, frame.w, frame.h);
        ctx.fill();
        ctx.stroke();
      }

      // ── 2. RENDER 3D ARTWORK GLOBE ──
      const globeRadius = Math.min(260, Math.min(width, height) * 0.35);
      const fov = 680;

      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Micro-flutter
        const flutter = Math.sin(time * p.wobbleSpeed + p.wobble) * 1.2;
        const px = p.nx * globeRadius;
        const py = p.ny * globeRadius + flutter;
        const pz = p.nz * globeRadius;

        // Y-axis rotation
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        // X-axis rotation
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective projection
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

      // Depth sort (back to front) for authentic stereoscopic layering
      projected.sort((a, b) => a.projZ - b.projZ);

      // Render miniature artwork tiles
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const { p, projX, projY, projZ, scale } = item;
        const sprite = sprites[p.spriteIdx % sprites.length];
        if (!sprite) continue;

        const w = sprite.width * scale * 0.74;
        const h = sprite.height * scale * 0.74;
        const x = projX - w * 0.5;
        const y = projY - h * 0.5;

        // Depth cueing: back tiles softly translucent, front tiles crisp & opaque
        const depthNorm = (projZ + globeRadius) / (globeRadius * 2);
        const alpha = Math.min(1.0, Math.max(0.24, 0.22 + depthNorm * 0.78));

        ctx.globalAlpha = alpha;

        // Realistic museum drop shadow for foreground tiles
        if (projZ > -40) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 5 * scale;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2.5 * scale;
        } else {
          ctx.shadowColor = 'transparent';
        }

        // Draw miniature artwork painting
        ctx.drawImage(sprite.canvas, x, y, w, h);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [particles, sprites, bgFrames]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full flex items-center justify-center my-6 select-none overflow-hidden"
      aria-label="Getty Tracing Art 3D Artwork Globe with Parallax Background"
    >
      {/* ── FULL-BLEED CANVAS CONTAINER: GLOBE IN CENTER, FLOATING FRAMES BEHIND ── */}
      <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[780px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="size-full block cursor-grab active:cursor-grabbing touch-none select-none"
          title="Move cursor to tilt globe and parallax background"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}
