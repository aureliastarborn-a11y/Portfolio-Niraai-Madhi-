import React from 'react';
import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle2, ChevronRight, Building2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Experience() {
  const { experiences } = portfolioData;

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience & Internships
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Proven track record of shipping production code, optimizing performance, and collaborating in agile teams.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Timeline Rule */}
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500 to-transparent opacity-30" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative md:pl-20 group"
              >
                {/* Timeline node icon on desktop */}
                <div className="hidden md:flex absolute left-5 top-6 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-900 border-2 border-indigo-500 text-indigo-400 items-center justify-center shadow-md group-hover:scale-125 group-hover:border-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>

                {/* Experience Card */}
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-300 shadow-lg">
                  {/* Card Header: Role & Org */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {exp.type}
                        </span>
                        <span className="text-xs text-emerald-400 font-medium">
                          {exp.status}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-indigo-400 font-medium text-xs sm:text-sm mt-0.5">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                        <span>{exp.organization}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end text-xs text-slate-400 space-y-1">
                      <div className="flex items-center gap-1.5 font-mono text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Overview sentence */}
                  <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Bullet Responsibilities */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Key Responsibilities & Impact:
                    </h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">
                      Technologies:
                    </span>
                    {exp.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
