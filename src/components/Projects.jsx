import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, Eye } from 'lucide-react';
import { Github } from './Icons';
import { portfolioData } from '../data/portfolioData';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState(null);
  const { projects } = portfolioData;

  const categories = ['All', 'Full Stack', 'AI & Full Stack', 'Developer Tools'];

  const filtered = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory || p.category.includes(selectedCategory));

  return (
    <section id="projects" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          Project Gallery
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Selected Work & Screenshots
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-lg">
              Explore interactive prototypes, enterprise architectures, and production platforms.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                    : 'text-zinc-500 hover:text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Screenshot Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={proj.id}
                className={`rounded-2xl glass glass-hover p-4 sm:p-5 flex flex-col justify-between group ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Browser Mockup Window Header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/70 border border-white/[0.05] rounded-t-xl text-[10px] text-zinc-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-zinc-400 truncate max-w-[150px]">{proj.title}</span>
                    <span className="text-violet-400 text-[9px]">{proj.category}</span>
                  </div>

                  {/* Screenshot Thumbnail with Glass Overlay */}
                  <div className="relative aspect-video rounded-b-xl overflow-hidden bg-zinc-950 border-x border-b border-white/[0.05] mb-4">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    
                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
                      <button
                        onClick={() => setActiveProject(proj)}
                        className="p-2.5 rounded-full bg-zinc-900/90 text-white hover:bg-violet-600 transition-colors shadow-lg cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-zinc-900/90 text-white hover:bg-violet-600 transition-colors shadow-lg"
                        title="View GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg"
                        title="Open Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                    {proj.tagline || proj.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {proj.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.05] rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.05]">
                  <button
                    onClick={() => setActiveProject(proj)}
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View Architecture</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors border border-white/[0.05]"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium shadow-sm transition-all"
                      title="Live Demo"
                    >
                      <span>Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick View Modal */}
      <ProjectModal
        project={activeProject}
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
