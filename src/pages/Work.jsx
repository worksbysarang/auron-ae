import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ProjectGrid from '../components/ProjectGrid';
import { useProjects } from '../hooks/useProjects';

export default function Work() {
  const { projects, loading } = useProjects();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <main style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Page header */}
      <div style={{
        borderBottom: 'var(--border-thin)',
        padding: 'var(--space-8) 0 var(--space-6)',
        background: 'rgba(23,23,23,0.02)',
      }}>
        <div className="container">
          <p className="label" style={{ color: 'var(--color-orange)', marginBottom: 'var(--space-3)' }}>
            — Visual Archive
          </p>
          <h1 style={{ marginBottom: 'var(--space-5)' }}>Work</h1>
          <p style={{ color: 'var(--color-grey)', maxWidth: '50ch' }}>
            A selection of video editing, motion graphics, graphic design, and other creative experiments.
          </p>
        </div>
      </div>

      <div style={{ padding: 'var(--space-7) 0' }}>
        <div className="container">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

          {loading ? (
            <div className="loading-state">
              <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
              <span>Loading archive…</span>
            </div>
          ) : (
            <>
              <div className="label" style={{ marginBottom: 'var(--space-5)', color: 'var(--color-grey)' }}>
                {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </div>
              <ProjectGrid projects={filtered} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

