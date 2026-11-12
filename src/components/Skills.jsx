import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';

const categoryMap = {
  All: null,
  Languages: 'languages',
  Frameworks: 'frameworks',
  Databases: 'databases',
  Tools: 'tools',
};

export default function Skills() {
  const [active, setActive] = useState('All');
  const { skills } = portfolioData;

  const allSkills = [
    ...skills.languages.map(s => ({ ...s, section: 'Languages' })),
    ...skills.frameworks.map(s => ({ ...s, section: 'Frameworks' })),
    ...skills.databases.map(s => ({ ...s, section: 'Databases' })),
    ...skills.tools.map(s => ({ ...s, section: 'Tools' })),
  ];

  const filtered = active === 'All'
    ? allSkills
    : allSkills.filter(s => s.section === active);

  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section label */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          Skills
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Technical Arsenal
        </h2>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(categoryMap).map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                active === cat
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25'
                  : 'text-zinc-500 hover:text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((skill, idx) => (
            <div
              key={idx}
              className="rounded-xl glass glass-hover p-4 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors">
                  {skill.name}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                  <span>{skill.section}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>

              <div className="mt-2.5">
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    skill.badge === 'Expert'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : skill.badge === 'Advanced'
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06]'
                  }`}
                >
                  {skill.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
