import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, ExternalLink } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { portfolioData } from '../data/portfolioData';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onOpenResume }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section scrollspy
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white focus:outline-none"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-mono shadow-md group-hover:scale-105 transition-transform">
            AM
          </span>
          <div className="flex flex-col">
            <span className="leading-tight group-hover:text-indigo-400 transition-colors">
              {portfolioData.personal.name}
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">
              Portfolio
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Social Links */}
          <a
            href={portfolioData.personal.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={portfolioData.personal.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <ThemeToggle />

          {/* Resume Button */}
          <button
            onClick={onOpenResume}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-b border-slate-800/80 px-4 pt-3 pb-6 mt-3 space-y-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View & Download Resume</span>
            </button>
            <div className="flex justify-center gap-4 pt-1">
              <a
                href={portfolioData.personal.socials.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={portfolioData.personal.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
