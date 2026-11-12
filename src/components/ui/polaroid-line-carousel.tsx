"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

export interface PolaroidSlide {
  image?: string;
  title: string;
  caption?: string;
  alt?: string;
}

export interface PolaroidLineCarouselProps {
  slides: PolaroidSlide[];
  height?: string;
  cardWidth?: number;
  sag?: number;
  swing?: number;
  autoplay?: number;
  string?: string;
  background?: string;
  ink?: string;
  showBar?: boolean;
  onChange?: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function stringY(x: number, width: number, top: number, sag: number) {
  const r = clamp(x / width, 0, 1);
  return top + 4 * sag * r * (1 - r);
}

function springStep(pos: number, vel: number, target: number, dt: number, stiffness = 70) {
  const damping = 2 * Math.sqrt(stiffness);
  const accel = stiffness * (target - pos) - damping * vel;
  const newVel = vel + accel * dt;
  return [pos + newVel * dt, newVel];
}

function swingStep(angle: number, angVel: number, force: number, dt: number, swing: number) {
  const accel = -38 * angle - 4.2 * angVel + force * 0.0034 * swing;
  const newAngVel = angVel + accel * dt;
  return [clamp(angle + newAngVel * dt, -0.6, 0.6), newAngVel];
}

function nearestAt(off: number, spacing: number, count: number) {
  return clamp(Math.round(off / spacing), 0, Math.max(0, count - 1));
}

function pad2(n: number) {
  return n < 10 ? "0" + n : String(n);
}

const CAROUSEL_STYLES = `
.pl-root {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--pl-bg);
  color: var(--pl-ink);
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  outline: none;
  cursor: grab;
  border-radius: 1rem;
}
.pl-root[data-drag='1'] {
  cursor: grabbing;
}
.pl-root:focus-visible {
  box-shadow: inset 0 0 0 2px var(--pl-ink);
}
.pl-string {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}
.pl-card {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--pl-cw);
  transform-origin: 50% 0;
  will-change: transform;
  cursor: inherit;
}
.pl-print {
  margin-top: 5px;
  background: #fbfaf7;
  padding: 5px 5px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 10px 18px -8px rgba(0,0,0,.22);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 3px;
  transition: transform .5s cubic-bezier(.2,.7,.2,1), filter .5s ease;
}
.pl-card[data-on='0'] .pl-print {
  transform: scale(.92);
  filter: saturate(.75) brightness(.97);
}
.pl-shot {
  position: relative;
  aspect-ratio: 1.15;
  overflow: hidden;
  background: #ece8df;
  border-radius: 2px;
}
.pl-shot img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
.pl-note {
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  font-family: ui-serif, Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 10px;
  line-height: 1.15;
  color: #2e2b26;
  text-align: center;
}
.pl-peg {
  position: absolute;
  left: 50%;
  top: 0;
  width: 7px;
  height: 18px;
  margin-left: -3.5px;
  border-radius: 1.5px;
  background: linear-gradient(90deg, #c9a67a, #e3c9a1 45%, #b8915f);
  box-shadow: 0 1.5px 2.5px rgba(0,0,0,.22);
  z-index: 10;
}
.pl-peg::after {
  content: '';
  position: absolute;
  left: 2.5px;
  top: 5px;
  width: 1.5px;
  height: 5px;
  background: rgba(80,60,30,.45);
  border-radius: 1px;
}
.pl-bar {
  position: absolute;
  left: clamp(16px, 4vw, 40px);
  right: clamp(16px, 4vw, 40px);
  bottom: clamp(14px, 2.5vh, 24px);
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 20px);
  cursor: default;
}
.pl-cap {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding-bottom: .15em;
}
.pl-cap > * {
  display: block;
  animation: pl-in .55s cubic-bezier(.2,.8,.2,1) both;
}
.pl-title {
  font-family: ui-serif, Georgia, 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(15px, 1.8vw, 19px);
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--pl-ink);
}
.pl-sub {
  margin-top: 3px;
  font-size: 12.5px;
  line-height: 1.35;
  color: var(--pl-muted);
  font-family: system-ui, -apple-system, sans-serif;
}
.pl-count {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  letter-spacing: .14em;
  color: var(--pl-muted);
}
.pl-count b {
  color: var(--pl-ink);
  font-weight: 600;
}
.pl-btn {
  appearance: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--pl-line);
  background: white;
  color: var(--pl-ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all .2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.pl-btn:hover {
  background: var(--pl-ink);
  color: white;
}
.pl-btn:focus-visible {
  outline: 2px solid var(--pl-ink);
  outline-offset: 2px;
}
.pl-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes pl-in {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pl-cap > * {
    animation: none;
  }
  .pl-print {
    transition: none;
  }
}
`;

export default function PolaroidLineCarousel({
  slides = [],
  height = "220px",
  cardWidth = 130,
  sag = 18,
  swing = 1,
  autoplay = 4000,
  string = "#8a7f72",
  background = "transparent",
  ink = "#18181b",
  showBar = false,
  onChange,
  className,
  style,
  ariaLabel = "Polaroid carousel",
}: PolaroidLineCarouselProps) {
  const count = slides.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dims, setDims] = useState({ w: 800, h: 220, cw: cardWidth });

  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stateRef = useRef({
    off: 0,
    vel: 0,
    target: 0,
    a: [] as number[],
    w: [] as number[],
  });
  const pointerRef = useRef<{
    x: number;
    off: number;
    lx: number;
    lt: number;
    v: number;
    moved: boolean;
  } | null>(null);
  const lastInteractRef = useRef(0);
  const currentIdxRef = useRef(0);
  const physicsRef = useRef({ sag, swing });
  physicsRef.current = { sag, swing };

  const spacing = dims.cw * 1.1;

  const goTo = useCallback(
    (index: number) => {
      stateRef.current.target = clamp(index, 0, count - 1) * spacing;
    },
    [count, spacing]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const calculatedCw = Math.round(
        Math.max(105, Math.min(cardWidth, rect.width * 0.28, rect.height * 0.65))
      );
      setDims({ w: rect.width, h: rect.height, cw: calculatedCw });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardWidth]);

  useEffect(() => {
    stateRef.current.target = currentIdxRef.current * spacing;
    stateRef.current.off = currentIdxRef.current * spacing;
  }, [spacing]);

  useEffect(() => {
    onChange?.(activeIdx);
  }, [activeIdx, onChange]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let isVisible = true;
    let animId = 0;
    let lastTime = performance.now();
    const st = stateRef.current;

    const tick = (now: number) => {
      animId = 0;
      if (!isVisible) return;
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      const { w, h, cw } = dims;
      const stringTop = Math.max(30, h * 0.16);
      const ptr = pointerRef.current;
      let force = 0;

      if (ptr && ptr.moved) {
        force = ptr.v * 1000;
      } else {
        const prevOff = st.off;
        [st.off, st.vel] = springStep(st.off, st.vel, st.target, dt);
        force = -(st.off - prevOff) / Math.max(dt, 0.001);
      }

      const { sag: currentSag, swing: currentSwing } = physicsRef.current;
      const swingMultiplier = prefersReducedMotion ? 0 : currentSwing;
      const nearest = nearestAt(st.off, spacing, count);

      for (let i = 0; i < count; i++) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const posX = w / 2 + i * spacing - st.off;
        if (posX < -cw * 1.5 || posX > w + cw * 1.5) {
          cardEl.style.visibility = "hidden";
          continue;
        }
        cardEl.style.visibility = "visible";

        let angle = st.a[i] || 0;
        let angVel = st.w[i] || 0;
        [angle, angVel] = swingStep(
          angle,
          angVel,
          force,
          dt,
          swingMultiplier
        );
        if (swingMultiplier) {
          angle += Math.sin(now / 1300 + i * 1.7) * 0.0009 * swingMultiplier;
        }
        st.a[i] = angle;
        st.w[i] = angVel;

        const posY = stringY(posX, w, stringTop, currentSag) - 6;
        cardEl.style.transform = `translate(${(posX - cw / 2).toFixed(1)}px, ${posY.toFixed(1)}px) rotate(${angle.toFixed(4)}rad)`;
        cardEl.style.zIndex = String(
          i === nearest ? count + 1 : count - Math.abs(i - nearest)
        );
      }

      if (pathRef.current) {
        pathRef.current.setAttribute(
          "d",
          `M0 ${stringTop} Q${w / 2} ${stringTop + 2 * currentSag} ${w} ${stringTop}`
        );
      }

      if (nearest !== currentIdxRef.current) {
        currentIdxRef.current = nearest;
        setActiveIdx(nearest);
      }

      animId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
    };
  }, [dims, spacing, count]);

  useEffect(() => {
    if (!autoplay || count < 2) return;
    const timer = window.setInterval(() => {
      if (
        document.hidden ||
        pointerRef.current ||
        performance.now() - lastInteractRef.current < autoplay
      ) {
        return;
      }
      goTo(currentIdxRef.current >= count - 1 ? 0 : currentIdxRef.current + 1);
    }, autoplay);
    return () => window.clearInterval(timer);
  }, [autoplay, count, goTo]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".pl-bar")) return;
    lastInteractRef.current = performance.now();
    pointerRef.current = {
      x: e.clientX,
      off: stateRef.current.off,
      lx: e.clientX,
      lt: e.timeStamp,
      v: 0,
      moved: false,
    };
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ptr = pointerRef.current;
    if (!ptr) return;
    const dx = e.clientX - ptr.x;
    if (!ptr.moved && Math.abs(dx) > 5) {
      ptr.moved = true;
      setIsDragging(true);
      try {
        rootRef.current?.setPointerCapture(e.pointerId);
      } catch (_) {}
    }
    if (!ptr.moved) return;

    const dt = Math.max(1, e.timeStamp - ptr.lt);
    ptr.v = 0.7 * ((e.clientX - ptr.lx) / dt) + 0.3 * ptr.v;
    ptr.lx = e.clientX;
    ptr.lt = e.timeStamp;

    const maxOff = (count - 1) * spacing;
    let nextOff = ptr.off - dx;
    if (nextOff < 0) nextOff *= 0.35;
    if (nextOff > maxOff) nextOff = maxOff + (nextOff - maxOff) * 0.35;
    stateRef.current.off = nextOff;
  };

  const onUp = () => {
    const ptr = pointerRef.current;
    pointerRef.current = null;
    lastInteractRef.current = performance.now();
    if (!ptr) return;

    if (ptr.moved) {
      setIsDragging(false);
      stateRef.current.vel = -ptr.v * 1000;
      goTo(nearestAt(stateRef.current.off - ptr.v * 180, spacing, count));
      return;
    }
  };

  const step = (delta: number) => {
    lastInteractRef.current = performance.now();
    goTo(clamp(currentIdxRef.current + delta, 0, count - 1));
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      step(1);
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      step(-1);
      e.preventDefault();
    }
  };

  const activeSlide = slides[activeIdx] || { title: "" };

  return (
    <div
      ref={rootRef}
      className={["pl-root", className].filter(Boolean).join(" ")}
      style={
        {
          height,
          "--pl-bg": background,
          "--pl-ink": ink,
          "--pl-muted": "color-mix(in srgb, var(--pl-ink) 60%, transparent)",
          "--pl-line": "color-mix(in srgb, var(--pl-ink) 18%, transparent)",
          "--pl-cw": `${dims.cw}px`,
          ...style,
        } as React.CSSProperties
      }
      data-drag={isDragging ? "1" : "0"}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <style>{CAROUSEL_STYLES}</style>

      {/* ── THE CLOTHESLINE SVG STRING ── */}
      <svg className="pl-string" aria-hidden="true">
        <path
          ref={pathRef}
          fill="none"
          stroke={string}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* ── POLAROID CARDS HANGING FROM CLOTHESPINS ── */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="pl-card"
          data-i={idx}
          data-on={idx === activeIdx ? "1" : "0"}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
          aria-hidden={idx === activeIdx ? undefined : true}
          onClick={() => goTo(idx)}
        >
          <div className="pl-print">
            <div className="pl-shot">
              {slide.image && (
                <img
                  src={slide.image}
                  alt={slide.alt || slide.title || ""}
                  draggable={false}
                />
              )}
            </div>
            <div className="pl-note">{slide.title}</div>
          </div>
          <div className="pl-peg" />
        </div>
      ))}

      {/* ── OPTIONAL BOTTOM CONTROLS & CAPTION BAR ── */}
      {showBar && (
        <div className="pl-bar">
          <div className="pl-cap" aria-hidden="true" key={activeIdx}>
            {activeSlide.title && (
              <span className="pl-title">{activeSlide.title}</span>
            )}
            {activeSlide.caption && (
              <span className="pl-sub">{activeSlide.caption}</span>
            )}
          </div>

          <span className="pl-count" aria-hidden="true">
            <b>{pad2(activeIdx + 1)}</b> / {pad2(count)}
          </span>

          <button
            type="button"
            className="pl-btn"
            aria-label="Previous credential"
            onClick={() => step(-1)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className="pl-btn"
            aria-label="Next credential"
            onClick={() => step(1)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m6 3 5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="pl-sr" aria-live="polite">
        Credential {activeIdx + 1} of {count}: {activeSlide.title}
      </div>
    </div>
  );
}

