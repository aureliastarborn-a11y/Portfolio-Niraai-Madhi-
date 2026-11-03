import React from 'react';
import { 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Layers, 
  Terminal, 
  CheckCircle2, 
  Download 
} from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Hero({ onOpenResume }) {
  const { personal } = portfolioData;

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Intro & Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Availability Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{personal.availability}</span>
            </div>

            {/* Name & Professional Role */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
                  {personal.name}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300 flex items-center justify-center lg:justify-start gap-2">
                <Terminal className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>{personal.role}</span>
              </p>
            </div>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {personal.shortBio}
            </p>

            {/* CTAs & Social Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              {/* Resume Download / View Button */}
              <button
                onClick={onOpenResume}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Download Resume</span>
              </button>

              {/* GitHub Button */}
              <a
                href={personal.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm"
              >
                <Github className="w-4 h-4 text-slate-300" />
                <span>GitHub</span>
              </a>

              {/* LinkedIn Button */}
              <a
                href={personal.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm"
              >
                <Linkedin className="w-4 h-4 text-[#0077B5]" />
                <span>LinkedIn</span>
              </a>

              {/* View Projects Link */}
              <a
                href="#projects"
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-slate-400 hover:text-indigo-300 font-medium text-sm transition-colors"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Metrics Counter Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80">
              {personal.metrics.map((metric, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="text-2xl font-extrabold text-white font-mono">{metric.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Code Card & Engineering Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-5 backdrop-blur-md relative group">
              {/* Decorative top dot bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>developer.config.ts</span>
                </div>
              </div>

              {/* Code representation */}
              <div className="font-mono text-xs space-y-2 text-slate-300">
                <p>
                  <span className="text-indigo-400">const</span>{' '}
                  <span className="text-yellow-300">engineer</span> = &#123;
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">name:</span>{' '}
                  <span className="text-emerald-300">"{personal.name}"</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">role:</span>{' '}
                  <span className="text-emerald-300">"{personal.role}"</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">focus:</span> [
                  <span className="text-cyan-300">"Full-Stack"</span>,{' '}
                  <span className="text-cyan-300">"Distributed Systems"</span>,{' '}
                  <span className="text-cyan-300">"Cloud"</span>
                  ],
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">status:</span>{' '}
                  <span className="text-emerald-400">"Ready to make impact"</span>,
                </p>
                <p className="pl-4">
                  <span className="text-slate-400">coffeeToCodeRatio:</span>{' '}
                  <span className="text-amber-400">Infinity</span>,
                </p>
                <p>&#125;;</p>

                <div className="pt-2 text-slate-400 text-[11px] border-t border-slate-800/80">
                  <span className="text-purple-400 font-semibold">export default</span> engineer;
                </div>
              </div>

              {/* Floating feature pills */}
              <div className="mt-4 pt-3 flex flex-wrap gap-2 border-t border-slate-800">
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Clean Architecture</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Type Safe</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Fast Delivery</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
