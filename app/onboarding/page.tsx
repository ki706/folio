'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettings, saveSettings, Settings } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { ArrowRight, CheckCircle, GitMerge, Sparkles, Terminal } from 'lucide-react';
import AmbientBackground from '@/components/landing/AmbientBackground';

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
    await saveSettings({ ...settings, onboarding_completed: true });
    
    // Simulate some neural network calibration time for the "Aha" feeling
    setTimeout(() => {
      success('Neural identity synchronized. Welcome to Folio.');
      router.push('/dashboard');
    }, 2000);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-6 selection:bg-[#00FF88] selection:text-black">
      <AmbientBackground />

      <div className="w-full max-w-xl relative z-10">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-12">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= i ? 'bg-[#00FF88] shadow-[0_0_10px_rgba(0,255,136,0.3)]' : 'bg-[rgba(255,255,255,0.1)]'}`} />
           ))}
        </div>

        <div className="glass-card p-10 min-h-[400px] flex flex-col relative overflow-hidden bg-[rgba(10,10,10,0.6)]">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-1">
                <h2 className="text-3xl font-bold mb-2">Initialize Persona.</h2>
                <p className="text-[#888] mb-8">Let&apos;s define the core identity of your brand engine.</p>
                
                <div className="flex flex-col gap-5 flex-1">
                  <div>
                    <label className="text-xs font-bold text-[#888] uppercase tracking-widest mb-2 block">Developer Name</label>
                    <input type="text" className="input-premium" placeholder="e.g. Satoshi Nakamoto" 
                      value={settings.name || ''} onChange={e => setSettings({...settings, name: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#888] uppercase tracking-widest mb-2 block">Primary Title</label>
                    <input type="text" className="input-premium" placeholder="e.g. Senior Frontend Engineer" 
                      value={settings.title || ''} onChange={e => setSettings({...settings, title: e.target.value})} 
                    />
                  </div>
                </div>

                <button onClick={handleNext} disabled={!settings.name || !settings.title} className="btn-premium w-full mt-8 h-12">
                  Continue <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-1">
                <div className="absolute top-0 right-0 p-8 text-[#00CCFF] opacity-20"><GitMerge size={100} /></div>
                <h2 className="text-3xl font-bold mb-2">Connect Output.</h2>
                <p className="text-[#888] mb-8 relative z-10">Where should we route your synthesized content?</p>
                
                <div className="flex flex-col gap-5 flex-1 relative z-10">
                  <div>
                    <label className="text-xs font-bold text-[#888] uppercase tracking-widest mb-2 flex items-center gap-2"><GitMerge size={14}/> GitHub URL</label>
                    <input type="text" className="input-premium" placeholder="https://github.com/username" 
                      value={settings.github_url || ''} onChange={e => setSettings({...settings, github_url: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#888] uppercase tracking-widest mb-2 block">Primary Goal</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['hired', 'freelance'].map(g => (
                        <button key={g} onClick={() => setSettings({...settings, goal: g as any})} className={`p-4 rounded-xl border text-sm font-bold uppercase tracking-widest transition-all ${settings.goal === g ? 'border-[#00CCFF] bg-[rgba(0,204,255,0.1)] text-[#00CCFF]' : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] text-[#888]'}`}>
                          Get {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 relative z-10">
                  <button onClick={handleBack} className="btn-ghost-premium px-6 h-12">Back</button>
                  <button onClick={handleNext} className="btn-premium flex-1 h-12">Connect <ArrowRight size={16} /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col flex-1">
                <h2 className="text-3xl font-bold mb-2">Define Voice.</h2>
                <p className="text-[#888] mb-8">How should the neural engine sound when it speaks for you?</p>
                
                <div className="flex flex-col gap-4 flex-1">
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'Technical & Direct (The Builder)', desc: 'No fluff. Code snippets, architecture, hard facts.' },
                      { id: 'Provocative & Bold (The Hot Take)', desc: 'Contrarian opinions, calling out bad engineering practices.' },
                    ].map(v => (
                      <div key={v.id} onClick={() => setSettings({...settings, voice_description: v.id})} className={`p-4 rounded-xl border cursor-pointer transition-all ${settings.voice_description === v.id ? 'border-[#F59E0B] bg-[rgba(245,158,11,0.1)]' : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'}`}>
                        <div className={`font-bold text-sm ${settings.voice_description === v.id ? 'text-[#F59E0B]' : 'text-white'}`}>{v.id}</div>
                        <div className="text-xs text-[#888] mt-1">{v.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={handleBack} className="btn-ghost-premium px-6 h-12">Back</button>
                  <button onClick={handleNext} disabled={!settings.voice_description} className="btn-premium flex-1 h-12">Finalize <ArrowRight size={16} /></button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col flex-1 items-center justify-center text-center">
                {saving ? (
                   <>
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="mb-6 text-[#00FF88]">
                       <Terminal size={48} />
                     </motion.div>
                     <h2 className="text-2xl font-bold mb-2">Synthesizing Profile...</h2>
                     <p className="text-[#00FF88] text-sm font-mono animate-pulse">Initializing neural weights & connecting webhooks</p>
                   </>
                ) : (
                   <>
                     <div className="mb-6 text-[#00FF88]"><CheckCircle size={64} /></div>
                     <h2 className="text-3xl font-bold mb-4">Systems Online.</h2>
                     <p className="text-[#888] mb-8 max-w-[280px]">Your brand engine is fully initialized and ready to deploy.</p>
                     <button onClick={handleFinish} className="btn-premium w-full h-14 text-base shadow-[0_0_30px_rgba(0,255,136,0.2)]">
                       <Sparkles size={18} /> Enter Dashboard
                     </button>
                   </>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
