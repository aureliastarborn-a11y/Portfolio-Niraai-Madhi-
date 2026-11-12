import React, { useState } from 'react';
import { GraduationCap, Award, BookOpen, ExternalLink, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Education() {
  const [filter, setFilter] = useState('all');
  const { education, certifications, workshops } = portfolioData;

  return (
    <section id="education" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          Academics & Credentials
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Education & Certifications
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'degrees', label: 'Degrees' },
              { id: 'certs', label: 'Certifications' },
              { id: 'workshops', label: 'Workshops' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  filter === t.id
                    ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                    : 'text-zinc-500 hover:text-zinc-300 bg-white/[0.02] border border-white/[0.04]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Degree */}
          {(filter === 'all' || filter === 'degrees') && education.map((edu, idx) => (
            <div
              key={idx}
              className="md:col-span-2 rounded-2xl glass glass-hover p-6 sm:p-7 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.05] pb-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-500/15 text-violet-300 border border-violet-500/25">
                    Formal Education
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{edu.degree}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{edu.institution}</p>
                </div>
                <div className="text-xs text-zinc-400 font-mono space-y-1 sm:text-right">
                  <div className="text-zinc-300">{edu.duration}</div>
                  <div className="text-emerald-400 font-medium">GPA: {edu.gpa}</div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Coursework
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {edu.courses.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.05] rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Certifications */}
          {(filter === 'all' || filter === 'certs') && certifications.map((cert, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass glass-hover p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Award className="w-5 h-5 text-violet-400 shrink-0" />
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <h4 className="text-sm font-bold text-white mt-3">{cert.name}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{cert.issuer}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                <span>{cert.date}</span>
                <span>{cert.credentialId}</span>
              </div>
            </div>
          ))}

          {/* Workshops */}
          {(filter === 'all' || filter === 'workshops') && workshops.map((ws, idx) => (
            <div
              key={idx}
              className="rounded-2xl glass glass-hover p-5 space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span className="text-violet-400">{ws.duration}</span>
                <span>{ws.organizer}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{ws.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{ws.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
