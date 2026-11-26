import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useState } from 'react';

export default function Home() {
  const { projects, loading } = useProjects();
  const [selected, setSelected] = useState(null);

  const featured = projects.filter(p =>
    siteConfig.featuredProjectIds.includes(p.id) || p.featured
  ).slice(0, 6);

  const idx = selected ? featured.findIndex(p => p.id === selected.id) : -1;

  return (
    <main>
      {/* ---- HERO ---- */}
      <section className="hero scanlines" aria-label="Hero">
        <div className="hero__bg">
          <div className="hero__grid-lines" aria-hidden="true" />
        </div>
        <div className="hero__monogram" aria-hidden="true">A</div>

        <div className="container hero__content">
          <p className="hero__eyebrow">{siteConfig.heroEyebrow}</p>
          <h1 className="hero__headline">{siteConfig.heroHeadline}</h1>
          <p className="hero__sub">{siteConfig.heroSupporting}</p>

          <div className="hero__ctas">
            <Link to="/work" className="btn btn--primary">
              {siteConfig.heroCta} →
            </Link>
            <Link to="/contact" className="btn btn--secondary">
              {siteConfig.heroCtaSecondary}
            </Link>
          </div>
        </div>

        <div className="hero__meta" aria-hidden="true">
          <span>VOL. 01</span>
          <span>{siteConfig.brand}</span>
          <span>Visual Archive</span>
        </div>
      </section>

      {/* ---- FEATURED WORK ---- */}
      <section style={{ padding: 'var(--space-9) 0' }} aria-label="Featured work">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-header__label">Selected Work</p>
              <h2>Featured Projects</h2>
            </div>
            <Link to="/work" className="btn btn--ghost">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
              <span>Loading archive…</span>
            </div>
          ) : (
            <div className="project-grid">
              {featured.map(p => (
                <ProjectCard key={p.id} project={p} onClick={setSelected} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---- SERVICES ---- */}
      <section style={{ padding: 'var(--space-9) 0', borderTop: 'var(--border-thin)', background: 'rgba(23,23,23,0.02)' }} aria-label="Services">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-header__label">What I do</p>
              <h2>Services</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            {siteConfig.services.map((svc, i) => (
              <div
                key={svc.id}
                style={{
                  borderTop: '2px solid var(--color-ink)',
                  paddingTop: 'var(--space-4)',
                  paddingRight: 'var(--space-4)',
                }}
              >
                <span className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-2)', display: 'block' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1.1rem' }}>{svc.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)' }}>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- ABOUT PREVIEW ---- */}
      <section style={{ padding: 'var(--space-9) 0', borderTop: 'var(--border-thin)' }} aria-label="About preview">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
          <div>
            <p className="section-header__label" style={{ marginBottom: 'var(--space-3)' }}>The creator</p>
            <h2 style={{ marginBottom: 'var(--space-5)' }}>About {siteConfig.brand}</h2>
            <p style={{ color: 'var(--color-grey)', marginBottom: 'var(--space-5)', lineHeight: 1.7 }}>
              {siteConfig.aboutBio}
            </p>
            <Link to="/about" className="btn btn--secondary">Learn more →</Link>
          </div>

          <div
            aria-hidden="true"
            style={{
              borderTop: '2px solid var(--color-ink)',
              borderLeft: '2px solid var(--color-ink)',
              padding: 'var(--space-6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              lineHeight: 2,
              color: 'var(--color-grey)',
            }}
          >
            <div style={{ color: 'var(--color-orange)' }}>PROFILE // auron.ae</div>
            <div>Creator_______ Sarang</div>
            <div>Type__________ Independent</div>
            <div>Focus_________ Video + Design</div>
            <div>Status________ {siteConfig.availabilityMessage || 'Creative work'}</div>
          </div>
        </div>
      </section>

      {/* ---- CTA BANNER ---- */}
      <section style={{
        padding: 'var(--space-9) 0',
        background: 'var(--color-ink)',
        color: 'var(--color-paper)',
        borderTop: 'var(--border-thin)',
        textAlign: 'center',
      }} aria-label="Contact call to action">
        <div className="container">
          <p className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-3)' }}>Let's make something</p>
          <h2 style={{ marginBottom: 'var(--space-5)', color: 'var(--color-paper)' }}>Got a project in mind?</h2>
          <Link to="/contact" className="btn btn--secondary" style={{ color: 'var(--color-paper)', borderColor: 'var(--color-paper)' }}>
            Get in touch →
          </Link>
        </div>
      </section>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={() => setSelected(null)}
          onPrev={() => idx > 0 && setSelected(featured[idx - 1])}
          onNext={() => idx < featured.length - 1 && setSelected(featured[idx + 1])}
          hasPrev={idx > 0}
          hasNext={idx < featured.length - 1}
        />
      )}
    </main>
  );
}

