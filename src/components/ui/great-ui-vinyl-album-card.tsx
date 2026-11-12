"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface VinylAlbumCardProps {
  title?: string;
  artist?: string;
  releaseType?: string;
  year?: string;
  coverImage?: string;
  className?: string;
  description?: string;
  tags?: string[];
  link?: string;
  onClick?: () => void;
  size?: "default" | "compact";
}

export default function VinylAlbumCard({
  title = "Crashing Worlds",
  artist = "The Bebos",
  releaseType = "Single",
  year = "2057",
  coverImage = "https://cdn.21st.dev/assets/mirror/fb/fbd7b45359593786c52ccf8ff939f3a3e14012f6503489611f0d9db5e637a6cd.jpg",
  className,
  description,
  tags,
  link,
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

  const isCompact = size === "compact";

  return (
    <div
      className={cn(
        "group relative flex items-center justify-start select-none transition-all",
        isCompact
          ? "w-full max-w-[360px] h-[280px] sm:h-[300px] p-2"
          : "h-[500px] w-[500px] flex-col justify-center",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* ── THE MARKED BOX: SLEEVE WITH ALL CONTENT INSIDE + SLIDING VINYL DISC ── */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          isCompact ? "h-60 w-60 sm:h-64 sm:w-64" : "h-72 w-72",
        )}
      >
        {/* Animated Spinning Grooved Vinyl Disc */}
        <motion.div
          className={cn(
            "absolute flex items-center justify-center overflow-hidden rounded-full border border-neutral-900 transition-colors duration-300 shadow-2xl",
            isCompact ? "h-56 w-56 sm:h-60 sm:w-60" : "h-72 w-72",
            "bg-zinc-950",
          )}
          initial={{ x: 0, rotate: 0 }}
          animate={{
            x: isHovered ? (isCompact ? 95 : 140) : 0,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 85, damping: 16, mass: 1 }}
        >
          {/* Concentric Vinyl Grooves */}
          <div className="absolute inset-1 rounded-full border border-zinc-800/40" />
          <div className="absolute inset-2 rounded-full border border-zinc-800/60" />
          <div className="absolute inset-4 rounded-full border border-zinc-800/40" />
          <div className="absolute inset-6 rounded-full border border-zinc-800/60" />
          <div className="absolute inset-8 rounded-full border border-zinc-800/40" />
          <div className="absolute inset-10 rounded-full border border-zinc-800/60" />
          <div className="absolute inset-12 rounded-full border border-zinc-800/40" />
          <div className="absolute inset-16 rounded-full border border-zinc-800/60" />
          <div className="absolute inset-20 rounded-full border border-zinc-800/40" />
          <div className="absolute inset-24 rounded-full border border-zinc-800/60" />

          {/* Center Album Label */}
          <div
            className={cn(
              "relative flex items-center justify-center overflow-hidden rounded-full bg-white shadow-md",
              isCompact ? "h-20 w-20" : "h-24 w-24",
            )}
          >
            <img
              src={coverImage}
              alt="label"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
            />
            <div className="z-10 h-3.5 w-3.5 rounded-full bg-[#09090b] shadow-inner ring-1 ring-black/60" />
            <div className="absolute inset-0 rounded-full ring-2 inset-ring ring-black/30" />
          </div>

          {/* Vinyl Surface Rainbow Sheen Reflections */}
          <div className="pointer-events-none absolute inset-0 rotate-45 bg-gradient-to-tr from-cyan-400/20 via-pink-400/20 to-yellow-400/20 mix-blend-overlay" />
          <div className="pointer-events-none absolute inset-0 -rotate-45 bg-gradient-to-br from-transparent via-white/15 to-transparent mix-blend-overlay" />
        </motion.div>

        {/* ── ALBUM COVER SLEEVE (CONTAINING ALL CONTENT DIRECTLY INSIDE) ── */}
        <motion.div
          className={cn(
            "absolute z-20 overflow-hidden rounded-2xl shadow-xl border border-black/10 cursor-pointer bg-zinc-900",
            isCompact ? "h-60 w-60 sm:h-64 sm:w-64" : "h-72 w-72",
          )}
          initial={{ rotate: 0, scale: 1, x: 0 }}
          animate={{
            rotate: isHovered ? -3 : 0,
            scale: isHovered ? 0.98 : 1,
            x: isHovered ? (isCompact ? -14 : -20) : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* Background Artwork */}
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Rich Dark Gradient & Frosted Overlay for Content Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 backdrop-blur-[0.5px] p-4 sm:p-5 flex flex-col justify-between text-white select-none">
            {/* Top Bar inside sleeve: Badge & External Link */}
            <div className="flex items-center justify-between gap-1">
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md bg-white/20 backdrop-blur-md text-white/95 border border-white/15">
                {releaseType} {year ? `· ${year}` : ""}
              </span>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded-md bg-white/15 hover:bg-white/30 text-white transition-colors"
                  title="Open Project"
                >
                  <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>

            {/* Bottom Content inside sleeve: Title, Subtitle, Description & Tags */}
            <div className="space-y-1.5 pt-4">
              <h3 className="text-[15px] sm:text-base font-bold text-white tracking-tight leading-snug drop-shadow-sm line-clamp-1">
                {title}
              </h3>

              {artist && (
                <div className="text-[11px] font-mono text-zinc-300 font-medium line-clamp-1">
                  {artist}
                </div>
              )}

              {description && (
                <p className="text-[11px] text-zinc-300/90 leading-tight line-clamp-2">
                  {description}
                </p>
              )}

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 text-[9px] font-mono text-white/90 bg-white/15 rounded border border-white/10 backdrop-blur-sm"
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
