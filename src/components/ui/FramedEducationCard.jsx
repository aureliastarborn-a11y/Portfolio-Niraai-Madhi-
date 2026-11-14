import React, { useState } from 'react';
import './framed-education-card.css';
import { GraduationCap, Award, Sparkles } from 'lucide-react';

export default function FramedEducationCard({ educationItem, className = '' }) {
  const [copied, setCopied] = useState(false);

  const institution = educationItem?.institution || "Tagore Engineering College";
  const period = educationItem?.period || "2023 – 2027";
  const degree = educationItem?.degree || "B.Tech in Artificial Intelligence & Data Science";
  const detail = educationItem?.detail || "CGPA: 8.0 · Coursework: Machine Learning, Database Management, Python, Cloud Computing";

  const handleCopy = (e) => {
    try {
      const textToCopy = `${degree} | ${institution} (${period}) - ${detail}`;
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={`framed-education-container ${className}`}>
      <div className="btn-wrapper">
        <button
          type="button"
          className="btn"
          onClick={handleCopy}
          title="Click to copy academic credentials"
          aria-label="Education: B.Tech in Artificial Intelligence & Data Science at Tagore Engineering College"
        >
          {/* Animated Bounding Box Frame with 4 Precision Corner Points */}
          <div className="frame">
            <span className="point top left" aria-hidden="true" />
            <span className="point top right" aria-hidden="true" />
            <span className="point bottom left" aria-hidden="true" />
            <span className="point bottom right" aria-hidden="true" />
          </div>

          {/* Animated Text Box with Dual Layers (Resting & Hover States) */}
          <div className="txt-box">
            {/* Primary / Resting State */}
            <div className="txt text-left">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-600 mb-1">
                <span className="font-semibold text-zinc-800 tracking-wide flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-600" />
                  {institution}
                </span>
                <span className="text-zinc-600 font-medium">{period}</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 leading-snug mb-1">
                {degree}
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed font-normal">
                {detail}
              </p>
            </div>

            {/* Secondary / Hover State */}
            <div className="txt text-left">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-600 mb-1">
                <span className="font-semibold text-zinc-800 tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
                  Anna University Affiliation · Chennai
                </span>
                <span className="text-zinc-800 font-medium font-mono">CGPA: 8.0 / 10.0</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 leading-snug mb-1">
                Artificial Intelligence &amp; Autonomous Systems Specialization
              </h3>
              <p className="text-xs sm:text-[13px] text-zinc-700 leading-relaxed font-normal">
                Core Domain: Machine Learning, Deep Neural Networks, ETL Warehousing, &amp; Cloud AI Deployment
              </p>
            </div>
          </div>
        </button>

        {/* Secondary Subtitle Hints Below Frame */}
        <span id="hint1" className="txt-secondary">
          Undergraduate Degree Program • Hover to view curriculum specialization
        </span>
        <span id="hint2" className="txt-secondary">
          Anna University Affiliated • Autonomous AI &amp; Data Science Specialization
        </span>
      </div>
    </div>
  );
}
