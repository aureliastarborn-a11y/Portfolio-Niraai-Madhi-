import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedMenu from './components/AnimatedMenu';
import ResumeModal from './components/ResumeModal';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden font-sans selection:bg-violet-500/30 selection:text-white pb-20">
      {/* Background ambient lighting & mesh */}
      <div className="bg-glow" />
      <div className="dot-grid" />
      <div className="noise" />
      <div className="top-glow" />

      {/* Floating Glass Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero onOpenResume={() => setIsResumeOpen(true)} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      {/* Minimal Glass Footer */}
      <Footer />

      {/* Signature Animated Floating Glass Menu / Dock */}
      <AnimatedMenu onOpenResume={() => setIsResumeOpen(true)} />

      {/* Glass Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
