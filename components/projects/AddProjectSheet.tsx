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
    <BottomSheet open={true} onClose={onClose} title={project ? 'Edit Project' : 'New Project'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>NAME</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Folio AI" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>ONE-LINE DESCRIPTION</label>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this project?" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>TECH STACK</label>
          <TagInput tags={stack} onChange={setStack} placeholder="Next.js, Tailwind..." />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>WHAT YOU LEARNED</label>
          <textarea className="input" rows={2} value={learned} onChange={(e) => setLearned(e.target.value)} placeholder="Hardest part of the build?" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>TOP ACHIEVEMENT</label>
          <input className="input" value={achievement} onChange={(e) => setAchievement(e.target.value)} placeholder="e.g. 100 users, 99 Lighthouse score" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>STATUS</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['active', 'completed', 'paused'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`tone-btn${status === s ? ' active' : ''}`}
                style={{ textTransform: 'capitalize', fontSize: 13 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 8 }}>
          {saving ? 'Saving...' : project ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </BottomSheet>
  );
}
