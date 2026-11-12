import React, { useState, useEffect } from 'react';
import SphereRing from './components/SphereRing';
import SphereFooter from './components/SphereFooter';
import FolderCard from './components/FolderCard';
import ImageModal from './components/ImageModal';
import { LogoBurst } from '@/components/ui/logo-burst';
import { portfolioData } from './data/portfolioData';
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Code2,
  Database,
  Cpu,
  GraduationCap,
  Award,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

export default function App() {
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [burstVisible, setBurstVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const { personal, skills, projects, experiences, education, certifications } = portfolioData;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    const updateVisibility = () => {
      const windowHeight = window.innerHeight;
      const heroEl = document.getElementById('top');
      const footerEl = document.querySelector('[data-footer-reveal]');

      // 1. Not in first phase (where "NIRAAI MADHI" and rotatory images are)
      let inHeroPhase = false;
      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        if (heroRect.bottom > 20) {
          inHeroPhase = true;
        }
      } else {
        inHeroPhase = window.scrollY < windowHeight * 0.7;
      }

      // 2. Not in last phase (where bottom sphere rotation is) - must hide instantly even on fast scroll
      let inFooterPhase = false;
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        if (footerRect.top <= windowHeight + 150) {
          inFooterPhase = true;
        }
      } else {
        const totalScrollHeight = document.documentElement.scrollHeight;
        if (window.scrollY > totalScrollHeight - windowHeight - 450) {
          inFooterPhase = true;
        }
      }

      setBurstVisible(!inHeroPhase && !inFooterPhase);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    // Fast-scroll guarantee: IntersectionObserver cuts off burst instantly before footer sphere rotation
    let footerObserver;
    const footerEl = document.querySelector('[data-footer-reveal]');
    if (footerEl && 'IntersectionObserver' in window) {
      footerObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setBurstVisible(false);
            }
          }
        },
        { rootMargin: '200px 0px 0px 0px' }
      );
      footerObserver.observe(footerEl);
    }

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      if (footerObserver) footerObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-zinc-200">
      {/* Accessibility Skip Link */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-background focus:p-3"
      >
        Skip to content
      </a>

      {/* ── FIXED RIGHT-SIDE BACKGROUND BURST (ACTIVE IN MIDDLE PHASES ONLY) ── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed top-1/2 -translate-y-1/2 right-2 sm:right-6 lg:right-10 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px] z-0 select-none overflow-visible transition-opacity duration-150 ease-out ${
          burstVisible ? 'opacity-40 lg:opacity-70 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <LogoBurst
          color="#3f3f46"
          tentacleCount={160}
          radius={0.38}
          duration={1.35}
          breathe={true}
          theme="light"
          replayOnClick={false}
        />
      </div>

      <main className="relative isolate min-h-svh bg-scene [--footer-height:50svh]" data-personal-site="true">
        {/* Main Content White Container */}
        <div
          className="relative z-1 overflow-clip bg-background origin-bottom shadow-[0_1px_0_#00000006]"
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          {/* ── HERO / ORBITAL SPHERE RING (TOP-MOST PHASE - KEPT INTACT) ── */}
          <header
            id="top"
            className="sphere-ring relative z-1 grid h-[var(--hero-height)] place-items-center overflow-visible isolate [--hero-height:75svh] compact:[--hero-height:62svh]"
          >
            {/* The 8 Interactive Refractive Glass Spheres */}
            <SphereRing />

            {/* Center Content */}
            <div className="relative z-10 w-[min(360px,calc(var(--ring-radius)*1.3))] text-center select-none" data-hero-copy="true">
              <h1 id="intro-heading" className="mb-3.5 flex justify-center focus:outline-none">
                <img
                  src="/images/signature.svg"
                  alt={personal.name}
                  width="180"
                  height="45"
                  className="h-10 w-auto object-contain select-none"
                />
              </h1>
              <p className="text-muted text-[clamp(14px,1.6vw,16px)] leading-[1.55] text-balance font-normal">
                {personal.role} at Tagore Engineering College.
                <br />
                {personal.tagline}
              </p>
            </div>
          </header>

          {/* ── MIDDLE PHASE: MODERN EDITORIAL ASYMMETRIC / BENTO LAYOUT (NOT CENTERED) ── */}
          <div className="relative w-full py-20 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
            <div className="flex flex-col gap-32">

              {/* ── 01. ABOUT ME ──────────────────────────────────── */}
              <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      01
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Overview
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    About Me
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Background, core passions, and technical philosophy.
                  </p>
                </div>

                {/* Right Content Column */}
                <div className="lg:col-span-8 space-y-6">
                  <p className="text-lg sm:text-xl font-normal leading-relaxed text-zinc-900">
                    {personal.bio[0]}
                  </p>

                  <p className="text-[15px] leading-relaxed text-zinc-600">
                    {personal.bio[1]}
                  </p>

                  {/* Quick Highlights Bento Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                    <div className="p-4 rounded-xl bg-zinc-50/80 border border-black/[0.06] space-y-1">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <GraduationCap className="size-3.5" />
                        <span>Academics</span>
                      </div>
                      <div className="text-sm font-medium text-zinc-900">B.Tech AI & DS</div>
                      <div className="text-xs text-zinc-500">CGPA 8.0 · 2023–2027</div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-50/80 border border-black/[0.06] space-y-1">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <MapPin className="size-3.5" />
                        <span>Location</span>
                      </div>
                      <div className="text-sm font-medium text-zinc-900">{personal.location}</div>
                      <div className="text-xs text-zinc-500">Open to Remote & Onsite</div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-50/80 border border-black/[0.06] space-y-1">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <Sparkles className="size-3.5" />
                        <span>Specialization</span>
                      </div>
                      <div className="text-sm font-medium text-zinc-900">GenAI & Agents</div>
                      <div className="text-xs text-zinc-500">LLMs & Data Warehousing</div>
                    </div>
                  </div>

                  {/* Soft Skills Pill Badges */}
                  <div className="pt-2">
                    <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Key Competencies
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {personal.softSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white rounded-lg border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 02. TECHNICAL SKILLS ────────────────────────── */}
              <section id="skills" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      02
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Expertise
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Technical Stack
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Tools, languages, and frameworks used across my machine learning and data pipelines.
                  </p>
                </div>

                {/* Right Bento Grid */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skills.map((grp, idx) => {
                      const icons = [
                        <Code2 key="code" className="size-4 text-zinc-700" />,
                        <Sparkles key="ai" className="size-4 text-purple-600" />,
                        <Database key="data" className="size-4 text-blue-600" />,
                        <Cpu key="tools" className="size-4 text-emerald-600" />
                      ];
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-zinc-50/70 border border-black/[0.06] hover:bg-white hover:border-black/[0.12] hover:shadow-sm transition-all space-y-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-white border border-black/[0.05] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                              {icons[idx % icons.length]}
                            </span>
                            <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
                              {grp.category}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {grp.items.map((item, iIdx) => (
                              <span
                                key={iIdx}
                                className="px-2.5 py-1 text-xs text-zinc-700 bg-white rounded-md border border-black/[0.08] shadow-[0_1px_1px_rgba(0,0,0,0.02)]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ── 03. SELECTED WORK / PROJECTS ───────────────── */}
              <section id="projects" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      03
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Portfolio
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Selected Work
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Autonomous agents, enterprise data warehousing solutions, and exploratory analytics.
                  </p>
                </div>

                {/* Right Projects Grid */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                      <article
                        key={proj.id}
                        className="group flex flex-col justify-between rounded-2xl bg-zinc-50/70 border border-black/[0.06] hover:bg-white hover:border-black/[0.12] hover:shadow-md transition-all p-5"
                      >
                        <div className="space-y-3.5">
                          {/* Visual Lightbox Preview */}
                          <div
                            className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-preview shadow-[0_4px_12px_rgba(0,0,0,0.04)] cursor-zoom-in"
                            onClick={() => setActiveModalImage(proj)}
                          >
                            <img
                              src={proj.bg}
                              alt=""
                              className="object-cover select-none absolute inset-0 size-full transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute inset-[10%] flex items-center justify-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]">
                              <img
                                src={proj.screenshot}
                                alt={proj.title}
                                className="object-contain size-full"
                              />
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-zinc-900 font-semibold text-base group/link hover:text-blue-600 transition-colors"
                              >
                                <span>{proj.title}</span>
                                <ArrowUpRight className="size-4 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
                              </a>
                            </div>

                            <div className="text-xs font-mono text-zinc-500 font-medium">
                              {proj.tagline}
                            </div>

                            <p className="text-[13px] leading-relaxed text-zinc-600">
                              {proj.description}
                            </p>
                          </div>
                        </div>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-4 mt-2 border-t border-black/[0.04]">
                          {proj.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 text-[11px] font-mono text-zinc-600 bg-white rounded border border-black/[0.06]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 04. EXPERIENCE ─────────────────────────────── */}
              <section id="experience" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      04
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Timeline
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Experience
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Internship tenures, independent engineering, and technical development.
                  </p>
                </div>

                {/* Right Timeline Column */}
                <div className="lg:col-span-8">
                  <div className="relative border-l border-zinc-200 ml-3 pl-6 sm:pl-8 space-y-8">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Dot */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 size-3 rounded-full bg-white border-2 border-zinc-400 group-hover:border-zinc-900 group-hover:scale-125 transition-all" />

                        <div className="space-y-1">
                          <span className="text-xs font-mono text-zinc-500 font-medium">
                            {exp.period}
                          </span>
                          <h3 className="text-base font-semibold text-zinc-900">
                            {exp.role}{' '}
                            <span className="text-zinc-500 font-normal">
                              · {exp.organization}
                            </span>
                          </h3>
                          <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">
                            {exp.summary}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 05. EDUCATION & CERTIFICATIONS ─────────────── */}
              <section id="education" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      05
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Academics
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Education &amp; Credentials
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Formal degree from Tagore Engineering College and verified AI credentials.
                  </p>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Formal Education Card */}
                  <div className="p-6 rounded-2xl bg-zinc-50/70 border border-black/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                      <span>{education[0].institution}</span>
                      <span>{education[0].period}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {education[0].degree}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {education[0].detail}
                    </p>
                  </div>

                  {/* Certifications Grid */}
                  <div className="space-y-3">
                    <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Industry Certifications
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {certifications.map((cert, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-4 rounded-xl bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                              <Award className="size-3.5 text-zinc-700" />
                              <span>{cert.issuer}</span>
                            </div>
                            <div className="text-[13px] font-medium text-zinc-900 leading-snug">
                              {cert.name}
                            </div>
                          </div>
                          <div className="text-xs font-mono text-zinc-400">
                            Issued {cert.year}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 06. CONTACT & ELSEWHERE ────────────────────── */}
              <section id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      06
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Connect
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Get in Touch
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Click any folder to open directly, or copy contact details below.
                  </p>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-8 space-y-8">
                  {/* 4 Skeuomorphic Folders Across Full Width */}
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    data-folder-links="true"
                  >
                    <FolderCard
                      label="LinkedIn"
                      href={personal.linkedin}
                      ariaLabel="Connect on LinkedIn"
                    />
                    <FolderCard
                      label="GitHub"
                      href={personal.github}
                      ariaLabel="Code on GitHub"
                    />
                    <FolderCard
                      label="Email"
                      href={`mailto:${personal.email}`}
                      ariaLabel="Send an Email"
                    />
                    <FolderCard
                      label="Phone"
                      href={`tel:+91${personal.phone}`}
                      ariaLabel="Call via Phone"
                    />
                  </div>

                  {/* Quick Direct Copy Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <div className="p-4 rounded-xl bg-zinc-50/80 border border-black/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono text-zinc-400 uppercase">Email Address</div>
                        <div className="text-sm font-medium text-zinc-900">{personal.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(personal.email, 'email')}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white rounded-lg border border-black/[0.08] hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copy email to clipboard"
                      >
                        {copiedKey === 'email' ? (
                          <>
                            <Check className="size-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5 text-zinc-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-50/80 border border-black/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-mono text-zinc-400 uppercase">Phone &amp; Location</div>
                        <div className="text-sm font-medium text-zinc-900">+91 {personal.phone} · {personal.location}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(`+91${personal.phone}`, 'phone')}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white rounded-lg border border-black/[0.08] hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copy phone to clipboard"
                      >
                        {copiedKey === 'phone' ? (
                          <>
                            <Check className="size-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5 text-zinc-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* ── FOOTER SPHERE SCENE (FOOT-MOST PHASE - KEPT INTACT) ── */}
        <SphereFooter />
      </main>

      {/* ── IMAGE LIGHTBOX MODAL ────────────────────────────── */}
      <ImageModal
        image={activeModalImage}
        isOpen={!!activeModalImage}
        onClose={() => setActiveModalImage(null)}
      />
    </div>
  );
}
