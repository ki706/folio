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
    <div className="max-w-[var(--max-width-page)] mx-auto animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="text-gradient" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.055em' }}>Content Studio</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Elite Brand Synthesis Engine</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] rounded-full px-4 py-2 mb-2">
           <Activity size={14} className="text-[var(--green)]" />
           <span className="text-[10px] font-bold text-[var(--green)] tracking-widest uppercase">Neural Sync Active</span>
        </div>
      </header>

      {!result && !generating && (
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-8">
            <div>
              <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.2em] mb-4 text-[var(--green)] uppercase">
                <Zap size={14} className="animate-pulse" /> Neural Engine Active
              </div>
              <h2 className="text-[clamp(28px,4vw,48px)] font-[900] tracking-[-0.05em] leading-tight text-white">
                Strategy <span className="text-gradient">Hooks.</span>
              </h2>
            </div>
            <button onClick={() => fetchSuggestions(projects)} className="btn-ghost-premium h-10 px-4 text-[11px]">
               <RefreshCw size={14} className={loadingSuggestions ? 'animate-spin' : ''} /> REFRESH SIGNALS
            </button>
          </div>
           
           <div className="dashboard-grid">
              {loadingSuggestions ? (
                [1, 2, 3].map(i => <div key={i} className="skeleton h-[120px] rounded-2xl" />)
              ) : suggestions.map((hook, i) => (
                <button
                  key={i}
                  className="glass-card p-6 text-left hover:border-[var(--green-border)] transition-all group"
                  onClick={() => handleSuggestionClick(hook)}
                >
                  <p className="text-sm text-white leading-relaxed font-medium mb-6">{hook}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--green)] tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                    <Zap size={12} /> Synthesize Hook
                  </div>
                </button>
              ))}
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--card-gap)] items-start pb-32">
        
        {/* Input Console */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className={`glass-card p-8 relative overflow-hidden ${generating ? 'border-[var(--green-border)]' : ''}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,136,0.05)_0%,_transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="section-title-premium mb-8">
              <Code size={16} className="text-[var(--green)]" /> Parameters
            </h3>
            
            <div className="mb-8">
              <label className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-3 block">
                Concept Seed
              </label>
              <textarea
                ref={textareaRef}
                className="input-premium min-h-[160px] text-base leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inject a technical milestone or thought..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div>
                <label className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-3 block">Tone Parameters</label>
                <ToneSelector selected={tone} onSelect={setTone} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase mb-3 block">Project Context</label>
                {projects.length === 0 ? (
                  <button 
                    onClick={() => router.push('/projects')}
                    className="btn-ghost-premium w-full h-[54px] border-dashed"
                  >
                    + INITIALIZE CONTEXT
                  </button>
                ) : (
                  <ContextSelector projects={projects} selected={selectedProject} onSelect={setSelectedProject} />
                )}
              </div>
            </div>

            {generating && (
              <div className="text-center mb-8">
                 <p className="text-[10px] font-black text-[var(--green)] tracking-[0.3em] uppercase mb-4 animate-pulse">Cloning Voice Architecture</p>
                 <NeuralWave />
              </div>
            )}

            <button
              className="btn-premium w-full h-16 text-lg"
              onClick={() => generate()}
              disabled={generating}
            >
              {generating ? 'SYNTHESIZING...' : (
                <>
                  <Sparkles size={20} /> SYTHESIZE BRAND ASSET
                </>
              )}
            </button>
            
            {error && <p className="text-danger text-xs mt-4 text-center font-bold tracking-tight">{error}</p>}
          </div>
        </motion.div>

        {/* Output Visualization */}
        <div className="flex flex-col gap-6">
          {result && !generating && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <OutputTabs
                linkedin={result.linkedin}
                xThread={result.x_thread}
              />
              <div className="mt-6 flex gap-4">
                 <button className="btn-premium flex-1 h-14" onClick={async () => {
                    await savePost({ id: result.postId, is_saved: true });
                    setSaved(true);
                    success('Post committed to brand history.');
                  }}>
                    {saved ? '✓ ARCHIVED' : 'COMMIT TO BRAND HISTORY'}
                 </button>
                 <button className="btn-ghost-premium w-14 h-14 p-0" onClick={() => generate()}>
                    <RefreshCw size={20} />
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
    <Suspense fallback={<div>Syncing Neural Nodes...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
