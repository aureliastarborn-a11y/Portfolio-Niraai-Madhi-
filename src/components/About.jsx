import React from 'react';
import { MapPin, GraduationCap, Briefcase, Calendar, Code2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function About() {
  const { personal, education, careerInterests } = portfolioData;
  const edu = education[0];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Section label */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium mb-8">
          <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          About
        </div>

        {/* ── Bento Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Card 1: Profile Photo — spans 1 col, 2 rows */}
          <div className="md:row-span-2 rounded-2xl glass glass-hover overflow-hidden group relative">
            <div className="aspect-[3/4] md:h-full overflow-hidden">
              <img
                src={personal.profileImage}
                alt={personal.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-violet-900/80 to-zinc-900 text-white text-5xl font-bold">
                {personal.fallbackAvatar}
              </div>
            </div>
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-5">
              <h3 className="text-lg font-semibold text-white">{personal.name}</h3>
              <p className="text-xs text-violet-400 font-medium mt-0.5">{personal.role}</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
                <MapPin className="w-3 h-3" />
                {personal.location.split('(')[0].trim()}
              </div>
            </div>
          </div>

          {/* Card 2: Bio */}
          <div className="md:col-span-2 rounded-2xl glass glass-hover p-6 flex flex-col justify-between">
            <div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {personal.shortBio}
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed mt-4">
                {personal.extendedBio}
              </p>
            </div>
          </div>

          {/* Card 3: Education */}
          <div className="rounded-2xl glass glass-hover p-5 space-y-3">
            <div className="flex items-center gap-2 text-violet-400">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Education</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">{edu.degree}</p>
              <p className="text-xs text-zinc-400 mt-1">{edu.institution}</p>
              <div className="flex items-center gap-2 mt-2.5 text-[11px] text-zinc-500 font-mono">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  GPA: {edu.gpa}
                </span>
                <span>{edu.duration.split('(')[0].trim()}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Quick Metrics */}
          <div className="rounded-2xl glass glass-hover p-5">
            <div className="grid grid-cols-2 gap-4">
              {personal.metrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-2xl font-bold text-white font-mono">{m.value}</div>
                  <div className="text-[11px] text-zinc-500">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Career Interests Row ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {careerInterests.map((interest, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass glass-hover p-5 space-y-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-500/20 group-hover:scale-110 transition-all">
                <Code2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                {interest.title}
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {interest.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
