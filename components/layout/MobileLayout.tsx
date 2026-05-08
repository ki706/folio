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

const NAV_ITEMS = [
  { label: 'Home',      icon: Home,       href: '/' },
  { label: 'Projects',  icon: Briefcase,  href: '/projects' },
  { label: 'Generate',  icon: Sparkles,   href: '/generate' },
  { label: 'Trends',    icon: Radio,      href: '/trends' },
  { label: 'Analytics', icon: TrendingUp, href: '/analytics' },
  { label: 'History',   icon: Clock,      href: '/history' },
  { label: 'Settings',  icon: Settings,   href: '/settings' },
];

// 5 items shown in dock (most important)
const DOCK_ITEMS = [
  { label: 'Home',     icon: Home,      href: '/' },
  { label: 'Projects', icon: Briefcase, href: '/projects' },
  { label: 'Generate', icon: Sparkles,  href: '/generate' },
  { label: 'Trends',   icon: Radio,     href: '/trends' },
  { label: 'Settings', icon: Settings,  href: '/settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { 
    if (drawerOpen) {
      const t = setTimeout(() => setDrawerOpen(false), 0);
      return () => clearTimeout(t);
    }
  }, [pathname, drawerOpen]);

  // Close drawer on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserEmail(user?.email || null);

    const [notifs, settings] = await Promise.all([getNotifications(), getSettings()]);
    setUnreadCount(notifs.filter(n => !n.is_read).length);
    setUserSettings(settings);

    if (settings && settings.onboarding_completed === false && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [pathname, router]);

  useEffect(() => {
    // Check for demo mode cookie synchronously
    const demoCookie = document.cookie.split('; ').find(row => row.startsWith('emitto_demo_mode='));
    if (demoCookie?.split('=')[1] === 'true') {
      setUserEmail('demo@emitto.dev');
    }

    const run = async () => { await fetchData(); };
    run();
    const interval = setInterval(fetchData, 15000);
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

  // Don't render shell on auth pages
  if (pathname === '/login' || pathname === '/onboarding') return <>{children}</>;

  // Detect if we are on the landing page (root path with no auth/demo)
  const isLanding = pathname === '/' && !userEmail && !isDemo;
  if (isLanding) return <>{children}</>;

  return (
    <div className="app-container">

      {/* ── Hamburger toggle (mobile only) ── */}
      <button
        className="sidebar-toggle"
        onClick={() => setDrawerOpen(o => !o)}
        aria-label="Toggle navigation"
      >
        {drawerOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* ── Sidebar backdrop (mobile) ── */}
      {drawerOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar${drawerOpen ? ' drawer-open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '0 14px', marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="app-logo" style={{ fontSize: 22 }}>emitto</div>
            <p style={{ fontSize: 10, color: 'var(--muted-dark)', marginTop: 4, letterSpacing: '0.06em', fontWeight: 700 }}>
              BROADCAST ENGINE
            </p>
          </div>
          {/* Close button inside drawer on mobile */}
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'none',
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
            }}
            className="drawer-close-btn"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
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
                  {isDemo ? 'Read-only Access' : 'Pro Member'}
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

      {/* ── Mobile Dock ── */}
      <nav className="mobile-dock" aria-label="Mobile navigation">
        {DOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dock-item${isActive ? ' active' : ''}`}
              aria-label={item.label}
            >
              <div style={{ position: 'relative' }}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.label === 'Home' && unreadCount > 0 && (
                  <div style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--green)',
                    border: '1.5px solid #080808',
                  }} />
                )}
              </div>
              <span className="dock-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Inline style to show drawer close btn on mobile */}
      <style>{`
        @media (max-width: 1023px) {
          .drawer-close-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
