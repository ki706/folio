'use client';
import { useEffect, useState, useCallback } from 'react';
import { getProjects, Project, deleteProject } from '@/lib/store';
import ProjectCard from '@/components/projects/ProjectCard';
import AddProjectSheet from '@/components/projects/AddProjectSheet';
import { Plus, Briefcase, Filter } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const ps = await getProjects();
    setProjects(ps);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingProject(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em' }}>Projects</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4 }}>Manage your technical portfolio and context.</p>
        </div>
        <button className="btn-premium" onClick={() => setIsSheetOpen(true)} style={{ padding: '0 24px', height: 48 }}>
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Briefcase size={32} style={{ color: 'var(--muted-dark)' }} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--white)' }}>No projects in your library</h2>
          <p style={{ color: 'var(--muted)', marginTop: 8, maxWidth: 360, marginBottom: 32 }}>
            Add your active builds to give the AI context. The more detail you provide, the sharper your posts will be.
          </p>
          <button className="btn-premium" onClick={() => setIsSheetOpen(true)}>
            Initialize Your First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={() => handleEdit(p)}
              onDelete={refresh}
            />
          ))}
        </div>
      )}

      {isSheetOpen && (
        <AddProjectSheet
          project={editingProject}
          onClose={closeSheet}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
