import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  Workflow
} from 'lucide-react';

// Icon map for categories
const CATEGORY_ICONS = {
  'Programming': Code2,
  'AI & GenAI': Cpu,
  'Data Analysis': BarChart3,
  'Data & Visualization': BarChart3,
  'Database': Database,
  'Web Development': Globe2,
  'Tools': Wrench,
};

// Category details for 3D faces
const CATEGORY_DETAILS = {
  'Programming': {
    subtitle: 'Core Systems & Logic',
    description: 'High-performance scripting, data pipelines & algorithm engineering.',
    architectures: ['Object-Oriented', 'Functional', 'Async / Event-Driven'],
  },
  'AI & GenAI': {
    subtitle: 'Autonomous Systems & LLMs',
    description: 'Autonomous multi-agent swarms, prompt engineering & RAG pipelines.',
    architectures: ['Transformer Models', 'ReAct Agents', 'Vector Embeddings'],
  },
  'Data Analysis': {
    subtitle: 'Exploratory & Statistical',
    description: 'Exploratory data analysis, cleaning pipelines & quantitative statistics.',
    architectures: ['DataFrame Manipulation', 'Hypothesis Testing', 'Feature Engineering'],
  },
  'Data & Visualization': {
    subtitle: 'BI & Executive Dashboards',
    description: 'Interactive analytics reports, business intelligence & data storytelling.',
    architectures: ['DAX & PowerQuery', 'Tableau Visuals', 'KPI Scorecards'],
  },
  'Database': {
    subtitle: 'Querying & Warehousing',
    description: 'Complex SQL queries, aggregation pipelines & star-schema warehousing.',
    architectures: ['Star / Snowflake Schemas', 'Indexing & Joins', 'ETL Pipelines'],
  },
  'Web Development': {
    subtitle: 'Full-Stack & Frontend UI',
    description: 'Modern responsive web interfaces, REST API integration & reactive state.',
    architectures: ['React & Next.js', 'Tailwind CSS', 'RESTful APIs'],
  },
  'Tools': {
    subtitle: 'DevOps & Collaboration',
    description: 'Version control workflows, branching strategy & collaborative deployment.',
    architectures: ['Git Flow', 'CI/CD Pipelines', 'Repository Management'],
  },
};

/**
 * 3D Rotatable Cuboid Component
 * Real CSS 3D box with 6 faces, drag-to-rotate in 3D, and connection points for branching lines.
 */
function RotatableCuboid3D({ category, items, index, isDropping }) {
  const Icon = CATEGORY_ICONS[category] || Sparkles;
  const details = CATEGORY_DETAILS[category] || {
    subtitle: 'Engineering Domain',
    description: 'Core competencies and tooling.',
    architectures: ['Standard Architecture'],
  };

  // 3D rotation state (degrees)
  // Default is a pleasing isometric 3D angle
  const [rotX, setRotX] = useState(-10);
  const [rotY, setRotY] = useState(16);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: -10, rotY: 16 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setHasInteracted(true);
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
    // Map horizontal drag to rotateY, vertical drag to rotateX
    const newRotY = dragStartRef.current.rotY + deltaX * 0.7;
    const newRotX = Math.max(-55, Math.min(55, dragStartRef.current.rotX - deltaY * 0.7));
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
    setRotY(16);
  };

  // Dimensions of 3D Cuboid
  const W = 228;
  const H = 208;
  const D = 64; // depth of the cuboid

  return (
    <motion.div
      initial={{ opacity: 0, y: -70, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 90,
          damping: 14,
          delay: index * 0.08,
        }
      }}
      exit={{ opacity: 0, y: -40, scale: 0.85, transition: { duration: 0.25 } }}
      className="relative flex flex-col items-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Top Connection Node (where branch line connects) */}
      <div className="relative -mb-1 z-30 flex items-center justify-center">
        <span className="size-2 rounded-full bg-zinc-900 ring-4 ring-zinc-100 shadow-sm" />
      </div>

      {/* 3D Scene Viewport */}
      <div
        className="relative cursor-grab active:cursor-grabbing p-1"
        style={{
          width: `${W}px`,
          height: `${H}px`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* The 3D Rotating Cuboid Entity */}
        <div
          className="relative w-full h-full transition-transform duration-75"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* ── 1. FRONT FACE ───────────────────────────────── */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white via-zinc-50/90 to-zinc-100/90 border border-zinc-200 shadow-xl p-4 flex flex-col justify-between backdrop-blur-md"
            style={{
              transform: `translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Top Bar with Icon, Category Title, Count and 3D Hint */}
            <div>
              <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-zinc-100">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="p-1 rounded-md bg-zinc-900 text-white shadow-xs">
                    <Icon className="size-3.5" />
                  </div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-zinc-900 truncate">
                    {category}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-200/70 text-zinc-700">
                    {items.length}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
                {details.subtitle}
              </p>
            </div>

            {/* Middle: Skill Badges */}
            <div className="flex flex-wrap gap-1 py-1">
              {items.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] sm:text-[10.5px] font-medium text-zinc-800 bg-white rounded-md border border-zinc-200/90 shadow-2xs hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Bottom 3D Rotate Hint */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100/80">
              <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                <Rotate3d className="size-2.5 text-zinc-500 animate-spin-slow" />
                Drag to rotate 3D
              </span>
              <button
                type="button"
                onClick={handleResetRotation}
                className="text-[9px] font-mono text-zinc-500 hover:text-zinc-900 underline px-1 rounded hover:bg-zinc-100 transition-colors"
                title="Reset 3D angle"
              >
                Reset
              </button>
            </div>
          </div>

          {/* ── 2. BACK FACE ────────────────────────────────── */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700 text-white p-4 flex flex-col justify-between shadow-2xl"
            style={{
              transform: `rotateY(180deg) translateZ(${D / 2}px)`,
              backfaceVisibility: 'hidden',
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-zinc-800">
                <Icon className="size-3.5 text-zinc-300" />
                <h4 className="text-xs font-bold text-zinc-100 truncate">{category}</h4>
              </div>
              <p className="text-[10px] text-zinc-300 mt-2 leading-relaxed">
                {details.description}
              </p>
            </div>

            <div>
              <div className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
                Core Architectures
              </div>
              <div className="flex flex-col gap-1">
                {details.architectures.map((arch, aIdx) => (
                  <div key={aIdx} className="flex items-center gap-1 text-[9.5px] text-zinc-200">
                    <span className="size-1 rounded-full bg-emerald-400" />
                    <span>{arch}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[8.5px] font-mono text-zinc-500">
                3D Cuboid Side B
              </span>
            </div>
          </div>

          {/* ── 3. RIGHT FACE (SIDE) ─────────────────────────── */}
          <div
            className="absolute bg-gradient-to-b from-zinc-200 to-zinc-300 border border-zinc-300/80 rounded-lg flex items-center justify-center shadow-inner"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              left: `${(W - D) / 2}px`,
              top: 0,
              transform: `rotateY(90deg) translateZ(${W / 2}px)`,
            }}
          >
            <div className="rotate-90 text-[10px] font-mono tracking-widest text-zinc-600 font-semibold whitespace-nowrap">
              {category.toUpperCase()}
            </div>
          </div>

          {/* ── 4. LEFT FACE (SIDE) ──────────────────────────── */}
          <div
            className="absolute bg-gradient-to-b from-zinc-200 to-zinc-300 border border-zinc-300/80 rounded-lg flex items-center justify-center shadow-inner"
            style={{
              width: `${D}px`,
              height: `${H}px`,
              left: `${(W - D) / 2}px`,
              top: 0,
              transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
            }}
          >
            <div className="-rotate-90 text-[10px] font-mono tracking-widest text-zinc-600 font-semibold whitespace-nowrap">
              3D BLOCK
            </div>
          </div>

          {/* ── 5. TOP FACE (TOP BEVEL) ──────────────────────── */}
          <div
            className="absolute bg-gradient-to-r from-zinc-100 via-white to-zinc-200 border border-zinc-300/90 rounded-lg flex items-center justify-center shadow-xs"
            style={{
              width: `${W}px`,
              height: `${D}px`,
              left: 0,
              top: `${(H - D) / 2}px`,
              transform: `rotateX(90deg) translateZ(${H / 2}px)`,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-zinc-900" />
              <span className="text-[9px] font-mono font-medium text-zinc-600">INPUT PORT</span>
              <span className="size-1.5 rounded-full bg-zinc-900" />
            </div>
          </div>

          {/* ── 6. BOTTOM FACE (BOTTOM BASE) ─────────────────── */}
          <div
            className="absolute bg-zinc-400/90 border border-zinc-500 rounded-lg shadow-2xl"
            style={{
              width: `${W}px`,
              height: `${D}px`,
              left: 0,
              top: `${(H - D) / 2}px`,
              transform: `rotateX(-90deg) translateZ(${H / 2}px)`,
            }}
          />
        </div>
      </div>

      {/* Bottom Connection Node (where branch line merges) */}
      <div className="relative -mt-1 z-30 flex items-center justify-center">
        <span className="size-2 rounded-full bg-zinc-900 ring-4 ring-zinc-100 shadow-sm" />
      </div>
    </motion.div>
  );
}

/**
 * Interactive 3D Skills Tree Component
 * 
 * Flow:
 * 1. Single central trunk line enters from above.
 * 2. When Technical Skills phase is active, the single line branches out and drops down into 3D cuboids.
 * 3. Each cuboid can be clicked and dragged to freely rotate in 3D.
 * 4. When transitioning from one skill phase to the next, branches merge back into a single line,
 *    then split open to drop down the next phase's cuboids!
 * 5. At the bottom, lines merge back into a single continuous line flowing downward.
 */
export default function Interactive3DSkillsTree({ skills }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  // Define Skill Phases
  const PHASES = [
    {
      id: 'phase-1',
      number: '01',
      name: 'Intelligent Core',
      description: 'Foundational programming & autonomous AI agent architectures',
      categories: ['Programming', 'AI & GenAI'],
    },
    {
      id: 'phase-2',
      number: '02',
      name: 'Data Engineering & Analytics',
      description: 'Exploratory data analysis, BI visualization & enterprise warehousing',
      categories: ['Data Analysis', 'Data & Visualization', 'Database'],
    },
    {
      id: 'phase-3',
      number: '03',
      name: 'Web & Engineering Platforms',
      description: 'Full-stack user interfaces, API integration & collaborative dev tools',
      categories: ['Web Development', 'Tools'],
    },
    {
      id: 'all',
      number: 'ALL',
      name: 'Full Stack Ecosystem',
      description: 'All 7 technical domains active simultaneously',
      categories: skills.map((s) => s.category),
    },
  ];

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transition handler that merges lines back before switching phase
  const handlePhaseChange = (newIndex) => {
    if (newIndex === activePhaseIndex || isTransitioning) return;
    setIsTransitioning(true);
    // 1. Lines merge back into a single line (collapse duration)
    setTimeout(() => {
      setActivePhaseIndex(newIndex);
      // 2. Short pause while merged, then branch out into the new phase
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 320);
  };

  const currentPhase = PHASES[activePhaseIndex];

  // Filter skills for active phase
  const activeSkills = skills.filter((s) =>
    currentPhase.categories.includes(s.category),
  );

  const cuboidCount = activeSkills.length;

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* ── TOP PHASE SELECTOR TABS ─────────────────────────── */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <Workflow className="size-4 text-zinc-800" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
            Phase Flow
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            {currentPhase.number} / 03
          </span>
        </div>

        {/* Phase Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80">
          {PHASES.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePhaseChange(idx)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                activePhaseIndex === idx
                  ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/70'
              }`}
            >
              <span className="font-mono text-[10px] mr-1 opacity-70">
                {p.number}.
              </span>
              {p.name}
            </button>
          ))}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              handlePhaseChange(
                activePhaseIndex === 0 ? PHASES.length - 1 : activePhaseIndex - 1,
              )
            }
            className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors shadow-2xs"
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
            className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-700 transition-colors shadow-2xs"
            title="Next Phase"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Active Phase Description */}
      <div className="text-center max-w-md mb-6">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Phase {currentPhase.number}: {currentPhase.name}
        </h3>
        <p className="text-xs text-zinc-500 font-mono mt-0.5">
          {currentPhase.description}
        </p>
      </div>

      {/* ── THE SINGLE LINE & BRANCHING TREE SYSTEM ──────────── */}
      <div className="w-full relative flex flex-col items-center">
        {/* 1. TOP SINGLE LINE (ENTERING TRUNK) */}
        <div className="relative flex flex-col items-center">
          {/* Continuous vertical trunk line */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isInView ? 48 : 20,
              opacity: isInView ? 1 : 0.4,
            }}
            transition={{ duration: 0.6 }}
            className="w-0.5 bg-gradient-to-b from-transparent via-zinc-400 to-zinc-900 relative"
          >
            {/* Animated Traveling Pulse */}
            <motion.div
              animate={{ y: [0, 48], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="absolute -left-1 size-2 rounded-full bg-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* Central Junction Hub (Where the single line branches out) */}
          <div className="relative size-4 rounded-full bg-zinc-900 ring-4 ring-zinc-200/80 shadow-md flex items-center justify-center my-0.5 z-20">
            <span className="size-1 rounded-full bg-white animate-ping" />
          </div>
        </div>

        {/* 2. SVG BRANCHING LINES (Splitting out into multiple cuboids) */}
        <div className="w-full relative overflow-visible" style={{ minHeight: '44px' }}>
          <svg
            className="w-full h-11 overflow-visible"
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
          >
            {activeSkills.map((_, idx) => {
              // Calculate horizontal percentage coordinate for each branch
              const total = cuboidCount;
              const step = 100 / (total + 1);
              const branchX = step * (idx + 1);
              const centerX = 50;

              return (
                <g key={idx}>
                  {/* Branch Path from Center Junction (50, 0) dropping down to (branchX, 44) */}
                  <motion.path
                    d={`M ${centerX},0 C ${centerX},22 ${branchX},18 ${branchX},44`}
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isTransitioning ? 0 : isInView ? 1 : 0,
                      opacity: isTransitioning ? 0 : 1,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: isTransitioning ? 0 : idx * 0.06,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Small guide dot at bottom of branch */}
                  <circle cx={branchX} cy={44} r="1.5" fill="#18181b" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* 3. 3D CUBOIDS GRID (The technical skills dropping down into cuboids) */}
        <div className="w-full my-2 flex justify-center">
          <AnimatePresence mode="wait">
            {!isTransitioning && (
              <motion.div
                key={currentPhase.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className={`grid gap-6 sm:gap-8 justify-items-center w-full max-w-4xl px-2 ${
                  cuboidCount === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                    : cuboidCount === 3
                    ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl'
                }`}
              >
                {activeSkills.map((skillGroup, idx) => (
                  <RotatableCuboid3D
                    key={skillGroup.category}
                    category={skillGroup.category}
                    items={skillGroup.items}
                    index={idx}
                    isDropping={isInView}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. SVG MERGING LINES (Merging back from cuboids into single line) */}
        <div className="w-full relative overflow-visible" style={{ minHeight: '44px' }}>
          <svg
            className="w-full h-11 overflow-visible"
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
          >
            {activeSkills.map((_, idx) => {
              const total = cuboidCount;
              const step = 100 / (total + 1);
              const branchX = step * (idx + 1);
              const centerX = 50;

              return (
                <g key={idx}>
                  {/* Converging Path from (branchX, 0) to Center Junction (50, 44) */}
                  <motion.path
                    d={`M ${branchX},0 C ${branchX},24 ${centerX},20 ${centerX},44`}
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isTransitioning ? 0 : isInView ? 1 : 0,
                      opacity: isTransitioning ? 0 : 1,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: isTransitioning ? 0 : idx * 0.06,
                      ease: 'easeInOut',
                    }}
                  />
                  <circle cx={branchX} cy={0} r="1.5" fill="#18181b" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* 5. BOTTOM SINGLE MERGED LINE (FLOW CONTINUES) */}
        <div className="relative flex flex-col items-center">
          {/* Merged Central Junction Node */}
          <div className="relative size-4 rounded-full bg-zinc-900 ring-4 ring-zinc-200/80 shadow-md flex items-center justify-center my-0.5 z-20">
            <span className="size-1 rounded-full bg-white" />
          </div>

          {/* Continuing vertical trunk line flowing down to next section */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isInView ? 52 : 24,
              opacity: isInView ? 1 : 0.4,
            }}
            transition={{ duration: 0.6 }}
            className="w-0.5 bg-gradient-to-b from-zinc-900 via-zinc-400 to-transparent relative"
          >
            <motion.div
              animate={{ y: [0, 52], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', delay: 0.9 }}
              className="absolute -left-1 size-2 rounded-full bg-zinc-900 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
