import React, { useState, useEffect } from 'react';
import HamsterWheel from './HamsterWheel';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Ensures a smooth preloader experience on page entry
    const minDisplayMs = 1200;
    const start = performance.now();

    const finishLoading = () => {
      const elapsed = performance.now() - start;
      const delay = Math.max(0, minDisplayMs - elapsed);

      setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500); // 500ms smooth fade transition
      }, delay);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
      return () => window.removeEventListener('load', finishLoading);
    }
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-out select-none ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-busy={!fadingOut}
    >
      <div className="flex flex-col items-center gap-6">
        <HamsterWheel size="12px" dur="1s" />
        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-600 font-medium">
            Loading...
          </p>
          <span className="text-[11px] text-zinc-400 font-mono tracking-wide">
            Powering up the portfolio
          </span>
        </div>
      </div>
    </div>
  );
}

