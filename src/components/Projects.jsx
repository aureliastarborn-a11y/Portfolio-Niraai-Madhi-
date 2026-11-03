import React, { useState, useMemo } from 'react';
import { ExternalLink, Sparkles, Eye, ArrowUpRight } from 'lucide-react';
import { Github } from './Icons';
import { portfolioData } from '../data/portfolioData';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const { projects } = portfolioData;

  const categories = ['All', 'Full Stack', 'AI & Full Stack', 'Developer Tools'];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory || p.category.includes(activeCategory));
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-24 relative bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Portfolio Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Projects & Case Studies
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore a collection of production-ready applications, open-source utilities, and architectural prototypes.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Project Screenshot / Preview with hover action buttons */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-indigo-600 transition-colors shadow-lg cursor-pointer"
                      title="Quick View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-indigo-600 transition-colors shadow-lg"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg"
                      title="Open Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Category Pill on Image */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-slate-800">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.tagline || project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 text-[11px] font-mono rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Direct Links */}
              <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Details</span>
                </button>
                <div className="flex items-center gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
