import React, { useState, useEffect } from 'react';
import SphereRing from './components/SphereRing';
import SphereFooter from './components/SphereFooter';
import FolderCard from './components/FolderCard';
import { LogoBurst } from '@/components/ui/logo-burst';
import VinylAlbumCard from '@/components/ui/great-ui-vinyl-album-card';
import Interactive3DSkillsTree from './components/Interactive3DSkillsTree';
import { portfolioData } from './data/portfolioData';
import {
  Sparkles,
  Code2,
  Database,
  Cpu,
  GraduationCap,
  Award,
  ArrowUpRight,
  MapPin
} from 'lucide-react';

export default function App() {
  const [burstVisible, setBurstVisible] = useState(false);
  const [burstRotation, setBurstRotation] = useState(0);
  const [burstParallax, setBurstParallax] = useState(0);

  const { personal, skills, projects, experiences, education, certifications } = portfolioData;

  useEffect(() => {
    let animId;
    let targetRotation = 0;
    let currentRotation = 0;
    let targetParallax = 0;
    let currentParallax = 0;

    const handleScroll = () => {
      const scrollY = window.scrollY;
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
        inHeroPhase = scrollY < windowHeight * 0.7;
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
        if (scrollY > totalScrollHeight - windowHeight - 450) {
          inFooterPhase = true;
        }
      }

      setBurstVisible(!inHeroPhase && !inFooterPhase);

      // Movement for the burst while scrolling:
      // Smooth dynamic rotation as the page scrolls
      targetRotation = (scrollY * 0.12) % 360;
      // Gentle parallax floating drift
      const heroHeight = heroEl ? heroEl.offsetHeight : windowHeight * 0.75;
      const middleProgress = Math.max(0, scrollY - heroHeight);
      targetParallax = (middleProgress * 0.08) % 180 - 90;
    };

    const loop = () => {
      currentRotation += (targetRotation - currentRotation) * 0.1;
      currentParallax += (targetParallax - currentParallax) * 0.1;
      setBurstRotation(currentRotation);
      setBurstParallax(currentParallax);
      animId = requestAnimationFrame(loop);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    animId = requestAnimationFrame(loop);

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
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animId);
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

      <main className="relative isolate min-h-svh bg-scene [--footer-height:50svh]" data-personal-site="true">
        {/* Main Content White Container */}
        <div
          className="relative z-1 overflow-clip bg-background origin-bottom shadow-[0_1px_0_#00000006]"
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          {/* ── HERO / ORBITAL SPHERE RING (TOP-MOST PHASE - KEPT INTACT) ── */}
          <header
            id="top"
            className="sphere-ring relative z-10 grid h-[var(--hero-height)] place-items-center overflow-visible isolate [--hero-height:75svh] compact:[--hero-height:62svh]"
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

          {/* ── DYNAMIC BACKGROUND BURST (PRESENT IN BACKGROUND OF MIDDLE CONTENT) ── */}
          <div
            aria-hidden="true"
            className={`pointer-events-none fixed top-1/2 right-[-40px] sm:right-[2%] lg:right-[6%] w-[440px] h-[440px] sm:w-[560px] sm:h-[560px] lg:w-[680px] lg:h-[680px] z-0 select-none overflow-visible transition-opacity duration-200 ease-out ${
              burstVisible ? 'opacity-35 lg:opacity-45 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            style={{
              transform: `translate3d(0, calc(-50% + ${burstParallax}px), 0) rotate(${burstRotation}deg)`
            }}
          >
            <LogoBurst
              color="#18181b"
              tentacleCount={260}
              radius={0.48}
              duration={1.35}
              breathe={true}
              theme="light"
              replayOnClick={false}
            />
          </div>

          {/* ── MIDDLE PHASE: MODERN EDITORIAL ASYMMETRIC / BENTO LAYOUT (Z-10 ON TOP OF BURST) ── */}
          <div className="relative z-10 w-full py-20 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
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
                    <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-black/[0.06] space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <GraduationCap className="size-3.5" />
                        <span>Academics</span>
                      </div>
                      <div className="text-sm font-medium text-zinc-900">B.Tech AI & DS</div>
                      <div className="text-xs text-zinc-500">CGPA 8.0 · 2023–2027</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-black/[0.06] space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <MapPin className="size-3.5" />
                        <span>Location</span>
                      </div>
                      <div className="text-sm font-medium text-zinc-900">{personal.location}</div>
                      <div className="text-xs text-zinc-500">Open to Remote & Onsite</div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-black/[0.06] space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
                          className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white/90 backdrop-blur-sm rounded-lg border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 02. SELECTED WORK / PROJECTS (VINYL ALBUM CARDS) ── */}
              <section id="projects" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      02
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Portfolio
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Selected Work
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Autonomous agents, enterprise data warehousing solutions, and exploratory analytics. Hover over any album to slide out its vinyl record.
                  </p>
                </div>

                {/* Right Projects Grid with Interactive Vinyl Cards */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                      <VinylAlbumCard
                        key={proj.id}
                        title={proj.title}
                        artist={proj.tagline}
                        coverImage={proj.bg}
                        description={proj.description}
                        tags={proj.tags}
                        size="compact"
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 03. EXPERIENCE (VINYL ALBUM CARDS) ─────────────── */}
              <section id="experience" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      03
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Timeline
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Experience
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Internship tenures, independent engineering, and technical development showcased as vinyl records.
                  </p>
                </div>

                {/* Right Experience Grid with Interactive Vinyl Cards */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {experiences.map((exp, idx) => (
                      <VinylAlbumCard
                        key={idx}
                        title={exp.role}
                        artist={exp.organization}
                        coverImage={exp.bg}
                        description={exp.summary}
                        tags={[exp.organization]}
                        size="compact"
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 04. EDUCATION & CERTIFICATIONS ─────────────── */}
              <section id="education" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      04
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
                  <div className="p-6 rounded-2xl bg-white/85 backdrop-blur-sm border border-black/[0.06] space-y-2">
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

              {/* ── 05. TECHNICAL STACK (INTERACTIVE 3D SKILLS TREE) ── */}
              <section id="skills" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200/80">
                      05
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
                      Expertise
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Technical Stack
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Interactive 3D cuboids dropping from a single straight line. Click and drag any cube to rotate it in 3D.
                  </p>
                </div>

                {/* Right Interactive 3D Skills Tree & Rotatable Cuboids */}
                <div className="lg:col-span-8">
                  <Interactive3DSkillsTree skills={skills} />
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
                    Click any folder to open directly or connect across platforms.
                  </p>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-8">
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
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* ── FOOTER SPHERE SCENE (FOOT-MOST PHASE - KEPT INTACT) ── */}
        <SphereFooter />
      </main>
    </div>
  );
}
