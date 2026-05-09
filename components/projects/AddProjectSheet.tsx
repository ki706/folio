'use client';
import { useState } from 'react';
import BottomSheet from '@/components/ui/BottomSheet';
import TagInput from '@/components/ui/TagInput';
import { Project, saveProject } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';

interface AddProjectSheetProps {
  project?: Project | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AddProjectSheet({ project, onClose, onSaved }: AddProjectSheetProps) {
  const { success, error: toastError } = useToast();
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [stack, setStack] = useState<string[]>(project?.stack || []);
  const [learned, setLearned] = useState(project?.learned || '');
  const [achievement, setAchievement] = useState(project?.achievement || '');
  const [status, setStatus] = useState<Project['status']>(project?.status || 'active');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await saveProject({
        id: project?.id,
        name,
        description,
        stack,
        learned,
        achievement,
        status,
      });
      success(project ? 'Project context updated.' : 'New project initialized.');
      onSaved();
      onClose();
    } catch (err) {
      toastError('Neural context sync failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={true} onClose={onClose} title={project ? 'Edit Neural Context' : 'Initialize Project'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div>
          <label className="section-title-premium" style={{ marginBottom: 8, display: 'block' }}>Project Name</label>
          <input 
            className="input-premium" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Emitto Broadcast Engine" 
          />
        </div>

        <div>
          <label className="section-title-premium" style={{ marginBottom: 8, display: 'block' }}>One-Line Narrative</label>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>A concise summary used for content synthesis.</p>
          <input 
            className="input-premium" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="What is the core ROI of this build?" 
          />
        </div>

        <div>
          <label className="section-title-premium" style={{ marginBottom: 8, display: 'block' }}>Architecture Stack</label>
          <TagInput tags={stack} onChange={setStack} placeholder="Next.js, Supabase, LLMs..." />
        </div>

        <div>
          <label className="section-title-premium" style={{ marginBottom: 8, display: 'block' }}>Key Insight</label>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>What was the hardest technical challenge you solved?</p>
          <textarea 
            className="input-premium" 
            rows={3} 
            value={learned} 
            onChange={(e) => setLearned(e.target.value)} 
            placeholder="Describe the engineering breakthrough..." 
            style={{ resize: 'none' }}
          />
        </div>

        <div>
          <label className="section-title-premium" style={{ marginBottom: 8, display: 'block' }}>Primary Achievement</label>
          <input 
            className="input-premium" 
            value={achievement} 
            onChange={(e) => setAchievement(e.target.value)} 
            placeholder="e.g. Optimized edge latency by 40%" 
          />
        </div>

        <div>
          <label className="section-title-premium" style={{ marginBottom: 16, display: 'block' }}>Deployment Status</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {(['active', 'completed', 'paused'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`btn-ghost-premium${status === s ? ' active' : ''}`}
                style={{ 
                  textTransform: 'uppercase', 
                  fontSize: 10, 
                  fontWeight: 800, 
                  letterSpacing: '0.1em',
                  height: 44,
                  borderColor: status === s ? 'var(--green)' : 'var(--border)',
                  background: status === s ? 'var(--green-dim)' : 'rgba(255,255,255,0.02)',
                  color: status === s ? 'var(--green)' : 'var(--muted)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <button 
            className="btn-premium hover-glow" 
            onClick={handleSave} 
            disabled={saving} 
            style={{ width: '100%', height: 60, fontSize: 15, borderRadius: 16 }}
          >
            {saving ? 'Synchronizing...' : project ? 'Commit Changes' : 'Initialize Project'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
