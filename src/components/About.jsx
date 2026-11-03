import React from 'react';
import { 
  GraduationCap, 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Cloud, 
  Layout, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

// Map icon string names to Lucide icons
const iconMap = {
  Cloud: Cloud,
  Layout: Layout,
  ShieldCheck: ShieldCheck,
  Cpu: Cpu
};

export default function About() {
  const { personal, education, careerInterests } = portfolioData;
  const primaryEducation = education[0];

  return (
    <section id="about" className="py-24 relative bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Know Me Better</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Get to know my engineering background, academic journey, and what drives my technical curiosity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Profile Card & Quick Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group mx-auto max-w-sm lg:max-w-none">
              {/* Glow backdrop */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition duration-500" />
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                {/* Profile Image with fallback */}
                <div className="relative aspect-4/5 overflow-hidden bg-slate-800">
                  <img
                    src={personal.profileImage}
                    alt={personal.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if network image fails
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white font-extrabold text-6xl">
                    {personal.fallbackAvatar}
                  </div>
                  
                  {/* Subtle gradient overlay at bottom of image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-bold text-lg">{personal.name}</p>
                    <p className="text-xs text-indigo-300 font-medium">{personal.role}</p>
                  </div>
                </div>

                {/* Quick Info Bar */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{personal.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Graduating: {primaryEducation.duration.split('(')[1]?.replace(')', '') || 'May 2026'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Highlight Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Education Background</span>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">
                  {primaryEducation.degree}
                </h4>
                <p className="text-xs text-indigo-300 mt-0.5">
                  {primaryEducation.institution}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">
                    GPA: {primaryEducation.gpa}
                  </span>
                  <span>{primaryEducation.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio & Career Interests */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Bio Section */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Engineering with passion, curiosity, and attention to detail.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {personal.shortBio}
              </p>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {personal.extendedBio}
              </p>
            </div>

            {/* Career Interests Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Compass className="w-4 h-4" />
                <span className="uppercase tracking-wider text-xs">Primary Career Interests & Focus Areas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {careerInterests.map((interest, idx) => {
                  const IconComponent = iconMap[interest.icon] || Compass;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {interest.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {interest.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Core Principles */}
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 space-y-3">
              <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                My Development Principles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Robust type safety & static analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sub-second API latency & lean bundles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated CI/CD & comprehensive testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Accessible & mobile-first interface design</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
