'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Briefcase, Sparkles, Clock, Settings, LogOut, TrendingUp, Radio } from 'lucide-react';
import { getNotifications, getSettings, Settings as UserSettings } from '@/lib/store';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { label: 'Home',     icon: Home,      href: '/' },
  { label: 'Projects', icon: Briefcase, href: '/projects' },
  { label: 'Generate', icon: Sparkles,  href: '/generate' },
  { label: 'Trends',   icon: Radio,     href: '/trends' },
  { label: 'Analytics',icon: TrendingUp,href: '/analytics' },
  { label: 'History',  icon: Clock,     href: '/history' },
  { label: 'Settings', icon: Settings,  href: '/settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
      
      const [notifs, settings] = await Promise.all([getNotifications(), getSettings()]);
      setUnreadCount(notifs.filter(n => !n.is_read).length);
      setUserSettings(settings);

      if (settings && settings.onboarding_completed === false && pathname !== '/onboarding') {
         router.push('/onboarding');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [pathname, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const initials = userSettings?.name
    ? userSettings.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (pathname === '/login' || pathname === '/onboarding') return <>{children}</>;

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '0 16px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="app-logo" style={{ fontSize: 24 }}>folio</div>
            <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, letterSpacing: '0.05em', fontWeight: 600 }}>
              PORTFOLIO ENGINE
            </p>
          </div>
        </div>

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
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
                {item.label === 'Home' && unreadCount > 0 && (
                  <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green-glow)' }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
               <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: 13 }}>
                 {initials}
               </div>
               <div style={{ minWidth: 0 }}>
                 <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                   {userEmail === 'demo@folio.dev' ? 'Demo Studio' : (userSettings?.name || userEmail || 'Studio User')}
                 </p>
                 <p style={{ fontSize: 11, color: 'var(--muted)' }}>{userEmail === 'demo@folio.dev' ? 'Read-only Access' : 'Pro Member'}</p>
               </div>
             </div>
             <button 
               onClick={handleSignOut}
               className="btn-ghost-premium" 
               style={{ width: '100%', height: 36, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--muted)' }}
             >
               <LogOut size={14} /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Dock */}
      <nav className="mobile-dock">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dock-item${isActive ? ' active' : ''}`}
            >
              <div className="dock-icon-wrapper" style={{ position: 'relative' }}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.label === 'Home' && unreadCount > 0 && (
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', border: '2px solid #0D0D0D' }} />
                )}
              </div>
            </Link>
          );
        })}
        <Link href="/settings" className={`dock-item${pathname === '/settings' ? ' active' : ''}`}>
           <div className="dock-icon-wrapper">
             <div style={{ width: 24, height: 24, borderRadius: 6, background: pathname === '/settings' ? 'var(--green)' : 'var(--muted-dark)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
               {initials}
             </div>
           </div>
        </Link>
      </nav>
    </div>
  );
}
