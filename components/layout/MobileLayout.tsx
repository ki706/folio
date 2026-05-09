'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Briefcase, Sparkles, Clock, Settings,
  LogOut, TrendingUp, Radio, Menu, X,
} from 'lucide-react';
import { getNotifications, getSettings, Settings as UserSettings } from '@/lib/store';
import { supabase } from '@/lib/supabase';

/** Returns true when viewport is >= 1024px */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1024px)').matches;
    }
    return false;
  });
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

const NAV_ITEMS = [
  { label: 'Home',      icon: Home,       href: '/' },
  { label: 'Projects',  icon: Briefcase,  href: '/projects' },
  { label: 'Generate',  icon: Sparkles,   href: '/generate' },
  { label: 'Trends',    icon: Radio,      href: '/trends' },
  { label: 'Analytics', icon: TrendingUp, href: '/analytics' },
  { label: 'History',   icon: Clock,      href: '/history' },
  { label: 'Settings',  icon: Settings,   href: '/settings' },
];

// 5 items shown in dock
const DOCK_ITEMS = [
  { label: 'Home',     icon: Home,       href: '/' },
  { label: 'Generate', icon: Sparkles,   href: '/generate' },
  { label: 'Trends',   icon: Radio,      href: '/trends' },
  { label: 'Projects', icon: Briefcase,  href: '/projects' },
  { label: 'Settings', icon: Settings,   href: '/settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // ── Synchronous session detection (no network, no flash) ──
  // Reads cookies immediately to decide whether to show the app shell.
  // Supabase SSR stores the token as sb-[ref]-auth-token in cookies.
  const [hasSessionCookie] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      const isDemo = document.cookie.includes('emitto_demo_mode=true');
      const hasToken = document.cookie.includes('-auth-token');
      return isDemo || hasToken;
    }
    return false; // SSR default: don't show shell (server handles routing)
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof document !== 'undefined') {
      const demoCookie = document.cookie.split('; ').find(row => row.startsWith('emitto_demo_mode='));
      if (demoCookie?.split('=')[1] === 'true') return 'demo@emitto.dev';
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof document !== 'undefined') {
      const demoCookie = document.cookie.split('; ').find(row => row.startsWith('emitto_demo_mode='));
      if (demoCookie?.split('=')[1] === 'true') return false;
    }
    return true;
  });

  // Close drawer on route change (mobile only)
  useEffect(() => { 
    if (!isDesktop && drawerOpen) {
      const id = requestAnimationFrame(() => setDrawerOpen(false));
      return () => cancelAnimationFrame(id);
    }
  }, [pathname, drawerOpen, isDesktop]);

  // Close drawer on ESC (mobile only)
  useEffect(() => {
    if (isDesktop) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDesktop]);

  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
      
      const [notifs, settings] = await Promise.all([getNotifications(), getSettings()]);
      setUnreadCount(notifs.filter(n => !n.is_read).length);
      setUserSettings(settings);

      if (settings && settings.onboarding_completed === false && pathname !== '/onboarding') {
        router.push('/onboarding');
      }
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    fetchData();
    // Poll every 60s — not 15s. Reduces Supabase calls by 4x in dev.
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSignOut = async () => {
    // Clear Demo state explicitly
    document.cookie = "emitto_demo_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('emitto_demo_mode');
    
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const initials = userSettings?.name
    ? userSettings.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail ? userEmail[0].toUpperCase() : 'U';

  const isDemo = userEmail === 'demo@emitto.dev';

  // ── Shell guard ──
  // 1. Never show shell on auth/onboarding/landing pages
  if (
    pathname === '/login' || 
    pathname === '/onboarding' || 
    pathname === '/' || 
    pathname.startsWith('/landing')
  ) {
    return (
      <>
        {children}
        {/* Render Mobile Dock for unauthenticated/landing pages too */}
        <nav className="mobile-dock md:hidden" style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          height: 'var(--dock-height)',
          background: '#0A0A0A',
          borderTop: '1px solid var(--border)',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 110,
        }}>
          {DOCK_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dock-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ position: 'relative' }}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="dock-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </>
    );
  }

  // If loading, we still show the shell structure if we suspect we're logged in
  // but for now, we'll just let the data flow.

  return (
    <div className="app-container">

      {/* ── Hamburger toggle (mobile/tablet only) ── */}
      {!isDesktop && (
        <button
          className="sidebar-toggle"
          onClick={() => setDrawerOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* ── Sidebar backdrop (mobile only, when drawer is open) ── */}
      {!isDesktop && drawerOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Sidebar ── */}
      {/* On desktop: no class needed (always visible via CSS). On mobile: drawer-open/closed controls it. */}
      <aside className={`sidebar${!isDesktop ? (drawerOpen ? ' drawer-open' : ' drawer-closed') : ''}`}>
        {/* Logo */}
        <div style={{ padding: '0 14px', marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="app-logo" style={{ fontSize: 22 }}>emitto</div>
            <p style={{ fontSize: 10, color: 'var(--muted-dark)', marginTop: 4, letterSpacing: '0.06em', fontWeight: 700 }}>
              BROADCAST ENGINE
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item${isActive ? ' active' : ''}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.label === 'Home' && unreadCount > 0 && (
                  <span style={{
                    marginLeft: 'auto', width: 7, height: 7,
                    borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 8px var(--green-glow)',
                    flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div style={{ padding: '0 6px', marginTop: 'auto', paddingTop: 16 }}>
          <div style={{
            borderRadius: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border)',
            padding: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'var(--accent-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: 800, fontSize: 12, flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--white)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {isDemo ? 'Demo Account' : (userSettings?.name || 'Studio User')}
                </p>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {isDemo ? 'Read-only Access' : 'Developer'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="btn-ghost-premium"
              style={{ width: '100%', height: 34, fontSize: 12, gap: 8, color: 'var(--muted)' }}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="main-content">
        {children}
      </main>

      {/* ── Mobile Dock (Restored) ── */}
      <nav className="mobile-dock md:hidden" style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: 'var(--dock-height)',
        background: '#0A0A0A',
        borderTop: '1px solid var(--border)',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 110,
      }}>
        {DOCK_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dock-item ${isActive ? 'active' : ''}`}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.label === 'Home' && unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--green)',
                    boxShadow: '0 0 8px var(--green-glow)',
                  }} />
                )}
              </div>
              <span className="dock-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
