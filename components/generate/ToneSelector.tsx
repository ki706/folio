'use client';

type Tone = 'builder' | 'hustler' | 'hot_take';

interface ToneSelectorProps {
  selected: Tone;
  onSelect: (tone: Tone) => void;
}

const TONES: { id: Tone; emoji: string; label: string; desc: string }[] = [
  { id: 'builder',  emoji: '🔨', label: 'Builder',  desc: 'I shipped this. Here\'s what it does.' },
  { id: 'hustler',  emoji: '🔥', label: 'Hustler',  desc: 'Day X of building in public.' },
  { id: 'hot_take', emoji: '⚡', label: 'Hot Take', desc: 'Unpopular opinion. Make them think.' },
];

export default function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        {TONES.map((tone) => (
          <button
            key={tone.id}
            className={`tone-btn${selected === tone.id ? ' active' : ''}`}
            onClick={() => onSelect(tone.id)}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{tone.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: selected === tone.id ? 'var(--green)' : 'var(--white)' }}>
              {tone.label}
            </div>
          </button>
        ))}
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, textAlign: 'center', minHeight: 18 }}>
        {TONES.find((t) => t.id === selected)?.desc}
      </p>
    </div>
  );
}
