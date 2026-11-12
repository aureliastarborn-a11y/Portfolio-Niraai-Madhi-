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
  size = "default",
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
        "group relative flex flex-col items-center justify-center select-none transition-all",
        isCompact
          ? "w-full max-w-[340px] p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-black/[0.06] hover:border-black/[0.12] hover:shadow-lg"
          : "h-[500px] w-[500px]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Disc and Album Container */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center",
          isCompact ? "h-52 w-52 sm:h-56 sm:w-56 my-2" : "h-72 w-72",
        )}
      >
        {/* Animated Spinning Vinyl Disc */}
        <motion.div
          className={cn(
            "absolute flex items-center justify-center overflow-hidden rounded-full border border-neutral-800 transition-colors duration-300 shadow-xl",
            isCompact ? "h-48 w-48 sm:h-52 sm:w-52" : "h-72 w-72",
            isDarkMode
              ? "bg-[#e5e5e5] bg-gradient-to-tr from-cyan-400/10 via-pink-400/10 to-yellow-400/10"
              : "bg-zinc-950",
          )}
          initial={{ x: 0, rotate: 0 }}
          animate={{
            x: isHovered ? (isCompact ? 75 : 140) : 0,
            rotate: isHovered ? 180 : 0,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 15, mass: 1 }}
        >
          {/* Concentric Vinyl Grooves */}
          <div className={cn("absolute inset-1 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/40")} />
          <div className={cn("absolute inset-2 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/60")} />
          <div className={cn("absolute inset-4 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/40")} />
          <div className={cn("absolute inset-6 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/60")} />
          <div className={cn("absolute inset-8 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/40")} />
          <div className={cn("absolute inset-10 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/60")} />
          <div className={cn("absolute inset-12 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/40")} />
          <div className={cn("absolute inset-16 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/60")} />
          <div className={cn("absolute inset-20 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/40")} />
          <div className={cn("absolute inset-24 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/60")} />
          <div className={cn("absolute inset-28 rounded-full border", isDarkMode ? "border-white/20" : "border-zinc-800/40")} />

          {/* Center Album Label */}
          <div className={cn("relative flex items-center justify-center overflow-hidden rounded-full bg-white", isCompact ? "h-16 w-16" : "h-24 w-24")}>
            <img
              src={coverImage}
              alt="label"
              className="absolute inset-0 h-full w-full scale-[1.05] object-cover"
            />
            <div className="z-10 h-3 w-3 rounded-full bg-[#0f0f0f] shadow-inner ring-1 ring-black/50" />
            <div className="absolute inset-0 rounded-full ring-2 inset-ring ring-black/20" />
          </div>

          {/* Vinyl Light Sheen Reflection */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rotate-45 bg-gradient-to-tr mix-blend-overlay",
              isDarkMode
                ? "from-cyan-400/30 via-pink-400/30 to-yellow-400/30"
                : "from-transparent via-white/20 to-transparent",
            )}
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 -rotate-45 bg-gradient-to-br mix-blend-overlay",
              isDarkMode
                ? "from-cyan-400/20 via-pink-400/20 to-yellow-400/20"
                : "from-transparent via-white/10 to-transparent",
            )}
          />
        </motion.div>

        {/* Album Cover Sleeve */}
        <motion.div
          className={cn(
            "absolute z-20 overflow-hidden rounded-xl shadow-lg border border-black/[0.08]",
            isCompact ? "h-48 w-48 sm:h-52 sm:w-52" : "h-72 w-72",
          )}
          initial={{ rotate: 0, scale: 1, x: 0 }}
          animate={{
            rotate: isHovered ? -4 : 0,
            scale: isHovered ? 0.98 : 1,
            x: isHovered ? (isCompact ? -12 : -20) : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          <img
            src={coverImage}
            alt={title}
            className="absolute inset-0 h-full w-full scale-[1.05] object-cover"
          />
        </motion.div>
      </div>

      {/* Album Info */}
      <div className={cn("z-20 flex flex-col", isCompact ? "mt-4 w-full text-left" : "mt-8 w-72")}>
        <div className="flex items-center justify-between gap-2">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 group/link text-zinc-900 font-semibold hover:text-blue-600 transition-colors"
            >
              <h3 className={cn("tracking-tight transition-colors line-clamp-1", isCompact ? "text-base font-semibold" : "text-2xl font-bold")}>
                {title}
              </h3>
              <ArrowUpRight className="size-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
            </a>
          ) : (
            <h3
              className={cn(
                "tracking-tight transition-colors line-clamp-1",
                isCompact ? "text-base font-semibold text-zinc-900" : "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-neutral-900",
              )}
            >
              {title}
            </h3>
          )}
        </div>

        <p
          className={cn(
            "mt-1 font-medium transition-colors",
            isCompact ? "text-xs text-zinc-500 font-mono" : "text-lg text-neutral-500",
          )}
        >
          {artist} &bull; {releaseType} &bull; {year}
        </p>

        {description && (
          <p className="mt-2 text-xs text-zinc-600 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-2.5 border-t border-black/[0.04]">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-mono text-zinc-600 bg-white rounded border border-black/[0.06]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
