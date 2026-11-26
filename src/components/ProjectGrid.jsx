import { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import '../styles/components.css';

export default function ProjectGrid({ projects }) {
  const [selected, setSelected] = useState(null);

  const idx = selected != null ? projects.findIndex(p => p.id === selected.id) : -1;

  function open(project)  { setSelected(project); }
  function close()        { setSelected(null); }
  function prev()         { if (idx > 0) setSelected(projects[idx - 1]); }
  function next()         { if (idx < projects.length - 1) setSelected(projects[idx + 1]); }

  if (projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-9)' }}>
        <p className="label">No projects in this category yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="project-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onClick={open} />
        ))}
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={close}
          onPrev={prev}
          onNext={next}
          hasPrev={idx > 0}
          hasNext={idx < projects.length - 1}
        />
      )}
    </>
  );
}

