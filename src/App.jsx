import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';

export default function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
        {/* Navigation Bar */}
        <Navbar onOpenResume={() => setIsResumeOpen(true)} />

        {/* Main Content Sections */}
        <main>
          {/* 1. Hero Section */}
          <Hero onOpenResume={() => setIsResumeOpen(true)} />

          {/* 2. About Me */}
          <About />

          {/* 3. Technical Skills */}
          <Skills />

          {/* 4. Projects */}
          <Projects />

          {/* 5. Experience */}
          <Experience />

          {/* 6. Education & Certifications */}
          <Education />

          {/* 7. Contact */}
          <Contact />
        </main>

        {/* Footer */}
        <Footer />

        {/* In-Browser Resume Modal (Printable / Downloadable) */}
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}
