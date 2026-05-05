'use client';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Terminal, Zap, ShieldCheck, Code } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
  const router = useRouter();

  const handleDemoLogin = async () => {
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
      document.cookie = "folio_demo_mode=true; path=/; max-age=3600; SameSite=Lax";
      localStorage.setItem('folio_demo_mode', 'true');
      router.push('/');
      router.refresh();
    }
  };

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      handleDemoLogin();
    }
  }, [searchParams]);

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
      setStatus({ type: 'error', message: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--green-dim)] blur-[120px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--green-dim)] blur-[120px] rounded-full pointer-events-none opacity-40" />
      
      <div className="glass-card animate-fade-in w-full max-w-[440px] p-12 relative z-10 text-center shadow-2xl">
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
      
      <div className="absolute bottom-10 flex flex-col items-center gap-4">
         <div className="flex gap-8 text-[10px] text-[var(--muted)] font-bold tracking-widest uppercase">
            <span className="flex items-center gap-2 text-[var(--green)]"><ShieldCheck size={12} /> SECURE OAUTH 2.0</span>
            <button className="hover:text-white transition-colors">PRIVACY</button>
            <button className="hover:text-white transition-colors">TERMS</button>
         </div>
         <div className="text-[9px] text-[var(--muted)]/50 font-black tracking-[0.3em] uppercase">© 2026 FOLIO BROADCAST ENGINE</div>
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
