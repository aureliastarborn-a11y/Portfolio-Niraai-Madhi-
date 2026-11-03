import React, { useRef } from 'react';
import { X, Download, Printer, Mail, MapPin } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  const resumeRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-lg font-semibold text-white">Resume Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="overflow-y-auto p-6 md:p-10 bg-slate-900 text-slate-100 print:bg-white print:text-black">
          <div ref={resumeRef} className="max-w-3xl mx-auto space-y-6 text-sm">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-6 text-center md:text-left md:flex md:justify-between md:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white print:text-black">
                  {portfolioData.personal.name}
                </h1>
                <p className="text-indigo-400 font-medium text-base mt-1 print:text-indigo-700">
                  {portfolioData.personal.role}
                </p>
                <p className="text-slate-400 text-xs mt-1 print:text-slate-600">
                  {portfolioData.personal.tagline}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-xs text-slate-300 space-y-1 print:text-slate-700">
                <div className="flex items-center justify-center md:justify-end gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{portfolioData.personal.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{portfolioData.personal.location}</span>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-3 mt-2">
                  <a
                    href={portfolioData.personal.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-indigo-400"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <span>•</span>
                  <a
                    href={portfolioData.personal.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-300 hover:text-indigo-400"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 border-b border-slate-800 pb-1">
                Professional Summary
              </h2>
              <p className="text-slate-300 leading-relaxed text-xs print:text-slate-800">
                {portfolioData.personal.shortBio}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 border-b border-slate-800 pb-1">
                Technical Skills
              </h2>
              <div className="space-y-1.5 text-xs text-slate-300 print:text-slate-800">
                <p>
                  <strong className="text-white print:text-black">Languages:</strong>{' '}
                  {portfolioData.skills.languages.map(s => s.name).join(', ')}
                </p>
                <p>
                  <strong className="text-white print:text-black">Frameworks & Libraries:</strong>{' '}
                  {portfolioData.skills.frameworks.map(s => s.name).join(', ')}
                </p>
                <p>
                  <strong className="text-white print:text-black">Databases & Storage:</strong>{' '}
                  {portfolioData.skills.databases.map(s => s.name).join(', ')}
                </p>
                <p>
                  <strong className="text-white print:text-black">Developer Tools & DevOps:</strong>{' '}
                  {portfolioData.skills.tools.map(s => s.name).join(', ')}
                </p>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 border-b border-slate-800 pb-1">
                Work Experience & Internships
              </h2>
              <div className="space-y-4">
                {portfolioData.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <h3 className="font-semibold text-white print:text-black text-xs md:text-sm">
                          {exp.role} · <span className="text-indigo-400 print:text-indigo-700">{exp.organization}</span>
                        </h3>
                        <p className="text-[11px] text-slate-400">{exp.location} | {exp.type}</p>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-[11px] text-slate-300 print:text-slate-700">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 border-b border-slate-800 pb-1">
                Featured Key Projects
              </h2>
              <div className="space-y-3">
                {portfolioData.projects.slice(0, 3).map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-white print:text-black text-xs md:text-sm">
                        {p.title}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        {p.techStack.slice(0, 4).join(', ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 print:text-slate-700 mt-0.5">
                      {p.tagline}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 border-b border-slate-800 pb-1">
                  Education
                </h2>
                {portfolioData.education.map((edu, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <p className="font-semibold text-white print:text-black">{edu.degree}</p>
                    <p className="text-slate-300 print:text-slate-700">{edu.institution}</p>
                    <p className="text-slate-400 text-[11px]">{edu.duration} | GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 border-b border-slate-800 pb-1">
                  Certifications
                </h2>
                <div className="space-y-1 text-xs">
                  {portfolioData.certifications.slice(0, 3).map((cert, idx) => (
                    <div key={idx}>
                      <p className="font-medium text-white print:text-black text-[11px]">{cert.name}</p>
                      <p className="text-[10px] text-slate-400">{cert.issuer} · {cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
