'use client';
import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  getProjects,
  getSettings,
  getPosts,
  savePost,
  Project,
  Post,
} from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import ToneSelector from '@/components/generate/ToneSelector';
import ContextSelector from '@/components/generate/ContextSelector';
import OutputTabs from '@/components/generate/OutputTabs';
import { Sparkles, Zap, RefreshCw, Activity, Code } from 'lucide-react';
import { motion } from 'framer-motion';

function NeuralWave() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 40, justifyContent: 'center', margin: '20px 0' }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            background: 'var(--green)',
            borderRadius: 2,
            animation: `wave 1s ease-in-out infinite ${i * 0.1}s`,
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
        @keyframes wave { 0%, 100% { height: 8px; } 50% { height: 32px; } }
      `}</style>
    </div>
  );
}

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: toastError } = useToast();
  const [input, setInput] = useState('');
  const [tone, setTone] = useState<'builder' | 'hustler' | 'hot_take'>('builder');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ linkedin: string; x_thread: string[]; postId: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchSuggestions = useCallback(async (currentProjects: Project[]) => {
    setLoadingSuggestions(true);
    try {
      const s = await getSettings();
      const posts = await getPosts();
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: currentProjects, settings: s, recentPosts: posts.slice(0, 5) }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      toastError('Neural nodes are recalibrating. Failed to fetch hooks.');
    } finally {
      setLoadingSuggestions(false);
    }
  }, [toastError]);

  const generate = useCallback(async (forcedInput?: string) => {
    const activeInput = forcedInput || input;
    if (!activeInput.trim()) { setError('Select a strategy hook or provide a seed.'); return; }
    setError(''); setGenerating(true); setResult(null); setSaved(false);
    try {
      const [settings, allPosts] = await Promise.all([getSettings(), getPosts()]);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: activeInput, tone, projectId: selectedProject, settings, projects, recentPosts: allPosts.filter(p => p.is_saved).slice(0, 10) }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error || 'Synthesis node failed.'); return; }
      const selectedProj = projects.find(p => p.id === selectedProject);
      await savePost({ content_linkedin: data.linkedin, content_x: data.x_thread, tone, project_id: selectedProject, project_name: selectedProj?.name ?? null, is_saved: false });
      const posts = await getPosts();
      setResult({ linkedin: data.linkedin, x_thread: data.x_thread, postId: posts[0].id });
      success('Brand asset successfully synthesized.');
    } catch {
      toastError('Synthesis link severed. Check your network sync.');
      setError('Network sync failed.');
    } finally {
      setGenerating(false);
    }
  }, [input, tone, selectedProject, projects, success, toastError]);

  useEffect(() => {
    const loadInitial = async () => {
      const ps = await getProjects();
      setProjects(ps);
      const pid = searchParams.get('project');
      if (pid && ps.find(p => p.id === pid)) setSelectedProject(pid);
      const initialInput = searchParams.get('input');
      if (initialInput) { setInput(initialInput); setTimeout(() => generate(initialInput), 500); }
      fetchSuggestions(ps);
    };
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuggestionClick = (hook: string) => { setInput(hook); generate(hook); };

  return (
    <div className="animate-fade-in" style={{ maxWidth: 'var(--max-width-page)', margin: '0 auto' }}>
      <style>{`
        .generate-two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--card-gap);
          align-items: start;
          padding-bottom: 80px;
        }
        @media (min-width: 1024px) {
          .generate-two-col { grid-template-columns: 1fr 1fr; }
        }
        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
          gap: 16px;
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="section-title-premium" style={{ color: 'var(--green)', marginBottom: 12 }}>
            <Activity size={13} /> Elite Brand Synthesis Engine
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.055em', lineHeight: 1.1, color: 'var(--white)' }}>
            Content <span className="text-gradient">Studio.</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: 100, padding: '8px 16px', flexShrink: 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--green)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Neural Sync Active</span>
        </div>
      </div>

      {/* Strategy Hooks — visible when no result yet */}
      {!result && !generating && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2 className="section-title-premium" style={{ marginBottom: 0 }}>
              <Zap size={14} style={{ color: 'var(--green)' }} /> Strategy Hooks
            </h2>
            <button
              onClick={() => fetchSuggestions(projects)}
              className="btn-ghost-premium"
              style={{ height: 36, padding: '0 16px', fontSize: 11, gap: 8 }}
            >
              <RefreshCw size={13} style={loadingSuggestions ? { animation: 'spin 1s linear infinite' } : {}} />
              Refresh Signals
            </button>
          </div>
          <div className="suggestions-grid">
            {loadingSuggestions
              ? [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 20 }} />)
              : suggestions.map((hook, i) => (
                <button
                  key={i}
                  className="glass-card"
                  onClick={() => handleSuggestionClick(hook)}
                  style={{ padding: 24, textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <p style={{ fontSize: 14, color: 'var(--white)', lineHeight: 1.6, fontWeight: 500, marginBottom: 16 }}>{hook}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--green)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 'auto' }}>
                    <Zap size={11} /> Synthesize Hook
                  </div>
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* Main Two-Column: Input Console + Output */}
      <div className="generate-two-col">

        {/* Input Console */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="glass-card"
          style={{ padding: 32, position: 'relative', overflow: 'hidden', border: generating ? '1px solid var(--green-border)' : '1px solid var(--border)' }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(0,255,136,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>

            <h3 className="section-title-premium" style={{ marginBottom: 28 }}>
              <Code size={15} style={{ color: 'var(--green)' }} /> Parameters
            </h3>

            {/* Concept Seed */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                Concept Seed
              </label>
              <textarea
                ref={textareaRef}
                className="input-premium"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Inject a technical milestone or thought..."
                style={{ minHeight: 140, fontSize: 15, lineHeight: 1.6 }}
              />
            </div>

            {/* Tone + Project side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Tone
                </label>
                <ToneSelector selected={tone} onSelect={setTone} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#666', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Project
                </label>
                {projects.length === 0 ? (
                  <button
                    onClick={() => router.push('/projects')}
                    className="btn-ghost-premium"
                    style={{ width: '100%', height: 48, fontSize: 11, borderStyle: 'dashed' }}
                  >
                    + Initialize Context
                  </button>
                ) : (
                  <ContextSelector projects={projects} selected={selectedProject} onSelect={setSelectedProject} />
                )}
              </div>
            </div>

            {/* Generating indicator */}
            {generating && (
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: 'var(--green)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Cloning Voice Architecture
                </p>
                <NeuralWave />
              </div>
            )}

            {/* Main CTA */}
            <button
              className="btn-premium"
              onClick={() => generate()}
              disabled={generating}
              style={{ width: '100%', height: 64, fontSize: 17, background: 'var(--accent-gradient)', color: '#000', letterSpacing: '0.02em' }}
            >
              <Sparkles size={20} />
              {generating ? 'SYNTHESIZING...' : 'SYNTHESIZE BRAND ASSET'}
            </button>

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 14, textAlign: 'center', fontWeight: 700 }}>{error}</p>
            )}
          </div>
        </motion.div>

        {/* Output Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result && !generating && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <OutputTabs linkedin={result.linkedin} xThread={result.x_thread} />
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button
                  className="btn-premium"
                  style={{ flex: 1, height: 56, fontSize: 13 }}
                  onClick={async () => {
                    await savePost({ id: result.postId, is_saved: true });
                    setSaved(true);
                    success('Post committed to brand history.');
                  }}
                >
                  {saved ? '✓ ARCHIVED' : 'COMMIT TO BRAND HISTORY'}
                </button>
                <button
                  className="btn-ghost-premium"
                  style={{ width: 56, height: 56, padding: 0, flexShrink: 0 }}
                  onClick={() => generate()}
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: 'var(--muted)', fontSize: 13, letterSpacing: '0.1em' }}>
        Syncing Neural Nodes...
      </div>
    }>
      <GenerateContent />
    </Suspense>
  );
}
