'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Zap, ShieldCheck, Code, ArrowRight } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { motion } from 'framer-motion';

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
        email: 'demo@emitto.dev', 
        password: 'emitto_demo_2026' 
      });
      
      if (error) {
        console.warn('Demo Auth Error: Pivoting to Server-Safe Mock Mode');
        document.cookie = "emitto_demo_mode=true; path=/; max-age=3600; SameSite=Lax";
        localStorage.setItem('emitto_demo_mode', 'true');
        router.push('/');
        router.refresh();
      } else {
        document.cookie = "emitto_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem('emitto_demo_mode');
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      console.error('Demo Login Exception:', err);
      toastError('Neural link timed out. Defaulting to local simulation.');
      document.cookie = "emitto_demo_mode=true; path=/; max-age=3600; SameSite=Lax";
      localStorage.setItem('emitto_demo_mode', 'true');
      router.push('/');
      router.refresh();
    }
  }, [router, toastError]);

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
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#050505] overflow-hidden relative">
      
      {/* LEFT PANEL: BRAND ARCHITECTURE */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 border-r border-[rgba(255,255,255,0.05)] bg-[#0A0A0A]">
        {/* Abstract Ambient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_center,_rgba(0,204,255,0.05)_0%,_transparent_70%)] blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[100%] h-[100%] bg-[radial-gradient(ellipse_at_center,_rgba(0,255,136,0.05)_0%,_transparent_70%)] blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00CCFF] to-[#00FF88] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
             <Code size={18} color="#000" strokeWidth={3} />
           </div>
           <span className="text-white font-black tracking-tight text-xl">Emitto.</span>
        </div>

        <div className="relative z-10 max-w-lg mt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-[clamp(40px,5vw,64px)] font-[900] tracking-[-0.04em] leading-[1.05] text-white mb-6">
              The world's first <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CCFF] to-[#00FF88]">commit-to-content</span> engine.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-[#888] text-lg font-medium leading-relaxed max-w-md">
            Connect your repositories. Synthesize elite technical narratives. Build a billionaire-tier developer brand on autopilot.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 flex items-center gap-6">
             <div className="flex -space-x-3">
               {[1,2,3].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-[#111] flex items-center justify-center shadow-lg">
                    <GitHubIcon size={16} className="text-[#666]" />
                 </div>
               ))}
             </div>
             <div className="text-sm font-semibold text-[#666]">
               <span className="text-white">10,000+</span> commits synthesized today
             </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-[10px] font-bold text-[#444] uppercase tracking-[0.2em]">
          <span>© 2026 Emitto Broadcast Engine</span>
          <span>System Status: <span className="text-[#00FF88]">Operational</span></span>
        </div>
      </div>

      {/* RIGHT PANEL: AUTH CONSOLE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00CCFF] to-[#00FF88] flex items-center justify-center">
             <Code size={18} color="#000" strokeWidth={3} />
           </div>
           <span className="text-white font-black tracking-tight text-xl">Emitto.</span>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-[420px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-[900] text-white tracking-tight mb-2">Welcome back</h2>
            <p className="text-[#888] text-sm font-medium">Log in to your Emitto dashboard to manage your fleet.</p>
          </div>

          {status && (
            <div className={`rounded-xl p-4 mb-8 text-sm font-semibold border ${
              status.type === 'error' 
                ? 'bg-[rgba(255,68,68,0.1)] border-[rgba(255,68,68,0.2)] text-[#FF4444]' 
                : 'bg-[rgba(0,255,136,0.1)] border-[rgba(0,255,136,0.2)] text-[#00FF88]'
            }`}>
              {status.message}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button 
              className="group relative flex items-center justify-center gap-3 w-full h-[60px] rounded-xl bg-white text-black font-bold text-base transition-all hover:bg-[#f0f0f0] active:scale-[0.98]"
              onClick={handleGitHubLogin} 
              disabled={loading}
            >
              {loading ? (
                 <span className="tracking-widest uppercase text-xs">Synchronizing...</span>
              ) : (
                <>
                  <GitHubIcon size={22} />
                  <span>Continue with GitHub</span>
                  <ArrowRight size={18} className="absolute right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </>
              )}
            </button>

            <div className="flex items-center gap-4 my-4 opacity-50">
              <div className="flex-1 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
              <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">or</span>
              <div className="flex-1 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
            </div>

            <button 
              className="flex items-center justify-center gap-3 w-full h-[56px] rounded-xl bg-[#111] border border-[rgba(255,255,255,0.1)] text-white font-bold text-sm transition-all hover:bg-[#1A1A1A] hover:border-[rgba(0,204,255,0.3)] active:scale-[0.98]"
              onClick={handleDemoLogin} 
              disabled={loading}
            >
              <Zap size={16} className="text-[#00CCFF]" />
              <span>Explore Demo Mode</span>
            </button>
          </div>

          <p className="mt-12 text-center lg:text-left text-[11px] text-[#666] leading-relaxed font-medium max-w-xs mx-auto lg:mx-0">
            By authenticating, you authorize Emitto to securely track your repository signals. <br className="hidden lg:block"/>
            <span className="flex items-center justify-center lg:justify-start gap-1 mt-2 text-[#888]">
              <ShieldCheck size={12} className="text-[#00FF88]" /> Secure OAuth 2.0 Verification
            </span>
          </p>
        </motion.div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center text-white font-mono text-xs tracking-widest">LOADING CONSOLE...</div>}>
      <LoginContent />
    </Suspense>
  );
}
