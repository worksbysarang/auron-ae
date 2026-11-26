import { CATEGORIES } from '../data/projects';
import '../styles/components.css';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`category-filter__btn${active === cat ? ' active' : ''}`}
          onClick={() => onChange(cat)}
          aria-pressed={active === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

