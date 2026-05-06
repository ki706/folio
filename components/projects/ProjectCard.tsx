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
    <div className="glass-card stagger-item flex flex-col h-full p-5">
      <div className="flex items-start justify-between mb-4 gap-4 overflow-hidden">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1 break-words">
            {project.name}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-2 break-words">
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

      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="pill pill-default !text-[9px] !px-2.5 !py-1">{tech}</span>
        ))}
        {project.stack.length > 4 && <span className="pill pill-default !text-[9px] !px-2.5 !py-1">+{project.stack.length - 4}</span>}
      </div>

      {project.achievement && (
        <div className="bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.1)] rounded-xl p-3 mb-5 overflow-hidden">
          <p className="text-[11px] sm:text-xs text-[var(--green)] font-bold flex items-start gap-2 break-words">
            <Globe size={14} className="flex-shrink-0 mt-0.5" /> 
            <span className="flex-1 min-w-0">{project.achievement}</span>
          </p>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[var(--muted-dark)] whitespace-nowrap">
          <Calendar size={12} />
          {timeAgo(project.updated_at)}
        </div>
        <span className={`${status.pillClass} !text-[9px] !font-black !px-2 !py-0.5 whitespace-nowrap`}>{status.label}</span>
      </div>
    </div>
  );
}
