'use client';
import { Notification, dismissNotification, markNotificationRead } from '@/lib/store';
import { Zap, Rocket, Flame, Trophy, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ICONS: Record<string, React.ReactNode> = {
  inactivity: <Zap size={16} />,
  trending: <Flame size={16} />,
  new_project: <Rocket size={16} />,
  streak: <Trophy size={16} />,
};

const BORDER_COLORS: Record<string, string> = {
  inactivity: 'rgba(0, 255, 136, 0.4)',
  trending: 'rgba(245, 158, 11, 0.4)',
  new_project: 'rgba(139, 92, 246, 0.4)',
  streak: 'rgba(0, 255, 136, 0.4)',
};

const ICON_COLORS: Record<string, string> = {
  inactivity: 'var(--green)',
  trending: 'var(--amber)',
  new_project: 'var(--purple)',
  streak: 'var(--green)',
};

interface NotificationCardProps {
  notification: Notification;
  onDismiss: () => void;
}

export default function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const router = useRouter();

  const handleCta = async () => {
    await markNotificationRead(notification.id);
    if (notification.cta_action === '/generate') {
      router.push('/generate');
    } else if (notification.cta_action?.startsWith('/')) {
      router.push(notification.cta_action);
    }
    onDismiss();
  };

  const handleDismiss = async () => {
    await dismissNotification(notification.id);
    onDismiss();
  };

  return (
    <div
      className="glass-card stagger-item"
      style={{ padding: '16px 20px', borderColor: BORDER_COLORS[notification.type], position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ 
          width: 32, height: 32, borderRadius: 10, 
          background: 'rgba(255,255,255,0.03)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: ICON_COLORS[notification.type],
          flexShrink: 0,
          marginTop: 2
        }}>
          {ICONS[notification.type]}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', marginBottom: 4 }}>
            {notification.message.split('\n')[0]}
          </p>
          {notification.message.includes('\n') && (
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>
              {notification.message.split('\n').slice(1).join('\n')}
            </p>
          )}

          {notification.type === 'streak' && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
              <span className="text-gradient" style={{ fontSize: 36, fontWeight: 700, fontFamily: 'Geist Mono' }}>
                {notification.metadata?.streak ?? '🔥'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Day Streak</span>
            </div>
          )}

          {notification.type === 'trending' && !!notification.metadata?.source && (
            <div style={{ marginBottom: 14 }}>
              <span className="pill pill-default">via {String(notification.metadata.source)}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-premium" style={{ height: 36, padding: '0 16px', fontSize: 13 }} onClick={handleCta}>
              {notification.cta_label}
            </button>
            {(notification.type === 'new_project' || notification.type === 'trending') && (
              <button className="btn-ghost-premium" style={{ height: 36, padding: '0 16px', fontSize: 13 }} onClick={handleDismiss}>
                Dismiss
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={handleDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-dark)', padding: 4 }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
