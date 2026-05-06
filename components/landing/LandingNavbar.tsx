'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Play, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Network', href: '/trends' },
  { label: 'Architecture',   href: '/projects' },
  { label: 'Community',  href: '/landing' },
];

export default function LandingNavbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleDemo = () => { setMobileOpen(false); router.push('/login?demo=true'); };
  const handleSignIn = () => { setMobileOpen(false); router.push('/login'); };

  return (
    <>
      {/* ── Desktop / mobile nav bar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(3,3,3,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}>
        <div style={{
          width: '100%', maxWidth: 1200,
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div className="app-logo" style={{ fontSize: 26, letterSpacing: '-0.06em', flexShrink: 0 }}>
            emitto
          </div>

          {/* Desktop nav links */}
          <div style={{
            display: 'flex', gap: 28, fontSize: 14,
            color: 'var(--muted)', fontWeight: 500,
          }} className="desktop-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={{ transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-cta">
            <button onClick={handleDemo} className="btn-ghost-premium"
              style={{ height: 42, padding: '0 18px', fontSize: 13, gap: 7 }}>
              <Play size={13} fill="currentColor" /> Live Demo
            </button>
            <Link href="/login" className="btn-premium"
              style={{ height: 42, padding: '0 22px', fontSize: 13 }}>
              Get Started <ChevronRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            className="mobile-hamburger"
            style={{
              width: 42, height: 42,
              borderRadius: 11,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              color: 'var(--white)',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 72, left: 0, right: 0,
              background: 'rgba(6,6,6,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid var(--border)',
              zIndex: 99,
              padding: '28px 24px 36px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'block', padding: '14px 4px',
                  fontSize: 22, fontWeight: 700,
                  color: 'var(--white)',
                  letterSpacing: '-0.03em',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </motion.a>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
              <button onClick={handleSignIn} className="btn-premium"
                style={{ width: '100%', height: 54, fontSize: 16 }}>
                Get Started <ArrowRight size={18} />
              </button>
              <button onClick={handleDemo} className="btn-ghost-premium"
                style={{ width: '100%', height: 54, fontSize: 16 }}>
                <Play size={15} fill="currentColor" /> Try Live Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .desktop-cta { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
