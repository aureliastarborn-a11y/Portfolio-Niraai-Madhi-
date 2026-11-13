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
  Rotate3d
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

// Natural two-line wrap for long skills so no words are cut off
const LINE_SPLITS = {
  'Basic Statistical Analysis': ['Basic Statistical', 'Analysis'],
  'Responsive Web Design': ['Responsive', 'Web Design'],
  'Prompt Engineering': ['Prompt', 'Engineering'],
  'Data Warehousing': ['Data', 'Warehousing'],
  'API Integration': ['API', 'Integration'],
  'Generative AI': ['Generative', 'AI'],
  'AI Automation': ['AI', 'Automation'],
  'Data Cleaning': ['Data', 'Cleaning'],
  'SQL Queries': ['SQL', 'Queries'],
};

// Category headers formatted onto double line when requested
const CATEGORY_LINE_SPLITS = {
  'Data & Visualization': ['Data &', 'Visualization'],
};

function formatSkillLines(name) {
  if (LINE_SPLITS[name]) {
    return LINE_SPLITS[name];
  }
  if (name.includes(' ') && name.length > 11) {
    const words = name.split(' ');
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
  return [name];
}

/**
 * Small 3D Rotatable Cuboid
 * - Drops down from the single straight line ONLY when the user scrolls to read the Technical Stack phase
 * - Fully rotatable in 3D by dragging
 * - Long skill names break cleanly into double lines so no words get cut off
 */
function SmallRotatableCuboid3D({ category, items, index, isReading }) {
  // 3D rotation state (degrees) - resting 3D perspective angle showing depth (matching Image 2)
  const [rotX, setRotX] = useState(-10);
  const [rotY, setRotY] = useState(15);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: -10, rotY: 15, moved: false });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX,
      rotY,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      dragStartRef.current.moved = true;
    }
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

  const handleCuboidClick = (e) => {
    e.stopPropagation();
    // Only toggle flip if user didn't drag
    if (!dragStartRef.current.moved) {
      setRotX(-10);
      setRotY((prev) => {
        const isBack = Math.abs((prev - 195) % 360) < 90;
        return isBack ? 15 : 195;
      });
    }
  };

  // Dimensions of the 3D cuboid
  const W = 146;
  const H = 140;
  const D = 34;

  return (
    <div className="relative flex flex-col items-center select-none" style={{ perspective: 900 }}>
      {/* ── TOP STRAIGHT DROP LINE (Branches dropping down from the single line) ── */}
      <div className="w-full flex flex-col items-center">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isReading ? 16 : 0,
            opacity: isReading ? 1 : 0,
          }}
          transition={{ duration: 0.35, delay: isReading ? 0.05 + index * 0.06 : 0, ease: 'easeOut' }}
          className="w-[1.5px] bg-zinc-800"
        />
        {/* Connection node on top of cuboid */}
        <motion.div 
          animate={{ scale: isReading ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isReading ? 0.08 + index * 0.06 : 0 }}
          className="size-1.5 rounded-full bg-zinc-900 ring-1.5 ring-white shadow-xs -my-0.5 z-30" 
        />
      </div>

      {/* ── 3D CUBOID BODY (DROPS DOWN FROM STRAIGHT LINE ONLY WHEN READING) ── */}
      <motion.div
        initial={{ opacity: 0, y: -65, scale: 0.8 }}
        animate={
          isReading
            ? {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 115,
                  damping: 13,
                  mass: 0.85,
                  delay: 0.12 + index * 0.08, // Cascading drop right when scrolling into view!
                },
              }
            : {
                opacity: 0,
                y: -65,
                scale: 0.8,
                transition: { duration: 0.22, ease: 'easeInOut' },
              }
        }
        data-cuboid={category}
        className="cursor-pointer p-0.5"
        style={{
          width: `${W}px`,
          height: `${H}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleCuboidClick}
        title="Click to flip or drag to rotate in 3D"
      >
        <div
          className="relative w-full h-full transition-transform duration-500 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* 1. FRONT FACE - SHOWS ONLY THE HEADER IN THE CENTER */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-b from-white via-zinc-50/95 to-zinc-100/90 border-2 border-zinc-300/80 shadow-md p-4 flex items-center justify-center text-center backdrop-blur-xs select-none"
            style={{
              transform: `translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <h4 className="text-[13px] sm:text-[14px] font-bold text-zinc-900 tracking-tight leading-snug drop-shadow-xs">
              {CATEGORY_LINE_SPLITS[category] ? (
                <>
                  <span className="block whitespace-nowrap">{CATEGORY_LINE_SPLITS[category][0]}</span>
                  <span className="block whitespace-nowrap">{CATEGORY_LINE_SPLITS[category][1]}</span>
                </>
              ) : (
                <span className="block">{category}</span>
              )}
            </h4>
          </div>

          {/* 2. BACK FACE (THE BLACK AREA) - LINEAR ARRANGEMENT WITHOUT INTERIOR CURVY BOXES */}
          <div
            className="absolute inset-0 rounded-xl bg-zinc-900 border-2 border-zinc-700 text-white p-3 sm:p-3.5 flex flex-col items-center justify-center shadow-xl select-none"
            style={{
              transform: `rotateY(180deg) translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-1.5 w-full text-center">
              {items.map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10.5px] sm:text-[11px] font-medium text-zinc-200 tracking-wide leading-tight hover:text-white transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 3. RIGHT FACE */}
          <div
            className="absolute bg-gradient-to-b from-zinc-200 to-zinc-300 border border-zinc-300/80 rounded-xs flex items-center justify-center shadow-inner"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              left: `${(W - D) / 2}px`,
              top: 0,
              transform: `rotateY(90deg) translateZ(${W / 2}px)`,
            }}
          >
            <span className="rotate-90 text-[7px] font-mono font-semibold tracking-wider text-zinc-600 whitespace-nowrap">
              3D
            </span>
          </div>

          {/* 4. LEFT FACE */}
          <div
            className="absolute bg-gradient-to-b from-zinc-200 to-zinc-300 border border-zinc-300/80 rounded-xs flex items-center justify-center shadow-inner"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              left: `${(W - D) / 2}px`,
              top: 0,
              transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
            }}
          >
            <span className="-rotate-90 text-[7px] font-mono font-semibold tracking-wider text-zinc-600 whitespace-nowrap">
              {category.slice(0, 6).toUpperCase()}
            </span>
          </div>

          {/* 5. TOP FACE */}
          <div
            className="absolute bg-gradient-to-r from-zinc-100 via-white to-zinc-200 border border-zinc-300/90 rounded-xs flex items-center justify-center shadow-2xs"
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
            className="absolute bg-zinc-300 border border-zinc-400 rounded-xs shadow-xs"
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
        <motion.div 
          animate={{ scale: isReading ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isReading ? 0.08 + index * 0.06 : 0 }}
          className="size-1.5 rounded-full bg-zinc-900 ring-1.5 ring-white shadow-xs -my-0.5 z-30" 
        />
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isReading ? 16 : 0,
            opacity: isReading ? 1 : 0,
          }}
          transition={{ duration: 0.35, delay: isReading ? 0.05 + index * 0.06 : 0, ease: 'easeOut' }}
          className="w-[1.5px] bg-zinc-800"
        />
      </div>
    </div>
  );
}

/**
 * Interactive 3D Skills Tree
 * 
 * - When NOT reading (before reaching or after scrolling past):
 *   Collapsed into an attached double line (═════════════════)
 * - ONLY when reading the Technical Stack phase:
 *   The double line opens, branches drop down, and the small 3D cuboids drop down!
 * - After passing or scrolling away:
 *   Retracts back and turns back into the attached double line!
 */
export default function Interactive3DSkillsTree({ skills }) {
  const containerRef = useRef(null);
  // Active reading window: when the section occupies the central reading zone of the screen
  const isReading = useInView(containerRef, { once: false, amount: 0.3, margin: '-8% 0px -8% 0px' });
  const [manualOpen, setManualOpen] = useState(false);

  const isOpen = isReading || manualOpen;

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* ── THE DOUBLE LINE & DROPPING SMALL 3D CUBOIDS ── */}
      <div className="w-full relative flex flex-col items-center">
        {/* 1. SINGLE STRAIGHT VERTICAL FEEDER LINE */}
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ height: 8 }}
            animate={{ height: isOpen ? 18 : 10 }}
            transition={{ duration: 0.35 }}
            className="w-[1.5px] bg-zinc-800"
          />
          {/* Center Hub on the straight line */}
          <div className="size-2 rounded-full bg-zinc-900 ring-1.5 ring-zinc-300 shadow-xs" />
        </div>

        {/* 2. TOP HORIZONTAL LINE */}
        <div 
          onClick={() => setManualOpen(!manualOpen)}
          className="w-full flex items-center justify-center relative py-0.5 cursor-pointer"
          title={isOpen ? "Click to collapse to double line" : "Click to expand skills"}
        >
          <motion.div
            initial={{ width: '40%' }}
            animate={{
              width: isOpen ? '92%' : '45%',
            }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="h-[2px] bg-zinc-800 rounded-full relative"
          >
            {/* Animated traveling signal */}
            <motion.div
              animate={{ left: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-zinc-900 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* 3. MIDDLE AREA: DROPS DOWN ONLY WHEN READING, TURNS BACK INTO ATTACHED DOUBLE LINE WHEN PASSED */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full overflow-hidden flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-center py-2">
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl">
                  {skills.map((skillGroup, idx) => (
                    <SmallRotatableCuboid3D
                      key={skillGroup.category}
                      category={skillGroup.category}
                      items={skillGroup.items}
                      index={idx}
                      isReading={isOpen}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. BOTTOM HORIZONTAL LINE:
            When NOT reading -> Attached right to the top line (gap 3.5px) forming the ATTACHED DOUBLE LINE!
            When reading -> Sits below the dropped-down cuboids! */}
        <div 
          onClick={() => setManualOpen(!manualOpen)}
          className="w-full flex items-center justify-center relative py-0.5 cursor-pointer"
          title={isOpen ? "Click to collapse to double line" : "Click to expand skills"}
        >
          <motion.div
            initial={{ width: '40%' }}
            animate={{
              width: isOpen ? '92%' : '45%',
              marginTop: isOpen ? 0 : 3.5,
            }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="h-[2px] bg-zinc-800 rounded-full relative"
          >
            <motion.div
              animate={{ right: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 1.1 }}
              className="absolute top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-zinc-900 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* 5. SINGLE STRAIGHT VERTICAL EXIT LINE (MERGED) */}
        <div className="relative flex flex-col items-center">
          <div className="size-2 rounded-full bg-zinc-900 ring-1.5 ring-zinc-300 shadow-xs" />
          <motion.div
            initial={{ height: 8 }}
            animate={{ height: isOpen ? 18 : 10 }}
            transition={{ duration: 0.35 }}
            className="w-[1.5px] bg-zinc-800"
          />
        </div>
      </div>
    </div>
  );
}
