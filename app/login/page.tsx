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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGitHubLogin = async () => {
    setLoading(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo read:user user:email',
      },
    });
    if (error) {
      toastError(error.message || 'Identity verification failed.');
      setStatus({ type: 'error', message: error.message });
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', width: '100%', display: 'flex', flexDirection: 'column', background: '#050505', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @media (min-width: 1024px) {
          .login-wrapper { flex-direction: row !important; }
          .login-left-panel { display: flex !important; }
          .login-right-panel { width: 50% !important; }
          .login-mobile-logo { display: none !important; }
        }
        .login-left-panel { display: none; }
        .login-right-panel { width: 100%; }
      `}</style>

      {/* LEFT PANEL — Brand Architecture (desktop only) */}
      <div
        className="login-left-panel"
        style={{ width: '50%', position: 'relative', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(40px, 6vw, 64px)', borderRight: '1px solid rgba(255,255,255,0.05)', background: '#0A0A0A' }}
      >
        {/* Ambient glow */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '140%', height: '140%', background: 'radial-gradient(ellipse at center, rgba(0,204,255,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '100%', height: '100%', background: 'radial-gradient(ellipse at center, rgba(0,255,136,0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        </div>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00CCFF, #00FF88)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(0,255,136,0.3)' }}>
            <Code size={20} color="#000" strokeWidth={3} />
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em' }}>Emitto.</span>
        </div>

        {/* Main copy */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, marginTop: 40 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'white', marginBottom: 24 }}>
              The world&apos;s first{' '}<br />
              <span style={{ background: 'linear-gradient(90deg, #00CCFF, #00FF88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                commit-to-content
              </span>{' '}engine.
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ color: '#888', fontSize: 17, fontWeight: 500, lineHeight: 1.7, maxWidth: 420 }}
          >
            Connect your repositories. Synthesize elite technical narratives. Build a billionaire-tier developer brand on autopilot.
          </motion.p>

          {/* Social proof */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ marginTop: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #0A0A0A', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i > 1 ? -12 : 0, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                  <div style={{ color: '#666' }}>
                    <GitHubIcon size={16} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#666' }}>
              <span style={{ color: 'white' }}>10,000+</span> commits synthesized today
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 24, fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          <span>© 2026 Emitto</span>
          <span>Status: <span style={{ color: '#00FF88' }}>Operational</span></span>
        </div>
      </div>

      {/* RIGHT PANEL — Auth Console */}
      <div
        className="login-right-panel login-wrapper"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 6vw, 64px) clamp(20px, 5vw, 48px)', minHeight: '100dvh', position: 'relative' }}
      >
        {/* Mobile logo */}
        <div className="login-mobile-logo" style={{ position: 'absolute', top: 28, left: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00CCFF, #00FF88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Code size={17} color="#000" strokeWidth={3} />
          </div>
          <span style={{ color: 'white', fontWeight: 900, fontSize: 20, letterSpacing: '-0.03em' }}>Emitto.</span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Heading */}
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: 10 }}>Welcome back</h2>
            <p style={{ color: '#888', fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>Log in to your Emitto dashboard to manage your fleet.</p>
          </div>

          {/* Status banner */}
          {status && (
            <div style={{ borderRadius: 12, padding: '14px 18px', marginBottom: 28, fontSize: 13, fontWeight: 600, border: `1px solid ${status.type === 'error' ? 'rgba(255,68,68,0.2)' : 'rgba(0,255,136,0.2)'}`, background: status.type === 'error' ? 'rgba(255,68,68,0.08)' : 'rgba(0,255,136,0.08)', color: status.type === 'error' ? '#FF4444' : '#00FF88' }}>
              {status.message}
            </div>
          )}

          {/* Auth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* GitHub */}
            <button
              onClick={handleGitHubLogin}
              disabled={loading}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', height: 60, borderRadius: 14, background: 'white', color: '#000', fontWeight: 700, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(255,255,255,0.08)' }}
            >
              {loading ? (
                <span style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 800 }}>Synchronizing...</span>
              ) : (
                <>
                  <GitHubIcon size={22} />
                  <span>Continue with GitHub</span>
                  <ArrowRight size={18} style={{ position: 'absolute', right: 20, opacity: 0.5 }} />
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '4px 0', opacity: 0.4 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
              <span style={{ fontSize: 10, color: 'white', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
            </div>

            {/* Demo */}
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', height: 56, borderRadius: 14, background: '#111', color: 'white', fontWeight: 700, fontSize: 15, border: '1px solid rgba(255,255,255,0.08)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease' }}
            >
              <Zap size={17} style={{ color: '#00CCFF' }} />
              Explore Demo Mode
            </button>
          </div>

          {/* Trust */}
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#555', lineHeight: 1.8, fontWeight: 500 }}>
              By authenticating, you authorize Emitto to securely track your repository signals.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, fontSize: 11, color: '#888', fontWeight: 600 }}>
              <ShieldCheck size={13} style={{ color: '#00FF88' }} />
              Secure OAuth 2.0 Verification
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, letterSpacing: '0.2em' }}>
        LOADING CONSOLE...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
