import { useState, useEffect, useRef } from 'react';
import VideoEmbed from './VideoEmbed';
import ImageLightbox from './ImageLightbox';
import '../styles/components.css';

function MetaField({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div>
      <div className="label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '0.9rem' }}>{display}</div>
    </div>
  );
}

export default function ProjectModal({ project, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const closeRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && !lightboxOpen) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, lightboxOpen]);

  const isVideo   = project.type === 'youtube' || project.type === 'video';
  const isImage   = project.type === 'image';
  const isGallery = project.type === 'gallery';

  const galleryImages = isGallery && project.media?.length ? project.media : [];
  const singleImage   = isImage && project.imageSrc ? [project.imageSrc] : [];

  function openLightbox(index = 0) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      <div
        className="modal-overlay"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-box">
          {/* Header */}
          <div className="modal-header">
            <div>
              <span className="tag tag--grey">{project.category}</span>
              {project.year && <span className="label" style={{ marginLeft: 8 }}>{project.year}</span>}
            </div>
            <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close project">
              <span>✕</span> <span>Close</span>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <h2 id="modal-title" style={{ marginBottom: 'var(--space-5)' }}>{project.title}</h2>

            {/* Media */}
            <div className="modal-media">
              {isVideo && <VideoEmbed project={project} />}

              {isImage && project.imageSrc && (
                <img
                  src={project.imageSrc}
                  alt={project.altText || project.title}
                  style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', cursor: 'zoom-in', background: 'var(--color-surface)' }}
                  onClick={() => openLightbox(0)}
                />
              )}

              {isGallery && galleryImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                  {galleryImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${project.title} — image ${i + 1}`}
                      loading="lazy"
                      style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', cursor: 'zoom-in' }}
                      onClick={() => openLightbox(i)}
                    />
                  ))}
                </div>
              )}

              {!isVideo && !project.imageSrc && galleryImages.length === 0 && (
                <div style={{ padding: 'var(--space-9)', textAlign: 'center', background: 'var(--color-surface)' }}>
                  <p className="label">Media coming soon</p>
                </div>
              )}
            </div>

            {project.description && (
              <p style={{ marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>{project.description}</p>
            )}

            {/* Meta grid */}
            <div className="modal-meta">
              <MetaField label="Role"       value={project.role} />
              <MetaField label="Tools"      value={project.tools} />
              <MetaField label="Year"       value={project.year} />
              <MetaField label="Project"    value={project.clientLabel} />
            </div>

            {project.externalLink && (
              <div style={{ marginTop: 'var(--space-5)' }}>
                <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                  View project ↗
                </a>
              </div>
            )}
          </div>

          {/* Nav */}
          <div className="modal-nav">
            <button className="btn btn--ghost" onClick={onPrev} disabled={!hasPrev} aria-label="Previous project">
              ← Prev
            </button>
            <button className="btn btn--ghost" onClick={onClose} aria-label="Back to work">
              Back to work
            </button>
            <button className="btn btn--ghost" onClick={onNext} disabled={!hasNext} aria-label="Next project">
              Next →
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={isGallery ? galleryImages : singleImage}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

