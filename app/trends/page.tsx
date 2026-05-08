'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Flame, CheckCircle, Clock, Loader2, Zap, Terminal } from 'lucide-react';

export default function TrendsPage() {
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [trends, setTrends] = useState<any[]>([]);
  const [queue, setQueue] = useState([
    { id: 1, topic: 'Next.js 15 Caching', status: 'holding', post: 'Most developers don\'t understand the new caching model in Next.js 15. We just refactored our entire data layer to use the new semantics. Here\'s what changed...' },
    { id: 2, topic: 'Supabase vs Firebase', status: 'holding', post: 'We ripped out Firebase for Supabase. The migration took 4 hours and dropped our latency by 40ms. Here is the exact SQL we used...' }
  ]);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoadingTrends(true);
      await new Promise(r => setTimeout(r, 1800));
      setTrends([
        { type: 'Twitter', tag: '#Nextjs', volume: '14.2k tweets', hot: true },
        { type: 'Twitter', tag: 'React Server Components', volume: '8.4k tweets', hot: true },
        { type: 'Twitter', tag: 'Vercel Pricing', volume: '5.1k tweets', hot: false },
        { type: 'Hacker News', tag: 'Show HN: Supabase', volume: 'Rank #2', hot: true }
      ]);
      setLoadingTrends(false);
    };
    fetchTrends();
  }, []);

  const approvePost = (id: number) => {
    setQueue(q => q.map(post => post.id === id ? { ...post, status: 'deployed' } : post));
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 'var(--max-width-page)', margin: '0 auto' }}>
      <style>{`
        .trends-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--card-gap);
          padding-bottom: 80px;
        }
        @media (min-width: 1024px) {
          .trends-main-grid {
            grid-template-columns: 1fr 2fr;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="section-title-premium" style={{ color: 'var(--green)', marginBottom: 12 }}>
            <Radio size={13} /> Global Network Scan
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.1, color: 'var(--white)' }}>
            Trend <span className="text-gradient">Arbitrage.</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: 100, padding: '8px 16px', flexShrink: 0 }}>
          <Terminal size={14} style={{ color: 'var(--green)' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--green)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Listening...</span>
        </div>
      </div>

      <div className="trends-main-grid">

        {/* Live Signals Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 className="section-title-premium">
            <Zap size={16} style={{ color: 'var(--green)' }} /> Live Signals
          </h2>

          <AnimatePresence mode="wait">
            {loadingTrends ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card"
                style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, minHeight: 360 }}
              >
                <Loader2 style={{ color: 'var(--green)' }} size={32} className="animate-spin" />
                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--green)' }}>Calibrating Node...</span>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {trends.map((trend, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="glass-card"
                    style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 800, color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>{trend.type || 'Twitter'}</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--white)', letterSpacing: '-0.02em' }}>{trend.tag}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{trend.volume}</div>
                    </div>
                    {trend.hot && <Flame size={18} style={{ color: 'var(--green)' }} />}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Holding Queue Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 className="section-title-premium">
            <Clock size={16} style={{ color: 'var(--green)' }} /> Holding Queue
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {queue.map((post) => (
              <motion.div
                layout
                key={post.id}
                className="glass-card"
                style={{
                  padding: 32,
                  border: post.status === 'deployed' ? '1px solid rgba(0,255,136,0.2)' : '1px solid var(--border)',
                  background: post.status === 'deployed' ? 'rgba(0,255,136,0.03)' : undefined,
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      border: post.status === 'deployed' ? '1px solid rgba(0,255,136,0.2)' : '1px solid var(--border)',
                      background: post.status === 'deployed' ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.03)',
                      color: post.status === 'deployed' ? 'var(--green)' : 'var(--white)',
                    }}>
                      Target: {post.topic}
                    </div>
                    {post.status === 'holding' && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={10} style={{ color: 'var(--green)' }} /> Buffering...
                      </span>
                    )}
                  </div>
                  {post.status === 'deployed' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--green)', background: 'rgba(0,255,136,0.08)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,255,136,0.15)' }}>
                      <CheckCircle size={14} /> Live
                    </motion.div>
                  ) : (
                    <button onClick={() => approvePost(post.id)} className="btn-premium" style={{ height: 40, padding: '0 24px', fontSize: 11 }}>
                      Manual Deploy
                    </button>
                  )}
                </div>

                <div style={{ paddingLeft: 20, borderLeft: `2px solid ${post.status === 'deployed' ? 'var(--green)' : 'var(--border)'}` }}>
                  <p style={{ fontSize: 16, color: '#ccc', lineHeight: 1.7, fontWeight: 500 }}>
                    &quot;{post.post}&quot;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
