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
        {/* Animated Spinning Dark Champagne Bronze CD Disc */}
        <motion.div
          className={cn(
            "absolute flex items-center justify-center overflow-hidden rounded-full border border-[#524A3D] transition-colors duration-300 shadow-2xl backdrop-blur-md",
            isSmall
              ? "h-44 w-44 sm:h-48 sm:w-48"
              : isCompact
              ? "h-56 w-56 sm:h-60 sm:w-60"
              : "h-72 w-72",
            "bg-[#7D7364] bg-gradient-to-tr from-[#544C3F] via-[#756B5D] to-[#918676]",
          )}
          initial={{ x: 0, rotate: 0 }}
          animate={{
            x: isHovered ? (isSmall ? 75 : isCompact ? 105 : 140) : 0,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 16, mass: 1 }}
        >
          {/* Concentric Grooves in Dark Burnished Bronze Tones */}
          <div className="absolute inset-1 rounded-full border border-[#918676]/60" />
          <div className="absolute inset-2.5 rounded-full border border-[#423C32]/75" />
          <div className="absolute inset-4 rounded-full border border-[#918676]/70" />
          <div className="absolute inset-6 rounded-full border border-[#423C32]/75" />
          <div className="absolute inset-8 rounded-full border border-[#918676]/60" />
          <div className="absolute inset-10 rounded-full border border-[#423C32]/75" />
          <div className="absolute inset-12 rounded-full border border-[#918676]/70" />
          <div className="absolute inset-15 rounded-full border border-[#423C32]/75" />
          <div className="absolute inset-18 rounded-full border border-[#918676]/60" />
          <div className="absolute inset-22 rounded-full border border-[#423C32]/75" />

          {/* Center Album Label - Darkened Ring Artwork Matching Sleeve */}
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-full shadow-md border border-[#524A3D] bg-[#FAF8F5]",
              isSmall ? "h-16 w-16" : isCompact ? "h-20 w-20" : "h-24 w-24",
            )}
          >
            <img
              src={coverImage}
              alt="label"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover contrast-[1.25] saturate-[1.35] brightness-[0.92]"
            />
            {/* Center Spindle Hole with Dark Gunmetal Bronze Rim */}
            <div className="z-10 h-3 w-3 rounded-full bg-[#302B23] shadow-inner ring-2 ring-[#1F1B16]" />
            <div className="absolute inset-0 rounded-full ring-2 inset-ring ring-[#524A3D]/80" />
          </div>

          {/* Radial Light Sheen */}
          <div className="pointer-events-none absolute inset-0 rotate-45 bg-gradient-to-tr from-white/25 via-transparent to-amber-200/15 mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 -rotate-45 bg-gradient-to-br from-transparent via-white/35 to-transparent mix-blend-overlay" />
        </motion.div>

        {/* ── ALBUM COVER SLEEVE (DARKENED RING DESIGN + CENTER HEADER ONLY) ── */}
        <motion.div
          className={cn(
            "absolute z-20 overflow-hidden shadow-xl border-2 border-[#736858]/60 cursor-pointer bg-[#FAF8F5]",
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
          {/* Cover Artwork Image with Vibrant Watercolor and Darkened Ring */}
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 contrast-[1.25] saturate-[1.35] brightness-[0.92]"
          />

          {/* Translucent Backdrop Veil - Keeps Ring and Watercolor Sharp while Enhancing Title Legibility */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 sm:p-5 text-center select-none">
            <h3
              className={cn(
                "relative z-10 font-bold text-zinc-950 tracking-tight leading-snug drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)] text-balance",
                isSmall ? "text-sm sm:text-[15px]" : "text-base sm:text-lg",
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
