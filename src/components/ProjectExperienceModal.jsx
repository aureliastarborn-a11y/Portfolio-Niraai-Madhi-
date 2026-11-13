import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Sparkles, Briefcase, Calendar, Building2, Tag } from 'lucide-react';

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
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Dialog Card */}
        <motion.div
          className="relative z-10 w-full max-w-xl sm:max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[88vh]"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner with Artwork Thumbnail & Badges */}
          <div className="relative p-6 sm:p-7 pb-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
            {/* Top Row: Type Pill, Period / Tag, and Close Button */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/20">
                  {isProject ? (
                    <>
                      <Sparkles className="size-3" />
                      <span>Project Showcase</span>
                    </>
                  ) : (
                    <>
                      <Briefcase className="size-3" />
                      <span>Work Experience</span>
                    </>
                  )}
                </span>

                {data.period && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full">
                    <Calendar className="size-3" />
                    <span>{data.period}</span>
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="size-9 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Title & Organization / Tagline */}
            <div className="flex items-start gap-4">
              {/* Cover Artwork Thumbnail with Darkened Ring */}
              {data.bg && (
                <div className="relative size-16 sm:size-20 shrink-0 rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-md">
                  <img
                    src={data.bg}
                    alt={isProject ? data.title : data.role}
                    className="size-full object-cover"
                  />
                  {/* Darkened Ring Highlight */}
                  <div className="absolute inset-2 rounded-full border-[1.5px] border-zinc-900/60 pointer-events-none" />
                </div>
              )}

              <div className="space-y-1">
                <h3
                  id="modal-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug"
                >
                  {isProject ? data.title : data.role}
                </h3>

                {isProject ? (
                  data.tagline && (
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      {data.tagline}
                    </p>
                  )
                ) : (
                  data.organization && (
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-zinc-400" />
                      <span>{data.organization}</span>
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-zinc-700 dark:text-zinc-300">
            {/* Description / Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Overview &amp; Impact
              </h4>
              <p className="text-[15px] sm:text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
                {isProject ? data.description : data.summary}
              </p>
            </div>

            {/* Technologies & Domain Tags */}
            {data.tags && data.tags.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Tag className="size-3" />
                  <span>Technologies &amp; Key Competencies</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-mono rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-6 bg-zinc-50/80 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div>
              {isProject && data.link ? (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <span>View Project on GitHub</span>
                  <ArrowUpRight className="size-4" />
                </a>
              ) : (
                <span className="text-xs text-zinc-400 font-mono">
                  Tagore Engineering College · AI &amp; DS
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium border border-zinc-200 dark:border-zinc-700 transition-colors focus:outline-none"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
