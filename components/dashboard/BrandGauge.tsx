'use client';

interface BrandGaugeProps {
  score: number;
  label: string;
}

export default function BrandGauge({ score, label }: BrandGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
      <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00ccff" />
          </linearGradient>
        </defs>
      </svg>
      
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'Geist Mono', letterSpacing: '-0.05em', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {score}
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted)', letterSpacing: '0.1em', marginTop: -4 }}>
          {label.toUpperCase()}
        </div>
      </div>

      <style>{`
        @keyframes pulse-gauge {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
