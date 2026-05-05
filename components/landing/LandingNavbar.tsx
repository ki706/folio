'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, ChevronRight, Play } from 'lucide-react';

export default function LandingNavbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDemo = async () => {
    // Demo account logic
    router.push('/login?demo=true');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(13, 13, 13, 0.8)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent'
    }}>
      <div style={{ width: '100%', maxWidth: 1200, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div className="app-logo" style={{ fontSize: 28, letterSpacing: '-0.05em' }}>folio</div>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
             <Link href="#features" className="hover-white">Platform</Link>
             <Link href="#vision" className="hover-white">Vision</Link>
             <Link href="#pricing" className="hover-white">Pricing</Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={handleDemo} className="btn-ghost-premium" style={{ height: 44, padding: '0 20px', fontSize: 13 }}>
            <Play size={14} fill="currentColor" /> Live Demo
          </button>
          <Link href="/login" className="btn-premium" style={{ height: 44, padding: '0 24px', fontSize: 13 }}>
            Get Started <ChevronRight size={14} />
          </Link>
        </div>
      </div>
      <style>{`
        .hover-white { transition: color 0.2s; }
        .hover-white:hover { color: var(--white); }
      `}</style>
    </nav>
  );
}
