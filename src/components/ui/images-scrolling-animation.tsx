"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Code2,
  Sparkles,
  LineChart,
  BarChart3,
  Database,
  Globe,
  Wrench,
  ChevronUp,
  ChevronDown
} from "lucide-react";

export interface SkillCategory {
  category: string;
  items: string[];
  icon?: React.ReactNode;
  bg?: string;
  color?: string;
}

interface ImagesScrollingAnimationProps {
  skills?: SkillCategory[];
  className?: string;
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; gradient: string; accent: string; image: string }> = {
  "Programming": {
    icon: <Code2 className="size-4 text-emerald-400" />,
    gradient: "from-emerald-950/80 via-zinc-950 to-zinc-950",
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    image: "/images/landscapes/stream-in-the-mountains.jpg"
  },
  "AI & GenAI": {
    icon: <Sparkles className="size-4 text-purple-400" />,
    gradient: "from-purple-950/80 via-zinc-950 to-zinc-950",
    accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    image: "/images/nature-photos/sunlit-leaves.webp"
  },
  "Data Analysis": {
    icon: <LineChart className="size-4 text-blue-400" />,
    gradient: "from-blue-950/80 via-zinc-950 to-zinc-950",
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    image: "/images/nature-photos/soft-dunes.webp"
  },
  "Data & Visualization": {
    icon: <BarChart3 className="size-4 text-amber-400" />,
    gradient: "from-amber-950/80 via-zinc-950 to-zinc-950",
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    image: "/images/landscapes/the-coming-storm.jpg"
  },
  "Database": {
    icon: <Database className="size-4 text-cyan-400" />,
    gradient: "from-cyan-950/80 via-zinc-950 to-zinc-950",
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    image: "/images/sphere-textures/alpine-basin.webp"
  },
  "Web Development": {
    icon: <Globe className="size-4 text-pink-400" />,
    gradient: "from-pink-950/80 via-zinc-950 to-zinc-950",
    accent: "text-pink-400 border-pink-500/30 bg-pink-500/10",
    image: "/images/landscapes/home-by-the-lake.jpg"
  },
  "Tools": {
    icon: <Wrench className="size-4 text-zinc-400" />,
    gradient: "from-zinc-900/90 via-zinc-950 to-zinc-950",
    accent: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
    image: "/images/nature-photos/soft-dunes.webp"
  }
};

export default function ImagesScrollingAnimation({
  skills = [],
  className
}: ImagesScrollingAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = skills.length;

  // Handle scroll wheel inside the card box to smoothly slide between categories
  const handleWheel = (e: React.WheelEvent) => {
    // Only intercept when inside the box
    if (Math.abs(e.deltaY) < 15) return;
    if (e.deltaY > 0) {
      setCurrentIndex((prev) => (prev + 1) % total);
    } else {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
    }
  };

  const currentCategory = skills[currentIndex];
  const meta = currentCategory
    ? CATEGORY_META[currentCategory.category] || {
        icon: <Code2 className="size-4 text-emerald-400" />,
        gradient: "from-zinc-900 via-zinc-950 to-zinc-950",
        accent: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
        image: "/images/landscapes/stream-in-the-mountains.jpg"
      }
    : null;

  return (
    <div className={cn("relative w-full max-w-[480px] select-none", className)}>
      {/* ── THE SCROLLING CARD BOX (SMALL BUT NOT TOO SMALL: 480px x 290px) ── */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative h-[270px] sm:h-[290px] w-full overflow-hidden rounded-2xl border border-black/10 bg-zinc-950 shadow-xl transition-all"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {currentCategory && (
            <motion.div
              key={currentIndex}
              initial={{ y: "100%", opacity: 0.9, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "-30%", opacity: 0, scale: 0.94 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 26,
                mass: 0.8
              }}
              className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-950"
            >
              {/* Background Nature Image Texture with Deep Dark Gradient */}
              <div className="absolute inset-0 z-0">
                <img
                  src={meta?.image}
                  alt=""
                  className="size-full object-cover opacity-25 filter blur-[1px] brightness-75 scale-105"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t via-zinc-950/90 to-zinc-950/70",
                    meta?.gradient
                  )}
                />
              </div>

              {/* Top Bar: Category Pill & Index Indicator */}
              <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
                    {meta?.icon}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
                      {currentCategory.category}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {currentCategory.items.length} core competencies
                    </span>
                  </div>
                </div>

                {/* Progress Step Counter (e.g. 01 / 07) */}
                <span className="font-mono text-xs font-semibold text-zinc-400 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>

              {/* Center Content: Interactive Skill Badges */}
              <div className="relative z-10 p-4 sm:p-5 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2">
                  {currentCategory.items.map((item, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="px-3 py-1.5 text-xs font-medium text-white/95 rounded-lg bg-white/15 backdrop-blur-md border border-white/15 hover:bg-white/25 hover:border-white/30 transition-all shadow-sm"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation & Indicator Bar */}
              <div className="relative z-10 flex items-center justify-between px-4 sm:px-5 py-2.5 bg-black/40 backdrop-blur-md border-t border-white/[0.06]">
                {/* Dots indicator for all 7 categories */}
                <div className="flex items-center gap-1.5">
                  {skills.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all cursor-pointer",
                        dotIdx === currentIndex
                          ? "w-5 bg-white"
                          : "w-1.5 bg-white/30 hover:bg-white/60"
                      )}
                      aria-label={`Jump to category ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Up/Down Scroll Control Chevrons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + total) % total)}
                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Previous category"
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % total)}
                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Next category"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helpful Subtle Hint */}
      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
        <span>Scroll or click arrows to explore stack</span>
        <span>{skills[currentIndex]?.category}</span>
      </div>
    </div>
  );
}
