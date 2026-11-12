import React, { useState } from 'react';
import SphereRing from './components/SphereRing';
import SphereFooter from './components/SphereFooter';
import FolderCard from './components/FolderCard';
import FloatingDock from './components/FloatingDock';
import ImageModal from './components/ImageModal';

export default function App() {
  const [activeModalImage, setActiveModalImage] = useState(null);

  const primeIntellectCards = [
    {
      title: 'Desktop agent workspace',
      bg: '/images/landscapes/stream-in-the-mountains.jpg',
      screenshot: '/images/project-screenshots/desktop-agent.png',
      inset: 'inset-[5%]',
    },
    {
      title: 'Command line research agent',
      bg: '/images/landscapes/the-coming-storm.jpg',
      screenshot: '/images/project-screenshots/cli-agent.png',
      inset: 'inset-y-[12%] inset-x-[21%]',
    },
    {
      title: 'Agent automation setup',
      bg: '/images/landscapes/home-by-the-lake.jpg',
      screenshot: '/images/project-screenshots/automation-neutral.png',
      inset: 'inset-y-[11%] inset-x-[22%]',
    },
  ];

  const huggingFaceCards = [
    {
      title: 'Editor and planning interface',
      bg: '/images/nature-photos/soft-dunes.webp',
      screenshot: '/images/project-screenshots/editor-plan.png',
      inset: 'inset-y-[6%] inset-x-[12%]',
    },
    {
      title: 'Automation configuration window',
      bg: '/images/nature-photos/sunlit-leaves.webp',
      screenshot: '/images/project-screenshots/automation.png',
      inset: 'inset-y-[11%] inset-x-[22%]',
    },
  ];

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
        {/* White Content Shell */}
        <div
          className="relative z-1 overflow-clip bg-background origin-bottom shadow-[0_1px_0_#00000006]"
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          {/* ── HERO / SPHERE RING ────────────────────────────── */}
          <header
            id="top"
            className="sphere-ring relative z-1 grid h-[var(--hero-height)] place-items-center overflow-visible isolate [--hero-height:75svh] compact:[--hero-height:62svh]"
          >
            {/* The 8 Interactive Glass Spheres */}
            <SphereRing />

            {/* Center Content */}
            <div className="relative z-1 w-[min(340px,calc(var(--ring-radius)*1.24))] text-center select-none" data-hero-copy="true">
              <h1 id="intro-heading" className="mb-4 flex justify-center focus:outline-none compact:mb-3.5">
                <img
                  src="/images/signature.svg"
                  alt="Matthew"
                  width="122"
                  height="33"
                  className="h-8 w-auto object-contain select-none"
                />
              </h1>
              <p className="text-muted text-[clamp(14px,1.6vw,16px)] leading-[1.55] text-balance font-normal">
                Applied researcher at Prime Intellect.
                <br />
                Exploring how language models reason, act, and learn.
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
                <div className="grid gap-6 text-muted text-[15px] leading-relaxed">
                  <p>
                    I’m an applied researcher at Prime Intellect, working on reinforcement learning and language model agents.
                  </p>
                  <p>
                    I build environments, design evaluations, and run experiments to understand how models reason, use tools, and learn from feedback.
                  </p>
                </div>
              </section>

              {/* ── 2. SELECTED WORK ──────────────────────────── */}
              <section id="work" aria-labelledby="work-heading">
                <h2
                  id="work-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    2
                  </span>
                  Selected work
                </h2>

                <div className="grid min-w-0 gap-20 compact:gap-16">
                  {/* Work 1: Prime Intellect */}
                  <article className="flex w-full max-w-content min-w-0 flex-col gap-3 [&>p]:text-muted text-[15px]">
                    <a
                      href="https://www.primeintellect.ai"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-fit items-center gap-3 [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:leading-6 [&_p]:text-muted"
                      data-project-heading="true"
                    >
                      <img
                        src="/images/prime-intellect.svg"
                        alt=""
                        width="40"
                        height="40"
                        className="size-10 shrink-0 object-contain"
                      />
                      <div>
                        <h3 className="text-heading flex items-center">
                          Prime Intellect
                          <img
                            src="/images/external-arrow.svg"
                            alt=""
                            className="inline-block ml-1 h-3.5 w-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-0 group-hover:opacity-100"
                          />
                        </h3>
                        <p className="text-muted text-[14px]">
                          Reinforcement learning &amp; environments
                        </p>
                      </div>
                    </a>

                    <p className="leading-relaxed">
                      Build training environments for language model agents, with verifiers that check reasoning and tool use. Run post-training experiments, inspect rollouts, and refine reward signals to help models complete longer tasks and recover when a step goes wrong.
                    </p>

                    {/* Screenshot Gallery Horizontal Scroll */}
                    <div
                      className="no-scrollbar scroll-fade-x w-screen max-w-none ml-[calc(224px-50vw)] overflow-x-auto overscroll-x-contain scroll-ps-[calc(50vw-224px)] snap-x snap-mandatory compact:-ml-4 compact:scroll-ps-4 pt-2"
                      data-project-gallery="true"
                    >
                      <div className="flex w-max items-start gap-3.5 pl-[calc(50vw-224px)] compact:pl-4">
                        {primeIntellectCards.map((card, idx) => (
                          <div
                            key={idx}
                            className="relative w-content aspect-project shrink-0 snap-start snap-always compact:w-[calc(100vw-32px)]"
                            data-project-preview="true"
                          >
                            <button
                              type="button"
                              onClick={() => setActiveModalImage(card)}
                              aria-label={`Open ${card.title}`}
                              className="relative block size-full overflow-hidden rounded-[8px] border-0 bg-preview p-0 shadow-[0_5px_15px_#00000012] cursor-zoom-in appearance-none transition-transform duration-200 hover:scale-[1.01]"
                            >
                              <img
                                src={card.bg}
                                alt=""
                                className="object-cover select-none absolute inset-0 size-full"
                              />
                              <span className={`absolute drop-shadow-[0_8px_14px_#18160f2e] ${card.inset} flex items-center justify-center`}>
                                <img
                                  src={card.screenshot}
                                  alt={card.title}
                                  className="object-contain size-full"
                                />
                              </span>
                            </button>
                          </div>
                        ))}
                        <span aria-hidden="true" className="w-[calc(50vw-84px)] shrink-0" />
                      </div>
                    </div>
                  </article>

                  {/* Work 2: Hugging Face */}
                  <article className="flex w-full max-w-content min-w-0 flex-col gap-3 [&>p]:text-muted text-[15px]">
                    <a
                      href="https://huggingface.co"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-fit items-center gap-3 [&_h3]:text-[15px] [&_h3]:font-medium [&_h3]:leading-6 [&_p]:text-muted"
                      data-project-heading="true"
                    >
                      <img
                        src="/images/hugging-face.svg"
                        alt=""
                        width="40"
                        height="40"
                        className="size-10 shrink-0 object-contain"
                      />
                      <div>
                        <h3 className="text-heading flex items-center">
                          Hugging Face
                          <img
                            src="/images/external-arrow.svg"
                            alt=""
                            className="inline-block ml-1 h-3.5 w-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-0 group-hover:opacity-100"
                          />
                        </h3>
                        <p className="text-muted text-[14px]">
                          Open models &amp; evaluation
                        </p>
                      </div>
                    </a>

                    <p className="leading-relaxed">
                      Worked on evaluation tools for open language models, from dataset preparation to reproducible benchmark runs. Compared fine-tuning approaches, investigated model failures, and shared examples that helped developers adapt models to their own tasks.
                    </p>

                    {/* Screenshot Gallery Horizontal Scroll */}
                    <div
                      className="no-scrollbar scroll-fade-x w-screen max-w-none ml-[calc(224px-50vw)] overflow-x-auto overscroll-x-contain scroll-ps-[calc(50vw-224px)] snap-x snap-mandatory compact:-ml-4 compact:scroll-ps-4 pt-2"
                      data-project-gallery="true"
                    >
                      <div className="flex w-max items-start gap-3.5 pl-[calc(50vw-224px)] compact:pl-4">
                        {huggingFaceCards.map((card, idx) => (
                          <div
                            key={idx}
                            className="relative w-content aspect-project shrink-0 snap-start snap-always compact:w-[calc(100vw-32px)]"
                            data-project-preview="true"
                          >
                            <button
                              type="button"
                              onClick={() => setActiveModalImage(card)}
                              aria-label={`Open ${card.title}`}
                              className="relative block size-full overflow-hidden rounded-[8px] border-0 bg-preview p-0 shadow-[0_5px_15px_#00000012] cursor-zoom-in appearance-none transition-transform duration-200 hover:scale-[1.01]"
                            >
                              <img
                                src={card.bg}
                                alt=""
                                className="object-cover select-none absolute inset-0 size-full"
                              />
                              <span className={`absolute drop-shadow-[0_8px_14px_#18160f2e] ${card.inset} flex items-center justify-center`}>
                                <img
                                  src={card.screenshot}
                                  alt={card.title}
                                  className="object-contain size-full"
                                />
                              </span>
                            </button>
                          </div>
                        ))}
                        <span aria-hidden="true" className="w-[calc(50vw-84px)] shrink-0" />
                      </div>
                    </div>
                  </article>
                </div>
              </section>

              {/* ── 3. EXPERIENCE ─────────────────────────────── */}
              <section id="experience" aria-labelledby="experience-heading">
                <h2
                  id="experience-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    3
                  </span>
                  Experience
                </h2>

                <dl
                  className="grid gap-3 text-[15px] [&>div]:grid [&>div]:grid-cols-[89px_minmax(0,1fr)] [&>div]:gap-[35px] compact:[&>div]:grid-cols-[85px_minmax(0,1fr)] compact:[&>div]:gap-[18px] [&_dt]:whitespace-nowrap [&_dt]:text-muted [&_dd_span]:block [&_dd_span]:text-muted [&_a]:hover:text-heading"
                  data-timeline="true"
                >
                  <div>
                    <dt>2025 – Now</dt>
                    <dd>
                      <a
                        href="https://www.primeintellect.ai"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center text-heading font-medium"
                      >
                        Applied Researcher at Prime Intellect
                        <img
                          src="/images/external-arrow.svg"
                          alt=""
                          className="inline-block ml-1 h-3.5 w-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                      <span className="text-[14px]">San Francisco, CA</span>
                    </dd>
                  </div>

                  <div>
                    <dt>2022 – 2025</dt>
                    <dd>
                      <a
                        href="https://huggingface.co"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center text-heading font-medium"
                      >
                        Research Engineer at Hugging Face
                        <img
                          src="/images/external-arrow.svg"
                          alt=""
                          className="inline-block ml-1 h-3.5 w-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                      <span className="text-[14px]">Remote</span>
                    </dd>
                  </div>

                  <div>
                    <dt>2020 – 2022</dt>
                    <dd>
                      <a
                        href="https://www.zalando.com"
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center text-heading font-medium"
                      >
                        Machine Learning Engineer at Zalando
                        <img
                          src="/images/external-arrow.svg"
                          alt=""
                          className="inline-block ml-1 h-3.5 w-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                      <span className="text-[14px]">Berlin, DE</span>
                    </dd>
                  </div>
                </dl>
              </section>

              {/* ── 4. ELSEWHERE ──────────────────────────────── */}
              <section id="elsewhere" aria-labelledby="elsewhere-heading">
                <h2
                  id="elsewhere-heading"
                  className="relative text-heading text-[15px] font-medium leading-6 mb-4"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-[calc(100%+4px)] w-4 text-muted font-normal tabular-nums compact:static compact:mr-2 compact:inline-block"
                  >
                    4
                  </span>
                  Elsewhere
                </h2>

                <p className="mb-8 max-w-[360px] text-muted text-[15px]">
                  A few other places I keep things on the internet.
                </p>

                <div
                  className="grid grid-cols-2 gap-x-6 gap-y-[30px] compact:gap-x-3.5 compact:gap-y-6"
                  data-folder-links="true"
                >
                  <FolderCard label="X" href="https://x.com" ariaLabel="Posts on X" />
                  <FolderCard label="GitHub" href="https://github.com" ariaLabel="Code on GitHub" />
                  <FolderCard label="Spotify" href="https://open.spotify.com" ariaLabel="Music on Spotify" />
                  <FolderCard label="Are.na" href="https://www.are.na" ariaLabel="Bookmarks on Are.na" />
                </div>
              </section>

              {/* ── 5. EDUCATION ──────────────────────────────── */}
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
                  Education
                </h2>

                <dl
                  className="grid gap-3 text-[15px] [&>div]:grid [&>div]:grid-cols-[89px_minmax(0,1fr)] [&>div]:gap-[35px] compact:[&>div]:grid-cols-[85px_minmax(0,1fr)] compact:[&>div]:gap-[18px] [&_dt]:whitespace-nowrap [&_dt]:text-muted [&_dd_span]:block [&_dd_span]:text-muted"
                  data-timeline="true"
                >
                  <div>
                    <dt>2018 – 2020</dt>
                    <dd>
                      <span className="font-medium text-heading">Master’s in Computer Science</span>
                      <span className="text-[14px]">Machine Learning · Munich, DE</span>
                    </dd>
                  </div>

                  <div>
                    <dt>2015 – 2018</dt>
                    <dd>
                      <span className="font-medium text-heading">Bachelor’s in Computer Science at LMU</span>
                      <span className="text-[14px]">Munich, DE</span>
                    </dd>
                  </div>
                </dl>
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
