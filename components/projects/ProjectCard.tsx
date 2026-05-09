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
      className="glass-card hover-glow"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        padding: 'clamp(24px, 4vw, 32px)', 
        position: 'relative', 
        overflow: 'hidden', 
        minHeight: 280,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
        '--glow-color': status.color + '20'
      } as any}
    >
      {/* Subtle top indicator */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: status.color, opacity: 0.3 }} />

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 900, color: status.color, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'JetBrains Mono, monospace' }}>
            <Database size={12} /> ARCH-NODE::{project.id.slice(0, 8).toUpperCase()}
          </div>
          <h3 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 900, color: 'var(--white)', lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 12 }}>
            {project.name}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 500 }}>
            {project.description || 'Architectural blueprints not initialized.'}
          </p>
        </div>

        {/* Context menu */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="btn-ghost-premium"
            style={{ width: 36, height: 36, borderRadius: 10, padding: 0 }}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenuOpen(false)} />
              <div style={{ position: 'absolute', right: 0, top: 40, width: 200, zIndex: 20, background: 'rgba(12,12,12,0.98)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 8, boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="btn-ghost-premium"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', borderRadius: 12, border: 'none', background: 'transparent' }}
                >
                  <Pencil size={14} /> <span style={{ fontSize: 13, fontWeight: 700 }}>Edit Blueprints</span>
                </button>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.03)', margin: '4px 0' }} />
                <button
                  onClick={() => { handleDelete(); setMenuOpen(false); }}
                  className="btn-ghost-premium"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '12px 16px', borderRadius: 12, border: 'none', background: 'transparent', color: '#FF4444' }}
                >
                  <Trash2 size={14} /> <span style={{ fontSize: 13, fontWeight: 700 }}>Decommission</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {project.stack.slice(0, 5).map(tech => (
          <span key={tech} style={{ fontSize: 10, fontWeight: 800, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tech}
          </span>
        ))}
      </div>

      {/* Achievement Seal */}
      {project.achievement && (
        <div style={{ 
          background: 'linear-gradient(90deg, rgba(0,255,136,0.06), transparent)', 
          borderLeft: '2px solid var(--green)', 
          padding: '12px 16px', 
          marginBottom: 24,
          borderRadius: '0 12px 12px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Globe size={14} style={{ color: 'var(--green)', flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: 'var(--green)', fontWeight: 800, lineHeight: 1.4, letterSpacing: '0.01em' }}>
              {project.achievement.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <Calendar size={12} /> {timeAgo(project.updated_at)}
        </div>
        <div style={{ 
          fontSize: 10, 
          fontWeight: 900, 
          padding: '4px 12px', 
          borderRadius: 100, 
          border: `1px solid ${status.border}`, 
          background: status.bg, 
          color: status.color, 
          letterSpacing: '0.12em' 
        }}>
          {status.label}
        </div>
      </div>
    </div>
  );
}
