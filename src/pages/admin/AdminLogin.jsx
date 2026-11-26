import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../utils/supabase';

export default function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      setLoading(false);
      return;
    }

    const { error: sbError } = await supabase.auth.signInWithPassword({ email, password });
    if (sbError) {
      setError(sbError.message);
    } else {
      onLogin();
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-dark-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-5)',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 'var(--space-7)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-paper)', marginBottom: 4 }}>
            auron.ae
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-orange)' }}>
            Admin Dashboard
          </div>
        </div>

        <div style={{ background: 'var(--color-dark-surface)', border: '1px solid var(--color-dark-border)', padding: 'var(--space-6)' }}>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                className="admin-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="owner@example.com"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                className="admin-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ color: '#cc3333', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(204,51,51,0.1)', border: '1px solid rgba(204,51,51,0.3)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          {!isSupabaseConfigured && (
            <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'rgba(230,241,74,0.08)', border: '1px solid rgba(230,241,74,0.2)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--color-yellow)', lineHeight: 1.6 }}>
                ⚠ Supabase not configured.<br />
                Create a .env file with:<br />
                VITE_SUPABASE_URL=your_url<br />
                VITE_SUPABASE_ANON_KEY=your_key
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
          <a href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--color-grey)', textDecoration: 'none' }}>
            ← Back to public site
          </a>
        </div>
      </div>
    </div>
  );
}

