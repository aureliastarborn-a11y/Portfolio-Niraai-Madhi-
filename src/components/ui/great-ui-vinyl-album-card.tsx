"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface VinylAlbumCardProps {
  title?: string;
  artist?: string;
  coverImage?: string;
  className?: string;
  description?: string;
  tags?: string[];
  onClick?: () => void;
  size?: "default" | "compact" | "small";
}

export default function VinylAlbumCard({
  title = "Crashing Worlds",
  artist = "The Bebos",
  coverImage = "https://cdn.21st.dev/assets/mirror/fb/fbd7b45359593786c52ccf8ff939f3a3e14012f6503489611f0d9db5e637a6cd.jpg",
  className,
  description,
  tags,
  onClick,
  size = "compact",
}: VinylAlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => setIsDarkMode(root.classList.contains("dark"));
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isSmall = size === "small";
  const isCompact = size === "compact";

  return (
    <div
      className={cn(
        "group relative flex items-center justify-start select-none transition-all cursor-pointer",
        isSmall
          ? "w-full max-w-[270px] h-[215px] sm:h-[225px] p-1"
          : isCompact
          ? "w-full max-w-[360px] h-[280px] sm:h-[300px] p-2"
          : "h-[500px] w-[500px] flex-col justify-center",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${title} - Click to view full details`}
    >
      {/* ── THE SLEEVE WITH ALL CONTENT INSIDE + SLIDING DARKENED BRONZE CD DISC ── */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          isSmall
            ? "h-48 w-48 sm:h-52 sm:w-52"
            : isCompact
            ? "h-60 w-60 sm:h-64 sm:w-64"
            : "h-72 w-72",
        )}
      >
        {/* Animated Spinning Lighter Champagne Platinum CD Disc */}
        <motion.div
          className={cn(
            "absolute flex items-center justify-center overflow-hidden rounded-full border border-black/[0.04] transition-colors duration-300 shadow-md backdrop-blur-md",
            isSmall
              ? "h-44 w-44 sm:h-48 sm:w-48"
              : isCompact
              ? "h-56 w-56 sm:h-60 sm:w-60"
              : "h-72 w-72",
            "bg-[#B8B0A3] bg-gradient-to-tr from-[#A39B8F] via-[#B2AAA0] to-[#C8C0B5]",
          )}
          initial={{ x: 0, rotate: 0 }}
          animate={{
            x: isHovered ? (isSmall ? 75 : isCompact ? 105 : 140) : 0,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 16, mass: 1 }}
        >
          {/* Concentric Grooves in Soft Champagne Platinum Tones */}
          <div className="absolute inset-1 rounded-full border border-[#C8C0B5]/50" />
          <div className="absolute inset-2.5 rounded-full border border-[#8A8174]/25" />
          <div className="absolute inset-4 rounded-full border border-[#C8C0B5]/55" />
          <div className="absolute inset-6 rounded-full border border-[#8A8174]/30" />
          <div className="absolute inset-8 rounded-full border border-[#C8C0B5]/50" />
          <div className="absolute inset-10 rounded-full border border-[#8A8174]/25" />
          <div className="absolute inset-12 rounded-full border border-[#C8C0B5]/55" />
          <div className="absolute inset-15 rounded-full border border-[#8A8174]/30" />
          <div className="absolute inset-18 rounded-full border border-[#C8C0B5]/50" />
          <div className="absolute inset-22 rounded-full border border-[#8A8174]/25" />

          {/* Center Album Label */}
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-full shadow-xs border border-black/[0.04] bg-white",
              isSmall ? "h-16 w-16" : isCompact ? "h-20 w-20" : "h-24 w-24",
            )}
          >
            <img
              src={coverImage}
              alt="label"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover contrast-[1.08] saturate-[1.15] brightness-[1.03]"
            />
            {/* Center Spindle Hole with Subtle Champagne Rim */}
            <div className="z-10 h-3 w-3 rounded-full bg-[#6E6557] shadow-inner ring-1.5 ring-[#5A5348]" />
            <div className="absolute inset-0 rounded-full ring-1 inset-ring ring-[#C8C0B5]/50" />
          </div>

          {/* Radial Light Sheen */}
          <div className="pointer-events-none absolute inset-0 rotate-45 bg-gradient-to-tr from-white/35 via-transparent to-amber-100/20 mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 -rotate-45 bg-gradient-to-br from-transparent via-white/45 to-transparent mix-blend-overlay" />
        </motion.div>

        {/* ── ALBUM COVER SLEEVE (LIGHTENED SHADE & BORDER + CENTER HEADER ONLY) ── */}
        <motion.div
          className={cn(
            "absolute z-20 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-black/[0.04] cursor-pointer bg-white transition-all duration-300",
            isSmall
              ? "h-48 w-48 sm:h-52 sm:w-52 rounded-2xl"
              : isCompact
              ? "h-60 w-60 sm:h-64 sm:w-64 rounded-2xl"
              : "h-72 w-72 rounded-2xl",
            "flex items-center justify-center text-zinc-900 select-none",
          )}
          initial={{ rotate: 0, scale: 1, x: 0 }}
          animate={{
            rotate: isHovered ? -3 : 0,
            scale: isHovered ? 0.98 : 1,
            x: isHovered ? (isSmall ? -10 : isCompact ? -14 : -20) : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* Cover Artwork Image with Lightened, Luminous Tone */}
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 contrast-[1.08] saturate-[1.15] brightness-[1.03]"
          />

          {/* Light Translucent Backdrop Veil */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] flex flex-col items-center justify-center p-4 sm:p-5 text-center select-none">
            <h3
              className={cn(
                "relative z-10 font-serif font-medium text-zinc-900 tracking-tight leading-snug drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] text-balance",
                isSmall ? "text-base sm:text-lg" : "text-lg sm:text-xl",
              )}
            >
              {title}
            </h3>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
