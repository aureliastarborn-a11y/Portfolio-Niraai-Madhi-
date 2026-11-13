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

          // Dynamic speed mapping according to scrolling speed:
          // Slow scroll (~50px/s) -> 1.35s duration (relaxed stroll)
          // Normal scroll (~500px/s) -> 0.70s duration (steady jog)
          // Fast scroll (~2000px/s+) -> 0.25s duration (turbo sprint)
          const minDur = 0.22;
          const maxDur = 1.4;
          const duration = minDur + (maxDur - minDur) / (1 + Math.pow(currentVelocity / 450, 1.15));

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
