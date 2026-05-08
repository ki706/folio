'use client';
import { motion } from 'framer-motion';
import { TrendingUp, GitCommit, Eye, GitMerge, Zap, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const nodes = [
    { id: 'commits', label: 'Commits Analyzed', value: '142', icon: GitCommit, trend: '+12% this week' },
    { id: 'posts', label: 'Posts Synthesized', value: '38', icon: TrendingUp, trend: '8 active drafts' },
    { id: 'impressions', label: 'Total Impressions', value: '124.5k', icon: Eye, trend: '+45.2% vs last month' },
    { id: 'stars', label: 'GitHub Stars', value: '+412', icon: GitMerge, trend: 'Trending in TypeScript' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 'var(--max-width-page)', margin: '0 auto' }}>
      <style>{`
        .analytics-bento {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--card-gap);
          padding-bottom: 80px;
        }
        .analytics-metric-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--card-gap);
        }
        @media (min-width: 768px) {
          .analytics-bento {
            grid-template-columns: repeat(4, 1fr);
          }
          .analytics-main-chart {
            grid-column: span 3;
            grid-row: span 2;
          }
          .analytics-metric-col {
            grid-column: span 1;
            grid-row: span 1;
          }
          .analytics-hooks-row {
            grid-column: span 3;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="section-title-premium" style={{ color: 'var(--green)', marginBottom: 12 }}>
            <Activity size={13} /> Telemetry Active
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.1, color: 'var(--white)' }}>
            Brand <span className="text-gradient">Telemetry.</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 100, padding: '8px 16px', flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Live Sync</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="analytics-bento">

        {/* Main Audience Trajectory Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card analytics-main-chart"
          style={{ padding: 40, display: 'flex', flexDirection: 'column', minHeight: 360 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--white)', marginBottom: 4 }}>Audience Trajectory</h2>
              <p style={{ fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Impressions (Aggregated)</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--white)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em' }}>124,500</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)', marginTop: 4 }}>+45.2%</div>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', minHeight: 200 }}>
            <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0, 255, 136, 0.2)" />
                  <stop offset="100%" stopColor="rgba(0, 255, 136, 0)" />
                </linearGradient>
                <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00FF88" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#00FF88" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: 'easeInOut' }}
                d="M0,250 C100,240 150,180 250,190 C350,200 450,100 550,120 C650,140 700,50 800,20"
                fill="none" stroke="url(#lineGlow)" strokeWidth="4" strokeLinecap="round"
              />
              <motion.path
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                d="M0,250 C100,240 150,180 250,190 C350,200 450,100 550,120 C650,140 700,50 800,20 L800,300 L0,300 Z"
                fill="url(#chartGlow)"
              />
              {[25, 50, 75].map(pos => (
                <line key={pos} x1="0" y1={pos * 3} x2="800" y2={pos * 3} stroke="#888" strokeWidth="0.5" strokeDasharray="8,8" opacity="0.25" />
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Metric Cards */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.1) }}
            className="glass-card analytics-metric-col"
            style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 160 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)' }}>
                <node.icon size={20} style={{ color: 'var(--green)' }} />
              </div>
              <Zap size={14} style={{ color: '#333' }} />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{node.label}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--white)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.04em', lineHeight: 1 }}>{node.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', marginTop: 8 }}>{node.trend}</div>
            </div>
          </motion.div>
        ))}

        {/* Top Performing Hooks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card analytics-hooks-row"
          style={{ padding: 32 }}
        >
          <h3 className="section-title-premium" style={{ marginBottom: 20 }}>Top Performing Neural Hooks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              '"Most teams over-engineer their auth..."',
              '"Stop using Redux for everything."',
              '"We migrated to Edge computing and dropped latency by 40ms..."'
            ].map((hook, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>{hook}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,255,136,0.08)', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(0,255,136,0.12)', whiteSpace: 'nowrap' }}>
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
