import React, { useState, useEffect } from 'react';
import './HamsterWheel.css';

export default function HamsterWheel({ className = '', size = '8px', style = {} }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speedDur, setSpeedDur] = useState('0.85s');

  useEffect(() => {
    let scrollTimeout = null;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const deltaY = Math.abs(currentScrollY - lastScrollY);
      const deltaTime = Math.max(1, now - lastTime);
      const velocity = deltaY / deltaTime; // px per ms

      // Fast scroll -> fast sprint (0.35s), slow scroll -> casual jog (0.9s)
      const duration = Math.max(0.35, Math.min(1.1, 1 / (1 + velocity * 1.5)));
      setSpeedDur(`${duration.toFixed(2)}s`);
      setIsScrolling(true);

      lastScrollY = currentScrollY;
      lastTime = now;

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 160);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div
      aria-label="Hamster running in a wheel while scrolling"
      role="img"
      className={`wheel-and-hamster select-none pointer-events-none ${isScrolling ? 'is-running' : ''} ${className}`}
      style={{
        '--hamster-size': size,
        '--dur': speedDur,
        ...style
      }}
    >
      <div className="wheel" />
      <div className="hamster">
        <div className="hamster__body">
          <div className="hamster__head">
            <div className="hamster__ear" />
            <div className="hamster__eye" />
            <div className="hamster__nose" />
          </div>
          <div className="hamster__limb hamster__limb--fr" />
          <div className="hamster__limb hamster__limb--fl" />
          <div className="hamster__limb hamster__limb--br" />
          <div className="hamster__limb hamster__limb--bl" />
          <div className="hamster__tail" />
        </div>
      </div>
      <div className="spoke" />
    </div>
  );
}
