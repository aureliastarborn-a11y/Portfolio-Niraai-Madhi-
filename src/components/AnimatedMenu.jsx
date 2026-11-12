import React, { useState } from 'react';
import { Home, User, Code, FolderGit2, Briefcase, GraduationCap, Mail, FileText } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function AnimatedMenu({ onOpenResume }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const menuItems = [
    { label: 'Home', icon: Home, href: '#hero' },
    { label: 'About', icon: User, href: '#about' },
    { label: 'Skills', icon: Code, href: '#skills' },
    { label: 'Projects', icon: FolderGit2, href: '#projects' },
    { label: 'Experience', icon: Briefcase, href: '#experience' },
    { label: 'Education', icon: GraduationCap, href: '#education' },
    { label: 'Contact', icon: Mail, href: '#contact' },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
      <nav className="pointer-events-auto flex items-center gap-1.5 p-2 rounded-2xl bg-zinc-950/75 backdrop-blur-2xl border border-white/[0.1] shadow-2xl shadow-black/60 transition-all duration-300">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === idx;
          return (
            <a
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200 group flex items-center justify-center cursor-pointer"
              aria-label={item.label}
            >
              <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-115" />

              {/* Animated Floating Tooltip */}
              {isHovered && (
                <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.1] text-[11px] font-medium text-white shadow-xl whitespace-nowrap pointer-events-none animate-fade-in-up">
                  {item.label}
                </div>
              )}
            </a>
          );
        })}

        <div className="w-px h-5 bg-white/[0.08] mx-1" />

        {/* Resume Trigger */}
        <button
          onClick={onOpenResume}
          onMouseEnter={() => setHoveredIdx(99)}
          onMouseLeave={() => setHoveredIdx(null)}
          className="relative p-2.5 rounded-xl text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-200 flex items-center justify-center cursor-pointer group"
          title="Resume"
        >
          <FileText className="w-4 h-4 transition-transform duration-200 group-hover:scale-115" />
          {hoveredIdx === 99 && (
            <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/[0.1] text-[11px] font-medium text-violet-300 shadow-xl whitespace-nowrap pointer-events-none animate-fade-in-up">
              Resume
            </div>
          )}
        </button>
      </nav>
    </div>
  );
}

