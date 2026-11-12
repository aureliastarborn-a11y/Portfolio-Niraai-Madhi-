import React from 'react';

export default function FolderCard({ label, href, ariaLabel }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel || label}
      className="folder-link block min-w-0 rounded-[10px] group focus-visible:outline-2 focus-visible:outline-[#007aff] focus-visible:outline-offset-2"
    >
      <span className="relative block">
        <span aria-hidden="true" className="folder-shell">
          {/* Folder Back SVG */}
          <svg
            className="folder-back"
            focusable="false"
            preserveAspectRatio="none"
            viewBox="0 0 200 120"
          >
            <title>Decorative folder back</title>
            <path
              className="folder-back-shape"
              d="M17 4H79C83 4 86 5 89 8L102 20H185C193 20 197 25 197 32V106C197 113 192 117 185 117H15C8 117 3 112 3 105V18C3 10 9 4 17 4Z"
            />
          </svg>

          {/* Paper Sheets */}
          <span className="folder-paper folder-paper-back">
            <span className="paper-line paper-line-short" />
            <span className="paper-line" />
            <span className="paper-line" />
          </span>

          <span className="folder-paper folder-paper-middle">
            <span className="paper-dot" />
            <span className="paper-line paper-line-short" />
            <span className="paper-line" />
          </span>

          <span className="folder-paper folder-paper-front">
            <span className="paper-line paper-line-short" />
            <span className="paper-line" />
            <span className="paper-line paper-line-medium" />
          </span>

          {/* Folder Front Tab */}
          <span className="folder-front">
            <span className="relative z-1 truncate text-[15px] font-medium leading-5 tracking-[-0.01em] text-heading text-shadow-[0_1px_#ffffff30] compact:text-[13px]">
              {label}
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}

