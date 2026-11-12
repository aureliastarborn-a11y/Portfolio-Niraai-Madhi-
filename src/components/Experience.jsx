import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Experience() {
  const { experiences } = portfolioData;

  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          Experience & History
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Professional Milestones & Internships
        </h2>

        {/* Timeline Stack */}
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl glass glass-hover p-6 sm:p-7 space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.05] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-300 border border-violet-500/25">
                      {exp.type}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">
                      {exp.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-2">
                    {exp.role} <span className="text-zinc-500 font-normal">at</span>{' '}
                    <span className="text-violet-300">{exp.organization}</span>
                  </h3>
                </div>

                <div className="text-xs text-zinc-400 font-mono space-y-1 sm:text-right">
                  <div className="flex items-center sm:justify-end gap-1.5 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {exp.description}
              </p>

              {/* Responsibilities list */}
              <div className="space-y-2 pt-1">
                {exp.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{r}</span>
                  </div>
                ))}
              </div>

              {/* Technologies used */}
              <div className="pt-3 border-t border-white/[0.04] flex flex-wrap gap-1.5">
                {exp.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.05] rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
