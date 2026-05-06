'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import AmbientBackground from '@/components/landing/AmbientBackground';
import { WebhookMockup, SocialMockup, VoiceMockup } from '@/components/landing/AnimatedMockups';
import { ArrowRight, Zap, Globe, Cpu, Radio, GitMerge, MessageCircle, Briefcase } from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 60, damping: 12 } },
};

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen text-[#F5F5F0] overflow-hidden selection:bg-[#00FF88]/20 selection:text-white">
      <AmbientBackground />
      <LandingNavbar />

      <main className="relative z-10 pb-[100px] px-4 sm:px-6" style={{ paddingTop: 'clamp(100px, 18vw, 160px)' }}>

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center max-w-[960px] mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
            style={{
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.12)',
              fontSize: 10, fontWeight: 800,
              color: '#00FF88',
              letterSpacing: '0.18em',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <Radio size={11} className="animate-pulse" /> Broadcasting Live from the Edge
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            style={{
              fontSize: 'clamp(40px, 8.5vw, 96px)',
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 0.92,
              marginBottom: 28,
            }}
          >
            <motion.span variants={FADE_UP} className="block">Turn commits into</motion.span>
            <motion.span variants={FADE_UP} className="text-gradient block pb-3">Social Capital.</motion.span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial="hidden" animate="show" variants={FADE_UP}
            style={{
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              color: '#888',
              maxWidth: 600,
              marginBottom: 44,
              lineHeight: 1.65,
            }}
          >
            The world&apos;s first commit-to-content engine. Automatically transform your
            pushes into high-resonance LinkedIn and X threads with zero friction.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            style={{ width: '100%' }}
            className="flex flex-col sm:flex-row max-w-[420px] sm:max-w-[500px] gap-3 sm:gap-4 mx-auto"
          >
            <button
              onClick={() => router.push('/login')}
              className="btn-premium"
              style={{ height: 56, fontSize: 15, width: '100%' }}
            >
              Deploy to Production <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push('/login?demo=true')}
              className="btn-ghost-premium"
              style={{ height: 56, fontSize: 15, width: '100%' }}
            >
              View Live Demo
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 1 }}
            style={{
              marginTop: 60,
              paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.05)',
              width: '100%',
              maxWidth: 540,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: '#444', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Trusted by engineers at
            </span>
            <div style={{
              display: 'flex',
              gap: 'clamp(16px, 4vw, 40px)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.35,
              filter: 'grayscale(1)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>
                <GitMerge size={20} /> Acme Corp
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>
                <Zap size={20} /> Linear
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>
                <Globe size={20} /> Vercel
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Bento Grid ── */}
        <section className="mt-[100px] sm:mt-[140px] max-w-[1200px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 'clamp(12px, 2vw, 20px)',
              gridAutoRows: 'minmax(180px, auto)',
            }}
          >

            {/* Main Feature: Webhook — full width on mobile, 8-col on desktop */}
            <motion.div
              variants={FADE_UP}
              className="glass-card bento-item hover-glow group bento-main"
              style={{
                gridColumn: 'span 12',
                position: 'relative',
                minHeight: 'clamp(300px, 50vw, 480px)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                padding: 'clamp(20px, 3vw, 40px)',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,255,136,0.04), transparent)',
                opacity: 0, transition: 'opacity 0.5s', borderRadius: 'inherit',
              }} className="card-hover-overlay" />
              <div style={{
                position: 'absolute', top: 'clamp(16px, 3vw, 32px)', right: 'clamp(16px, 3vw, 32px)',
                color: '#00FF88', background: 'rgba(0,255,136,0.1)',
                padding: 12, borderRadius: 16,
              }}>
                <Zap size={28} />
              </div>
              <WebhookMockup />
              <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', paddingTop: 220 }}>
                <h3 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, marginBottom: 10, letterSpacing: '-0.03em' }}>
                  Zero-Config Pipeline
                </h3>
                <p style={{ color: '#888', maxWidth: 420, lineHeight: 1.6, fontSize: 'clamp(14px, 1.5vw, 17px)' }}>
                  Folio listens to every push. The moment you commit, your next viral post is already being drafted.
                </p>
              </div>
            </motion.div>

            {/* Cross-Platform */}
            <motion.div
              variants={FADE_UP}
              className="glass-card bento-item hover-glow group bento-side"
              style={{
                gridColumn: 'span 12',
                position: 'relative',
                minHeight: 220,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 20, left: 20, color: '#00CCFF', background: 'rgba(0,204,255,0.1)', padding: 8, borderRadius: 12 }}>
                <Globe size={18} />
              </div>
              <SocialMockup />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Cross-Platform</h4>
                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.5 }}>One commit, perfectly tailored for every network.</p>
              </div>
            </motion.div>

            {/* Voice Cloning */}
            <motion.div
              variants={FADE_UP}
              className="glass-card bento-item hover-glow group bento-side"
              style={{
                gridColumn: 'span 12',
                position: 'relative',
                minHeight: 220,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 20, left: 20, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: 8, borderRadius: 12 }}>
                <Cpu size={18} />
              </div>
              <VoiceMockup />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.02em' }}>Voice Cloning</h4>
                <p style={{ color: '#888', fontSize: 13, lineHeight: 1.5 }}>Neural matching ensures every post sounds exactly like you.</p>
              </div>
            </motion.div>

            {/* Wide feature row */}
            <motion.div
              variants={FADE_UP}
              className="glass-card bento-item hover-glow group bento-wide"
              style={{
                gridColumn: 'span 12',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 24,
                padding: 'clamp(20px, 3vw, 40px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.04), transparent)',
                opacity: 0, transition: 'opacity 0.5s', borderRadius: 'inherit',
              }} />
              <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '4px 12px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 11, fontWeight: 700, color: '#aaa',
                  marginBottom: 16, letterSpacing: '0.05em',
                }}>
                  Mobile First
                </div>
                <h3 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.03em' }}>
                  Studio in your pocket
                </h3>
                <p style={{ color: '#888', fontSize: 'clamp(14px, 1.5vw, 17px)', maxWidth: 500, lineHeight: 1.65 }}>
                  Manage your entire engineering brand on the go. Approve drafts, monitor engagement,
                  and trigger broadcasts from iOS or Android.
                </p>
              </div>
              <div style={{
                width: 100, height: 100, flexShrink: 0,
                borderRadius: 28,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#8B5CF6', position: 'relative', zIndex: 1,
              }}>
                <Radio size={44} style={{ transition: 'transform 0.4s' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  border: '1px solid rgba(139,92,246,0.25)',
                  borderRadius: 28, animation: 'ping 2s ease-in-out infinite', opacity: 0.2,
                }} />
              </div>
            </motion.div>

          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 10,
        padding: 'clamp(32px, 5vw, 48px) 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        marginTop: 'clamp(40px, 8vw, 80px)',
      }}>
        <div className="app-logo" style={{ fontSize: 22, display: 'inline-block', marginBottom: 12 }}>folio</div>
        <p style={{ fontSize: 10, color: '#333', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          © 2026 Folio Broadcast Engine · All Rights Reserved
        </p>
      </footer>

      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.08); opacity: 0.1; }
        }
        .card-hover-overlay { border-radius: inherit; }
        .group:hover .card-hover-overlay { opacity: 1 !important; }

        /* Bento Grid on md+ */
        @media (min-width: 768px) {
          .bento-main { grid-column: span 8 !important; grid-row: span 2 !important; }
          .bento-side { grid-column: span 4 !important; }
          .bento-wide { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  );
}
