import React from 'react';
import { ArrowDown, MapPin, Sparkles, Download, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin, Twitter } from './Icons';
import { portfolioData } from '../data/portfolioData';
import GlassSpheres from './GlassSpheres';

export default function Hero({ onOpenResume }) {
  const { personal } = portfolioData;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* 3D WebGL Glass Spheres */}
      <GlassSpheres />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-violet-600/15 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-7">
        {/* Availability pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/[0.08] text-[13px] text-zinc-300 shadow-lg shadow-black/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{personal.availability}</span>
        </div>

        {/* Name with refractive gradient */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
          <span className="text-zinc-100">Hi, I'm </span>
          <span className="bg-gradient-to-r from-violet-300 via-white to-blue-300 bg-clip-text text-transparent">
            {personal.name}
          </span>
        </h1>

        {/* Role */}
        <p className="text-lg sm:text-xl text-zinc-300 font-medium">
          {personal.role}
        </p>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
          {personal.tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onOpenResume}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-lg shadow-violet-600/25 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Resume</span>
          </button>

          <a
            href="#projects"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass glass-hover text-zinc-300 hover:text-white text-xs font-medium border border-white/[0.08]"
          >
            <span>Explore Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Social Links & Location */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
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

          <span className="flex items-center gap-1.5 text-[13px] text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-violet-400" />
            {personal.location.split('(')[0].trim()}
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8 flex justify-center">
          <a
            href="#about"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors animate-float"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
