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
import { Sparkles, ArrowRight, Zap, Info, Lightbulb, RefreshCw, Activity, Code } from 'lucide-react';
import { motion } from 'framer-motion';

function NeuralWave() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 40, justifyContent: 'center', margin: '20px 0' }}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ 
            width: 3, 
            background: 'var(--green)', 
            borderRadius: 2, 
            animation: `wave 1s ease-in-out infinite ${i * 0.1}s`,
            opacity: 0.8
          }} 
        />
      ))}
      <style>{`
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 32px; }
        }
        .wave-bar { transition: height 0.2s ease; }
      `}</style>
    </div>
  );
}

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: toastError, info } = useToast();
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
        body: JSON.stringify({
          projects: currentProjects,
          settings: s,
          recentPosts: posts.slice(0, 5),
        }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Suggestions failed');
      toastError('Neural nodes are recalibrating. Failed to fetch hooks.');
    } finally {
      setLoadingSuggestions(false);
    }
  }, [toastError]);

  const generate = useCallback(async (forcedInput?: string) => {
    const activeInput = forcedInput || input;
    if (!activeInput.trim()) {
      setError('Select a strategy hook or provide a seed.');
      return;
    }
    setError('');
    setGenerating(true);
    setResult(null);
    setSaved(false);

    try {
      const [settings, allPosts] = await Promise.all([getSettings(), getPosts()]);
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: activeInput,
          tone,
          projectId: selectedProject,
          settings,
          projects,
          recentPosts: allPosts.filter(p => p.is_saved).slice(0, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Synthesis node failed.');
        return;
      }

      const selectedProj = projects.find((p) => p.id === selectedProject);
      await savePost({
        content_linkedin: data.linkedin,
        content_x: data.x_thread,
        tone,
        project_id: selectedProject,
        project_name: selectedProj?.name ?? null,
        is_saved: false,
      });
      
      const posts = await getPosts();
      setResult({ linkedin: data.linkedin, x_thread: data.x_thread, postId: posts[0].id });
      success('Brand asset successfully synthesized.');
    } catch (err) {
      console.error('Generate error:', err);
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
      if (pid && ps.find((p) => p.id === pid)) {
        setSelectedProject(pid);
      }

      const initialInput = searchParams.get('input');
      if (initialInput) {
        setInput(initialInput);
        // Wait for projects to be set before generating
        setTimeout(() => generate(initialInput), 500);
      }

      fetchSuggestions(ps);
    };

    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuggestionClick = (hook: string) => {
    setInput(hook);
    generate(hook);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, letterSpacing: '-0.055em' }}>Content Studio</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Elite Brand Synthesis Engine</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted-dark)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
           <Activity size={13} /> NEURAL SYNC ACTIVE
        </div>
      </div>

      {!result && !generating && (
        <div className="max-w-[var(--max-width-page)] mx-auto pb-32 animate-fade-in px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[var(--green)] uppercase">
                <Zap size={14} className="animate-pulse" /> Neural Engine Active
              </div>
              <h1 className="text-[clamp(40px,5vw,64px)] font-[900] tracking-[-0.05em] leading-none text-white">
                Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--muted)]">Synthesis.</span>
              </h1>
            </div>
            <button onClick={() => fetchSuggestions(projects)} className="btn-ghost-premium" style={{ height: 28, padding: '0 10px', fontSize: 10 }}>
               <RefreshCw size={12} className={loadingSuggestions ? 'animate-spin' : ''} /> REFRESH
            </button>
          </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {loadingSuggestions ? (
                [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />)
              ) : suggestions.map((hook, i) => (
                <button
                  key={i}
                  className="glass-card hover-glow"
                  onClick={() => handleSuggestionClick(hook)}
                  style={{ textAlign: 'left', padding: 20, cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}
                >
                  <p style={{ fontSize: 14, color: 'var(--white)', lineHeight: 1.5, fontWeight: 500 }}>{hook}</p>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>
                    <Zap size={10} /> SYNTHESIZE
                  </div>
                </button>
              ))}
           </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: 'clamp(20px, 4vw, 48px)', alignItems: 'start' }}>
        
        {/* Input Console */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 glass-card p-8 border border-[rgba(0,255,136,0.1)] bg-[#0A0A0A] relative overflow-hidden${generating ? ' border-pulse' : ''}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,136,0.05)_0%,_transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Code size={16} className="text-[var(--green)]" /> Parameters
            </h2>
            <div style={{ marginBottom: 28 }}>
              <label className="section-title-premium mb-3">
                <Zap size={14} className="text-[#00FF88]" /> Concept Seed
              </label>
              <textarea
                ref={textareaRef}
                className="input-premium focus:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-shadow duration-300"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inject a technical milestone or thought..."
                style={{ minHeight: 140, fontSize: 16, lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))', gap: 20 }}>
              <div>
                <label className="section-title-premium mb-3">Tone Parameters</label>
                <ToneSelector selected={tone} onSelect={setTone} />
              </div>
              <div>
                <label className="section-title-premium mb-3">Project Context</label>
                {projects.length === 0 ? (
                  <button 
                    onClick={() => router.push('/projects')}
                    className="btn-ghost-premium hover:bg-[rgba(255,255,255,0.05)]" 
                    style={{ width: '100%', height: 44, fontSize: 11, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.15)' }}
                  >
                    + INITIALIZE CONTEXT
                  </button>
                ) : (
                  <ContextSelector projects={projects} selected={selectedProject} onSelect={setSelectedProject} />
                )}
              </div>
            </div>
          </div>

          {generating && (
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
               <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', letterSpacing: '0.2em', marginBottom: 12 }}>CLONING VOICE ARCHITECTURE</p>
               <NeuralWave />
            </div>
          )}

          <button
            className={`btn-premium${generating ? ' loading' : ''}`}
            onClick={() => generate()}
            disabled={generating}
            style={{ width: '100%', height: 64, fontSize: 18, background: 'var(--accent-gradient)', color: '#000' }}
          >
            {generating ? 'SYNTHESIZING...' : (
              <>
                <Sparkles size={20} /> SYTHESIZE BRAND ASSET
              </>
            )}
          </button>
          
          {error && <p style={{ color: 'var(--danger)', fontSize: 12, marginTop: 16, textAlign: 'center' }}>{error}</p>}
        </motion.div>

        {/* Output Visualization */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {result && !generating && (
            <div style={{ animation: 'fadeIn 0.5s ease forwards' }}>
              <OutputTabs
                linkedin={result.linkedin}
                xThread={result.x_thread}
              />
              <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                 <button className="btn-premium" style={{ flex: 1, height: 56 }} onClick={async () => {
                    await savePost({ id: result.postId, is_saved: true });
                    setSaved(true);
                    success('Post committed to brand history.');
                  }}>
                    {saved ? '✓ ARCHIVED' : 'COMMIT TO BRAND HISTORY'}
                 </button>
                 <button className="btn-ghost-premium" style={{ height: 56, width: 56, padding: 0 }} onClick={() => generate()}>
                    <RefreshCw size={20} />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div>Syncing Neural Nodes...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
