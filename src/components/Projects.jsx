import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight } from 'lucide-react';
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
          Featured Work
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Selected Projects & Case Studies
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-lg">
              Explore open-source systems, cloud architectures, and full-stack software.
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

        {/* Bento / Asymmetric Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj, idx) => {
            const isFeatured = idx === 0;
            return (
              <div
                key={proj.id}
                className={`rounded-2xl glass glass-hover p-5 flex flex-col justify-between group ${
                  isFeatured ? 'md:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Thumbnail / Image with subtle glass overlay */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.06] mb-5">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-medium rounded-lg glass border border-white/[0.1] text-zinc-200 backdrop-blur-md">
                      {proj.category}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed line-clamp-2">
                    {proj.tagline || proj.description}
                  </p>

                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
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
                <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.05]">
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
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors border border-white/[0.05]"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-medium shadow-sm transition-all"
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
