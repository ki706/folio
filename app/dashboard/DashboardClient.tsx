'use client';
import { useState } from 'react';
import {
  Project,
  Post,
  Notification,
  Settings,
  addNotification,
} from '@/lib/store';
import ActivityGrid from '@/components/home/ActivityGrid';
import BrandGauge from '@/components/dashboard/BrandGauge';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, Target, Activity, Lightbulb, Zap, ArrowRight, TrendingUp } from 'lucide-react';

interface DashboardClientProps {
  initialSettings: Settings;
  initialNotifications: Notification[];
  initialProjects: Project[];
  initialPosts: Post[];
  initialWeekActivity: boolean[];
  initialStreak: number;
  initialResonanceScore: number;
  initialDaysSinceLastPost: number | null;
}

export default function DashboardClient({
  initialSettings,
  initialNotifications,
  initialProjects,
  initialPosts,
  initialWeekActivity,
  initialStreak,
  initialResonanceScore,
  initialDaysSinceLastPost
}: DashboardClientProps) {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Derived data
  const savedPosts = initialPosts.filter((p) => p.is_saved);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const postsThisMonth = savedPosts.filter((p) => new Date(p.created_at) >= monthStart).length;
  const total = savedPosts.length;
  const avgPerWeek = total > 0 ? Math.round((total / 4) * 10) / 10 : 0;

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: initialProjects,
          settings: initialSettings,
          recentPosts: initialPosts.slice(0, 5),
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestions failed');
      toastError('Intelligence node sync failed. Strategy hooks unavailable.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Fetch suggestions on client side if not already there
  useState(() => {
    fetchSuggestions();
  });

  return (
    <div className="animate-fade-in mx-auto" style={{ maxWidth: 'var(--max-width-page)' }}>
      <div className="page-header">
        <div>
          <div className="section-title-premium" style={{ color: 'var(--green)', marginBottom: 12 }}>
            <Activity size={13} /> NEURAL SYNC • ACTIVE
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1, color: 'var(--white)' }}>
            Control the{' '}
            <span className="text-gradient">Narrative.</span>
          </h1>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
           <p className="metric-label">SYSTEM HEALTH</p>
           <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>OPTIMAL</p>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Analytics Layer */}
        <div className="analytics-layer">
          <div className="glass-card resonance-card" style={{ 
            background: 'linear-gradient(180deg, rgba(0,255,136,0.03) 0%, rgba(0,0,0,0) 100%)',
            border: '1px solid var(--green-border)',
            boxShadow: '0 24px 80px -20px rgba(0,255,136,0.15)'
          }}>
             <h2 className="section-title-premium" style={{ justifyContent: 'center', opacity: 0.5 }}>Resonance Score</h2>
             <div style={{ transform: 'scale(1.1)', margin: '20px 0' }}>
               <BrandGauge score={initialResonanceScore} label="Equity" />
             </div>
             <p className="resonance-description" style={{ fontSize: 14, fontWeight: 500, color: 'var(--white)', opacity: 0.7 }}>
                {initialResonanceScore > 50 
                  ? "Your brand signal is outperforming 84% of technical peers." 
                  : "Initialize more projects to increase your architectural depth."}
             </p>
          </div>

          <div className="glass-card broadcast-history-card">
            <h2 className="section-title-premium">Broadcast History</h2>
            <ActivityGrid days={initialWeekActivity} />
            <div style={{ marginTop: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
               <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                 <div style={{ width: `${initialResonanceScore}%`, height: '100%', background: 'var(--accent-gradient)' }} />
               </div>
               <span className="metric-label">{initialResonanceScore}% SIGNAL</span>
            </div>
          </div>
        </div>

        {/* Action Layer */}
        <div className="action-layer">
          <div>
            <h2 className="section-title-premium">
              <Lightbulb size={16} className="text-amber" /> Strategy Hooks
            </h2>
            <div className="strategy-hooks-container">
              {loadingSuggestions ? (
                [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 84, borderRadius: 16 }} />)
              ) : suggestions.length === 0 ? (
                <div className="glass-card" style={{ padding: 24, textAlign: 'center', borderStyle: 'dashed' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted-dark)' }}>Calibrating strategy nodes...</p>
                </div>
              ) : suggestions.map((hook, i) => (
                <button
                  key={i}
                  className="glass-card strategy-hook-btn hover-glow"
                  onClick={() => {
                    router.push(`/generate?input=${encodeURIComponent(hook)}`);
                    toastSuccess('Strategy hook engaged.');
                  }}
                >
                  <p style={{ fontSize: 14, color: 'var(--white)', lineHeight: 1.5, fontWeight: 500 }}>{hook}</p>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--green)', fontWeight: 800 }}>
                    <Zap size={10} /> INITIALIZE DRAFT
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="metric-card-grid">
             <div className="glass-card metric-card">
                <TrendingUp size={20} className="text-green" />
                <div className="metric-value">{postsThisMonth}</div>
                <div className="metric-label">MONTHLY SIGNAL</div>
             </div>
             <div className="glass-card metric-card">
                <Target size={20} className="text-purple" />
                <div className="metric-value">{avgPerWeek}</div>
                <div className="metric-label">WEEKLY VELOCITY</div>
             </div>
          </div>

          <div style={{ position: 'relative', marginTop: 8 }}>
            <div style={{ 
              position: 'absolute', 
              inset: -1, 
              background: 'var(--accent-gradient)', 
              borderRadius: 20, 
              opacity: 0.4, 
              filter: 'blur(20px)',
              zIndex: 0
            }} />
            <button 
              className="btn-premium hover-glow" 
              style={{ 
                height: 72, 
                fontSize: 16, 
                borderRadius: 20, 
                width: '100%',
                position: 'relative',
                zIndex: 1,
                background: 'var(--white)',
                color: 'var(--black)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }} 
              onClick={() => router.push('/generate')}
            >
              <Sparkles size={20} style={{ marginRight: 8 }} /> 
              <span style={{ fontWeight: 900 }}>Synthesize Content</span>
              <ArrowRight size={20} style={{ marginLeft: 'auto' }} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
