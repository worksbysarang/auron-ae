import { useState, useEffect, useCallback } from 'react';
import '../styles/components.css';

export default function ImageLightbox({ images, startIndex = 0, altTexts = [], onClose }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  // Trap focus
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="lightbox-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close image viewer">✕</button>

      <img
        className="lightbox-img"
        src={images[current]}
        alt={altTexts[current] || `Image ${current + 1} of ${images.length}`}
      />

      {images.length > 1 && (
        <>
          <button className="lightbox-nav lightbox-nav--prev" onClick={prev} aria-label="Previous image">‹</button>
          <button className="lightbox-nav lightbox-nav--next" onClick={next} aria-label="Next image">›</button>
          <div
            style={{
              position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}
          >
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

