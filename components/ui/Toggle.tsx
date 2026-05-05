'use client';

interface ToggleProps {
  on: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export default function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`toggle-track${on ? ' on' : ''}`}
      title={label}
    >
      <div className="toggle-thumb" />
    </button>
  );
}
