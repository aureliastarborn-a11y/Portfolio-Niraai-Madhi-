import React, { useState, useEffect } from 'react';
import { MercuryRailLoader } from '@/components/ui/mercury-rail-loader';

export default function KeyCompetenciesMercury({ skills = [] }) {
  const defaultSkills = [
    'Analytical Thinking',
    'Problem Solving',
    'Team Collaboration',
    'Quick Learner',
  ];
  const list = skills && skills.length > 0 ? skills : defaultSkills;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through soft skills every 1.2s in sync with the liquid mercury rail bounce
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % list.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [list.length, isPaused]);

  return (
    <div
      className="pt-3 relative flex flex-col sm:flex-row items-center justify-center min-h-[48px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Soft Skills Title in its original left-aligned position */}
      <div className="w-full sm:w-auto sm:absolute sm:left-0 sm:top-1 text-xs font-mono text-zinc-400 uppercase tracking-wider text-left mb-2 sm:mb-0">
        Soft Skills
      </div>

      {/* Centralized Liquid Mercury Rail Loader */}
      <div className="flex justify-center items-center">
        <MercuryRailLoader
          accent="#b8860b"
          width={240}
          speed={1200}
          label={list[activeIndex]}
          showLabel={true}
          className="text-zinc-800 dark:text-zinc-200"
        />
      </div>
    </div>
  );
}

