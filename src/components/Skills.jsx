import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Coffee, 
  Binary, 
  Database, 
  Globe, 
  Atom, 
  Zap, 
  Server, 
  Palette, 
  Activity, 
  Layers, 
  Network, 
  HardDrive, 
  CloudRain, 
  Table, 
  GitBranch, 
  Box, 
  Cloud, 
  TerminalSquare, 
  Send, 
  Compass, 
  Workflow, 
  Search, 
  Sparkles,
  FileCode
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

// Icon lookup dictionary
const skillIcons = {
  Code2,
  FileCode,
  Terminal,
  Cpu,
  Coffee,
  Binary,
  Database,
  Globe,
  Atom,
  Zap,
  Server,
  Palette,
  Activity,
  Layers,
  Network,
  HardDrive,
  CloudRain,
  Table,
  GitBranch,
  Box,
  Cloud,
  TerminalSquare,
  Send,
  Compass,
  Workflow
};

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { skills } = portfolioData;

  // Flatten all skills with their parent category name
  const allSkills = useMemo(() => {
    return [
      ...skills.languages.map(s => ({ ...s, section: 'Languages' })),
      ...skills.frameworks.map(s => ({ ...s, section: 'Frameworks' })),
      ...skills.databases.map(s => ({ ...s, section: 'Databases' })),
      ...skills.tools.map(s => ({ ...s, section: 'Developer Tools' }))
    ];
  }, [skills]);

  // Categories list
  const categories = [
    { id: 'All', label: 'All Skills', count: allSkills.length },
    { id: 'Languages', label: 'Languages', count: skills.languages.length },
    { id: 'Frameworks', label: 'Frameworks', count: skills.frameworks.length },
    { id: 'Databases', label: 'Databases', count: skills.databases.length },
    { id: 'Developer Tools', label: 'Developer Tools', count: skills.tools.length }
  ];

  // Filter skills based on selected category & search query
  const filteredSkills = useMemo(() => {
    return allSkills.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.section === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.section.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allSkills, selectedCategory, searchQuery]);

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Skills
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Modern toolchains, languages, and frameworks I use to engineer robust, scalable software.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-700/80 text-indigo-100'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Real-time search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill (e.g. React, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill, index) => {
            const IconComponent = skillIcons[skill.icon] || Code2;
            return (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        skill.badge === 'Expert'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : skill.badge === 'Advanced'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {skill.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {skill.section}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>Proficiency</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 group-hover:brightness-110"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* If no skills matched search */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            No technical skills found matching "<span className="text-white">{searchQuery}</span>". Try another keyword!
          </div>
        )}

      </div>
    </section>
  );
}
