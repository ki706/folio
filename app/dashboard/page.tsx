'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  getSettings,
  getNotifications,
  getProjects,
  getPosts,
  getWeekActivity,
  getPostingStreak,
  getDaysSinceLastPost,
  addNotification,
  calculateResonanceScore,
  Notification,
  Settings,
  Project,
  Post,
} from '@/lib/store';
import ActivityGrid from '@/components/home/ActivityGrid';
import BrandGauge from '@/components/dashboard/BrandGauge';
import { useRouter } from 'next/navigation';
import { Sparkles, Target, Activity, Lightbulb, Zap, ArrowRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [weekDays, setWeekDays] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [postsThisMonth, setPostsThisMonth] = useState(0);
  const [avgPerWeek, setAvgPerWeek] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [resonanceScore, setResonanceScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async (currentProjects: Project[], s: Settings, recentPosts: Post[]) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: currentProjects,
          settings: s,
          recentPosts: recentPosts.slice(0, 5),
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestions failed');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const refresh = useCallback(async () => {
    const s = await getSettings();
    if (!s) {
       router.push('/login');
       return;
    }
    setSettings(s);
    
    // Optimized: Fetch core data once and pass it down
    const [allNotifs, allProjects, allPosts, week, daysSince] = await Promise.all([
      getNotifications(),
      getProjects(),
      getPosts(),
      getWeekActivity(),
      getDaysSinceLastPost(),
    ]);

    const currentStreak = await getPostingStreak(allPosts);
    const score = await calculateResonanceScore({ streak: currentStreak, projects: allProjects, posts: allPosts });

    setNotifications(allNotifs.filter((n) => !n.is_read).slice(0, 4));
    setWeekDays(week);
    setStreak(currentStreak);
    setResonanceScore(score);
    fetchSuggestions(allProjects, s, allPosts);

    const savedPosts = allPosts.filter((p) => p.is_saved);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    setPostsThisMonth(savedPosts.filter((p) => new Date(p.created_at) >= monthStart).length);
    const total = savedPosts.length;
    setAvgPerWeek(total > 0 ? Math.round((total / 4) * 10) / 10 : 0);

    if (s && s.proactive_inactivity) {
      const existingInactivity = allNotifs.find(n => n.type === 'inactivity' && !n.is_read);
      if (daysSince !== null && daysSince >= s.inactivity_days && !existingInactivity) {
        await addNotification({
          type: 'inactivity',
          message: `Dormancy detected (${daysSince} days)\nReady to refresh your brand resonance?`,
          cta_label: 'Synthesize Post',
          cta_action: '/generate',
          is_read: false,
        });
        // Removed recursive refresh() call to prevent infinite loops
      }
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  if (loading) return (
    <div className="flex flex-col gap-12 max-w-[1100px] mx-auto animate-fade-in">
       <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
             <div className="skeleton w-40 h-4 rounded-full" />
             <div className="skeleton w-80 h-16 rounded-xl" />
          </div>
          <div className="skeleton w-32 h-12 rounded-xl" />
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
             <div className="skeleton h-[380px] rounded-[32px]" />
             <div className="skeleton h-[200px] rounded-[32px]" />
          </div>
          <div className="flex flex-col gap-8">
             <div className="skeleton h-[400px] rounded-[32px]" />
             <div className="flex gap-4">
                <div className="skeleton flex-1 h-[120px] rounded-[32px]" />
                <div className="skeleton flex-1 h-[120px] rounded-[32px]" />
             </div>
             <div className="skeleton h-[72px] rounded-[32px]" />
          </div>
       </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 100 }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 64 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--green)', fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', marginBottom: 16 }}>
            <Activity size={14} /> NEURAL SYNC • ACTIVE
          </div>
          <h1 style={{ fontSize: 'clamp(44px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1, color: 'var(--white)' }}>
            Control the <br />
            <span className="text-gradient">Narrative.</span>
          </h1>
        </div>
        <div style={{ paddingBottom: 10, textAlign: 'right' }}>
           <p style={{ fontSize: 11, color: 'var(--muted-dark)', fontWeight: 800, letterSpacing: '0.05em' }}>SYSTEM HEALTH</p>
           <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>OPTIMAL</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        
        {/* Analytics Layer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: 'radial-gradient(circle at center, rgba(0, 255, 136, 0.05) 0%, transparent 100%)' }}>
             <h2 className="section-title-premium" style={{ justifyContent: 'center' }}>Resonance Score</h2>
             <BrandGauge score={resonanceScore} label="Equity" />
             <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 24, maxWidth: 240, margin: '24px auto 0', lineHeight: 1.6 }}>
                {resonanceScore > 50 
                  ? "Your brand signal is outperforming 84% of technical peers." 
                  : "Initialize more projects to increase your architectural depth."}
             </p>
          </div>

          <div className="glass-card" style={{ padding: 32 }}>
            <h2 className="section-title-premium">Broadcast History</h2>
            <ActivityGrid days={weekDays} />
            <div style={{ marginTop: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
               <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                 <div style={{ width: `${resonanceScore}%`, height: '100%', background: 'var(--accent-gradient)' }} />
               </div>
               <span style={{ fontSize: 10, color: 'var(--muted-dark)', fontWeight: 800 }}>{resonanceScore}% SIGNAL</span>
            </div>
          </div>
        </div>

        {/* Action Layer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h2 className="section-title-premium" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={16} className="text-amber" /> Strategy Hooks
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loadingSuggestions ? (
                [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 84, borderRadius: 16 }} />)
              ) : suggestions.length === 0 ? (
                <div className="glass-card" style={{ padding: 24, textAlign: 'center', borderStyle: 'dashed' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted-dark)' }}>Calibrating strategy nodes...</p>
                </div>
              ) : suggestions.map((hook, i) => (
                <button
                  key={i}
                  className="glass-card hover-glow"
                  onClick={() => router.push(`/generate?input=${encodeURIComponent(hook)}`)}
                  style={{ textAlign: 'left', padding: '20px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}
                >
                  <p style={{ fontSize: 14, color: 'var(--white)', lineHeight: 1.5, fontWeight: 500 }}>{hook}</p>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--green)', fontWeight: 800 }}>
                    <Zap size={10} /> INITIALIZE DRAFT
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             <div className="glass-card" style={{ padding: 24 }}>
                <TrendingUp size={20} className="text-green" />
                <div style={{ fontSize: 32, fontWeight: 900, marginTop: 12, fontFamily: 'Geist Mono', color: 'var(--white)' }}>{postsThisMonth}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-dark)', fontWeight: 800 }}>MONTHLY SIGNAL</div>
             </div>
             <div className="glass-card" style={{ padding: 24 }}>
                <Target size={20} className="text-purple" />
                <div style={{ fontSize: 32, fontWeight: 900, marginTop: 12, fontFamily: 'Geist Mono', color: 'var(--white)' }}>{avgPerWeek}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-dark)', fontWeight: 800 }}>WEEKLY VELOCITY</div>
             </div>
          </div>

          <button className="btn-premium hover-glow" style={{ height: 72, fontSize: 18, borderRadius: 20, boxShadow: '0 20px 40px rgba(0,255,136,0.1)' }} onClick={() => router.push('/generate')}>
             <Sparkles size={20} /> SYNTHESIZE CONTENT <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
