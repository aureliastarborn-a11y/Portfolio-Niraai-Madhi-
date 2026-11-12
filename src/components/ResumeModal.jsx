import React, { useRef } from 'react';
import { X, Printer, Download, Mail, MapPin } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl glass border border-white/[0.1] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col bg-zinc-950/95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Curriculum Vitae</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-zinc-300">
          <div>
            <h1 className="text-2xl font-bold text-white">{portfolioData.personal.name}</h1>
            <p className="text-violet-400 font-medium text-sm mt-0.5">{portfolioData.personal.role}</p>
            <p className="text-zinc-500 mt-1">{portfolioData.personal.tagline}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Experience</h4>
            {portfolioData.experiences.map((exp) => (
              <div key={exp.id} className="pt-2">
                <div className="flex justify-between font-medium text-white">
                  <span>{exp.role} · {exp.organization}</span>
                  <span className="text-zinc-500 font-mono">{exp.duration}</span>
                </div>
                <p className="text-zinc-400 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <h4 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Education</h4>
            {portfolioData.education.map((edu, i) => (
              <div key={i} className="pt-2">
                <div className="flex justify-between font-medium text-white">
                  <span>{edu.degree}</span>
                  <span className="text-zinc-500 font-mono">{edu.duration}</span>
                </div>
                <p className="text-zinc-400">{edu.institution} · GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
