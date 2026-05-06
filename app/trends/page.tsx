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
    <div className="max-w-[1200px] mx-auto animate-fade-in px-4 sm:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[#FF4444] uppercase">
            <Radio size={14} className="animate-pulse" /> Global Network Scan
          </div>
          <h1 className="text-[clamp(36px,5vw,56px)] font-[900] tracking-[-0.05em] leading-none text-white">
            Trend <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4444] to-[#F59E0B]">Arbitrage.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-[rgba(255,68,68,0.05)] border border-[rgba(255,68,68,0.1)] rounded-full px-4 py-2">
           <Terminal size={14} className="text-[#FF4444]" />
           <span className="text-xs font-bold text-[#FF4444] tracking-widest uppercase">Listening...</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Tech Twitter Trends (Cyber-Deck Radar) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <Zap size={16} className="text-[#F59E0B]" /> Live Signals
            </h2>
          </div>
          
          <div className="flex flex-col gap-3 relative">
            {/* Cyber Radar Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,68,68,0.05)_0%,_transparent_70%)] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {loadingTrends ? (
                <motion.div 
                  key="loader"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.05)] p-12 flex flex-col items-center justify-center text-[#888] gap-4 rounded-xl min-h-[400px]"
                >
                  <Loader2 className="animate-spin text-[#FF4444]" size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse text-[#FF4444]">Calibrating Node...</span>
                </motion.div>
              ) : (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                  {trends.map((trend, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                      className="group bg-[#111] border border-[rgba(255,255,255,0.05)] p-5 flex items-center justify-between rounded-xl relative overflow-hidden hover:bg-[#1A1A1A] hover:border-[rgba(245,158,11,0.3)] transition-all cursor-pointer"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F59E0B] to-[#FF4444] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="text-[9px] font-bold text-[#666] tracking-[0.2em] uppercase mb-1">{trend.type || 'Twitter'}</div>
                        <div className="text-white font-black tracking-tight group-hover:text-[#F59E0B] transition-colors">{trend.tag}</div>
                        <div className="text-[11px] text-[#888] mt-1 font-mono">{trend.volume}</div>
                      </div>
                      {trend.hot && <Flame size={18} className="text-[#FF4444] animate-pulse drop-shadow-[0_0_8px_rgba(255,68,68,0.5)]" />}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Holding Queue (Data Streams) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
               <Clock size={16} className="text-[#00CCFF]" /> Holding Queue
            </h2>
          </div>
          
          <div className="flex flex-col gap-4">
            {queue.map((post) => (
              <motion.div 
                layout 
                key={post.id} 
                className={`p-6 rounded-xl border transition-all duration-500 relative overflow-hidden group ${post.status === 'deployed' ? 'bg-[rgba(0,255,136,0.03)] border-[rgba(0,255,136,0.2)]' : 'bg-[#0A0A0A] border-[rgba(0,204,255,0.15)] hover:bg-[#111] hover:border-[rgba(0,204,255,0.3)]'}`}
              >
                {post.status !== 'deployed' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,204,255,0.05)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-[0.15em] border ${post.status === 'deployed' ? 'bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.2)] text-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.1)]' : 'bg-[rgba(0,204,255,0.1)] border-[rgba(0,204,255,0.2)] text-[#00CCFF] shadow-[0_0_15px_rgba(0,204,255,0.1)]'}`}>
                      Target: {post.topic}
                    </div>
                    {post.status === 'holding' && (
                       <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest flex items-center gap-1.5 bg-[#111] px-2 py-1 rounded border border-[#222]">
                         <Clock size={10} className="animate-pulse text-[#00CCFF]"/> Waiting for peak traffic...
                       </span>
                    )}
                  </div>
                  {post.status === 'deployed' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#00FF88] flex items-center gap-1.5 text-xs font-black uppercase tracking-widest bg-[rgba(0,255,136,0.1)] px-4 py-2 rounded border border-[rgba(0,255,136,0.2)] shadow-[0_0_15px_rgba(0,255,136,0.1)]"><CheckCircle size={14}/> Live</motion.div>
                  ) : (
                    <button onClick={() => approvePost(post.id)} className="w-full sm:w-auto h-10 px-6 text-xs font-black uppercase tracking-widest bg-[rgba(0,204,255,0.1)] text-[#00CCFF] border border-[rgba(0,204,255,0.3)] rounded hover:bg-[#00CCFF] hover:text-black transition-colors shadow-[0_0_15px_rgba(0,204,255,0.1)]">
                      Override & Deploy
                    </button>
                  )}
                </div>
                
                <div className="relative z-10 pl-4 border-l-2" style={{ borderColor: post.status === 'deployed' ? '#00FF88' : '#00CCFF' }}>
                  <p className="text-[#ccc] text-sm leading-relaxed font-medium">
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
