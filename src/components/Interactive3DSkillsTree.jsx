import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Sparkles, 
  Cpu, 
  Database, 
  Code2, 
  BarChart3, 
  Globe2, 
  Wrench, 
  Rotate3d, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';

// Category icon map
const CATEGORY_ICONS = {
  'Programming': Code2,
  'AI & GenAI': Cpu,
  'Data Analysis': BarChart3,
  'Data & Visualization': BarChart3,
  'Database': Database,
  'Web Development': Globe2,
  'Tools': Wrench,
};

/**
 * 3D Rotatable Cuboid
 * Proportioned so that every word and skill is 100% visible without hiding or truncation.
 * Built with real CSS 3D perspective, 6 faces, and full drag-to-rotate in 3D.
 */
function SmallRotatableCuboid3D({ category, items, index }) {
  const Icon = CATEGORY_ICONS[category] || Sparkles;

  // 3D rotation state (degrees)
  const [rotX, setRotX] = useState(-10);
  const [rotY, setRotY] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: -10, rotY: 15 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotY,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    const newRotY = dragStartRef.current.rotY + deltaX * 0.75;
    const newRotX = Math.max(-50, Math.min(50, dragStartRef.current.rotX - deltaY * 0.75));
    setRotY(newRotY);
    setRotX(newRotX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleResetRotation = (e) => {
    e.stopPropagation();
    setRotX(-10);
    setRotY(15);
  };

  // Dimensions of the 3D cuboid: calibrated so every single word is fully visible without hiding
  const W = 175;
  const H = 165;
  const D = 44;

  return (
    <div className="relative flex flex-col items-center select-none" style={{ perspective: 1000 }}>
      {/* ── TOP STRAIGHT DROP LINE (Branches dropping down into the cuboid) ── */}
      <div className="w-full flex flex-col items-center">
        {/* Straight vertical drop line */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 32, opacity: 1 }}
          transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
          className="w-[1.5px] bg-zinc-800"
        />
        {/* Connection node on top of cuboid */}
        <div className="size-2 rounded-full bg-zinc-900 ring-2 ring-white shadow-xs -my-0.5 z-30" />
      </div>

      {/* ── 3D CUBOID BODY (DROPS DOWN FROM STRAIGHT LINE) ── */}
      <motion.div
        initial={{ opacity: 0, y: -45, scale: 0.88 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 120,
            damping: 14,
            delay: index * 0.07,
          }
        }}
        exit={{ opacity: 0, y: -25, scale: 0.82, transition: { duration: 0.18 } }}
        className="cursor-grab active:cursor-grabbing p-1"
        style={{
          width: `${W}px`,
          height: `${H}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          className="relative w-full h-full transition-transform duration-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* 1. FRONT FACE - ALL WORDS 100% VISIBLE WITHOUT HIDING */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-b from-white via-zinc-50/95 to-zinc-100/90 border border-zinc-200/90 shadow-md p-2.5 flex flex-col justify-between backdrop-blur-xs"
            style={{
              transform: `translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Header: Icon, Category Name, Count */}
            <div>
              <div className="flex items-center justify-between gap-1 pb-1 border-b border-zinc-200/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="p-1 rounded-md bg-zinc-900 text-white shrink-0">
                    <Icon className="size-3" />
                  </div>
                  <h4 className="text-[11px] sm:text-[11.5px] font-bold text-zinc-900 tracking-tight">
                    {category}
                  </h4>
                </div>
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-200/80 text-zinc-700 shrink-0">
                  {items.length}
                </span>
              </div>
            </div>

            {/* Skill Badges - Every word fully visible without hiding or abbreviation */}
            <div className="flex flex-wrap gap-1 py-1">
              {items.map((item, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 text-[9px] sm:text-[9.5px] font-medium text-zinc-800 bg-white rounded border border-zinc-200 shadow-2xs hover:bg-zinc-900 hover:text-white transition-colors leading-tight"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* 3D Rotate Hint */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
              <span className="text-[8px] font-mono text-zinc-400 flex items-center gap-1">
                <Rotate3d className="size-2 text-zinc-500" />
                3D rotate
              </span>
              <button
                type="button"
                onClick={handleResetRotation}
                className="text-[8px] font-mono text-zinc-500 hover:text-zinc-900 underline px-1 rounded hover:bg-zinc-100"
              >
                Reset
              </button>
            </div>
          </div>

          {/* 2. BACK FACE */}
          <div
            className="absolute inset-0 rounded-xl bg-zinc-900 border border-zinc-700 text-white p-2.5 flex flex-col justify-between shadow-xl"
            style={{
              transform: `rotateY(180deg) translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 pb-1 border-b border-zinc-800">
                <Icon className="size-3 text-zinc-300" />
                <span className="text-[11px] font-bold text-zinc-100">{category}</span>
              </div>
              <p className="text-[9px] text-zinc-300 font-mono mt-1.5 leading-relaxed">
                Production-ready technical tools, algorithms & system architecture.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-mono text-zinc-500">Cuboid Side B</span>
            </div>
          </div>

          {/* 3. RIGHT FACE */}
          <div
            className="absolute bg-gradient-to-b from-zinc-200 to-zinc-300 border border-zinc-300/80 rounded-md flex items-center justify-center shadow-inner"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              left: `${(W - D) / 2}px`,
              top: 0,
              transform: `rotateY(90deg) translateZ(${W / 2}px)`,
            }}
          >
            <span className="rotate-90 text-[8px] font-mono font-semibold tracking-wider text-zinc-600 whitespace-nowrap">
              3D BLOCK
            </span>
          </div>

          {/* 4. LEFT FACE */}
          <div
            className="absolute bg-gradient-to-b from-zinc-200 to-zinc-300 border border-zinc-300/80 rounded-md flex items-center justify-center shadow-inner"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              left: `${(W - D) / 2}px`,
              top: 0,
              transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
            }}
          >
            <span className="-rotate-90 text-[8px] font-mono font-semibold tracking-wider text-zinc-600 whitespace-nowrap">
              {category.slice(0, 8).toUpperCase()}
            </span>
          </div>

          {/* 5. TOP FACE */}
          <div
            className="absolute bg-gradient-to-r from-zinc-100 via-white to-zinc-200 border border-zinc-300/90 rounded-md flex items-center justify-center shadow-2xs"
            style={{
              width: `${W}px`,
              height: `${D}px`,
              left: 0,
              top: `${(H - D) / 2}px`,
              transform: `rotateX(90deg) translateZ(${H / 2}px)`,
            }}
          >
            <span className="size-1 rounded-full bg-zinc-900" />
          </div>

          {/* 6. BOTTOM FACE */}
          <div
            className="absolute bg-zinc-300 border border-zinc-400 rounded-md shadow-md"
            style={{
              width: `${W}px`,
              height: `${D}px`,
              left: 0,
              top: `${(H - D) / 2}px`,
              transform: `rotateX(-90deg) translateZ(${H / 2}px)`,
            }}
          />
        </div>
      </motion.div>

      {/* ── BOTTOM STRAIGHT MERGE LINE (Drops down to merge back into single line) ── */}
      <div className="w-full flex flex-col items-center">
        {/* Connection node at bottom of cuboid */}
        <div className="size-2 rounded-full bg-zinc-900 ring-2 ring-white shadow-xs -my-0.5 z-30" />
        {/* Straight vertical line to merge */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 32, opacity: 1 }}
          transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
          className="w-[1.5px] bg-zinc-800"
        />
      </div>
    </div>
  );
}

/**
 * Interactive 3D Skills Tree
 * 
 * - One Single Straight Horizontal Line at the top
 * - Branches drop vertically straight down into multiple small 3D cuboids
 * - The small 3D cuboids drop down when the Technical Skills phase is active
 * - The small cuboids are fully rotatable in 3D by dragging
 * - At the bottom, lines drop and merge back into a single straight line
 * - When transitioning from one skill phase to the next, it merges back into a single line
 */
export default function Interactive3DSkillsTree({ skills }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.15 });

  // 3 Skill Phases
  const PHASES = [
    {
      id: 'phase-1',
      number: '01',
      name: 'Intelligent Core',
      categories: ['Programming', 'AI & GenAI'],
    },
    {
      id: 'phase-2',
      number: '02',
      name: 'Data & Systems',
      categories: ['Data Analysis', 'Data & Visualization', 'Database'],
    },
    {
      id: 'phase-3',
      number: '03',
      name: 'Web & Tools',
      categories: ['Web Development', 'Tools'],
    },
    {
      id: 'phase-all',
      number: 'ALL',
      name: 'All Skills',
      categories: skills.map((s) => s.category),
    },
  ];

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isMerging, setIsMerging] = useState(false);

  // Transition between skill phases: merges back into single line first, then branches out!
  const handlePhaseChange = (nextIndex) => {
    if (nextIndex === activePhaseIndex || isMerging) return;
    setIsMerging(true);
    // 1. Cuboids pull up, lines merge back into single straight line
    setTimeout(() => {
      setActivePhaseIndex(nextIndex);
      // 2. Pause on single straight line, then drop down the new small cuboids
      setTimeout(() => {
        setIsMerging(false);
      }, 140);
    }, 280);
  };

  const currentPhase = PHASES[activePhaseIndex];
  const activeSkills = skills.filter((s) =>
    currentPhase.categories.includes(s.category),
  );

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* ── PHASE SWITCHER HEADER ───────────────────────────── */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600">
            Phase
          </span>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-zinc-900 text-white">
            {currentPhase.number} / 03
          </span>
          <span className="text-xs font-semibold text-zinc-800 hidden sm:inline">
            {currentPhase.name}
          </span>
        </div>

        {/* Phase Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200/70">
          {PHASES.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePhaseChange(idx)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                activePhaseIndex === idx
                  ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/80'
              }`}
            >
              <span className="font-mono text-[10px] mr-1 opacity-70">
                {p.number}.
              </span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              handlePhaseChange(
                activePhaseIndex === 0 ? PHASES.length - 1 : activePhaseIndex - 1,
              )
            }
            className="p-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700"
            title="Previous Phase"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() =>
              handlePhaseChange(
                activePhaseIndex === PHASES.length - 1 ? 0 : activePhaseIndex + 1,
              )
            }
            className="p-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700"
            title="Next Phase"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── THE SINGLE STRAIGHT LINE & DROPPING SMALL 3D CUBOIDS ── */}
      <div className="w-full relative flex flex-col items-center">
        {/* 1. SINGLE STRAIGHT VERTICAL FEEDER LINE */}
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: isInView ? 32 : 12 }}
            transition={{ duration: 0.4 }}
            className="w-[1.5px] bg-zinc-800"
          />
          {/* Center Hub on the straight line */}
          <div className="size-2.5 rounded-full bg-zinc-900 ring-2 ring-zinc-300 shadow-sm" />
        </div>

        {/* 2. ONE SINGLE STRAIGHT HORIZONTAL LINE */}
        {/* When merging, the line contracts into a single point/center line */}
        <div className="w-full flex items-center justify-center relative py-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: isMerging ? '20%' : isInView ? '86%' : '30%',
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-[2px] bg-zinc-800 rounded-full relative"
          >
            {/* Animated traveling signal along the single straight line */}
            <motion.div
              animate={{ left: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full bg-zinc-900 shadow-[0_0_6px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* 3. SMALL 3D CUBOIDS DROPPING DOWN FROM THE SINGLE STRAIGHT LINE */}
        <div className="w-full flex items-center justify-center min-h-[235px]">
          <AnimatePresence mode="wait">
            {!isMerging && isInView && (
              <motion.div
                key={currentPhase.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-4xl"
              >
                {activeSkills.map((skillGroup, idx) => (
                  <SmallRotatableCuboid3D
                    key={skillGroup.category}
                    category={skillGroup.category}
                    items={skillGroup.items}
                    index={idx}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. ONE SINGLE STRAIGHT HORIZONTAL MERGE LINE */}
        {/* Merging back into a single straight line */}
        <div className="w-full flex items-center justify-center relative py-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: isMerging ? '20%' : isInView ? '86%' : '30%',
            }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-[2px] bg-zinc-800 rounded-full relative"
          >
            <motion.div
              animate={{ right: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 1.1 }}
              className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full bg-zinc-900 shadow-[0_0_6px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* 5. SINGLE STRAIGHT VERTICAL EXIT LINE (MERGED) */}
        <div className="relative flex flex-col items-center">
          <div className="size-2.5 rounded-full bg-zinc-900 ring-2 ring-zinc-300 shadow-sm" />
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: isInView ? 36 : 12 }}
            transition={{ duration: 0.4 }}
            className="w-[1.5px] bg-zinc-800"
          />
        </div>
      </div>
    </div>
  );
}
