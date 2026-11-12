import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';

const DOCK_SECTIONS = [
  { id: 'about', num: '1', label: 'About' },
  { id: 'skills', num: '2', label: 'Technical skills' },
  { id: 'projects', num: '3', label: 'Projects' },
  { id: 'experience', num: '4', label: 'Experience' },
  { id: 'education', num: '5', label: 'Education' },
  { id: 'contact', num: '6', label: 'Contact' },
];

export default function FloatingDock() {
  const [mode, setMode] = useState('dock'); // 'dock' | 'sections' | 'contact'
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const dockRef = useRef(null);
  const { personal } = portfolioData;

  const DOCK_SOCIALS = [
    { label: 'LinkedIn', dest: 'Connect', href: personal.linkedin },
    { label: 'GitHub', dest: 'Code', href: personal.github },
    { label: 'Email', dest: personal.email, href: `mailto:${personal.email}` },
    { label: 'Phone', dest: personal.phone, href: `tel:${personal.phone}` },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setMode('dock');
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMode('dock');
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMode('dock');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMode('dock');
  };

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4 select-none">
      <div
        ref={dockRef}
        className="pointer-events-auto relative bg-black text-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-300 ease-out overflow-hidden"
        style={{
          width: mode === 'dock' ? '146px' : '268px',
        }}
      >
        {/* ── MODE: DOCK (Collapsed 3 icons) ───────────────── */}
        {mode === 'dock' && (
          <div className="h-11 px-1.5 flex items-center justify-between">
            {/* Home Button */}
            <div className="relative group">
              <button
                type="button"
                onClick={scrollToTop}
                onMouseEnter={() => setHoveredBtn('home')}
                onMouseLeave={() => setHoveredBtn(null)}
                aria-label="Home"
                className="size-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {hoveredBtn === 'home' && (
                <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 rounded-[9px] bg-black px-2.5 py-1 text-[11px] text-white shadow-[0_0_0_1px_#ffffff1f,0_6px_20px_#00000040] pointer-events-none whitespace-nowrap">
                  Home
                </div>
              )}
            </div>

            {/* Sections Menu Button */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setMode('sections')}
                onMouseEnter={() => setHoveredBtn('sections')}
                onMouseLeave={() => setHoveredBtn(null)}
                aria-label="Sections"
                className="size-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6L20 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M4 12L20 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M4 18L20 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              {hoveredBtn === 'sections' && (
                <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 rounded-[9px] bg-black px-2.5 py-1 text-[11px] text-white shadow-[0_0_0_1px_#ffffff1f,0_6px_20px_#00000040] pointer-events-none whitespace-nowrap">
                  Sections
                </div>
              )}
            </div>

            {/* Contact / Socials Button */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setMode('contact')}
                onMouseEnter={() => setHoveredBtn('contact')}
                onMouseLeave={() => setHoveredBtn(null)}
                aria-label="Socials & email"
                className="size-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15.6 8.40033V12.9003C15.6 14.3915 16.8088 15.6003 18.3 15.6003C19.7912 15.6003 21 14.3915 21 12.9003V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C14.0265 21 15.8965 20.3302 17.4009 19.2M15.6 12.0003C15.6 13.9886 13.9882 15.6003 12 15.6003C10.0118 15.6003 8.4 13.9886 8.4 12.0003C8.4 10.0121 10.0118 8.40033 12 8.40033C13.9882 8.40033 15.6 10.0121 15.6 12.0003Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {hoveredBtn === 'contact' && (
                <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 rounded-[9px] bg-black px-2.5 py-1 text-[11px] text-white shadow-[0_0_0_1px_#ffffff1f,0_6px_20px_#00000040] pointer-events-none whitespace-nowrap">
                  Socials &amp; email
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODE: SECTIONS LIST ──────────────────────────── */}
        {mode === 'sections' && (
          <div className="p-2 space-y-0.5 animate-fadeIn">
            {DOCK_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className="w-full h-10 px-3.5 rounded-[16px] flex items-center gap-3 text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/12 transition-colors cursor-pointer"
              >
                <span className="w-4 text-zinc-500 font-normal tabular-nums">{sec.num}</span>
                <span>{sec.label}</span>
              </button>
            ))}

            <div className="h-px bg-white/10 my-1" />

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setMode('dock')}
              className="w-full h-10 px-3.5 rounded-[16px] flex items-center gap-2.5 text-left text-[13px] text-zinc-400 hover:text-white hover:bg-white/12 transition-colors cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M5.5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M11 17L5.5 12L11 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        )}

        {/* ── MODE: SOCIALS & EMAIL LIST ───────────────────── */}
        {mode === 'contact' && (
          <div className="p-2 space-y-0.5 animate-fadeIn">
            {DOCK_SOCIALS.map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                target={soc.href.startsWith('mailto') || soc.href.startsWith('tel') ? '_self' : '_blank'}
                rel="noreferrer"
                className="w-full h-10 px-3.5 rounded-[16px] flex items-center justify-between text-left text-[14px] font-medium text-white/90 hover:text-white hover:bg-white/12 transition-colors"
              >
                <span>{soc.label}</span>
                <span className="text-zinc-500 text-[12px] truncate max-w-[140px] text-right">{soc.dest}</span>
              </a>
            ))}

            <div className="h-px bg-white/10 my-1" />

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setMode('dock')}
              className="w-full h-10 px-3.5 rounded-[16px] flex items-center gap-2.5 text-left text-[13px] text-zinc-400 hover:text-white hover:bg-white/12 transition-colors cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none">
                <path d="M5.5 12H19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M11 17L5.5 12L11 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
