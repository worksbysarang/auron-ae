import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import '../styles/components.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { config: siteConfig } = useSiteConfig();

  const links = [
    { to: '/',        label: 'Home' },
    { to: '/work',    label: 'Work' },
    { to: '/about',   label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo" aria-label={`${siteConfig.brand} — home`}>
          <span className="navbar__logo-brand">{siteConfig.brand}</span>
          <span className="navbar__logo-desc">{siteConfig.descriptor}</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar__links" role="list">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              role="listitem"
              className={`navbar__link${pathname === to ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/contact" className="navbar__cta">Work with me</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile${menuOpen ? ' open' : ''}`} role="menu">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            role="menuitem"
            className={`navbar__link${pathname === to ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link to="/contact" className="btn btn--primary" onClick={() => setMenuOpen(false)}>
          Work with me
        </Link>
      </div>
    </nav>
  );
}

