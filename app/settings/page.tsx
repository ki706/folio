'use client';
import { useEffect, useState, useCallback } from 'react';
import { getSettings, saveSettings, Settings } from '@/lib/store';
import Toggle from '@/components/ui/Toggle';
import TagInput from '@/components/ui/TagInput';
import { Eye, EyeOff, ChevronDown, User, Zap, Code, Share2, Terminal } from 'lucide-react';
import GitHubSection from '@/components/settings/GitHubSection';

const GOAL_OPTIONS = [
  { value: 'hired',     label: 'Full-time Career' },
  { value: 'freelance', label: 'Freelance / Contract' },
  { value: 'both',      label: 'Both' },
];

const INACTIVITY_OPTIONS = [
  { value: 2, label: '2 days' },
  { value: 3, label: '3 days' },
  { value: 7, label: '1 week' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [writingSample, setWritingSample] = useState('');

  const load = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (patch: Partial<Settings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...patch });
  };

  const handleSave = useCallback(async () => {
    if (!settings) return;
    await saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [settings]);

  const addSample = () => {
    if (writingSample.trim() && settings) {
      set({ writing_samples: [...settings.writing_samples, writingSample.trim()] });
      setWritingSample('');
    }
  };

  const removeSample = (i: number) => {
    if (settings) {
      set({ writing_samples: settings.writing_samples.filter((_, idx) => idx !== i) });
    }
  };

  if (!settings) return null;

  const vaultText = `Name: ${settings.name}
Title: ${settings.title}
Experience: ${settings.years_exp} years
Location: ${settings.location}
Goal: ${settings.goal}
Stack: ${settings.stack.join(', ')}
LinkedIn: ${settings.linkedin_url || 'Not set'}
X/Twitter: ${settings.x_handle || 'Not set'}
GitHub: ${settings.github_url || 'Not set'}

Voice:
${settings.voice_description}

Writing Samples: ${settings.writing_samples.length} added`;

  const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <label className="section-title-premium" style={{ marginBottom: 8, display: 'block' }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>{hint}</p>}
      {children}
    </div>
  );

  const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="glass-card" style={{ marginBottom: 24, padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
          <Icon size={20} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  const ToggleRow = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 15, color: 'var(--white)', fontWeight: 500 }}>{label}</span>
      <Toggle on={value} onChange={onChange} label={label} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em' }}>Settings</h1>
          <p style={{ color: 'var(--muted)', marginTop: 4 }}>Configure your identity and AI parameters.</p>
        </div>
        <button
          className="btn-premium"
          onClick={handleSave}
          style={{ padding: '0 32px', height: 48 }}
        >
          {saved ? '✓ CHANGES SAVED' : 'COMMIT SETTINGS'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
        
        {/* Your Identity */}
        <Section title="Identity" icon={User}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <Field label="Full Name">
              <input className="input-premium" value={settings.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Kidus Ismail" />
            </Field>
            <Field label="Professional Title">
              <input className="input-premium" value={settings.title} onChange={(e) => set({ title: e.target.value })} placeholder="Full Stack Developer" />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <Field label="Years Experience">
              <input className="input-premium" value={settings.years_exp} onChange={(e) => set({ years_exp: e.target.value })} placeholder="5" />
            </Field>
            <Field label="Location">
              <input className="input-premium" value={settings.location} onChange={(e) => set({ location: e.target.value })} placeholder="Addis Ababa" />
            </Field>
          </div>
          <Field label="Primary Objective">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set({ goal: opt.value as Settings['goal'] })}
                  className={`btn-ghost-premium${settings.goal === opt.value ? ' active' : ''}`}
                  style={{ 
                    height: 48, fontSize: 13, fontWeight: 600,
                    borderColor: settings.goal === opt.value ? 'var(--green)' : 'var(--border)',
                    background: settings.goal === opt.value ? 'var(--green-dim)' : 'rgba(255,255,255,0.02)',
                    color: settings.goal === opt.value ? 'var(--green)' : 'var(--white)'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        <GitHubSection settings={settings} onRefresh={load} />

        {/* Your Voice */}
        <Section title="Voice Architecture" icon={Zap}>
          <Field label="Persona Description" hint="How should the AI represent you? Be direct and descriptive.">
            <textarea
              className="input-premium"
              rows={4}
              value={settings.voice_description}
              onChange={(e) => set({ voice_description: e.target.value })}
              placeholder="Direct. Confident. Builder mindset..."
              style={{ resize: 'none' }}
            />
          </Field>
          <Field label="Writing Samples" hint="The AI uses these to replicate your natural syntax.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {settings.writing_samples.map((sample, i) => (
                <div key={i} className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, paddingRight: 32 }}>
                    "{sample.slice(0, 150)}{sample.length > 150 ? '...' : ''}"
                  </p>
                  <button onClick={() => removeSample(i)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-dark)' }}>
                    <EyeOff size={14} />
                  </button>
                </div>
              ))}
              <textarea
                className="input-premium"
                rows={3}
                value={writingSample}
                onChange={(e) => setWritingSample(e.target.value)}
                placeholder="Paste a representative post here..."
              />
              <button className="btn-ghost-premium" onClick={addSample} style={{ alignSelf: 'flex-start', height: 40, padding: '0 20px', fontSize: 12 }}>
                + Register Sample
              </button>
            </div>
          </Field>
        </Section>

        {/* Your Stack */}
        <Section title="Technology Stack" icon={Code}>
          <Field label="Core Competencies">
            <TagInput tags={settings.stack} onChange={(stack) => set({ stack })} placeholder="Next.js, TypeScript..." />
          </Field>
        </Section>

        {/* Social Profiles */}
        <Section title="Network Integration" icon={Share2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <Field label="LinkedIn URL">
              <input className="input-premium" value={settings.linkedin_url} onChange={(e) => set({ linkedin_url: e.target.value })} placeholder="linkedin.com/in/..." />
            </Field>
            <Field label="X Handle">
              <input className="input-premium" value={settings.x_handle} onChange={(e) => set({ x_handle: e.target.value })} placeholder="@yourhandle" />
            </Field>
            <Field label="GitHub URL">
              <input className="input-premium" value={settings.github_url} onChange={(e) => set({ github_url: e.target.value })} placeholder="github.com/..." />
            </Field>
          </div>
        </Section>

        {/* Proactive AI */}
        <Section title="Proactive Parameters" icon={Zap}>
          <ToggleRow label="Inactivity Monitoring" value={settings.proactive_inactivity} onChange={(v) => set({ proactive_inactivity: v })} />
          <div style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, color: settings.proactive_inactivity ? 'var(--white)' : 'var(--muted-dark)', fontWeight: 500 }}>Alert Threshold</span>
            <div style={{ position: 'relative' }}>
              <select
                value={settings.inactivity_days}
                onChange={(e) => set({ inactivity_days: Number(e.target.value) })}
                disabled={!settings.proactive_inactivity}
                className="input-premium"
                style={{ padding: '8px 36px 8px 16px', width: 'auto', fontSize: 14 }}
              >
                {INACTIVITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }} />
            </div>
          </div>
          <ToggleRow label="Trending Intelligence" value={settings.proactive_trending} onChange={(v) => set({ proactive_trending: v })} />
          <ToggleRow label="Auto-Drafting (New Projects)" value={settings.proactive_new_project} onChange={(v) => set({ proactive_new_project: v })} />
        </Section>

        {/* Context Vault */}
        <Section title="Intelligence Vault" icon={Terminal}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Immutable record of your synthesized identity.</p>
              <button
                onClick={() => setShowVault((v) => !v)}
                className="btn-ghost-premium"
                style={{ height: 32, padding: '0 12px', fontSize: 11 }}
              >
                {showVault ? 'HIDE VAULT' : 'OPEN VAULT'}
              </button>
            </div>
            {showVault && (
              <textarea
                readOnly
                value={vaultText}
                rows={12}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'var(--green)',
                  fontSize: 12,
                  fontFamily: 'Geist Mono',
                  padding: '20px',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.6,
                }}
              />
            )}
          </div>
        </Section>

      </div>

      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <button className="btn-premium" onClick={handleSave} style={{ minWidth: 240, height: 56, fontSize: 16 }}>
          {saved ? '✓ ALL CHANGES COMMITTED' : 'COMMIT ALL SETTINGS'}
        </button>
      </div>
    </div>
  );
}
