import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const { projects, loading } = useProjects({ adminMode: true });

  const published = projects.filter(p => p.status === 'published' || p.visible).length;
  const drafts    = projects.filter(p => p.status === 'draft').length;
  const featured  = projects.filter(p => p.featured).length;
  const recent    = [...projects].sort((a, b) =>
    new Date(b.updatedAt || b.updated_at || 0) - new Date(a.updatedAt || a.updated_at || 0)
  ).slice(0, 5);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ color: 'var(--color-paper)', marginBottom: 4, fontSize: '1.5rem' }}>Overview</h2>
        <p style={{ color: 'var(--color-grey)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>
          auron.ae content dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="admin-grid" style={{ marginBottom: 'var(--space-7)' }}>
        {[
          { label: 'Published',  value: published },
          { label: 'Drafts',     value: drafts    },
          { label: 'Featured',   value: featured  },
          { label: 'Total',      value: projects.length },
        ].map(({ label, value }) => (
          <div key={label} className="admin-card">
            <div className="admin-stat">{value}</div>
            <div className="admin-stat-label">{label} projects</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-5)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-grey)', marginBottom: 'var(--space-4)' }}>
          Quick actions
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link to="/admin/projects/new" className="admin-btn admin-btn--primary">+ Add new project</Link>
          <Link to="/admin/projects"     className="admin-btn admin-btn--secondary">Manage projects</Link>
          <Link to="/admin/settings"     className="admin-btn admin-btn--secondary">Site settings</Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--secondary">Preview site ↗</a>
        </div>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div className="admin-card">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-grey)', marginBottom: 'var(--space-4)' }}>
            Recent projects
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--color-paper)' }}>{p.title}</td>
                  <td style={{ color: 'var(--color-grey)' }}>{p.category}</td>
                  <td>
                    <span className={`status-badge status-badge--${p.status || (p.visible ? 'published' : 'draft')}`}>
                      {p.status || (p.visible ? 'published' : 'draft')}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/projects/${p.id}`} className="admin-btn admin-btn--secondary" style={{ fontSize: '0.55rem', padding: '4px 10px' }}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

