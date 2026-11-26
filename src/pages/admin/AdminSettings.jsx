import { useState } from 'react';
import { siteConfig } from '../../data/siteConfig';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h2 style={{ color: 'var(--color-paper)', fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>
        Site Settings
      </h2>

      <div style={{ padding: 'var(--space-5)', background: 'rgba(230,241,74,0.08)', border: '1px solid rgba(230,241,74,0.2)', marginBottom: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-yellow)', lineHeight: 1.7 }}>
        ℹ Settings below reflect the current <code>src/data/siteConfig.js</code> file.<br />
        When Supabase is configured, settings will be stored in the <code>site_settings</code> table and editable here without touching code.
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Identity</div>
            {[
              ['Brand name',    'brand',       siteConfig.brand],
              ['Creator name',  'creatorName', siteConfig.creatorName],
              ['Descriptor',    'descriptor',  siteConfig.descriptor],
              ['Site title',    'siteTitle',   siteConfig.siteTitle],
            ].map(([label, key, val]) => (
              <div key={key} className="admin-form-group">
                <label className="admin-label" htmlFor={key}>{label}</label>
                <input id={key} className="admin-input" defaultValue={val} />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Hero text</div>
            {[
              ['Eyebrow',    'heroEyebrow',    siteConfig.heroEyebrow],
              ['Headline',   'heroHeadline',   siteConfig.heroHeadline],
              ['CTA label',  'heroCta',        siteConfig.heroCta],
              ['CTA 2 label','heroCtaSecondary',siteConfig.heroCtaSecondary],
            ].map(([label, key, val]) => (
              <div key={key} className="admin-form-group">
                <label className="admin-label" htmlFor={key}>{label}</label>
                <input id={key} className="admin-input" defaultValue={val} />
              </div>
            ))}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="heroSupporting">Supporting copy</label>
              <textarea id="heroSupporting" className="admin-textarea" defaultValue={siteConfig.heroSupporting} style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Contact & socials</div>
            {[
              ['Email',     'email',     siteConfig.email],
              ['Instagram', 'instagram', siteConfig.socials.instagram],
              ['YouTube',   'youtube',   siteConfig.socials.youtube],
              ['Behance',   'behance',   siteConfig.socials.behance],
              ['LinkedIn',  'linkedin',  siteConfig.socials.linkedin],
            ].map(([label, key, val]) => (
              <div key={key} className="admin-form-group">
                <label className="admin-label" htmlFor={key}>{label}</label>
                <input id={key} className="admin-input" defaultValue={val} placeholder={key === 'email' ? 'your@email.com' : `https://${key}.com/…`} />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>SEO & footer</div>
            {[
              ['Meta description', 'metaDescription', siteConfig.metaDescription],
              ['Footer text',      'footerText',      siteConfig.footerText],
              ['Availability msg', 'availabilityMessage', siteConfig.availabilityMessage],
            ].map(([label, key, val]) => (
              <div key={key} className="admin-form-group">
                <label className="admin-label" htmlFor={key}>{label}</label>
                <input id={key} className="admin-input" defaultValue={val} />
              </div>
            ))}
          </div>
        </div>

        {saved && (
          <div style={{ padding: 'var(--space-3)', background: 'rgba(100,180,100,0.1)', border: '1px solid rgba(100,180,100,0.3)', color: '#7ec87e', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', margin: 'var(--space-5) 0' }}>
            Settings noted. Apply them to src/data/siteConfig.js (or Supabase once configured).
          </div>
        )}

        <div style={{ marginTop: 'var(--space-5)' }}>
          <button type="submit" className="admin-btn admin-btn--primary" style={{ padding: '12px 32px' }}>
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

