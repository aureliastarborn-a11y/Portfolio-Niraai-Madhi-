import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UiverseCard.css';

export default function ProjectExperienceModal({ item, onClose }) {
  const [isTilted, setIsTilted] = useState(false);
  const cardRef = useRef(null);

  // Always reset tilt whenever item changes or modal mounts
  useEffect(() => {
    setIsTilted(false);
    if (cardRef.current) cardRef.current.style.transform = '';
  }, [item]);

  // When untilted, clear inline transform so CSS styles apply cleanly
  useEffect(() => {
    if (!isTilted && cardRef.current) {
      cardRef.current.style.transform = '';
    }
  }, [isTilted]);

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

  // Desktop pointer move dynamic 3D rotation
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = -((y / rect.height) - 0.5) * 22;
    const ry = ((x / rect.width) - 0.5) * 22;
    card.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  };

  // Mobile touch move dynamic 3D rotation
  const handleTouchMove = (e) => {
    if (!isTilted || e.touches.length !== 1) return;
    const card = cardRef.current;
    if (!card) return;
    const t = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const rx = -((y / rect.height) - 0.5) * 20;
    const ry = ((x / rect.width) - 0.5) * 20;
    card.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 640 || window.matchMedia('(pointer: coarse)').matches);
    if (isMobile) {
      // Toggle 3D view on every tap of the content card
      setIsTilted((prev) => !prev);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none cursor-pointer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={onClose}
      >
        {/* Backdrop Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* ── UIVERSE 3D CARD (SMIT-PRAJAPATI HALF-WHITE EDITION) ── */}
        <motion.div
          className="relative z-10 cursor-default max-w-[92vw] sm:max-w-lg lg:max-w-xl overflow-visible my-auto"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="uiv-modal-parent">
            <div
              ref={cardRef}
              className={`uiv-modal-card ${isTilted ? 'is-active-3d' : ''}`}
              onClick={handleCardClick}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              onTouchMove={handleTouchMove}
            >
              <div className="uiv-modal-content-box">
                <span id="modal-title" className="card-title">
                  {isProject ? data.title : data.role}
                </span>

                {/* Subtitle / Organization or Tagline */}
                {isProject
                  ? data.tagline && (
                      <p className="card-subtitle text-[14.5px] font-semibold text-zinc-500 mt-2 mb-3">
                        {data.tagline}
                      </p>
                    )
                  : data.organization && (
                      <p className="card-subtitle text-[14.5px] font-semibold text-zinc-500 mt-2 mb-3">
                        {data.organization} {data.period ? `• ${data.period}` : ''}
                      </p>
                    )}

                {/* Main Content Description */}
                <p className="card-content">
                  {isProject ? data.description : data.summary}
                </p>

                {/* Tags separated by points */}
                {data.tags && data.tags.length > 0 && (
                  <div className="card-tags">
                    {data.tags.map((tag, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span style={{ opacity: 0.5, margin: '0 8px' }}>•</span>}
                        <span>{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
