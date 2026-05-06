'use client';
import { motion } from 'framer-motion';
import { TrendingUp, GitCommit, MessageCircle, ArrowRight, GitMerge } from 'lucide-react';

export default function AnalyticsPage() {
  const nodes = [
    { id: 'commits', label: 'Commits Analyzed', value: '142', icon: GitCommit, color: '#00FF88' },
    { id: 'posts', label: 'Posts Synthesized', value: '38', icon: TrendingUp, color: '#00CCFF' },
    { id: 'impressions', label: 'Total Impressions', value: '124.5k', icon: MessageCircle, color: '#8B5CF6' },
    { id: 'stars', label: 'GitHub Stars', value: '+412', icon: GitMerge, color: '#F59E0B' },
  ];

  return (
    <div className="max-w-[1100px] mx-auto pb-[100px] animate-fade-in">
      <div className="flex items-end justify-between mb-16">
        <div>
          <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.15em] mb-4 text-[#8B5CF6]">
            <TrendingUp size={14} /> IMPACT GRAPH
          </div>
          <h1 className="text-[clamp(44px,6vw,64px)] font-[900] tracking-[-0.06em] leading-none text-white">
            Social <span className="text-gradient">ROI.</span>
          </h1>
        </div>
      </div>

      {/* Main Flow Graph */}
      <div className="glass-card mb-8 p-12 relative overflow-hidden bg-[rgba(139,92,246,0.02)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(139,92,246,0.05)] to-transparent" />
        <h2 className="section-title-premium mb-12 relative z-10 text-center">Conversion Pipeline</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col md:flex-row items-center w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                className="glass-card flex-1 flex flex-col items-center justify-center p-8 w-full border-[rgba(255,255,255,0.05)]"
                style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)` }}
              >
                <node.icon size={28} color={node.color} className="mb-4" />
                <div className="text-4xl font-[900] font-mono text-white mb-2">{node.value}</div>
                <div className="text-[11px] font-bold text-[#888] uppercase tracking-widest text-center">{node.label}</div>
              </motion.div>
              
              {i < nodes.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2 + 0.1 }}
                  className="hidden md:flex text-[rgba(255,255,255,0.2)] mx-2 shrink-0"
                >
                  <ArrowRight size={24} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-white mb-6">Top Performing Hooks</h3>
          <div className="flex flex-col gap-4">
             {['"Most teams over-engineer their auth..."', '"Stop using Redux for everything."', '"We migrated to Edge computing and..."'].map((hook, i) => (
                <div key={i} className="group p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5">
                  <span className="text-[#ccc] text-sm font-medium group-hover:text-white transition-colors">"{hook}</span>
                  <span className="text-[#00FF88] text-xs font-bold font-mono px-2 py-1 bg-[rgba(0,255,136,0.1)] rounded-md shadow-[0_0_10px_rgba(0,255,136,0)] group-hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all border border-[rgba(0,255,136,0.1)]">+{((i * 7) % 20) + 5} Stars</span>
                </div>
             ))}
          </div>
        </div>
        <div className="glass-card p-8 bg-[rgba(245,158,11,0.02)] border-[rgba(245,158,11,0.1)]">
          <h3 className="text-lg font-bold text-white mb-6">Audience Growth</h3>
          <div className="relative w-full h-48 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
            <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.3)" />
                  <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M0,130 C40,110 80,140 120,90 C160,50 200,80 240,60 C280,30 320,60 360,20 L400,15"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                d="M0,130 C40,110 80,140 120,90 C160,50 200,80 240,60 C280,30 320,60 360,20 L400,15 L400,150 L0,150 Z"
                fill="url(#chartGradient)"
              />
            </svg>
            <div className="absolute inset-x-0 border-t border-[rgba(255,255,255,0.03)] top-[25%]" />
            <div className="absolute inset-x-0 border-t border-[rgba(255,255,255,0.03)] top-[50%]" />
            <div className="absolute inset-x-0 border-t border-[rgba(255,255,255,0.03)] top-[75%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.5)] via-transparent to-transparent pointer-events-none w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
