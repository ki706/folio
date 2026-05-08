'use client';
import { motion } from 'framer-motion';
import { TrendingUp, GitCommit, MessageCircle, ArrowRight, GitMerge, Zap, Eye, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const nodes = [
    { id: 'commits', label: 'Commits Analyzed', value: '142', icon: GitCommit, color: 'var(--green)', trend: '+12% this week' },
    { id: 'posts', label: 'Posts Synthesized', value: '38', icon: TrendingUp, color: 'var(--green)', trend: '8 active drafts' },
    { id: 'impressions', label: 'Total Impressions', value: '124.5k', icon: Eye, color: 'var(--green)', trend: '+45.2% vs last month' },
    { id: 'stars', label: 'GitHub Stars', value: '+412', icon: GitMerge, color: 'var(--green)', trend: 'Trending in TypeScript' },
  ];

  return (
    <div className="max-w-[var(--max-width-page)] mx-auto animate-fade-in">
      <header className="page-header">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[var(--green)] uppercase">
            <Activity size={14} className="animate-pulse" /> Telemetry Active
          </div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-[900] tracking-[-0.05em] leading-tight text-white">
            Brand <span className="text-gradient">Telemetry.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-full px-4 py-2 mb-2">
           <div className="w-2 h-2 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88] animate-pulse" />
           <span className="text-[10px] font-bold text-[#888] tracking-widest uppercase">Live Sync</span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-[var(--card-gap)] pb-32">
        
        {/* Main Graph (Spans 2 rows, 3 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-3 md:row-span-2 glass-card relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,136,0.1)_0%,_transparent_70%)] opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none" />
          <div className="p-8 sm:p-10 relative z-10 flex flex-col h-full">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <h2 className="text-xl font-bold text-white mb-1">Audience Trajectory</h2>
                 <p className="text-xs text-[#888] font-medium uppercase tracking-wider">Impressions (Aggregated)</p>
               </div>
               <div className="text-right">
                 <div className="text-3xl font-[900] text-white font-mono tracking-tighter">124,500</div>
                 <div className="text-xs font-bold text-[#00FF88] mt-1">+45.2%</div>
               </div>
             </div>

             <div className="flex-1 relative w-full mt-4 min-h-[240px]">
                  <svg viewBox="0 0 800 300" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,255,136,0.2)]" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0, 255, 136, 0.2)" />
                      <stop offset="100%" stopColor="rgba(0, 255, 136, 0)" />
                    </linearGradient>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00FF88" />
                      <stop offset="50%" stopColor="var(--white)" />
                      <stop offset="100%" stopColor="#00FF88" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }}
                    d="M0,250 C100,240 150,180 250,190 C350,200 450,100 550,120 C650,140 700,50 800,20"
                    fill="none" stroke="url(#lineGlow)" strokeWidth="4" strokeLinecap="round"
                  />
                  <motion.path
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                    d="M0,250 C100,240 150,180 250,190 C350,200 450,100 550,120 C650,140 700,50 800,20 L800,300 L0,300 Z"
                    fill="url(#chartGlow)"
                  />
                </svg>
                
                <div className="absolute inset-0 pointer-events-none opacity-20">
                   {[25, 50, 75].map(pos => (
                     <div key={pos} className="absolute inset-x-0 border-t border-dashed border-[#888]" style={{ top: `${pos}%` }} />
                   ))}
                </div>
             </div>
          </div>
        </motion.div>

        {/* Small Hardware Metric Cards (Span 1 col, 1 row each) */}
        {nodes.map((node, i) => (
          <motion.div 
            key={node.id}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.1) }}
            className={`md:col-span-1 md:row-span-1 glass-card p-6 flex flex-col justify-between ${i === 3 ? 'md:col-start-4 md:row-start-2' : ''}`}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--green)] opacity-20" />
            
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] shadow-lg">
                <node.icon size={20} className="text-[var(--green)]" />
              </div>
              <Zap size={14} className="text-[#333]" />
            </div>

            <div>
              <div className="text-[10px] font-bold text-[#666] tracking-widest uppercase mb-1">{node.label}</div>
              <div className="text-3xl font-[900] text-white font-mono tracking-tighter">{node.value}</div>
              <div className="text-[10px] font-bold mt-2 text-[var(--green)]">{node.trend}</div>
            </div>
          </motion.div>
        ))}

        {/* Top Performing Hooks (Spans 3 cols, 1 row) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="md:col-span-3 md:row-span-1 glass-card p-6 flex flex-col"
        >
          <h3 className="section-title-premium mb-6">Top Performing Neural Hooks</h3>
          <div className="flex flex-col gap-3 flex-1">
             {['"Most teams over-engineer their auth..."', '"Stop using Redux for everything."', '"We migrated to Edge computing and dropped latency by 40ms..."'].map((hook, i) => (
                <div key={i} className="group p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] transition-all">
                  <span className="text-[#ccc] text-sm font-medium group-hover:text-white transition-colors">"{hook}</span>
                  <span className="mt-2 sm:mt-0 pill-green text-[10px] font-mono shrink-0">
                    +{((i * 7) % 20) + 5}.4k Impressions
                  </span>
                </div>
             ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
