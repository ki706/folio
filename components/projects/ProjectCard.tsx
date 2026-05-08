'use client';
import { useState } from 'react';
import { Project, deleteProject } from '@/lib/store';
import { MoreVertical, Pencil, Trash2, Globe, Calendar, Database } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const STATUS_MAP: Record<string, { label: string; bg: string; color: string; border: string }> = {
  active:    { label: 'ACTIVE',    bg: 'rgba(0,255,136,0.08)',  color: '#00FF88', border: 'rgba(0,255,136,0.2)' },
  completed: { label: 'COMPLETE',  bg: 'rgba(0,204,255,0.08)',  color: '#00CCFF', border: 'rgba(0,204,255,0.2)' },
  paused:    { label: 'PAUSED',    bg: 'rgba(255,176,0,0.08)',  color: '#FFB000', border: 'rgba(255,176,0,0.2)' },
};

function timeAgo(date: string) {
  if (!date) return 'Unknown';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { success, error: toastError } = useToast();
  const status = STATUS_MAP[project.status] ?? STATUS_MAP.active;

  const handleDelete = async () => {
    if (confirm('Decommission this architectural node?')) {
      try {
        await deleteProject(project.id);
        success('Project purged from fleet.');
        onDelete();
      } catch {
        toastError('Decommissioning failed. Link active.');
      }
    }
  };

  return (
    <div
      className="glass-card"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '28px 28px 24px', position: 'relative', overflow: 'hidden', minHeight: 260 }}
    >
      {/* Top accent line on hover — always rendered but invisible */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${status.color}, transparent)`, opacity: 0.4 }} />

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, fontWeight: 800, color: status.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            <Database size={11} /> Node {project.id.slice(0, 4)}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--white)', lineHeight: 1.3, wordBreak: 'break-word', marginBottom: 8 }}>
            {project.name}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description || 'System context not provided.'}
          </p>
        </div>

        {/* Context menu */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--muted)', cursor: 'pointer' }}
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenuOpen(false)} />
              <div style={{ position: 'absolute', right: 0, top: 40, width: 180, zIndex: 20, background: 'rgba(12,12,12,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 6, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--muted)', background: 'transparent', cursor: 'pointer', border: 'none', textAlign: 'left' }}
                >
                  <Pencil size={14} /> Edit Context
                </button>
                <button
                  onClick={() => { handleDelete(); setMenuOpen(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#FF4444', background: 'transparent', cursor: 'pointer', border: 'none', textAlign: 'left' }}
                >
                  <Trash2 size={14} /> Decommission
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {project.stack.slice(0, 5).map(tech => (
          <span key={tech} style={{ fontSize: 9, fontWeight: 800, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {tech}
          </span>
        ))}
        {project.stack.length > 5 && (
          <span style={{ fontSize: 9, fontWeight: 800, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)', color: 'var(--muted)' }}>
            +{project.stack.length - 5}
          </span>
        )}
      </div>

      {/* Achievement Badge */}
      {project.achievement && (
        <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: '10px 14px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 6, background: 'rgba(0,255,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={12} style={{ color: 'var(--green)' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700, lineHeight: 1.5, flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
              {project.achievement}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Calendar size={11} /> {timeAgo(project.updated_at)}
        </div>
        <span style={{ fontSize: 9, fontWeight: 900, padding: '4px 10px', borderRadius: 6, border: `1px solid ${status.border}`, background: status.bg, color: status.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
