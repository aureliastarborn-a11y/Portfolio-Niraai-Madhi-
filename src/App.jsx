import React, { useState } from 'react';
import SphereRing from './components/SphereRing';
import SphereFooter from './components/SphereFooter';
import FolderCard from './components/FolderCard';
import FloatingDock from './components/FloatingDock';
import ImageModal from './components/ImageModal';
import { LogoBurst } from '@/components/ui/logo-burst';
import { portfolioData } from './data/portfolioData';

export default function App() {
  const [activeModalImage, setActiveModalImage] = useState(null);

  const { personal, skills, projects, experiences, education, certifications } = portfolioData;

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
          {/* ── HERO / ORBITAL SPHERE RING ─────────────────────── */}
          <header
            id="top"
            className="sphere-ring relative z-1 grid h-[var(--hero-height)] place-items-center overflow-visible isolate [--hero-height:75svh] compact:[--hero-height:62svh]"
          >
            {/* ── BACKGROUND LOGO BURST (RIGHT SIDE) ────────────── */}
            <div
              className="pointer-events-auto absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[460px] lg:h-[460px] z-1 select-none cursor-pointer"
              title="Click to replay Logo Burst"
            >
              <LogoBurst
                color="#27272a"
                tentacleCount={260}
                radius={0.48}
                duration={1.4}
                breathe={true}
                theme="light"
                replayOnClick={true}
              />
            </div>

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

          {/* ── SECTIONS COLUMN ───────────────────────────────── */}
          <div className="relative w-full pt-16 pb-36 compact:pt-12">
            <div
              className="mx-auto flex w-[min(var(--container-content),calc(100%-48px))] flex-col gap-28 compact:w-[min(var(--container-content),calc(100%-32px))] compact:gap-20 [&>section]:scroll-mt-8"
              data-content-column="true"
            >
              {/* ── 1. ABOUT ──────────────────────────────────── */}
              <section id="about" aria-labelledby="about-heading">
                <h2
                  id="about-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-2"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    1
                  </span>
                  About
                </h2>
                <div className="grid gap-4 text-muted text-[15px] leading-relaxed">
                  {personal.bio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}

                  {/* Soft skills pill row */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {personal.softSkills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-[12px] font-medium text-heading bg-scene rounded-full border border-black/[0.04]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 2. TECHNICAL SKILLS ────────────────────────── */}
              <section id="skills" aria-labelledby="skills-heading">
                <h2
                  id="skills-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    2
                  </span>
                  Technical skills
                </h2>

                <div className="grid gap-6">
                  {skills.map((grp, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-[14px] font-medium text-heading">
                        {grp.category}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {grp.items.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className="px-2.5 py-1 text-[13px] text-muted hover:text-heading bg-white rounded-lg border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 3. PROJECTS / SELECTED WORK ───────────────── */}
              <section id="projects" aria-labelledby="projects-heading">
                <h2
                  id="projects-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    3
                  </span>
                  Selected Work
                </h2>

                <div className="grid min-w-0 gap-12 compact:gap-10">
                  {projects.map((proj) => (
                    <article
                      key={proj.id}
                      className="flex w-full max-w-content min-w-0 flex-col gap-2.5 [&>p]:text-muted text-[15px]"
                    >
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex w-fit items-center gap-2"
                      >
                        <h3 className="text-heading text-[15px] font-medium leading-6 group-hover:underline">
                          {proj.title}
                        </h3>
                        <img
                          src="/images/external-arrow.svg"
                          alt=""
                          className="h-3.5 w-auto opacity-40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                        />
                        <span className="text-muted text-[13px] font-normal">
                          · {proj.tagline}
                        </span>
                      </a>

                      <p className="leading-relaxed text-[14px]">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {proj.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 text-[11px] font-mono text-muted bg-scene rounded border border-black/[0.04]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Interactive Visual Preview */}
                      <div
                        className="relative w-content aspect-project shrink-0 snap-start mt-1 compact:w-[calc(100vw-32px)]"
                        data-project-preview="true"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveModalImage(proj)}
                          aria-label={`Open preview for ${proj.title}`}
                          className="relative block size-full overflow-hidden rounded-[8px] border-0 bg-preview p-0 shadow-[0_5px_15px_#00000010] cursor-zoom-in appearance-none transition-transform duration-200 hover:scale-[1.01]"
                        >
                          <img
                            src={proj.bg}
                            alt=""
                            className="object-cover select-none absolute inset-0 size-full"
                          />
                          <span className="absolute inset-[8%] flex items-center justify-center drop-shadow-[0_8px_14px_#18160f2e]">
                            <img
                              src={proj.screenshot}
                              alt={proj.title}
                              className="object-contain size-full"
                            />
                          </span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* ── 4. EXPERIENCE ─────────────────────────────── */}
              <section id="experience" aria-labelledby="experience-heading">
                <h2
                  id="experience-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    4
                  </span>
                  Experience
                </h2>

                <dl
                  className="grid gap-4 [&>div]:grid [&>div]:grid-cols-[100px_minmax(0,1fr)] [&>div]:gap-[28px] compact:[&>div]:grid-cols-[85px_minmax(0,1fr)] compact:[&>div]:gap-[16px] [&_dt]:whitespace-nowrap [&_dt]:text-muted [&_dd_span]:block [&_dd_span]:text-muted"
                  data-timeline="true"
                >
                  {experiences.map((exp, idx) => (
                    <div key={idx}>
                      <dt className="text-[13px] font-mono pt-0.5">{exp.period}</dt>
                      <dd>
                        <div className="text-heading text-[15px] font-medium leading-6">
                          {exp.role} <span className="text-muted font-normal">at {exp.organization}</span>
                        </div>
                        <span className="text-muted text-[13px] leading-relaxed mt-0.5">
                          {exp.summary}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* ── 5. EDUCATION & CERTIFICATIONS ─────────────── */}
              <section id="education" aria-labelledby="education-heading">
                <h2
                  id="education-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    5
                  </span>
                  Education &amp; Certifications
                </h2>

                <dl
                  className="grid gap-4 mb-6 [&>div]:grid [&>div]:grid-cols-[100px_minmax(0,1fr)] [&>div]:gap-[28px] compact:[&>div]:grid-cols-[85px_minmax(0,1fr)] compact:[&>div]:gap-[16px] [&_dt]:whitespace-nowrap [&_dt]:text-muted [&_dd_span]:block [&_dd_span]:text-muted"
                  data-timeline="true"
                >
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <dt className="text-[13px] font-mono pt-0.5">{edu.period}</dt>
                      <dd>
                        <div className="text-heading text-[15px] font-medium leading-6">
                          {edu.degree}
                        </div>
                        <span className="text-muted text-[13px] leading-relaxed">
                          {edu.institution} · {edu.detail}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Certifications Row */}
                <div className="pt-3 border-t border-black/[0.06]">
                  <h3 className="text-muted text-[12px] font-mono uppercase tracking-wider mb-2.5">
                    Certifications
                  </h3>
                  <div className="grid gap-1.5">
                    {certifications.map((cert, cIdx) => (
                      <div
                        key={cIdx}
                        className="flex items-baseline justify-between text-[13px] py-1"
                      >
                        <span className="text-heading font-medium">
                          {cert.name}
                        </span>
                        <span className="text-muted text-[12px] font-mono shrink-0 ml-3">
                          {cert.issuer} · {cert.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 6. ELSEWHERE & CONTACT ────────────────────── */}
              <section id="contact" aria-labelledby="contact-heading">
                <h2
                  id="contact-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    6
                  </span>
                  Contact &amp; Elsewhere
                </h2>

                <p className="mb-6 max-w-[360px] text-muted text-[15px]">
                  Connect with me across platforms or reach out directly.
                </p>

                {/* 4 Skeuomorphic Folders */}
                <div
                  className="grid grid-cols-2 gap-x-6 gap-y-[30px] compact:gap-x-3.5 compact:gap-y-6"
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
              </section>
            </div>
          </div>
        </div>

        {/* ── FOOTER SPHERE SCENE ───────────────────────────── */}
        <SphereFooter />
      </main>

      {/* ── FLOATING PILL DOCK NAVIGATION ───────────────────── */}
      <FloatingDock />

      {/* ── IMAGE LIGHTBOX MODAL ────────────────────────────── */}
      <ImageModal
        image={activeModalImage}
        isOpen={!!activeModalImage}
        onClose={() => setActiveModalImage(null)}
      />
    </div>
  );
}
