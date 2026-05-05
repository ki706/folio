'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Flame, CheckCircle, Clock } from 'lucide-react';

export default function TrendsPage() {
  const [queue, setQueue] = useState([
    { id: 1, topic: 'Next.js 15 Caching', status: 'holding', post: 'Most developers don\'t understand the new caching model in Next.js 15. We just refactored our entire data layer to use the new semantics. Here\'s what changed...' },
    { id: 2, topic: 'Supabase vs Firebase', status: 'holding', post: 'We ripped out Firebase for Supabase. The migration took 4 hours and dropped our latency by 40ms. Here is the exact SQL we used...' }
  ]);

  const approvePost = (id: number) => {
    setQueue(q => q.map(post => post.id === id ? { ...post, status: 'deployed' } : post));
  };

  return (
    <div className="max-w-[1100px] mx-auto pb-[100px] animate-fade-in">
      <div className="flex items-end justify-between mb-16">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.15em] mb-4 text-[#00CCFF]">
            <Radio size={14} className="animate-pulse" /> TREND ARBITRAGE
          </div>
          <h1 className="text-[clamp(44px,6vw,64px)] font-[900] tracking-[-0.06em] leading-none text-white">
            Algorithm <span className="text-gradient">Inject.</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Trends Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h2 className="section-title-premium mb-2">Live Tech Twitter Trends</h2>
          
          {[
            { tag: '#Nextjs', volume: '14.2k tweets', hot: true },
            { tag: 'React Server Components', volume: '8.4k tweets', hot: true },
            { tag: 'Vercel Pricing', volume: '5.1k tweets', hot: false },
            { type: 'Hacker News', tag: 'Show HN: Supabase', volume: 'Rank #2', hot: true }
          ].map((trend, i) => (
            <div key={i} className="glass-card p-5 flex items-start justify-between border-[rgba(255,255,255,0.02)]">
              <div>
                <div className="text-[10px] font-bold text-[#666] tracking-widest uppercase mb-1">{trend.type || 'Twitter'}</div>
                <div className="text-white font-bold">{trend.tag}</div>
                <div className="text-xs text-[#888] mt-1">{trend.volume}</div>
              </div>
              {trend.hot && <Flame size={16} className="text-[#FF4444] animate-pulse" />}
            </div>
          ))}
        </div>

        {/* Holding Queue */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="section-title-premium mb-2">Holding Queue</h2>
          
          {queue.map((post) => (
            <motion.div 
              layout 
              key={post.id} 
              className={`glass-card p-6 border transition-colors duration-300 ${post.status === 'deployed' ? 'border-[#00FF88] bg-[rgba(0,255,136,0.02)]' : 'border-[rgba(0,204,255,0.2)] bg-[rgba(0,204,255,0.02)]'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${post.status === 'deployed' ? 'bg-[rgba(0,255,136,0.1)] text-[#00FF88]' : 'bg-[rgba(0,204,255,0.1)] text-[#00CCFF]'}`}>
                    Target: {post.topic}
                  </div>
                  {post.status === 'holding' && (
                     <span className="text-[11px] text-[#888] flex items-center gap-1"><Clock size={12}/> Waiting for peak...</span>
                  )}
                </div>
                {post.status === 'deployed' ? (
                  <div className="text-[#00FF88] flex items-center gap-1 text-sm font-bold"><CheckCircle size={16}/> Deployed</div>
                ) : (
                  <button onClick={() => approvePost(post.id)} className="btn-premium h-8 px-4 text-xs bg-[#00CCFF] text-black hover:bg-white shadow-[0_0_15px_rgba(0,204,255,0.4)]">
                    Approve & Deploy Now
                  </button>
                )}
              </div>
              <p className="text-[#ccc] text-sm leading-relaxed border-l-2 border-[rgba(255,255,255,0.1)] pl-4 italic">
                "{post.post}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
