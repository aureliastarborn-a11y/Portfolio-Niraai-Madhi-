import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// ── 1. HISTORIC PATRONS (10 Museum Founders & Donors) ──
const PATRONS = [
  { id: 'gilcrease', name: 'Thomas Gilcrease', subtitle: 'Oil Magnate, Founder of Gilcrease Museum', angle: -Math.PI * 0.50, dist: 250, labelOffset: { x: 0, y: -45 } },
  { id: 'bliss', name: 'Lizzie P. Bliss', subtitle: 'Collector, Founder of MoMA', angle: -Math.PI * 0.72, dist: 240, labelOffset: { x: -40, y: -35 } },
  { id: 'frick', name: 'Henry C. Frick', subtitle: 'Industrialist, Founder of Frick Collection', angle: -Math.PI * 0.28, dist: 245, labelOffset: { x: 40, y: -35 } },
  { id: 'hirshhorn', name: 'Joseph H. Hirschorn', subtitle: 'Financier, Founding Donor of Hirshhorn Museum', angle: 0.05, dist: 260, labelOffset: { x: 50, y: 0 } },
  { id: 'mellon', name: 'Andrew W. Mellon', subtitle: 'Financier, Founding Donor of National Gallery of Art', angle: Math.PI * 0.22, dist: 260, labelOffset: { x: 50, y: 25 } },
  { id: 'kress', name: 'Samuel H. Kress', subtitle: 'Businessman, Founding Donor of National Gallery of Art', angle: Math.PI * 0.42, dist: 265, labelOffset: { x: 30, y: 40 } },
  { id: 'clark', name: 'Robert Sterling Clark', subtitle: 'Businessman, Founder of Clark Art Institute', angle: Math.PI * 0.58, dist: 255, labelOffset: { x: 0, y: 45 } },
  { id: 'ryan', name: 'Clendenin James Ryan Jr', subtitle: 'Publisher, Donor', angle: Math.PI * 0.76, dist: 255, labelOffset: { x: -30, y: 40 } },
  { id: 'simon', name: 'Norton W. Simon', subtitle: 'Businessman, Founder of Norton Simon Museum', angle: Math.PI * 0.96, dist: 260, labelOffset: { x: -50, y: 20 } },
  { id: 'marx', name: 'Samuel A. Marx', subtitle: 'Architect, Donor', angle: -Math.PI * 0.88, dist: 250, labelOffset: { x: -50, y: 0 } },
];

// ── 2. HISTORIC MIDDLEMEN (5 Art Dealers & Auctioneers) ──
const MIDDLEMEN = [
  { id: 'lebrun', name: 'Jean-Baptiste-Pierre Lebrun', subtitle: 'French painter, art critic, and dealer', angle: -Math.PI * 0.50, dist: 230, labelOffset: { x: 0, y: -45 } },
  { id: 'paillet', name: 'Alexandre-Joseph Paillet', subtitle: 'French auctioneer and art dealer', angle: -0.05, dist: 240, labelOffset: { x: 45, y: 0 } },
  { id: 'christie', name: 'James Christie', subtitle: "British auctioneer, Founder of Christie's auction house", angle: Math.PI * 0.38, dist: 240, labelOffset: { x: 30, y: 40 } },
  { id: 'phillips', name: 'Harry Philips', subtitle: 'British auctioneer, Founder of Phillips auction house', angle: Math.PI * 0.62, dist: 240, labelOffset: { x: -30, y: 40 } },
  { id: 'schley', name: 'Philippus van der Schley', subtitle: 'Dutch engraver and art dealer', angle: Math.PI * 0.98, dist: 240, labelOffset: { x: -45, y: 0 } },
];

// ── 3. EDITORIAL NARRATIVE PHASES (Exact text from Getty Tracing Art) ──
const PHASES = [
  {
    step: 0,
    headline: 'In addition to acquiring paintings through purchase, museums are often supported by donations from individual patrons.',
    subtext: 'Exploring the trajectories of artworks donated by prominent patrons whose collections established the bedrock of major international galleries.',
  },
  {
    step: 1,
    headline: 'Additionally, middlemen like Le Brun and other historical actors have had an even greater impact on the trajectories of those artworks worldwide.',
    subtext: 'Tracking auction houses, connoisseurs, and dealer networks that facilitated the transatlantic circulation of masterworks across borders.',
  },
  {
    step: 2,
    headline: 'GPI data reveals the scale and complexity of their collective influence.',
    subtext: 'Visualizing thousands of interconnected provenance records united into a global multi-dimensional archive of historical art movements.',
  },
];

// Classical artwork color themes for generating miniature painting sprites
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

export default function TracingArtExperience() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Active stage (0: Patrons, 1: Middlemen, 2: Globe)
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic mouse & rotation state
  const stateRef = useRef({
    mouseNormX: 0,
    mouseNormY: 0,
    ambientRotY: 0.15,
    ambientRotX: -0.04,
    currentRotY: 0.15,
    currentRotX: -0.04,
    targetStep: 0,
    stepTransition: 0, // 0 to 2 continuous interpolation
    rawScrollProgress: 0,
    smoothScrollProgress: 0,
    globeSpread: 1.0, // 1.0 = closed, up to 2.5 = spread open
  });

  // 1. Generate high-resolution pre-rendered miniature artwork sprites
  const sprites = useMemo(() => {
    if (typeof document === 'undefined') return [];

    const generated = [];
    const dpr = 2; // High-res offscreen stamp

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

        // Painting composition
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

  // 2. Generate ~780 particles with target positions for:
  // - State 0: Patrons clusters
  // - State 1: Middlemen clusters
  // - State 2: 3D Fibonacci Globe
  const particles = useMemo(() => {
    const COUNT = 780;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < COUNT; i++) {
      // ── Target 0: Patrons cluster
      const patronIdx = i % PATRONS.length;
      const patron = PATRONS[patronIdx];
      const pAngle = Math.random() * Math.PI * 2;
      const pRadius = 14 + Math.random() * 46;
      const target0X = Math.cos(patron.angle) * patron.dist + Math.cos(pAngle) * pRadius;
      const target0Y = Math.sin(patron.angle) * patron.dist + Math.sin(pAngle) * pRadius;
      const target0Z = (Math.random() - 0.5) * 80;

      // ── Target 1: Middlemen cluster
      const middleIdx = i % MIDDLEMEN.length;
      const middle = MIDDLEMEN[middleIdx];
      const mAngle = Math.random() * Math.PI * 2;
      const mRadius = 16 + Math.random() * 52;
      const target1X = Math.cos(middle.angle) * middle.dist + Math.cos(mAngle) * mRadius;
      const target1Y = Math.sin(middle.angle) * middle.dist + Math.sin(mAngle) * mRadius;
      const target1Z = (Math.random() - 0.5) * 80;

      // ── Target 2: 3D Fibonacci Sphere (Globe)
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const isInner = i % 5 === 0;
      const sphereR = isInner ? (210 + (i % 7) * 4) : (255 + ((i % 5) - 2) * 4);
      const nx = Math.cos(theta) * radiusAtY;
      const ny = y;
      const nz = Math.sin(theta) * radiusAtY;
      const target2X = nx * sphereR;
      const target2Y = ny * sphereR;
      const target2Z = nz * sphereR;

      items.push({
        id: i,
        // Current actual position in 3D
        x: target0X,
        y: target0Y,
        z: target0Z,
        nx,
        ny,
        nz,
        target0: { x: target0X, y: target0Y, z: target0Z },
        target1: { x: target1X, y: target1Y, z: target1Z },
        target2: { x: target2X, y: target2Y, z: target2Z },
        spriteIdx: i % Math.max(1, SPRITE_THEMES.length * 3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.6 + Math.random() * 0.8,
      });
    }

    return items;
  }, []);

  // 3. Generate 115 floating hollow background frames (Parallax field)
  const bgFrames = useMemo(() => {
    const COUNT = 120;
    const items = [];

    for (let i = 0; i < COUNT; i++) {
      const u = (i * 1.6180339887) % 1;
      const v = ((i + 0.3819) * 2.7182818) % 1;

      const type = i % 3;
      let w = 42;
      let h = 54;
      if (type === 0) {
        w = 54 + (i % 6) * 6;
        h = 36 + (i % 4) * 5;
      } else if (type === 1) {
        w = 38 + (i % 4) * 5;
        h = 52 + (i % 6) * 6;
      } else {
        w = 46 + (i % 5) * 4;
        h = w;
      }

      // Parallax depth (0.35 to 1.35)
      const depth = 0.35 + ((i % 7) / 6) * 1.0;
      const alpha = 0.055 + (depth / 1.35) * 0.045;

      items.push({
        id: i,
        u,
        v,
        w,
        h,
        depth,
        alpha,
      });
    }

    return items;
  }, []);

  // Handle smooth scroll-spy between the 3 narrative phases
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section total height minus one viewport
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
      setScrollProgress(rawProgress);
      stateRef.current.rawScrollProgress = rawProgress;

      let step = 0;
      if (rawProgress < 0.35) {
        step = 0;
      } else if (rawProgress < 0.70) {
        step = 1;
      } else {
        step = 2;
      }

      setActiveStep(step);
      stateRef.current.targetStep = step;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific step when clicking dot navigator
  const scrollToStep = useCallback((stepIdx) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollable = rect.height - windowHeight;
    const targetScrollY = window.scrollY + rect.top + (stepIdx / 2) * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }, []);

  // Main 3D render loop with smooth morphing, parallax background, and mouse response
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || sprites.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let time = 0;

    const handleWindowMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      stateRef.current.mouseNormX = normX;
      stateRef.current.mouseNormY = normY;
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });

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

      // Continuous ambient rotation
      stateRef.current.ambientRotY += 0.0016;

      // Smooth camera interpolation following mouse
      const targetRotY = stateRef.current.ambientRotY + stateRef.current.mouseNormX * 0.45;
      const targetRotX = -stateRef.current.mouseNormY * 0.35;

      stateRef.current.currentRotY += (targetRotY - stateRef.current.currentRotY) * 0.06;
      stateRef.current.currentRotX += (targetRotX - stateRef.current.currentRotX) * 0.06;

      // Smooth continuous transition between steps (0 -> 1 -> 2)
      stateRef.current.stepTransition += (stateRef.current.targetStep - stateRef.current.stepTransition) * 0.075;
      const st = stateRef.current.stepTransition;

      // Smoothly interpolate scroll progress for globe spread & close physics
      stateRef.current.smoothScrollProgress += (stateRef.current.rawScrollProgress - stateRef.current.smoothScrollProgress) * 0.085;
      const sp = stateRef.current.smoothScrollProgress;

      // ── SPREAD OPEN ON SCROLL TO GLOBE, CLOSE AFTER FULL SCROLL ──
      // While scrolling into Phase 2 (Globe, sp: 0.60 to 0.85): Globe blooms and spreads open!
      // After full scroll (sp: 0.85 to 1.00): Globe contracts and closes tight!
      let targetSpread = 1.0;
      if (sp > 0.60) {
        const globeT = Math.min(1, Math.max(0, (sp - 0.60) / 0.40));
        // Sine bell: peaks at t ~ 0.5 (halfway into globe scroll), returns to 0 at t = 1.0 (full scroll)
        targetSpread = 1.0 + Math.sin(globeT * Math.PI) * 1.55;
      }
      stateRef.current.globeSpread += (targetSpread - stateRef.current.globeSpread) * 0.085;
      const spread = stateRef.current.globeSpread;

      const curRotY = stateRef.current.currentRotY;
      const curRotX = stateRef.current.currentRotX;

      const cosY = Math.cos(curRotY);
      const sinY = Math.sin(curRotY);
      const cosX = Math.cos(curRotX);
      const sinX = Math.sin(curRotX);

      // Center of constellation:
      // In Phase 0 & 1: width * 0.58 (leaves room for left editorial text)
      // In Phase 2: smoothly centers to width * 0.50!
      const isMobile = width < 900;
      const centerRatio = isMobile ? 0.5 : (st <= 1.0 ? 0.58 : 0.58 - (st - 1.0) * 0.08);
      const centerX = width * centerRatio;
      const centerY = height * 0.5;

      // ── 1. RENDER BACKGROUND HOLLOW PICTURE FRAMES (3D PARALLAX FIELD) ──
      ctx.lineWidth = 1;

      for (let i = 0; i < bgFrames.length; i++) {
        const frame = bgFrames[i];
        
        // Multi-depth parallax offset
        const parallaxX = (curRotY * 110 + stateRef.current.mouseNormX * 45) * frame.depth;
        const parallaxY = (curRotX * 90 + stateRef.current.mouseNormY * 35) * frame.depth;

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

      // ── 2. RENDER 3D ARTWORK CONSTELLATION & MORPHING GLOBE ──
      const fov = 680;
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Morphing calculation between target0 (Patrons), target1 (Middlemen), and target2 (Globe)
        let tx, ty, tz;
        if (st <= 1.0) {
          // Transition between Patrons (0) and Middlemen (1)
          const t = Math.max(0, Math.min(1, st));
          tx = p.target0.x + (p.target1.x - p.target0.x) * t;
          ty = p.target0.y + (p.target1.y - p.target0.y) * t;
          tz = p.target0.z + (p.target1.z - p.target0.z) * t;
        } else {
          // Transition between Middlemen (1) and Globe (2)
          const t = Math.max(0, Math.min(1, st - 1.0));

          // When spread > 1.0: globe spreads open organically along radial unit vectors (nx, ny, nz)
          // When spread = 1.0 (after full scroll): globe closes tightly into solid sphere
          const spreadDist = (spread - 1.0) * (260 + (p.id % 5) * 20);
          const spreadTarget2X = p.target2.x + p.nx * spreadDist;
          const spreadTarget2Y = p.target2.y + p.ny * spreadDist;
          const spreadTarget2Z = p.target2.z + p.nz * spreadDist;

          tx = p.target1.x + (spreadTarget2X - p.target1.x) * t;
          ty = p.target1.y + (spreadTarget2Y - p.target1.y) * t;
          tz = p.target1.z + (spreadTarget2Z - p.target1.z) * t;
        }

        // Micro-flutter
        const flutter = Math.sin(time * p.wobbleSpeed + p.wobble) * 1.5;

        // Smooth physical move towards target
        p.x += (tx - p.x) * 0.085;
        p.y += (ty + flutter - p.y) * 0.085;
        p.z += (tz - p.z) * 0.085;

        // Y-axis rotation
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // X-axis rotation
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective projection
        const scale = fov / (fov + z2 + 200);
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

      // Depth sort for genuine stereoscopic 3D
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

        const depthNorm = (projZ + 260) / 520;
        const alpha = Math.min(1.0, Math.max(0.25, 0.22 + depthNorm * 0.78));

        ctx.globalAlpha = alpha;

        // Subtle drop shadow on foreground tiles
        if (projZ > -40) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 4 * scale;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2 * scale;
        } else {
          ctx.shadowColor = 'transparent';
        }

        ctx.drawImage(sprite.canvas, x, y, w, h);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [particles, sprites, bgFrames]);

  const activePhase = PHASES[activeStep];

  return (
    <div
      ref={containerRef}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen select-none"
      style={{ height: '300vh' }} // 3-viewport sticky scrollytelling container
      aria-label="Getty Provenance Index Tracing Art Experience"
    >
      {/* ── STICKY FULL-SCREEN VIEWPORT ── */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        
        {/* Full-width 3D Canvas (Globe & Parallax Background Frames) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full block select-none pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        />

        {/* ── LEFT EDITORIAL COPY (EXACT GETTY SERIF TYPOGRAPHY & FADE TRANSITION) ── */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 lg:left-16 max-w-sm sm:max-w-md lg:max-w-lg z-20 pointer-events-none select-none">
          <div className="transition-all duration-700 ease-out space-y-4">
            <h2
              key={`h-${activeStep}`}
              className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-zinc-900 leading-[1.3] font-normal tracking-tight animate-fade-in"
              style={{
                fontFamily: "Georgia, 'Times New Roman', Cambria, serif",
              }}
            >
              {activePhase.headline}
            </h2>
            <p
              key={`p-${activeStep}`}
              className="text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed font-normal animate-fade-in"
            >
              {activePhase.subtext}
            </p>
          </div>
        </div>

        {/* ── RADIAL LABELS: PATRONS (PHASE 0) ── */}
        <div
          className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${
            activeStep === 0 ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {PATRONS.map((patron) => {
            // Position around constellation center
            return (
              <div
                key={patron.id}
                className="absolute flex flex-col text-center"
                style={{
                  left: `calc(58% + ${Math.cos(patron.angle) * patron.dist + patron.labelOffset.x}px)`,
                  top: `calc(50% + ${Math.sin(patron.angle) * patron.dist + patron.labelOffset.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="text-[12px] sm:text-[13px] font-sans font-medium text-zinc-800 tracking-tight whitespace-nowrap drop-shadow-xs">
                  {patron.name}
                </span>
                <span className="text-[9.5px] sm:text-[10.5px] font-sans text-zinc-500 whitespace-nowrap">
                  {patron.subtitle}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── RADIAL LABELS: MIDDLEMEN (PHASE 1) ── */}
        <div
          className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${
            activeStep === 1 ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {MIDDLEMEN.map((middle) => {
            return (
              <div
                key={middle.id}
                className="absolute flex flex-col text-center"
                style={{
                  left: `calc(58% + ${Math.cos(middle.angle) * middle.dist + middle.labelOffset.x}px)`,
                  top: `calc(50% + ${Math.sin(middle.angle) * middle.dist + middle.labelOffset.y}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span className="text-[12px] sm:text-[13px] font-sans font-medium text-zinc-800 tracking-tight whitespace-nowrap drop-shadow-xs">
                  {middle.name}
                </span>
                <span className="text-[9.5px] sm:text-[10.5px] font-sans text-zinc-500 whitespace-nowrap">
                  {middle.subtitle}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT 3-DOT SCROLLYTELLING INDICATOR (EXACT GETTY PILL NAVIGATOR) ── */}
        <div className="absolute top-1/2 -translate-y-1/2 right-5 sm:right-8 z-30 flex flex-col items-center gap-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-black/[0.08] shadow-xs">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToStep(idx)}
              className={`size-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeStep === idx
                  ? 'bg-zinc-900 scale-125'
                  : 'bg-zinc-300 hover:bg-zinc-400'
              }`}
              title={`Phase 0${idx + 1}`}
              aria-label={`Jump to Phase 0${idx + 1}`}
            />
          ))}
        </div>

        {/* Ambient bottom scroll invitation */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-[11px] font-mono text-zinc-400 select-none pointer-events-none transition-all duration-300">
          {activeStep < 2 
            ? 'Scroll to explore provenance trajectories ↓' 
            : (scrollProgress > 0.92 
                ? 'Global Provenance Sphere • Unified & Closed' 
                : 'Scroll to full completion to close globe ↓')}
        </div>

      </div>
    </div>
  );
}
