"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GridCardProps {
  children?: React.ReactNode;
  className?: string;
  gridSize?: number;
}

export default function GridCard({
  children,
  className,
  gridSize = 28,
}: GridCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-black/[0.1] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      {/* Animated Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(to right, #71717a 1px, transparent 1px), linear-gradient(to bottom, #71717a 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Gradient Overlay on Hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50/0 via-transparent to-amber-100/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-amber-50/30 group-hover:to-amber-100/20" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
