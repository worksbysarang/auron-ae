import { useState, useEffect } from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';
import AdminLogin from './AdminLogin';
import AdminOverview from './AdminOverview';
import AdminProjects from './AdminProjects';
import AdminProjectForm from './AdminProjectForm';
import AdminSettings from './AdminSettings';

const NAV_ITEMS = [
  { to: '/admin',          label: 'Overview',         icon: '⊡', end: true },
  { to: '/admin/projects', label: 'Projects / Work',  icon: '⬡' },
  { to: '/admin/settings', label: 'Site Settings',    icon: '◈' },
];

function AdminSidebar({ onLogout }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">auron.ae</div>
        <div className="admin-sidebar__badge">Admin Dashboard</div>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <span aria-hidden="true">{icon}</span> {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-dark-border)' }}>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--secondary" style={{ display: 'block', marginBottom: 'var(--space-2)', textAlign: 'center', textDecoration: 'none', fontSize: '0.6rem' }}>
          Preview site ↗
        </a>
        <button className="admin-btn admin-btn--danger" style={{ width: '100%', fontSize: '0.6rem' }} onClick={onLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    if (!isSupabaseConfigured) { setSession(null); return; }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setSession(null);
  }

  // Loading
  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-dark-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-state">
          <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <AdminLogin onLogin={() => supabase?.auth.getSession().then(({ data }) => setSession(data.session))} />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />

      <div className="admin-main">
        <header className="admin-topbar">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-grey)' }}>
            auron.ae / Admin
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-grey)' }}>
            {session?.user?.email}
          </span>
        </header>

        <div className="admin-content">
          <Routes>
            <Route index            element={<AdminOverview />} />
            <Route path="projects"  element={<AdminProjects />} />
            <Route path="projects/new"  element={<AdminProjectForm />} />
            <Route path="projects/:id"  element={<AdminProjectForm />} />
            <Route path="settings"  element={<AdminSettings />} />
            <Route path="*"         element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

