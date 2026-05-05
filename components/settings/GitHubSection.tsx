'use client';
import { useState, useEffect } from 'react';
import { Settings, saveSettings } from '@/lib/store';
import { useToast } from '@/components/ui/Toast';
import { Code, RefreshCw, ShieldCheck } from 'lucide-react';

interface GitHubSectionProps {
  settings: Settings;
  onRefresh: () => void;
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  url: string;
}

export default function GitHubSection({ settings, onRefresh }: GitHubSectionProps) {
  const { success, error: toastError } = useToast();
  const [token, setToken] = useState(settings.github_token || '');
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoadingRepos(true);
    setError(null);
    try {
      const res = await fetch('/api/github/repos', {
        headers: { Authorization: `Bearer ${settings.github_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch repos');
      setRepos(data.repos || data || []);
    } catch (err: any) {
      toastError(err.message || 'Node sync failed. Discovery offline.');
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    if (settings.github_token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRepos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.github_token]);

  const handleSaveToken = async () => {
    await saveSettings({ github_token: token });
    success('Identity link updated.');
    onRefresh();
  };

  const handleTrackRepo = async (repoFullName: string) => {
    setConnectingId(repoFullName);
    try {
      const res = await fetch('/api/github/setup-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoFullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to setup webhook');
      success(`Successfully tracking ${repoFullName}`);
      onRefresh();
    } catch (err: any) {
      toastError(err.message || 'Neural link failed.');
    } finally {
      setConnectingId(null);
    }
  };

  const isTracked = (repoFullName: string) => settings.tracked_repos?.includes(repoFullName);

  return (
    <div className="glass-card" style={{ padding: 32, border: '1px solid #1A1A1A' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Code size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--white)' }}>GitHub Intelligence</h3>
          <p style={{ fontSize: 13, color: '#444' }}>Turn every push into a social signal.</p>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <label className="section-title-premium">Access Credentials</label>
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="password"
            className="input-premium"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            style={{ fontFamily: 'Geist Mono', fontSize: 13 }}
          />
          <button className="btn-premium" onClick={handleSaveToken} style={{ height: 48, padding: '0 24px' }}>
            {settings.github_token ? 'Update' : 'Connect'}
          </button>
        </div>
        <p style={{ marginTop: 12, fontSize: 11, color: '#444', lineHeight: 1.5 }}>
          Folio uses a Personal Access Token to register webhooks on your behalf.
          <a href="https://github.com/settings/tokens" target="_blank" style={{ color: 'var(--green)', marginLeft: 4 }}>Generate one here</a> (select <b>repo</b> scope).
        </p>
      </div>

      {settings.github_token && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h4 className="section-title-premium" style={{ marginBottom: 0 }}>Discover Repositories</h4>
            <button onClick={fetchRepos} className="btn-ghost-premium" style={{ height: 32, padding: '0 12px', fontSize: 11 }}>
              <RefreshCw size={14} className={loadingRepos ? 'animate-spin' : ''} style={{ marginRight: 8 }} /> Refresh
            </button>
          </div>

          {error && <p style={{ color: '#FF4444', fontSize: 12, marginBottom: 16 }}>{error}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 8 }}>
            {loadingRepos ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)
            ) : repos.map(repo => (
              <div key={repo.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                <div>
                  <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>{repo.name}</h5>
                  <p style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{repo.full_name}</p>
                </div>

                {isTracked(repo.full_name) ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--green)', fontSize: 11, fontWeight: 800 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
                    TRACKING
                  </div>
                ) : (
                  <button
                    className="btn-ghost-premium"
                    onClick={() => handleTrackRepo(repo.full_name)}
                    disabled={connectingId === repo.full_name}
                    style={{ height: 32, padding: '0 12px', fontSize: 11, borderColor: '#1A1A1A' }}
                  >
                    {connectingId === repo.full_name ? 'Connecting...' : 'Track Commits'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, padding: 16, borderRadius: 12, background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)', display: 'flex', gap: 12 }}>
        <ShieldCheck size={20} className="text-green" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 11, color: 'var(--green)', lineHeight: 1.5, opacity: 0.8 }}>
          <b>Security Protocol:</b> Folio verifies every incoming signal using a unique HMAC SHA-256 secret. Your token is stored encrypted in your private studio vault.
        </p>
      </div>
    </div>
  );
}
