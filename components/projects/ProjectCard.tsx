'use client';
import { useState } from 'react';
import { Project, deleteProject } from '@/lib/store';
import { MoreVertical, Pencil, Trash2, Sparkles, Calendar, Globe, Database } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_STYLE = {
  active: { label: 'ACTIVE', pillClass: 'pill-green' },
  completed: { label: 'COMPLETE', pillClass: 'pill-blue' },
  paused: { label: 'PAUSED', pillClass: 'pill-amber' },
};

function timeAgo(date: string) {
  if (!date) return 'Unknown';
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { success, error: toastError } = useToast();
  const status = STATUS_STYLE[project.status] ?? STATUS_STYLE.active;

  const handleDelete = async () => {
    if (confirm('Decommission this architectural node?')) {
      try {
        await deleteProject(project.id);
        success('Project purged from fleet.');
        onDelete();
      } catch (err) {
        toastError('Decommissioning failed. Link active.');
      }
    }
  };

  return (
    <div className="glass-card stagger-item group relative flex flex-col h-full overflow-hidden p-6 sm:p-8">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--accent)] mb-1.5 uppercase tracking-widest">
             <Database size={12} /> Node {project.id.slice(0, 4)}
          </div>
          <h3 className="text-lg font-bold text-white leading-tight break-words mb-2">
            {project.name}
          </h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2 break-words">
            {project.description || 'System context not provided.'}
          </p>
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[rgba(255,255,255,0.03)] text-[var(--muted)] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-10 w-48 z-20 bg-[#0C0C0C]/95 backdrop-blur-xl border border-[var(--glass-border-bright)] rounded-xl p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Pencil size={14} /> Edit Context
                </button>
                <button
                  onClick={() => { handleDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} /> Decommission
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.slice(0, 5).map((tech) => (
            <span key={tech} className="pill pill-default !text-[9px] !px-2 !py-0.5 !font-bold break-all">
              {tech}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className="pill pill-default !text-[9px] !px-2 !py-0.5">+{project.stack.length - 5}</span>
          )}
        </div>

        {project.achievement && (
          <div className="bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.1)] rounded-xl p-3 mb-5">
            <div className="flex items-start gap-2.5">
              <div className="flex-shrink-0 w-5 h-5 rounded-md bg-[rgba(0,255,136,0.1)] flex items-center justify-center text-[var(--green)]">
                <Globe size={12} />
              </div>
              <p className="text-[11px] text-[var(--green)] font-bold leading-snug break-words flex-1 min-w-0">
                {project.achievement}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-auto pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--muted-dark)] uppercase tracking-wider">
          <Calendar size={12} />
          {timeAgo(project.updated_at)}
        </div>
        <span className={`${status.pillClass} !text-[9px] !font-black !px-2.5 !py-1 tracking-tighter`}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
