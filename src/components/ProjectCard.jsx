import '../styles/components.css';

const TYPE_ICONS = {
  youtube: '▶',
  video:   '▶',
  image:   '◉',
  gallery: '⊞',
};

function PlaceholderThumb({ type }) {
  return (
    <div className="project-card__placeholder">
      <span className="project-card__placeholder-icon" aria-hidden="true">
        {TYPE_ICONS[type] || '◉'}
      </span>
      <span className="label">Media coming soon</span>
    </div>
  );
}

export default function ProjectCard({ project, onClick }) {
  const hasThumb = Boolean(project.thumbnail);
  const isVideo  = project.type === 'youtube' || project.type === 'video';

  return (
    <article
      className="project-card"
      role="button"
      tabIndex={0}
      aria-label={`Open project: ${project.title}`}
      onClick={() => onClick(project)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick(project)}
    >
      <div className="project-card__thumb">
        {hasThumb ? (
          <img
            src={project.thumbnail}
            alt={project.altText || project.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <PlaceholderThumb type={project.type} />
        )}

        {isVideo && (
          <div className="project-card__badge" aria-hidden="true">
            {project.type === 'youtube' ? 'YT' : 'MP4'}
          </div>
        )}
      </div>

      <div className="project-card__body">
        <div className="project-card__meta">
          <span className="tag tag--grey">{project.category}</span>
          {project.year && <span className="label">{project.year}</span>}
        </div>
        <h3 className="project-card__title">{project.title}</h3>
        {project.summary && (
          <p className="project-card__summary">{project.summary}</p>
        )}
      </div>
    </article>
  );
}

