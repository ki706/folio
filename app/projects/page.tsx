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
    let isMounted = true;
    
    const init = async () => {
      const ps = await getProjects();
      if (isMounted) {
        setProjects(ps);
        setLoading(false);
      }
    };

    init();
    return () => { isMounted = false; };
  }, []);

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 'var(--max-width-page)', margin: '0 auto' }}>
      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
          gap: var(--card-gap);
          padding-bottom: 80px;
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="section-title-premium" style={{ color: 'var(--green)', marginBottom: 12 }}>
            <Briefcase size={13} /> Architecture
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.1, color: 'var(--white)' }}>
            Your <span className="text-gradient">Fleet.</span>
          </h1>
        </div>
        <button
          className="btn-premium"
          onClick={() => setIsSheetOpen(true)}
          style={{ height: 48, padding: '0 24px', fontSize: 13, flexShrink: 0 }}
        >
          <Plus size={18} />
          Add New Project
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="projects-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 20 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div
          className="glass-card"
          style={{ padding: 'clamp(48px, 8vw, 96px) 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 80 }}
        >
          {/* Animated icon */}
          <div
            onClick={() => setIsSheetOpen(true)}
            style={{ position: 'relative', width: 160, height: 160, marginBottom: 40, cursor: 'pointer' }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid rgba(0,255,136,0.2)',
              borderRadius: '2.5rem',
              background: '#0A0A0A',
              transform: 'rotate(12deg)',
              transition: 'transform 0.7s ease',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid var(--border)',
              borderRadius: '2.5rem',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-6deg)',
              transition: 'transform 0.7s ease',
            }}>
              <Briefcase size={48} style={{ color: 'var(--green)' }} />
            </div>
          </div>

          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.04em', marginBottom: 16 }}>
            Initialize the Grid
          </h2>
          <p style={{ fontSize: 15, color: '#888', maxWidth: 460, lineHeight: 1.7, fontWeight: 500, marginBottom: 40 }}>
            Your fleet is currently empty. Mount your active repositories to grant the neural engine structural context for content synthesis.
          </p>
          <button
            className="btn-premium"
            onClick={() => setIsSheetOpen(true)}
            style={{ height: 56, padding: '0 40px', fontSize: 13 }}
          >
            <Plus size={18} />
            Mount First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(p => (
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
