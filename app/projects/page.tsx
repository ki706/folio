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
      <div className="page-header" style={{ marginBottom: 64 }}>
        <div>
          <div className="section-title-premium" style={{ color: 'var(--green)', marginBottom: 12 }}>
            <Briefcase size={13} /> FLEET COMMAND
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 0.95, color: 'var(--white)' }}>
            Your <span className="text-gradient">Architectural Nodes.</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn-ghost-premium"
            onClick={() => router.push('/settings')}
            style={{ height: 48, padding: '0 24px', fontSize: 13, flexShrink: 0 }}
          >
            <Zap size={18} />
            GitHub Intelligence
          </button>
          <button
            className="btn-premium hover-glow"
            onClick={() => setIsSheetOpen(true)}
            style={{ height: 48, padding: '0 24px', fontSize: 13, flexShrink: 0 }}
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="projects-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 280, borderRadius: 24 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div
          className="glass-card"
          style={{ 
            padding: 'clamp(64px, 12vw, 120px) 40px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            marginBottom: 80,
            background: 'radial-gradient(circle at center, rgba(0,255,136,0.03) 0%, transparent 70%)',
            border: '1px dashed var(--border)'
          }}
        >
          {/* Animated icon */}
          <div
            onClick={() => setIsSheetOpen(true)}
            className="hover-glow"
            style={{ position: 'relative', width: 200, height: 200, marginBottom: 48, cursor: 'pointer' }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              border: '2px solid rgba(0,255,136,0.1)',
              borderRadius: '3rem',
              background: '#0A0A0A',
              transform: 'rotate(15deg)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid var(--border)',
              borderRadius: '3rem',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-5deg)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
            }}>
              <Briefcase size={64} style={{ color: 'var(--green)' }} />
            </div>
          </div>

          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.05em', marginBottom: 20 }}>
            Fleet Status: <span style={{ color: 'var(--muted-dark)' }}>Empty</span>
          </h2>
          <p style={{ fontSize: 17, color: '#666', maxWidth: 540, lineHeight: 1.6, fontWeight: 500, marginBottom: 48 }}>
            Initialize your first architectural node to begin synthesizing technical signals into high-resonance content.
          </p>
          <button
            className="btn-premium hover-glow"
            onClick={() => setIsSheetOpen(true)}
            style={{ height: 72, padding: '0 48px', fontSize: 16, borderRadius: 24 }}
          >
            <Plus size={24} />
            Initialize First Node
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
