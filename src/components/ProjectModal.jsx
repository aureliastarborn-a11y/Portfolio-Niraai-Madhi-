import React from 'react';
import { X, ExternalLink, CheckCircle2, Layers } from 'lucide-react';
import { Github } from './Icons';

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {project.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Screenshot Preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              Project Overview
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Architectural Highlights */}
          {project.highlights && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
                Key Engineering Highlights
              </h4>
              <div className="space-y-2">
                {project.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Technology Stack</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Open-source and deployed live
          </div>
          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
            >
              <Github className="w-4 h-4" />
              <span>Source Code</span>
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
