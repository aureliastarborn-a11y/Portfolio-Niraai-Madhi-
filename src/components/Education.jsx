import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Cloud, 
  Layers, 
  Database, 
  Box 
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

// Icon map for certifications
const certIcons = {
  Cloud,
  Layers,
  Database,
  Box
};

export default function Education() {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'education', 'certifications', 'workshops'
  const { education, certifications, workshops } = portfolioData;

  return (
    <section id="education" className="py-24 relative bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic & Professional Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & Certifications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Academic foundations, industry certifications, and specialized hands-on technical workshops.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Credentials' },
            { id: 'education', label: 'College & Degree' },
            { id: 'certifications', label: 'Certifications' },
            { id: 'workshops', label: 'Workshops & Bootcamps' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          
          {/* 1. College Details & Degree */}
          {(activeTab === 'all' || activeTab === 'education') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span>Formal University Education</span>
              </div>

              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-lg space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Undergraduate Degree
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                        {edu.degree}
                      </h3>
                      <p className="text-sm font-medium text-indigo-300 mt-0.5">
                        {edu.institution}
                      </p>
                    </div>

                    <div className="flex flex-col md:items-end text-xs text-slate-400 space-y-1 font-mono">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{edu.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{edu.location}</span>
                      </div>
                      <div className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1">
                        GPA: {edu.gpa}
                      </div>
                    </div>
                  </div>

                  {/* Coursework & Activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Relevant Core Coursework</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.courses.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Honors & Campus Leadership</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {edu.activities.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Industry Certifications */}
          {(activeTab === 'all' || activeTab === 'certifications') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Verified Industry Certifications</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, idx) => {
                  const Icon = certIcons[cert.badgeIcon] || Award;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {cert.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {cert.issuer}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{cert.date}</span>
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Workshops & Bootcamps */}
          {(activeTab === 'all' || activeTab === 'workshops') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Specialized Technical Workshops</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshops.map((ws, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-2 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">
                        {ws.duration}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {ws.organizer}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {ws.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {ws.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
