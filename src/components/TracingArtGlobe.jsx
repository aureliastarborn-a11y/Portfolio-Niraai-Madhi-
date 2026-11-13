import React, { useEffect, useRef, useState, useMemo } from 'react';

// Miniature Architectural City Globe (inspired by Alex Shuper's full circular building planet)
// Features:
// 1. Full complete 360° circular miniature city globe planet with hundreds of buildings
// 2. Interactive 3D drag rotation (yaw & pitch) with inertia & smooth cursor following
// 3. Scroll-driven scatter physics: while scrolling it scatters/opens up into 3D architectural building clusters,
//    and as scrolling stops, it pulls back together and closes down into the normal solid sphere.
// 4. Photorealistic ambient depth lighting, ground shadow, and architectural blueprint accents.

const GLOBE_IMAGE_SRC = '/images/miniature-city-globe.png';

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  // Dynamic state: drag, rotation, scroll scatter physics
  const stateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    dragVelX: 0,
    dragVelY: 0,
    ambientRotY: 0.15,
    ambientRotX: -0.05,
    mouseTargetY: 0,
    mouseTargetX: 0,
    mouseNormX: 0,
    mouseNormY: 0,
    currentRotY: 0.15,
    currentRotX: -0.05,

    // Scroll-driven scatter physics
    scatterAmount: 0.0, // 0 = completely closed solid globe, 1 = fully scattered
    scrollScatterVelocity: 0.0,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
  });

  // Load the full miniature city globe image
  useEffect(() => {
    const img = new Image();
    img.src = GLOBE_IMAGE_SRC;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    if (img.complete) {
      imageRef.current = img;
      setImageLoaded(true);
    }
  }, []);

  // Generate 220 architectural building clusters distributed across the sphere
  const buildingClusters = useMemo(() => {
    const COUNT = 220;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere distribution
      const y = 1 - (i / (COUNT - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const nx = Math.cos(theta) * radiusAtY;
      const ny = y;
      const nz = Math.sin(theta) * radiusAtY;

      // Sample texture coordinates corresponding to the building cluster on the globe
      const sampleU = 0.5 + (nx * 0.44);
      const sampleV = 0.5 + (ny * 0.44);

      // Slice dimensions on the source 908x908 texture
      const sliceSize = 76 + (i % 6) * 16;
      const sx = Math.max(0, Math.min(908 - sliceSize, (sampleU * 908) - sliceSize * 0.5));
      const sy = Math.max(0, Math.min(908 - sliceSize, (sampleV * 908) - sliceSize * 0.5));

      // 3D scatter trajectory when scrolling: outward radial explosion + organic turbulence
      const scatterDist = 260 + (i % 8) * 36;
      const scatterAngle = (i * 0.78) + Math.sin(i * 1.8) * 1.5;
      const scatterX = nx * scatterDist + Math.cos(scatterAngle) * 55;
      const scatterY = ny * scatterDist + Math.sin(scatterAngle) * 55;
      const scatterZ = nz * scatterDist + ((i % 7) - 3) * 45;

      // Random tumble spin angles during scatter
      const tumbleSpeedX = ((i % 5) - 2) * 1.6;
      const tumbleSpeedY = ((i % 7) - 3) * 1.6;

      items.push({
        id: i,
        nx,
        ny,
        nz,
        sx,
        sy,
        sliceSize,
        scatterX,
        scatterY,
        scatterZ,
        tumbleSpeedX,
        tumbleSpeedY,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.6 + Math.random() * 0.8,
      });
    }

    return items;
  }, []);

  // Background subtle architectural blueprint grid marks & floating nodes
  const architecturalMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i < 24; i++) {
      marks.push({
        u: ((i * 137.5) % 100) / 100,
        v: ((i * 73.1) % 100) / 100,
        size: 14 + (i % 4) * 8,
        type: i % 3, // 0 = crosshair, 1 = dimension box, 2 = coordinate dot
        depth: 0.3 + (i % 5) * 0.18,
      });
    }
    return marks;
  }, []);

  // Scroll listener: scatter while scrolling, smoothly close back down when scroll stops
  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = Math.abs(currentY - stateRef.current.lastScrollY);
      stateRef.current.lastScrollY = currentY;

      // Check if container is near viewport
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // Only react to scroll if near viewport (-vh to 2*vh)
        if (rect.bottom > -vh * 0.5 && rect.top < vh * 1.5) {
          // Velocity-driven scatter: scrolling adds scatter burst
          stateRef.current.scrollScatterVelocity = Math.min(
            1.25,
            stateRef.current.scrollScatterVelocity + Math.min(0.75, deltaY * 0.024)
          );
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D Canvas render loop & mouse/touch dragging
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const handleWindowMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      stateRef.current.mouseNormX = normX;
      stateRef.current.mouseNormY = normY;
      stateRef.current.mouseTargetY = normX * 0.45;
      stateRef.current.mouseTargetX = -normY * 0.35;

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

    // Touch support for mobile devices
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

      if (width <= 0 || height <= 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Continuous ambient rotation + mouse following
      stateRef.current.ambientRotY += 0.0016;

      if (!stateRef.current.isDown) {
        stateRef.current.dragVelX *= 0.94;
        stateRef.current.dragVelY *= 0.94;
        stateRef.current.ambientRotY += stateRef.current.dragVelX;
        stateRef.current.ambientRotX += stateRef.current.dragVelY;
      }

      // Smooth interpolation towards mouse target orientation
      const targetY = stateRef.current.ambientRotY + stateRef.current.mouseTargetY;
      const targetX = Math.max(-0.55, Math.min(0.55, stateRef.current.ambientRotX + stateRef.current.mouseTargetX));

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

      // ── SCATTER PHYSICS: OPEN UP WHILE SCROLLING, CLOSE DOWN WHEN STOPPED ──
      // Rapid decay of scroll scatter velocity when scrolling slows/stops
      stateRef.current.scrollScatterVelocity *= 0.88;

      // Interpolate scatterAmount towards scrollScatterVelocity
      stateRef.current.scatterAmount += (stateRef.current.scrollScatterVelocity - stateRef.current.scatterAmount) * 0.095;

      let scatter = stateRef.current.scatterAmount;
      if (scatter < 0.005) scatter = 0;

      // ── 1. RENDER BACKGROUND ARCHITECTURAL MARKS (PARALLAX DEPTH) ──
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.lineWidth = 1;

      for (let i = 0; i < architecturalMarks.length; i++) {
        const mark = architecturalMarks[i];
        const parallaxX = (curRotY * 60 + stateRef.current.mouseNormX * 25) * mark.depth;
        const parallaxY = (curRotX * 50 + stateRef.current.mouseNormY * 20) * mark.depth;

        let sx = (mark.u * width - parallaxX) % width;
        let sy = (mark.v * height - parallaxY) % height;
        if (sx < 0) sx += width;
        if (sy < 0) sy += height;

        if (mark.type === 0) {
          // Blueprint crosshair
          const len = mark.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - len, sy);
          ctx.lineTo(sx + len, sy);
          ctx.moveTo(sx, sy - len);
          ctx.lineTo(sx, sy + len);
          ctx.stroke();
        } else if (mark.type === 1) {
          // Dimension box
          ctx.strokeRect(sx - mark.size * 0.5, sy - mark.size * 0.5, mark.size, mark.size);
        } else {
          // Coordinate dot
          ctx.beginPath();
          ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── 2. PHOTOREALISTIC GROUND AMBIENT SHADOW ──
      const globeRadius = Math.min(270, Math.min(width, height) * 0.38);
      const shadowY = centerY + globeRadius * 1.0;
      const shadowRadius = Math.max(10, globeRadius * 1.15);
      const shadowGrad = ctx.createRadialGradient(
        centerX, shadowY, 15,
        centerX, shadowY, shadowRadius
      );
      shadowGrad.addColorStop(0, 'rgba(40, 25, 18, 0.15)');
      shadowGrad.addColorStop(0.5, 'rgba(50, 35, 25, 0.05)');
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.translate(centerX, shadowY);
      ctx.scale(1, 0.22);
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, shadowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const img = imageRef.current;

      // ── 3. RENDER THE FULL MINIATURE CITY SPHERE (SOLID NORMAL STATE) ──
      // When scrolling stops (scatter = 0), render the full high-res 3D architectural city sphere
      // As user scrolls, it smoothly opens up into building clusters
      const solidOpacity = Math.max(0, 1 - scatter * 2.8);

      if (img && solidOpacity > 0.001) {
        ctx.save();
        ctx.globalAlpha = solidOpacity;

        // Interactive 3D tilt & pitch for the solid globe
        ctx.translate(centerX, centerY);
        ctx.rotate(curRotY * 0.35);

        // Subtle 3D perspective distortion (skew & scale with pitch)
        const pitchScale = 1 - Math.abs(curRotX) * 0.06;
        ctx.scale(pitchScale, pitchScale);

        // Draw the complete 360° circular miniature city globe planet
        const drawDiameter = globeRadius * 2;
        ctx.drawImage(img, -drawDiameter * 0.5, -drawDiameter * 0.5, drawDiameter, drawDiameter);

        ctx.restore();
      }

      // ── 4. RENDER SCATTERED 3D ARCHITECTURAL BUILDING CLUSTERS (SCATTER STATE) ──
      // When scatter > 0 (during scroll), the buildings disperse radially outward in true 3D perspective!
      if (img && scatter > 0.015) {
        const clusterOpacity = Math.min(1.0, scatter * 2.5);
        const fov = 680;
        const projected = [];

        for (let i = 0; i < buildingClusters.length; i++) {
          const c = buildingClusters[i];

          // Micro flutter
          const flutter = Math.sin(time * c.wobbleSpeed + c.wobble) * 1.5;

          // Resting sphere surface position
          const normalX = c.nx * globeRadius;
          const normalY = c.ny * globeRadius;
          const normalZ = c.nz * globeRadius;

          // Outward radial scatter trajectory
          const px = normalX + c.scatterX * scatter;
          const py = normalY + flutter + c.scatterY * scatter;
          const pz = normalZ + c.scatterZ * scatter;

          // 3D Rotation (yaw around Y axis)
          const x1 = px * cosY + pz * sinY;
          const z1 = -px * sinY + pz * cosY;

          // 3D Rotation (pitch around X axis)
          const y2 = py * cosX - z1 * sinX;
          const z2 = py * sinX + z1 * cosX;

          // Behind camera clipping check (guarantees fov + z2 > 20 and scale > 0)
          if (fov + z2 <= 20) continue;

          // Perspective projection
          const scale = Math.max(0.05, fov / (fov + z2));
          const projX = centerX + x1 * scale;
          const projY = centerY + y2 * scale;

          projected.push({
            c,
            projX,
            projY,
            projZ: z2,
            scale,
          });
        }

        // Depth sort back-to-front for realistic stereoscopic layering
        projected.sort((a, b) => a.projZ - b.projZ);

        for (let i = 0; i < projected.length; i++) {
          const item = projected[i];
          const { c, projX, projY, projZ, scale } = item;

          const size = Math.max(2, c.sliceSize * scale * 0.44);
          const arcRadius = Math.max(1, size * 0.45);

          // Depth cueing: distant clusters soft, foreground clusters crisp & vibrant
          const depthNorm = (projZ + globeRadius * 1.5) / (globeRadius * 3);
          const alpha = clusterOpacity * Math.min(1.0, Math.max(0.35, 0.3 + depthNorm * 0.7));

          ctx.save();
          ctx.globalAlpha = alpha;

          // Foreground cluster drop shadow
          if (projZ > -10) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
            ctx.shadowBlur = 6 * scale;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3 * scale;
          }

          // Individual building cluster tumble during scatter
          ctx.translate(projX, projY);
          ctx.rotate((c.tumbleSpeedX * curRotY + c.tumbleSpeedY * curRotX) * scatter);

          // Clip with rounded organic building cluster boundary (eliminates harsh square edges)
          ctx.beginPath();
          ctx.arc(0, 0, arcRadius, 0, Math.PI * 2);
          ctx.clip();

          // Draw the sampled architectural building cluster
          ctx.drawImage(
            img,
            c.sx, c.sy, c.sliceSize, c.sliceSize,
            -size * 0.5, -size * 0.5, size, size
          );

          ctx.restore();
        }
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
  }, [buildingClusters, architecturalMarks, imageLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full flex items-center justify-center my-8 sm:my-12 select-none overflow-hidden"
      aria-label="Interactive 3D Miniature City Globe with Scroll Scatter and Re-assembly Physics"
    >
      {/* ── 3D MINIATURE CITY GLOBE (CENTERED IN EMPTY SPACE) ── */}
      <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[800px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="size-full block cursor-grab active:cursor-grabbing touch-none select-none"
          title="Scroll to scatter buildings or drag to rotate the miniature city globe"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Ambient subtle center glow behind globe */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="size-[440px] sm:size-[560px] rounded-full bg-radial from-amber-500/[0.05] via-zinc-400/[0.02] to-transparent blur-3xl" />
        </div>
      </div>
    </div>
  );
}
