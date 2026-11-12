import React from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ image, isOpen, onClose }) {
  if (!isOpen || !image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-zoom-out animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="relative aspect-project w-full overflow-hidden">
          <img
            src={image.bg}
            alt=""
            className="size-full object-cover select-none"
          />
          <div className="absolute inset-[6%] flex items-center justify-center drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]">
            <img
              src={image.screenshot}
              alt={image.title || ''}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {image.title && (
          <div className="p-4 bg-zinc-950 text-center text-xs text-zinc-400 border-t border-white/5">
            {image.title}
          </div>
        )}
      </div>
    </div>
  );
}

