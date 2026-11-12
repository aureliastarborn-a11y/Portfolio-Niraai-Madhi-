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
        "group relative flex items-center justify-start select-none transition-all",
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
    >
      {/* ── THE MARKED BOX: SLEEVE WITH ALL CONTENT INSIDE + SLIDING GLASSY BEIGE CD DISC ── */}
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
        {/* Animated Spinning Champagne Silver (#C9C2B6) CD Disc */}
        <motion.div
          className={cn(
            "absolute flex items-center justify-center overflow-hidden rounded-full border border-[#B8B0A2] transition-colors duration-300 shadow-2xl backdrop-blur-md",
            isSmall
              ? "h-44 w-44 sm:h-48 sm:w-48"
              : isCompact
              ? "h-56 w-56 sm:h-60 sm:w-60"
              : "h-72 w-72",
            "bg-[#C9C2B6] bg-gradient-to-tr from-[#BCB4A7] via-[#C9C2B6] to-[#D8D2C8]",
          )}
          initial={{ x: 0, rotate: 0 }}
          animate={{
            x: isHovered ? (isSmall ? 75 : isCompact ? 105 : 140) : 0,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 16, mass: 1 }}
        >
          {/* Concentric Grooves in Champagne Silver Tones */}
          <div className="absolute inset-1 rounded-full border border-[#D8D2C8]/70" />
          <div className="absolute inset-2.5 rounded-full border border-[#B3AAA0]/60" />
          <div className="absolute inset-4 rounded-full border border-[#D8D2C8]/80" />
          <div className="absolute inset-6 rounded-full border border-[#B3AAA0]/60" />
          <div className="absolute inset-8 rounded-full border border-[#D8D2C8]/70" />
          <div className="absolute inset-10 rounded-full border border-[#B3AAA0]/60" />
          <div className="absolute inset-12 rounded-full border border-[#D8D2C8]/80" />
          <div className="absolute inset-15 rounded-full border border-[#B3AAA0]/60" />
          <div className="absolute inset-18 rounded-full border border-[#D8D2C8]/70" />
          <div className="absolute inset-22 rounded-full border border-[#B3AAA0]/60" />

          {/* Center Album Label - Golden ring watercolor artwork matching sleeve */}
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-full shadow-md border border-[#B8B0A2] bg-[#FAF8F5]",
              isSmall ? "h-16 w-16" : isCompact ? "h-20 w-20" : "h-24 w-24",
            )}
          >
            <img
              src={coverImage}
              alt="label"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
            />
            {/* Center Spindle Hole with Champagne Silver Rim */}
            <div className="z-10 h-3 w-3 rounded-full bg-[#A89F92] shadow-inner ring-1 ring-[#8A8174]" />
            <div className="absolute inset-0 rounded-full ring-2 inset-ring ring-[#D8D2C8]/70" />
          </div>

          {/* Champagne Silver Radial Light Sheen */}
          <div className="pointer-events-none absolute inset-0 rotate-45 bg-gradient-to-tr from-white/30 via-transparent to-amber-100/20 mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 -rotate-45 bg-gradient-to-br from-transparent via-white/45 to-transparent mix-blend-overlay" />
        </motion.div>

        {/* ── ALBUM COVER SLEEVE (GOLDEN RING & WATERCOLOR FINE ART DESIGN) ── */}
        <motion.div
          className={cn(
            "absolute z-20 overflow-hidden shadow-xl border border-black/10 cursor-default bg-[#FAF8F5]",
            isSmall
              ? "h-48 w-48 sm:h-52 sm:w-52 rounded-xl p-3 sm:p-3.5"
              : isCompact
              ? "h-60 w-60 sm:h-64 sm:w-64 rounded-2xl p-4 sm:p-5"
              : "h-72 w-72 rounded-2xl p-5",
            "flex flex-col justify-between text-white select-none",
          )}
          initial={{ rotate: 0, scale: 1, x: 0 }}
          animate={{
            rotate: isHovered ? -3 : 0,
            scale: isHovered ? 0.98 : 1,
            x: isHovered ? (isSmall ? -10 : isCompact ? -14 : -20) : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* Golden Ring & Watercolor Artwork */}
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Dark Gradient Overlay for Maximum Text Contrast */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/25 backdrop-blur-[0.5px] flex flex-col justify-between text-white select-none",
            isSmall ? "p-3 sm:p-3.5" : "p-4 sm:p-5",
          )}>
            {/* ── TOP BAR: PROJECT / ROLE NAME ONLY (NO TIMING / NO ARROW BUTTON / NO GITHUB LINK) ── */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className={cn(
                "font-bold text-white tracking-tight leading-tight drop-shadow-sm truncate",
                isSmall ? "text-xs sm:text-[13px]" : "text-[14px] sm:text-[15px]",
              )}>
                {title}
              </span>
            </div>

            {/* ── BOTTOM CONTENT: TAGLINE / ORGANIZATION, SUMMARY & TECH PILLS (NO TIMING) ── */}
            <div className={cn("relative z-10", isSmall ? "space-y-1 pt-2" : "space-y-1.5 pt-3")}>
              {artist && (
                <div className={cn(
                  "font-mono text-zinc-200 font-medium line-clamp-1 drop-shadow-xs",
                  isSmall ? "text-[10.5px]" : "text-xs",
                )}>
                  {artist}
                </div>
              )}

              {description && (
                <p className={cn(
                  "text-zinc-300 leading-tight line-clamp-2 drop-shadow-xs",
                  isSmall ? "text-[9.5px]" : "text-[11px]",
                )}>
                  {description}
                </p>
              )}

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "font-mono text-white bg-white/20 rounded border border-white/20 backdrop-blur-md",
                        isSmall ? "px-1 py-0.2 text-[8px]" : "px-1.5 py-0.5 text-[9px]",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
