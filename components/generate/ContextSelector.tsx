'use client';
import { Project } from '@/lib/store';

interface ContextSelectorProps {
  projects: Project[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function ContextSelector({ projects, selected, onSelect }: ContextSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      <button
        className={`context-pill${selected === null ? ' active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All Projects
      </button>
      {projects.map((p) => (
        <button
          key={p.id}
          className={`context-pill${selected === p.id ? ' active' : ''}`}
          onClick={() => onSelect(p.id)}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
