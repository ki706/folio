'use client';

interface ActivityGridProps {
  days: boolean[];
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function ActivityGrid({ days }: ActivityGridProps) {
  // days is 7 booleans, index 0 = 6 days ago, index 6 = today
  const today = new Date();
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
        {dayLabels.map((label, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              color: 'var(--muted)',
              fontFamily: 'Geist Mono, monospace',
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {days.map((posted, i) => (
          <div
            key={i}
            className={`activity-day${posted ? ' posted' : ''}`}
            style={{ flex: 1, height: 32 }}
            title={posted ? 'Posted' : 'No post'}
          />
        ))}
      </div>
    </div>
  );
}
