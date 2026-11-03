import React from 'react';
import { ArrowUp, Mail, Heart } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Footer() {
  const { personal, contact } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 relative text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          {/* Logo & Tagline */}
          <div className="space-y-1 text-center md:text-left">
            <a
              href="#hero"
              className="text-base font-bold text-white hover:text-indigo-400 transition-colors inline-block"
            >
              {personal.name}
            </a>
            <p className="text-slate-400 max-w-sm">
              {personal.tagline}
            </p>
          </div>

          {/* Quick Nav Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
            <a href="#about" className="hover:text-indigo-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-indigo-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-indigo-400 transition-colors">Projects</a>
            <a href="#experience" className="hover:text-indigo-400 transition-colors">Experience</a>
            <a href="#education" className="hover:text-indigo-400 transition-colors">Education</a>
            <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>

          {/* Social Icons & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href={personal.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personal.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm ml-2 cursor-pointer"
              aria-label="Scroll to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {personal.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with React, Vite & Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
