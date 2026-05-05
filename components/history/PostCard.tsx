'use client';
import { useState } from 'react';
import { Post, deletePost, savePost } from '@/lib/store';
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
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'linkedin' | 'x'>('linkedin');

  const handleDelete = async () => {
    if (confirm('Permanently delete this entry?')) {
      await deletePost(post.id);
      onDeleted();
    }
  };

  const handleSave = async () => {
    await savePost({ id: post.id, is_saved: true });
    onSaved();
  };

  return (
    <div className="glass-card stagger-item" style={{ cursor: 'pointer', padding: expanded ? '24px' : '20px' }} onClick={() => setExpanded((v) => !v)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted-dark)', fontWeight: 600 }}>
              <Calendar size={12} /> {formatDate(post.created_at)}
            </div>
            {post.project_name && (
              <span className="pill pill-default" style={{ fontSize: 10, fontWeight: 700 }}>{post.project_name.toUpperCase()}</span>
            )}
            <span className="pill pill-gray" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>{TONE_LABELS[post.tone]}</span>
            {!post.is_saved && (
              <span className="pill pill-amber" style={{ fontSize: 10, fontWeight: 700 }}>DRAFT</span>
            )}
          </div>
          
          <p style={{ 
            fontSize: 15, color: 'var(--white)', lineHeight: 1.6, 
            overflow: 'hidden', display: '-webkit-box', 
            WebkitLineClamp: expanded ? undefined : 2, 
            WebkitBoxOrient: 'vertical' as const 
          }}>
            {post.content_linkedin}
          </p>
        </div>
        
        <div style={{ 
          marginLeft: 16, width: 32, height: 32, 
          borderRadius: 8, background: 'rgba(255,255,255,0.03)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'var(--muted)', flexShrink: 0 
        }}>
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
