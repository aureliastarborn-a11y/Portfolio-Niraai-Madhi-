import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layers, Compass, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

// ── PATRONS DATA (10 Historic Donors) ──
const PATRONS = [
  { id: 'bliss', name: 'Lizzie P. Bliss', subtitle: 'Collector, Founder of MoMA', x: -140, y: -190, z: 20 },
  { id: 'gilcrease', name: 'Thomas Gilcrease', subtitle: 'Oil Magnate, Founder of Gilcrease Museum', x: 0, y: -230, z: -30 },
  { id: 'frick', name: 'Henry C. Frick', subtitle: 'Industrialist, Founder of Frick Collection', x: 150, y: -190, z: 15 },
  { id: 'hirshhorn', name: 'Joseph H. Hirshhorn', subtitle: 'Financier, Founding Donor of Hirshhorn Museum', x: 230, y: -50, z: -20 },
  { id: 'mellon', name: 'Andrew W. Mellon', subtitle: 'Financier, Founding Donor of National Gallery of Art', x: 210, y: 120, z: 25 },
  { id: 'kress', name: 'Samuel H. Kress', subtitle: 'Businessman, Founding Donor of National Gallery of Art', x: 130, y: 220, z: -15 },
  { id: 'clark', name: 'Robert Sterling Clark', subtitle: 'Businessman, Founder of Clark Art Institute', x: -10, y: 245, z: 20 },
  { id: 'ryan', name: 'Clendenin James Ryan Jr', subtitle: 'Publisher, Donor', x: -140, y: 210, z: -25 },
  { id: 'simon', name: 'Norton W. Simon', subtitle: 'Businessman, Founder of Norton Simon Museum', x: -210, y: 100, z: 15 },
  { id: 'marx', name: 'Samuel A. Marx', subtitle: 'Architect, Donor', x: -220, y: -70, z: -10 },
];

// ── MIDDLEMEN / DEALERS DATA (5 Historical Intermediaries) ──
const MIDDLEMEN = [
  { id: 'lebrun', name: 'Jean-Baptiste-Pierre Lebrun', subtitle: 'French painter, art critic, and dealer', x: 0, y: -210, z: 20 },
  { id: 'paillet', name: 'Alexandre-Joseph Paillet', subtitle: 'French auctioneer and art dealer', x: 200, y: -50, z: -25 },
  { id: 'christie', name: 'James Christie', subtitle: "British auctioneer, Founder of Christie's", x: 130, y: 190, z: 30 },
  { id: 'phillips', name: 'Harry Philips', subtitle: 'British auctioneer, Founder of Phillips auction house', x: -130, y: 190, z: -20 },
  { id: 'schley', name: 'Philippus van der Schley', subtitle: 'Dutch engraver and art dealer', x: -200, y: -50, z: 15 },
];

// ── STORY PHASES ──
const STAGES = [
  {
    tag: 'Phase 01 • Patrons & Donors',
    heading: 'In addition to acquiring paintings through purchase, museums are often supported by donations from individual patrons.',
    subtext: 'Exploring the trajectories of cultural objects donated by 10 prominent patrons whose collections established the bedrock of major international galleries.',
    clusterKey: 'patrons',
  },
  {
    tag: 'Phase 02 • Intermediaries & Dealers',
    heading: 'Additionally, middlemen like Le Brun and other historical actors have had an even greater impact on the trajectories of those artworks worldwide.',
    subtext: 'Tracking auction houses, connoisseurs, and dealer networks that facilitated the transatlantic circulation of masterworks across borders.',
    clusterKey: 'middlemen',
  },
  {
    tag: 'Phase 03 • Global Provenance Index',
    heading: 'GPI data reveals the scale and complexity of their collective influence.',
    subtext: 'Visualizing thousands of interconnected provenance records united into a global multi-dimensional archive of historical art movements.',
    clusterKey: 'sphere',
  }
];

// Pre-generated miniature painting styles (colors simulating classical oil paintings)
const ART_PALETTES = [
  { bg: '#3a2e2b', border: '#b89f72', inner: '#684d3b', accent: '#d4af37' },
  { bg: '#2b3638', border: '#9fa8a3', inner: '#415254', accent: '#7fa498' },
  { bg: '#423326', border: '#c49a6c', inner: '#6b4f38', accent: '#e8c89b' },
  { bg: '#232832', border: '#8b9bb4', inner: '#39465a', accent: '#6280a8' },
  { bg: '#3d2524', border: '#b57973', inner: '#663937', accent: '#d98b82' },
  { bg: '#2a3328', border: '#8da684', inner: '#44563f', accent: '#9ec092' },
  { bg: '#44382e', border: '#d1aa75', inner: '#745b46', accent: '#f5cf95' },
  { bg: '#1c1f24', border: '#7a828e', inner: '#323742', accent: '#5c667a' },
  { bg: '#483427', border: '#c79b69', inner: '#704f38', accent: '#e4b684' },
  { bg: '#31293a', border: '#a593bd', inner: '#4d405d', accent: '#c4b3de' },
];

export default function TracingArtProvenance() {
  const [currentStage, setCurrentStage] = useState(0);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);

  // Mouse rotation control
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });
  const animFrameRef = useRef(null);

  // Particle data generation
  const particles = useMemo(() => {
    const TOTAL_PARTICLES = 340;
    const items = [];

    // Golden ratio for Fibonacci sphere distribution
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const palette = ART_PALETTES[i % ART_PALETTES.length];
      const w = 9 + (i % 5) * 2; // 9px to 17px
      const h = Math.round(w * (1.15 + ((i % 4) * 0.1)));

      // 1. Patrons cluster target
      const patronIdx = i % PATRONS.length;
      const patron = PATRONS[patronIdx];
      // Scatter organically around patron hub
      const pAngle = Math.random() * Math.PI * 2;
      const pRadius = 18 + Math.random() * 48;
      const patronX = patron.x + Math.cos(pAngle) * pRadius;
      const patronY = patron.y + Math.sin(pAngle) * pRadius;
      const patronZ = patron.z + (Math.random() - 0.5) * 60;

      // 2. Middlemen cluster target
      const middleIdx = i % MIDDLEMEN.length;
      const middle = MIDDLEMEN[middleIdx];
      const mAngle = Math.random() * Math.PI * 2;
      const mRadius = 22 + Math.random() * 56;
      const middleX = middle.x + Math.cos(mAngle) * mRadius;
      const middleY = middle.y + Math.sin(mAngle) * mRadius;
      const middleZ = middle.z + (Math.random() - 0.5) * 70;

      // 3. Dense 3D Sphere target (Fibonacci lattice)
      const sphereRadius = 185 + (i % 3) * 12;
      const y = 1 - (i / (TOTAL_PARTICLES - 1)) * 2; // from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const sphereX = Math.cos(theta) * radiusAtY * sphereRadius;
      const sphereY = y * sphereRadius;
      const sphereZ = Math.sin(theta) * radiusAtY * sphereRadius;

      items.push({
        id: i,
        w,
        h,
        palette,
        patronId: patron.id,
        middleId: middle.id,
        // Current actual 3D positions
        x: patronX,
        y: patronY,
        z: patronZ,
        // Target slots for stages
        targetPatron: { x: patronX, y: patronY, z: patronZ },
        targetMiddle: { x: middleX, y: middleY, z: middleZ },
        targetSphere: { x: sphereX, y: sphereY, z: sphereZ },
        // Visual wobble
        wobbleSpeed: 0.8 + Math.random() * 1.2,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    return items;
  }, []);

  // Handle scroll spy to automatically progress stages cleanly
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the section enters viewport
      if (rect.top <= windowHeight * 0.55 && rect.bottom >= windowHeight * 0.3) {
        const totalHeight = rect.height;
        const progress = Math.min(1, Math.max(0, (windowHeight * 0.55 - rect.top) / totalHeight));

        if (progress < 0.35) {
          setCurrentStage(0);
        } else if (progress < 0.70) {
          setCurrentStage(1);
        } else {
          setCurrentStage(2);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // WebGL / Canvas rendering loop with 3D projection & interactive rotation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotY = 0;
    let rotX = 0;
    let time = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        mouseRef.current.targetX = nx * 0.45;
        mouseRef.current.targetY = ny * 0.35;
        mouseRef.current.isHovering = true;
      } else {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
        mouseRef.current.isHovering = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      time += 0.016;

      // Handle canvas resolution
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

      // Smooth mouse camera interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Continuous subtle ambient spin (faster in sphere phase)
      const ambientSpinSpeed = currentStage === 2 ? 0.0035 : 0.0012;
      rotY += ambientSpinSpeed;
      const curRotY = rotY + mouseRef.current.x;
      const curRotX = mouseRef.current.y;

      const cosY = Math.cos(curRotY);
      const sinY = Math.sin(curRotY);
      const cosX = Math.cos(curRotX);
      const sinX = Math.sin(curRotX);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const fov = 520;

      // 1. Update particles target and move toward it
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Choose target based on currentStage
        let target;
        if (currentStage === 0) target = p.targetPatron;
        else if (currentStage === 1) target = p.targetMiddle;
        else target = p.targetSphere;

        // Micro-flutter
        const flutterX = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * 2;
        const flutterY = Math.cos(time * p.wobbleSpeed + p.wobbleOffset) * 2;

        p.x += (target.x + flutterX - p.x) * 0.085;
        p.y += (target.y + flutterY - p.y) * 0.085;
        p.z += (target.z - p.z) * 0.085;

        // Rotate around Y axis
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X axis
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective scale
        const scale = fov / (fov + z2 + 200);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        // Check if highlighted
        const isHighlighted = hoveredEntity && (
          (currentStage === 0 && p.patronId === hoveredEntity) ||
          (currentStage === 1 && p.middleId === hoveredEntity)
        );

        projected.push({
          p,
          projX,
          projY,
          projZ: z2,
          scale,
          isHighlighted,
        });
      }

      // 2. Depth sort (back to front)
      projected.sort((a, b) => a.projZ - b.projZ);

      // 3. Draw connecting constellation lines if a cluster is hovered
      if (hoveredEntity && currentStage < 2) {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.lineWidth = 0.75;
        const highlighted = projected.filter(item => item.isHighlighted);
        for (let j = 0; j < highlighted.length; j += 2) {
          const a = highlighted[j];
          const b = highlighted[(j + 1) % highlighted.length];
          ctx.beginPath();
          ctx.moveTo(a.projX, a.projY);
          ctx.lineTo(b.projX, b.projY);
          ctx.stroke();
        }
      }

      // 4. Render miniature artwork tiles
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const { p, projX, projY, scale, isHighlighted } = item;

        const w = p.w * scale * (isHighlighted ? 1.4 : 1.0);
        const h = p.h * scale * (isHighlighted ? 1.4 : 1.0);
        const x = projX - w / 2;
        const y = projY - h / 2;

        const baseAlpha = Math.min(1, Math.max(0.2, (scale - 0.4) * 1.5));
        const alpha = isHighlighted ? 1.0 : (hoveredEntity ? baseAlpha * 0.35 : baseAlpha);

        ctx.globalAlpha = alpha;

        // Drop shadow for 3D card elevation
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = isHighlighted ? 8 : 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;

        // Card Frame / Bevel
        ctx.fillStyle = isHighlighted ? '#e6c875' : p.palette.border;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 1.5);
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Inner Artwork Canvas / Miniature Oil Painting
        const borderInset = Math.max(1, 1.2 * scale);
        ctx.fillStyle = p.palette.bg;
        ctx.beginPath();
        ctx.roundRect(x + borderInset, y + borderInset, w - borderInset * 2, h - borderInset * 2, 1);
        ctx.fill();

        // Brushstroke / Landscape / Portrait color accent
        ctx.fillStyle = p.palette.inner;
        ctx.fillRect(x + borderInset * 1.5, y + h * 0.45, w - borderInset * 3, h * 0.4);

        // Gold Leaf Highlight dot
        if (w > 6) {
          ctx.fillStyle = isHighlighted ? '#fff' : p.palette.accent;
          ctx.fillRect(x + w * 0.3, y + h * 0.25, Math.max(1, w * 0.2), Math.max(1, h * 0.18));
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [particles, currentStage, hoveredEntity]);

  const activeStage = STAGES[currentStage];
  const activeEntities = currentStage === 0 ? PATRONS : currentStage === 1 ? MIDDLEMEN : [];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full my-8 scroll-mt-24"
      aria-label="Getty Provenance Index Tracing Art Experience"
    >
      <div className="rounded-3xl border border-black/[0.08] bg-white/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {/* ── TOP BAR: METADATA & STAGE PILLS ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 sm:px-10 py-5 border-b border-black/[0.06] bg-zinc-50/60 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Getty Provenance Index
            </span>
            <span className="text-zinc-300">·</span>
            <span className="font-mono text-xs text-zinc-500">
              Tracing Art Interactive
            </span>
          </div>

          {/* Interactive Phase Selectors */}
          <div className="flex items-center gap-1.5 bg-black/[0.04] p-1 rounded-full text-xs font-mono">
            {STAGES.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStage(idx)}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  currentStage === idx
                    ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN SHOWCASE GRID: EDITORIAL COPY (LEFT) & 3D ARTWORK CONSTELLATION (RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px]">
          
          {/* Left Column: Editorial Scrollytelling Narrative */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/[0.06]">
            <div className="space-y-6">
              {/* Phase tag badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 font-mono text-[11px] font-medium tracking-wide">
                <Compass className="size-3 text-amber-600" />
                <span>{activeStage.tag}</span>
              </div>

              {/* Main Headline (Getty Serif Editorial Typography) */}
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-zinc-900 leading-[1.3] font-normal tracking-tight">
                {activeStage.heading}
              </h3>

              {/* Narrative description */}
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                {activeStage.subtext}
              </p>
            </div>

            {/* Bottom Entity Chips / Quick Focus List */}
            <div className="pt-8 space-y-3">
              {activeEntities.length > 0 && (
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Hover to highlight historic clusters
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {activeEntities.map((ent) => (
                      <button
                        key={ent.id}
                        type="button"
                        onMouseEnter={() => setHoveredEntity(ent.id)}
                        onMouseLeave={() => setHoveredEntity(null)}
                        onClick={() => setHoveredEntity(prev => prev === ent.id ? null : ent.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-sans transition-all duration-150 cursor-pointer ${
                          hoveredEntity === ent.id
                            ? 'bg-zinc-900 text-white shadow-xs scale-105'
                            : 'bg-zinc-100/90 hover:bg-zinc-200/80 text-zinc-700 border border-black/[0.04]'
                        }`}
                        title={ent.subtitle}
                      >
                        {ent.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStage === 2 && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-black/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-700 font-semibold">
                    <Sparkles className="size-3.5 text-amber-600" />
                    <span>Scale & Interconnectivity</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Over 4.5 million archival records, inventory entries, and auction sale catalogues unified to map the social life of art.
                  </p>
                </div>
              )}

              {/* Prev / Next controls */}
              <div className="flex items-center justify-between pt-2 text-xs font-mono text-zinc-500">
                <button
                  type="button"
                  onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
                  disabled={currentStage === 0}
                  className="flex items-center gap-1 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="size-3.5" /> Previous Phase
                </button>
                <span className="text-zinc-400">0{currentStage + 1} / 03</span>
                <button
                  type="button"
                  onClick={() => setCurrentStage(prev => Math.min(2, prev + 1))}
                  disabled={currentStage === 2}
                  className="flex items-center gap-1 hover:text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next Phase <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Miniature Artwork Constellation Canvas */}
          <div className="lg:col-span-7 relative bg-gradient-to-b from-white via-zinc-50/50 to-white flex items-center justify-center overflow-hidden min-h-[420px] lg:min-h-full">
            
            {/* Interactive Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
              style={{ width: '100%', height: '100%', minHeight: '440px' }}
            />

            {/* Overlay hint */}
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-black/[0.08] shadow-xs text-[10.5px] font-mono text-zinc-500 pointer-events-none select-none">
              Drag / Move cursor to tilt 3D constellation
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

