import { siteConfig } from '../data/siteConfig';

const socialDefs = [
  { key: 'instagram', label: 'Instagram',  icon: '◈' },
  { key: 'youtube',   label: 'YouTube',    icon: '▶' },
  { key: 'behance',   label: 'Behance',    icon: '⬡' },
  { key: 'linkedin',  label: 'LinkedIn',   icon: '□' },
];

export default function Contact() {
  const activeSocials = socialDefs.filter(s => siteConfig.socials[s.key]);
  const hasEmail = siteConfig.email && !siteConfig.email.includes('YOUR_EMAIL');

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Page header */}
      <div style={{
        borderBottom: 'var(--border-thin)',
        padding: 'var(--space-8) 0 var(--space-6)',
        background: 'rgba(23,23,23,0.02)',
      }}>
        <div className="container">
          <p className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-3)' }}>— Get in touch</p>
          <h1>Contact</h1>
        </div>
      </div>

      <section style={{ padding: 'var(--space-9) 0' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-9)',
          alignItems: 'start',
        }}>
          {/* Left */}
          <div>
            <div className="label" style={{ marginBottom: 'var(--space-5)' }}>Work with me</div>
            <h2 style={{ marginBottom: 'var(--space-5)' }}>
              Got a project?<br />Let's talk.
            </h2>
            <p style={{ color: 'var(--color-grey)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
              Whether you have a brief or just an idea, reach out and let's figure out what we can build together.
            </p>

            {hasEmail && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div className="label" style={{ marginBottom: 'var(--space-2)' }}>Email</div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="btn btn--primary"
                  style={{ display: 'inline-flex' }}
                >
                  {siteConfig.email} →
                </a>
              </div>
            )}

            {!hasEmail && (
              <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)', border: '1px dashed var(--color-grey)' }}>
                <p className="label" style={{ color: 'var(--color-orange)' }}>Email placeholder</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', marginTop: 4 }}>
                  Update <code>siteConfig.email</code> in <code>src/data/siteConfig.js</code>
                </p>
              </div>
            )}

            {activeSocials.length > 0 && (
              <div>
                <div className="label" style={{ marginBottom: 'var(--space-3)' }}>Social & portfolio</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {activeSocials.map(s => (
                    <a
                      key={s.key}
                      href={siteConfig.socials[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--ghost"
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {s.icon} {s.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            {activeSocials.length === 0 && (
              <div style={{ padding: 'var(--space-4)', border: '1px dashed var(--color-grey)' }}>
                <p className="label" style={{ color: 'var(--color-orange)' }}>Social links placeholder</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-grey)', marginTop: 4 }}>
                  Add your social URLs in <code>src/data/siteConfig.js</code> under <code>socials</code>.
                </p>
              </div>
            )}
          </div>

          {/* Right — retro terminal card */}
          <div
            style={{
              background: 'var(--color-ink)',
              color: 'var(--color-paper)',
              padding: 'var(--space-6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              lineHeight: 2,
            }}
          >
            <div style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-4)' }}>
              &gt; CONTACT // auron.ae
            </div>
            <div>Preferred contact: Email</div>
            <div>Response time:     1–3 days</div>
            <div>Project types:     Video, Motion,</div>
            <div>                   Design</div>
            <div>Languages:         EN</div>
            <div style={{ marginTop: 'var(--space-4)', color: 'var(--color-grey)' }}>
              — Ready for new projects
            </div>
            <div style={{ marginTop: 'var(--space-5)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-4)', color: 'var(--color-grey)', fontSize: '0.6rem' }}>
              © {new Date().getFullYear()} {siteConfig.brand}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

