'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Flame, CheckCircle, Clock, Loader2, Zap, Terminal } from 'lucide-react';
import { getPosts, Post } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function TrendsPage() {
  const router = useRouter();
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingTrends(true);
      const allPosts = await getPosts();
      setPosts(allPosts.filter(p => !p.is_saved)); // Only drafts
      setLoadingTrends(false);
    };
    fetchData();
  }, []);

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
            <Zap size={16} style={{ color: 'var(--green)' }} /> Discovery Node
          </h2>
          <div className="glass-card" style={{ padding: '32px 24px', textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-pulse" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
               <Radio size={20} style={{ color: 'var(--green)' }} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--white)', fontWeight: 600, marginBottom: 8 }}>Scanning Tech Clusters</p>
            <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>
              Neural engine is monitoring your active projects for new commit signals and cross-referencing with global technical trends.
            </p>
          </div>
        </div>

        {/* Holding Queue Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 className="section-title-premium">
            <Clock size={16} style={{ color: 'var(--green)' }} /> Synthesis Queue
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {loadingTrends ? (
               [1, 2].map(i => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 20 }} />)
            ) : posts.length === 0 ? (
               <div className="glass-card" style={{ padding: '64px 32px', textAlign: 'center', borderStyle: 'dashed' }}>
                  <p style={{ fontSize: 14, color: '#444', fontWeight: 600 }}>Queue Empty</p>
                  <p style={{ fontSize: 12, color: '#333', marginTop: 8 }}>Push a commit to trigger autonomous post synthesis.</p>
               </div>
            ) : posts.map((post) => (
              <motion.div
                layout
                key={post.id}
                className="glass-card"
                style={{ padding: 32 }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16 }}>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--white)',
                  }}>
                    Signal ID: {post.id.slice(0, 8)}
                  </div>
                  <button 
                    onClick={() => router.push('/generate')} 
                    className="btn-premium" 
                    style={{ height: 40, padding: '0 24px', fontSize: 11 }}
                  >
                    Deploy Signal
                  </button>
                </div>

                <div style={{ paddingLeft: 20, borderLeft: '2px solid var(--border)' }}>
                  <p style={{ fontSize: 16, color: '#ccc', lineHeight: 1.7, fontWeight: 500 }}>
                    &quot;{post.content_linkedin.slice(0, 150)}...&quot;
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
