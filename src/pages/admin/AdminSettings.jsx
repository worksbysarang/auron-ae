import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';
import { useSiteConfig } from '../../hooks/useSiteConfig';

function emptyForm(config) {
  return {
    brand: config.brand || '',
    creatorName: config.creatorName || '',
    descriptor: config.descriptor || '',
    siteTitle: config.siteTitle || '',
    heroEyebrow: config.heroEyebrow || '',
    heroHeadline: config.heroHeadline || '',
    heroCta: config.heroCta || '',
    heroCtaSecondary: config.heroCtaSecondary || '',
    heroSupporting: config.heroSupporting || '',
    aboutBio: config.aboutBio || '',
    aboutBioLong: config.aboutBioLong || '',
    email: config.email || '',
    instagram: config.socials?.instagram || '',
    youtube: config.socials?.youtube || '',
    behance: config.socials?.behance || '',
    linkedin: config.socials?.linkedin || '',
    metaDescription: config.metaDescription || '',
    footerText: config.footerText || '',
    availabilityMessage: config.availabilityMessage || '',
  };
}

export default function AdminSettings() {
  const { config, refresh } = useSiteConfig();
  const [form, setForm] = useState(() => emptyForm(config));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(emptyForm(config));
  }, [config]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      brand: form.brand,
      creatorName: form.creatorName,
      descriptor: form.descriptor,
      siteTitle: form.siteTitle,
      heroEyebrow: form.heroEyebrow,
      heroHeadline: form.heroHeadline,
      heroCta: form.heroCta,
      heroCtaSecondary: form.heroCtaSecondary,
      heroSupporting: form.heroSupporting,
      aboutBio: form.aboutBio,
      aboutBioLong: form.aboutBioLong,
      email: form.email,
      socials: {
        instagram: form.instagram,
        youtube: form.youtube,
        behance: form.behance,
        linkedin: form.linkedin,
      },
      metaDescription: form.metaDescription,
      footerText: form.footerText,
      availabilityMessage: form.availabilityMessage,
    };

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then run supabase/schema.sql.');
      return;
    }

    setSaving(true);
    const { error: sbError } = await supabase
      .from('site_settings')
      .upsert({ key: 'config', value: payload }, { onConflict: 'key' });

    setSaving(false);
    if (sbError) {
      setError(sbError.message);
      return;
    }

    await refresh();
    setMessage('Settings saved. The public site will pick them up on the next load.');
  }

  function Field({ label, name, type = 'text' }) {
    return (
      <div className="admin-form-group">
        <label className="admin-label" htmlFor={name}>{label}</label>
        <input id={name} name={name} className="admin-input" type={type} value={form[name]} onChange={handleChange} />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: 'var(--color-paper)', fontSize: '1.5rem', marginBottom: 'var(--space-6)' }}>
        Site Settings
      </h2>

      {!isSupabaseConfigured && (
        <div style={{ padding: 'var(--space-5)', background: 'rgba(230,241,74,0.08)', border: '1px solid rgba(230,241,74,0.2)', marginBottom: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-yellow)', lineHeight: 1.7 }}>
          Supabase is not connected. Copy <code>.env.example</code> to <code>.env</code>, add your project URL and anon key, then run <code>supabase/schema.sql</code> in the SQL Editor.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Identity</div>
            <Field label="Brand name" name="brand" />
            <Field label="Creator name" name="creatorName" />
            <Field label="Descriptor" name="descriptor" />
            <Field label="Site title" name="siteTitle" />
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Hero text</div>
            <Field label="Eyebrow" name="heroEyebrow" />
            <Field label="Headline" name="heroHeadline" />
            <Field label="CTA label" name="heroCta" />
            <Field label="CTA 2 label" name="heroCtaSecondary" />
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="heroSupporting">Supporting copy</label>
              <textarea id="heroSupporting" name="heroSupporting" className="admin-textarea" value={form.heroSupporting} onChange={handleChange} style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>About</div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="aboutBio">Short bio</label>
              <textarea id="aboutBio" name="aboutBio" className="admin-textarea" value={form.aboutBio} onChange={handleChange} style={{ minHeight: 80 }} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="aboutBioLong">Long bio</label>
              <textarea id="aboutBioLong" name="aboutBioLong" className="admin-textarea" value={form.aboutBioLong} onChange={handleChange} style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Contact & socials</div>
            <Field label="Email" name="email" type="email" />
            <Field label="Instagram" name="instagram" type="url" />
            <Field label="YouTube" name="youtube" type="url" />
            <Field label="Behance" name="behance" type="url" />
            <Field label="LinkedIn" name="linkedin" type="url" />
          </div>

          <div className="admin-card">
            <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>SEO & footer</div>
            <Field label="Meta description" name="metaDescription" />
            <Field label="Footer text" name="footerText" />
            <Field label="Availability message" name="availabilityMessage" />
          </div>
        </div>

        {error && (
          <div style={{ padding: 'var(--space-3)', background: 'rgba(204,51,51,0.1)', border: '1px solid rgba(204,51,51,0.3)', color: '#cc3333', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', margin: 'var(--space-5) 0' }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ padding: 'var(--space-3)', background: 'rgba(100,180,100,0.1)', border: '1px solid rgba(100,180,100,0.3)', color: '#7ec87e', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', margin: 'var(--space-5) 0' }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-5)' }}>
          <button type="submit" className="admin-btn admin-btn--primary" style={{ padding: '12px 32px' }} disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
