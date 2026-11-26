import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';

export default function AdminProjects() {
  const { projects, loading } = useProjects({ adminMode: true });
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [deleting, setDeleting] = useState(null);

  const filtered = projects.filter(p => {
    const matchStatus  = filter === 'all' || (p.status || (p.visible ? 'published' : 'draft')) === filter;
    const matchSearch  = p.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  async function handleDelete(id) {
    if (!window.confirm('Permanently delete this project? This cannot be undone.')) return;
    setDeleting(id);
    if (isSupabaseConfigured) {
      await supabase.from('projects').delete().eq('id', id);
    }
    setDeleting(null);
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        <span>Loading projects…</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h2 style={{ color: 'var(--color-paper)', fontSize: '1.5rem' }}>Projects</h2>
        <Link to="/admin/projects/new" className="admin-btn admin-btn--primary">+ Add project</Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        <input
          className="admin-input"
          type="search"
          placeholder="Search projects…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        {['all', 'published', 'draft'].map(f => (
          <button
            key={f}
            className={`admin-btn ${filter === f ? 'admin-btn--primary' : 'admin-btn--secondary'}`}
            onClick={() => setFilter(f)}
            style={{ fontSize: '0.6rem' }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Type</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-grey)', padding: 'var(--space-7)' }}>
                  No projects found.
                </td>
              </tr>
            )}
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ color: 'var(--color-paper)', fontWeight: 500 }}>{p.title}</td>
                <td style={{ color: 'var(--color-grey)' }}>{p.category}</td>
                <td><span className="label">{p.type || p.media_type}</span></td>
                <td>
                  <span className={`status-badge status-badge--${p.status || (p.visible ? 'published' : 'draft')}`}>
                    {p.status || (p.visible ? 'published' : 'draft')}
                  </span>
                </td>
                <td style={{ color: p.featured ? 'var(--color-orange)' : 'var(--color-grey)' }}>
                  {p.featured ? '★' : '—'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link
                      to={`/admin/projects/${p.id}`}
                      className="admin-btn admin-btn--secondary"
                      style={{ fontSize: '0.55rem', padding: '4px 10px' }}
                    >
                      Edit
                    </Link>
                    <button
                      className="admin-btn admin-btn--danger"
                      style={{ fontSize: '0.55rem', padding: '4px 10px' }}
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

