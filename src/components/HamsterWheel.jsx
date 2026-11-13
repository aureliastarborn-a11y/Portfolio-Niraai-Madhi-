import React, { useEffect, useRef } from 'react';
import './HamsterWheel.css';

export default function HamsterWheel({ className = '', size = '8px', style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let animId;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let currentVelocity = 0;
    let targetVelocity = 0;
    let isRunning = false;

    const onScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const deltaY = Math.abs(currentScrollY - lastScrollY);
      const deltaTime = Math.max(1, now - lastScrollTime);

      // Instantaneous velocity in pixels per second
      const instantVelocity = (deltaY / deltaTime) * 1000;
      targetVelocity = Math.max(targetVelocity, instantVelocity);

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    const update = () => {
      // Smoothly interpolate current velocity toward target velocity
      currentVelocity += (targetVelocity - currentVelocity) * 0.35;
      // Exponentially decay target velocity when scrolling pauses
      targetVelocity *= 0.88;

      const el = containerRef.current;
      if (el) {
        if (currentVelocity > 15) {
          if (!isRunning) {
            isRunning = true;
            el.classList.add('is-running');
          }

          // Calibrated calm & pleasant running speed:
          // Slow scroll -> ~1.8s (gentle trot)
          // Normal scroll -> ~1.3s - 1.4s (relaxed, cute jog)
          // Fast scroll -> ~0.70s - 0.75s (spirited run, no frantic blur)
          const minDur = 0.65;
          const maxDur = 2.0;
          const duration = minDur + (maxDur - minDur) / (1 + Math.pow(currentVelocity / 600, 1.1));

          el.style.setProperty('--dur', `${duration.toFixed(3)}s`);
        } else {
          if (isRunning) {
            isRunning = false;
            el.classList.remove('is-running');
            currentVelocity = 0;
            targetVelocity = 0;
          }
        }
      }

      animId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Hamster running in a wheel according to scrolling speed"
      role="img"
      className={`wheel-and-hamster select-none pointer-events-none ${className}`}
      style={{
        '--hamster-size': size,
        '--dur': '1s',
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
