"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number | string;
  title: string;
  subtitle?: string;
}

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items: (CarouselItem & { originalIndex: number })[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 80,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-3";
    let color = "bg-zinc-300 dark:bg-zinc-600";

    if (isCenter) {
      height = "h-7 sm:h-8";
      color = "bg-zinc-900 dark:bg-white";
    } else if (isFifth) {
      height = "h-4 sm:h-5";
      color = "bg-zinc-600 dark:bg-zinc-300";
    }

    const positionClass = top ? "top-0" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-0.5 ${height} ${color} ${positionClass} transition-colors`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4 overflow-hidden">{lines}</div>;
};

export interface RulerCarouselProps {
  originalItems: CarouselItem[];
  className?: string;
  height?: string;
  showControls?: boolean;
  itemWidth?: number;
  gap?: number;
}

export function RulerCarousel({
  originalItems,
  className = "",
  height = "h-screen",
  showControls = true,
  itemWidth = 360,
  gap = 70,
}: RulerCarouselProps) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  // Start with middle set
  const initialIndex = itemsPerSet + Math.min(itemsPerSet - 1, Math.floor(itemsPerSet / 2));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(initialIndex);

  const stepDistance = itemWidth + gap;

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    // Find the original item index
    const targetOriginalIndex = newIndex % itemsPerSet;

    // Find all instances of this item across the 3 copies
    const possibleIndices = [
      targetOriginalIndex,
      targetOriginalIndex + itemsPerSet,
      targetOriginalIndex + itemsPerSet * 2,
    ];

    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  // Handle infinite scrolling
  useEffect(() => {
    if (isResetting) return;

    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  // Center the active item dynamically
  const centerOffset = Math.floor(itemsPerSet / 2);
  const targetX = (centerOffset - (activeIndex % itemsPerSet)) * stepDistance;

  // Get current page info
  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className={`w-full ${height} flex flex-col items-center justify-center bg-transparent ${className}`}>
      <div className="w-full h-[180px] sm:h-[200px] flex flex-col justify-center relative">
        <div className="flex items-center justify-center">
          <RulerLines top />
        </div>

        <div className="flex items-center justify-center w-full h-full relative overflow-hidden">
          <motion.div
            className="flex items-center"
            style={{ gap: `${gap}px` }}
            animate={{
              x: targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                    mass: 0.9,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(index)}
                  className={`text-2xl sm:text-4xl md:text-5xl font-bold whitespace-nowrap cursor-pointer flex flex-col items-center justify-center transition-colors ${
                    isActive
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 0.72,
                    opacity: isActive ? 1 : 0.35,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: `${itemWidth}px`,
                  }}
                >
                  <span className="tracking-tight">{item.title}</span>
                  {item.subtitle && (
                    <span
                      className={`text-xs sm:text-sm font-mono font-medium mt-1.5 transition-all duration-300 ${
                        isActive
                          ? "text-amber-800 dark:text-amber-400 opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-1"
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

        <div className="flex items-center justify-center">
          <RulerLines top={false} />
        </div>
      </div>

      {showControls && (
        <div className="flex items-center justify-center gap-4 mt-3 sm:mt-5 select-none">
          <button
            onClick={handlePrevious}
            disabled={isResetting}
            className="flex items-center justify-center cursor-pointer p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Previous item"
          >
            <Rewind className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-300" />
          </button>

          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {currentPage}
            </span>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">
              {totalPages}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={isResetting}
            className="flex items-center justify-center cursor-pointer p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Next item"
          >
            <FastForward className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
        </div>
      )}
    </div>
  );
}
