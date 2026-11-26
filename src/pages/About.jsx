import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';

export default function About() {
  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Page header */}
      <div style={{
        borderBottom: 'var(--border-thin)',
        padding: 'var(--space-8) 0 var(--space-6)',
        background: 'rgba(23,23,23,0.02)',
      }}>
        <div className="container">
          <p className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-3)' }}>— The creator</p>
          <h1>About</h1>
        </div>
      </div>

      {/* Bio */}
      <section style={{ padding: 'var(--space-9) 0', borderBottom: 'var(--border-thin)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
          gap: 'var(--space-9)',
          alignItems: 'start',
        }}>
          <div>
            <div className="label" style={{ marginBottom: 'var(--space-5)' }}>Identity</div>
            <h2 style={{ marginBottom: 'var(--space-5)' }}>
              I'm Sarang —<br />the creator behind {siteConfig.brand}.
            </h2>
            <p style={{ color: 'var(--color-grey)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
              {siteConfig.aboutBio}
            </p>
            <p style={{ color: 'var(--color-grey)', lineHeight: 1.8 }}>
              {siteConfig.aboutBioLong}
            </p>
          </div>

          <div>
            <div
              style={{
                border: 'var(--border-thin)',
                padding: 'var(--space-5)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                lineHeight: 2.2,
              }}
            >
              <div className="label" style={{ marginBottom: 'var(--space-3)', color: 'var(--color-orange)' }}>FILE // INFO</div>
              <div>Creator______ Sarang</div>
              <div>Brand________ auron.ae</div>
              <div>Focus________ Video + Design</div>
              <div>Platforms____ Digital</div>
            </div>

            {siteConfig.availabilityMessage && (
              <div style={{ marginTop: 'var(--space-4)' }}>
                <span className="tag tag--orange">{siteConfig.availabilityMessage}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: 'var(--space-9) 0', borderBottom: 'var(--border-thin)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-header__label">Capabilities</p>
              <h2>What I do</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-5)' }}>
            {siteConfig.services.map((svc, i) => (
              <div key={svc.id} style={{ borderTop: '2px solid var(--color-ink)', paddingTop: 'var(--space-4)' }}>
                <span className="label" style={{ color: 'var(--color-orange)', display: 'block', marginBottom: 'var(--space-2)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1.05rem' }}>{svc.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-grey)', lineHeight: 1.6 }}>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume placeholder — hidden until resume is supplied */}
      {/* Uncomment and fill in when ready:
      <section style={{ padding: 'var(--space-9) 0', borderBottom: 'var(--border-thin)' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-5)' }}>Résumé</h2>
          <p>Add resume content here after supplying verified information.</p>
        </div>
      </section>
      */}

      {/* CTA */}
      <section style={{ padding: 'var(--space-9) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-3)' }}>Ready to collaborate?</p>
          <h2 style={{ marginBottom: 'var(--space-5)' }}>Let's make something worth looking at.</h2>
          <Link to="/contact" className="btn btn--primary">Get in touch →</Link>
        </div>
      </section>
    </main>
  );
}

