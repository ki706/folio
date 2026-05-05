'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Sparkles, ArrowRight, Terminal, Zap, ShieldCheck, Code } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const router = useRouter();

  const handleDemoLogin = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: 'demo@folio.dev', 
        password: 'folio_demo_2026' 
      });
      
      if (error) {
        console.warn('Demo Auth Error: Pivoting to Server-Safe Mock Mode');
        document.cookie = "folio_demo_mode=true; path=/; max-age=3600; SameSite=Lax";
        localStorage.setItem('folio_demo_mode', 'true');
        router.push('/');
        router.refresh();
      } else {
        document.cookie = "folio_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem('folio_demo_mode');
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Demo Login Exception:', err);
      toastError('Neural link timed out. Defaulting to local simulation.');
      document.cookie = "folio_demo_mode=true; path=/; max-age=3600; SameSite=Lax";
      localStorage.setItem('folio_demo_mode', 'true');
      router.push('/');
      router.refresh();
    }
  }, [router]);

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleDemoLogin();
    }
  }, [searchParams, handleDemoLogin]);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo read:user user:email'
      }
    });
    if (error) {
      toastError(error.message || 'Identity verification failed.');
      setStatus({ type: 'error', message: error.message });
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: 'clamp(16px, 4vw, 32px)' }}>
      {/* Dynamic Background */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'var(--green-dim)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'var(--green-dim)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none', opacity: 0.5 }} />

      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: 420, padding: 'clamp(28px, 6vw, 48px)', position: 'relative', zIndex: 10, textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
        <div className="mb-12">
          <div className="app-logo text-4xl mb-3 tracking-tighter">folio</div>
          <p className="text-[var(--muted)] text-sm font-medium tracking-tight">The world&apos;s first commit-to-content engine.</p>
        </div>

        {status && (
          <div className={`rounded-xl p-4 mb-6 text-sm font-semibold border ${
            status.type === 'error' 
              ? 'bg-red-500/10 border-red-500/20 text-[var(--danger)]' 
              : 'bg-[var(--green-dim)] border-[var(--green)]/20 text-[var(--green)]'
          }`}>
            {status.message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button 
            className="btn-premium hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-16 w-full flex items-center justify-center gap-3 text-lg"
            onClick={handleGitHubLogin} 
            disabled={loading}
          >
            <Code size={22} strokeWidth={2.5} />
            {loading ? 'SYNCHRONIZING...' : 'Continue with GitHub'}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">or explore</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <button 
            className="btn-ghost-premium hover:bg-white/5 active:bg-white/10 h-14 w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 font-bold transition-all"
            onClick={handleDemoLogin} 
            disabled={loading}
          >
            <Zap size={18} className="text-[var(--green)] fill-[var(--green)]/20" />
            Try Live Demo
          </button>
        </div>

        <p className="mt-12 text-[11px] text-[var(--muted)] leading-relaxed font-medium">
          By continuing, you authorize <span className="text-white">Folio</span> to securely track your repository signals and <span className="text-[var(--green)]">synthesize technical narratives</span>.
        </p>
      </div>
      
      <div style={{ marginTop: 'clamp(24px, 5vw, 48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 3vw, 28px)', justifyContent: 'center', fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--green)' }}><ShieldCheck size={11} /> SECURE OAUTH 2.0</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }} className="hover:text-white transition-colors">PRIVACY</button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }} className="hover:text-white transition-colors">TERMS</button>
         </div>
         <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' }}>© 2026 FOLIO BROADCAST ENGINE</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading Credentials...</div>}>
      <LoginContent />
    </Suspense>
  );
}
