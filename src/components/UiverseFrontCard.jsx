import React, { useRef, useEffect } from 'react';
import './UiverseFrontCard.css';

export default function UiverseFrontCard({
  id,
  title,
  isActive3D = false,
  onActivate,
  onOpen,
}) {
  const cardRef = useRef(null);

  // Clear any inline transform when card is not active
  useEffect(() => {
    if (!isActive3D && cardRef.current) {
      cardRef.current.style.transform = '';
    }
  }, [isActive3D]);

  // Desktop pointer move dynamic 3D tilt
  const handlePointerMove = (e) => {
    if (e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = -((y / rect.height) - 0.5) * 26;
    const ry = ((x / rect.width) - 0.5) * 26;
    card.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale3d(1.04, 1.04, 1.04)`;
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
  };

  // Mobile touch move when active
  const handleTouchMove = (e) => {
    if (!isActive3D || e.touches.length !== 1) return;
    const card = cardRef.current;
    if (!card) return;
    const t = e.touches[0];
    const rect = card.getBoundingClientRect();
    const x = t.clientX - rect.left;
    const y = t.clientY - rect.top;
    const rx = -((y / rect.height) - 0.5) * 24;
    const ry = ((x / rect.width) - 0.5) * 24;
    card.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg) scale3d(1.04, 1.04, 1.04)`;
  };

  const handleClick = (e) => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 640 || window.matchMedia('(pointer: coarse)').matches);

    if (!isMobile) {
      // Desktop: single click immediately opens modal
      onOpen?.();
      return;
    }

    // Mobile:
    // First tap -> Activate 3D view
    // Second tap on same active card -> Open modal
    if (!isActive3D) {
      e.stopPropagation();
      onActivate?.();
    } else {
      if (cardRef.current) cardRef.current.style.transform = '';
      onOpen?.();
    }
  };

  return (
    <div
      className="uiv-front-parent"
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.();
        }
      }}
    >
      <div
        ref={cardRef}
        className={`uiv-front-card ${isActive3D ? 'is-active-3d' : ''}`}
      >
        <div className="content-box">
          <span className="card-title">{title}</span>
        </div>
      </div>
    </div>
  );
}
