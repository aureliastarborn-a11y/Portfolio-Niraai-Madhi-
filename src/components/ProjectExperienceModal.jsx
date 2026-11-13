import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

export default function ProjectExperienceModal({ item, onClose }) {
  // Close on Escape key press and prevent background scroll
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  const isProject = item.type === 'project';
  const data = item.data;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* ── EXPLANATION CARD (MATCHING REFERENCE DESIGN: FROSTED LAVENDER/SLATE CARD WITH ISOMETRIC CUBES & PILL) ── */}
        <motion.div
          className="relative z-10 w-full max-w-lg sm:max-w-xl rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/35 shadow-[0_25px_60px_rgba(25,15,40,0.35)] p-6 sm:p-8 flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #d2cadf 0%, #b8adc8 50%, #9e91b2 100%)',
          }}
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Ambient Radial Lighting Sheen */}
          <div
            className="pointer-events-none absolute inset-0 bg-radial from-white/35 via-transparent to-transparent opacity-60"
            aria-hidden="true"
          />

          {/* ── 3D PURPLE ISOMETRIC CUBES GRAPHIC (BOTTOM-RIGHT - MATCHING REFERENCE IMAGE 2) ── */}
          <div
            className="pointer-events-none absolute -bottom-6 -right-6 sm:-bottom-4 sm:-right-4 w-48 h-48 sm:w-56 sm:h-56 opacity-90 select-none z-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 200 200" fill="none" className="w-full h-full drop-shadow-[0_12px_24px_rgba(40,20,60,0.25)]">
              {/* Cube 1 (Back Upper Cube) */}
              <g transform="translate(100, 35)">
                <path d="M 0,-26 L 26,-11 L 0,4 L -26,-11 Z" fill="#b196cf" />
                <path d="M -26,-11 L 0,4 L 0,34 L -26,19 Z" fill="#8f73b0" />
                <path d="M 0,4 L 26,-11 L 26,19 L 0,34 Z" fill="#755a96" />
              </g>

              {/* Cube 2 (Middle Left Cube) */}
              <g transform="translate(68, 75)">
                <path d="M 0,-26 L 26,-11 L 0,4 L -26,-11 Z" fill="#a88dc6" />
                <path d="M -26,-11 L 0,4 L 0,34 L -26,19 Z" fill="#886ca9" />
                <path d="M 0,4 L 26,-11 L 26,19 L 0,34 Z" fill="#6d538e" />
              </g>

              {/* Cube 3 (Middle Right Cube) */}
              <g transform="translate(132, 75)">
                <path d="M 0,-26 L 26,-11 L 0,4 L -26,-11 Z" fill="#9f84bd" />
                <path d="M -26,-11 L 0,4 L 0,34 L -26,19 Z" fill="#7f63a0" />
                <path d="M 0,4 L 26,-11 L 26,19 L 0,34 Z" fill="#654b85" />
              </g>

              {/* Cube 4 (Front Bottom Cube) */}
              <g transform="translate(100, 115)">
                <path d="M 0,-28 L 28,-12 L 0,4 L -28,-12 Z" fill="#987db7" />
                <path d="M -28,-12 L 0,4 L 0,36 L -28,20 Z" fill="#785c99" />
                <path d="M 0,4 L 28,-12 L 28,20 L 0,36 Z" fill="#5f457f" />
              </g>
            </svg>
          </div>

          {/* ── CARD CONTENT (FOREGROUND) ── */}
          <div className="relative z-10 flex flex-col justify-between min-h-[300px] sm:min-h-[340px]">
            {/* Top Bar: Pill Badge + Close Button */}
            <div className="flex items-center justify-between gap-3">
              {/* Dark Pill Badge with Glowing Purple/Indigo Dot (Matching Image 2) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#463f52]/85 backdrop-blur-md text-white text-xs font-medium shadow-xs border border-white/10">
                <span className="size-2 rounded-full bg-[#8272f2] shadow-[0_0_8px_#8272f2]" />
                <span className="tracking-wide">
                  {isProject ? 'Project Showcase' : data.period ? data.period : 'Work Experience'}
                </span>
              </div>

              {/* Sleek Translucent Close Button */}
              <button
                onClick={onClose}
                className="size-8 rounded-full bg-black/20 hover:bg-black/35 text-white/90 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Main Center Area: Title & Description */}
            <div className="mt-6 mb-4 max-w-sm sm:max-w-md">
              {/* Large Bold Header */}
              <h3
                id="modal-title"
                className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight leading-snug drop-shadow-xs"
              >
                {isProject ? data.title : data.role}
              </h3>

              {/* Subtitle / Organization or Tagline */}
              {isProject ? (
                data.tagline && (
                  <p className="text-xs sm:text-sm font-medium text-white/80 mt-1 mb-3">
                    {data.tagline}
                  </p>
                )
              ) : (
                data.organization && (
                  <p className="text-xs sm:text-sm font-medium text-white/80 mt-1 mb-3">
                    {data.organization} {data.period ? `• ${data.period}` : ''}
                  </p>
                )
              )}

              {/* Description Paragraph */}
              <p className="text-white/90 text-[13.5px] sm:text-[14.5px] leading-relaxed font-normal">
                {isProject ? data.description : data.summary}
              </p>

              {/* Tech Tags / Competencies */}
              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {data.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-black/15 text-white/90 text-[11px] font-mono border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Action Link (Matching "Request invite →" in Image 2) */}
            <div className="pt-2">
              {isProject && data.link ? (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white font-medium text-sm hover:underline group/link transition-all"
                >
                  <span>View Project on GitHub</span>
                  <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
                </a>
              ) : (
                <span className="text-white/70 text-xs font-mono">
                  {data.organization || 'Tagore Engineering College'}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
