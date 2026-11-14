"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface CarouselItem {
  id: number | string;
  title: string;
  subtitle?: string;
}

const RulerLines = ({
  top = true,
  totalLines = 65,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);
  const centerIdx = Math.floor(totalLines / 2);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === centerIdx;

    let height = "h-1.5 sm:h-2";
    let color = "bg-zinc-300 dark:bg-zinc-700";

    if (isCenter) {
      height = "h-3.5 sm:h-4";
      color = "bg-zinc-900 dark:bg-white";
    } else if (isFifth) {
      height = "h-2.5 sm:h-3";
      color = "bg-zinc-600 dark:bg-zinc-400";
    }

    const positionClass = top ? "top-0" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-[1.5px] ${height} ${color} ${positionClass} pointer-events-none transition-colors duration-200`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-4 px-2 overflow-hidden select-none">{lines}</div>;
};

export interface RulerCarouselProps {
  originalItems: CarouselItem[];
  className?: string;
  height?: string;
  itemWidth?: number;
  gap?: number;
  initialIndex?: number;
}

export function RulerCarousel({
  originalItems,
  className = "",
  height = "h-[110px]",
  itemWidth = 280,
  gap = 40,
  initialIndex = 0,
}: RulerCarouselProps) {
  const count = originalItems.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const stepDistance = itemWidth + gap;

  // Spring-driven continuous cursor scrubbing
  const cursorProgress = useMotionValue(
    count > 1 ? initialIndex / (count - 1) : 0.5
  );

  const smoothProgress = useSpring(cursorProgress, {
    stiffness: 280,
    damping: 30,
    mass: 0.6,
  });

  // Calculate motion x position directly from smoothed progress
  // At progress = 0, item 0 is centered. At progress = 1, item (count - 1) is centered.
  const x = useTransform(smoothProgress, (p) => {
    const floatIdx = p * Math.max(1, count - 1);
    return -floatIdx * stepDistance;
  });

  // Update active index based on current progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      const idx = Math.min(
        count - 1,
        Math.max(0, Math.round(latest * (count - 1)))
      );
      setActiveIndex(idx);
    });
    return () => unsubscribe();
  }, [smoothProgress, count]);

  // Handle pointer/cursor scrub across the component
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current || count <= 1) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      // Map padding-aware progress [0.08, 0.92] so edges are easy to reach
      const rawProgress = (relativeX - rect.width * 0.08) / (rect.width * 0.84);
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      cursorProgress.set(clampedProgress);
    },
    [cursorProgress, count]
  );

  const handlePointerLeave = useCallback(() => {
    // Keep on the current closest item cleanly
    if (count > 1) {
      cursorProgress.set(activeIndex / (count - 1));
    }
  }, [cursorProgress, activeIndex, count]);

  const handleItemClick = (index: number) => {
    if (count <= 1) return;
    cursorProgress.set(index / (count - 1));
    setActiveIndex(index);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`w-full ${height} flex flex-col justify-between py-1 bg-transparent select-none cursor-ew-resize relative overflow-hidden group ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Top Ruler Line */}
      <div className="flex items-center justify-center w-full">
        <RulerLines top={true} />
      </div>

      {/* Dynamic Cursor-Scrubbed Text Content */}
      <div className="relative w-full h-[58px] flex items-center justify-center overflow-hidden">
        {/* Subtle center tick indicator line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-zinc-300 dark:bg-zinc-700 pointer-events-none" />

        <motion.div
          className="flex items-center absolute"
          style={{
            x,
            left: "50%",
            marginLeft: `-${itemWidth / 2}px`,
            gap: `${gap}px`,
          }}
        >
          {originalItems.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(index)}
                className="flex flex-col items-center justify-center text-center cursor-pointer select-none"
                style={{
                  width: `${itemWidth}px`,
                  minWidth: `${itemWidth}px`,
                }}
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.72,
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 28,
                }}
              >
                {/* Golden Header (e.g. ACADEMICS, LOCATION, SPECIFICATION) */}
                <span
                  className={`text-lg sm:text-xl font-bold tracking-wider font-mono transition-colors duration-200 ${
                    isActive
                      ? "text-[#b8860b] dark:text-[#f3b73e]"
                      : "text-[#b8860b]/75 dark:text-[#f3b73e]/70"
                  }`}
                >
                  {item.title}
                </span>

                {/* Deep Brown Content (e.g. B.Tech AI & DS · CGPA 8.0) */}
                {item.subtitle && (
                  <span
                    className={`text-xs sm:text-[13px] font-semibold tracking-tight mt-0.5 max-w-[280px] truncate transition-colors duration-200 ${
                      isActive
                        ? "text-[#2e180d] dark:text-[#f0dfc8]"
                        : "text-[#2e180d]/80 dark:text-[#d5c3aa]/75"
                    }`}
                  >
                    {item.subtitle}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Ruler Line */}
      <div className="flex items-center justify-center w-full">
        <RulerLines top={false} />
      </div>
    </div>
  );
}
