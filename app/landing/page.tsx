'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import AmbientBackground from '@/components/landing/AmbientBackground';
import { WebhookMockup, SocialMockup, VoiceMockup } from '@/components/landing/AnimatedMockups';
import { ArrowRight, Zap, Globe, Cpu, Radio, GitMerge, MessageCircle, Briefcase } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 10 } }
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-[#F5F5F0] overflow-hidden selection:bg-[#00FF88] selection:text-black">
      <AmbientBackground />
      <LandingNavbar />

      <main className="relative z-10 pt-[160px] pb-[120px] px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-[1000px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.1)] text-[11px] font-bold text-[#00FF88] tracking-widest mb-8 font-mono uppercase"
          >
            <Radio size={12} className="animate-pulse" /> Broadcasting Live from the Edge
          </motion.div>

          <motion.h1 
            initial="hidden" animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } }
            }}
            className="text-[clamp(48px,8vw,100px)] font-[900] tracking-[-0.04em] leading-[0.9] mb-8"
          >
            <motion.span variants={FADE_UP} className="block">Turn commits into</motion.span>
            <motion.span variants={FADE_UP} className="text-gradient block pb-2">Social Capital.</motion.span>
          </motion.h1>

          <motion.p 
            initial="hidden" animate="show" variants={FADE_UP}
            className="text-[clamp(18px,2vw,22px)] text-[#888] max-w-[640px] mb-12 leading-relaxed"
          >
            The world's first commit-to-content engine. Automatically transform your pushes into high-resonance LinkedIn and X threads with a zero-friction pipeline.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          >
            <button onClick={() => router.push('/login')} className="btn-premium w-full sm:w-auto h-14 px-8 text-[15px]">
              Deploy to Production <ArrowRight size={18} />
            </button>
            <button onClick={() => router.push('/login?demo=true')} className="btn-ghost-premium w-full sm:w-auto h-14 px-8 text-[15px]">
              View Live Demo
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 pt-10 border-t border-[rgba(255,255,255,0.05)] w-full max-w-[600px] flex flex-col items-center gap-6"
          >
            <span className="text-[11px] font-bold text-[#555] tracking-[0.2em] uppercase">Trusted by engineers at</span>
            <div className="flex gap-8 items-center justify-center opacity-40 grayscale mix-blend-screen">
              {/* Dummy SVGs to look like premium companies */}
              <div className="flex items-center gap-2 font-bold text-xl"><GitMerge size={24}/> Acme Corp</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Zap size={24}/> Linear</div>
              <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24}/> Vercel</div>
            </div>
          </motion.div>
        </section>

        {/* Bento Grid */}
        <section className="mt-[160px] max-w-[1200px] mx-auto">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(200px,auto)] gap-6"
          >
            
            {/* Main Feature: Webhook */}
            <motion.div variants={FADE_UP} className="glass-card hover-glow bento-item md:col-span-8 md:row-span-2 relative min-h-[400px] group flex flex-col justify-end p-8 md:p-10">
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,255,136,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-8 right-8 text-[#00FF88] bg-[rgba(0,255,136,0.1)] p-3 rounded-2xl"><Zap size={32} /></div>
              
              <WebhookMockup />

              <div className="relative z-10 mt-auto pt-48">
                <h3 className="text-3xl font-bold mb-3 tracking-tight">Zero-Config Pipeline</h3>
                <p className="text-[#888] max-w-[400px] text-lg leading-relaxed">Folio listens to every push. The moment you hit 'commit', your next viral post is already being drafted in the background.</p>
              </div>
            </motion.div>

            {/* Feature: Multi-channel */}
            <motion.div variants={FADE_UP} className="glass-card hover-glow bento-item md:col-span-4 relative min-h-[250px] group overflow-hidden">
               <div className="absolute top-6 left-6 text-[#00CCFF] bg-[rgba(0,204,255,0.1)] p-2 rounded-xl"><Globe size={20} /></div>
               <SocialMockup />
               <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-xl font-bold mb-2">Cross-Platform</h4>
                 <p className="text-[#888] text-sm">One commit perfectly tailored for each network automatically.</p>
               </div>
            </motion.div>

            {/* Feature: Neural Voice */}
            <motion.div variants={FADE_UP} className="glass-card hover-glow bento-item md:col-span-4 relative min-h-[250px] group overflow-hidden">
               <div className="absolute top-6 left-6 text-[#F59E0B] bg-[rgba(245,158,11,0.1)] p-2 rounded-xl"><Cpu size={20} /></div>
               <VoiceMockup />
               <div className="absolute bottom-6 left-6 right-6">
                 <h4 className="text-xl font-bold mb-2">Voice Cloning</h4>
                 <p className="text-[#888] text-sm">Neural matching ensures every post sounds exactly like you.</p>
               </div>
            </motion.div>

            {/* Feature: Mobile First */}
            <motion.div variants={FADE_UP} className="glass-card hover-glow bento-item md:col-span-12 flex flex-col md:flex-row items-center gap-10 p-8 md:p-12 mt-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-r from-[rgba(139,92,246,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="flex-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-xs font-medium text-[#ccc] mb-6">
                    Mobile First
                  </div>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">Studio in your pocket</h3>
                  <p className="text-[#888] text-lg max-w-[500px]">Manage your entire engineering brand on the go. Approve drafts, monitor engagement, and trigger broadcasts directly from iOS or Android.</p>
               </div>
               <div className="w-[120px] h-[120px] shrink-0 rounded-3xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#8B5CF6] relative z-10 shadow-2xl">
                  <Radio size={48} className="group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 border border-[rgba(139,92,246,0.3)] rounded-3xl animate-ping opacity-20" />
               </div>
            </motion.div>

          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 py-12 px-6 text-center border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.4)] backdrop-blur-md mt-24">
        <div className="app-logo text-2xl mb-4 font-mono">folio</div>
        <p className="text-[#444] text-[11px] font-mono tracking-widest uppercase">© 2026 FOLIO BROADCAST ENGINE • ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}
