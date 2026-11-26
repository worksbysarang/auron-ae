import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';
import { projects as localProjects } from '../../data/projects';
import { CATEGORIES } from '../../data/projects';

const EMPTY_FORM = {
  title: '', slug: '', summary: '', description: '',
  category: 'Video Editing', type: 'youtube', featured: false,
  year: '', role: '', tools: '', clientLabel: '', externalLink: '',
  thumbnail: '', youtubeUrl: '', videoSrc: '', imageSrc: '',
  media: '', altText: '', status: 'draft', sortOrder: 0,
};

function Field({ label, name, type = 'text', value, onChange, required, helper }) {
  return (
    <div className="admin-form-group">
      <label className="admin-label" htmlFor={name}>{label}{required && ' *'}</label>
      {helper && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-grey)', marginBottom: 6 }}>{helper}</p>}
      <input id={name} className="admin-input" type={type} name={name} value={value} onChange={onChange} required={required} />
    </div>
  );
}

export default function AdminProjectForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isNew    = !id || id === 'new';

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isNew) return;
    // Try to load from Supabase or local fallback
    async function load() {
      if (isSupabaseConfigured) {
        const { data } = await supabase.from('projects').select('*').eq('id', id).single();
        if (data) {
          setForm({
            title:       data.title        || '',
            slug:        data.slug         || '',
            summary:     data.summary      || '',
            description: data.description  || '',
            category:    data.category     || 'Video Editing',
            type:        data.media_type   || data.type || 'youtube',
            featured:    data.featured     || false,
            year:        data.year         || '',
            role:        data.role         || '',
            tools:       (data.tools || []).join(', '),
            clientLabel: data.client_label || '',
            externalLink: data.external_link || '',
            thumbnail:   data.thumbnail_url || '',
            youtubeUrl:  data.youtube_url   || '',
            videoSrc:    data.media_url     || '',
            imageSrc:    data.media_url     || '',
            media:       (data.gallery || []).join(', '),
            altText:     data.alt_text      || '',
            status:      data.status        || 'draft',
            sortOrder:   data.sort_order    || 0,
          });
        }
      } else {
        const local = localProjects.find(p => p.id === id);
        if (local) {
          setForm({
            title: local.title || '', slug: local.slug || local.id || '',
            summary: local.summary || '', description: local.description || '',
            category: local.category || 'Video Editing', type: local.type || 'youtube',
            featured: local.featured || false, year: local.year || '',
            role: local.role || '', tools: (local.tools || []).join(', '),
            clientLabel: local.clientLabel || '', externalLink: local.externalLink || '',
            thumbnail: local.thumbnail || '', youtubeUrl: local.youtubeUrl || '',
            videoSrc: local.videoSrc || '', imageSrc: local.imageSrc || '',
            media: (local.media || []).join(', '), altText: local.altText || '',
            status: local.status || 'published', sortOrder: local.sortOrder || 0,
          });
        }
      }
    }
    load();
  }, [id, isNew]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);

    if (isSupabaseConfigured) {
      const payload = {
        title:        form.title,
        slug:         form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        summary:      form.summary,
        description:  form.description,
        category:     form.category,
        media_type:   form.type,
        featured:     form.featured,
        year:         form.year,
        role:         form.role,
        tools:        form.tools.split(',').map(t => t.trim()).filter(Boolean),
        client_label: form.clientLabel,
        external_link: form.externalLink,
        thumbnail_url: form.thumbnail,
        youtube_url:  form.youtubeUrl,
        media_url:    form.videoSrc || form.imageSrc,
        gallery:      form.media.split(',').map(m => m.trim()).filter(Boolean),
        alt_text:     form.altText,
        status:       form.status,
        sort_order:   Number(form.sortOrder),
        updated_at:   new Date().toISOString(),
      };

      let sbError;
      if (isNew) {
        ({ error: sbError } = await supabase.from('projects').insert([payload]));
      } else {
        ({ error: sbError } = await supabase.from('projects').update(payload).eq('id', id));
      }

      if (sbError) { setError(sbError.message); setSaving(false); return; }
      setSuccess('Project saved successfully!');
      setTimeout(() => navigate('/admin/projects'), 1200);
    } else {
      // Local-only mode: show instructions
      setSuccess(
        'Supabase not configured — please add this project manually to src/data/projects.js'
      );
    }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <button className="admin-btn admin-btn--secondary" onClick={() => navigate('/admin/projects')} style={{ fontSize: '0.6rem' }}>
          ← Back
        </button>
        <h2 style={{ color: 'var(--color-paper)', fontSize: '1.3rem' }}>
          {isNew ? 'Add project' : 'Edit project'}
        </h2>
      </div>

      {!isSupabaseConfigured && (
        <div style={{ padding: 'var(--space-4)', background: 'rgba(230,241,74,0.08)', border: '1px solid rgba(230,241,74,0.2)', marginBottom: 'var(--space-5)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-yellow)', lineHeight: 1.7 }}>
          ⚠ Supabase not configured. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to save projects via the dashboard.
          In the meantime, edit <code>src/data/projects.js</code> directly.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
          <div>
            <div className="admin-card">
              <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Basic info</div>
              <Field label="Title" name="title" value={form.title} onChange={handleChange} required />
              <Field label="Slug / ID" name="slug" value={form.slug} onChange={handleChange} helper="Leave empty to auto-generate" />
              <Field label="Short summary" name="summary" value={form.summary} onChange={handleChange} />
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="description">Full description</label>
                <textarea id="description" className="admin-textarea" name="description" value={form.description} onChange={handleChange} />
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Categorization</div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="category">Category</label>
                <select id="category" className="admin-select" name="category" value={form.category} onChange={handleChange}>
                  {['Video Editing','Motion Graphics','Graphic Design','Posters & Thumbnails','Experiments'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="type">Media type</label>
                <select id="type" className="admin-select" name="type" value={form.type} onChange={handleChange}>
                  <option value="youtube">YouTube</option>
                  <option value="video">Local video (MP4)</option>
                  <option value="image">Single image</option>
                  <option value="gallery">Gallery</option>
                </select>
              </div>
              <Field label="Year (optional)" name="year" value={form.year} onChange={handleChange} />
              <Field label="Role (optional)" name="role" value={form.role} onChange={handleChange} helper="e.g. Editor, Designer" />
              <Field label="Tools (comma-separated)" name="tools" value={form.tools} onChange={handleChange} />
              <Field label="Client / Project label (optional)" name="clientLabel" value={form.clientLabel} onChange={handleChange} />
              <Field label="External link (optional)" name="externalLink" type="url" value={form.externalLink} onChange={handleChange} />
            </div>
          </div>

          <div>
            <div className="admin-card">
              <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Media & assets</div>
              <Field label="Thumbnail URL" name="thumbnail" value={form.thumbnail} onChange={handleChange} helper="/assets/thumbnails/your-thumb.webp" />
              <Field label="Alt text for thumbnail" name="altText" value={form.altText} onChange={handleChange} />

              {form.type === 'youtube' && (
                <Field label="YouTube URL or video ID" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} helper="https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID" />
              )}
              {form.type === 'video' && (
                <Field label="Local video path" name="videoSrc" value={form.videoSrc} onChange={handleChange} helper="/assets/videos/your-file.mp4" />
              )}
              {form.type === 'image' && (
                <Field label="Image path" name="imageSrc" value={form.imageSrc} onChange={handleChange} helper="/assets/images/your-image.webp" />
              )}
              {form.type === 'gallery' && (
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="media">Gallery images (comma-separated paths)</label>
                  <textarea id="media" className="admin-textarea" name="media" value={form.media} onChange={handleChange} placeholder="/assets/images/01.webp, /assets/images/02.webp" />
                </div>
              )}
            </div>

            <div className="admin-card">
              <div className="admin-label" style={{ marginBottom: 'var(--space-4)' }}>Publish settings</div>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="status">Status</label>
                <select id="status" className="admin-select" name="status" value={form.status} onChange={handleChange}>
                  <option value="draft">Draft (not visible publicly)</option>
                  <option value="published">Published (visible publicly)</option>
                </select>
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} style={{ width: 16, height: 16 }} />
                <label htmlFor="featured" className="admin-label" style={{ marginBottom: 0 }}>Featured on homepage</label>
              </div>
              <Field label="Sort order" name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} helper="Lower number = shown first" />
            </div>

            {error   && <div style={{ padding: 'var(--space-3)', background: 'rgba(204,51,51,0.1)', border: '1px solid rgba(204,51,51,0.3)', color: '#cc3333', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: 'var(--space-3)' }}>{error}</div>}
            {success && <div style={{ padding: 'var(--space-3)', background: 'rgba(100,180,100,0.1)', border: '1px solid rgba(100,180,100,0.3)', color: '#7ec87e', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: 'var(--space-3)' }}>{success}</div>}

            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving} style={{ width: '100%', padding: '14px' }}>
              {saving ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

