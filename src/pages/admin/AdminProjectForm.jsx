import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';
import { projects as localProjects, CATEGORIES } from '../../data/projects';

const STORAGE_BUCKET = 'portfolio-media';
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4'];
const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 45;

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

async function uploadToSupabase(file, folder) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const safeBase = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const path = `${folder}/${Date.now()}-${safeBase}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function DropZone({ label, folder, accept, maxMb, multiple = false, onUploaded, helper }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const inputRef = useRef(null);

  async function processFiles(fileList) {
    if (!fileList?.length) return;
    setUploadErr('');
    if (!isSupabaseConfigured) {
      setUploadErr('Connect Supabase first to upload files.');
      return;
    }

    const files = Array.from(fileList);
    const allowed = accept === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;

    for (const f of files) {
      if (!allowed.includes(f.type)) {
        setUploadErr(`Unsupported file type: ${f.name}. Allowed: ${allowed.join(', ')}`);
        return;
      }
      if (f.size > maxMb * 1024 * 1024) {
        setUploadErr(`${f.name} is too large (max ${maxMb} MB). Use YouTube for large videos.`);
        return;
      }
    }

    setUploading(true);
    try {
      const urls = [];
      for (const f of files) {
        const url = await uploadToSupabase(f, folder);
        urls.push(url);
      }
      onUploaded(multiple ? urls : urls[0]);
    } catch (err) {
      setUploadErr(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        style={{
          border: `1px dashed ${dragging ? 'var(--color-orange)' : 'var(--color-grey)'}`,
          background: dragging ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.03)',
          padding: 'var(--space-4)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept === 'video' ? 'video/mp4' : 'image/png,image/jpeg,image/webp,image/svg+xml'}
          style={{ display: 'none' }}
          onChange={e => processFiles(e.target.files)}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: uploading ? 'var(--color-orange)' : 'var(--color-paper)' }}>
          {uploading ? 'Uploading…' : `↥ Drag & drop ${label} here, or click to browse`}
        </div>
        {helper && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--color-grey)', marginTop: 4 }}>
            {helper}
          </div>
        )}
      </div>
      {uploadErr && (
        <div style={{ color: '#cc3333', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', marginTop: 6 }}>
          {uploadErr}
        </div>
      )}
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
        title:         form.title,
        slug:          form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        summary:       form.summary,
        description:   form.description,
        category:      form.category,
        media_type:    form.type,
        featured:      form.featured,
        year:          form.year,
        role:          form.role,
        tools:         form.tools.split(',').map(t => t.trim()).filter(Boolean),
        client_label:  form.clientLabel,
        external_link: form.externalLink,
        thumbnail_url: form.thumbnail,
        youtube_url:   form.youtubeUrl,
        media_url:     form.type === 'video' ? form.videoSrc : form.imageSrc,
        gallery:       form.media.split(',').map(m => m.trim()).filter(Boolean),
        alt_text:      form.altText,
        status:        form.status,
        sort_order:    Number(form.sortOrder),
        updated_at:    new Date().toISOString(),
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
      setSuccess('Supabase not configured — please add this project manually to src/data/projects.js');
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
          ⚠ Supabase not configured. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to save projects and upload files via the dashboard.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-5)' }}>
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
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
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

              <DropZone
                label="thumbnail image"
                folder="thumbnails"
                accept="image"
                maxMb={MAX_IMAGE_MB}
                helper="PNG, JPG, WebP, SVG (max 10 MB)"
                onUploaded={url => setForm(f => ({ ...f, thumbnail: url }))}
              />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="Thumbnail preview" style={{ width: '100%', maxHeight: 140, objectFit: 'cover', marginBottom: 'var(--space-3)', border: '1px solid var(--color-dark-border)' }} />
              )}
              <Field label="Thumbnail URL" name="thumbnail" value={form.thumbnail} onChange={handleChange} helper="Auto-filled on upload, or paste a URL" />
              <Field label="Alt text for thumbnail" name="altText" value={form.altText} onChange={handleChange} />

              {form.type === 'youtube' && (
                <Field label="YouTube URL or video ID" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} helper="https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID" />
              )}

              {form.type === 'video' && (
                <>
                  <DropZone
                    label="MP4 video"
                    folder="videos"
                    accept="video"
                    maxMb={MAX_VIDEO_MB}
                    helper="MP4 (H.264, max 45 MB). Use YouTube for larger videos."
                    onUploaded={url => setForm(f => ({ ...f, videoSrc: url }))}
                  />
                  <Field label="Video URL" name="videoSrc" value={form.videoSrc} onChange={handleChange} />
                </>
              )}

              {form.type === 'image' && (
                <>
                  <DropZone
                    label="full-size artwork"
                    folder="images"
                    accept="image"
                    maxMb={MAX_IMAGE_MB}
                    helper="PNG, JPG, WebP, SVG (max 10 MB)"
                    onUploaded={url => setForm(f => ({ ...f, imageSrc: url }))}
                  />
                  <Field label="Image URL" name="imageSrc" value={form.imageSrc} onChange={handleChange} />
                </>
              )}

              {form.type === 'gallery' && (
                <>
                  <DropZone
                    label="gallery images"
                    folder="images"
                    accept="image"
                    maxMb={MAX_IMAGE_MB}
                    multiple
                    helper="Drop multiple images at once (PNG, JPG, WebP, max 10 MB each)"
                    onUploaded={urls => setForm(f => ({
                      ...f,
                      media: [f.media, ...urls].filter(Boolean).join(', '),
                    }))}
                  />
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="media">Gallery images (comma-separated URLs)</label>
                    <textarea id="media" className="admin-textarea" name="media" value={form.media} onChange={handleChange} placeholder="Auto-filled on upload" />
                  </div>
                </>
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
