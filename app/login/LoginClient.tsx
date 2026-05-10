'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Zap, ShieldCheck, Code, ArrowRight } from 'lucide-react';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { motion } from 'framer-motion';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const { error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const router = useRouter();

  const handleDemoLogin = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@emitto.dev',
        password: 'emitto_demo_2026',
      });
      if (error) {
        document.cookie = 'emitto_demo_mode=true; path=/; max-age=3600; SameSite=Lax';
        localStorage.setItem('emitto_demo_mode', 'true');
      } else {
        document.cookie = 'emitto_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('emitto_demo_mode');
      }
      router.push('/');
      router.refresh();
    } catch {
      toastError('Neural link timed out. Defaulting to local simulation.');
      document.cookie = 'emitto_demo_mode=true; path=/; max-age=3600; SameSite=Lax';
      localStorage.setItem('emitto_demo_mode', 'true');
      router.push('/');
      router.refresh();
    }
  }, [router, toastError]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (searchParams.get('demo') === 'true' && isMounted) {
        handleDemoLogin();
      }
    };
    init();
    return () => { isMounted = false; };
  }, [handleDemoLogin, searchParams]);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo read:user user:email',
      }
    });
    if (error) {
      toastError(error.message || 'Identity verification failed.');
      setStatus({ type: 'error', message: error.message });
      setLoading(false);
    }
  };

  return (
    <div className="login-shell" style={{ minHeight: '100dvh', width: '100%', display: 'flex', flexDirection: 'column', background: '#050505', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @media (min-width: 1024px) {
          .login-shell { flex-direction: row !important; }
          .login-left-panel { display: flex !important; }
          .login-right-panel { width: 50% !important; }
          .login-mobile-logo { display: none !important; }
        }
        .login-left-panel { display: none; }
        .login-right-panel { width: 100%; }
      `}</style>

      {/* LEFT PANEL */}
      <div className="login-left-panel" style={{ width: '50%', position: 'relative', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(40px, 6vw, 64px)', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#0A0A0A' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(ellipse at center, rgba(0,204,255,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00CCFF, #00FF88)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(0,255,136,0.3)' }}>
            <Code size={20} color="#000" strokeWidth={3} />
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em' }}>Emitto.</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, marginTop: 40 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'white', marginBottom: 24 }}>
              The definitive <br />
              <span style={{ background: 'linear-gradient(90deg, #00CCFF, #00FF88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                commit to content
              </span> engine.
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ color: '#888', fontSize: 17, fontWeight: 500, lineHeight: 1.7, maxWidth: 420 }}>
            Connect your repositories. Synthesize elite technical narratives. Build a billionaire-tier developer brand on autopilot.
          </motion.p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 24, fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <span>© 2026 Emitto</span>
          <span>Status: <span style={{ color: '#00FF88' }}>Operational</span></span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 6vw, 64px) clamp(20px, 5vw, 48px)', minHeight: '100dvh', position: 'relative' }}>
        <div className="login-mobile-logo" style={{ position: 'absolute', top: 28, left: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00CCFF, #00FF88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code size={17} color="#000" strokeWidth={3} />
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 20, letterSpacing: '-0.03em' }}>Emitto.</span>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: 10 }}>Welcome back</h2>
            <p style={{ color: '#888', fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>Log in to your Emitto dashboard to manage your fleet.</p>
          </div>
          {status && (
            <div style={{ borderRadius: 12, padding: '14px 18px', marginBottom: 28, fontSize: 13, fontWeight: 600, border: `1px solid ${status.type === 'error' ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.2)'}`, background: status.type === 'error' ? 'rgba(255,68,68,0.08)' : 'rgba(0,255,136,0.08)', color: status.type === 'error' ? '#FF4444' : '#00FF88' }}>
              {status.message}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button onClick={handleGitHubLogin} disabled={loading} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', height: 60, borderRadius: 14, background: 'white', color: '#000', fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease' }}>
              {loading ? <span>Synchronizing...</span> : (
                <>
                  <GitHubIcon size={22} />
                  <span>Continue with GitHub</span>
                  <ArrowRight size={18} style={{ position: 'absolute', right: 20, opacity: 0.5 }} />
                </>
              )}
            </button>
            {(process.env.NEXT_PUBLIC_ALLOW_DEMO === 'true' || searchParams.get('demo') === 'true') && (
              <button onClick={handleDemoLogin} disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', height: 56, borderRadius: 14, background: '#111', color: 'white', fontWeight: 700, fontSize: 15, border: '1px solid rgba(255,255,255,0.08)', cursor: loading ? 'not-allowed' : 'pointer' }}>
                <Zap size={17} style={{ color: '#00CCFF' }} />
                Explore Demo Mode
              </button>
            )}
          </div>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#444', lineHeight: 1.6, maxWidth: 340, margin: '0 auto', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ShieldCheck size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: 'var(--green)' }} />
              Security Node: Secure <span style={{ color: '#888' }}>GitHub OAuth</span> protocol.
            </p>
            <p style={{ fontSize: 10, color: '#333', marginTop: 8, lineHeight: 1.5, maxWidth: 300, margin: '8px auto 0' }}>
              Repository permissions are used exclusively to configure automated commit listeners (webhooks).
            </p>
          </div>
        </motion.div>
      </div>

      {/* FULL SCREEN TRANSITION OVERLAY */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#030303',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24
          }}
        >
          <div className="animate-pulse" style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #00CCFF, #00FF88)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,255,136,0.3)' }}>
            <Code size={32} color="#000" strokeWidth={3} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: 'var(--green)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8 }}>Neural Sync In Progress</p>
            <p style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>Calibrating broadast environment...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
