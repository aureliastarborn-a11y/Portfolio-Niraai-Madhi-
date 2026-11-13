import React from 'react';
import SphereRing from './components/SphereRing';
import SphereFooter from './components/SphereFooter';
import FolderCard from './components/FolderCard';
import LoadingScreen from './components/LoadingScreen';
import VinylAlbumCard from '@/components/ui/great-ui-vinyl-album-card';
import Interactive3DSkillsTree from './components/Interactive3DSkillsTree';
import PolaroidLineCarousel from '@/components/ui/polaroid-line-carousel';
import TracingArtGlobe from './components/TracingArtGlobe';
import MosaicShaderBackground from '@/components/ui/mosaic-shader-background';
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
  const { personal, skills, projects, experiences, education, certifications } = portfolioData;

  return (
    <div className="min-h-full flex flex-col font-sans bg-background text-foreground antialiased selection:bg-zinc-200">
      {/* ── PRELOADER / LOADING PAGE WITH HAMSTER WHEEL ── */}
      <LoadingScreen />

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
            className="sphere-ring relative z-10 grid min-h-screen h-screen place-items-center overflow-visible isolate [--hero-height:100svh]"
          >
            {/* ── TOP LIGHT-SHADED MOSAIC SHADER BACKGROUND (HERO BACKDROP) ── */}
            <div
              className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <MosaicShaderBackground
                theme="light"
                scene="mosaic"
                accent="ice"
                className="size-full"
                height="100%"
                interactive={true}
              />
            </div>

            {/* The 8 Interactive Refractive Glass Spheres */}
            <SphereRing />

            {/* Center Content */}
            <div
              className="relative z-10 max-w-[260px] sm:max-w-[280px] w-full text-center select-none mx-auto px-2"
              data-hero-copy="true"
            >
              <h1 id="intro-heading" className="mb-2 flex justify-center items-center focus:outline-none">
                <span className="font-signature text-2xl sm:text-3xl md:text-[32px] text-zinc-900 select-none whitespace-nowrap leading-none tracking-normal py-0.5">
                  {personal.shortName}
                </span>
              </h1>
              <p className="text-muted text-[13px] sm:text-[14px] leading-[1.5] text-balance font-normal">
                {personal.role} at Tagore Engineering College.
                <br />
                <span className="block mt-1 sm:mt-1.5">
                  {personal.tagline}
                </span>
              </p>
            </div>
          </header>

          {/* ── MIDDLE PHASE: MODERN EDITORIAL ASYMMETRIC / BENTO LAYOUT ── */}
          <div className="relative z-10 w-full pt-[72px] pb-20 px-6 sm:px-10 lg:px-16 max-w-6xl mx-auto">
            <div className="flex flex-col gap-44 sm:gap-52">

              {/* ── 01. ABOUT ME ──────────────────────────────────── */}
              <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
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

              {/* ── 02. PROJECTS (VINYL ALBUM CARDS) ── */}
              <section id="projects" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Projects
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Autonomous agents, enterprise data warehousing solutions, and exploratory analytics. Hover over any album to slide out its vinyl record.
                  </p>
                </div>

                {/* Right Projects Grid with Interactive Vinyl Cards */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {projects.map((proj) => (
                      <VinylAlbumCard
                        key={proj.id}
                        title={proj.title}
                        artist={proj.tagline}
                        coverImage={proj.bg}
                        description={proj.description}
                        tags={proj.tags}
                        size="small"
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 03. EXPERIENCE (VINYL ALBUM CARDS) ─────────────── */}
              <section id="experience" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Experience
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Internship tenures, independent engineering, and technical development showcased as vinyl records.
                  </p>
                </div>

                {/* Right Experience Grid with Interactive Vinyl Cards */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {experiences.map((exp, idx) => (
                      <VinylAlbumCard
                        key={idx}
                        title={exp.role}
                        artist={exp.organization}
                        coverImage={exp.bg}
                        description={exp.summary}
                        tags={exp.tags || [exp.organization]}
                        size="small"
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 04. EDUCATION & CERTIFICATIONS ─────────────── */}
              <section id="education" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
                    Education &amp; Credentials
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Formal degree from Tagore Engineering College and verified AI credentials.
                  </p>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-8 space-y-6">
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

                  {/* Certifications - POLAROID LINE CAROUSEL (Clothesline & Pegs from 21st.dev) */}
                  <div className="w-full pt-1">
                    <PolaroidLineCarousel
                      slides={certifications.map((cert, idx) => {
                        const credentialImages = [
                          "/images/covers/cover-teal.jpg",
                          "/images/covers/cover-amber.jpg",
                          "/images/covers/cover-blue.jpg",
                          "/images/covers/cover-emerald.jpg",
                          "/images/covers/cover-lavender.jpg",
                          "/images/covers/cover-rose.jpg",
                          "/images/covers/cover-original.jpg",
                          "/images/covers/cover-indigo.jpg",
                        ];
                        return {
                          image: credentialImages[idx % credentialImages.length],
                          title: cert.shortTitle || cert.name,
                          issuer: cert.issuer,
                          caption: `${cert.issuer} • Issued ${cert.year}`,
                          alt: `${cert.name} - ${cert.issuer}`,
                        };
                      })}
                      height="165px"
                      cardWidth={92}
                      sag={12}
                      swing={1}
                      autoplay={3800}
                      string="#71717a"
                      background="transparent"
                      ink="#18181b"
                      showBar={false}
                      ariaLabel="Certifications clothesline carousel"
                    />
                  </div>
                </div>
              </section>

              {/* ── INTERACTIVE 3D ARTWORK GLOBE (CENTERED IN EMPTY SPACE) ── */}
              <TracingArtGlobe />

              {/* ── 05. TECHNICAL STACK (INTERACTIVE 3D SKILLS TREE) ── */}
              <section id="skills" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
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
