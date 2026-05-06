'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Flame, CheckCircle, Clock, Loader2 } from 'lucide-react';

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
      await new Promise(r => setTimeout(r, 1500));
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
    <div className="max-w-[1100px] mx-auto animate-fade-in">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.15em] mb-3 text-[#00CCFF]">
            <Radio size={13} className="animate-pulse" /> TREND ARBITRAGE
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1, color: 'var(--white)' }}>
            Algorithm <span className="text-gradient">Inject.</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Live Trends Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="section-title-premium mb-2">Live Tech Twitter Trends</h2>
          
          {loadingTrends ? (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-[#888] gap-3">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Scanning Networks...</span>
            </div>
          ) : (
            trends.map((trend, i) => (
              <div key={i} className="glass-card p-5 flex items-start justify-between border-[rgba(255,255,255,0.05)] relative overflow-hidden group hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-default shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[rgba(255,255,255,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div>
                  <div className="text-[10px] font-bold text-[#666] tracking-widest uppercase mb-1">{trend.type || 'Twitter'}</div>
                  <div className="text-white font-bold group-hover:text-[#00CCFF] transition-colors">{trend.tag}</div>
                  <div className="text-xs text-[#888] mt-1 font-mono">{trend.volume}</div>
                </div>
                {trend.hot && <Flame size={16} className="text-[#FF4444] animate-pulse drop-shadow-[0_0_8px_rgba(255,68,68,0.5)]" />}
              </div>
            ))
          )}
        </div>

        {/* Holding Queue */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="section-title-premium mb-2">Holding Queue</h2>
          
          {queue.map((post) => (
            <motion.div 
              layout 
              key={post.id} 
              className={`glass-card p-6 border transition-all duration-300 relative overflow-hidden group ${post.status === 'deployed' ? 'border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.02)] shadow-[inset_0_1px_1px_rgba(0,255,136,0.1)]' : 'border-[rgba(0,204,255,0.15)] bg-[rgba(0,204,255,0.02)] hover:bg-[rgba(0,204,255,0.04)] hover:-translate-y-1 shadow-[inset_0_1px_1px_rgba(0,204,255,0.1)]'}`}
            >
              {post.status !== 'deployed' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,204,255,0.05)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${post.status === 'deployed' ? 'bg-[rgba(0,255,136,0.1)] text-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'bg-[rgba(0,204,255,0.1)] text-[#00CCFF] shadow-[0_0_10px_rgba(0,204,255,0.2)]'}`}>
                    Target: {post.topic}
                  </div>
                  {post.status === 'holding' && (
                     <span className="text-[11px] text-[#888] flex items-center gap-1"><Clock size={12} className="animate-pulse text-[#00CCFF]"/> Waiting for peak...</span>
                  )}
                </div>
                {post.status === 'deployed' ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#00FF88] flex items-center gap-1 text-sm font-bold bg-[rgba(0,255,136,0.1)] px-3 py-1.5 rounded-lg border border-[rgba(0,255,136,0.2)] shadow-[0_0_15px_rgba(0,255,136,0.2)]"><CheckCircle size={16}/> Deployed</motion.div>
                ) : (
                  <button onClick={() => approvePost(post.id)} className="btn-premium h-9 px-5 text-xs bg-gradient-to-r from-[#00CCFF] to-[#00FF88] text-black hover:opacity-90 shadow-[0_4px_20px_rgba(0,204,255,0.3)] border-none">
                    Approve & Deploy Now
                  </button>
                )}
              </div>
              <p className="text-[#ccc] text-sm leading-relaxed border-l-2 pl-4 italic relative z-10" style={{ borderColor: post.status === 'deployed' ? 'rgba(0,255,136,0.3)' : 'rgba(0,204,255,0.3)' }}>
                &quot;{post.post}&quot;
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
