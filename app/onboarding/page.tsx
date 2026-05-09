'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettings, saveSettings, Settings } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { ArrowRight, CheckCircle, GitMerge, Sparkles, Terminal, Code, Cpu } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      if (s) {
        if (s.onboarding_completed) {
           router.push('/dashboard');
        } else {
           setSettings(s);
           setLoading(false);
        }
      }
    });
  }, [router]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const handleFinish = async () => {
    setSaving(true);
    
    try {
      // Auto-extract GitHub URL from session metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toastError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const githubUrl = user?.user_metadata?.preferred_username 
        ? `https://github.com/${user.user_metadata.preferred_username}` 
        : settings.github_url;

      await saveSettings({ 
        ...settings, 
        github_url: githubUrl,
        onboarding_completed: true 
      });
      
      success('Neural identity synchronized. Welcome to Emitto.');
      router.push('/dashboard');
    } catch (e: any) {
      toastError(e.message || 'Calibration failed. Please try again.');
      setSaving(false);
    }
  };

  if (loading) return null;

  const steps = [
    { id: 1, label: 'Identity' },
    { id: 2, label: 'Signals' },
    { id: 3, label: 'Persona' },
    { id: 4, label: 'Deploy' }
  ];

  return (
    <div style={{ 
      minHeight: '100dvh', 
      background: '#050505', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'clamp(20px, 5vw, 40px)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Architectural Background */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 10 }}>
        
        {/* Progress System */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48, gap: 12 }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ flex: 1, position: 'relative' }}>
              <div style={{ 
                height: 3, 
                background: step >= s.id ? '#00FF88' : 'rgba(255,255,255,0.05)', 
                borderRadius: 2,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: step >= s.id ? '0 0 15px rgba(0,255,136,0.3)' : 'none'
              }} />
              <div style={{ 
                marginTop: 10, 
                fontSize: 9, 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '0.15em',
                color: step >= s.id ? '#00FF88' : '#333',
                transition: 'color 0.4s ease'
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          background: '#0A0A0A', 
          border: '1px solid rgba(255,255,255,0.05)', 
          padding: 'clamp(32px, 6vw, 56px)', 
          borderRadius: 2,
          position: 'relative',
          minHeight: 480,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
        }}>
          {/* Decorative Corner */}
          <div style={{ position: 'absolute', top: -1, right: -1, width: 40, height: 40, borderTop: '1px solid #00FF88', borderRight: '1px solid #00FF88', pointerEvents: 'none' }} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>Initialize Identity.</h2>
                <p style={{ color: '#666', fontSize: 15, marginBottom: 40, fontWeight: 500 }}>Define the core signal of your developer persona.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, display: 'block' }}>Legal Handle</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', color: 'white', fontSize: 16, outline: 'none', borderRadius: 0, fontFamily: 'inherit' }}
                      placeholder="e.g. Satoshi Nakamoto" 
                      value={settings.name || ''} 
                      onChange={e => setSettings({...settings, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, display: 'block' }}>Primary Designation</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', background: '#050505', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', color: 'white', fontSize: 16, outline: 'none', borderRadius: 0, fontFamily: 'inherit' }}
                      placeholder="e.g. Neural Architecture Lead" 
                      value={settings.title || ''} 
                      onChange={e => setSettings({...settings, title: e.target.value})} 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleNext} 
                  disabled={!settings.name || !settings.title} 
                  style={{ width: '100%', height: 64, background: 'white', color: 'black', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', border: 'none', marginTop: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all 0.2s ease', opacity: (!settings.name || !settings.title) ? 0.3 : 1 }}
                >
                  NEXT PHASE <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>Mission Goal.</h2>
                <p style={{ color: '#666', fontSize: 15, marginBottom: 40, fontWeight: 500 }}>What is the primary objective for your brand engine?</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28, flex: 1 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, display: 'block' }}>Deployment Objective</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { id: 'hired', label: 'ELITE RECRUITMENT', desc: 'Optimize content to attract FAANG & high-growth startups.' },
                        { id: 'freelance', label: 'CLIENT ACQUISITION', desc: 'Focus on authority and social proof for high-ticket consulting.' }
                      ].map(g => (
                        <button 
                          key={g.id} 
                          onClick={() => setSettings({...settings, goal: g.id as any})} 
                          style={{ padding: 24, border: '1px solid', textAlign: 'left', borderColor: settings.goal === g.id ? '#00FF88' : 'rgba(255,255,255,0.05)', background: settings.goal === g.id ? 'rgba(0,255,136,0.05)' : '#050505', color: settings.goal === g.id ? '#00FF88' : '#444', cursor: 'pointer' }}
                        >
                          <div style={{ fontSize: 11, fontWeight: 900, color: settings.goal === g.id ? '#00FF88' : 'white', marginBottom: 4 }}>{g.label}</div>
                          <div style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>{g.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                  <button onClick={handleBack} style={{ flex: 1, height: 64, background: 'transparent', color: '#444', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BACK</button>
                  <button onClick={handleNext} disabled={!settings.goal} style={{ flex: 2, height: 64, background: 'white', color: 'black', fontWeight: 900, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: !settings.goal ? 0.3 : 1 }}>CONTINUE</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>Neural Tone.</h2>
                <p style={{ color: '#666', fontSize: 15, marginBottom: 40, fontWeight: 500 }}>Calibrate the voice of your brand synthesizer.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  {[
                    { id: 'Technical & Direct', label: 'THE ARCHITECT', desc: 'Minimalist, data-driven, hard facts.' },
                    { id: 'Provocative & Bold', label: 'THE DISRUPTOR', desc: 'Contrarian, high-energy, opinionated.' },
                  ].map(v => (
                    <div 
                      key={v.id} 
                      onClick={() => setSettings({...settings, voice_description: v.id})} 
                      style={{ padding: 24, border: '1px solid', borderColor: settings.voice_description === v.id ? '#00FF88' : 'rgba(255,255,255,0.05)', background: settings.voice_description === v.id ? 'rgba(0,255,136,0.05)' : '#050505', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: settings.voice_description === v.id ? '#00FF88' : 'white', letterSpacing: '0.1em' }}>{v.label}</span>
                        {settings.voice_description === v.id && <CheckCircle size={14} color="#00FF88" />}
                      </div>
                      <div style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{v.desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
                  <button onClick={handleBack} style={{ flex: 1, height: 64, background: 'transparent', color: '#444', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em' }}>BACK</button>
                  <button onClick={handleNext} disabled={!settings.voice_description} style={{ flex: 2, height: 64, background: 'white', color: 'black', fontWeight: 900, border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: !settings.voice_description ? 0.3 : 1 }}>FINALIZE</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                {saving ? (
                   <>
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ marginBottom: 32, color: '#00FF88' }}>
                       <Cpu size={64} strokeWidth={1} />
                     </motion.div>
                     <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Synchronizing.</h2>
                     <p style={{ color: '#00FF88', fontSize: 11, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Building neural weights...</p>
                   </>
                ) : (
                   <>
                     <div style={{ marginBottom: 32, color: '#00FF88' }}><CheckCircle size={80} strokeWidth={1} /></div>
                     <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.06em', marginBottom: 12 }}>Systems Ready.</h2>
                     <p style={{ color: '#666', fontSize: 16, marginBottom: 40, maxWidth: 320, lineHeight: 1.6 }}>Your brand engine has been calibrated. You are now authorized to deploy.</p>
                     <button 
                      onClick={handleFinish} 
                      style={{ width: '100%', height: 72, background: '#00FF88', color: 'black', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 0 40px rgba(0,255,136,0.2)' }}
                     >
                       <Sparkles size={20} /> ENTER CONTROL CENTER
                     </button>
                   </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Console Metadata */}
        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF88', boxShadow: '0 0 10px #00FF88' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Auth Verified</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#222', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            ID: {settings.name?.substring(0, 8) || 'GUEST'}_OS_2026
          </div>
        </div>
      </div>
    </div>
  );
}

