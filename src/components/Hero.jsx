import React from 'react';
import { ArrowDown, MapPin, Sparkles } from 'lucide-react';
import { Github, Linkedin, Twitter } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Hero() {
  const { personal } = portfolioData;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/[0.08] text-[13px] text-zinc-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          {personal.availability}
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          <span className="text-zinc-100">Hi, I'm </span>
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            {personal.name}
          </span>
        </h1>

        {/* Role */}
        <p className="text-lg sm:text-xl text-zinc-400 font-medium">
          {personal.role}
        </p>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
          {personal.tagline}
        </p>

        {/* Social links + Location */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={personal.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl glass glass-hover text-zinc-400 hover:text-white"
            aria-label="GitHub"
          >
            <Github className="w-[18px] h-[18px]" />
          </a>
          <a
            href={personal.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl glass glass-hover text-zinc-400 hover:text-white"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-[18px] h-[18px]" />
          </a>
          <a
            href={personal.socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl glass glass-hover text-zinc-400 hover:text-white"
            aria-label="Twitter"
          >
            <Twitter className="w-[18px] h-[18px]" />
          </a>

          <div className="w-px h-5 bg-white/[0.08] mx-1" />

          <span className="flex items-center gap-1.5 text-[13px] text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            {personal.location.split('(')[0].trim()}
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="pt-12 flex justify-center">
          <a
            href="#about"
            className="p-2 rounded-full text-zinc-600 hover:text-zinc-400 transition-colors animate-float"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
