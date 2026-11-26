import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import '../styles/components.css';

const socialIcons = {
  instagram: '◈ Instagram',
  youtube:   '▶ YouTube',
  behance:   '⬡ Behance',
  linkedin:  '□ LinkedIn',
};

export default function Footer() {
  const activeSocials = Object.entries(siteConfig.socials).filter(([, v]) => v);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div>
            <div className="footer__brand">{siteConfig.brand}</div>
            <div className="label" style={{ marginTop: 4 }}>{siteConfig.descriptor}</div>
          </div>

          <nav className="footer__links" aria-label="Footer navigation">
            <Link to="/work"    className="footer__link">Work</Link>
            <Link to="/about"   className="footer__link">About</Link>
            <Link to="/contact" className="footer__link">Contact</Link>
            {activeSocials.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="footer__link">
                {socialIcons[key] || key}
              </a>
            ))}
          </nav>
        </div>

        {siteConfig.availabilityMessage && (
          <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
            <span className="tag tag--orange">{siteConfig.availabilityMessage}</span>
          </div>
        )}

        <div className="footer__copy">
          {siteConfig.footerText} · {new Date().getFullYear()}
          <span style={{ margin: '0 8px', opacity: 0.4 }}>|</span>
          <Link to="/admin" className="footer__link" style={{ opacity: 0.4, fontSize: '0.55rem' }}>admin</Link>
        </div>
      </div>
    </footer>
  );
}

