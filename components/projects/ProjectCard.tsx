'use client';
import { useState } from 'react';
import { Project, deleteProject } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { MoreVertical, Pencil, Trash2, Sparkles, Calendar, Globe, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: () => void;
}

const STATUS_STYLE: Record<string, { label: string; pillClass: string }> = {
  active:    { label: 'ACTIVE',    pillClass: 'pill pill-green' },
  completed: { label: 'SHIPPED',   pillClass: 'pill pill-blue' },
  paused:    { label: 'PAUSED',    pillClass: 'pill pill-amber' },
};

function timeAgo(dateStr: string) {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Just now';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { success, error: toastError, info } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm(`Archive "${project.name}"?`)) {
      try {
        await deleteProject(project.id);
        success(`Project "${project.name}" archived.`);
        onDelete();
      } catch (err) {
        toastError('Failed to archive project. Link severed.');
      }
    }
    setMenuOpen(false);
  };

  const handleGeneratePost = () => {
    router.push(`/generate?project=${project.id}`);
    setMenuOpen(false);
  };

  const status = STATUS_STYLE[project.status] ?? STATUS_STYLE.active;

  return (
    <div className="glass-card stagger-item" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {project.name}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {project.description || 'System context not provided.'}
          </p>
        </div>
        
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', 
              borderRadius: 8, cursor: 'pointer', color: 'var(--muted)', 
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <MoreVertical size={16} />
          </button>
          
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />
              <div className="menu-dropdown" style={{ right: 0, top: 40 }}>
                <button className="menu-item" onClick={() => { onEdit(project); setMenuOpen(false); }}>
                  <Pencil size={14} /> Edit Identity
                </button>
                <button className="menu-item" onClick={handleGeneratePost}>
                  <Sparkles size={14} /> Draft Content
                </button>
                <button className="menu-item" onClick={() => {
                  info('Neural Link: Scanning git history & synthesizing RAG context...');
                  router.push(`/generate?input=${encodeURIComponent('Deep Dive: Architecture choices for ' + project.name)}`);
                  setMenuOpen(false);
                }}>
                  <Database size={14} className="text-[#8B5CF6]" /> Deep Dive (RAG)
                </button>
                <div className="divider" style={{ margin: '4px 0' }} />
                <button className="menu-item danger" onClick={handleDelete}>
                  <Trash2 size={14} /> Archive Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="pill pill-default" style={{ fontSize: 10 }}>{tech}</span>
        ))}
        {project.stack.length > 4 && <span className="pill pill-default" style={{ fontSize: 10 }}>+{project.stack.length - 4}</span>}
      </div>

      {project.achievement && (
        <div style={{ background: 'rgba(0, 255, 136, 0.04)', border: '1px solid rgba(0, 255, 136, 0.1)', borderRadius: 10, padding: '10px 12px', marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe size={14} /> {project.achievement}
          </p>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-dark)', fontSize: 11, fontWeight: 500 }}>
          <Calendar size={12} />
          {timeAgo(project.updated_at)}
        </div>
        <span className={status.pillClass} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>{status.label}</span>
      </div>
    </div>
  );
}
