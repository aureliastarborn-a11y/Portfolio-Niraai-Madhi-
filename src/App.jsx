import React, { useState, useEffect } from 'react';
import SphereRing from './components/SphereRing';
import SphereFooter from './components/SphereFooter';
import FolderCard from './components/FolderCard';
import LoadingScreen from './components/LoadingScreen';
import VinylAlbumCard from '@/components/ui/great-ui-vinyl-album-card';
import Interactive3DSkillsTree from './components/Interactive3DSkillsTree';
import PolaroidLineCarousel from '@/components/ui/polaroid-line-carousel';
import TracingArtGlobe from './components/TracingArtGlobe';
import MosaicShaderBackground from '@/components/ui/mosaic-shader-background';
import ProjectExperienceModal from './components/ProjectExperienceModal';
import { RulerCarousel } from '@/components/ui/ruler-carousel';
import UiverseFrontCard from './components/UiverseFrontCard';
import FramedEducationCard from '@/components/ui/FramedEducationCard';
import KeyCompetenciesMercury from './components/KeyCompetenciesMercury';
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);

  // Mobile: Tap outside any front card resets the 3D tilt
  useEffect(() => {
    if (!activeCardId) return;

    const handlePointerDown = (e) => {
      if (!e.target.closest('.uiv-front-parent')) {
        setActiveCardId(null);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, [activeCardId]);

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
              className="absolute inset-x-0 top-0 -bottom-64 z-0 pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <MosaicShaderBackground
                theme="light"
                scene="mosaic"
                accent="ember"
                className="size-full"
                height="100%"
                interactive={true}
              />
              {/* Fade out / slowly dissolve AFTER the marked line */}
              <div
                className="absolute inset-x-0 bottom-0 h-64 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.95) 80%, #ffffff 100%)'
                }}
              />
            </div>

            {/* The 8 Interactive Refractive Glass Spheres */}
            <SphereRing />

            {/* Center Content - Perfectly Centralized inside Sphere Circulator */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none px-4"
              data-hero-copy="true"
            >
              <div className="pointer-events-auto max-w-[240px] sm:max-w-[280px] w-full text-center">
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
            </div>
          </header>

          {/* ── MIDDLE PHASE: MODERN EDITORIAL ASYMMETRIC / BENTO LAYOUT ── */}
          <div className="relative z-10 w-full pt-32 sm:pt-48 lg:pt-60 pb-20 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
            <div className="flex flex-col gap-24 sm:gap-36 lg:gap-48">

              {/* ── 01. ABOUT ME ──────────────────────────────────── */}
              <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-900">
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

                  {/* ── INTERACTIVE RULER CAROUSEL (NO LEFT/RIGHT BORDERS: STRICTLY TOP & BOTTOM ONLY) ── */}
                  <div className="border-t border-b border-x-0 border-black/[0.08] dark:border-white/[0.08] py-2 px-0 overflow-hidden">
                    <RulerCarousel
                      originalItems={[
                        { id: 1, title: "ACADEMICS", subtitle: "B.Tech AI & DS · CGPA 8.0" },
                        { id: 2, title: "EDUCATION", subtitle: "2023–2027" },
                        { id: 3, title: "LOCATION", subtitle: "Chennai, Tamil Nadu · Remote & Onsite" },
                        { id: 4, title: "SPECIFICATION", subtitle: "Data Analytics & Web Development" },
                      ]}
                      height="h-[105px]"
                      itemWidth={300}
                      gap={36}
                    />
                  </div>

                  {/* ── SOFT SKILLS WITH MERCURY RAIL LOADER (FROM 21ST.DEV SCREEN RECORDING) ── */}
                  <KeyCompetenciesMercury skills={personal.softSkills} />
                </div>
              </section>

              {/* ── 02. PROJECTS (VINYL ALBUM CARDS) ── */}
              <section id="projects" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-900">
                    Projects
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 max-w-xs leading-relaxed block">
                    Autonomous agents, enterprise data warehousing solutions, and exploratory analytics. Click any album to view full project details and tech stack.
                  </p>
                </div>

                {/* Right Projects Grid with 3D Uiverse Header Cards */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
                    {projects.map((proj) => {
                      const cardId = `proj-${proj.id}`;
                      return (
                        <UiverseFrontCard
                          key={proj.id}
                          id={cardId}
                          title={proj.title}
                          isActive3D={activeCardId === cardId}
                          onActivate={() => setActiveCardId(cardId)}
                          onOpen={() => {
                            setActiveCardId(null);
                            setSelectedItem({ type: 'project', data: proj });
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ── 03. EXPERIENCE (3D UIVERSE CARDS) ─────────────── */}
              <section id="experience" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-900">
                    Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 max-w-xs leading-relaxed block">
                    Internship tenures, independent engineering, and technical development showcased in interactive 3D perspective cards. Click any card to view full role details and milestones.
                  </p>
                </div>

                {/* Right Experience Grid with 3D Uiverse Header Cards */}
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
                    {experiences.map((exp, idx) => {
                      const cardId = `exp-${idx}`;
                      return (
                        <UiverseFrontCard
                          key={idx}
                          id={cardId}
                          title={exp.role}
                          isActive3D={activeCardId === cardId}
                          onActivate={() => setActiveCardId(cardId)}
                          onOpen={() => {
                            setActiveCardId(null);
                            setSelectedItem({ type: 'experience', data: exp });
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* ── 04. EDUCATION & CERTIFICATIONS ─────────────── */}
              <section id="education" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start scroll-mt-20">
                {/* Left Header Column (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-900">
                    Education &amp; Credentials
                  </h2>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed hidden sm:block">
                    Formal degree from Tagore Engineering College and verified AI credentials.
                  </p>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Formal Education Card - Dexter-st Framed Animated Card */}
                  <FramedEducationCard educationItem={education[0]} />

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
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-900">
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
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-zinc-900">
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

        {/* ── PROJECT & EXPERIENCE INTERACTIVE DETAIL MODAL DIALOG ── */}
        {selectedItem && (
          <ProjectExperienceModal
            key={selectedItem.type + '-' + (selectedItem.data.id || selectedItem.data.role)}
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </main>
    </div>
  );
}
