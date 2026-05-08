'use client';
import { useEffect, useState, useCallback } from 'react';
import { getPosts, Post } from '@/lib/store';
import PostCard from '@/components/history/PostCard';
import { Search, Clock, Archive } from 'lucide-react';

type Filter = 'all' | 'linkedin' | 'x' | 'week' | 'month';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'ALL' },
  { id: 'linkedin',label: 'LINKEDIN' },
  { id: 'x',      label: 'X THREAD' },
  { id: 'week',   label: 'THIS WEEK' },
  { id: 'month',  label: 'THIS MONTH' },
];

function filterPosts(posts: Post[], filter: Filter, search: string): Post[] {
  let result = [...posts];

  if (filter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    result = result.filter((p) => new Date(p.created_at) >= weekAgo);
  } else if (filter === 'month') {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    result = result.filter((p) => new Date(p.created_at) >= monthStart);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.content_linkedin.toLowerCase().includes(q) ||
        p.project_name?.toLowerCase().includes(q) ||
        p.content_x.some((t) => t.toLowerCase().includes(q))
    );
  }

  return result;
}

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const ps = await getPosts();
    setPosts(ps);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const filtered = filterPosts(posts, filter, search);

  return (
    <div className="animate-fade-in mx-auto" style={{ maxWidth: 'var(--max-width-page)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em' }}>Archive</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4 }}>Access your library of synthesized knowledge.</p>
        </div>
        <button
          onClick={() => setShowSearch((v) => !v)}
          className="btn-ghost-premium"
          style={{ width: 48, height: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Search size={20} color={showSearch ? 'var(--green)' : 'currentColor'} />
        </button>
      </div>

      {showSearch && (
        <div style={{ marginBottom: 24, animation: 'fadeIn 0.2s ease' }}>
          <input
            className="input-premium"
            placeholder="Search within your knowledge base..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={{ fontSize: 16 }}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 24, scrollbarWidth: 'none' }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`btn-ghost-premium${filter === f.id ? ' active' : ''}`}
            style={{ 
              fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', 
              padding: '0 20px', height: 40,
              background: filter === f.id ? 'var(--green-dim)' : 'rgba(255,255,255,0.03)',
              color: filter === f.id ? 'var(--green)' : 'var(--muted)',
              borderColor: filter === f.id ? 'var(--green)' : 'var(--border)'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,255,136,0.02), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 500, background: 'rgba(0,255,136,0.03)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 32, flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(0,255,136,0.2)', borderRadius: '1.5rem', transform: 'rotate(-12deg)', background: 'rgba(0,255,136,0.02)' }} />
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', transform: 'rotate(6deg)', background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <Archive size={40} style={{ color: '#00FF88' }} />
            </div>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.03em', marginBottom: 12, position: 'relative', zIndex: 1 }}>Archive empty</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 420, lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            {search || filter !== 'all' ? 'No entries match your current filters.' : 'Your generated intelligence will appear here once saved.'}
          </p>
        </div>

      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDeleted={refresh}
              onSaved={refresh}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
