'use client';
import { useEffect, useState, useCallback } from 'react';
import { getProjects, Project } from '@/lib/store';
import ProjectCard from '@/components/projects/ProjectCard';
import AddProjectSheet from '@/components/projects/AddProjectSheet';
import { Plus, Briefcase } from 'lucide-react';

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
        <div className="glass-card relative overflow-hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 20px', textAlign: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,204,255,0.02)] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgba(0,204,255,0.03)] rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border border-[rgba(0,204,255,0.2)] rounded-3xl rotate-12 bg-[rgba(0,204,255,0.02)]" />
            <div className="absolute inset-0 border border-[rgba(255,255,255,0.1)] rounded-3xl -rotate-6 bg-[rgba(255,255,255,0.01)] backdrop-blur-md flex items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <Briefcase size={40} className="text-[#00CCFF] drop-shadow-[0_0_15px_rgba(0,204,255,0.5)]" />
            </div>
          </div>
          
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.03em', marginBottom: 12 }} className="relative z-10">No projects in your library</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 420, marginBottom: 40, lineHeight: 1.6 }} className="relative z-10">
            Add your active builds to give the AI context. The more detail you provide, the sharper your posts will be.
          </p>
          <button className="btn-premium relative z-10 shadow-[0_0_30px_rgba(0,204,255,0.15)] hover:shadow-[0_0_40px_rgba(0,204,255,0.25)]" onClick={() => setIsSheetOpen(true)}>
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
