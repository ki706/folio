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
    // Simulate live data fetch for trending topics
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
    <div className="max-w-[var(--max-width-page)] mx-auto animate-fade-in">
      <header className="page-header">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[var(--green)] uppercase">
            <Radio size={14} className="animate-pulse" /> Global Network Scan
          </div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[900] tracking-[-0.05em] leading-tight text-white">
            Trend <span className="text-gradient">Arbitrage.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-full px-4 py-2 mb-2">
           <Terminal size={14} className="text-[var(--green)]" />
           <span className="text-[10px] font-bold text-[var(--green)] tracking-widest uppercase">Listening...</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--card-gap)] pb-32">
        
        {/* Live Tech Twitter Trends (Cyber-Deck Radar) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <h2 className="section-title-premium">
             <Zap size={16} className="text-[var(--green)]" /> Live Signals
          </h2>
          
          <div className="flex flex-col gap-4 relative">
            <AnimatePresence mode="wait">
              {loadingTrends ? (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass-card p-12 flex flex-col items-center justify-center text-[#888] gap-4 min-h-[400px]"
                >
                  <Loader2 className="animate-spin text-[var(--green)]" size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse text-[var(--green)]">Calibrating Node...</span>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                  {trends.map((trend, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="group glass-card p-6 flex items-center justify-between hover:border-[var(--green-border)] transition-all cursor-pointer"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--green)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="text-[9px] font-bold text-[#666] tracking-[0.2em] uppercase mb-1">{trend.type || 'Twitter'}</div>
                        <div className="text-white font-black tracking-tight group-hover:text-[var(--green)] transition-colors">{trend.tag}</div>
                        <div className="text-[11px] text-[#888] mt-1 font-mono">{trend.volume}</div>
                      </div>
                      {trend.hot && <Flame size={18} className="text-[var(--green)] animate-pulse drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Holding Queue (Data Streams) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="section-title-premium">
             <Clock size={16} className="text-[var(--green)]" /> Holding Queue
          </h2>
          
          <div className="flex flex-col gap-6">
            {queue.map((post) => (
              <motion.div 
                layout 
                key={post.id} 
                className={`glass-card p-8 border transition-all duration-500 relative overflow-hidden group ${post.status === 'deployed' ? 'bg-[rgba(0,255,136,0.03)] border-[rgba(0,255,136,0.2)]' : ''}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-[0.15em] border ${post.status === 'deployed' ? 'pill-green' : 'pill-default'}`}>
                      Target: {post.topic}
                    </div>
                    {post.status === 'holding' && (
                       <span className="text-[10px] font-bold text-[#666] uppercase tracking-widest flex items-center gap-2">
                         <Clock size={10} className="animate-pulse text-[var(--green)]"/> Buffering...
                       </span>
                    )}
                  </div>
                  {post.status === 'deployed' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="pill-green flex items-center gap-2">
                      <CheckCircle size={14}/> Live
                    </motion.div>
                  ) : (
                    <button onClick={() => approvePost(post.id)} className="btn-premium sm:h-10 sm:px-6 text-[11px]">
                      Manual Deploy
                    </button>
                  )}
                </div>
                
                <div className="relative z-10 pl-6 border-l-2 border-[var(--border)] group-hover:border-[var(--green)] transition-colors">
                  <p className="text-[#ccc] text-lg leading-relaxed font-medium">
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
