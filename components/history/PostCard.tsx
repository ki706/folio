'use client';
import { useState } from 'react';
import { Post, deletePost, savePost } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import CopyButton from '@/components/ui/CopyButton';
import { ChevronDown, ChevronUp, Trash2, Calendar } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDeleted: () => void;
  onSaved: () => void;
}

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TONE_LABELS: Record<string, string> = {
  builder: 'BUILDER',
  hustler: 'HUSTLER',
  hot_take: 'HOT TAKE',
};

export default function PostCard({ post, onDeleted, onSaved }: PostCardProps) {
  const { success, error: toastError } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'linkedin' | 'x'>('linkedin');

  const handleDelete = async () => {
    if (confirm('Permanently delete this entry?')) {
      try {
        await deletePost(post.id);
        success('Archive entry removed.');
        onDeleted();
      } catch (err) {
        toastError('Failed to remove entry. Link severed.');
      }
    }
  };

  const handleSave = async () => {
    try {
      await savePost({ id: post.id, is_saved: true });
      success('Post successfully committed to archive.');
      onSaved();
    } catch (err) {
      toastError('Synthesis commit failed.');
    }
  };

  return (
    <div 
      className={`glass-card stagger-item post-card-container ${expanded ? 'post-card-expanded' : 'post-card-collapsed'}`} 
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="post-meta-row">
            <div className="post-date-pill">
              <Calendar size={12} /> {formatDate(post.created_at)}
            </div>
            {post.project_name && (
              <span className="pill pill-default">{post.project_name.toUpperCase()}</span>
            )}
            <span className="pill pill-gray">{TONE_LABELS[post.tone]}</span>
            {!post.is_saved && (
              <span className="pill pill-amber">DRAFT</span>
            )}
          </div>
          
          <p 
            className="post-content-preview"
            style={{ WebkitLineClamp: expanded ? undefined : 2 }}
          >
            {post.content_linkedin}
          </p>
        </div>
        
        <div className="post-expand-trigger">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 24, animation: 'fadeIn 0.2s ease' }}>
          <div className="output-tabs" style={{ marginBottom: 20 }}>
            <button className={`output-tab${activeTab === 'linkedin' ? ' active' : ''}`} onClick={() => setActiveTab('linkedin')} style={{ paddingBottom: 12 }}>
              💼 LINKEDIN
            </button>
            <button className={`output-tab${activeTab === 'x' ? ' active' : ''}`} onClick={() => setActiveTab('x')} style={{ paddingBottom: 12 }}>
              𝕏 THREAD
            </button>
          </div>

          {activeTab === 'linkedin' && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                {post.content_linkedin}
              </p>
              <CopyButton text={post.content_linkedin} />
            </div>
          )}

          {activeTab === 'x' && (
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {post.content_x.map((tweet, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Geist Mono', fontWeight: 600 }}>
                      TWEET {i + 1}/{post.content_x.length}
                    </span>
                    <CopyButton text={tweet} size="sm" />
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--white)', lineHeight: 1.6 }}>{tweet}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            {!post.is_saved && (
              <button className="btn-premium" style={{ flex: 1, height: 44 }} onClick={handleSave}>
                Save to Archive
              </button>
            )}
            <button
              className="btn-ghost-premium"
              style={{ height: 44, width: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}
              onClick={handleDelete}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
